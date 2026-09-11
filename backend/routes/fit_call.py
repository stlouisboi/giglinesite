"""Safety Control System Buildout — Fit Call qualification form.

Backend endpoint for the /services/osha-ready-control-system/request form.
Follows existing intake.py conventions: BaseModel with default-empty fields,
Mongo persistence via `db.gl_*`, Resend for Vince notification + prospect
confirmation, honeypot spam guard.
"""

from datetime import datetime, timezone
from typing import List, Optional
import logging
import uuid

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr
import resend

from config import db, SENDER_EMAIL, VINCE_EMAIL
from lib.html_safe import esc, esc_default, esc_join

router = APIRouter()
logger = logging.getLogger("gigline")

BOUNDARY_LANGUAGE = (
    "GigLine provides documentation, system-design, and implementation support "
    "based on client-supplied and observed information. The employer remains "
    "responsible for workplace conditions, employee training, hazard correction, "
    "program implementation, regulatory compliance, and maintaining accurate and "
    "current records. GigLine services are not OSHA approval and do not guarantee "
    "that citations will not occur."
)


# ── Schema (13 real fields + 1 honeypot; shared with the frontend) ──
class FitCallRequest(BaseModel):
    # Contact (2)
    contactName: str = ""
    email: str = ""
    # Company (3)
    companyName: str = ""
    industry: str = ""
    locationCityState: str = ""       # "Kernersville, NC"
    # Scale (2)
    employeeCount: str = ""           # under_25 | 25_50 | 51_100 | 101_250 | 250_plus
    facilityCount: str = ""           # 1 | 2_3 | 4_plus
    # Current systems (3)
    storagePlatform: str = ""         # google_drive | sharepoint | onedrive | dropbox | other | none
    existingPrograms: List[str] = []  # multi-select: loto, hazcom, ppe, emergency, confined_space, respiratory, none, other
    sdsCount: str = ""                # under_25 | 25_100 | 100_500 | 500_plus | not_sure
    # Problem + timing (3)
    primaryProblem: str = ""          # free-text, required, 1000 char max
    desiredCompletion: str = ""       # month/year string or "flexible"
    onsiteReviewNeeded: str = ""      # yes | no | not_sure

    # Spam honeypot — must stay empty. Real users never see this field.
    website: str = ""

    # Attribution (optional, populated by frontend from GA/utm)
    attribution: Optional[dict] = None


REQUIRED_FIELDS = [
    ("contactName", "Contact name"),
    ("email", "Email"),
    ("companyName", "Company name"),
    ("locationCityState", "Location"),
    ("employeeCount", "Employee count"),
    ("primaryProblem", "Primary documentation problem"),
]


def _label(value: str, default: str = "—") -> str:
    return (value or "").strip() or default


def _render_notification_html(data: FitCallRequest, request_id: str) -> str:
    programs_html = esc_join(data.existingPrograms, sep=", ", default="&mdash;")
    lines = [
        f"<h2 style='margin:0 0 8px 0;'>Safety Control System Buildout &mdash; Fit Call Request</h2>",
        f"<p style='color:#555;font-size:12px;margin:0 0 20px;'>Request ID: {esc(request_id)}</p>",
        "<table cellpadding='6' style='border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;'>",
        f"<tr><td><b>Contact</b></td><td>{esc_default(data.contactName)} &lt;{esc_default(data.email)}&gt;</td></tr>",
        f"<tr><td><b>Company</b></td><td>{esc_default(data.companyName)}</td></tr>",
        f"<tr><td><b>Industry</b></td><td>{esc_default(data.industry)}</td></tr>",
        f"<tr><td><b>Location</b></td><td>{esc_default(data.locationCityState)}</td></tr>",
        f"<tr><td><b>Employees</b></td><td>{esc_default(data.employeeCount)}</td></tr>",
        f"<tr><td><b>Facilities</b></td><td>{esc_default(data.facilityCount)}</td></tr>",
        f"<tr><td><b>Storage Platform</b></td><td>{esc_default(data.storagePlatform)}</td></tr>",
        f"<tr><td><b>Existing Programs</b></td><td>{programs_html}</td></tr>",
        f"<tr><td><b>SDS Count</b></td><td>{esc_default(data.sdsCount)}</td></tr>",
        f"<tr><td><b>Desired Completion</b></td><td>{esc_default(data.desiredCompletion)}</td></tr>",
        f"<tr><td><b>On-site Review</b></td><td>{esc_default(data.onsiteReviewNeeded)}</td></tr>",
        "</table>",
        "<h3 style='margin:22px 0 6px;'>Primary problem</h3>",
        f"<p style='font-family:Arial,sans-serif;font-size:14px;line-height:1.55;color:#222;white-space:pre-wrap;'>{esc_default(data.primaryProblem)}</p>",
    ]
    return "".join(lines)


def _render_prospect_confirmation_html(data: FitCallRequest) -> str:
    greeting = esc_default(data.contactName, default="Hello")
    return f"""
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#1c2b2b;max-width:560px;">
      <p>{greeting},</p>
      <p>Thanks for the request. Vince will review your Fit Call inputs and reach out within one business day to schedule a short call.</p>
      <p>The Fit Call determines whether the Safety Control System Buildout is the right shape for your operation, and what the fixed scope and price look like once the work is defined.</p>
      <p style="margin:22px 0 8px;font-size:13px;color:#555;"><b>What you submitted</b></p>
      <ul style="font-size:13px;color:#333;margin:0 0 22px;padding-left:18px;">
        <li>Company: {esc_default(data.companyName)}</li>
        <li>Location: {esc_default(data.locationCityState)}</li>
        <li>Employees: {esc_default(data.employeeCount)}</li>
        <li>Storage platform: {esc_default(data.storagePlatform)}</li>
      </ul>
      <p style="font-size:12px;color:#666;line-height:1.5;border-top:1px solid #eee;padding-top:14px;">{BOUNDARY_LANGUAGE}</p>
      <p style="font-size:13px;color:#666;">&mdash; Vince Lawrence, GigLine Safety &amp; Compliance</p>
    </div>
    """


@router.post("/fit-call-request")
async def submit_fit_call_request(data: FitCallRequest, request: Request):
    """Persist a Fit Call qualification submission and notify Vince + the prospect."""
    # Honeypot: real users never see the `website` input. Bots fill it. Silent-drop.
    if (data.website or "").strip():
        logger.info("Fit Call submission dropped (honeypot filled)")
        return {"ok": True, "id": "hp"}   # opaque success to avoid tipping bots

    # Required-field validation (Pydantic already ensures shape; we enforce non-empty).
    missing = [label for key, label in REQUIRED_FIELDS if not (getattr(data, key) or "").strip()]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required fields: {', '.join(missing)}")

    # Length guard on the free-text so we don't take a novel.
    if len(data.primaryProblem) > 1000:
        raise HTTPException(status_code=400, detail="Primary problem must be under 1000 characters")

    # Basic email sanity — Pydantic v2 doesn't force EmailStr on `str`, so light manual check.
    if "@" not in data.email or "." not in data.email.rsplit("@", 1)[-1]:
        raise HTTPException(status_code=400, detail="Valid email is required")

    request_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": request_id,
        "submittedAt": now,
        "status": "new",
        "source_ip": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent", "")[:400],
        **data.model_dump(exclude={"website"}),
    }
    await db.gl_fit_call_requests.insert_one(doc)
    logger.info(f"Fit Call request stored id={request_id} company={_label(data.companyName)}")

    # Vince notification (best effort — never fail the submission on email trouble)
    try:
        resend.Emails.send({
            "from": f"GigLine Fit Call <{SENDER_EMAIL}>",
            "to": [VINCE_EMAIL],
            "reply_to": data.email or VINCE_EMAIL,
            "subject": f"Fit Call · {_label(data.companyName)} · {_label(data.locationCityState)}",
            "html": _render_notification_html(data, request_id),
        })
    except Exception as e:
        logger.error(f"Fit Call notify email failed (id={request_id}): {e}")

    # Prospect confirmation (best effort)
    try:
        resend.Emails.send({
            "from": f"Vince Lawrence <{SENDER_EMAIL}>",
            "to": [data.email],
            "reply_to": VINCE_EMAIL,
            "subject": "Your Safety Control System Buildout Fit Call request",
            "html": _render_prospect_confirmation_html(data),
        })
    except Exception as e:
        logger.error(f"Fit Call prospect confirmation failed (id={request_id}): {e}")

    return {"ok": True, "id": request_id}
