"""Stripe webhook receiver.

Historical checkout routes (`/api/payments/checkout`, `/api/services`,
`/api/payments/status/{id}`) were removed in Feb 2026 alongside the stale
SERVICE_PACKAGES dictionary. Active checkout flows now live under
`/api/checkout/*` (Citation-Proof Kits, Supervisor Kit, HazCom, etc.).

This module now exposes only `POST /api/webhook/stripe` and hardens it with:

  1. Stripe signature verification via ``stripe.Webhook.construct_event``.
     Missing header, malformed body, wrong signature, or wrong secret all
     produce 400 with no side effects.
  2. Idempotency on Stripe event id via a MongoDB unique index. Duplicate
     replays return 200 without re-touching payment_transactions.
"""

from datetime import datetime, timezone
import logging

from fastapi import APIRouter, Request, HTTPException
import stripe as stripe_lib
from pymongo.errors import DuplicateKeyError

from config import db, STRIPE_WEBHOOK_SECRET, stripe_api_key

router = APIRouter()
logger = logging.getLogger('gigline')

# One-time unique index on the Stripe event id so a duplicate delivery cannot
# double-fulfill. `create_index` is idempotent so it is safe to call at import.
_WEBHOOK_EVENTS_COLL = "gl_stripe_webhook_events"

_INDEX_INITIALIZED = False


async def _ensure_index() -> None:
    global _INDEX_INITIALIZED
    if _INDEX_INITIALIZED:
        return
    try:
        await db[_WEBHOOK_EVENTS_COLL].create_index("event_id", unique=True)
        _INDEX_INITIALIZED = True
    except Exception as e:
        # Not fatal — DuplicateKeyError on insert will still guard idempotency.
        logger.warning(f"Could not ensure webhook events index: {e}")


@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Receive and verify a Stripe webhook.

    Fail-closed rules:
      * ``STRIPE_WEBHOOK_SECRET`` must be configured; otherwise every request
        is rejected with 400 so an attacker cannot forge fulfillment while the
        env var is missing.
      * ``Stripe-Signature`` header must be present.
      * Signature must verify against the raw body and the configured secret.
    """
    if not STRIPE_WEBHOOK_SECRET:
        logger.error("Stripe webhook received but STRIPE_WEBHOOK_SECRET is not configured")
        raise HTTPException(status_code=400, detail="Webhook secret not configured")

    signature = request.headers.get("stripe-signature") or request.headers.get("Stripe-Signature")
    if not signature:
        logger.warning("Stripe webhook rejected: missing signature header")
        raise HTTPException(status_code=400, detail="Missing signature")

    raw_body = await request.body()

    stripe_lib.api_key = stripe_api_key

    try:
        event = stripe_lib.Webhook.construct_event(
            payload=raw_body,
            sig_header=signature,
            secret=STRIPE_WEBHOOK_SECRET,
        )
    except stripe_lib.error.SignatureVerificationError as e:
        logger.warning(f"Stripe webhook rejected: signature verification failed ({e})")
        raise HTTPException(status_code=400, detail="Invalid signature")
    except ValueError as e:
        logger.warning(f"Stripe webhook rejected: malformed payload ({e})")
        raise HTTPException(status_code=400, detail="Malformed payload")
    except Exception as e:  # pragma: no cover — defensive
        logger.error(f"Stripe webhook verification error: {e}")
        raise HTTPException(status_code=400, detail="Verification failed")

    event_id = event.get("id")
    event_type = event.get("type", "")
    if not event_id:
        raise HTTPException(status_code=400, detail="Event missing id")

    # Idempotency guard — record the event id atomically. Duplicate → 200 no-op.
    await _ensure_index()
    now_iso = datetime.now(timezone.utc).isoformat()
    try:
        await db[_WEBHOOK_EVENTS_COLL].insert_one({
            "event_id": event_id,
            "event_type": event_type,
            "received_at": now_iso,
        })
    except DuplicateKeyError:
        logger.info(f"Stripe webhook duplicate ignored: id={event_id} type={event_type}")
        return {"status": "duplicate"}

    # Update payment status when the event carries a checkout session object.
    session_data = (event.get("data") or {}).get("object") or {}
    session_id = session_data.get("id")
    payment_status = session_data.get("payment_status") or session_data.get("status") or "unknown"

    if session_id:
        try:
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "payment_status": payment_status,
                    "updated_at": now_iso,
                }},
            )
        except Exception as e:
            logger.error(f"Payment status update failed for session={session_id}: {e}")

    logger.info(f"Stripe webhook processed: id={event_id} type={event_type} session={session_id}")
    return {"status": "received", "event_id": event_id}
