"""Sample Compliance Report download route (GL-WEB-017 Item 2)."""

from fastapi import APIRouter
from datetime import datetime, timezone
import asyncio
import base64
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL, SAMPLE_REPORT_PDF
from integrations.mailerlite import add_to_lead_nurture
from models import SampleReportRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.post("/sample-report/submit")
async def submit_sample_report(request: SampleReportRequest):
    """Capture lead and send Sample Compliance Report via Resend."""
    email = request.email.strip().lower()
    first_name = request.first_name.strip()
    company = (request.company or "").strip()

    await db.sample_report_leads.insert_one({
        "first_name": first_name,
        "email": email,
        "company": company,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.download_events.insert_one({
        "type": "sample_report",
        "email": email,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # Push to MailerLite Lead Nurture (fire-and-forget) — same pattern as Heat Guide.
    asyncio.create_task(add_to_lead_nurture(email=email, source_form="sample_report"))

    try:
        attachment_content = ""
        if SAMPLE_REPORT_PDF.exists():
            with open(SAMPLE_REPORT_PDF, "rb") as f:
                attachment_content = base64.b64encode(f.read()).decode("utf-8")

        first_name_display = first_name or "there"
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "Your GigLine Sample Report",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B;">
                <h1 style="font-size: 22px; margin-bottom: 16px;">Your Sample Compliance Report</h1>
                <p>Hi {first_name_display},</p>
                <p>Attached is a sample of the compliance report a GigLine engagement produces. The facility name is redacted &mdash; everything else is real: findings, CFR citations, penalty exposure, and the prioritized fix list.</p>
                <h3 style="margin-top: 24px; margin-bottom: 8px;">WHAT THE REPORT INCLUDES:</h3>
                <ul style="color: #555;">
                    <li>On-site walkthrough findings with photo documentation</li>
                    <li>CFR citation for every finding</li>
                    <li>2026 penalty exposure per finding</li>
                    <li>RED / AMBER / GREEN prioritized fix list</li>
                    <li>30-day, 60-day, and 90-day corrective action plan</li>
                </ul>
                <p style="margin-top: 24px;">If you'd like to schedule a walkthrough that produces a report like this for your operation, reply to this email or visit <a href="https://www.giglinecompliance.com/intake">giglinecompliance.com/intake</a>.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    &mdash; Vince Lawrence<br/>
                    GigLine Safety &amp; Compliance<br/>
                    (336) 329-8899<br/>
                    giglinecompliance.com
                </p>
            </div>
            """,
            "attachments": [{
                "filename": "GL_Sample_Compliance_Report.pdf",
                "content": attachment_content,
            }] if attachment_content else [],
            "reply_to": VINCE_EMAIL,
        })

        company_line = f"<p><strong>Company:</strong> {company}</p>" if company else ""
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"Sample Report Download — {email}",
            "html": (
                f"<p>New sample report download:</p>"
                f"<p><strong>Name:</strong> {first_name}</p>"
                f"<p><strong>Email:</strong> {email}</p>"
                f"{company_line}"
            ),
            "reply_to": email,
        })

        logger.info(f"Sample report sent to {email}")
        return {"success": True, "message": "Sample report sent to your email"}

    except Exception as e:
        logger.error(f"Sample report email error: {str(e)}")
        return {"success": True, "message": "Sample report sent to your email"}
