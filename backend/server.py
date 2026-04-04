from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)
import resend
from email_sequences import get_flow_for_score, render_email

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe API key
stripe_api_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

# Resend email config
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
VINCE_EMAIL = os.environ.get('VINCE_EMAIL', 'vince@giglinecompliance.com')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Payment Models
class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    service_type: str
    service_name: str
    amount: float
    currency: str = "usd"
    payment_status: str = "pending"
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CheckoutRequest(BaseModel):
    service_type: str  # walkthrough, documentation, incident
    origin_url: str
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None

# Safety Check Submission Model
class SafetyCheckSubmission(BaseModel):
    name: str
    company: str
    phone: str
    email: str
    operation_type: str
    employee_count: str = ""
    score_display: str
    score_gaps: int
    concerned_question: str
    what_pushed: str = ""
    answers: Dict[str, str]

# ============== SERVICE PACKAGES (Server-side only - never trust frontend prices) ==============

SERVICE_PACKAGES = {
    # Full payment options
    "walkthrough_small": {
        "name": "Safety Walkthrough & Top 10 Fixes Report (Small Site)",
        "amount": 650.00,
        "description": "Local small site - single building, 1 shift"
    },
    "walkthrough_standard": {
        "name": "Safety Walkthrough & Top 10 Fixes Report (Standard)",
        "amount": 750.00,
        "description": "Standard site walkthrough with full report"
    },
    "documentation_remote": {
        "name": "Safety Documentation Review & Gap Check (Remote)",
        "amount": 550.00,
        "description": "Remote review - send PDFs/scans for analysis"
    },
    "documentation_onsite": {
        "name": "Safety Documentation Review & Gap Check (On-site)",
        "amount": 750.00,
        "description": "On-site document review with follow-up"
    },
    "incident_standard": {
        "name": "Incident Review & Corrective Action Support (Standard)",
        "amount": 900.00,
        "description": "Non-emergency incident review, single incident"
    },
    "incident_urgent": {
        "name": "Incident Review & Corrective Action Support (Urgent)",
        "amount": 1200.00,
        "description": "High-urgency or complex incident support"
    },
    
    # Deposit options (to lock in scheduling)
    "deposit_walkthrough": {
        "name": "Deposit - Safety Walkthrough (Balance due before visit)",
        "amount": 200.00,
        "description": "Reserve your walkthrough date. Remaining balance due before on-site visit.",
        "is_deposit": True,
        "deposit_for": "walkthrough"
    },
    "deposit_documentation": {
        "name": "Deposit - Documentation Review (Balance due before delivery)",
        "amount": 150.00,
        "description": "Reserve your review slot. Remaining balance due before report delivery.",
        "is_deposit": True,
        "deposit_for": "documentation"
    },
    "deposit_incident": {
        "name": "Deposit - Incident Review (Balance due before engagement)",
        "amount": 300.00,
        "description": "Secure immediate support. Remaining balance due before engagement begins.",
        "is_deposit": True,
        "deposit_for": "incident"
    }
}

# ============== ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "GigLine Safety & Compliance API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# ============== PAYMENT ROUTES ==============

@api_router.get("/services")
async def get_services():
    """Return available service packages with pricing"""
    return SERVICE_PACKAGES

@api_router.post("/payments/checkout")
async def create_checkout_session(request: CheckoutRequest, http_request: Request):
    """Create a Stripe checkout session for a service"""
    
    # Validate service type exists
    if request.service_type not in SERVICE_PACKAGES:
        raise HTTPException(status_code=400, detail=f"Invalid service type: {request.service_type}")
    
    service = SERVICE_PACKAGES[request.service_type]
    
    # Build URLs from frontend origin (never hardcode)
    success_url = f"{request.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{request.origin_url}/services"
    
    # Initialize Stripe checkout
    host_url = str(http_request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    # Create checkout session with server-defined amount
    checkout_request = CheckoutSessionRequest(
        amount=service["amount"],
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "service_type": request.service_type,
            "service_name": service["name"],
            "customer_email": request.customer_email or "",
            "customer_name": request.customer_name or ""
        }
    )
    
    try:
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record BEFORE redirect
        transaction = PaymentTransaction(
            session_id=session.session_id,
            service_type=request.service_type,
            service_name=service["name"],
            amount=service["amount"],
            currency="usd",
            payment_status="pending",
            customer_email=request.customer_email,
            customer_name=request.customer_name,
            metadata={
                "service_type": request.service_type,
                "origin_url": request.origin_url
            }
        )
        
        doc = transaction.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.payment_transactions.insert_one(doc)
        
        return {
            "url": session.url,
            "session_id": session.session_id
        }
        
    except Exception as e:
        logger.error(f"Stripe checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, http_request: Request):
    """Check the status of a payment session"""
    
    # Initialize Stripe checkout
    host_url = str(http_request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction in database
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "payment_status": status.payment_status,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency,
            "metadata": status.metadata
        }
        
    except Exception as e:
        logger.error(f"Payment status check error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check payment status")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update transaction based on webhook event
        if webhook_response.session_id:
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {
                    "$set": {
                        "payment_status": webhook_response.payment_status,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
        
        return {"status": "received"}
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

# ============== SAFETY CHECK ROUTES ==============

@api_router.post("/safety-check/submit")
async def submit_safety_check(submission: SafetyCheckSubmission):
    """Store safety check submission, email Vince, and auto-respond to lead"""
    
    submission_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc)
    
    # Determine score level
    gaps = submission.score_gaps
    if gaps <= 1:
        score_level = "LOW"
    elif gaps <= 3:
        score_level = "MEDIUM"
    else:
        score_level = "HIGH"
    
    # Store in MongoDB
    doc = {
        "id": submission_id,
        "name": submission.name,
        "company": submission.company,
        "phone": submission.phone,
        "email": submission.email,
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
        # For day 0 emails, set send_at slightly in the future so the scheduler picks it up
        # (or we send it immediately below)
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
    
    # Build answer summary for Vince's email
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
    
    # EMAIL 1: Notify Vince
    vince_html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1C2B2B;border-bottom:2px solid #B8972C;padding-bottom:8px;">
        GigLine Safety Check Submission
      </h2>
      <table style="width:100%;margin:16px 0;">
        <tr><td style="padding:4px 0;color:#666;">Name:</td><td style="padding:4px 0;font-weight:bold;">{submission.name}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Company:</td><td style="padding:4px 0;font-weight:bold;">{submission.company}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Operation:</td><td style="padding:4px 0;font-weight:bold;">{submission.operation_type}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Employees:</td><td style="padding:4px 0;">{submission.employee_count or 'Not provided'}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Phone:</td><td style="padding:4px 0;"><a href="tel:{submission.phone}">{submission.phone}</a></td></tr>
        <tr><td style="padding:4px 0;color:#666;">Email:</td><td style="padding:4px 0;"><a href="mailto:{submission.email}">{submission.email}</a></td></tr>
      </table>
      <h3 style="color:#1C2B2B;">Score: {submission.score_gaps} gaps ({score_level})</h3>
      <table style="width:100%;border-collapse:collapse;margin:12px 0;">
        <tr style="background:#1C2B2B;color:#fff;"><th style="padding:8px 12px;text-align:left;">Question</th><th style="padding:8px 12px;text-align:left;">Answer</th></tr>
        {answers_html}
      </table>
      <p style="color:#666;"><strong>Most concerned about:</strong> {submission.concerned_question}</p>
      <p style="color:#666;"><strong>What pushed them:</strong> {submission.what_pushed or 'Not provided'}</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">
      <p style="color:#999;font-size:12px;">Submitted {timestamp.strftime('%B %d, %Y at %I:%M %p')} UTC</p>
    </div>
    """
    
    # Send emails (non-blocking, don't fail submission if email fails)
    email_errors = []
    
    try:
        # Email to Vince (notification)
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"GigLine Safety Check — {submission.operation_type} — {submission.score_gaps} gaps",
            "html": vince_html,
        })
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
        # Mark Day 0 as sent
        await db.email_drip_queue.update_one(
            {"submission_id": submission_id, "emails.seq": 0},
            {"$set": {"emails.$.sent": True, "emails.$.sent_at": datetime.now(timezone.utc).isoformat()}}
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

@api_router.get("/safety-check/submissions")
async def get_safety_check_submissions():
    """Get all safety check submissions (admin view)"""
    submissions = await db.safety_check_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    return submissions

@api_router.get("/email-drip/status")
async def get_drip_status():
    """Get status of all email drip sequences"""
    queues = await db.email_drip_queue.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return queues

@api_router.post("/email-drip/process")
async def trigger_drip_processing():
    """Manually trigger drip email processing"""
    sent_count = await process_drip_emails()
    return {"status": "processed", "emails_sent": sent_count}


async def process_drip_emails():
    """Check for and send due drip emails"""
    now = datetime.now(timezone.utc)
    sent_count = 0
    
    # Find all drip sequences with unsent emails
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
                    
                    # Mark as sent
                    await db.email_drip_queue.update_one(
                        {"submission_id": drip["submission_id"], "emails.seq": seq},
                        {"$set": {
                            "emails.$.sent": True,
                            "emails.$.sent_at": now.isoformat()
                        }}
                    )
                    sent_count += 1
                    logger.info(f"Drip email seq={seq} ({flow_type}) sent to {email}")
                    
                except Exception as e:
                    # Record error but don't stop processing
                    await db.email_drip_queue.update_one(
                        {"submission_id": drip["submission_id"], "emails.seq": seq},
                        {"$set": {"emails.$.error": str(e)}}
                    )
                    logger.error(f"Drip email seq={seq} failed for {email}: {str(e)}")
                
                # Only send one email per sequence per run (respect timing)
                break
    
    return sent_count


async def drip_scheduler():
    """Background task that runs every 30 minutes to process drip emails"""
    while True:
        try:
            sent = await process_drip_emails()
            if sent > 0:
                logger.info(f"Drip scheduler: sent {sent} email(s)")
        except Exception as e:
            logger.error(f"Drip scheduler error: {str(e)}")
        await asyncio.sleep(1800)  # 30 minutes


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Start the drip email scheduler"""
    asyncio.create_task(drip_scheduler())
    logger.info("Drip email scheduler started (runs every 30 minutes)")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
