"""OSHA Inspection Guide email-capture route (GL-WEB-019).

Form on /osha-inspection-guide enrolls the subscriber into the MailerLite
group `hr-osha-guide-download`. PDF delivery is handled by a MailerLite
automation attached to that group — the backend does NOT serve or attach
the PDF itself.
"""

from fastapi import APIRouter
from datetime import datetime, timezone
import asyncio
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL
from integrations.mailerlite import add_to_hr_osha_guide
from models import OshaInspectionGuideRequest

router = APIRouter()
logger = logging.getLogger("gigline")


@router.post("/osha-inspection-guide/submit")
async def submit_osha_inspection_guide(request: OshaInspectionGuideRequest):
    """Email capture: enrolls to MailerLite for automation-driven PDF delivery."""
    email = request.email.strip().lower()
    first_name = (request.first_name or "").strip()
    company = (request.company or "").strip()

    await db.osha_inspection_guide_leads.insert_one({
        "email": email,
        "first_name": first_name,
        "company": company,
        "source": "osha-inspection-guide",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.download_events.insert_one({
        "type": "osha_inspection_guide",
        "email": email,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # MailerLite enrollment (fire-and-forget; PDF delivery happens via MailerLite automation).
    asyncio.create_task(
        add_to_hr_osha_guide(email=email, first_name=first_name, company=company)
    )

    # Vince internal notification (so he sees the lead in real time, separate from MailerLite automation)
    try:
        company_line = f"<p><strong>Company:</strong> {company}</p>" if company else ""
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"OSHA Inspection Guide download — {email}",
            "html": (
                f"<p>New OSHA Inspection Guide download (HR-targeted lead magnet):</p>"
                f"<p><strong>Name:</strong> {first_name or '(not provided)'}</p>"
                f"<p><strong>Email:</strong> {email}</p>"
                f"{company_line}"
                f"<p style='color:#555;font-size:13px;margin-top:18px'>"
                f"Subscriber will be enrolled in MailerLite group "
                f"<code>hr-osha-guide-download</code>. PDF delivery handled by the "
                f"automation attached to that group.</p>"
            ),
            "reply_to": email,
        })
    except Exception as e:
        logger.error(f"OSHA guide Vince-notification error: {e}")

    return {"success": True, "message": "Check your inbox. Your guide is on the way."}
