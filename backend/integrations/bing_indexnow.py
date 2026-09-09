"""IndexNow client (Bing, Yandex, DuckDuckGo, others).

Wraps the IndexNow protocol so FastAPI routes can push URLs to search engines
that support IndexNow without any per-URL quota to fret about.

Public API:
    submit_url(url) -> dict
    submit_urls(urls) -> dict

Config (backend/.env):
    INDEXNOW_KEY              32-char hex key you generated
    INDEXNOW_KEY_LOCATION     Public URL of the {key}.txt verification file
    INDEXNOW_HOST             Canonical host (e.g. www.giglinecompliance.com)

Spec: https://www.indexnow.org/documentation
"""

from __future__ import annotations

import logging
import os
from typing import Iterable

import requests

logger = logging.getLogger("gigline")

# Bing acts as the primary IndexNow endpoint and forwards to other participating
# engines (Yandex, DuckDuckGo, Seznam). Posting once to Bing is sufficient.
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
BATCH_LIMIT = 10_000  # IndexNow accepts up to 10k URLs per submission.
REQUEST_TIMEOUT = 30


class IndexNowConfigError(RuntimeError):
    """Raised when IndexNow env vars are missing / malformed."""


class IndexNowApiError(RuntimeError):
    """Raised when the IndexNow endpoint returns a non-2xx response."""

    def __init__(self, message: str, status: int | None = None, body: str = ""):
        super().__init__(message)
        self.status = status
        self.body = body


def _config() -> tuple[str, str, str]:
    key = (os.environ.get("INDEXNOW_KEY") or "").strip()
    key_location = (os.environ.get("INDEXNOW_KEY_LOCATION") or "").strip()
    host = (os.environ.get("INDEXNOW_HOST") or "").strip()
    if not key or not key_location or not host:
        raise IndexNowConfigError(
            "IndexNow is not fully configured. "
            "Set INDEXNOW_KEY, INDEXNOW_KEY_LOCATION and INDEXNOW_HOST in backend/.env."
        )
    return key, key_location, host


def config_summary() -> dict:
    """Return a shallow config dict for the admin status endpoint (no secrets logged)."""
    key, key_location, host = _config()
    return {
        "host": host,
        "key_prefix": key[:6] + "..." + key[-4:],
        "key_location": key_location,
        "endpoint": INDEXNOW_ENDPOINT,
    }


def submit_urls(urls: Iterable[str]) -> dict:
    """POST a batch of URLs to IndexNow. Returns a summary dict."""
    key, key_location, host = _config()
    url_list = [u.strip() for u in urls if u and u.strip()]
    if not url_list:
        return {"submitted": 0, "http_status": None, "note": "no urls provided"}
    if len(url_list) > BATCH_LIMIT:
        raise ValueError(f"IndexNow accepts at most {BATCH_LIMIT} URLs per call")

    body = {
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": url_list,
    }
    try:
        resp = requests.post(
            INDEXNOW_ENDPOINT,
            json=body,
            headers={"Content-Type": "application/json; charset=utf-8"},
            timeout=REQUEST_TIMEOUT,
        )
    except requests.RequestException as e:
        raise IndexNowApiError(f"network error: {e}") from e

    # IndexNow returns 200/202 on accept, 400 bad request, 403 key mismatch,
    # 422 URLs don't match host, 429 too many requests.
    if resp.status_code not in (200, 202):
        text = (resp.text or "")[:500]
        logger.warning(f"IndexNow HTTP {resp.status_code}: {text}")
        raise IndexNowApiError(
            f"IndexNow returned HTTP {resp.status_code}",
            status=resp.status_code,
            body=text,
        )
    return {
        "submitted": len(url_list),
        "http_status": resp.status_code,
        "body": (resp.text or "").strip(),
    }


def submit_url(url: str) -> dict:
    """Convenience: submit a single URL."""
    return submit_urls([url])
