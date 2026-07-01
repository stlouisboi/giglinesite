"""Contact Message — simple 4-field contact form (GL-WEB-024).

Distinct from /quick-contact (2-field micro-form) and /intake (full 7-section).
Sends confirmation email to prospect + notification to Vince via Resend.
Honeypot spam protection — no CAPTCHA.
"""

from fastapi import APIRouter
from datetime import datetime, timezone
from typing import Optional
import logging
import html as html_lib

from pydantic import BaseModel, EmailStr

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL

router = APIRouter()
logger = logging.getLogger('gigline')


class ContactMessageRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    message: str
    website: Optional[str] = ""  # honeypot — real users leave empty


def _esc(v: str) -> str:
    return html_lib.escape((v or "").strip())


@router.post("/contact-message/submit")
async def submit_contact_message(request: ContactMessageRequest):
    """Capture name/email/phone/message. Confirm prospect + notify Vince."""
    # Honeypot: if filled, silently accept but drop.
    if (request.website or "").strip():
        logger.info("contact-message honeypot triggered (dropped)")
        return {"success": True}

    name = request.name.strip()
    email = request.email.strip().lower()
    phone = (request.phone or "").strip()
    message = request.message.strip()

    doc = {
        "name": name,
        "email": email,
        "phone": phone,
        "message": message,
        "source": "contact-page-simple-form",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_messages.insert_one(doc)

    name_html = _esc(name)
    email_html = _esc(email)
    phone_html = _esc(phone)
    message_html = _esc(message).replace("\n", "<br/>")
    first_name_display = name.split(" ")[0] if name else "there"

    # 1) Confirmation to prospect
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "Message received — GigLine Safety & Compliance",
            "reply_to": VINCE_EMAIL,
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B;">
                <h1 style="font-size: 22px; margin-bottom: 16px;">Your message has been received.</h1>
                <p>Hi {_esc(first_name_display)},</p>
                <p>Thanks for reaching out. Vince will respond personally within one business day.</p>
                <p>For faster response, call or text <strong>(336) 329-8899</strong>.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="font-size: 13px; color: #555;"><strong>Your message:</strong></p>
                <p style="font-size: 13px; color: #555; font-style: italic;">{message_html}</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    &mdash; Vince Lawrence<br/>
                    GigLine Safety &amp; Compliance<br/>
                    (336) 329-8899<br/>
                    giglinecompliance.com
                </p>
            </div>
            """,
        })
    except Exception as e:
        logger.error(f"Contact message — prospect confirmation error: {str(e)}")

    # 2) Notification to Vince
    try:
        phone_row = (
            f"<tr><td style='border-bottom:1px solid #eee;vertical-align:top'><strong>Phone</strong></td>"
            f"<td style='border-bottom:1px solid #eee'>{phone_html}</td></tr>"
            if phone else ""
        )
        friendly_from = f"{name} via GigLine <{SENDER_EMAIL}>"
        resend.Emails.send({
            "from": friendly_from,
            "to": [VINCE_EMAIL],
            "reply_to": email,
            "subject": f"Contact form — {name}",
            "html": (
                f"<h2>New Contact Message</h2>"
                f"<table cellpadding='8' style='border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px'>"
                f"<tr><td style='border-bottom:1px solid #eee;vertical-align:top'><strong>Name</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{name_html}</td></tr>"
                f"<tr><td style='border-bottom:1px solid #eee;vertical-align:top'><strong>Email</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{email_html}</td></tr>"
                f"{phone_row}"
                f"<tr><td style='border-bottom:1px solid #eee;vertical-align:top'><strong>Message</strong></td>"
                f"<td style='border-bottom:1px solid #eee'>{message_html}</td></tr>"
                f"</table>"
                f"<p style='font-family:Arial,sans-serif;font-size:13px;color:#555;margin-top:24px'>"
                f"<strong>Source:</strong> Contact page — simple form (GL-WEB-024)<br>"
                f"<strong>SOP:</strong> Reply within 1 business day.</p>"
            ),
        })
    except Exception as e:
        logger.error(f"Contact message — Vince notification error: {str(e)}")

    return {
        "success": True,
        "message": "Your message has been received. Vince will respond within one business day.",
    }
