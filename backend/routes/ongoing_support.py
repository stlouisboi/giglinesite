"""Ongoing Safety Support fit-call intake.

POST /api/ongoing-support/fit-call
    Lightweight qualification form for the /ongoing-safety-support page.
    Stores in `gl_ongoing_support_fit_calls`, notifies Vince, sends a
    confirmation email to the requester. Tags every lead with:
        source = "ongoing-support"
        offer  = "ongoing-safety-support"
        intent = "fit-call"
"""

from __future__ import annotations

import asyncio
import logging
import re
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import resend
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field, field_validator

from config import SENDER_EMAIL, VINCE_EMAIL, db

router = APIRouter()
logger = logging.getLogger("gigline")

# ── Rate limiting (per IP, sliding window) ─────────────────────────────
_RATE_WINDOW_SEC = 3600           # 1 hour
_RATE_MAX_SUBMISSIONS = 5         # per IP per hour
_ip_hits: dict[str, list[datetime]] = {}


def _client_ip(req: Request) -> str:
    """Prefer X-Forwarded-For chain first entry, fall back to client host."""
    xff = req.headers.get("x-forwarded-for", "")
    if xff:
        return xff.split(",")[0].strip()
    return (req.client.host if req.client else "unknown") or "unknown"


def _check_rate_limit(ip: str) -> None:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(seconds=_RATE_WINDOW_SEC)
    hits = [t for t in _ip_hits.get(ip, []) if t > cutoff]
    if len(hits) >= _RATE_MAX_SUBMISSIONS:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions from this network. Please try again in an hour or call (336) 329-8899.",
        )
    hits.append(now)
    _ip_hits[ip] = hits


# ── Payload ────────────────────────────────────────────────────────────
class FitCallPayload(BaseModel):
    # Section 1 — Company & contact
    company: str = Field(..., min_length=2, max_length=140)
    contactName: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=32)

    # Section 2 — Facility profile
    location: str = Field(..., min_length=2, max_length=140)         # City, State
    industry: str = Field(..., min_length=2, max_length=80)
    employeeCount: str = Field(..., min_length=1, max_length=20)      # bucket key
    shifts: str = Field(..., min_length=1, max_length=20)             # "1", "2", "3", "12hr", "other"
    locationsCount: str = Field(..., min_length=1, max_length=20)     # "1", "2-3", "4+"
    majorOperations: str = Field("", max_length=1200)

    # Section 3 — Context
    recentIncidents: str = Field("", max_length=1500)
    currentSafetyOwner: str = Field("", max_length=240)
    supportNeeded: str = Field(..., min_length=5, max_length=2000)

    # Section 4 — Contact preference & consent
    preferredContactMethod: str = Field(..., min_length=1, max_length=20)  # phone | text | email
    consentContact: bool
    consentPrivacy: bool

    # Anti-spam honeypot: bots often fill hidden inputs. Real users leave blank.
    website: Optional[str] = ""       # honeypot, MUST be empty
    formStartedAt: Optional[str] = None   # ISO client-side "form displayed" ts

    @field_validator("phone")
    @classmethod
    def _validate_phone(cls, v: str) -> str:
        # Keep digits + a handful of allowed separators.
        digits = re.sub(r"[^\d]", "", v or "")
        if len(digits) < 7:
            raise ValueError("Phone number looks incomplete.")
        return v.strip()


# ── Human-readable label maps for email rendering ──────────────────────
EMP_LABELS = {
    "under_10": "Under 10",
    "10_25": "10–25",
    "26_50": "26–50",
    "51_100": "51–100",
    "100_plus": "100+",
}
SHIFT_LABELS = {
    "1": "1 shift",
    "2": "2 shifts",
    "3": "3 shifts",
    "12hr": "12-hour rotations",
    "other": "Other / seasonal",
}
LOC_LABELS = {"1": "One location", "2-3": "2 to 3 locations", "4+": "4 or more locations"}
CONTACT_LABELS = {"phone": "Phone call", "text": "Text message", "email": "Email"}


def _L(d: dict, k: str) -> str:
    return d.get(k, k) if k else "—"


# ── Handler ────────────────────────────────────────────────────────────
@router.post("/ongoing-support/fit-call")
async def submit_fit_call(payload: FitCallPayload, request: Request):
    # 1. Honeypot: bot triggered, silently return success.
    if (payload.website or "").strip():
        logger.info("ongoing-support fit-call: honeypot triggered, dropping submission")
        return {"status": "success", "id": "0"}

    # 2. Consents required.
    if not payload.consentContact or not payload.consentPrivacy:
        raise HTTPException(status_code=400, detail="Both acknowledgments are required.")

    # 3. Rate limit per IP.
    ip = _client_ip(request)
    _check_rate_limit(ip)

    # 4. Minimum time-to-submit (basic bot filter) — 4 seconds.
    if payload.formStartedAt:
        try:
            started = datetime.fromisoformat(payload.formStartedAt.replace("Z", "+00:00"))
            if (datetime.now(timezone.utc) - started).total_seconds() < 4:
                logger.info("ongoing-support fit-call: too-fast submission, dropping")
                return {"status": "success", "id": "0"}
        except (ValueError, TypeError):
            pass

    submission_id = str(uuid.uuid4())
    token = secrets.token_urlsafe(9)
    now = datetime.now(timezone.utc)

    doc = {
        "id": submission_id,
        "token": token,
        "createdAt": now.isoformat(),
        "ip": ip,
        "userAgent": request.headers.get("user-agent", "")[:400],
        # Lead segmentation tags per build spec.
        "source": "ongoing-support",
        "offer": "ongoing-safety-support",
        "intent": "fit-call",
        **payload.model_dump(exclude={"website", "formStartedAt"}),
    }
    await db.gl_ongoing_support_fit_calls.insert_one(doc)

    # 5. MailerLite tagging (fire-and-forget so it never blocks the response).
    try:
        from integrations.mailerlite import add_to_intake_lane

        asyncio.create_task(
            add_to_intake_lane(
                email=payload.email,
                lane="ongoing_support",
                priority_flags=None,
                name=payload.contactName or "",
                company=payload.company or "",
                attribution=None,
            )
        )
    except Exception as e:
        logger.warning(f"ongoing-support MailerLite tagging skipped: {e}")

    # 6. Vince notification email — monospaced, easy to skim.
    def pad(label: str) -> str:
        return label.ljust(26)

    plain = f"""\
NEW ONGOING SAFETY SUPPORT — FIT CALL REQUEST
═══════════════════════════════════════════════════════
Submitted: {now.strftime('%B %d, %Y at %I:%M %p UTC')}

───────────────────────────────────────────────────────
COMPANY & CONTACT
───────────────────────────────────────────────────────
{pad('Company:')}{payload.company}
{pad('Contact:')}{payload.contactName}
{pad('Email:')}{payload.email}
{pad('Phone:')}{payload.phone}
{pad('Preferred contact:')}{_L(CONTACT_LABELS, payload.preferredContactMethod)}

───────────────────────────────────────────────────────
FACILITY PROFILE
───────────────────────────────────────────────────────
{pad('Location:')}{payload.location}
{pad('Industry:')}{payload.industry}
{pad('Employees:')}{_L(EMP_LABELS, payload.employeeCount)}
{pad('Shifts:')}{_L(SHIFT_LABELS, payload.shifts)}
{pad('Locations:')}{_L(LOC_LABELS, payload.locationsCount)}
{pad('Major operations:')}{payload.majorOperations or '—'}

───────────────────────────────────────────────────────
CONTEXT
───────────────────────────────────────────────────────
{pad('Recent incidents/audits:')}{payload.recentIncidents or '—'}
{pad('Current safety owner:')}{payload.currentSafetyOwner or '—'}
{pad('Support needed:')}{payload.supportNeeded}

───────────────────────────────────────────────────────
LEAD TAGS
───────────────────────────────────────────────────────
{pad('source:')}ongoing-support
{pad('offer:')}ongoing-safety-support
{pad('intent:')}fit-call
{pad('submission id:')}{submission_id}
{pad('client ip:')}{ip}
"""
    vince_subject = f"[Ongoing Support] Fit call — {payload.company}"
    vince_html = (
        f"<pre style=\"font-family:'JetBrains Mono','Courier New',monospace;"
        f"font-size:12.5px;line-height:1.5;color:#1C2B2B;white-space:pre-wrap;"
        f"margin:0;padding:18px;\">{plain}</pre>"
    )
    try:
        resend.Emails.send({
            "from": f"GigLine Ongoing Support <{SENDER_EMAIL}>",
            "to": [VINCE_EMAIL],
            "reply_to": payload.email,
            "subject": vince_subject,
            "html": vince_html,
            "text": plain,
        })
    except Exception as e:
        logger.error(f"Ongoing-support Vince email error: {e}")

    # 7. Client confirmation email (explicit "no consulting relationship yet" language).
    first_name = (payload.contactName or "").split(" ")[0] or "there"
    client_html = f"""
<div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1C2B2B;line-height:1.6;padding:0 18px;">
  <p style="font-size:15px;">Hi {first_name},</p>
  <p style="font-size:15px;">Thanks for requesting a fit call for GigLine Ongoing Safety Support. Vince will review what you shared and follow up within 1 business day using your preferred contact method.</p>
  <p style="font-size:15px;">The fit call is a short conversation to determine whether ongoing support is the right structure for your operation, or whether a different GigLine service makes more sense.</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 22px;">
    <tr>
      <td style="border-left:3px solid #C9A84C;padding:6px 0 6px 14px;">
        <p style="font-size:14px;font-weight:bold;color:#0A1628;margin:0 0 6px;font-family:Arial,sans-serif;">
          This request does not create a consulting relationship.
        </p>
        <p style="font-size:14px;font-style:italic;color:#4A5A6A;margin:0;line-height:1.55;">
          A consulting engagement begins only when scope and terms are agreed in writing and an initial Compliance Readiness Visit has been scheduled or an approved onboarding assessment has been accepted.
        </p>
      </td>
    </tr>
  </table>
  <p style="font-size:15px;"><strong>What happens next:</strong></p>
  <ol style="font-size:15px;padding-left:22px;margin:8px 0 18px;">
    <li style="margin-bottom:4px;">Vince reviews your submission.</li>
    <li style="margin-bottom:4px;">You get a short call or reply within 1 business day.</li>
    <li style="margin-bottom:4px;">If ongoing support fits, GigLine proposes an initial Compliance Readiness Visit.</li>
    <li style="margin-bottom:4px;">If a different service fits better, Vince will tell you plainly.</li>
  </ol>
  <p style="font-size:15px;">Questions before then? Call or text <a href="tel:+13363298899" style="color:#0A1628;font-weight:bold;text-decoration:none;">(336) 329-8899</a>.</p>
  <p style="font-size:15px;margin-top:18px;">
    — Vince Lawrence<br />
    GigLine Safety &amp; Compliance<br />
    <span style="color:#777;font-size:13px;">(336) 329-8899 · giglinecompliance.com</span>
  </p>
</div>"""
    try:
        resend.Emails.send({
            "from": f"Vince Lawrence <{SENDER_EMAIL}>",
            "to": [payload.email],
            "subject": "GigLine received your Ongoing Support request",
            "html": client_html,
            "reply_to": VINCE_EMAIL,
        })
    except Exception as e:
        logger.error(f"Ongoing-support client email error: {e}")

    return {"status": "success", "id": submission_id}
