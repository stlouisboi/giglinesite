"""Admin authentication dependency (SEC-002).

Every admin endpoint historically accepted the ADMIN_PASSWORD via a `?token=`
query parameter. Query strings leak into:

  * Railway and Vercel access logs
  * Browser history and bookmarks
  * The Referer header of any outbound link from an authenticated tab
  * Third-party analytics that log URLs

This module ships a shared FastAPI dependency :func:`require_admin` that
authenticates on ``Authorization: Bearer <admin_password>`` **first**, then
falls back to the legacy ``?token=`` query parameter for a controlled
migration window. Every fallback hit emits a WARNING log so ops can spot
which endpoints still need the frontend converted.

Once the frontend has been fully migrated to header auth, the fallback branch
can be deleted and any request without the header will return 401.
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import HTTPException, Request

from config import ADMIN_PASSWORD

logger = logging.getLogger("gigline")


def _extract_bearer(auth_header: Optional[str]) -> Optional[str]:
    if not auth_header:
        return None
    parts = auth_header.strip().split(None, 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    return parts[1].strip() or None


async def require_admin(request: Request) -> str:
    """FastAPI dependency: authenticate an admin request.

    Order of resolution:
      1. ``Authorization: Bearer <token>`` header — preferred.
      2. Legacy ``?token=`` query parameter — logged as deprecated.

    Raises HTTPException(401) if neither carries the correct password.
    Returns the presented token on success (for downstream logging tags).
    """
    header_token = _extract_bearer(request.headers.get("authorization"))
    if header_token and header_token == ADMIN_PASSWORD:
        return header_token

    query_token = request.query_params.get("token")
    if query_token and query_token == ADMIN_PASSWORD:
        # Legacy path — mark it so we can drive the deprecation to zero.
        # We intentionally do NOT log the token value itself.
        logger.warning(
            "admin auth via query param used on %s (frontend must migrate "
            "to Authorization: Bearer)",
            request.url.path,
        )
        return query_token

    raise HTTPException(status_code=401, detail="Unauthorized")


def verify_admin_token(token: Optional[str], request: Optional[Request] = None) -> None:
    """Synchronous equivalent for legacy endpoints that still pull ``token: str``
    from their signature.

    Accepts either the legacy query token OR the Bearer header (when the
    request is passed). Logs a deprecation warning on query-only usage.
    """
    if request is not None:
        header_token = _extract_bearer(request.headers.get("authorization"))
        if header_token and header_token == ADMIN_PASSWORD:
            return
    if token and token == ADMIN_PASSWORD:
        if request is not None:
            logger.warning(
                "admin auth via query param used on %s (frontend must migrate "
                "to Authorization: Bearer)",
                request.url.path,
            )
        return
    raise HTTPException(status_code=401, detail="Unauthorized")
