"""GL-WEB-011 — Walkthrough QR Landing Page submission endpoint."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
import uuid
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL

router = APIRouter()
logger = logging.getLogger("gigline")


class WalkthroughLandingSubmission(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    company: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=7, max_length=40)
    email: EmailStr
    city: str = Field(..., min_length=2, max_length=200)
    operation_type: str = Field(..., max_length=100)
    best_time: str = Field(..., max_length=80)
    specifics: Optional[str] = Field(default="", max_length=300)
    # Honeypot — if filled, the submission is dropped silently.
    website: Optional[str] = Field(default="")


@router.post("/walkthrough-landing/submit")
async def submit_walkthrough_landing(payload: WalkthroughLandingSubmission):
    """GL-WEB-011 Acceptance Criteria #6, #7, #8."""
    # ── Honeypot spam protection ───────────────────────
    if payload.website:
        # Silent drop — return success so bots can't differentiate.
        return {"status": "ok"}

    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "company": payload.company.strip(),
        "phone": payload.phone.strip(),
        "email": payload.email.strip().lower(),
        "city": payload.city.strip(),
        "operation_type": payload.operation_type,
        "best_time": payload.best_time,
        "specifics": (payload.specifics or "").strip(),
        "service": "Safety Walkthrough",
        "status": "new",
        "notes": [],
        "source": "qr-walkthrough-landing",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "utm_source": "qr-code",
        "utm_medium": "doorknock",
        "utm_campaign": "leave-behind",
        "utm_term": "",
        "utm_content": "",
    }
    await db.walkthrough_requests.insert_one(doc)

    # ── Notification email to Vince ────────────────────
    specifics_row = (
        f"<tr><td style='border-bottom:1px solid #eee;vertical-align:top'><strong>Specifics</strong></td>"
        f"<td style='border-bottom:1px solid #eee'>{doc['specifics']}</td></tr>"
        if doc['specifics'] else ""
    )
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"New walkthrough request — {doc['company']} — {doc['city']}",
            "html": (
                f"<h2>New Walkthrough Request — QR Door-Knock</h2>"
                f"<table cellpadding='8' style='border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px'>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Name</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{doc['name']}</td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Company</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{doc['company']}</td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>City</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{doc['city']}</td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Phone</strong></td>"
                f"<td style='border-bottom:1px solid #eee'><a href='tel:{doc['phone']}'>{doc['phone']}</a></td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Email</strong></td>"
                f"<td style='border-bottom:1px solid #eee'><a href='mailto:{doc['email']}'>{doc['email']}</a></td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Operation</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{doc['operation_type']}</td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Best time</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{doc['best_time']}</td></tr>"
                f"{specifics_row}"
                f"</table>"
                f"<p style='font-family:Arial,sans-serif;font-size:13px;color:#555;margin-top:24px'>"
                f"<strong>Source:</strong> giglinecompliance.com/walkthrough (QR door-knock leave-behind)<br>"
                f"<strong>Submitted:</strong> {doc['timestamp']}</p>"
                f"<hr><p style='font-family:Arial,sans-serif;font-size:13px;color:#555'>"
                f"<em>SOP: Confirm a walkthrough date within 24 hours.</em></p>"
            ),
        })
    except Exception as e:
        logger.error(f"Failed to send walkthrough-landing notification: {e}")

    # ── Confirmation email to the visitor — includes lead-magnet PDF link ──
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [doc["email"]],
            "subject": "Your Top 5 OSHA Violations report — and your walkthrough request",
            "html": (
                f"<div style='font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#0A1628;max-width:560px'>"
                f"<p>Hi {doc['name'].split(' ')[0]},</p>"
                f"<p>Thank you for reaching out. Vince received your request and will confirm "
                f"a walkthrough date and time within 24 hours.</p>"

                f"<p style='margin-top:24px'><strong>While you wait — here's the free report:</strong></p>"
                f"<table cellpadding='0' cellspacing='0' style='margin:12px 0 18px 0'>"
                f"<tr><td style='background:#B8963E;border-radius:2px'>"
                f"<a href='https://www.giglinecompliance.com/assets/gl-lm-001-digital.pdf' "
                f"style='display:inline-block;padding:14px 28px;color:#0A1628;font-weight:bold;text-decoration:none;font-size:15px'>"
                f"Download &mdash; Top 5 OSHA Violations in Triad Operations (PDF)"
                f"</a></td></tr></table>"
                f"<p style='font-size:13px;color:#5B6B7A;margin:0 0 24px 0'>"
                f"One-page reference. Each violation includes citation, penalty range, what it looks like on the floor, and the fix."
                f"</p>"

                f"<p>If you need to reach Vince directly:<br>"
                f"<strong>Phone:</strong> <a href='tel:3363298899' style='color:#0A1628'>(336) 329-8899</a><br>"
                f"<strong>Email:</strong> <a href='mailto:vince@giglinecompliance.com' style='color:#0A1628'>vince@giglinecompliance.com</a></p>"
                f"<p style='margin-top:32px'>&mdash; GigLine Safety &amp; Compliance</p>"
                f"<p style='color:#5B6B7A;font-size:13px;border-top:1px solid #E5E7EB;padding-top:14px;margin-top:24px'>"
                f"<em>Find it before OSHA does.</em></p>"
                f"</div>"
            ),
        })
    except Exception as e:
        logger.error(f"Failed to send walkthrough-landing confirmation email: {e}")

    return {"status": "ok", "id": doc["id"]}
