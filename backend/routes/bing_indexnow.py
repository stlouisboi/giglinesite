"""IndexNow (Bing + friends) admin endpoints.

All gated by ADMIN_PASSWORD passed as `token`:
  GET  /api/admin/bing-index/status         — config check + key file URL
  POST /api/admin/bing-index/submit-url     — push one URL
  POST /api/admin/bing-index/submit-sitemap — push URLs from sitemap.xml (optional days filter)
  GET  /api/admin/bing-index/log            — recent submissions from Mongo
"""

from __future__ import annotations

import logging
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config import db, ADMIN_PASSWORD, is_admin
from integrations.bing_indexnow import (
    IndexNowApiError,
    IndexNowConfigError,
    config_summary,
    submit_url,
    submit_urls,
)

router = APIRouter()
logger = logging.getLogger("gigline")

SITEMAP_PATH = Path("/app/frontend/public/sitemap.xml")
# IndexNow itself accepts up to 10k URLs, but keep our bulk cap sane for safety.
BULK_LIMIT_HARD = 500
LOG_COLLECTION = "bing_indexnow_log"


def _require_admin(token: str) -> None:
    if not is_admin(token):
        raise HTTPException(status_code=401, detail="Unauthorized")


async def _log(entry: dict) -> None:
    doc = {"createdAt": datetime.now(timezone.utc).isoformat(), **entry}
    await db[LOG_COLLECTION].insert_one(doc)


class SubmitUrlPayload(BaseModel):
    token: str
    url: str


class SubmitSitemapPayload(BaseModel):
    token: str
    days: Optional[int] = 0        # 0 or omitted → push all URLs
    limit: Optional[int] = 100     # cap URLs per call (max 500)


@router.get("/admin/bing-index/status")
async def status(token: str = ""):
    _require_admin(token)
    try:
        cfg = config_summary()
        return {
            "configured": True,
            **cfg,
            "sitemap_present": SITEMAP_PATH.is_file(),
            "bulk_limit_hard": BULK_LIMIT_HARD,
        }
    except IndexNowConfigError as e:
        return {
            "configured": False,
            "error": str(e),
            "sitemap_present": SITEMAP_PATH.is_file(),
            "bulk_limit_hard": BULK_LIMIT_HARD,
        }


@router.post("/admin/bing-index/submit-url")
async def submit_single(payload: SubmitUrlPayload):
    _require_admin(payload.token)
    url = payload.url.strip()
    if not url or not url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="url must be an absolute http(s) URL")
    entry = {"source": "single", "urls": [url]}
    try:
        resp = submit_url(url)
        entry.update({"status": "success", "response": resp})
        await _log(entry)
        return {"status": "success", "url": url, "response": resp}
    except IndexNowConfigError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except IndexNowApiError as e:
        entry.update({"status": "error", "http_status": e.status, "error": str(e), "body": e.body})
        await _log(entry)
        raise HTTPException(status_code=502, detail={"http_status": e.status, "message": str(e), "body": e.body})


def _parse_sitemap_urls(root_xml: ET.Element, cutoff_iso: Optional[str]) -> list[str]:
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls: list[tuple[str, str]] = []
    for url_el in root_xml.findall("sm:url", ns):
        loc_el = url_el.find("sm:loc", ns)
        if loc_el is None or not (loc_el.text or "").strip():
            continue
        lastmod_el = url_el.find("sm:lastmod", ns)
        lastmod = (lastmod_el.text or "").strip() if lastmod_el is not None else ""
        urls.append((loc_el.text.strip(), lastmod))
    if cutoff_iso is None:
        return [u for u, _ in urls]
    return [u for u, lm in urls if lm and lm >= cutoff_iso]


@router.post("/admin/bing-index/submit-sitemap")
async def submit_sitemap(payload: SubmitSitemapPayload):
    _require_admin(payload.token)
    if not SITEMAP_PATH.is_file():
        raise HTTPException(status_code=404, detail=f"sitemap.xml not found at {SITEMAP_PATH}")

    limit = max(1, min(payload.limit or 100, BULK_LIMIT_HARD))
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

    entry = {"source": "sitemap", "urls": urls, "cutoff_date": cutoff_iso}
    try:
        resp = submit_urls(urls)
        entry.update({"status": "success", "response": resp})
        await _log(entry)
        return {
            "status": "done",
            "cutoff_date": cutoff_iso,
            "total_matched": len(all_urls),
            "limit_applied": limit,
            "submitted": resp.get("submitted", 0),
            "http_status": resp.get("http_status"),
        }
    except IndexNowConfigError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except IndexNowApiError as e:
        entry.update({"status": "error", "http_status": e.status, "error": str(e), "body": e.body})
        await _log(entry)
        raise HTTPException(
            status_code=502,
            detail={"http_status": e.status, "message": str(e), "body": e.body},
        )


@router.get("/admin/bing-index/log")
async def read_log(token: str = "", limit: int = 50):
    _require_admin(token)
    limit = max(1, min(limit, 200))
    cursor = db[LOG_COLLECTION].find({}, {"_id": 0}).sort("createdAt", -1).limit(limit)
    items = await cursor.to_list(length=limit)
    return {"count": len(items), "items": items}
