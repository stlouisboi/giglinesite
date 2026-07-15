"""Stripe payment routes (status, webhook).

The old self-serve checkout vertical (GET /services, POST /payments/checkout,
and the SERVICE_PACKAGES price list it used) was retired — it was dead on the
frontend (BookingModal.js was never imported) but still reachable directly as
an API, and it charged stale below-market prices. All real purchases now go
through the HazCom / Supervisor Kit checkout routes or the intake-and-quote
flow. /payments/status and /webhook/stripe stay: they're shared plumbing used
by those still-live purchase flows.
"""

from fastapi import APIRouter, Request, HTTPException
from datetime import datetime, timezone
import logging

import stripe

from config import (
    db, USE_NATIVE_STRIPE, stripe_api_key, STRIPE_WEBHOOK_SECRET,
)

router = APIRouter()
logger = logging.getLogger('gigline')


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
