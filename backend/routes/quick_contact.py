"""Quick Contact micro-form — low-friction alternative to the full intake (GL-WEB-018)."""

from fastapi import APIRouter
from datetime import datetime, timezone
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL
from models import QuickContactRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.post("/quick-contact/submit")
async def submit_quick_contact(request: QuickContactRequest):
    """Capture a name + contact (email OR phone) + optional message. Notifies Vince."""
    name = request.name.strip()
    contact = request.contact.strip()
    message = (request.message or "").strip()

    doc = {
        "name": name,
        "contact": contact,
        "message": message,
        "source": "quick-contact-micro-form",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.quick_contact_leads.insert_one(doc)

    # Notify Vince — friendly-from + reply-to set to prospect contact when it's an email.
    try:
        is_email = "@" in contact
        friendly_from = f"{name} via GigLine <{SENDER_EMAIL}>"
        msg_row = f"<tr><td style='border-bottom:1px solid #eee;vertical-align:top'><strong>Note</strong></td><td style='border-bottom:1px solid #eee'>{message}</td></tr>" if message else ""
        resend.Emails.send({
            "from": friendly_from,
            "to": [VINCE_EMAIL],
            "reply_to": contact if is_email else VINCE_EMAIL,
            "subject": f"Quick contact — {name}",
            "html": (
                f"<h2>New Quick Contact (micro-form)</h2>"
                f"<table cellpadding='8' style='border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px'>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Name</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{name}</td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee'><strong>Contact</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{contact}</td></tr>"
                f"{msg_row}"
                f"</table>"
                f"<p style='font-family:Arial,sans-serif;font-size:13px;color:#555;margin-top:24px'>"
                f"<strong>Source:</strong> Quick-contact micro-form (not the full intake)<br>"
                f"<strong>SOP:</strong> Reply within 24 hours.</p>"
            ),
        })
    except Exception as e:
        logger.error(f"Quick contact notification error: {str(e)}")

    return {"success": True, "message": "Thanks — Vince will reach out."}
