"""Google Indexing API — admin endpoints.

Endpoints (all gated by ADMIN_PASSWORD passed as `token`):
  GET  /api/admin/google-index/status       — is the SA configured? which email?
  POST /api/admin/google-index/submit-url   — submit a single URL (URL_UPDATED | URL_DELETED)
  POST /api/admin/google-index/submit-sitemap — bulk-push URLs from sitemap.xml,
                                                optionally filtered to the last N days
  GET  /api/admin/google-index/log          — recent submissions from Mongo
"""

from __future__ import annotations

import logging
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config import db, ADMIN_PASSWORD
from integrations.google_indexing import (
    IndexingApiError,
    IndexingConfigError,
    publish_url_notification,
    service_account_email,
)

router = APIRouter()
logger = logging.getLogger("gigline")

SITEMAP_PATH = Path("/app/frontend/public/sitemap.xml")
# Google Indexing API is intended for individual URL submissions and rate-limited
# to 200/day by default. Cap bulk pushes so we don't burn the quota in one click.
BULK_LIMIT_HARD = 100
LOG_COLLECTION = "google_indexing_log"

NotificationType = Literal["URL_UPDATED", "URL_DELETED"]


def _require_admin(token: str) -> None:
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")


async def _log_submission(entry: dict) -> None:
    doc = {"createdAt": datetime.now(timezone.utc).isoformat(), **entry}
    await db[LOG_COLLECTION].insert_one(doc)


class SubmitUrlPayload(BaseModel):
    token: str
    url: str
    notification_type: NotificationType = "URL_UPDATED"


class SubmitSitemapPayload(BaseModel):
    token: str
    notification_type: NotificationType = "URL_UPDATED"
    days: Optional[int] = 30       # only URLs with <lastmod> within N days
    limit: Optional[int] = 50      # cap number pushed in one call (max 100)


@router.get("/admin/google-index/status")
async def status(token: str = ""):
    _require_admin(token)
    try:
        email = service_account_email()
        return {
            "configured": True,
            "service_account_email": email,
            "sitemap_present": SITEMAP_PATH.is_file(),
            "bulk_limit_hard": BULK_LIMIT_HARD,
        }
    except IndexingConfigError as e:
        return {
            "configured": False,
            "error": str(e),
            "sitemap_present": SITEMAP_PATH.is_file(),
            "bulk_limit_hard": BULK_LIMIT_HARD,
        }


@router.post("/admin/google-index/submit-url")
async def submit_url(payload: SubmitUrlPayload):
    _require_admin(payload.token)
    url = payload.url.strip()
    if not url or not url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="url must be an absolute http(s) URL")

    entry = {
        "url": url,
        "notification_type": payload.notification_type,
        "source": "single",
    }
    try:
        resp = publish_url_notification(url, payload.notification_type)
        entry.update({"status": "success", "response": resp})
        await _log_submission(entry)
        return {"status": "success", "url": url, "response": resp}
    except IndexingConfigError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except IndexingApiError as e:
        entry.update({"status": "error", "http_status": e.status, "error": str(e), "details": e.details})
        await _log_submission(entry)
        raise HTTPException(status_code=502, detail={"http_status": e.status, "message": str(e), "details": e.details})


def _parse_sitemap_urls(root_xml: ET.Element, cutoff_iso: Optional[str]) -> list[str]:
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls: list[tuple[str, str]] = []  # (loc, lastmod-or-empty)
    for url_el in root_xml.findall("sm:url", ns):
        loc_el = url_el.find("sm:loc", ns)
        if loc_el is None or not (loc_el.text or "").strip():
            continue
        lastmod_el = url_el.find("sm:lastmod", ns)
        lastmod = (lastmod_el.text or "").strip() if lastmod_el is not None else ""
        urls.append((loc_el.text.strip(), lastmod))
    if cutoff_iso is None:
        return [u for u, _ in urls]
    # Filter: keep entries whose lastmod is >= cutoff (missing lastmod is skipped)
    return [u for u, lm in urls if lm and lm >= cutoff_iso]


@router.post("/admin/google-index/submit-sitemap")
async def submit_sitemap(payload: SubmitSitemapPayload):
    _require_admin(payload.token)
    if not SITEMAP_PATH.is_file():
        raise HTTPException(status_code=404, detail=f"sitemap.xml not found at {SITEMAP_PATH}")

    limit = max(1, min(payload.limit or 50, BULK_LIMIT_HARD))
    cutoff_iso: Optional[str] = None
    if payload.days and payload.days > 0:
        cutoff = datetime.now(timezone.utc) - timedelta(days=payload.days)
        cutoff_iso = cutoff.strftime("%Y-%m-%d")

    try:
        tree = ET.parse(str(SITEMAP_PATH))
    except ET.ParseError as e:
        raise HTTPException(status_code=500, detail=f"sitemap.xml parse error: {e}")
    all_urls = _parse_sitemap_urls(tree.getroot(), cutoff_iso)
    urls = all_urls[:limit]

    results = {"submitted": 0, "failed": 0, "skipped": 0, "items": []}
    for url in urls:
        entry = {
            "url": url,
            "notification_type": payload.notification_type,
            "source": "sitemap",
        }
        try:
            resp = publish_url_notification(url, payload.notification_type)
            entry.update({"status": "success", "response": resp})
            results["submitted"] += 1
            results["items"].append({"url": url, "status": "success"})
        except IndexingConfigError as e:
            # Credentials broken → no point iterating further
            entry.update({"status": "error", "error": str(e)})
            await _log_submission(entry)
            results["failed"] += 1
            results["items"].append({"url": url, "status": "error", "error": str(e)})
            raise HTTPException(status_code=503, detail=str(e))
        except IndexingApiError as e:
            entry.update({"status": "error", "http_status": e.status, "error": str(e), "details": e.details})
            results["failed"] += 1
            results["items"].append({"url": url, "status": "error", "http_status": e.status, "error": str(e)})
        await _log_submission(entry)

    return {
        "status": "done",
        "notification_type": payload.notification_type,
        "cutoff_date": cutoff_iso,
        "total_matched": len(all_urls),
        "limit_applied": limit,
        **results,
    }


@router.get("/admin/google-index/log")
async def read_log(token: str = "", limit: int = 50):
    _require_admin(token)
    limit = max(1, min(limit, 200))
    cursor = db[LOG_COLLECTION].find({}, {"_id": 0}).sort("createdAt", -1).limit(limit)
    items = await cursor.to_list(length=limit)
    return {"count": len(items), "items": items}
