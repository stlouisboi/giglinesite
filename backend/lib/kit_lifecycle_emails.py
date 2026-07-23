"""Kit lifecycle emails — Shipped confirmation + 90-day anniversary follow-up.

These are the *post-purchase* touchpoints in the buyer journey:
  1. Original delivery email  (fires at purchase — handled in routes/*_kits.py)
  2. Shipped confirmation      (this file, called from admin.mark-shipped handler)
  3. 90-day anniversary        (this file, run daily by scheduler in server.py)

Design goals:
  • Idempotent — never fire twice for the same order (fulfillment_status /
    anniversary_followup_sent_at act as write-once guards).
  • Fault-tolerant — a Resend outage does NOT block the DB mutation that
    kicked off the email. We log the error and move on.
  • Brand-consistent — navy #102A43 + gold #C9A84C with the standard sans stack.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

import resend

from config import db, SENDER_EMAIL

logger = logging.getLogger("gigline")

NAVY = "#102A43"
GOLD = "#C9A84C"
INK = "#1C2B2B"

# Public tracking-URL builders. If a carrier is unknown / "Other", we skip the
# tracking-link block entirely (no misleading "click here" leading nowhere).
CARRIER_TRACKING_URLS = {
    "USPS":  "https://tools.usps.com/go/TrackConfirmAction?tLabels={num}",
    "UPS":   "https://www.ups.com/track?tracknum={num}",
    "FedEx": "https://www.fedex.com/fedextrack/?trknbr={num}",
    "DHL":   "https://www.dhl.com/us-en/home/tracking/tracking-parcel.html?tracking-id={num}",
}


def _tracking_url(carrier: str, tracking_number: str) -> Optional[str]:
    if not carrier or not tracking_number:
        return None
    tpl = CARRIER_TRACKING_URLS.get(carrier)
    return tpl.format(num=tracking_number.strip()) if tpl else None


# ══════════════════════════════════════════════════════════════════════════════
# 1. SHIPPED CONFIRMATION — fires when admin taps Mark Shipped
# ══════════════════════════════════════════════════════════════════════════════

async def send_shipped_confirmation(order: dict, tracking_number: str = "", carrier: str = "") -> bool:
    """Email buyer that their physical kit is on its way.

    order is the raw Mongo doc from either gl_citation_proof_kit_orders or
    gl_supervisor_kit_orders — both share enough shape (customer_email /
    customer_name / label / kit_slug|variant) for a unified template.

    Returns True if the email was successfully sent.
    """
    email = order.get("customer_email") or order.get("email")
    if not email:
        logger.warning("shipped-confirmation: skipped — order %s has no email", order.get("session_id"))
        return False

    customer_name = order.get("customer_name") or ""
    first_name = customer_name.split(" ")[0].strip() if customer_name else ""
    greeting = f"Hi {first_name}," if first_name else "Hi,"

    label = order.get("label") or "your GigLine kit"
    track_url = _tracking_url(carrier, tracking_number)
    subject = f"Your {label} is on its way"

    tracking_block_html = ""
    tracking_block_text = ""
    if track_url:
        tracking_block_html = f"""
        <div style="margin:22px 0;padding:16px 18px;background:#F3ECDB;border-left:4px solid {GOLD};border-radius:4px">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:{NAVY};font-weight:700">Tracking</p>
          <p style="margin:0;font-size:14px;color:{INK}">
            <strong>{carrier}</strong> · <span style="font-family:monospace">{tracking_number}</span><br/>
            <a href="{track_url}" style="color:{NAVY};font-weight:700;text-decoration:underline">Track your package &rarr;</a>
          </p>
        </div>
        """
        tracking_block_text = (
            f"\nTracking:\n  Carrier: {carrier}\n  Number:  {tracking_number}\n  Track:   {track_url}\n"
        )
    elif tracking_number:
        # We have a number but the carrier is Other/unknown — show it plaintext.
        tracking_block_html = f"""
        <div style="margin:22px 0;padding:16px 18px;background:#F3ECDB;border-left:4px solid {GOLD};border-radius:4px">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:{NAVY};font-weight:700">Tracking Number</p>
          <p style="margin:0;font-size:14px;color:{INK}">{carrier or 'Carrier'} · <span style="font-family:monospace">{tracking_number}</span></p>
        </div>
        """
        tracking_block_text = f"\nTracking number: {tracking_number} ({carrier or 'carrier not listed'})\n"

    html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:{INK};max-width:600px;margin:0 auto;padding:24px">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:{GOLD};font-weight:800">GigLine Safety &amp; Compliance</p>
      <h1 style="margin:0 0 18px;color:{NAVY};font-size:24px;line-height:1.25">Your {label} is on its way.</h1>
      <p style="font-size:15px;line-height:1.65;color:{INK}">{greeting}</p>
      <p style="font-size:15px;line-height:1.65;color:{INK}">
        We just handed your printed binder to <strong>{carrier or 'the carrier'}</strong>. Expect delivery within
        <strong>2–5 business days</strong>. Your digital PDFs (already delivered when you purchased) are the exact
        same content — the binder is the tabbed, hole-punched, ready-for-the-shelf copy.
      </p>
      {tracking_block_html}
      <h3 style="margin:26px 0 8px;color:{NAVY};font-size:15px;text-transform:uppercase;letter-spacing:.1em">When it lands</h3>
      <ol style="margin:0 0 18px;padding-left:22px;font-size:14.5px;line-height:1.7;color:{INK}">
        <li>Open the cover page — it maps every tool inside and the order to work through them.</li>
        <li>Slot the binder into your compliance shelf next to your other program books.</li>
        <li>Walk your supervisor through the first three tabs on their next shift.</li>
      </ol>
      <p style="font-size:14px;line-height:1.65;color:rgba(28,43,43,0.75)">
        Questions or the package arrives damaged? Reply to this email or call
        <strong>(336) 329-8899</strong> and we&rsquo;ll fix it.
      </p>
      <p style="font-size:13px;line-height:1.5;color:rgba(28,43,43,0.6);margin-top:26px">
        &mdash; Vince Lawrence, GigLine Safety &amp; Compliance<br/>
        Piedmont Triad, NC · <a href="https://www.giglinecompliance.com" style="color:{NAVY}">giglinecompliance.com</a>
      </p>
    </div>
    """
    text = (
        f"{greeting}\n\n"
        f"Your {label} is on its way. Expect delivery in 2–5 business days via {carrier or 'the carrier'}.\n"
        f"{tracking_block_text}\n"
        "When it lands:\n"
        "  1. Open the cover page — it maps every tool inside.\n"
        "  2. Slot the binder into your compliance shelf.\n"
        "  3. Walk your supervisor through the first three tabs.\n\n"
        "Questions? Reply here or call (336) 329-8899.\n\n"
        "— Vince Lawrence, GigLine Safety & Compliance\n"
        "  Piedmont Triad, NC · https://www.giglinecompliance.com\n"
    )
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": subject,
            "html": html,
            "text": text,
        })
        logger.info("shipped-confirmation sent to %s for session %s", email, order.get("session_id"))
        return True
    except Exception:
        logger.exception("shipped-confirmation send failed for %s", email)
        return False


# ══════════════════════════════════════════════════════════════════════════════
# 2. 90-DAY ANNIVERSARY FOLLOW-UP — daily scheduler
# ══════════════════════════════════════════════════════════════════════════════

ANNIVERSARY_TARGET_DAYS = 90
ANNIVERSARY_WINDOW_DAYS = 3   # ± 3 days so weekend downtime doesn't skip anyone


async def _send_anniversary_email(order: dict) -> bool:
    email = order.get("customer_email") or order.get("email")
    if not email:
        return False

    customer_name = order.get("customer_name") or ""
    first_name = customer_name.split(" ")[0].strip() if customer_name else ""
    greeting = f"Hi {first_name}," if first_name else "Hi,"

    label = order.get("label") or "your GigLine kit"
    subject = f"90 days in — did your {label} do its job?"

    review_url = "https://g.page/r/CY6O2SUM7v-tEBM/review"

    html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:{INK};max-width:600px;margin:0 auto;padding:24px">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:{GOLD};font-weight:800">Quick Check-In</p>
      <h1 style="margin:0 0 18px;color:{NAVY};font-size:24px;line-height:1.3">Did the paperwork survive an inspection?</h1>
      <p style="font-size:15px;line-height:1.7;color:{INK}">{greeting}</p>
      <p style="font-size:15px;line-height:1.7;color:{INK}">
        It&rsquo;s been about <strong>90 days</strong> since you picked up your <strong>{label}</strong>. Quick,
        honest check-in — no sales pitch attached:
      </p>
      <ul style="margin:0 0 22px;padding-left:22px;font-size:15px;line-height:1.75;color:{INK}">
        <li>Has an OSHA officer, insurer, or corporate auditor walked your site since?</li>
        <li>Did the binder / PDFs hold up when someone actually asked for the paperwork?</li>
        <li>Anything missing you wish had been in the kit?</li>
      </ul>
      <p style="font-size:15px;line-height:1.7;color:{INK}">
        <strong>Reply directly to this email</strong> with a sentence or two — I read every one, and it&rsquo;s
        the fastest way to make the next version of the kit better for the shops behind you.
      </p>
      <div style="margin:26px 0 22px;padding:18px 20px;background:#F3ECDB;border-left:4px solid {GOLD};border-radius:4px">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:{NAVY};font-weight:700">Bonus ask</p>
        <p style="margin:0 0 12px;font-size:14.5px;line-height:1.6;color:{INK}">
          If the kit did what it was supposed to do, a <strong>2-sentence Google review</strong> helps the next
          small-shop owner in NC find us before they get a citation.
        </p>
        <a href="{review_url}" style="display:inline-block;background:{GOLD};color:{NAVY};font-weight:700;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:14px">
          Leave a Google review &rarr;
        </a>
      </div>
      <p style="font-size:14px;line-height:1.65;color:rgba(28,43,43,0.7)">
        Not sure what to write? &ldquo;GigLine&rsquo;s kit made my next inspection painless&rdquo; is plenty.
        A shop name + one sentence is worth more than a paragraph.
      </p>
      <p style="font-size:13px;line-height:1.5;color:rgba(28,43,43,0.6);margin-top:26px">
        &mdash; Vince Lawrence, GigLine Safety &amp; Compliance<br/>
        Piedmont Triad, NC · <a href="https://www.giglinecompliance.com" style="color:{NAVY}">giglinecompliance.com</a>
      </p>
    </div>
    """
    text = (
        f"{greeting}\n\n"
        f"It's been about 90 days since you picked up your {label}. Quick, honest check-in:\n\n"
        "  • Has an OSHA officer, insurer, or auditor walked your site since?\n"
        "  • Did the binder / PDFs hold up when someone actually asked?\n"
        "  • Anything missing you wish had been in the kit?\n\n"
        "Reply directly to this email — I read every one.\n\n"
        f"Bonus: if the kit did its job, a 2-sentence Google review helps the next NC shop owner find us.\n{review_url}\n\n"
        "— Vince Lawrence, GigLine Safety & Compliance\n"
        "  Piedmont Triad, NC · https://www.giglinecompliance.com\n"
    )
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [email],
            "subject": subject,
            "html": html,
            "text": text,
        })
        logger.info("anniversary-followup sent to %s for session %s", email, order.get("session_id"))
        return True
    except Exception:
        logger.exception("anniversary-followup send failed for %s", email)
        return False


async def _mark_anniversary_sent(collection_name: str, session_id: str) -> None:
    now_iso = datetime.now(timezone.utc).isoformat()
    await db[collection_name].update_one(
        {"session_id": session_id},
        {"$set": {"anniversary_followup_sent_at": now_iso}},
    )


async def process_anniversary_followups() -> dict:
    """Find paid orders ~90 days past their trigger event and email each buyer.

    Trigger event:
      • Physical (binder / physical variant): `shipped_at` between 87 and 93 days ago
      • Digital (auto_delivered):              `paid_at`    between 87 and 93 days ago

    Idempotency: only orders where `anniversary_followup_sent_at` does not exist
    (or is null) are picked up. Once sent, we set the timestamp — no re-fires.

    Returns a summary dict for scheduler logging.
    """
    now = datetime.now(timezone.utc)
    window_start = (now - timedelta(days=ANNIVERSARY_TARGET_DAYS + ANNIVERSARY_WINDOW_DAYS)).isoformat()
    window_end   = (now - timedelta(days=ANNIVERSARY_TARGET_DAYS - ANNIVERSARY_WINDOW_DAYS)).isoformat()

    summary = {"cp_sent": 0, "sk_sent": 0, "cp_skipped": 0, "sk_skipped": 0}

    # ── Citation-Proof Kit orders ────────────────────────────────────────────
    cp_query = {
        "status": "paid",
        "anniversary_followup_sent_at": {"$in": [None, ""]},   # unset OR null
        "$or": [
            # Physical binder: use shipped_at
            {"physical_binder": True,  "shipped_at": {"$gte": window_start, "$lte": window_end}},
            # Digital / control_system: use paid_at + only auto-delivered ones
            {"physical_binder": False, "fulfillment_status": "auto_delivered",
             "paid_at": {"$gte": window_start, "$lte": window_end}},
        ],
    }
    async for order in db.gl_citation_proof_kit_orders.find(cp_query):
        ok = await _send_anniversary_email(order)
        if ok:
            await _mark_anniversary_sent("gl_citation_proof_kit_orders", order["session_id"])
            summary["cp_sent"] += 1
        else:
            summary["cp_skipped"] += 1

    # ── Supervisor Kit orders ────────────────────────────────────────────────
    sk_query = {
        "status": "paid",
        "anniversary_followup_sent_at": {"$in": [None, ""]},
        "$or": [
            {"variant": "physical", "shipped_at": {"$gte": window_start, "$lte": window_end}},
            {"variant": "digital",  "paid_at":    {"$gte": window_start, "$lte": window_end}},
        ],
    }
    async for order in db.gl_supervisor_kit_orders.find(sk_query):
        ok = await _send_anniversary_email(order)
        if ok:
            await _mark_anniversary_sent("gl_supervisor_kit_orders", order["session_id"])
            summary["sk_sent"] += 1
        else:
            summary["sk_skipped"] += 1

    return summary
