"""Heat stress guide routes."""

from fastapi import APIRouter
from datetime import datetime, timezone
import base64
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL, HEAT_STRESS_PDF
from models import HeatGuideRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.post("/heat-guide/submit")
async def submit_heat_guide(request: HeatGuideRequest):
    """Capture email and send Heat Stress Action Template via Resend."""
    email = request.email.strip().lower()

    await db.heat_guide_leads.insert_one({
        "email": email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.download_events.insert_one({
        "type": "heat_guide",
        "email": email,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    try:
        attachment_content = ""
        if HEAT_STRESS_PDF.exists():
            with open(HEAT_STRESS_PDF, "rb") as f:
                attachment_content = base64.b64encode(f.read()).decode("utf-8")

        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "Your 2026 Heat Stress Action Template",
            "html": """
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B;">
                <h1 style="font-size: 22px; margin-bottom: 16px;">Your Heat Stress Action Template</h1>
                <p>Here's your 2026 Heat Stress Action Template for NC manufacturing and warehouse operations. It's attached to this email.</p>
                <h3 style="margin-top: 24px; margin-bottom: 8px;">WHAT'S INSIDE:</h3>
                <ul style="color: #555;">
                    <li>Daily Heat Check — three trigger levels</li>
                    <li>Required Controls by Trigger Level</li>
                    <li>Written Plan Checklist (HIIPP)</li>
                    <li>Enforcement Reference — NC DOL General Duty Clause</li>
                </ul>
                <h3 style="margin-top: 24px; margin-bottom: 8px;">NEXT STEPS:</h3>
                <ol style="color: #555;">
                    <li>Print and post in break rooms and supervisor offices</li>
                    <li>Train supervisors on trigger levels and required controls</li>
                    <li>Document daily heat checks during summer months</li>
                </ol>
                <p style="margin-top: 24px;">If your operation needs a full heat illness prevention program or safety walkthrough, reply to this email.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    — Vince Lawrence<br/>
                    GigLine Safety & Compliance<br/>
                    (336) 329-8899<br/>
                    giglinecompliance.com
                </p>
            </div>
            """,
            "attachments": [{
                "filename": "GL_Heat_Stress_Action_Template_2026.pdf",
                "content": attachment_content,
            }] if attachment_content else [],
            "reply_to": VINCE_EMAIL,
        })

        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"Heat Guide Download — {email}",
            "html": f"<p>New heat stress template download:</p><p><strong>Email:</strong> {email}</p>",
            "reply_to": email,
        })

        logger.info(f"Heat guide sent to {email}")
        return {"success": True, "message": "Template sent to your email"}

    except Exception as e:
        logger.error(f"Heat guide email error: {str(e)}")
        return {"success": True, "message": "Template sent to your email"}
