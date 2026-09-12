"""Kit waitlist endpoint (Feb 2026).

Captures buyer intent for unreleased Citation-Proof Kits (Incident-to-Correction,
New Hire Orientation) while their deliverables are being finished. Slug is
validated against the same UNAVAILABLE_KIT_SLUGS set the checkout endpoints
use, so waitlist submissions cannot be used to enumerate released slugs.

Emits Resend notifications to Vince and a confirmation to the prospect on a
best-effort basis. Persists to gl_kit_waitlist with a unique per-(email, slug)
index so accidental double-submits do not spam anyone.
"""

from datetime import datetime, timezone
import html
import logging
import uuid

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr
import resend

from config import db, SENDER_EMAIL, VINCE_EMAIL
from lib.html_safe import esc, esc_default
from routes.citation_proof_kits import UNAVAILABLE_KIT_SLUGS

router = APIRouter()
logger = logging.getLogger("gigline")

_INDEX_INITIALIZED = False


async def _ensure_index() -> None:
    global _INDEX_INITIALIZED
    if _INDEX_INITIALIZED:
        return
    try:
        await db.gl_kit_waitlist.create_index(
            [("email", 1), ("kit_slug", 1)], unique=True
        )
        _INDEX_INITIALIZED = True
    except Exception as e:
        logger.warning(f"gl_kit_waitlist index init failed (will retry): {e}")


# ── Kit slug -> human name lookup for email copy ──
_KIT_NAMES = {
    "incident-to-correction-kit": "Incident-to-Correction Kit",
    "new-hire-orientation-kit": "New Hire Safety Orientation Kit",
}


class WaitlistRequest(BaseModel):
    kit_slug: str
    email: EmailStr
    company_name: str = ""
    contact_name: str = ""
    website: str = ""  # honeypot


@router.post("/kit-waitlist")
async def submit_kit_waitlist(payload: WaitlistRequest, request: Request):
    """Capture waitlist intent for an unreleased kit."""
    # Honeypot silent-drop
    if (payload.website or "").strip():
        logger.info("kit-waitlist honeypot triggered")
        return {"ok": True, "id": "hp"}

    slug = payload.kit_slug.strip()
    if slug not in UNAVAILABLE_KIT_SLUGS:
        # Waitlist is only for unreleased kits; released kits have a checkout.
        raise HTTPException(status_code=400, detail="Waitlist is not available for this kit.")

    email = payload.email.strip().lower()
    company = (payload.company_name or "").strip()[:200]
    contact = (payload.contact_name or "").strip()[:200]

    await _ensure_index()

    doc = {
        "id": str(uuid.uuid4()),
        "kit_slug": slug,
        "kit_name": _KIT_NAMES.get(slug, slug),
        "email": email,
        "company_name": company,
        "contact_name": contact,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source_ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent", "")[:400],
        "status": "new",
    }

    try:
        await db.gl_kit_waitlist.insert_one(doc)
        already = False
    except Exception as e:
        # DuplicateKeyError on (email, slug) — surface as idempotent success.
        if "duplicate" in str(e).lower() or "E11000" in str(e):
            already = True
        else:
            logger.error(f"kit-waitlist insert failed: {e}")
            raise HTTPException(status_code=500, detail="Could not save your request.")

    kit_name = _KIT_NAMES.get(slug, slug)

    # Vince notification, best-effort
    try:
        resend.Emails.send({
            "from": f"GigLine Waitlist <{SENDER_EMAIL}>",
            "to": [VINCE_EMAIL],
            "reply_to": email,
            "subject": f"Waitlist · {kit_name} · {esc(company or contact or email)}",
            "html": (
                f"<h2 style='margin:0 0 8px;'>Waitlist request &mdash; {esc(kit_name)}</h2>"
                f"<p style='margin:0 0 16px;color:#555;font-size:12px;'>ID: {esc(doc['id'])}"
                f"{' (duplicate submission)' if already else ''}</p>"
                "<table cellpadding='6' style='border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;'>"
                f"<tr><td><b>Email</b></td><td>{esc(email)}</td></tr>"
                f"<tr><td><b>Contact</b></td><td>{esc_default(contact)}</td></tr>"
                f"<tr><td><b>Company</b></td><td>{esc_default(company)}</td></tr>"
                f"<tr><td><b>Kit</b></td><td>{esc(kit_name)} ({esc(slug)})</td></tr>"
                "</table>"
                "<p style='margin-top:22px;font-size:12px;color:#666;'>"
                "Notify this person when the kit ships. No checkout is available yet."
                "</p>"
            ),
        })
    except Exception as e:
        logger.error(f"kit-waitlist Vince notify failed (id={doc['id']}): {e}")

    # Prospect confirmation, best-effort. Skip if duplicate to avoid spam.
    if not already:
        try:
            resend.Emails.send({
                "from": f"Vince Lawrence <{SENDER_EMAIL}>",
                "to": [email],
                "reply_to": VINCE_EMAIL,
                "subject": f"You're on the list for the {kit_name}",
                "html": (
                    "<div style='font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#1c2b2b;max-width:560px;'>"
                    f"<p>{esc_default(contact, 'Hello')},</p>"
                    f"<p>Thanks for the waitlist request. You're on the list for the <strong>{esc(kit_name)}</strong>.</p>"
                    "<p>GigLine does not collect payment for a kit until the deliverables are complete "
                    "and the automated fulfillment path has been tested end to end. As soon as this kit is "
                    "released, I'll email you first, before it goes on the public page.</p>"
                    "<p>If you have questions in the meantime, just reply to this email.</p>"
                    "<p style='margin-top:22px;color:#666;font-size:13px;'>&mdash; Vince Lawrence, GigLine Safety &amp; Compliance</p>"
                    "</div>"
                ),
            })
        except Exception as e:
            logger.error(f"kit-waitlist prospect confirmation failed (id={doc['id']}): {e}")

    return {"ok": True, "already": already, "id": doc["id"]}


@router.get("/admin/kit-waitlist")
async def list_kit_waitlist(request: Request):
    """Admin dashboard, list waitlist submissions."""
    from lib.admin_auth import require_admin
    await require_admin(request)
    docs = await db.gl_kit_waitlist.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"waitlist": docs, "count": len(docs)}
