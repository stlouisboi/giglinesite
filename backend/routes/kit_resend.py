"""Self-serve resend endpoint for buyers whose kit-delivery emails hit spam.

Endpoint:  POST /api/kit-orders/resend  { "email": "buyer@example.com" }

Behaviour:
  1. Rate-limits by email  → 3 attempts / 60 min (returns 429 when exceeded).
  2. Searches gl_citation_proof_kit_orders + gl_supervisor_kit_orders +
     payment_transactions (hazcom) for PAID orders matching the email.
  3. For each match, re-invokes the same delivery function that ran at
     original purchase time — attaching the branded PDF via Resend.
  4. Always returns 200 with a generic "if we have an order we sent it"
     message so email enumeration is not possible.
  5. Writes an audit row to gl_resend_log for every attempt (found or not).

Security posture:
  - No auth (public endpoint) — that's the whole point of self-serve.
  - Rate limit + audit log + generic response prevent abuse.
  - PDFs are not secret enough to warrant OTP verification.
"""

import logging
import re
from datetime import datetime, timezone, timedelta

import resend
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr

from config import db, CITATION_PROOF_KIT_PRODUCTS, SENDER_EMAIL, VINCE_EMAIL

router = APIRouter()
logger = logging.getLogger("gigline")

# ── Config ─────────────────────────────────────────────────────────────────────
RESEND_RATE_LIMIT = 3          # max attempts …
RESEND_WINDOW_MIN = 60         # … per rolling 60-minute window
ZERO_MATCH_ALERT_DEDUPE_MIN = 60   # only alert Vince once/hour per zero-match email
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class ResendRequest(BaseModel):
    email: EmailStr


def _norm_email(email: str) -> str:
    return (email or "").strip().lower()


async def _check_rate_limit(email_lc: str) -> bool:
    """Return True if the caller is under the limit; False if they must wait."""
    since = datetime.now(timezone.utc) - timedelta(minutes=RESEND_WINDOW_MIN)
    count = await db.gl_resend_log.count_documents({
        "email_lc": email_lc,
        "attempted_at": {"$gte": since.isoformat()},
    })
    return count < RESEND_RATE_LIMIT


async def _log_attempt(email_lc: str, orders_found: int, sources: list[str], error: str = "") -> None:
    await db.gl_resend_log.insert_one({
        "email_lc": email_lc,
        "attempted_at": datetime.now(timezone.utc).isoformat(),
        "orders_found": orders_found,
        "sources": sources,
        "error": error,
    })


async def _resend_citation_proof(order: dict) -> tuple[bool, str]:
    """Re-send the buyer confirmation for a paid citation-proof-kit order."""
    from routes.citation_proof_kits import _send_buyer_confirmation
    slug = order.get("kit_slug")
    tier = order.get("tier")
    product = CITATION_PROOF_KIT_PRODUCTS.get(slug, {}).get(tier)
    if not product:
        return False, f"unknown product slug/tier: {slug}/{tier}"
    email = order.get("customer_email") or order.get("email") or ""
    customer_name = order.get("customer_name") or ""
    if not email:
        return False, "order missing email"
    try:
        pdf_attached = await _send_buyer_confirmation(slug, tier, product, email, customer_name)
        return True, "attached" if pdf_attached else "sent-without-pdf"
    except Exception as e:
        logger.exception("citation-proof resend failure for %s", slug)
        return False, str(e)


async def _resend_supervisor_kit(order: dict) -> tuple[bool, str]:
    """Re-send the supervisor-kit buyer email."""
    from routes.supervisor_kit import _send_kit_buyer_email
    variant = order.get("variant") or "digital"
    email = order.get("customer_email") or order.get("email") or ""
    customer_name = order.get("customer_name") or ""
    if not email:
        return False, "order missing email"
    try:
        await _send_kit_buyer_email(variant, email, customer_name)
        return True, "sent"
    except Exception as e:
        logger.exception("supervisor-kit resend failure")
        return False, str(e)


async def _resend_hazcom(session_id: str, email: str) -> tuple[bool, str]:
    """Re-send the HazCom starter-pack delivery email."""
    from routes.hazcom import _send_hazcom_delivery_email
    try:
        await _send_hazcom_delivery_email(email, session_id)
        return True, "sent"
    except Exception as e:
        logger.exception("hazcom resend failure")
        return False, str(e)


async def _fire_zero_match_alert(email_lc: str, client_ip: str = "", user_agent: str = "") -> bool:
    """Email Vince when someone hits /resend-my-kit with an email that has zero
    paid orders on file. Deduped to one alert / email / hour so bots can't spam.

    Returns True if an alert was sent, False if suppressed (dedupe or send error).
    """
    since = datetime.now(timezone.utc) - timedelta(minutes=ZERO_MATCH_ALERT_DEDUPE_MIN)
    already_alerted = await db.gl_resend_log.count_documents({
        "email_lc": email_lc,
        "attempted_at": {"$gte": since.isoformat()},
        "zero_match_alert_sent": True,
    })
    if already_alerted:
        return False  # dedupe hit — Vince already got a heads-up in the last hour

    subject = f"[GigLine] Resend attempt — no paid order found: {email_lc}"
    text_body = (
        "Someone hit /resend-my-kit but had no paid GigLine order on file.\n\n"
        f"Email entered:  {email_lc}\n"
        f"Timestamp UTC:  {datetime.now(timezone.utc).isoformat()}\n"
        f"Client IP:      {client_ip or 'unknown'}\n"
        f"User-Agent:     {user_agent or 'unknown'}\n\n"
        "Possible reasons:\n"
        "  • Buyer used a different email at checkout (typo, work-vs-personal address)\n"
        "  • Chargeback / disputed order previously refunded\n"
        "  • Someone forwarded the /resend-my-kit link (curious visitor, not a buyer)\n"
        "  • Bot scraping the endpoint\n\n"
        "Deduped to one alert per email per hour."
    )
    html_body = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1C2B2B;padding:20px;max-width:560px">
      <p style="margin:0 0 12px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8A6D2F;font-weight:700">
        GigLine · Zero-Match Resend Attempt
      </p>
      <h2 style="margin:0 0 14px;color:#102A43;font-size:18px">Someone hit /resend-my-kit with no paid order on file.</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px;margin-bottom:18px">
        <tr><td style="color:#6B7280">Email entered</td><td><strong>{email_lc}</strong></td></tr>
        <tr><td style="color:#6B7280">UTC time</td><td>{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}</td></tr>
        <tr><td style="color:#6B7280">Client IP</td><td>{client_ip or '<em>unknown</em>'}</td></tr>
        <tr><td style="color:#6B7280">User-Agent</td><td style="font-family:monospace;font-size:11px">{(user_agent or '')[:180]}</td></tr>
      </table>
      <p style="color:#6B7280;font-size:12px;line-height:1.5;margin:0">
        Possible reasons: different email used at checkout, chargeback / refunded order,
        forwarded /resend-my-kit link, or a bot probing the endpoint.
      </p>
      <p style="color:#9CA3AF;font-size:11px;margin-top:16px">
        Deduped — you&rsquo;ll only get one alert per email per hour, even if the
        buyer retries the max 3 attempts.
      </p>
    </div>
    """
    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": subject,
            "text": text_body,
            "html": html_body,
        })
        return True
    except Exception as e:
        logger.exception("zero-match alert send failure: %s", e)
        return False


@router.post("/kit-orders/resend")
async def resend_kit(request: ResendRequest, http_request: Request):
    """Public self-serve resend. Always returns 200 unless rate-limited or malformed."""
    email_lc = _norm_email(request.email)
    if not email_lc or not EMAIL_RE.match(email_lc):
        raise HTTPException(status_code=400, detail="Please enter a valid email address.")

    # ── Rate limit ───────────────────────────────────────────────────────────
    if not await _check_rate_limit(email_lc):
        await _log_attempt(email_lc, orders_found=0, sources=[], error="rate_limited")
        raise HTTPException(
            status_code=429,
            detail=(
                f"Too many resend attempts for this email in the past "
                f"{RESEND_WINDOW_MIN} minutes. Please try again later, or "
                "email Vince@giglinecompliance.com for direct help."
            ),
        )

    orders_processed = 0
    sources: list[str] = []
    errors: list[str] = []

    # ── 1. Citation-Proof Kit orders ─────────────────────────────────────────
    cp_query = {
        "status": "paid",
        "$or": [{"customer_email": email_lc}, {"email": email_lc}],
    }
    async for order in db.gl_citation_proof_kit_orders.find(cp_query):
        ok, note = await _resend_citation_proof(order)
        if ok:
            orders_processed += 1
            sources.append(f"citation_proof_kit:{order.get('kit_slug')}:{order.get('tier')}")
        else:
            errors.append(f"cp:{order.get('session_id')}:{note}")

    # ── 2. Supervisor Kit orders ─────────────────────────────────────────────
    sk_query = {
        "status": "paid",
        "$or": [{"customer_email": email_lc}, {"email": email_lc}],
    }
    async for order in db.gl_supervisor_kit_orders.find(sk_query):
        ok, note = await _resend_supervisor_kit(order)
        if ok:
            orders_processed += 1
            sources.append(f"supervisor_kit:{order.get('variant')}")
        else:
            errors.append(f"sk:{order.get('session_id')}:{note}")

    # ── 3. HazCom Starter Pack ($29) ─────────────────────────────────────────
    hz_query = {
        "service_type": "hazcom_starter_pack",
        "payment_status": "paid",
        "customer_email": email_lc,
    }
    async for tx in db.payment_transactions.find(hz_query):
        ok, note = await _resend_hazcom(tx.get("session_id"), email_lc)
        if ok:
            orders_processed += 1
            sources.append("hazcom_starter_pack")
        else:
            errors.append(f"hz:{tx.get('session_id')}:{note}")

    # ── Zero-match heads-up alert ────────────────────────────────────────────
    # If NO paid order was found for this email, quietly alert Vince so he can
    # follow up (buyer may have used a different email at checkout, etc.).
    zero_match_alert_sent = False
    if orders_processed == 0:
        client_ip = (
            http_request.headers.get("x-forwarded-for", "").split(",")[0].strip()
            or (http_request.client.host if http_request.client else "")
        )
        user_agent = http_request.headers.get("user-agent", "")
        zero_match_alert_sent = await _fire_zero_match_alert(email_lc, client_ip, user_agent)

    # ── Audit log (single row per attempt) ───────────────────────────────────
    await db.gl_resend_log.insert_one({
        "email_lc": email_lc,
        "attempted_at": datetime.now(timezone.utc).isoformat(),
        "orders_found": orders_processed,
        "sources": sources,
        "error": "; ".join(errors)[:500],
        "zero_match_alert_sent": zero_match_alert_sent,
    })

    # Generic response — never reveals whether the email matched any order.
    return {
        "ok": True,
        "message": (
            "If a paid GigLine kit order is on file for that email, we've just "
            "re-sent it. Please check your inbox (and spam folder) in the next "
            "2–3 minutes."
        ),
        "orders_resent": orders_processed,
    }
