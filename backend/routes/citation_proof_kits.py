"""Citation-Proof Kit Series — Stripe checkout + Resend delivery.

Routes:
  POST /api/checkout/citation-proof-kit-digital  → create Stripe session ($150, no shipping)
                                                    body: { slug, origin_url, email?, company_name?, attribution? }
  GET  /api/citation-proof-kit/verify            → poll on success page; sends confirmation email
                                                    + Vince notification on first paid-verify call

v1 fulfillment is MANUAL — Vince separately emails the digital kit files
after the order lands. The confirmation email tells the buyer to expect
that follow-up. Raw DOCX files are never auto-attached.
"""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import asyncio
import logging

import resend
from config import (
    db, USE_NATIVE_STRIPE,
    CITATION_PROOF_KIT_DIGITAL_PRODUCTS,
    SENDER_EMAIL, VINCE_EMAIL,
)
from integrations.mailerlite import add_to_lead_nurture

router = APIRouter()
logger = logging.getLogger('gigline')


class KitDigitalCheckoutRequest(BaseModel):
    slug: str
    origin_url: str
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    attribution: Optional[dict] = None


@router.post("/checkout/citation-proof-kit-digital")
async def checkout_citation_proof_kit_digital(payload: KitDigitalCheckoutRequest, http_request: Request):
    """Create Stripe Checkout session for a $150 Digital Compliance Kit (LOTO or PIT)."""
    slug = payload.slug
    if slug not in CITATION_PROOF_KIT_DIGITAL_PRODUCTS:
        raise HTTPException(
            status_code=400,
            detail=f"Digital checkout not available for kit '{slug}'.",
        )

    product = CITATION_PROOF_KIT_DIGITAL_PRODUCTS[slug]
    success_url = (
        f"{payload.origin_url}/citation-proof-kits/{slug}/thank-you"
        f"?session_id={{CHECKOUT_SESSION_ID}}"
    )
    cancel_url = f"{payload.origin_url}/citation-proof-kits/{slug}"

    metadata = {
        "product": "citation_proof_kit_digital",
        "kit_slug": slug,
        "sku": product["sku"],
        "tier": "digital",
        "company_name": payload.company_name or "",
    }
    if payload.attribution and isinstance(payload.attribution, dict):
        first = payload.attribution.get("firstTouch") or {}
        if first.get("utm_source"):
            metadata["first_touch_source"] = first.get("utm_source", "")[:100]
        if first.get("utm_campaign"):
            metadata["first_touch_campaign"] = first.get("utm_campaign", "")[:100]

    try:
        # Both native and emergentintegrations paths call stripe_native's helper
        # (supervisor_kit uses the same pattern — it always uses stripe_native
        # because the emergentintegrations adapter does not support metadata + email).
        from stripe_native import create_checkout
        result = await create_checkout(
            amount_cents=product["amount_cents"],
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            customer_email=payload.email,
            collect_shipping=False,
            product_name=product["name"],
        )

        await db.gl_citation_proof_kit_orders.insert_one({
            "session_id": result["session_id"],
            "kit_slug": slug,
            "tier": "digital",
            "sku": product["sku"],
            "amount_cents": product["amount_cents"],
            "label": product["name"],
            "email": payload.email,
            "company_name": payload.company_name,
            "attribution": payload.attribution,
            "status": "pending_payment",
            "fulfillment_status": "pending_manual",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

        logger.info(f"Citation-Proof Kit DIGITAL Stripe session created: slug={slug} session={result['session_id']}")
        return {"url": result["url"], "session_id": result["session_id"]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Citation-Proof Kit digital checkout error ({slug}): {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")


@router.get("/citation-proof-kit/verify")
async def verify_citation_proof_kit_session(session_id: str):
    """Verify Stripe payment, send buyer confirmation + Vince notification once.

    Called by the /citation-proof-kits/:slug/thank-you page on load.
    Idempotent — safe to call multiple times (poll pattern).
    """
    try:
        from stripe_native import get_checkout_status
        result = await get_checkout_status(session_id)
        payment_status = result.get("payment_status")
        metadata = result.get("metadata") or {}
        slug = metadata.get("kit_slug")

        if payment_status != "paid":
            return {"verified": False, "payment_status": payment_status}

        if slug not in CITATION_PROOF_KIT_DIGITAL_PRODUCTS:
            logger.warning(f"citation-proof-kit verify: unknown slug in metadata: {slug}")
            return {"verified": False}

        product = CITATION_PROOF_KIT_DIGITAL_PRODUCTS[slug]
        customer_email = result.get("customer_email") or None
        customer_name = result.get("customer_name") or ""

        # Idempotency: only send emails once. Check BEFORE we upsert paid state.
        existing_paid = await db.gl_citation_proof_kit_orders.find_one(
            {"session_id": session_id, "status": "paid"}
        )

        await db.gl_citation_proof_kit_orders.update_one(
            {"session_id": session_id},
            {"$set": {
                "status": "paid",
                "payment_status": "paid",
                "customer_email": customer_email,
                "customer_name": customer_name,
                "customer_phone": result.get("customer_phone"),
                "amount_total_cents": result.get("amount_total"),
                "paid_at": datetime.now(timezone.utc).isoformat(),
            }},
            upsert=True,
        )

        if not existing_paid and customer_email:
            await _send_buyer_confirmation(slug, product, customer_email, customer_name)
            await _send_vince_notification(
                slug, product, customer_email, customer_name,
                result.get("customer_phone"), metadata,
                result.get("amount_total"),
            )
            # Fire-and-forget: enroll buyer in the standard lead-nurture list so
            # they receive GigLine's regular follow-up cadence.
            asyncio.create_task(add_to_lead_nurture(
                email=customer_email,
                name=customer_name,
                company=metadata.get("company_name", ""),
                source_form=f"citation-proof-kit-digital-{slug}",
            ))

        return {
            "verified": True,
            "kit_slug": slug,
            "short_name": product["short_name"],
            "amount_total": result.get("amount_total"),
        }
    except Exception as e:
        logger.error(f"Citation-Proof Kit verify error: {e}")
        return {"verified": False}


async def _send_buyer_confirmation(slug: str, product: dict, email: str, customer_name: str) -> None:
    """Buyer confirmation — tier-specific template. Manual fulfillment language."""
    short_name = product["short_name"]
    first_name = (customer_name.split(" ")[0].strip() if customer_name else "")
    greeting = f"Hi {first_name}," if first_name else "Hi,"

    subject = f"Your order was received — {short_name} (Digital Compliance Kit)"

    body_html = f"""
        <div style="font-family: Georgia, serif; max-width: 620px; margin: 0 auto; color: #102A43; line-height: 1.65;">
            <p style="text-transform: uppercase; letter-spacing: 0.28em; font-size: 11px; color: #C9A84C; font-family: 'JetBrains Mono', monospace; margin-bottom: 10px;">
                Order Received &middot; GigLine Safety
            </p>
            <h1 style="font-size: 22px; margin: 0 0 16px 0; color: #102A43; font-family: 'Manrope', sans-serif; line-height: 1.25;">
                Your order was received successfully.
            </h1>
            <p style="margin: 0 0 14px 0;">{greeting}</p>
            <p style="margin: 0 0 14px 0;">
                Thanks for purchasing the <strong>{short_name} &mdash; Digital Compliance Kit</strong> ($150).
            </p>
            <div style="background: #F3ECDB; border-left: 3px solid #C9A84C; padding: 14px 16px; margin: 18px 0;">
                <p style="margin: 0; font-family: 'Manrope', sans-serif; font-weight: 700; color: #102A43; font-size: 15px;">
                    Delivery coming separately
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14.5px;">
                    Your GigLine digital kit download will be delivered to this email address separately &mdash; typically within one business day. Files are prepared and sent manually so you get the current, working version of every tool.
                </p>
            </div>
            <h3 style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin: 22px 0 8px 0; color: #102A43; font-family: 'Manrope', sans-serif;">
                While you wait
            </h3>
            <ol style="padding-left: 20px; margin: 0 0 16px 0; color: #102A43;">
                <li style="margin-bottom: 6px;">Check that <strong>vince@giglinecompliance.com</strong> is not blocked or in spam.</li>
                <li style="margin-bottom: 6px;">Reply to this email with any specifics about your facility that would help Vince tailor the worked examples.</li>
                <li style="margin-bottom: 6px;">If you don&rsquo;t see your files within one business day, call <strong>(336) 329-8899</strong>.</li>
            </ol>
            <p style="margin: 22px 0 0 0; padding: 12px 14px; background: #FAF7F1; border-left: 3px solid #C9A84C; font-size: 13.5px; color: #102A43;">
                <strong>Important:</strong> This kit supports documentation and self-audit. It does not guarantee OSHA compliance, prevent citations, eliminate hazards, or replace the employer&rsquo;s responsibility to maintain a safe workplace. Employers remain responsible for identifying applicable standards, correcting recognized hazards, training employees, and maintaining accurate records.
            </p>
            <hr style="margin: 26px 0; border: none; border-top: 1px solid #e8e5dd;" />
            <p style="color: #6b7280; font-size: 13.5px; margin: 0;">
                &mdash; Vince Lawrence<br/>
                GigLine Safety &amp; Compliance<br/>
                (336) 329-8899 &middot; vince@giglinecompliance.com
            </p>
            <p style="margin-top: 12px;">
                <img src="https://www.giglinecompliance.com/assets/veteran-owned-badge-sm.png"
                     alt="Veteran-Owned Company"
                     width="120" height="77"
                     style="display:block;max-width:120px;height:auto;border:0;" />
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
        logger.info(f"Citation-Proof Kit buyer confirmation sent: slug={slug} email={email}")
    except Exception as e:
        logger.error(f"Citation-Proof Kit buyer email error: {e}")


async def _send_vince_notification(slug, product, email, name, phone, metadata, amount_cents):
    """Internal notification email to Vince — includes ACTION REQUIRED language
    because fulfillment for the Citation-Proof Kits is manual in v1."""
    amount_str = f"${(amount_cents or 0) / 100:.2f}"
    label = product["name"]
    short_name = product["short_name"]
    company = metadata.get("company_name", "") if metadata else ""
    phone_row = f'<p style="margin: 0;"><strong>Buyer phone:</strong> {phone}</p>' if phone else ''
    first_touch_source = metadata.get("first_touch_source", "") if metadata else ""
    first_touch_campaign = metadata.get("first_touch_campaign", "") if metadata else ""
    attrib_block = ""
    if first_touch_source or first_touch_campaign:
        attrib_block = f"""
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #6b7280;">
                <strong>Attribution:</strong> {first_touch_source or '(no source)'} / {first_touch_campaign or '(no campaign)'}
            </p>
        """

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"ACTION REQUIRED — {short_name} DIGITAL ($150) purchase from {email}",
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; color: #102A43;">
                    <h2 style="margin: 0 0 8px 0;">Citation-Proof Kit &mdash; new digital order</h2>
                    <p style="margin: 0 0 12px 0; padding: 8px 12px; background: #FFF3D6; border-left: 3px solid #C9A84C; font-size: 14px;">
                        <strong>Manual fulfillment required.</strong> Send the {short_name} Digital Kit files to the buyer directly. Do NOT attach raw DOCX; use the packaged deliverable.
                    </p>
                    <p style="margin: 0;"><strong>Kit:</strong> {label}</p>
                    <p style="margin: 0;"><strong>Slug:</strong> {slug}</p>
                    <p style="margin: 0;"><strong>Amount:</strong> {amount_str}</p>
                    <p style="margin: 0;"><strong>Buyer email:</strong> {email}</p>
                    <p style="margin: 0;"><strong>Buyer name:</strong> {name or '(not provided)'}</p>
                    {phone_row}
                    {f'<p style="margin: 0;"><strong>Company:</strong> {company}</p>' if company else ''}
                    {attrib_block}
                    <hr style="margin: 16px 0; border: none; border-top: 1px solid #e8e5dd;" />
                    <p style="color: #6b7280; font-size: 12.5px; margin: 0;">
                        Sent by GigLine backend when Stripe confirmed payment.
                    </p>
                </div>
            """,
        })
        logger.info(f"Vince notified of citation-proof-kit order: slug={slug} email={email}")
    except Exception as e:
        logger.error(f"Vince notification email error (citation-proof-kit): {e}")
