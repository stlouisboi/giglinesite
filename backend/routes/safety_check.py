"""Safety Check submission, listing, report, and drip-email routes."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime, timezone, timedelta
import asyncio
import uuid
import os
import base64
import logging

import resend
from config import db, SENDER_EMAIL, VINCE_EMAIL
from models import SafetyCheckSubmission
from email_sequences import get_flow_for_score, render_email
from pdf_generator import generate_safety_check_pdf

router = APIRouter()
logger = logging.getLogger('gigline')


@router.post("/safety-check/submit")
async def submit_safety_check(submission: SafetyCheckSubmission):
    """Store safety check submission, email Vince, and auto-respond to lead."""
    submission_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc)

    gaps = submission.score_gaps
    if gaps <= 1:
        score_level = "LOW"
    elif gaps <= 3:
        score_level = "MEDIUM"
    else:
        score_level = "HIGH"

    doc = {
        "id": submission_id,
        "name": submission.name,
        "company": submission.company,
        "phone": submission.phone,
        "email": submission.email,
        "role": submission.role,
        "operation_type": submission.operation_type,
        "employee_count": submission.employee_count,
        "score_display": submission.score_display,
        "score_gaps": submission.score_gaps,
        "score_level": score_level,
        "concerned_question": submission.concerned_question,
        "what_pushed": submission.what_pushed,
        "answers": submission.answers,
        "timestamp": timestamp.isoformat(),
    }
    await db.safety_check_submissions.insert_one(doc)

    # Schedule drip email sequence
    flow_type, email_sequence = get_flow_for_score(gaps)
    drip_doc = {
        "submission_id": submission_id,
        "email": submission.email,
        "name": submission.name,
        "company": submission.company,
        "flow_type": flow_type,
        "score_gaps": gaps,
        "created_at": timestamp.isoformat(),
        "emails": [],
    }
    for i, template in enumerate(email_sequence):
        send_at = timestamp + timedelta(days=template["delay_days"])
        drip_doc["emails"].append({
            "seq": i,
            "delay_days": template["delay_days"],
            "subject": template["subject"],
            "send_at": send_at.isoformat(),
            "sent": False,
            "sent_at": None,
            "error": None,
        })
    await db.email_drip_queue.insert_one(drip_doc)

    # Generate PDF report
    pdf_data = {
        "id": submission_id,
        "name": submission.name,
        "company": submission.company,
        "email": submission.email,
        "phone": submission.phone,
        "operation_type": submission.operation_type,
        "score_gaps": gaps,
        "score_level": score_level,
        "answers": submission.answers,
        "timestamp": timestamp.isoformat(),
    }
    pdf_b64 = None
    try:
        pdf_bytes = generate_safety_check_pdf(pdf_data)
        pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")
        await db.safety_check_submissions.update_one(
            {"id": submission_id},
            {"$set": {"has_pdf": True}},
        )
        pdf_dir = "/app/backend/reports"
        os.makedirs(pdf_dir, exist_ok=True)
        with open(f"{pdf_dir}/{submission_id}.pdf", "wb") as f:
            f.write(pdf_bytes)
        logger.info(f"PDF report generated for submission {submission_id}")
    except Exception as e:
        logger.error(f"PDF generation failed: {str(e)}")

    # Build Vince email
    question_labels = {
        "1": "HazCom & SDS (29 CFR 1910.1200)",
        "2": "Forklift Certification (29 CFR 1910.178)",
        "3": "Lockout/Tagout (29 CFR 1910.147)",
        "4": "Machine Guarding (29 CFR 1910.212)",
        "5": "Ladder Safety (29 CFR 1926.1053)",
        "6": "Training Records (29 CFR 1910.132)",
    }
    answers_html = ""
    for q_id, answer in sorted(submission.answers.items()):
        label = question_labels.get(q_id, f"Question {q_id}")
        color = "#c0392b" if answer == "no" else "#27ae60"
        answers_html += f'<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;">{label}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;color:{color};font-weight:bold;">{answer.upper()}</td></tr>'

    vince_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1C2B2B;border-bottom:2px solid #B8972C;padding-bottom:8px;">
        Safety Check — {submission.score_gaps}/6 Gaps — {score_level}
      </h2>
      <table style="width:100%;margin:16px 0;">
        <tr><td style="padding:4px 0;color:#666;">Name:</td><td style="padding:4px 0;font-weight:bold;">{submission.name}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Company:</td><td style="padding:4px 0;font-weight:bold;">{submission.company}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Role:</td><td style="padding:4px 0;font-weight:bold;">{submission.role or 'Not provided'}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Phone:</td><td style="padding:4px 0;"><a href="tel:{submission.phone}">{submission.phone or 'Not provided'}</a></td></tr>
        <tr><td style="padding:4px 0;color:#666;">Email:</td><td style="padding:4px 0;"><a href="mailto:{submission.email}">{submission.email}</a></td></tr>
      </table>
      <div style="background:{'#c0392b' if score_level=='HIGH' else '#e67e22' if score_level=='MEDIUM' else '#27ae60'};color:#fff;padding:12px 16px;border-radius:4px;margin:12px 0;font-size:18px;font-weight:bold;">
        Risk Score: {submission.score_gaps} / 6 &mdash; {score_level}
      </div>
      <table style="width:100%;border-collapse:collapse;margin:12px 0;">
        <tr style="background:#1C2B2B;color:#fff;"><th style="padding:8px 12px;text-align:left;">Question</th><th style="padding:8px 12px;text-align:left;">Answer</th></tr>
        {answers_html}
      </table>
      <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">
      <p style="color:#999;font-size:12px;">Submitted {timestamp.strftime('%B %d, %Y at %I:%M %p')} UTC</p>
    </div>
    """

    email_errors = []

    try:
        email_payload = {
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"{'[HIGH RISK] ' if score_level == 'HIGH' else ''}Safety Check [{submission.score_gaps}/6] — {submission.company} — {score_level}",
            "html": vince_html,
        }
        if pdf_b64:
            email_payload["attachments"] = [{
                "filename": f"GigLine-SafetyCheck-{submission.company.replace(' ', '-')}.pdf",
                "content": pdf_b64,
            }]
        await asyncio.to_thread(resend.Emails.send, email_payload)
        logger.info(f"Notification email sent to Vince for submission {submission_id}")
    except Exception as e:
        email_errors.append(f"Vince notification: {str(e)}")
        logger.error(f"Failed to send Vince email: {str(e)}")

    # Send Day 0 drip email immediately
    try:
        day0_template = email_sequence[0]
        day0_subject, day0_html = render_email(day0_template, submission.name)
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [submission.email],
            "subject": day0_subject,
            "html": day0_html,
        })
        await db.email_drip_queue.update_one(
            {"submission_id": submission_id, "emails.seq": 0},
            {"$set": {"emails.$.sent": True, "emails.$.sent_at": datetime.now(timezone.utc).isoformat()}},
        )
        logger.info(f"Day 0 drip email ({flow_type}) sent to {submission.email}")
    except Exception as e:
        email_errors.append(f"Day 0 drip: {str(e)}")
        logger.error(f"Failed to send Day 0 drip email: {str(e)}")

    return {
        "status": "success",
        "submission_id": submission_id,
        "score_level": score_level,
        "score_gaps": submission.score_gaps,
        "emails_sent": len(email_errors) == 0,
        "email_errors": email_errors if email_errors else None,
    }


@router.get("/safety-check/submissions")
async def get_safety_check_submissions():
    """Get all safety check submissions (admin view)."""
    submissions = await db.safety_check_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    return submissions


@router.get("/safety-check/report/{submission_id}")
async def get_safety_check_report(submission_id: str):
    """Download PDF report for a submission."""
    await db.download_events.insert_one({
        "type": "safety_check_pdf",
        "submission_id": submission_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    pdf_path = f"/app/backend/reports/{submission_id}.pdf"
    if not os.path.exists(pdf_path):
        sub = await db.safety_check_submissions.find_one({"id": submission_id}, {"_id": 0})
        if not sub:
            raise HTTPException(status_code=404, detail="Submission not found")
        try:
            pdf_bytes = generate_safety_check_pdf(sub)
            os.makedirs("/app/backend/reports", exist_ok=True)
            with open(pdf_path, "wb") as f:
                f.write(pdf_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
    return FileResponse(pdf_path, media_type="application/pdf", filename="GigLine-SafetyCheck-Report.pdf")


@router.get("/email-drip/status")
async def get_drip_status():
    """Get status of all email drip sequences."""
    queues = await db.email_drip_queue.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return queues


@router.post("/email-drip/process")
async def trigger_drip_processing():
    """Manually trigger drip email processing."""
    sent_count = await process_drip_emails()
    return {"status": "processed", "emails_sent": sent_count}


async def process_drip_emails():
    """Check for and send due drip emails."""
    now = datetime.now(timezone.utc)
    sent_count = 0
    cursor = db.email_drip_queue.find({"emails.sent": False}, {"_id": 0})
    async for drip in cursor:
        flow_type = drip["flow_type"]
        name = drip["name"]
        email = drip["email"]
        score_gaps = drip["score_gaps"]
        _, email_sequence = get_flow_for_score(score_gaps)

        for email_entry in drip["emails"]:
            if email_entry["sent"]:
                continue
            send_at = datetime.fromisoformat(email_entry["send_at"])
            if send_at.tzinfo is None:
                send_at = send_at.replace(tzinfo=timezone.utc)
            if now >= send_at:
                seq = email_entry["seq"]
                try:
                    template = email_sequence[seq]
                    subject, html = render_email(template, name)
                    await asyncio.to_thread(resend.Emails.send, {
                        "from": SENDER_EMAIL,
                        "to": [email],
                        "subject": subject,
                        "html": html,
                    })
                    await db.email_drip_queue.update_one(
                        {"submission_id": drip["submission_id"], "emails.seq": seq},
                        {"$set": {"emails.$.sent": True, "emails.$.sent_at": now.isoformat()}},
                    )
                    sent_count += 1
                    logger.info(f"Drip email seq={seq} ({flow_type}) sent to {email}")
                except Exception as e:
                    await db.email_drip_queue.update_one(
                        {"submission_id": drip["submission_id"], "emails.seq": seq},
                        {"$set": {"emails.$.error": str(e)}},
                    )
                    logger.error(f"Drip email seq={seq} failed for {email}: {str(e)}")
                break
    return sent_count
