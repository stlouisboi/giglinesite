"""Client Safety Intake Form routes — GL-PORT-001."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel
import uuid
import os
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL

router = APIRouter()
logger = logging.getLogger('gigline')

UPLOAD_DIR = "/app/backend/intake_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class IntakeSubmission(BaseModel):
    company: str
    dba: str = ""
    address: str
    additionalLocations: str = ""
    contactName: str
    jobTitle: str = ""
    email: str
    phone: str
    totalEmployees: int = 0
    siteEmployees: int = 0
    schedule: str = ""
    scheduleDetail: Optional[dict] = None
    industry: str = ""
    industryOther: str = ""
    dayToDay: str = ""
    operations: list = []
    topHazards: str = ""
    safetyProgram: str = ""
    safetyOwner: str = ""
    requiredPrograms: Optional[dict] = None
    oshaLogs: str = ""
    oshaInspections: str = ""
    recordableInjuries: str = ""
    existingDocs: Optional[dict] = None
    uploadedFileUrls: list = []
    helpNeeded: list = []
    helpOther: str = ""
    ninetyDayProblem: str = ""
    urgency: str = ""
    budget: str = ""
    approver: str = ""
    preferredDays: list = []
    preferredTime: str = ""
    referralSource: str = ""
    consentGiven: bool = False


@router.post("/intake/upload")
async def upload_intake_file(file: UploadFile = File(...)):
    """Upload a document for the intake form."""
    allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="File type not allowed")

    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (10MB max)")

    submission_id = str(uuid.uuid4())
    sub_dir = os.path.join(UPLOAD_DIR, submission_id)
    os.makedirs(sub_dir, exist_ok=True)
    filepath = os.path.join(sub_dir, file.filename)

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (10MB max)")

    with open(filepath, "wb") as f:
        f.write(content)

    return {
        "filename": file.filename,
        "uploadId": submission_id,
        "size": len(content),
    }


@router.post("/intake/submit")
async def submit_intake(data: IntakeSubmission):
    """Store intake submission and send notification emails."""
    if not data.consentGiven:
        raise HTTPException(status_code=400, detail="Consent required")

    submission_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc)

    doc = {
        "id": submission_id,
        "submittedAt": timestamp.isoformat(),
        **data.model_dump(),
    }
    await db.gl_intake_submissions.insert_one(doc)

    # Build formatted email for Vince
    programs_html = ""
    if data.requiredPrograms:
        programs_html = "<table style='border-collapse:collapse;width:100%;margin:8px 0;'>"
        programs_html += "<tr style='background:#222;color:#E8B84B;'><th style='padding:6px 8px;text-align:left;'>Program</th><th style='padding:6px 8px;'>Status</th></tr>"
        for prog, status in data.requiredPrograms.items():
            color = "#4ade80" if status == "yes" else "#f87171" if status == "no" else "#E8B84B" if status == "not_sure" else "#999"
            programs_html += f"<tr><td style='padding:4px 8px;border-bottom:1px solid #333;color:#ccc;'>{prog}</td><td style='padding:4px 8px;border-bottom:1px solid #333;color:{color};font-weight:bold;text-align:center;'>{status.upper()}</td></tr>"
        programs_html += "</table>"

    docs_html = ""
    if data.existingDocs:
        docs_html = "<table style='border-collapse:collapse;width:100%;margin:8px 0;'>"
        for doc_name, status in data.existingDocs.items():
            color = "#4ade80" if status == "yes" else "#f87171" if status == "no" else "#E8B84B" if status == "not_sure" else "#999"
            docs_html += f"<tr><td style='padding:4px 8px;border-bottom:1px solid #333;color:#ccc;'>{doc_name}</td><td style='padding:4px 8px;border-bottom:1px solid #333;color:{color};font-weight:bold;text-align:center;'>{status.upper()}</td></tr>"
        docs_html += "</table>"

    vince_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#1A1A1A;color:#fff;padding:24px;border-radius:8px;">
      <div style="border-bottom:2px solid #E8B84B;padding-bottom:12px;margin-bottom:20px;">
        <h2 style="color:#E8B84B;margin:0;">New GigLine Intake — {data.company}</h2>
        <p style="color:#999;font-size:13px;margin:4px 0 0;">Submitted {timestamp.strftime('%B %d, %Y at %I:%M %p')} UTC</p>
      </div>

      <h3 style="color:#E8B84B;font-size:14px;margin:16px 0 8px;">COMPANY</h3>
      <p style="color:#ccc;margin:2px 0;"><strong>Company:</strong> {data.company} {f'(DBA: {data.dba})' if data.dba else ''}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Address:</strong> {data.address}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Additional Locations:</strong> {data.additionalLocations or 'No'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Total Employees:</strong> {data.totalEmployees} | <strong>At this site:</strong> {data.siteEmployees}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Schedule:</strong> {data.schedule}</p>

      <h3 style="color:#E8B84B;font-size:14px;margin:16px 0 8px;">CONTACT</h3>
      <p style="color:#ccc;margin:2px 0;"><strong>{data.contactName}</strong> — {data.jobTitle or 'N/A'}</p>
      <p style="color:#ccc;margin:2px 0;"><a href="mailto:{data.email}" style="color:#E8B84B;">{data.email}</a> · <a href="tel:{data.phone}" style="color:#E8B84B;">{data.phone}</a></p>

      <h3 style="color:#E8B84B;font-size:14px;margin:16px 0 8px;">OPERATIONS</h3>
      <p style="color:#ccc;margin:2px 0;"><strong>Industry:</strong> {data.industry} {f'({data.industryOther})' if data.industryOther else ''}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Day-to-day:</strong> {data.dayToDay or 'N/A'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Operations:</strong> {', '.join(data.operations) if data.operations else 'None selected'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Top hazards:</strong> {data.topHazards or 'N/A'}</p>

      <h3 style="color:#E8B84B;font-size:14px;margin:16px 0 8px;">SAFETY & COMPLIANCE</h3>
      <p style="color:#ccc;margin:2px 0;"><strong>Written program:</strong> {data.safetyProgram}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Safety owner:</strong> {data.safetyOwner}</p>
      {programs_html}
      <p style="color:#ccc;margin:2px 0;"><strong>OSHA 300 logs:</strong> {data.oshaLogs} | <strong>Inspections (3yr):</strong> {data.oshaInspections} | <strong>Recordables:</strong> {data.recordableInjuries}</p>

      <h3 style="color:#E8B84B;font-size:14px;margin:16px 0 8px;">DOCUMENTATION</h3>
      {docs_html}
      <p style="color:#ccc;margin:2px 0;"><strong>Uploaded files:</strong> {len(data.uploadedFileUrls)} file(s)</p>

      <h3 style="color:#E8B84B;font-size:14px;margin:16px 0 8px;">WHY THEY REACHED OUT</h3>
      <p style="color:#ccc;margin:2px 0;"><strong>Help needed:</strong> {', '.join(data.helpNeeded) if data.helpNeeded else 'N/A'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>90-day problem:</strong> {data.ninetyDayProblem or 'N/A'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Urgency:</strong> {data.urgency}</p>

      <h3 style="color:#E8B84B;font-size:14px;margin:16px 0 8px;">BUDGET & LOGISTICS</h3>
      <p style="color:#ccc;margin:2px 0;"><strong>Budget:</strong> {data.budget or 'Not provided'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Approver:</strong> {data.approver or 'Not provided'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Preferred days:</strong> {', '.join(data.preferredDays) if data.preferredDays else 'Not provided'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Preferred time:</strong> {data.preferredTime or 'Not provided'}</p>
      <p style="color:#ccc;margin:2px 0;"><strong>Referral source:</strong> {data.referralSource or 'Not provided'}</p>
    </div>
    """

    # Client confirmation email
    client_html = f"""
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2B2B;">
      <h1 style="font-size:22px;margin-bottom:16px;">GigLine received your intake form</h1>
      <p>Thanks, {data.contactName}. We've received the safety intake for <strong>{data.company}</strong>.</p>
      <p style="margin-top:16px;"><strong>What happens next:</strong></p>
      <p>Vince will review your information and follow up within <strong>1 business day</strong> to schedule a call or walkthrough and discuss next steps.</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
      <p style="color:#888;font-size:14px;">
        — Vince Lawrence<br/>
        GigLine Safety & Compliance<br/>
        (336) 329-8899<br/>
        vince@giglinecompliance.com
      </p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"New GigLine Intake — {data.company}",
            "html": vince_html,
        })
    except Exception as e:
        logger.error(f"Intake Vince email error: {e}")

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [data.email],
            "subject": "GigLine received your intake form",
            "html": client_html,
            "reply_to": VINCE_EMAIL,
        })
    except Exception as e:
        logger.error(f"Intake client email error: {e}")

    return {"status": "success", "submissionId": submission_id}
