"""QR Evidence Hub public + admin routes.

Public:
    GET  /api/verify/{token}         Return kit authenticity metadata + increment scan count.

Admin (token=ADMIN_PASSWORD):
    GET  /api/admin/kit-qr/list      Recent records
    POST /api/admin/kit-qr/mint      Manually mint for a session_id (backfill)
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config import ADMIN_PASSWORD, db
from lib.kit_qr import QR_COLLECTION, mint_kit_qr, render_qr_png_b64

router = APIRouter()
logger = logging.getLogger("gigline")


# ── Public verification ────────────────────────────────────────────────
@router.get("/verify/{token}")
async def verify_kit(token: str):
    if not token or len(token) < 8 or len(token) > 64:
        raise HTTPException(status_code=404, detail="Not found")

    record = await db[QR_COLLECTION].find_one({"token": token}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="No matching kit record for this token.")

    # Increment scan count (fire-and-forget-ish, we await for consistency).
    now = datetime.now(timezone.utc).isoformat()
    await db[QR_COLLECTION].update_one(
        {"token": token},
        {"$inc": {"verified_count": 1}, "$set": {"last_verified_at": now}},
    )

    # Public-safe response: no email, no name, no dollar amount.
    return {
        "verified": True,
        "kit_slug": record.get("kit_slug"),
        "kit_name": record.get("kit_name"),
        "tier": record.get("tier"),
        "tier_name": record.get("tier_name"),
        "minted_at": record.get("minted_at"),
        "verified_count": (record.get("verified_count") or 0) + 1,
    }


# ── Admin ──────────────────────────────────────────────────────────────
class MintPayload(BaseModel):
    token: str
    session_id: str
    kit_slug: str
    kit_name: str
    tier: str
    tier_name: str
    customer_email: Optional[str] = None
    customer_name: Optional[str] = None
    amount_total_cents: Optional[int] = None


@router.get("/admin/kit-qr/list")
async def list_records(token: str = "", limit: int = 50):
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    limit = max(1, min(limit, 200))
    cursor = db[QR_COLLECTION].find({}, {"_id": 0}).sort("minted_at", -1).limit(limit)
    items = await cursor.to_list(length=limit)
    return {"count": len(items), "items": items}


@router.post("/admin/kit-qr/mint")
async def admin_mint(payload: MintPayload):
    if payload.token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    result = await mint_kit_qr(
        session_id=payload.session_id,
        kit_slug=payload.kit_slug,
        kit_name=payload.kit_name,
        tier=payload.tier,
        tier_name=payload.tier_name,
        customer_email=payload.customer_email,
        customer_name=payload.customer_name,
        amount_total_cents=payload.amount_total_cents,
    )
    return result
