"""Onboarding Booking & Payment Portal routes — GL-PORT-001."""

from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional
import uuid
import logging

import resend
from config import db, USE_NATIVE_STRIPE, stripe_api_key, SENDER_EMAIL, VINCE_EMAIL

router = APIRouter()
logger = logging.getLogger('gigline')

TIERS = {
    "small": {
        "label": "Small",
        "headcount": "1–75",
        "walkthroughPrice": 650,
        "retainerLow": 650,
        "retainerHigh": 750,
        "walkthroughFreq": "Every 6 months",
        "remoteSupport": "Up to 2 hrs/mo",
        "microProject": "1 per quarter",
    },
    "medium": {
        "label": "Medium",
        "headcount": "75–250",
        "walkthroughPrice": 750,
        "retainerLow": 900,
        "retainerHigh": 1100,
        "walkthroughFreq": "Every 4 months",
        "remoteSupport": "~2 hrs/month",
        "microProject": "1 per quarter",
    },
    "large": {
        "label": "Large",
        "headcount": "250+",
        "walkthroughPrice": 900,
        "retainerLow": 1300,
        "retainerHigh": 1500,
        "walkthroughFreq": "Every quarter",
        "remoteSupport": "~3 hrs/month",
        "microProject": "1 per quarter",
    },
}


class BookingCheckoutRequest(BaseModel):
    company: str
    contactName: str
    email: str
    phone: str
    industry: str = ""
    employeeCount: int
    tier: str
    addRetainer: bool = False
    preferredDate: str = ""
    notes: str = ""
    originUrl: str


@router.get("/onboarding/tiers")
async def get_tiers():
    """Return available service tiers."""
    return TIERS


@router.post("/onboarding/checkout")
async def create_booking_checkout(request: BookingCheckoutRequest):
    """Create a Stripe checkout session for a booking."""
    if request.tier not in TIERS:
        raise HTTPException(status_code=400, detail=f"Invalid tier: {request.tier}")

    tier = TIERS[request.tier]
    booking_id = str(uuid.uuid4())

    if request.addRetainer:
        amount = tier["retainerLow"]
        item_name = f"GigLine Compliance Retainer — {tier['label']} (First Month)"
    else:
        amount = tier["walkthroughPrice"]
        item_name = f"GigLine Safety Walkthrough — {tier['label']}"

    success_url = f"{request.originUrl}/onboarding/confirmed?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{request.originUrl}/onboarding"

    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import create_checkout
            result = await create_checkout(
                amount_cents=amount,
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "booking_id": booking_id,
                    "company": request.company,
                    "contact": request.contactName,
                    "email": request.email,
                    "tier": request.tier,
                    "add_retainer": str(request.addRetainer),
                    "service_name": item_name,
                },
            )
            session_url = result['url']
            session_id = result['session_id']
        else:
            from config import StripeCheckout, CheckoutSessionRequest as CSR, CheckoutSessionResponse
            host_url = request.originUrl
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=f"{host_url}/api/webhook/stripe")
            csr = CSR(
                amount=amount,
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "booking_id": booking_id,
                    "company": request.company,
                    "tier": request.tier,
                    "service_name": item_name,
                },
            )
            session = await stripe_checkout.create_checkout_session(csr)
            session_url = session.url
            session_id = session.session_id

        # Store pending booking
        doc = {
            "id": booking_id,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "stripeSessionId": session_id,
            "paymentStatus": "pending",
            "company": request.company,
            "contactName": request.contactName,
            "email": request.email,
            "phone": request.phone,
            "industry": request.industry,
            "employeeCount": request.employeeCount,
            "tier": request.tier,
            "walkthroughPrice": tier["walkthroughPrice"],
            "addRetainer": request.addRetainer,
            "retainerPrice": tier["retainerLow"] if request.addRetainer else 0,
            "preferredDate": request.preferredDate,
            "notes": request.notes,
            "totalCharged": amount,
        }
        await db.gl_bookings.insert_one(doc)

        return {"url": session_url, "sessionId": session_id, "bookingId": booking_id}

    except Exception as e:
        logger.error(f"Onboarding checkout error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")


@router.get("/onboarding/confirm")
async def confirm_booking(session_id: str):
    """Verify payment and send confirmation emails."""
    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import get_checkout_status
            result = await get_checkout_status(session_id)
            payment_status = result['payment_status']
        else:
            from config import StripeCheckout, CheckoutStatusResponse
            stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
            status = await stripe_checkout.get_checkout_status(session_id)
            payment_status = status.payment_status

        booking = await db.gl_bookings.find_one({"stripeSessionId": session_id}, {"_id": 0})
        if not booking:
            return {"confirmed": False, "reason": "Booking not found"}

        if payment_status == "paid":
            await db.gl_bookings.update_one(
                {"stripeSessionId": session_id},
                {"$set": {"paymentStatus": "paid", "paidAt": datetime.now(timezone.utc).isoformat()}},
            )

            # Send emails only once
            if booking.get("paymentStatus") != "paid":
                tier_data = TIERS.get(booking["tier"], {})
                service_label = f"Compliance Retainer — {tier_data.get('label', '')}" if booking.get("addRetainer") else f"Safety Walkthrough — {tier_data.get('label', '')}"

                # Vince notification
                try:
                    resend.Emails.send({
                        "from": SENDER_EMAIL,
                        "to": [VINCE_EMAIL],
                        "subject": f"New GigLine Booking — {booking['company']} · {tier_data.get('label','')} · ${booking['totalCharged']}",
                        "html": f"""
                        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1A1A1A;color:#fff;padding:24px;border-radius:8px;">
                          <h2 style="color:#E8B84B;border-bottom:2px solid #E8B84B;padding-bottom:8px;">New Booking — {booking['company']}</h2>
                          <p style="color:#ccc;"><strong>Contact:</strong> {booking['contactName']}</p>
                          <p style="color:#ccc;"><strong>Email:</strong> <a style="color:#E8B84B;" href="mailto:{booking['email']}">{booking['email']}</a></p>
                          <p style="color:#ccc;"><strong>Phone:</strong> {booking['phone']}</p>
                          <p style="color:#ccc;"><strong>Industry:</strong> {booking.get('industry','N/A')}</p>
                          <p style="color:#ccc;"><strong>Employees:</strong> {booking['employeeCount']}</p>
                          <p style="color:#ccc;"><strong>Service:</strong> {service_label}</p>
                          <p style="color:#ccc;"><strong>Amount:</strong> ${booking['totalCharged']}</p>
                          <p style="color:#ccc;"><strong>Preferred date:</strong> {booking.get('preferredDate','Not specified')}</p>
                          <p style="color:#ccc;"><strong>Notes:</strong> {booking.get('notes','None')}</p>
                        </div>
                        """,
                    })
                except Exception as e:
                    logger.error(f"Booking Vince email error: {e}")

                # Client confirmation
                try:
                    resend.Emails.send({
                        "from": SENDER_EMAIL,
                        "to": [booking["email"]],
                        "subject": "GigLine walkthrough booking confirmed",
                        "html": f"""
                        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1C2B2B;">
                          <h1 style="font-size:22px;">Booking confirmed</h1>
                          <p>Thanks, {booking['contactName']}. Your {service_label.lower()} for <strong>{booking['company']}</strong> is confirmed.</p>
                          <p><strong>Amount paid:</strong> ${booking['totalCharged']}</p>
                          <p><strong>Preferred date:</strong> {booking.get('preferredDate','To be coordinated')}</p>
                          <p><strong>Report delivery:</strong> 48–72 hours after walkthrough</p>
                          <p style="margin-top:16px;">Vince will follow up to confirm the exact date and time.</p>
                          <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
                          <p style="color:#888;font-size:14px;">
                            — Vince Lawrence<br/>GigLine Safety & Compliance<br/>(336) 329-8899<br/>vince@giglinecompliance.com
                          </p>
                        </div>
                        """,
                        "reply_to": VINCE_EMAIL,
                    })
                except Exception as e:
                    logger.error(f"Booking client email error: {e}")

            return {
                "confirmed": True,
                "booking": {
                    "company": booking["company"],
                    "contactName": booking["contactName"],
                    "tier": booking["tier"],
                    "totalCharged": booking["totalCharged"],
                    "addRetainer": booking.get("addRetainer", False),
                    "preferredDate": booking.get("preferredDate", ""),
                },
            }

        return {"confirmed": False, "reason": "Payment not completed"}

    except Exception as e:
        logger.error(f"Booking confirm error: {e}")
        return {"confirmed": False, "reason": "Verification failed"}
