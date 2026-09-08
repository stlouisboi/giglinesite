"""QR Evidence Hub, kit authenticity minting + verification.

Every paid citation-proof kit order mints one record in `gl_kit_qr_records`
with a random, URL-safe token. A QR code encoding
`https://www.giglinecompliance.com/verify/{token}` is generated (PNG, base64)
and returned so the buyer confirmation email can embed it as an inline data-URI.

Public verification lives at `GET /api/verify/{token}` (defined in
routes/kit_qr.py). Every scan increments `verified_count` and logs the timestamp.

Design notes:
  * Tokens are `secrets.token_urlsafe(16)` (128 bits of entropy, ~22 chars).
  * PII is scrubbed from the public verify response, we only expose kit
    name/tier/mint date. Buyer email is not returned.
  * The verify record is idempotent per session_id, minting is safe to retry.
"""

from __future__ import annotations

import base64
import io
import logging
import os
import secrets
from datetime import datetime, timezone

import qrcode
from qrcode.constants import ERROR_CORRECT_M

from config import db

logger = logging.getLogger("gigline")

# The public site URL used by every QR code. Env override for staging.
_PUBLIC_HOST = (os.environ.get("PUBLIC_SITE_URL") or "https://www.giglinecompliance.com").rstrip("/")

QR_COLLECTION = "gl_kit_qr_records"


def _new_token() -> str:
    return secrets.token_urlsafe(16)


def render_qr_png_b64(url: str) -> str:
    """Render a URL as a QR PNG and return base64 (no data-URI prefix)."""
    qr = qrcode.QRCode(
        version=None,                 # auto-size
        error_correction=ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#102A43", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("ascii")


async def mint_kit_qr(
    *,
    session_id: str,
    kit_slug: str,
    kit_name: str,
    tier: str,
    tier_name: str,
    customer_email: str | None,
    customer_name: str | None = None,
    amount_total_cents: int | None = None,
) -> dict:
    """Mint (or reuse) a QR record for a paid kit order.

    Returns a dict with:
        token, verify_url, qr_png_b64, minted_at, new (bool)
    """
    existing = await db[QR_COLLECTION].find_one(
        {"session_id": session_id}, {"_id": 0}
    )
    if existing:
        # Rebuild the QR image on demand rather than storing bytes in Mongo.
        verify_url = f"{_PUBLIC_HOST}/verify/{existing['token']}"
        return {
            "token": existing["token"],
            "verify_url": verify_url,
            "qr_png_b64": render_qr_png_b64(verify_url),
            "minted_at": existing["minted_at"],
            "new": False,
        }

    token = _new_token()
    verify_url = f"{_PUBLIC_HOST}/verify/{token}"
    now = datetime.now(timezone.utc).isoformat()

    doc = {
        "token": token,
        "session_id": session_id,
        "kit_slug": kit_slug,
        "kit_name": kit_name,
        "tier": tier,
        "tier_name": tier_name,
        "customer_email": customer_email,
        "customer_name": customer_name,
        "amount_total_cents": amount_total_cents,
        "minted_at": now,
        "verified_count": 0,
        "last_verified_at": None,
    }
    await db[QR_COLLECTION].insert_one(doc)
    logger.info(f"QR minted for session {session_id}: token={token[:8]}... kit={kit_slug}/{tier}")

    return {
        "token": token,
        "verify_url": verify_url,
        "qr_png_b64": render_qr_png_b64(verify_url),
        "minted_at": now,
        "new": True,
    }
