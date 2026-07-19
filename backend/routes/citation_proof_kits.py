"""Citation-Proof Kit Series — Stripe checkout + Resend delivery.

Endpoints:
  POST /api/checkout/citation-proof-kit          → tier-aware ({slug, tier, ...})
  POST /api/checkout/citation-proof-kit-digital  → back-compat wrapper (defaults tier=digital)
  GET  /api/citation-proof-kit/verify            → poll on thank-you page

Tiers (per kit — LOTO + PIT wired live in v1):
  digital        $150  — auto-attach Digital PDF, no shipping, FYI email to Vince.
  control-system $300  — auto-attach Control System PDF, no shipping, FYI email to Vince.
  binder         $600  — auto-attach Control System PDF (buyer uses it while binder
                         ships), Stripe collects US ship-to + phone during checkout,
                         Vince gets red "ACTION REQUIRED — SHIP THIS BINDER" email
                         with full address block. Ships within 3-5 business days.
"""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone
import asyncio
import base64
import logging
from pathlib import Path

import resend
from config import (
    db,
    CITATION_PROOF_KIT_PRODUCTS,
    SENDER_EMAIL, VINCE_EMAIL,
)
from integrations.mailerlite import add_to_lead_nurture

router = APIRouter()
logger = logging.getLogger('gigline')

BINDER_SHIP_WINDOW = "3–5 business days"


class KitCheckoutRequest(BaseModel):
    slug: str
    tier: str = "digital"
    origin_url: str
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    attribution: Optional[dict] = None


class KitDigitalCheckoutRequest(BaseModel):
    """Back-compat body — the older /citation-proof-kit-digital endpoint."""
    slug: str
    origin_url: str
    email: Optional[EmailStr] = None
    company_name: Optional[str] = None
    attribution: Optional[dict] = None


async def _create_kit_checkout(
    slug: str,
    tier: str,
    origin_url: str,
    email: Optional[str],
    company_name: Optional[str],
    attribution: Optional[dict],
):
    key = (slug, tier)
    if key not in CITATION_PROOF_KIT_PRODUCTS:
        raise HTTPException(
            status_code=400,
            detail=f"Checkout not available for kit='{slug}' tier='{tier}'.",
        )

    product = CITATION_PROOF_KIT_PRODUCTS[key]
    success_url = (
        f"{origin_url}/citation-proof-kits/{slug}/thank-you"
        f"?session_id={{CHECKOUT_SESSION_ID}}&tier={tier}"
    )
    cancel_url = f"{origin_url}/citation-proof-kits/{slug}"

    metadata = {
        "product": "citation_proof_kit",
        "kit_slug": slug,
        "tier": tier,
        "sku": product["sku"],
        "company_name": company_name or "",
    }
    if attribution and isinstance(attribution, dict):
        first = attribution.get("firstTouch") or {}
        if first.get("utm_source"):
            metadata["first_touch_source"] = first.get("utm_source", "")[:100]
        if first.get("utm_campaign"):
            metadata["first_touch_campaign"] = first.get("utm_campaign", "")[:100]

    try:
        from stripe_native import create_checkout
        # Build a public HTTPS URL for the product thumbnail Stripe will render
        # on the checkout page. `origin_url` is the site the buyer came from
        # (e.g., https://www.giglinecompliance.com), so images work in both
        # preview and production without env config.
        product_images = None
        image_path = product.get("image_path")
        if image_path and origin_url.startswith("https://"):
            product_images = [f"{origin_url.rstrip('/')}{image_path}"]

        result = await create_checkout(
            amount_cents=product["amount_cents"],
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
            customer_email=email,
            collect_shipping=product["collect_shipping"],
            product_name=product["name"],
            product_images=product_images,
        )

        await db.gl_citation_proof_kit_orders.insert_one({
            "session_id": result["session_id"],
            "kit_slug": slug,
            "tier": tier,
            "sku": product["sku"],
            "amount_cents": product["amount_cents"],
            "label": product["name"],
            "physical_binder": product["physical_binder"],
            "email": email,
            "company_name": company_name,
            "attribution": attribution,
            "status": "pending_payment",
            "fulfillment_status": "pending_delivery",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

        logger.info(f"Citation-Proof Kit Stripe session created: slug={slug} tier={tier} session={result['session_id']}")
        return {"url": result["url"], "session_id": result["session_id"]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Citation-Proof Kit checkout error (slug={slug} tier={tier}): {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")


@router.post("/checkout/citation-proof-kit")
async def checkout_citation_proof_kit(payload: KitCheckoutRequest, http_request: Request):
    """Create Stripe Checkout session for any tier of a Citation-Proof Kit."""
    return await _create_kit_checkout(
        slug=payload.slug,
        tier=payload.tier,
        origin_url=payload.origin_url,
        email=payload.email,
        company_name=payload.company_name,
        attribution=payload.attribution,
    )


@router.post("/checkout/citation-proof-kit-digital")
async def checkout_citation_proof_kit_digital(payload: KitDigitalCheckoutRequest, http_request: Request):
    """Back-compat alias — original endpoint that only supported the $150 tier."""
    return await _create_kit_checkout(
        slug=payload.slug,
        tier="digital",
        origin_url=payload.origin_url,
        email=payload.email,
        company_name=payload.company_name,
        attribution=payload.attribution,
    )


@router.get("/citation-proof-kit/verify")
async def verify_citation_proof_kit_session(session_id: str):
    """Verify Stripe payment; on first paid verify send tier-appropriate emails."""
    try:
        from stripe_native import get_checkout_status
        result = await get_checkout_status(session_id)
        payment_status = result.get("payment_status")
        metadata = result.get("metadata") or {}
        slug = metadata.get("kit_slug")
        tier = metadata.get("tier", "digital")

        if payment_status != "paid":
            return {"verified": False, "payment_status": payment_status}

        key = (slug, tier)
        if key not in CITATION_PROOF_KIT_PRODUCTS:
            logger.warning(f"citation-proof-kit verify: unknown slug/tier in metadata: {key}")
            return {"verified": False}

        product = CITATION_PROOF_KIT_PRODUCTS[key]
        customer_email = result.get("customer_email") or None
        customer_name = result.get("customer_name") or ""
        customer_phone = result.get("customer_phone") or None
        shipping_details = result.get("shipping_details")  # None for non-binder tiers

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
                "customer_phone": customer_phone,
                "shipping_details": shipping_details,
                "amount_total_cents": result.get("amount_total"),
                "paid_at": datetime.now(timezone.utc).isoformat(),
            }},
            upsert=True,
        )

        if not existing_paid and customer_email:
            pdf_delivered = await _send_buyer_confirmation(
                slug, tier, product, customer_email, customer_name
            )
            await _send_vince_notification(
                slug, tier, product, customer_email, customer_name, customer_phone,
                metadata, result.get("amount_total"), shipping_details,
                pdf_delivered=pdf_delivered,
            )
            # Determine fulfillment_status: physical binder always requires manual ship,
            # even if PDF auto-delivery succeeded.
            if product["physical_binder"]:
                new_status = "pdf_delivered_awaiting_ship"
            else:
                new_status = "auto_delivered" if pdf_delivered else "pending_manual"
            await db.gl_citation_proof_kit_orders.update_one(
                {"session_id": session_id},
                {"$set": {
                    "fulfillment_status": new_status,
                    "pdf_delivered_at": (
                        datetime.now(timezone.utc).isoformat() if pdf_delivered else None
                    ),
                }},
            )
            asyncio.create_task(add_to_lead_nurture(
                email=customer_email,
                name=customer_name,
                company=metadata.get("company_name", ""),
                source_form=f"citation-proof-kit-{tier}-{slug}",
            ))

        return {
            "verified": True,
            "kit_slug": slug,
            "tier": tier,
            "tier_label": product["tier_label"],
            "short_name": product["short_name"],
            "physical_binder": product["physical_binder"],
            "ship_window": BINDER_SHIP_WINDOW if product["physical_binder"] else None,
            "amount_total": result.get("amount_total"),
        }
    except Exception as e:
        logger.error(f"Citation-Proof Kit verify error: {e}")
        return {"verified": False}


# ─────────── Buyer confirmation email ───────────

async def _send_buyer_confirmation(
    slug: str, tier: str, product: dict, email: str, customer_name: str,
) -> bool:
    """Buyer confirmation. Attaches branded PDF. Copy branches by tier.

    Returns True iff the branded PDF was found on disk and attached.
    """
    short_name = product["short_name"]
    tier_label = product["tier_label"]
    physical = product["physical_binder"]

    first_name = customer_name.split(" ")[0].strip() if customer_name else ""
    greeting = f"Hi {first_name}," if first_name else "Hi,"

    subject = f"Your {short_name} — {tier_label} (attached)"

    pdf_path = Path(product.get("pdf_path", ""))
    pdf_filename = product.get("pdf_filename", f"{slug}.pdf")
    pdf_attached = pdf_path.is_file()

    # Callout + "next steps" list are tier-aware.
    if pdf_attached and physical:
        callout_title = "Your kit is attached — and your binder ships within 3–5 business days"
        callout_body = (
            f"Your GigLine {short_name} <strong>{tier_label}</strong> is attached as a PDF "
            f"({pdf_filename}) so you can start using it right now. Your <strong>pre-printed, "
            f"tabbed physical binder</strong> ships to the address you provided within "
            f"<strong>{BINDER_SHIP_WINDOW}</strong>. You&rsquo;ll receive a separate email "
            "when it goes out."
        )
        next_heading = "How to use this kit while your binder ships"
        next_items = [
            f"Open <strong>{pdf_filename}</strong> and read the cover page first &mdash; "
            "it lists everything inside and the order to work through the tools.",
            "Start with the <strong>Citation-Proof Score&trade; Rubric</strong> to see "
            "where you stand today. Under 50 = citation likely. 90+ = Citation-Proof.",
            "Run the primary Builder tool for one machine, area, or operator to establish "
            "the pattern before rolling out further.",
            "When your printed binder arrives, drop your completed forms into the tabbed "
            "sections. That&rsquo;s the artifact an inspector asks for.",
            "Vince will schedule your <strong>setup call</strong> included with the Binder "
            "Edition after your binder ships &mdash; watch for a scheduling email.",
        ]
    elif pdf_attached:
        callout_title = "Your kit is attached to this email"
        callout_body = (
            f"Your GigLine {short_name} <strong>{tier_label}</strong> is attached as a PDF "
            f"({pdf_filename}). Open the cover page first — it lists everything inside "
            "and the order to work through the tools."
        )
        next_heading = "How to use this kit"
        next_items = [
            f"Open <strong>{pdf_filename}</strong> and read the cover page first &mdash; "
            "it maps the tools inside and the order to work them.",
            "Start with the <strong>Citation-Proof Score&trade; Rubric</strong> to see "
            "where you stand today. Under 50 = citation likely. 90+ = Citation-Proof.",
            "Then run the primary Builder tool for one machine, area, or operator to "
            "establish the pattern before rolling out further.",
            "Reply to this email with any facility-specific questions &mdash; Vince "
            "reviews responses personally.",
        ]
    else:
        # PDF missing on disk — deploy safety fallback.
        logger.error(f"citation-proof-kit PDF missing on disk: {pdf_path}")
        if physical:
            callout_title = "Your kit and binder are on the way"
            callout_body = (
                "Your GigLine kit files will be delivered separately within one business "
                f"day, and your printed binder ships within {BINDER_SHIP_WINDOW}."
            )
        else:
            callout_title = "Delivery coming separately"
            callout_body = (
                "Your GigLine digital kit download will be delivered to this email "
                "address separately &mdash; typically within one business day. Files are "
                "prepared and sent manually so you get the current, working version of every tool."
            )
        next_heading = "While you wait"
        next_items = [
            "Check that <strong>vince@giglinecompliance.com</strong> is not blocked or in spam.",
            "Reply to this email with any specifics about your facility that would help Vince tailor the worked examples.",
            "If you don&rsquo;t see your files within one business day, call <strong>(336) 329-8899</strong>.",
        ]

    next_html = "\n".join(
        f'<li style="margin-bottom: 8px; line-height: 1.65;">{item}</li>'
        for item in next_items
    )

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
                Thanks for purchasing the <strong>{short_name} &mdash; {tier_label}</strong>
                (${product['amount_cents'] / 100:.0f}).
            </p>
            <div style="background: #F3ECDB; border-left: 3px solid #C9A84C; padding: 14px 16px; margin: 18px 0;">
                <p style="margin: 0; font-family: 'Manrope', sans-serif; font-weight: 700; color: #102A43; font-size: 15px;">
                    {callout_title}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14.5px;">
                    {callout_body}
                </p>
            </div>
            <h3 style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin: 22px 0 8px 0; color: #102A43; font-family: 'Manrope', sans-serif;">
                {next_heading}
            </h3>
            <ol style="padding-left: 20px; margin: 0 0 16px 0; color: #102A43;">
                {next_html}
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

    send_kwargs = {
        "from": SENDER_EMAIL,
        "to": [email],
        "subject": subject,
        "html": body_html,
        "reply_to": VINCE_EMAIL,
    }

    if pdf_attached:
        try:
            with open(pdf_path, "rb") as fh:
                pdf_b64 = base64.b64encode(fh.read()).decode("ascii")
            send_kwargs["attachments"] = [{
                "filename": pdf_filename,
                "content": pdf_b64,
            }]
        except Exception as e:
            logger.error(f"Citation-Proof Kit PDF read error ({pdf_path}): {e}")
            pdf_attached = False

    try:
        resend.Emails.send(send_kwargs)
        logger.info(
            f"Citation-Proof Kit buyer email sent: slug={slug} tier={tier} "
            f"email={email} pdf_attached={pdf_attached}"
        )
        return pdf_attached
    except Exception as e:
        logger.error(f"Citation-Proof Kit buyer email error: {e}")
        return False


# ─────────── Vince notification ───────────

def _format_shipping_block(shipping_details: Optional[dict]) -> str:
    """Render Vince's ship-to address block. Loud red styling on binder orders."""
    if not shipping_details:
        return (
            '<p style="margin: 10px 0 0 0; padding: 10px; background: #FEE2E2; '
            'border-left: 3px solid #B91C1C; font-size: 13.5px; color: #991B1B;">'
            '<strong>WARNING:</strong> Binder order but no shipping address returned from '
            'Stripe. Contact the buyer for their address before shipping.'
            '</p>'
        )
    name = shipping_details.get("name") or "(no name)"
    addr = shipping_details.get("address") or {}
    lines = [name]
    for key in ("line1", "line2"):
        v = addr.get(key)
        if v:
            lines.append(v)
    city_state = ", ".join(
        [p for p in (addr.get("city"), addr.get("state")) if p]
    )
    postal = addr.get("postal_code") or ""
    city_line = " ".join([p for p in (city_state, postal) if p]).strip()
    if city_line:
        lines.append(city_line)
    if addr.get("country") and addr.get("country") != "US":
        lines.append(addr["country"])
    return (
        '<div style="margin: 10px 0 0 0; padding: 12px 14px; background: #FEF2F2; '
        'border-left: 4px solid #B91C1C; font-family: Menlo, Consolas, monospace; '
        'font-size: 14px; color: #991B1B; line-height: 1.6;">'
        + "<br/>".join(lines) +
        '</div>'
    )


async def _send_vince_notification(
    slug, tier, product, email, name, phone, metadata, amount_cents,
    shipping_details, *, pdf_delivered: bool = False,
):
    """Vince notification. Three modes:
       • Binder paid              → red ACTION REQUIRED — SHIP THIS BINDER + address block
       • Digital / CS paid + PDF   → green FYI (auto-delivered, no action)
       • Digital / CS paid but PDF failed → amber ACTION REQUIRED — send file manually
    """
    amount_str = f"${(amount_cents or 0) / 100:.2f}"
    label = product["name"]
    short_name = product["short_name"]
    tier_label = product["tier_label"]
    physical = product["physical_binder"]
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

    if physical:
        subject = f"🚚 ACTION REQUIRED — SHIP BINDER: {short_name} from {email}"
        callout_html = (
            '<p style="margin: 0 0 12px 0; padding: 10px 14px; background: #FEE2E2; '
            'border-left: 4px solid #B91C1C; font-size: 14.5px; color: #991B1B;">'
            f'<strong>ACTION REQUIRED &mdash; SHIP THIS BINDER within {BINDER_SHIP_WINDOW}.</strong><br/>'
            f'Buyer received the {tier_label} PDF as an attachment '
            '(they can start using it now). You still need to package and ship the '
            'pre-printed, tabbed physical binder. After shipping, follow up to schedule '
            'the setup call included with this tier.'
            '</p>'
        )
        shipping_html = (
            '<h3 style="margin: 16px 0 6px 0; font-size: 14px; color: #B91C1C;">'
            'SHIP TO:</h3>'
            + _format_shipping_block(shipping_details)
        )
    elif pdf_delivered:
        subject = f"New order — {short_name} {tier_label.upper()} (${amount_str[1:]}) from {email}"
        callout_html = (
            '<p style="margin: 0 0 12px 0; padding: 8px 12px; background: #EAF6EA; '
            'border-left: 3px solid #2E7D32; font-size: 14px;">'
            '<strong>Kit auto-delivered.</strong> The buyer received the branded PDF as '
            'an attachment on the confirmation email. No action required unless they reply '
            'with a question.'
            '</p>'
        )
        shipping_html = ""
    else:
        subject = f"ACTION REQUIRED — {short_name} {tier_label.upper()} from {email}"
        callout_html = (
            '<p style="margin: 0 0 12px 0; padding: 8px 12px; background: #FFF3D6; '
            'border-left: 3px solid #C9A84C; font-size: 14px;">'
            '<strong>ACTION REQUIRED &mdash; auto-delivery failed.</strong> Send the '
            f'{short_name} {tier_label} PDF to the buyer directly (the confirmation email '
            'used the fallback copy). Do NOT attach raw DOCX; use the packaged deliverable.'
            '</p>'
        )
        shipping_html = ""

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": subject,
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 640px; color: #102A43;">
                    <h2 style="margin: 0 0 8px 0;">Citation-Proof Kit &mdash; new order</h2>
                    {callout_html}
                    <p style="margin: 0;"><strong>Kit:</strong> {label}</p>
                    <p style="margin: 0;"><strong>Slug:</strong> {slug}</p>
                    <p style="margin: 0;"><strong>Tier:</strong> {tier} ({tier_label})</p>
                    <p style="margin: 0;"><strong>Amount:</strong> {amount_str}</p>
                    <p style="margin: 0;"><strong>Buyer email:</strong> {email}</p>
                    <p style="margin: 0;"><strong>Buyer name:</strong> {name or '(not provided)'}</p>
                    {phone_row}
                    {f'<p style="margin: 0;"><strong>Company:</strong> {company}</p>' if company else ''}
                    {attrib_block}
                    {shipping_html}
                    <hr style="margin: 16px 0; border: none; border-top: 1px solid #e8e5dd;" />
                    <p style="color: #6b7280; font-size: 12.5px; margin: 0;">
                        Sent by GigLine backend when Stripe confirmed payment.
                    </p>
                </div>
            """,
        })
        logger.info(
            f"Vince notified: slug={slug} tier={tier} email={email} "
            f"physical={physical} pdf_delivered={pdf_delivered}"
        )
    except Exception as e:
        logger.error(f"Vince notification email error (citation-proof-kit): {e}")
