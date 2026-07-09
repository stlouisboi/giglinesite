"""GigLine Supervisor Safety OS — Stripe checkout + Resend delivery (GL-WEB-015 pass 2).

Routes:
  POST /api/checkout/supervisor-kit-digital   → create Stripe session ($600, no shipping)
  POST /api/checkout/supervisor-kit-physical  → create Stripe session ($700, US shipping capture, free USPS Priority)
  GET  /api/supervisor-kit/verify             → poll on success page; sends confirmation email + MailerLite tag

Note: until the 11 PDFs are uploaded, the digital confirmation email tells the
buyer Vince will email the PDFs within 1 business day. Vince also gets a
notification email with the order details either way.
"""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import asyncio
import logging

import base64
import resend
from config import (
    db, USE_NATIVE_STRIPE, stripe_api_key,
    SUPERVISOR_KIT_PRODUCTS, SUPERVISOR_KIT_FILES, SENDER_EMAIL, VINCE_EMAIL,
    SUPERVISOR_KIT_ENABLED,
)
from integrations.mailerlite import add_to_kit_buyer

router = APIRouter()
logger = logging.getLogger('gigline')


def _require_enabled():
    """Return 503 if the Supervisor Safety OS is soft-disabled via feature flag."""
    if not SUPERVISOR_KIT_ENABLED:
        raise HTTPException(
            status_code=503,
            detail="The GigLine Supervisor Safety OS is temporarily unavailable. Call (336) 329-8899 for details.",
        )


class KitCheckoutRequest(BaseModel):
    origin_url: str
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    attribution: Optional[dict] = None


async def _create_kit_session(variant: str, payload: KitCheckoutRequest, http_request: Request):
    if variant not in SUPERVISOR_KIT_PRODUCTS:
        raise HTTPException(status_code=400, detail=f"Unknown kit variant: {variant}")

    product = SUPERVISOR_KIT_PRODUCTS[variant]
    success_url = f"{payload.origin_url}/supervisor-kit/thank-you?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payload.origin_url}/supervisor-kit"

    metadata = {
        "product": "supervisor_kit",
        "variant": variant,
        "sku": product["sku"],
        "company_name": payload.company_name or "",
    }
    if payload.attribution and isinstance(payload.attribution, dict):
        first = payload.attribution.get("firstTouch") or {}
        if first.get("utm_source"):
            metadata["first_touch_source"] = first.get("utm_source", "")[:100]
        if first.get("utm_campaign"):
            metadata["first_touch_campaign"] = first.get("utm_campaign", "")[:100]

    try:
        if USE_NATIVE_STRIPE:
            from stripe_native import create_checkout
            result = await create_checkout(
                amount_cents=product["amount_cents"],
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata,
                customer_email=payload.email,
                collect_shipping=product["needs_shipping"],
                product_name=product["name"],
            )
        else:
            # emergentintegrations Stripe path (does not natively support shipping in our
            # current adapter) — fall back to native stripe SDK for the kit specifically.
            from stripe_native import create_checkout
            result = await create_checkout(
                amount_cents=product["amount_cents"],
                currency="usd",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata,
                customer_email=payload.email,
                collect_shipping=product["needs_shipping"],
                product_name=product["name"],
            )

        await db.gl_supervisor_kit_orders.insert_one({
            "session_id": result["session_id"],
            "variant": variant,
            "sku": product["sku"],
            "amount_cents": product["amount_cents"],
            "label": product["name"],
            "email": payload.email,
            "company_name": payload.company_name,
            "attribution": payload.attribution,
            "status": "pending_payment",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

        logger.info(f"Supervisor kit {variant.upper()} Stripe session created: {result['session_id']}")
        return {"url": result["url"], "session_id": result["session_id"]}
    except Exception as e:
        logger.error(f"Supervisor kit checkout error ({variant}): {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")


@router.post("/checkout/supervisor-kit-digital")
async def checkout_digital(payload: KitCheckoutRequest, http_request: Request):
    """Create Stripe Checkout session for the $600 digital kit."""
    _require_enabled()
    return await _create_kit_session("digital", payload, http_request)


@router.post("/checkout/supervisor-kit-physical")
async def checkout_physical(payload: KitCheckoutRequest, http_request: Request):
    """Create Stripe Checkout session for the $700 physical kit (US shipping captured at checkout, free USPS Priority)."""
    _require_enabled()
    return await _create_kit_session("physical", payload, http_request)


@router.get("/supervisor-kit/verify")
async def verify_kit_session(session_id: str, http_request: Request):
    """
    Called by the /supervisor-kit/thank-you page on load.
    Verifies payment status, sends confirmation email + Vince notification,
    and tags buyer in MailerLite. Idempotent — safe to call multiple times.
    """
    try:
        from stripe_native import get_checkout_status
        result = await get_checkout_status(session_id)
        payment_status = result.get("payment_status")
        metadata = result.get("metadata") or {}
        variant = metadata.get("variant")

        if payment_status != "paid":
            return {"verified": False, "payment_status": payment_status}

        if variant not in SUPERVISOR_KIT_PRODUCTS:
            logger.warning(f"verify: unknown variant in session metadata: {variant}")
            return {"verified": False}

        # Idempotency: only send the email + tag once.
        existing = await db.gl_supervisor_kit_orders.find_one(
            {"session_id": session_id, "status": "paid"}
        )

        customer_email = result.get("customer_email") or None
        customer_name = result.get("customer_name") or ""
        shipping = result.get("shipping_details") or None

        await db.gl_supervisor_kit_orders.update_one(
            {"session_id": session_id},
            {"$set": {
                "status": "paid",
                "payment_status": "paid",
                "customer_email": customer_email,
                "customer_name": customer_name,
                "customer_phone": result.get("customer_phone"),
                "shipping_details": shipping,
                "amount_total_cents": result.get("amount_total"),
                "paid_at": datetime.now(timezone.utc).isoformat(),
            }},
            upsert=True,
        )

        if not existing and customer_email:
            await _send_kit_buyer_email(variant, customer_email, customer_name)
            await _send_vince_kit_notification(
                variant, customer_email, customer_name,
                result.get("customer_phone"), shipping, metadata,
                result.get("amount_total"),
            )
            asyncio.create_task(add_to_kit_buyer(
                email=customer_email,
                variant=variant,
                name=customer_name,
                company=metadata.get("company_name", ""),
            ))

        return {
            "verified": True,
            "variant": variant,
            "amount_total": result.get("amount_total"),
        }
    except Exception as e:
        logger.error(f"Supervisor kit verify error: {e}")
        return {"verified": False}


async def _send_kit_buyer_email(variant: str, email: str, customer_name: str) -> None:
    """Send the buyer confirmation email via Resend.

    Digital variant attaches the complete GigLine Supervisor Safety OS v1 PDF
    (17-document, 20-page master). Individual per-doc files exist on disk but are
    not attached in v1 to keep the sales promise clean ("one system, one file").
    Physical variant gets a confirmation message; the printed kit ships in the binder.
    """
    if variant == "digital":
        # Attach the complete 20-page master PDF (single deliverable in v1).
        attachments = []
        for fname, fpath in SUPERVISOR_KIT_FILES.items():
            if fpath.exists():
                with open(fpath, "rb") as f:
                    content = base64.b64encode(f.read()).decode("utf-8")
                attachments.append({"filename": fname, "content": content, "type": "application/pdf"})
            else:
                logger.warning(f"Supervisor kit PDF missing on disk: {fname}")

        subject = "Your GigLine Supervisor Safety OS"
        body_html = """
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B; line-height: 1.6;">
                <h1 style="font-size: 22px; margin-bottom: 12px; color: #0A1628;">Your order is confirmed.</h1>
                <p>The complete <strong>GigLine Supervisor Safety OS</strong> — a 17-document, 20-page supervisor safety documentation system — is attached to this email as a single print-ready PDF (<em>GigLine_Supervisor_Safety_OS_v1.pdf</em>), along with every individual document as its own file so you can reprint any single page whenever you need it.</p>
                <p>Print it, put it in a supervisor's hands, and start the rhythm: <strong>inspect &rarr; document &rarr; assign &rarr; verify &rarr; review.</strong></p>
                <h3 style="margin-top: 22px; margin-bottom: 8px; font-size: 14px; letter-spacing: 0.05em;">WHAT'S INSIDE</h3>
                <ol style="color: #444; padding-left: 20px;">
                    <li>SS-01 &mdash; Start Here / How to Use This System</li>
                    <li>SS-02 &mdash; 30-Day Action Checklist</li>
                    <li>SS-03A / SS-03B &mdash; Chemical Inventory Log (Example + Blank)</li>
                    <li>SS-04A / SS-04B &mdash; SDS Index (Example + Blank)</li>
                    <li>SS-05 &mdash; Written Hazard Communication Program</li>
                    <li>SS-06A / SS-06B &mdash; Monthly Safety Inspection Checklist (Example + Blank)</li>
                    <li>SS-07A / SS-07B &mdash; Corrective Action Log (Example + Blank)</li>
                    <li>SS-08 &mdash; OSHA Coverage Map</li>
                    <li>SS-09A &mdash; Employee HazCom Toolbox Talk + Attendance</li>
                    <li>SS-09B &mdash; Employee HazCom Knowledge Check</li>
                    <li>SS-10 &mdash; Emergency Response / One Phone Call Card</li>
                    <li>SS-11 &mdash; 90-Day Implementation Roadmap</li>
                    <li>SS-12 &mdash; Next Step / Book a GigLine Review</li>
                </ol>
                <h3 style="margin-top: 22px; margin-bottom: 8px; font-size: 14px; letter-spacing: 0.05em;">FIRST STEPS</h3>
                <ol style="color: #444; padding-left: 20px;">
                    <li>Open the attached PDF. Start with <strong>SS-01</strong> to plan your rollout.</li>
                    <li>Work through <strong>SS-02</strong> (30-Day Action Checklist) week-by-week.</li>
                    <li>Post <strong>SS-10</strong> (Emergency Response / One Phone Call Card) at the supervisor station.</li>
                    <li>Use <strong>SS-11</strong> (90-Day Implementation Roadmap) to keep the rhythm going after the first month.</li>
                </ol>
                <p style="margin-top: 22px; padding: 12px; background: #FAF7F1; border-left: 3px solid #C5A059; font-size: 14px;">
                    <strong>Important:</strong> This system supports documentation. It does not guarantee OSHA compliance, prevent citations, eliminate hazards, or replace the employer's responsibility to maintain a safe workplace. Employers remain responsible for identifying applicable standards, correcting recognized hazards, training employees, and maintaining accurate records.
                </p>
                <p style="margin-top: 22px;">Once you've used the system for a while, an optional <strong>GigLine Implementation Review</strong> (from $850) gives you a second set of eyes on what's actually been documented, corrected, and closed out. Reply to this email or call (336) 329-8899 when you're ready.</p>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
                <p style="color: #888; font-size: 14px;">
                    &mdash; Vince Lawrence<br/>
                    GigLine Safety &amp; Compliance<br/>
                    (336) 329-8899 &middot; vince@giglinecompliance.com
                </p>
                <p style="margin-top:10px;">
                    <img src="https://www.giglinecompliance.com/assets/veteran-owned-badge-sm.png"
                         alt="Veteran-Owned Company"
                         width="120" height="77"
                         style="display:block;max-width:120px;height:auto;border:0;" />
                </p>
            </div>
        """
        try:
            payload = {
                "from": SENDER_EMAIL,
                "to": [email],
                "subject": subject,
                "html": body_html,
                "reply_to": VINCE_EMAIL,
            }
            if attachments:
                payload["attachments"] = attachments
            resend.Emails.send(payload)
            logger.info(f"Supervisor kit DIGITAL confirmation email sent to {email} with {len(attachments)} PDFs")
        except Exception as e:
            logger.error(f"Supervisor kit confirmation email error: {e}")
        return

    # Physical variant
    subject = "Your GigLine Supervisor Safety OS — Physical Binder Kit"
    body_html = """
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1C2B2B; line-height: 1.6;">
            <h1 style="font-size: 22px; margin-bottom: 12px; color: #0A1628;">Your order is confirmed.</h1>
            <p>Your kit will ship USPS Priority within 3 business days to the address you provided.</p>
            <p>You&rsquo;ll also receive a separate email from Vince with a few notes on getting started.</p>
            <p>Questions: <strong>(336) 329-8899</strong>.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="color: #888; font-size: 14px;">
                &mdash; GigLine Safety &amp; Compliance<br/>
                (336) 329-8899 &middot; vince@giglinecompliance.com
            </p>
        </div>
    """
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": subject,
            "html": body_html,
            "reply_to": VINCE_EMAIL,
        })
        logger.info(f"Supervisor kit PHYSICAL confirmation email sent to {email}")
    except Exception as e:
        logger.error(f"Supervisor kit confirmation email error: {e}")


async def _send_vince_kit_notification(variant, email, name, phone, shipping, metadata, amount_cents):
    """Internal notification email to Vince with all order details."""
    amount_str = f"${(amount_cents or 0) / 100:.2f}"
    label = SUPERVISOR_KIT_PRODUCTS[variant]["name"]
    shipping_block = ""
    if shipping:
        addr = shipping.get("address") or {}
        shipping_block = f"""
            <h3 style="margin-top: 20px; margin-bottom: 6px;">SHIP TO</h3>
            <p style="margin: 0;">
                {shipping.get('name') or name or ''}<br/>
                {addr.get('line1', '')}{('<br/>' + addr.get('line2')) if addr.get('line2') else ''}<br/>
                {addr.get('city', '')}, {addr.get('state', '')} {addr.get('postal_code', '')}<br/>
                {addr.get('country', '')}
            </p>
        """
    company = metadata.get("company_name", "") if metadata else ""
    phone_row = f'<p style="margin: 0;"><strong>Buyer phone:</strong> {phone}</p>' if phone else ''
    fulfillment_note = (
        "Digital kits: system auto-emails GigLine_Supervisor_Safety_OS_v1.pdf. No action needed."
        if variant == "digital"
        else "Physical kits: pack the binder + Owner&rsquo;s Card and ship via <strong>USPS Priority (free — no charge to buyer)</strong>."
    )
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"Supervisor Safety OS ({variant.upper()}) — New Purchase ({email})",
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1C2B2B;">
                    <h2 style="margin-bottom: 8px;">GigLine Supervisor Safety OS &mdash; new order</h2>
                    <p style="margin: 0;"><strong>Variant:</strong> {label}</p>
                    <p style="margin: 0;"><strong>Amount:</strong> {amount_str}</p>
                    <p style="margin: 0;"><strong>Buyer email:</strong> {email}</p>
                    <p style="margin: 0;"><strong>Buyer name:</strong> {name or '(not provided)'}</p>
                    {phone_row}
                    {f'<p style="margin: 0;"><strong>Company:</strong> {company}</p>' if company else ''}
                    {shipping_block}
                    <hr style="margin: 16px 0; border: none; border-top: 1px solid #ddd;" />
                    <p style="color: #888; font-size: 13px;">{fulfillment_note}</p>
                </div>
            """,
        })
        logger.info(f"Vince notified of supervisor kit order: {email} ({variant})")
    except Exception as e:
        logger.error(f"Vince notification email error: {e}")
