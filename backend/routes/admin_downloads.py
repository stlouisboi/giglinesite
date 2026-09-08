"""Token-gated internal downloads (SOP + templates + zip bundle).

Every endpoint requires ?token=ADMIN_PASSWORD. Files live at
`/app/backend/static/downloads/<bucket>/<filename>` and are streamed with a
Content-Disposition attachment header so browsers offer a save-as prompt.

Endpoints:
    GET  /api/admin/downloads/{bucket}                  List files in a bucket
    GET  /api/admin/downloads/{bucket}/{filename}       Download a specific file

Buckets currently supported: ongoing-support (Ongoing Safety Support SOP set).
"""

from __future__ import annotations

import logging
import re
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from config import ADMIN_PASSWORD

router = APIRouter()
logger = logging.getLogger("gigline")

DOWNLOADS_ROOT = Path("/app/backend/static/downloads")
SAFE_NAME = re.compile(r"^[A-Za-z0-9._-]+$")

BUCKET_LABELS = {
    "ongoing-support": {
        "title": "Ongoing Safety Support",
        "description": "SOP plus 10 delivery templates. Refresh by rerunning /app/scripts/render_sop_pdfs.py.",
    },
}


def _require_admin(token: str) -> None:
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")


def _bucket_dir(bucket: str) -> Path:
    if bucket not in BUCKET_LABELS:
        raise HTTPException(status_code=404, detail="Unknown bucket")
    d = DOWNLOADS_ROOT / bucket
    if not d.is_dir():
        raise HTTPException(status_code=404, detail="Bucket has no files yet")
    return d


@router.get("/admin/downloads/{bucket}")
async def list_bucket(bucket: str, token: str = ""):
    _require_admin(token)
    d = _bucket_dir(bucket)
    items = []
    for f in sorted(d.iterdir()):
        if not f.is_file():
            continue
        items.append({
            "filename": f.name,
            "size_bytes": f.stat().st_size,
            "size_kb": f.stat().st_size // 1024,
            "kind": "zip" if f.suffix.lower() == ".zip" else "pdf",
        })
    return {
        "bucket": bucket,
        **BUCKET_LABELS[bucket],
        "count": len(items),
        "items": items,
    }


@router.get("/admin/downloads/{bucket}/{filename}")
async def get_file(bucket: str, filename: str, token: str = ""):
    _require_admin(token)
    if not SAFE_NAME.match(filename):
        raise HTTPException(status_code=400, detail="Invalid filename")
    d = _bucket_dir(bucket)
    fp = d / filename
    if not fp.is_file():
        raise HTTPException(status_code=404, detail="File not found")

    media_type = "application/zip" if fp.suffix.lower() == ".zip" else "application/pdf"
    return FileResponse(
        path=str(fp),
        media_type=media_type,
        filename=filename,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
