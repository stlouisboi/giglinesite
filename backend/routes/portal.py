"""Client Status Page & Report Delivery routes — GL-PORT-001 Section B."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from datetime import datetime, timezone
import os
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL, ADMIN_PASSWORD

router = APIRouter()
logger = logging.getLogger('gigline')

REPORT_DIR = "/app/backend/client_reports"
AGREEMENT_DIR = "/app/backend/agreements"
os.makedirs(REPORT_DIR, exist_ok=True)
os.makedirs(AGREEMENT_DIR, exist_ok=True)

STATUS_STAGES = {
    "intake_received": {
        "label": "Intake received",
        "description": "Your intake form has been submitted.",
        "message": "Vince will review your submission and send a proposal within 1 business day.",
    },
    "proposal_sent": {
        "label": "Proposal sent",
        "description": "A proposal has been sent for your review.",
        "message": "Review your proposal and reach out with any questions before signing.",
    },
    "agreement_signed": {
        "label": "Agreement signed",
        "description": "Your service agreement is confirmed.",
        "message": "Your agreement is confirmed. Complete payment to lock in your walkthrough date.",
    },
    "payment_confirmed": {
        "label": "Payment confirmed",
        "description": "Payment has been received.",
        "message": "Payment received. Vince will contact you to confirm the exact date and time.",
    },
    "walkthrough_scheduled": {
        "label": "Walkthrough scheduled",
        "description": "Your walkthrough date is confirmed.",
        "message": "Your walkthrough is confirmed. You will receive the Safety Check report within 48-72 hours of the visit.",
    },
    "report_delivered": {
        "label": "Report delivered",
        "description": "Your Safety Check report is ready.",
        "message": "Your Safety Check report has been delivered. Contact Vince to discuss findings or next steps.",
    },
}

STAGE_ORDER = ["intake_received", "proposal_sent", "agreement_signed", "payment_confirmed", "walkthrough_scheduled", "report_delivered"]


# ── Client Status Page ──

@router.get("/status/{client_token}")
async def get_client_status(client_token: str):
    """Public endpoint — token-based access, no auth."""
    record = await db.gl_intake_submissions.find_one(
        {"clientToken": client_token}, {"_id": 0}
    )
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    current_status = record.get("status", "intake_received")
    current_idx = STAGE_ORDER.index(current_status) if current_status in STAGE_ORDER else 0

    stages = []
    for i, key in enumerate(STAGE_ORDER):
        stage_info = STATUS_STAGES[key]
        stages.append({
            "key": key,
            "label": stage_info["label"],
            "description": stage_info["description"],
            "message": stage_info["message"],
            "state": "completed" if i < current_idx else "current" if i == current_idx else "upcoming",
        })

    return {
        "company": record.get("company", ""),
        "contactName": record.get("contactName", ""),
        "status": current_status,
        "statusUpdatedAt": record.get("statusUpdatedAt"),
        "stages": stages,
        "reportUrl": record.get("reportUrl"),
    }


# ── Report Delivery Page ──

@router.get("/report/{client_token}")
async def get_report_page(client_token: str):
    """Public endpoint — token-based access, no auth. Returns report metadata."""
    record = await db.gl_intake_submissions.find_one(
        {"clientToken": client_token}, {"_id": 0}
    )
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    if not record.get("reportUrl"):
        raise HTTPException(status_code=404, detail="Report not yet available")

    # Log access
    await db.gl_intake_submissions.update_one(
        {"clientToken": client_token},
        {"$set": {"reportAccessedAt": datetime.now(timezone.utc).isoformat()}},
    )

    return {
        "company": record.get("company", ""),
        "contactName": record.get("contactName", ""),
        "reportDeliveredAt": record.get("reportDeliveredAt"),
        "clientToken": client_token,
    }


@router.get("/report/{client_token}/download")
async def download_report(client_token: str):
    """Serve the actual PDF file."""
    record = await db.gl_intake_submissions.find_one(
        {"clientToken": client_token}, {"_id": 0}
    )
    if not record or not record.get("reportUrl"):
        raise HTTPException(status_code=404, detail="Report not found")

    filepath = os.path.join(REPORT_DIR, f"{client_token}.pdf")
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Report file not found")

    company = record.get("company", "Report").replace(" ", "-")
    return FileResponse(filepath, media_type="application/pdf", filename=f"GigLine-SafetyCheck-{company}.pdf")


# ── Admin: Status Update ──

@router.put("/admin/intake/{client_token}/status")
async def update_intake_status(client_token: str, body: dict, token: str = ""):
    """Admin updates client status stage."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    new_status = body.get("status")
    if new_status not in STAGE_ORDER:
        raise HTTPException(status_code=400, detail=f"Invalid status: {new_status}")

    record = await db.gl_intake_submissions.find_one({"clientToken": client_token}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    await db.gl_intake_submissions.update_one(
        {"clientToken": client_token},
        {"$set": {"status": new_status, "statusUpdatedAt": datetime.now(timezone.utc).isoformat()}},
    )

    # Send client notification for key status changes
    stage_info = STATUS_STAGES.get(new_status, {})
    notify_statuses = ["proposal_sent", "walkthrough_scheduled"]
    if new_status in notify_statuses:
        email = record.get("email")
        name = record.get("contactName", "")
        company = record.get("company", "")
        status_url = f"https://giglinecompliance.com/status/{client_token}"
        if email:
            try:
                resend.Emails.send({
                    "from": SENDER_EMAIL,
                    "to": [email],
                    "subject": f"GigLine — {stage_info['label']}",
                    "html": f"""
                    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2B2B;">
                      <h1 style="font-size:22px;margin-bottom:8px;">{stage_info['label']}</h1>
                      <p>{name}, here is an update on your engagement with GigLine for <strong>{company}</strong>:</p>
                      <p style="margin:16px 0;padding:16px;background:#f8f7f5;border-left:3px solid #B8972C;border-radius:4px;">{stage_info['message']}</p>
                      <p><a href="{status_url}" style="color:#B8972C;font-weight:bold;">View your status</a></p>
                      <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
                      <p style="color:#888;font-size:14px;">— Vince Lawrence<br/>GigLine Safety & Compliance<br/>(336) 329-8899</p>
                    </div>
                    """,
                    "reply_to": VINCE_EMAIL,
                })
            except Exception as e:
                logger.error(f"Status notification email error: {e}")

    return {"status": "updated", "newStatus": new_status}


# ── Admin: Report Upload ──

@router.post("/admin/intake/{client_token}/report")
async def upload_report(client_token: str, token: str = "", file: UploadFile = File(...)):
    """Admin uploads a Safety Check report PDF for a client."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    record = await db.gl_intake_submissions.find_one({"clientToken": client_token}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="PDF files only")

    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (20MB max)")

    filepath = os.path.join(REPORT_DIR, f"{client_token}.pdf")
    with open(filepath, "wb") as f:
        f.write(content)

    now = datetime.now(timezone.utc).isoformat()
    report_url = f"/api/report/{client_token}/download"

    await db.gl_intake_submissions.update_one(
        {"clientToken": client_token},
        {"$set": {
            "reportUrl": report_url,
            "reportDeliveredAt": now,
            "status": "report_delivered",
            "statusUpdatedAt": now,
        }},
    )

    # Send report delivery email to client
    email = record.get("email")
    company = record.get("company", "")
    name = record.get("contactName", "")
    report_page_url = f"https://giglinecompliance.com/report/{client_token}"
    if email:
        try:
            resend.Emails.send({
                "from": SENDER_EMAIL,
                "to": [email],
                "subject": "Your GigLine Safety Check Report is ready",
                "html": f"""
                <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2B2B;">
                  <h1 style="font-size:22px;margin-bottom:16px;">Your Safety Check Report is ready</h1>
                  <p>{company},</p>
                  <p>Your Safety Check report from your walkthrough is ready.</p>
                  <p style="margin:20px 0;"><a href="{report_page_url}" style="display:inline-block;background:#B8972C;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">View your report</a></p>
                  <p style="font-size:13px;color:#888;">This link is private to you. Your report will remain accessible at this URL.</p>
                  <p style="margin-top:16px;">Questions about the findings? Call (336) 329-8899 or reply to this email.</p>
                  <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
                  <p style="color:#888;font-size:14px;">— Vince Lawrence<br/>GigLine Safety & Compliance</p>
                </div>
                """,
                "reply_to": VINCE_EMAIL,
            })
        except Exception as e:
            logger.error(f"Report delivery email error: {e}")

    return {"status": "uploaded", "reportUrl": report_url}


# ── Admin: Enhanced Dashboard Data ──

@router.get("/admin/intake-submissions")
async def get_intake_submissions(token: str = "", limit: int = 100):
    """Get all intake submissions with status info for admin dashboard."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    submissions = await db.gl_intake_submissions.find(
        {}, {"_id": 0}
    ).sort("submittedAt", -1).to_list(limit)
    return submissions


@router.get("/admin/bookings")
async def get_bookings(token: str = "", limit: int = 100):
    """Get all bookings for admin dashboard."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    bookings = await db.gl_bookings.find({}, {"_id": 0}).sort("createdAt", -1).to_list(limit)
    return bookings


@router.get("/admin/portal-stats")
async def get_portal_stats(token: str = ""):
    """Dashboard summary strip data."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()

    intake_this_month = await db.gl_intake_submissions.count_documents({"submittedAt": {"$gte": month_start}})
    pending_proposals = await db.gl_intake_submissions.count_documents({"status": "intake_received"})
    confirmed_bookings = await db.gl_bookings.count_documents({"paymentStatus": "paid"})
    reports_delivered = await db.gl_intake_submissions.count_documents({"status": "report_delivered"})

    # Revenue this month
    pipeline = [
        {"$match": {"paymentStatus": "paid", "createdAt": {"$gte": month_start}}},
        {"$group": {"_id": None, "total": {"$sum": "$totalCharged"}}},
    ]
    revenue_result = await db.gl_bookings.aggregate(pipeline).to_list(1)
    revenue = revenue_result[0]["total"] if revenue_result else 0

    return {
        "intakeThisMonth": intake_this_month,
        "pendingProposals": pending_proposals,
        "confirmedBookings": confirmed_bookings,
        "reportsDelivered": reports_delivered,
        "revenueThisMonth": revenue,
    }


# ── Agreement signing ──

from pydantic import BaseModel as PydanticBaseModel

class SignAgreementRequest(PydanticBaseModel):
    clientToken: str
    typedName: str
    company: str
    tier: str
    addRetainer: bool = False


@router.post("/onboarding/sign-agreement")
async def sign_agreement(req: SignAgreementRequest):
    """Generate signed agreement PDF server-side and store it."""
    from pdf_generator_agreement import generate_agreement_pdf

    now = datetime.now(timezone.utc)

    pdf_bytes = generate_agreement_pdf(
        typed_name=req.typedName,
        company=req.company,
        tier=req.tier,
        add_retainer=req.addRetainer,
        timestamp=now,
    )

    # Store PDF
    filepath = os.path.join(AGREEMENT_DIR, f"{req.clientToken}.pdf")
    with open(filepath, "wb") as f:
        f.write(pdf_bytes)

    agreement_url = f"/api/agreement/{req.clientToken}/download"

    # Update the booking record (may not exist yet if signing before payment)
    # Also update the intake submission record if it exists
    await db.gl_intake_submissions.update_one(
        {"clientToken": req.clientToken},
        {"$set": {
            "agreementSigned": True,
            "agreementSignedAt": now.isoformat(),
            "agreementUrl": agreement_url,
            "status": "agreement_signed",
            "statusUpdatedAt": now.isoformat(),
        }},
    )

    return {
        "signed": True,
        "agreementUrl": agreement_url,
        "signedAt": now.isoformat(),
    }


@router.get("/agreement/{client_token}/download")
async def download_agreement(client_token: str):
    """Download signed agreement PDF."""
    filepath = os.path.join(AGREEMENT_DIR, f"{client_token}.pdf")
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Agreement not found")
    return FileResponse(filepath, media_type="application/pdf", filename="GigLine-Service-Agreement.pdf")
