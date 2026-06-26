"""Supervisor Safety Starter System — checkout stub routes (GL-WEB-015).

Stripe wiring is intentionally deferred to a second pass. These routes
accept an order intent, persist it to MongoDB, and return a placeholder
response so the frontend Buy buttons can render success/failure states.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import logging
import secrets

from config import db

router = APIRouter()
logger = logging.getLogger('gigline')


KIT_PRICES = {
    "digital": {"amount_cents": 60000, "label": "Digital Kit", "sku": "supervisor-kit-digital"},
    "physical": {"amount_cents": 67500, "label": "Physical Kit", "sku": "supervisor-kit-physical"},
}


class ShippingAddress(BaseModel):
    name: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "US"


class KitCheckoutRequest(BaseModel):
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    phone: Optional[str] = None
    shipping_address: Optional[ShippingAddress] = None
    attribution: Optional[dict] = None


async def _record_kit_order(variant: str, payload: KitCheckoutRequest) -> str:
    """Persist a kit order intent and return its order token."""
    if variant not in KIT_PRICES:
        raise HTTPException(status_code=400, detail=f"Unknown kit variant: {variant}")

    if variant == "physical" and not payload.shipping_address:
        # We accept the intent but flag for Vince to capture the address by phone.
        # When Stripe is wired in pass 2, Stripe Checkout handles the address.
        logger.info("Physical kit order received without shipping address — Vince will capture by phone.")

    order_token = secrets.token_urlsafe(8)
    doc = {
        "order_token": order_token,
        "variant": variant,
        "sku": KIT_PRICES[variant]["sku"],
        "amount_cents": KIT_PRICES[variant]["amount_cents"],
        "label": KIT_PRICES[variant]["label"],
        "email": payload.email,
        "company_name": payload.company_name,
        "phone": payload.phone,
        "shipping_address": payload.shipping_address.dict() if payload.shipping_address else None,
        "attribution": payload.attribution,
        "status": "pending_payment",  # stripe wired in pass 2 will flip this
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.gl_supervisor_kit_orders.insert_one(doc)
    return order_token


@router.post("/checkout/supervisor-kit-digital")
async def checkout_digital(payload: KitCheckoutRequest):
    """Stub checkout for the $600 digital kit. Stripe wired in a second pass."""
    order_token = await _record_kit_order("digital", payload)
    logger.info(f"Supervisor kit DIGITAL order intent recorded: {order_token}")
    return {
        "ok": True,
        "order_token": order_token,
        "variant": "digital",
        "amount_cents": KIT_PRICES["digital"]["amount_cents"],
        "message": (
            "Order received. Stripe checkout is not wired yet — Vince will reach "
            "out within 1 business day to confirm payment and deliver the PDFs."
        ),
    }


@router.post("/checkout/supervisor-kit-physical")
async def checkout_physical(payload: KitCheckoutRequest):
    """Stub checkout for the $675 physical kit. Stripe + address capture in pass 2."""
    order_token = await _record_kit_order("physical", payload)
    logger.info(f"Supervisor kit PHYSICAL order intent recorded: {order_token}")
    return {
        "ok": True,
        "order_token": order_token,
        "variant": "physical",
        "amount_cents": KIT_PRICES["physical"]["amount_cents"],
        "message": (
            "Order received. Stripe checkout is not wired yet — Vince will reach "
            "out within 1 business day to confirm payment and shipping address."
        ),
    }
