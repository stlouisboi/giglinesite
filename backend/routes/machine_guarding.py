"""Machine Guarding Checklist lead-magnet routes (Feb 2026).

Delivers the printable checklist PDF to visitors who submit the lead-magnet
form on /blog/osha-machine-guarding-checklist-small-manufacturers, notifies
Vince of every new lead, and enrols the visitor in the MailerLite lead-nurture
sequence for downstream drip (fire-and-forget).

Mirrors the proven `heat_guide.py` pattern:
    - honeypot-drop bots silently (always return success)
    - store lead in MongoDB regardless of email outcome
    - attempt Resend send inside a `try`, but never fail the request if it errors
    - always return a `download_url` so the visitor can grab the PDF even if
      the email is delayed or their inbox filters it
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime, timezone
import asyncio
import base64
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL, MACHINE_GUARDING_PDF
from integrations.mailerlite import add_to_lead_nurture
from models import MachineGuardingLeadRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.get("/machine-guarding-checklist/pdf")
async def download_machine_guarding_pdf():
    """Direct PDF download — served from the confirmation state and from the
    email link, so visitors can grab the checklist even if the email is stuck."""
    if not MACHINE_GUARDING_PDF.exists():
        raise HTTPException(status_code=404, detail="Machine Guarding checklist not available.")
    return FileResponse(
        path=str(MACHINE_GUARDING_PDF),
        media_type="application/pdf",
        filename="GigLine_Machine_Guarding_Checklist.pdf",
        headers={"Content-Disposition": 'inline; filename="GigLine_Machine_Guarding_Checklist.pdf"'},
    )


@router.post("/machine-guarding-checklist/submit")
async def submit_machine_guarding_lead(request: MachineGuardingLeadRequest):
    """Capture the lead and email the Machine Guarding checklist via Resend."""
    # Honeypot: bots that autofill every input will populate `website`. Real
    # visitors never see the field. Silently return success so bots do not learn
    # which field triggered the drop.
    if request.website and request.website.strip():
        logger.info("Machine-guarding honeypot triggered — dropping submission silently")
        return {
            "success": True,
            "message": "Checklist sent to your email",
            "download_url": "/api/machine-guarding-checklist/pdf",
        }

    email = request.email.strip().lower()
    first_name = (request.first_name or "").strip()[:80]
    company = (request.company or "").strip()[:120]

    await db.machine_guarding_leads.insert_one({
        "email": email,
        "first_name": first_name,
        "company": company,
        "marketing_consent": bool(request.marketing_consent),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.download_events.insert_one({
        "type": "machine_guarding_checklist",
        "email": email,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    # MailerLite lead-nurture enrolment respects consent — only push when
    # the visitor actively opted into ongoing marketing emails.
    if request.marketing_consent:
        asyncio.create_task(add_to_lead_nurture(email=email, source_form="machine_guarding_checklist"))

    display_name = first_name or "there"

    try:
        attachment_content = ""
        if MACHINE_GUARDING_PDF.exists():
            with open(MACHINE_GUARDING_PDF, "rb") as f:
                attachment_content = base64.b64encode(f.read()).decode("utf-8")

        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "Your OSHA Machine Guarding walkthrough checklist",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B;">
                <h1 style="font-size: 22px; margin-bottom: 16px;">Your Machine Guarding walkthrough checklist</h1>
                <p>Hi {display_name},</p>
                <p>Here is your printable OSHA Machine Guarding checklist — 33 items across 6 categories, tied to the CFR sections OSHA actually cites (1910.212, 1910.215, 1910.217, and 1910.219). It is attached to this email.</p>
                <h3 style="margin-top: 24px; margin-bottom: 8px;">WHAT'S INSIDE:</h3>
                <ul style="color: #555;">
                    <li>Point of Operation Guards (6 checks)</li>
                    <li>Rotating and Reciprocating Parts (6 checks)</li>
                    <li>Abrasive Wheels and Grinders (6 checks — 1/8" and 1/4" tolerances called out)</li>
                    <li>Saws, Presses, and Cutters (6 checks)</li>
                    <li>Guard Integrity and Bypass Prevention (5 checks)</li>
                    <li>Documentation and Training (4 checks)</li>
                    <li>Supervisor sign-off block on page 2</li>
                </ul>
                <h3 style="margin-top: 24px; margin-bottom: 8px;">HOW TO USE IT:</h3>
                <ol style="color: #555;">
                    <li>Print and walk your shop with a supervisor who runs the machines.</li>
                    <li>Any unchecked box is a corrective action — route it to a log with an owner and a due date.</li>
                    <li>Sign the bottom block, file the sheet, and repeat quarterly (or after any new machine goes on the floor).</li>
                </ol>
                <p style="margin-top: 24px;">If you want a second set of eyes walking the shop with you, the GigLine Safety Walkthrough is $1,300 and delivers a written citation-risk report with specific machines, guards, and corrective actions. Reply to this email and I'll get you scheduled.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    — Vince Lawrence<br/>
                    GigLine Safety &amp; Compliance<br/>
                    OSHA 30-Hour General Industry Trained<br/>
                    (336) 329-8899<br/>
                    giglinecompliance.com
                </p>
                <p style="margin-top:10px;">
                    <img src="https://www.giglinecompliance.com/assets/veteran-owned-badge-sm.png"
                         alt="Veteran-Owned Company"
                         width="120" height="77"
                         style="display:block;max-width:120px;height:auto;border:0;" />
                </p>
            </div>
            """,
            "attachments": [{
                "filename": "GigLine_Machine_Guarding_Checklist.pdf",
                "content": attachment_content,
            }] if attachment_content else [],
            "reply_to": VINCE_EMAIL,
        })

        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"Machine Guarding checklist download — {email}",
            "html": (
                f"<p>New Machine Guarding checklist download from the blog article.</p>"
                f"<p><strong>Email:</strong> {email}<br/>"
                f"<strong>First name:</strong> {display_name or '(not provided)'}<br/>"
                f"<strong>Company:</strong> {company or '(not provided)'}<br/>"
                f"<strong>Marketing consent:</strong> {'YES' if request.marketing_consent else 'no'}</p>"
                f"<p>Consider a personal follow-up within 24 hours — this visitor is actively "
                f"researching machine-guarding compliance.</p>"
            ),
            "reply_to": email,
        })

        logger.info(f"Machine Guarding checklist sent to {email}")
    except Exception as e:
        logger.error(f"Machine Guarding email error: {str(e)}")

    return {
        "success": True,
        "message": "Checklist sent to your email",
        "download_url": "/api/machine-guarding-checklist/pdf",
    }
