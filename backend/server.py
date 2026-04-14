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
try:
    from emergentintegrations.payments.stripe.checkout import (
        StripeCheckout, 
        CheckoutSessionResponse, 
        CheckoutStatusResponse, 
        CheckoutSessionRequest
    )
    USE_NATIVE_STRIPE = False
except ImportError:
    USE_NATIVE_STRIPE = True

import stripe as stripe_lib
import resend
from email_sequences import get_flow_for_score, render_email
from pdf_generator import generate_safety_check_pdf
import base64

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

@api_router.get("/health")
async def health_check():
    return {"status": "ok", "service": "gigline-backend"}

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
    phone: str = ""
    email: str
    role: str = ""
    operation_type: str = ""
    employee_count: str = ""
    score_display: str
    score_gaps: int
    concerned_question: str = ""
    what_pushed: str = ""
    answers: Dict[str, str]

# Walkthrough Intake Request Model
class WalkthroughRequest(BaseModel):
    name: str
    company: str
    operation_type: str
    location: str
    description: str = ""
    utm_source: str = ""
    utm_medium: str = ""
    utm_campaign: str = ""
    utm_term: str = ""
    utm_content: str = ""

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

# ============== HAZCOM PRODUCT ==============

HAZCOM_PRODUCT = {
    "name": "HazCom Starter Pack — Small Shop Edition",
    "amount": 29.00,
    "description": "Written HazCom Program, SDS Binder Checklist + Index, Training Verification Log (11 pages total)"
}

HAZCOM_FILES = {
    "GL-HAZCOM-001_Written_Program.pdf": ROOT_DIR / "hazcom_files" / "GL-HAZCOM-001_Written_Program.pdf",
    "GL-HAZCOM-002_SDS_Binder_Checklist.pdf": ROOT_DIR / "hazcom_files" / "GL-HAZCOM-002_SDS_Binder_Checklist.pdf",
    "GL-HAZCOM-003_Training_Log.pdf": ROOT_DIR / "hazcom_files" / "GL-HAZCOM-003_Training_Log.pdf",
}

HEAT_STRESS_PDF = ROOT_DIR / "heat_files" / "GL_Heat_Stress_Print_2026.pdf"

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

# ============== WALKTHROUGH REQUEST ROUTES ==============

@api_router.post("/walkthrough/request")
async def submit_walkthrough_request(request: WalkthroughRequest):
    """Accept walkthrough intake form and notify Vince via email"""
    doc = {
        "id": str(uuid.uuid4()),
        "name": request.name,
        "company": request.company,
        "operation_type": request.operation_type,
        "location": request.location,
        "description": request.description,
        "status": "new",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "utm_source": request.utm_source,
        "utm_medium": request.utm_medium,
        "utm_campaign": request.utm_campaign,
        "utm_term": request.utm_term,
        "utm_content": request.utm_content,
    }
    await db.walkthrough_requests.insert_one(doc)

    # Notify Vince via Resend
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"New Walkthrough Request: {request.company}",
            "html": (
                f"<h2>New Walkthrough Request</h2>"
                f"<p><strong>Name:</strong> {request.name}</p>"
                f"<p><strong>Company:</strong> {request.company}</p>"
                f"<p><strong>Operation Type:</strong> {request.operation_type}</p>"
                f"<p><strong>Location:</strong> {request.location}</p>"
                f"<p><strong>Description:</strong> {request.description or 'N/A'}</p>"
                f"{'<p><strong>Source:</strong> ' + request.utm_source + ' / ' + request.utm_medium + ' / ' + request.utm_campaign + '</p>' if request.utm_source else ''}"
                f"<p><em>Submitted at {doc['timestamp']}</em></p>"
            ),
        })
    except Exception as e:
        logging.error(f"Failed to send walkthrough notification email: {e}")

    return {"status": "ok", "id": doc["id"]}

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
    
    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import create_checkout
            result = await create_checkout(
                amount_cents=service["amount"],
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
            session_url = result['url']
            session_id = result['session_id']
        else:
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
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
            session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
            session_url = session.url
            session_id = session.session_id
        
        # Create payment transaction record BEFORE redirect
        transaction = PaymentTransaction(
            session_id=session_id,
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
            "url": session_url,
            "session_id": session_id
        }
        
    except Exception as e:
        import traceback
        logger.error(f"Stripe checkout error: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to create checkout session: {str(e)}")

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, http_request: Request):
    """Check the status of a payment session"""
    
    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import get_checkout_status
            result = await get_checkout_status(session_id)
            status_val = result['status']
            payment_status = result['payment_status']
            amount_total = result['amount_total']
            currency = result['currency']
            metadata = result['metadata']
        else:
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
            status_val = status.status
            payment_status = status.payment_status
            amount_total = status.amount_total
            currency = status.currency
            metadata = status.metadata
        
        # Update transaction in database
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "payment_status": payment_status,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        return {
            "status": status_val,
            "payment_status": payment_status,
            "amount_total": amount_total,
            "currency": currency,
            "metadata": metadata
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
        
        if USE_NATIVE_STRIPE:
            # For native stripe, just parse the event directly
            import json
            event_data = json.loads(body)
            event_type = event_data.get('type', '')
            session_data = event_data.get('data', {}).get('object', {})
            session_id = session_data.get('id')
            payment_status = session_data.get('payment_status', 'unknown')
        else:
            host_url = str(request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            webhook_response = await stripe_checkout.handle_webhook(body, signature)
            session_id = webhook_response.session_id
            payment_status = webhook_response.payment_status
        
        # Update transaction based on webhook event
        if session_id:
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "payment_status": payment_status,
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }
                }
            )
        
        return {"status": "received"}
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

# ============== HAZCOM ROUTES ==============

class HazComCheckoutRequest(BaseModel):
    origin_url: str

@api_router.post("/hazcom/checkout")
async def create_hazcom_checkout(request: HazComCheckoutRequest, http_request: Request):
    """Create a Stripe checkout session for the HazCom Starter Pack"""
    
    success_url = f"{request.origin_url}/hazcom/thank-you?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{request.origin_url}/hazcom"
    
    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import create_checkout
            result = await create_checkout(
                amount_cents=HAZCOM_PRODUCT["amount"],
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "product": "hazcom_starter_pack",
                    "service_name": HAZCOM_PRODUCT["name"]
                }
            )
            session_url = result['url']
            session_id = result['session_id']
        else:
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            checkout_request = CheckoutSessionRequest(
                amount=HAZCOM_PRODUCT["amount"],
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "product": "hazcom_starter_pack",
                    "service_name": HAZCOM_PRODUCT["name"]
                }
            )
            session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
            session_url = session.url
            session_id = session.session_id
        
        # Record the transaction
        transaction = PaymentTransaction(
            session_id=session_id,
            service_type="hazcom_starter_pack",
            service_name=HAZCOM_PRODUCT["name"],
            amount=HAZCOM_PRODUCT["amount"],
            currency="usd",
            payment_status="pending",
            metadata={"product": "hazcom_starter_pack"}
        )
        doc = transaction.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.payment_transactions.insert_one(doc)
        
        return {"url": session_url, "session_id": session_id}
    except Exception as e:
        logger.error(f"HazCom checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@api_router.get("/hazcom/verify")
async def verify_hazcom_session(session_id: str, http_request: Request):
    """Verify a HazCom purchase session and trigger delivery email"""
    
    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import get_checkout_status
            result = await get_checkout_status(session_id)
            payment_status = result['payment_status']
            metadata = result['metadata']
        else:
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
            payment_status = status.payment_status
            metadata = status.metadata
        
        if payment_status == "paid":
            # Update transaction
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}}
            )
            
            # Send delivery email (only once — check if already sent)
            existing = await db.hazcom_deliveries.find_one({"session_id": session_id})
            if not existing and metadata:
                customer_email = metadata.get("customer_email") or metadata.get("email")
                if customer_email:
                    await send_hazcom_delivery_email(customer_email, session_id)
            
            return {"verified": True}
        
        return {"verified": False}
    except Exception as e:
        logger.error(f"HazCom verify error: {str(e)}")
        return {"verified": False}

from fastapi.responses import FileResponse

@api_router.get("/hazcom/download/{filename}")
async def download_hazcom_file(filename: str, session_id: str, http_request: Request):
    """Protected download route — validates Stripe session before serving file"""
    
    if filename not in HAZCOM_FILES:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Verify payment
    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import get_checkout_status
            result = await get_checkout_status(session_id)
            if result['payment_status'] != "paid":
                raise HTTPException(status_code=403, detail="Payment not verified")
        else:
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
            if status.payment_status != "paid":
                raise HTTPException(status_code=403, detail="Payment not verified")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=403, detail="Unable to verify payment")
    
    filepath = HAZCOM_FILES[filename]
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found on server")
    
    # Track the download
    await db.download_events.insert_one({
        "type": "hazcom_pdf",
        "filename": filename,
        "session_id": session_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    
    return FileResponse(
        path=str(filepath),
        filename=filename,
        media_type="application/pdf"
    )

async def send_hazcom_delivery_email(email: str, session_id: str):
    """Send HazCom delivery email with PDF attachments via Resend"""
    try:
        attachments = []
        for fname, fpath in HAZCOM_FILES.items():
            if fpath.exists():
                with open(fpath, "rb") as f:
                    content = base64.b64encode(f.read()).decode("utf-8")
                attachments.append({
                    "filename": fname,
                    "content": content,
                    "type": "application/pdf"
                })
        
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": "Your HazCom Starter Pack is ready",
            "html": f"""
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B;">
                <h1 style="font-size: 24px; margin-bottom: 16px;">Your HazCom Starter Pack</h1>
                <p>Thanks for your purchase. Your files are attached to this email.</p>
                
                <h3 style="margin-top: 24px; margin-bottom: 8px;">WHAT'S INCLUDED:</h3>
                <ul style="color: #555;">
                    <li>GL-HAZCOM-001 — Written HazCom Program (5 pages)</li>
                    <li>GL-HAZCOM-002 — SDS Binder Checklist + Index (4 pages)</li>
                    <li>GL-HAZCOM-003 — Training Verification Log (2 pages)</li>
                </ul>
                
                <h3 style="margin-top: 24px; margin-bottom: 8px;">NEXT STEPS:</h3>
                <ol style="color: #555;">
                    <li>Open each PDF and fill in your company name</li>
                    <li>Print and place in your SDS binder</li>
                    <li>Train employees and document on the training log</li>
                    <li>Review annually or when chemicals change</li>
                </ol>
                
                <p style="margin-top: 24px;">If you have questions about implementation, reply to this email.</p>
                
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    — Vince Lawrence<br/>
                    GigLine Safety & Compliance<br/>
                    (336) 329-8899<br/>
                    giglinecompliance.com
                </p>
            </div>
            """,
            "attachments": attachments,
            "reply_to": VINCE_EMAIL
        })
        
        # Record delivery
        await db.hazcom_deliveries.insert_one({
            "session_id": session_id,
            "email": email,
            "sent_at": datetime.now(timezone.utc).isoformat()
        })
        
        logger.info(f"HazCom delivery email sent to {email}")
        
        # Also notify Vince
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"HazCom Starter Pack — New Purchase ({email})",
            "html": f"""
            <p>New HazCom Starter Pack purchase:</p>
            <p><strong>Email:</strong> {email}<br/>
            <strong>Amount:</strong> $29.00<br/>
            <strong>Session:</strong> {session_id}</p>
            """,
            "reply_to": email
        })
        
    except Exception as e:
        logger.error(f"HazCom delivery email error: {str(e)}")

# ============== HEAT GUIDE ROUTES ==============

class HeatGuideRequest(BaseModel):
    email: str

@api_router.post("/heat-guide/submit")
async def submit_heat_guide(request: HeatGuideRequest):
    """Capture email and send Heat Stress Action Template via Resend"""
    email = request.email.strip().lower()
    
    # Store the lead
    await db.heat_guide_leads.insert_one({
        "email": email,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Track the download
    await db.download_events.insert_one({
        "type": "heat_guide",
        "email": email,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    
    # Send PDF via Resend
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
            "reply_to": VINCE_EMAIL
        })
        
        # Notify Vince
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"Heat Guide Download — {email}",
            "html": f"<p>New heat stress template download:</p><p><strong>Email:</strong> {email}</p>",
            "reply_to": email
        })
        
        logger.info(f"Heat guide sent to {email}")
        return {"success": True, "message": "Template sent to your email"}
        
    except Exception as e:
        logger.error(f"Heat guide email error: {str(e)}")
        return {"success": True, "message": "Template sent to your email"}

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
    try:
        pdf_bytes = generate_safety_check_pdf(pdf_data)
        pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")
        # Store PDF reference
        await db.safety_check_submissions.update_one(
            {"id": submission_id},
            {"$set": {"has_pdf": True}}
        )
        # Save PDF to disk for download endpoint
        import os
        pdf_dir = "/app/backend/reports"
        os.makedirs(pdf_dir, exist_ok=True)
        with open(f"{pdf_dir}/{submission_id}.pdf", "wb") as f:
            f.write(pdf_bytes)
        logger.info(f"PDF report generated for submission {submission_id}")
    except Exception as e:
        pdf_bytes = None
        pdf_b64 = None
        logger.error(f"PDF generation failed: {str(e)}")
    
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
    
    # Send emails (non-blocking, don't fail submission if email fails)
    email_errors = []
    
    try:
        # Email to Vince (notification) with PDF attachment
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

@api_router.get("/safety-check/report/{submission_id}")
async def get_safety_check_report(submission_id: str):
    """Download PDF report for a submission"""
    from fastapi.responses import FileResponse
    # Track the download
    await db.download_events.insert_one({
        "type": "safety_check_pdf",
        "submission_id": submission_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    pdf_path = f"/app/backend/reports/{submission_id}.pdf"
    if not os.path.exists(pdf_path):
        # Try to regenerate
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
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"GigLine-SafetyCheck-Report.pdf"
    )

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


# ============== ADMIN DASHBOARD ROUTES ==============

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "gigline2026")

@api_router.post("/admin/login")
async def admin_login(body: dict):
    """Simple password auth for admin dashboard"""
    if body.get("password") != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"status": "ok", "token": ADMIN_PASSWORD}

@api_router.get("/admin/stats")
async def admin_stats(token: str = ""):
    """Dashboard stats: leads, downloads, risk breakdown"""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    now = datetime.now(timezone.utc)
    seven_days_ago = (now - timedelta(days=7)).isoformat()
    thirty_days_ago = (now - timedelta(days=30)).isoformat()

    # Safety Check submissions
    total_checks = await db.safety_check_submissions.count_documents({})
    checks_7d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": seven_days_ago}})
    checks_30d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": thirty_days_ago}})
    high_risk = await db.safety_check_submissions.count_documents({"score_level": "HIGH"})
    medium_risk = await db.safety_check_submissions.count_documents({"score_level": "MEDIUM"})
    low_risk = await db.safety_check_submissions.count_documents({"score_level": "LOW"})

    # Walkthrough requests
    total_walkthroughs = await db.walkthrough_requests.count_documents({})
    walkthroughs_7d = await db.walkthrough_requests.count_documents({"timestamp": {"$gte": seven_days_ago}})

    # Downloads
    total_downloads = await db.download_events.count_documents({})
    sc_downloads = await db.download_events.count_documents({"type": "safety_check_pdf"})
    hazcom_downloads = await db.download_events.count_documents({"type": "hazcom_pdf"})
    heat_downloads = await db.download_events.count_documents({"type": "heat_guide"})
    downloads_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}})

    # Heat guide leads
    heat_leads = await db.heat_guide_leads.count_documents({})

    return {
        "safety_checks": {"total": total_checks, "last_7d": checks_7d, "last_30d": checks_30d},
        "risk_breakdown": {"high": high_risk, "medium": medium_risk, "low": low_risk},
        "walkthrough_requests": {"total": total_walkthroughs, "last_7d": walkthroughs_7d},
        "downloads": {
            "total": total_downloads,
            "last_7d": downloads_7d,
            "safety_check_pdfs": sc_downloads,
            "hazcom_pdfs": hazcom_downloads,
            "heat_guide": heat_downloads,
        },
        "heat_guide_leads": heat_leads,
    }

@api_router.get("/admin/leads")
async def admin_leads(token: str = "", limit: int = 50):
    """Recent leads: safety checks + walkthrough requests"""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    checks = await db.safety_check_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    walkthroughs = await db.walkthrough_requests.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    heat_leads = await db.heat_guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)

    return {"safety_checks": checks, "walkthrough_requests": walkthroughs, "heat_guide_leads": heat_leads}

@api_router.get("/admin/downloads")
async def admin_downloads(token: str = "", limit: int = 100):
    """Recent download events"""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    events = await db.download_events.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    return {"events": events}

@api_router.post("/admin/send-summary")
async def send_admin_summary(token: str = ""):
    """Manually trigger the weekly summary email to Vince"""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    await send_weekly_summary()
    return {"status": "sent"}

async def send_weekly_summary():
    """Send weekly activity summary email to Vince"""
    now = datetime.now(timezone.utc)
    seven_days_ago = (now - timedelta(days=7)).isoformat()

    checks_7d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": seven_days_ago}})
    high_7d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": seven_days_ago}, "score_level": "HIGH"})
    walkthroughs_7d = await db.walkthrough_requests.count_documents({"timestamp": {"$gte": seven_days_ago}})
    downloads_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}})
    sc_dl_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}, "type": "safety_check_pdf"})
    hazcom_dl_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}, "type": "hazcom_pdf"})
    heat_dl_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}, "type": "heat_guide"})

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1C2B2B;border-bottom:2px solid #B8972C;padding-bottom:8px;">
        GigLine Weekly Summary
      </h2>
      <p style="color:#666;">Week ending {now.strftime('%B %d, %Y')}</p>

      <h3 style="color:#1C2B2B;margin-top:20px;">Leads</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;">Safety Checks completed</td><td style="font-weight:bold;text-align:right;">{checks_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#c0392b;font-weight:bold;">  — HIGH risk</td><td style="font-weight:bold;text-align:right;color:#c0392b;">{high_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Walkthrough requests</td><td style="font-weight:bold;text-align:right;">{walkthroughs_7d}</td></tr>
      </table>

      <h3 style="color:#1C2B2B;margin-top:20px;">Downloads</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;">Safety Check PDFs</td><td style="font-weight:bold;text-align:right;">{sc_dl_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">HazCom Starter Packs</td><td style="font-weight:bold;text-align:right;">{hazcom_dl_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Heat Guide downloads</td><td style="font-weight:bold;text-align:right;">{heat_dl_7d}</td></tr>
        <tr style="border-top:1px solid #ddd;"><td style="padding:6px 0;font-weight:bold;">Total downloads</td><td style="font-weight:bold;text-align:right;">{downloads_7d}</td></tr>
      </table>

      <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">
      <p style="color:#999;font-size:12px;">Automated summary from GigLine Safety & Compliance</p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"GigLine Weekly Summary — {checks_7d} checks, {walkthroughs_7d} walkthrough requests",
            "html": html,
        })
        logger.info("Weekly summary email sent")
    except Exception as e:
        logger.error(f"Weekly summary email failed: {e}")

async def weekly_summary_scheduler():
    """Send weekly summary every Monday at 8 AM EST"""
    while True:
        now = datetime.now(timezone.utc)
        # Check if Monday and ~13:00 UTC (8 AM EST)
        if now.weekday() == 0 and now.hour == 13 and now.minute < 30:
            await send_weekly_summary()
        await asyncio.sleep(1800)  # Check every 30 min

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
    """Start the drip email scheduler and weekly summary"""
    asyncio.create_task(drip_scheduler())
    asyncio.create_task(weekly_summary_scheduler())
    logger.info("Drip email scheduler started (runs every 30 minutes)")
    logger.info("Weekly summary scheduler started (runs Monday 8 AM EST)")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
