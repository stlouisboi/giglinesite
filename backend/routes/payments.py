"""Stripe payment routes (checkout, status, webhook)."""

from fastapi import APIRouter, Request, HTTPException
from datetime import datetime, timezone
import logging
import traceback

import stripe

from config import (
    db, USE_NATIVE_STRIPE, stripe_api_key, SERVICE_PACKAGES, STRIPE_WEBHOOK_SECRET,
)
from models import PaymentTransaction, CheckoutRequest

router = APIRouter()
logger = logging.getLogger('gigline')


@router.get("/services")
async def get_services():
    """Return available service packages with pricing."""
    return SERVICE_PACKAGES


@router.post("/payments/checkout")
async def create_checkout_session(request: CheckoutRequest, http_request: Request):
    """Create a Stripe checkout session for a service."""
    if request.service_type not in SERVICE_PACKAGES:
        raise HTTPException(status_code=400, detail=f"Invalid service type: {request.service_type}")

    service = SERVICE_PACKAGES[request.service_type]
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
                    "customer_name": request.customer_name or "",
                },
            )
            session_url = result['url']
            session_id = result['session_id']
        else:
            from config import StripeCheckout, CheckoutSessionRequest, CheckoutSessionResponse
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
                    "customer_name": request.customer_name or "",
                },
            )
            session = await stripe_checkout.create_checkout_session(checkout_request)
            session_url = session.url
            session_id = session.session_id

        transaction = PaymentTransaction(
            session_id=session_id,
            service_type=request.service_type,
            service_name=service["name"],
            amount=service["amount"],
            currency="usd",
            payment_status="pending",
            customer_email=request.customer_email,
            customer_name=request.customer_name,
            metadata={"service_type": request.service_type, "origin_url": request.origin_url},
        )
        doc = transaction.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.payment_transactions.insert_one(doc)

        return {"url": session_url, "session_id": session_id}

    except Exception as e:
        logger.error(f"Stripe checkout error: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to create checkout session: {str(e)}")


@router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, http_request: Request):
    """Check the status of a payment session."""
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
            from config import StripeCheckout, CheckoutStatusResponse
            host_url = str(http_request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            status = await stripe_checkout.get_checkout_status(session_id)
            status_val = status.status
            payment_status = status.payment_status
            amount_total = status.amount_total
            currency = status.currency
            metadata = status.metadata

        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": payment_status, "updated_at": datetime.now(timezone.utc).isoformat()}},
        )

        return {
            "status": status_val,
            "payment_status": payment_status,
            "amount_total": amount_total,
            "currency": currency,
            "metadata": metadata,
        }
    except Exception as e:
        logger.error(f"Payment status check error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check payment status")


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events."""
    try:
        body = await request.body()
        if USE_NATIVE_STRIPE:
            if not STRIPE_WEBHOOK_SECRET:
                logger.error("Stripe webhook rejected: STRIPE_WEBHOOK_SECRET not configured")
                raise HTTPException(status_code=500, detail="Webhook not configured")

            signature = request.headers.get("Stripe-Signature")
            try:
                event_data = stripe.Webhook.construct_event(body, signature, STRIPE_WEBHOOK_SECRET)
            except (ValueError, stripe.error.SignatureVerificationError):
                logger.warning("Stripe webhook signature verification failed")
                raise HTTPException(status_code=400, detail="Invalid signature")

            session_data = event_data['data']['object']
            session_id = session_data.get('id')
            payment_status = session_data.get('payment_status', 'unknown')
        else:
            from config import StripeCheckout
            signature = request.headers.get("Stripe-Signature")
            host_url = str(request.base_url).rstrip('/')
            webhook_url = f"{host_url}/api/webhook/stripe"
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
            webhook_response = await stripe_checkout.handle_webhook(body, signature)
            session_id = webhook_response.session_id
            payment_status = webhook_response.payment_status

        if session_id:
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": payment_status, "updated_at": datetime.now(timezone.utc).isoformat()}},
            )

        return {"status": "received"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")
