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
from config import db, SENDER_EMAIL, VINCE_EMAIL, OSHA_GUIDE_PDF
from integrations.mailerlite import add_to_hr_osha_guide
from models import OshaInspectionGuideRequest
import base64

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

    # Backend Resend fallback delivery (GL-WEB-019 belt-and-suspenders).
    # Runs in parallel with the MailerLite automation. If MailerLite delays or fails,
    # the prospect still gets the PDF in their inbox within seconds.
    try:
        attachment_content = ""
        if OSHA_GUIDE_PDF.exists():
            with open(OSHA_GUIDE_PDF, "rb") as f:
                attachment_content = base64.b64encode(f.read()).decode("utf-8")

        first_name_display = first_name or "there"
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "Your OSHA Inspection Guide — GigLine",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B;">
                <h1 style="font-size: 22px; margin-bottom: 16px;">Your OSHA Inspection Guide</h1>
                <p>Hi {first_name_display},</p>
                <p>Attached is the GigLine OSHA Inspection Guide for HR and safety leaders. CFR-cited, built for general industry, covering the inspection lifecycle &mdash; before, during, and after.</p>
                <h3 style="margin-top: 24px; margin-bottom: 8px;">WHAT'S INSIDE:</h3>
                <ul style="color: #555;">
                    <li>Pre-inspection readiness checklist</li>
                    <li>The five phases of an OSHA inspection</li>
                    <li>24-hour action window and 15-day citation response</li>
                    <li>Most common HR-facing citations with penalty exposure</li>
                </ul>
                <p style="margin-top: 24px;">If you want to know exactly where your own operation stands today, take the 90-second Safety Check at <a href="https://www.giglinecompliance.com/safety-check">giglinecompliance.com/safety-check</a> &mdash; no email required.</p>
                <p>And if you'd like a walkthrough that produces a CFR-cited report for your facility, reply to this email or visit <a href="https://www.giglinecompliance.com/intake">giglinecompliance.com/intake</a>.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    &mdash; Vince Lawrence<br/>
                    GigLine Safety &amp; Compliance<br/>
                    OSHA 30-Hour Certified &middot; 25+ Years in Manufacturing<br/>
                    (336) 329-8899<br/>
                    giglinecompliance.com
                </p>
            </div>
            """,
            "attachments": [{
                "filename": "GigLine_OSHA_Inspection_Guide.pdf",
                "content": attachment_content,
            }] if attachment_content else [],
            "reply_to": VINCE_EMAIL,
        })
        logger.info(f"OSHA guide Resend fallback delivered to {email}")
    except Exception as e:
        logger.error(f"OSHA guide Resend fallback error: {e}")

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
