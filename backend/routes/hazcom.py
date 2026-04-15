"""HazCom checkout, verify, download, and delivery email routes."""

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime, timezone
import base64
import logging

import resend
from config import (
    db, USE_NATIVE_STRIPE, stripe_api_key,
    HAZCOM_PRODUCT, HAZCOM_FILES,
    SENDER_EMAIL, VINCE_EMAIL,
)
from models import PaymentTransaction, HazComCheckoutRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.post("/hazcom/checkout")
async def create_hazcom_checkout(request: HazComCheckoutRequest, http_request: Request):
    """Create a Stripe checkout session for the HazCom Starter Pack."""
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
                metadata={"product": "hazcom_starter_pack", "service_name": HAZCOM_PRODUCT["name"]},
            )
            session_url = result['url']
            session_id = result['session_id']
        else:
            from config import StripeCheckout, CheckoutSessionRequest, CheckoutSessionResponse
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            checkout_request = CheckoutSessionRequest(
                amount=HAZCOM_PRODUCT["amount"],
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={"product": "hazcom_starter_pack", "service_name": HAZCOM_PRODUCT["name"]},
            )
            session = await stripe_checkout.create_checkout_session(checkout_request)
            session_url = session.url
            session_id = session.session_id

        transaction = PaymentTransaction(
            session_id=session_id,
            service_type="hazcom_starter_pack",
            service_name=HAZCOM_PRODUCT["name"],
            amount=HAZCOM_PRODUCT["amount"],
            currency="usd",
            payment_status="pending",
            metadata={"product": "hazcom_starter_pack"},
        )
        doc = transaction.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.payment_transactions.insert_one(doc)

        return {"url": session_url, "session_id": session_id}
    except Exception as e:
        logger.error(f"HazCom checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")


@router.get("/hazcom/verify")
async def verify_hazcom_session(session_id: str, http_request: Request):
    """Verify a HazCom purchase session and trigger delivery email."""
    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import get_checkout_status
            result = await get_checkout_status(session_id)
            payment_status = result['payment_status']
            metadata = result['metadata']
        else:
            from config import StripeCheckout, CheckoutStatusResponse
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            status = await stripe_checkout.get_checkout_status(session_id)
            payment_status = status.payment_status
            metadata = status.metadata

        if payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}},
            )
            existing = await db.hazcom_deliveries.find_one({"session_id": session_id})
            if not existing and metadata:
                customer_email = metadata.get("customer_email") or metadata.get("email")
                if customer_email:
                    await _send_hazcom_delivery_email(customer_email, session_id)
            return {"verified": True}

        return {"verified": False}
    except Exception as e:
        logger.error(f"HazCom verify error: {str(e)}")
        return {"verified": False}


@router.get("/hazcom/download/{filename}")
async def download_hazcom_file(filename: str, session_id: str, http_request: Request):
    """Protected download route — validates Stripe session before serving file."""
    if filename not in HAZCOM_FILES:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import get_checkout_status
            result = await get_checkout_status(session_id)
            if result['payment_status'] != "paid":
                raise HTTPException(status_code=403, detail="Payment not verified")
        else:
            from config import StripeCheckout, CheckoutStatusResponse
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            status = await stripe_checkout.get_checkout_status(session_id)
            if status.payment_status != "paid":
                raise HTTPException(status_code=403, detail="Payment not verified")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=403, detail="Unable to verify payment")

    filepath = HAZCOM_FILES[filename]
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found on server")

    await db.download_events.insert_one({
        "type": "hazcom_pdf",
        "filename": filename,
        "session_id": session_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    return FileResponse(path=str(filepath), filename=filename, media_type="application/pdf")


async def _send_hazcom_delivery_email(email: str, session_id: str):
    """Send HazCom delivery email with PDF attachments via Resend."""
    try:
        attachments = []
        for fname, fpath in HAZCOM_FILES.items():
            if fpath.exists():
                with open(fpath, "rb") as f:
                    content = base64.b64encode(f.read()).decode("utf-8")
                attachments.append({"filename": fname, "content": content, "type": "application/pdf"})

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
            "reply_to": VINCE_EMAIL,
        })

        await db.hazcom_deliveries.insert_one({
            "session_id": session_id,
            "email": email,
            "sent_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"HazCom delivery email sent to {email}")

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
            "reply_to": email,
        })
    except Exception as e:
        logger.error(f"HazCom delivery email error: {str(e)}")
