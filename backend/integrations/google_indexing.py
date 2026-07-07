"""Google Indexing API client (service-account OAuth).

Wraps the official `google-api-python-client` for the Indexing API v3 so
FastAPI routes can call `publish_url_notification(url, "URL_UPDATED")` without
worrying about credential plumbing.

Credentials are loaded from the env var `GOOGLE_INDEXING_SA_JSON_BASE64`
(the whole service-account JSON, base-64 encoded — set via .env).

Public API:
    publish_url_notification(url, notification_type) -> dict
    get_url_notification_metadata(url)               -> dict
"""

from __future__ import annotations

import base64
import binascii
import json
import logging
import os
from functools import lru_cache
from typing import Literal

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

logger = logging.getLogger("gigline")

SCOPES = ["https://www.googleapis.com/auth/indexing"]
NotificationType = Literal["URL_UPDATED", "URL_DELETED"]


class IndexingConfigError(RuntimeError):
    """Raised when the service-account JSON is missing or malformed."""


class IndexingApiError(RuntimeError):
    """Raised when the Google Indexing API returns a non-2xx response."""

    def __init__(self, message: str, status: int | None = None, details: dict | None = None):
        super().__init__(message)
        self.status = status
        self.details = details or {}


def _load_service_account_info() -> dict:
    raw = os.environ.get("GOOGLE_INDEXING_SA_JSON_BASE64", "").strip()
    if not raw:
        raise IndexingConfigError(
            "GOOGLE_INDEXING_SA_JSON_BASE64 is not set. "
            "Base-64-encode your service account JSON and paste it in backend/.env."
        )
    try:
        decoded = base64.b64decode(raw, validate=True).decode("utf-8")
    except (binascii.Error, UnicodeDecodeError) as e:
        raise IndexingConfigError(f"GOOGLE_INDEXING_SA_JSON_BASE64 is not valid base-64 UTF-8: {e}") from e
    try:
        info = json.loads(decoded)
    except json.JSONDecodeError as e:
        raise IndexingConfigError(f"Decoded credentials are not valid JSON: {e}") from e
    if info.get("type") != "service_account" or not info.get("client_email"):
        raise IndexingConfigError("Credentials JSON is not a service-account key.")
    return info


@lru_cache(maxsize=1)
def _service():
    """Lazily build & cache the Google Indexing API service client."""
    info = _load_service_account_info()
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    # cache_discovery=False silences the file-cache noise on read-only FSes.
    return build("indexing", "v3", credentials=creds, cache_discovery=False)


def service_account_email() -> str:
    """Return the email of the configured service account (for admin diagnostics)."""
    return _load_service_account_info().get("client_email", "")


def publish_url_notification(url: str, notification_type: NotificationType) -> dict:
    """POST /v3/urlNotifications:publish — returns the parsed JSON response.

    Raises IndexingConfigError if credentials are missing / bad, or
    IndexingApiError on HTTP failures.
    """
    if notification_type not in ("URL_UPDATED", "URL_DELETED"):
        raise ValueError(f"notification_type must be URL_UPDATED or URL_DELETED, got {notification_type}")
    body = {"url": url, "type": notification_type}
    try:
        resp = _service().urlNotifications().publish(body=body).execute()
    except HttpError as e:
        try:
            details = json.loads(e.content.decode("utf-8"))
        except Exception:
            details = {"raw": (e.content or b"").decode("utf-8", errors="replace")}
        msg = details.get("error", {}).get("message") if isinstance(details, dict) else str(e)
        logger.warning(f"Indexing API HTTP {e.resp.status} for {url}: {msg}")
        raise IndexingApiError(msg or f"HTTP {e.resp.status}", status=e.resp.status, details=details) from e
    return resp


def get_url_notification_metadata(url: str) -> dict:
    """GET /v3/urlNotifications/metadata?url=... — returns latest known notification."""
    try:
        return _service().urlNotifications().getMetadata(url=url).execute()
    except HttpError as e:
        try:
            details = json.loads(e.content.decode("utf-8"))
        except Exception:
            details = {}
        raise IndexingApiError(str(e), status=e.resp.status, details=details) from e
