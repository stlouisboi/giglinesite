"""Emergent Object Storage helper for GigLine.

Provides a persistent, cross-container file store for intake attachments and
Safety Check report PDFs. Replaces the previous pod-disk / inline-base64
stubs which either dropped files silently or bloated Mongo documents.

Env vars:
    EMERGENT_LLM_KEY       — required. Same key used for LLM integrations.
    INTEGRATION_PROXY_URL  — optional. Defaults to the public proxy.
"""

from __future__ import annotations

import logging
import os
from typing import Tuple

import requests

logger = logging.getLogger("gigline")

APP_NAME = "gigline"

STORAGE_BASE = (
    (os.environ.get("INTEGRATION_PROXY_URL") or "").strip()
    or "https://integrations.emergentagent.com"
)
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")

# Session-scoped storage key. Set once at startup, reused by every request.
# On 404 from an /objects call we may retry with force=True once.
_storage_key: str | None = None


class StorageError(RuntimeError):
    """Raised for any object-storage failure the caller should surface as HTTP 5xx."""


def init_storage(force: bool = False) -> str:
    """Mint (or return the cached) storage key. Call once at app startup."""
    global _storage_key
    if _storage_key and not force:
        return _storage_key
    if not EMERGENT_KEY:
        raise StorageError("EMERGENT_LLM_KEY not configured")
    resp = requests.post(
        f"{STORAGE_URL}/init",
        json={"emergent_key": EMERGENT_KEY},
        timeout=30,
    )
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    logger.info("Object storage initialised (key len=%d)", len(_storage_key or ""))
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    """Upload bytes to `path` and return {'path','size','etag'}."""
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    if resp.status_code == 404:
        # Cached storage key may have gone inactive. Re-init once and retry.
        key = init_storage(force=True)
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data,
            timeout=120,
        )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str) -> Tuple[bytes, str]:
    """Return (content_bytes, content_type)."""
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    if resp.status_code == 404:
        # Retry once with a fresh key in case ours expired. Genuine 404s (missing
        # object) will 404 again and bubble up via raise_for_status.
        key = init_storage(force=True)
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key},
            timeout=60,
        )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


MIME_TYPES = {
    "pdf": "application/pdf",
    "doc": "application/msword",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xls": "application/vnd.ms-excel",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "png": "image/png",
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
}
