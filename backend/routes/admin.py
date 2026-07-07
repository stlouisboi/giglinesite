"""Admin dashboard routes (login, stats, leads, downloads, summary)."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from pathlib import Path
from datetime import datetime, timezone, timedelta
import os
import io
import csv
import uuid
import logging

import resend
from config import db, ADMIN_PASSWORD, SENDER_EMAIL, VINCE_EMAIL, SUPERVISOR_KIT_FILES

router = APIRouter()
logger = logging.getLogger('gigline')


INTERNAL_DOCS_DIR = "/app/backend/internal_docs"
# Portable: resolve kit_files relative to backend/ so it works on Railway,
# local, and dev container regardless of the deploy root.
_BACKEND_ROOT = Path(__file__).resolve().parent.parent
KIT_FILES_DIR = str(_BACKEND_ROOT / "kit_files")


@router.get("/admin/kit-files")
async def list_kit_files(token: str = ""):
    """Admin-only: list the 11 Supervisor Safety Starter System PDFs on disk.

    Uses SUPERVISOR_KIT_FILES from config so the list always matches the
    manifest used by the buyer-email attachment code.
    """
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    files = []
    for name, path in SUPERVISOR_KIT_FILES.items():
        p = Path(path)
        if p.is_file():
            st = p.stat()
            files.append({
                "filename": name,
                "size_kb": round(st.st_size / 1024, 1),
                "modified": datetime.fromtimestamp(st.st_mtime, tz=timezone.utc).isoformat(),
                "on_disk": True,
            })
        else:
            files.append({
                "filename": name,
                "size_kb": 0,
                "modified": None,
                "on_disk": False,
            })
    files.sort(key=lambda f: f["filename"])
    return {"files": files, "count": sum(1 for f in files if f["on_disk"]), "expected": len(SUPERVISOR_KIT_FILES)}


@router.get("/admin/kit-files/{filename}")
async def download_kit_file(filename: str, token: str = ""):
    """Admin-only: download a Supervisor Safety Starter System PDF."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    safe_name = os.path.basename(filename)
    # Must be in the SUPERVISOR_KIT_FILES manifest (prevents arbitrary reads)
    if safe_name not in SUPERVISOR_KIT_FILES:
        raise HTTPException(status_code=404, detail="Kit file not found")
    filepath = SUPERVISOR_KIT_FILES[safe_name]
    if not Path(filepath).is_file():
        raise HTTPException(status_code=404, detail="Kit file not on disk in this environment")
    return FileResponse(str(filepath), media_type="application/pdf", filename=safe_name)


# GL-WEB-018f — On-demand client-personalized cover generator.
# Streams a copy of any collateral PDF with the client's company name
# printed in the "PREPARED FOR ..." header slug on the cover.
COLLATERAL_DIR = Path("/app/frontend/public/assets")


@router.get("/admin/personalized-pdfs")
async def list_personalizable_pdfs(token: str = ""):
    """Return the list of collateral PDFs that can be personalized."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    from lib.pdf_cover_metadata import COVERS
    items = []
    for filename, meta in COVERS.items():
        path = COLLATERAL_DIR / filename
        items.append({
            "filename": filename,
            "title": meta.get("title", filename),
            "on_disk": path.is_file(),
        })
    items.sort(key=lambda x: x["title"])
    return {"pdfs": items, "count": sum(1 for x in items if x["on_disk"])}


@router.get("/admin/personalized-pdf/{filename}")
async def download_personalized_pdf(
    filename: str,
    client_name: str,
    token: str = "",
):
    """Admin-only: build a client-personalized copy of a collateral PDF and stream it.

    The header slug on the cover changes to `PREPARED FOR {CLIENT NAME} | {year}`.
    File is generated in-memory each request (no disk write) so nothing leaks
    into the public /assets directory.
    """
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    safe_name = os.path.basename(filename)
    from lib.pdf_cover_metadata import COVERS
    if safe_name not in COVERS:
        raise HTTPException(status_code=404, detail="PDF not in personalization manifest")
    src_path = COLLATERAL_DIR / safe_name
    if not src_path.is_file():
        raise HTTPException(status_code=404, detail=f"Source PDF missing on server: {safe_name}")

    client_name_clean = (client_name or "").strip()
    if not client_name_clean or len(client_name_clean) > 80:
        raise HTTPException(status_code=400, detail="client_name must be 1-80 characters")

    # Build to a temp file inside /tmp — never expose in /assets
    import tempfile
    from lib.pdf_cover import prepend_cover_to_pdf
    meta = COVERS[safe_name]
    replace_p1 = meta.get("replace_page_1", False)
    kwargs = {k: v for k, v in meta.items() if k != "replace_page_1"}
    kwargs["client_name"] = client_name_clean

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False, prefix="gl_perso_") as tmp:
        tmp_path = tmp.name
    prepend_cover_to_pdf(
        str(src_path), tmp_path,
        replace_page_1=replace_p1,
        **kwargs,
    )
    slug = client_name_clean.lower().replace(" ", "-").replace("/", "-")[:40]
    download_name = f"{safe_name.rsplit('.', 1)[0]}__{slug}.pdf"
    return FileResponse(tmp_path, media_type="application/pdf", filename=download_name)


@router.get("/admin/internal-docs/{filename}")
async def download_internal_doc(filename: str, token: str = ""):
    """Admin-only: download internal reference docs (field checklists, SOPs, etc.)."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Prevent path traversal
    safe_name = os.path.basename(filename)
    filepath = os.path.join(INTERNAL_DOCS_DIR, safe_name)
    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail="Document not found")
    return FileResponse(filepath, media_type="application/pdf", filename=safe_name)


@router.post("/admin/login")
async def admin_login(body: dict):
    """Simple password auth for admin dashboard."""
    if body.get("password") != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"status": "ok", "token": ADMIN_PASSWORD}


@router.get("/admin/stats")
async def admin_stats(token: str = ""):
    """Dashboard stats: leads, downloads, risk breakdown."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    now = datetime.now(timezone.utc)
    seven_days_ago = (now - timedelta(days=7)).isoformat()
    thirty_days_ago = (now - timedelta(days=30)).isoformat()

    total_checks = await db.safety_check_submissions.count_documents({})
    checks_7d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": seven_days_ago}})
    checks_30d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": thirty_days_ago}})
    high_risk = await db.safety_check_submissions.count_documents({"score_level": "HIGH"})
    medium_risk = await db.safety_check_submissions.count_documents({"score_level": "MEDIUM"})
    low_risk = await db.safety_check_submissions.count_documents({"score_level": "LOW"})

    total_walkthroughs = await db.walkthrough_requests.count_documents({})
    walkthroughs_7d = await db.walkthrough_requests.count_documents({"timestamp": {"$gte": seven_days_ago}})

    total_downloads = await db.download_events.count_documents({})
    sc_downloads = await db.download_events.count_documents({"type": "safety_check_pdf"})
    hazcom_downloads = await db.download_events.count_documents({"type": "hazcom_pdf"})
    heat_downloads = await db.download_events.count_documents({"type": "heat_guide"})
    downloads_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}})

    heat_leads = await db.heat_guide_leads.count_documents({})

    # ── Generic helper: counts + downstream-conversion stats for any lead-magnet collection
    # Each lead-magnet collection stores a "created_at" ISO timestamp and a "contact-like" field
    # (email for sample reports/OSHA guide, or "contact" for quick-contact micro-form).
    async def lead_magnet_stats(collection, contact_field: str = "email", phone_too: bool = False):
        total = await collection.count_documents({})
        last_7d = await collection.count_documents({"created_at": {"$gte": seven_days_ago}})
        last_30d = await collection.count_documents({"created_at": {"$gte": thirty_days_ago}})

        docs = await collection.find({}, {"_id": 0, contact_field: 1}).to_list(None)
        values = [(d.get(contact_field) or "").strip().lower() for d in docs if d.get(contact_field)]

        converted = 0
        if values:
            email_clause = {"email": {"$in": values}}
            if phone_too:
                or_clause = {"$or": [email_clause, {"phone": {"$in": values}}]}
                intake_match = await db.gl_intake_submissions.count_documents(or_clause)
                wt_match = await db.walkthrough_requests.count_documents(or_clause)
            else:
                intake_match = await db.gl_intake_submissions.count_documents(email_clause)
                wt_match = await db.walkthrough_requests.count_documents(email_clause)
            converted = intake_match + wt_match

        rate = round((converted / total) * 100, 1) if total > 0 else 0.0
        return {
            "total": total,
            "last_7d": last_7d,
            "last_30d": last_30d,
            "converted": converted,
            "conversion_rate": rate,
        }

    # Quick-Contact micro-form (GL-WEB-018) — "contact" field can be either email or phone
    quick_contacts_stats = await lead_magnet_stats(db.quick_contact_leads, contact_field="contact", phone_too=True)

    # Sample Report download metrics (GL-WEB-020)
    sample_reports_stats = await lead_magnet_stats(db.sample_report_leads)

    # OSHA Inspection Guide (HR-targeted) metrics (GL-WEB-021)
    hr_osha_guide_stats = await lead_magnet_stats(db.osha_inspection_guide_leads)

    # ── UTM source breakdown (last 30 days): which surfaces drive actual lead conversions
    # Aggregates utm_source across walkthrough_requests (top-level) and
    # gl_intake_submissions.attribution.firstTouch (first-touch attribution).
    source_counts: dict[str, int] = {}

    # walkthrough_requests — top-level utm_source field
    async for d in db.walkthrough_requests.find(
        {"timestamp": {"$gte": thirty_days_ago}},
        {"_id": 0, "utm_source": 1},
    ):
        src = (d.get("utm_source") or "").strip().lower() or "direct"
        source_counts[src] = source_counts.get(src, 0) + 1

    # gl_intake_submissions — attribution.firstTouch.utm_source
    async for d in db.gl_intake_submissions.find(
        {"created_at": {"$gte": thirty_days_ago}},
        {"_id": 0, "attribution": 1},
    ):
        first = (d.get("attribution") or {}).get("firstTouch") or {}
        src = (first.get("utm_source") or "").strip().lower() or "direct"
        source_counts[src] = source_counts.get(src, 0) + 1

    # Sort DESC by count, cap top 10 to keep payload small
    lead_sources_30d = sorted(
        [{"source": s, "count": c} for s, c in source_counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )[:10]

    return {
        "safety_checks": {"total": total_checks, "last_7d": checks_7d, "last_30d": checks_30d},
        "risk_breakdown": {"high": high_risk, "medium": medium_risk, "low": low_risk},
        "walkthrough_requests": {"total": total_walkthroughs, "last_7d": walkthroughs_7d},
        "downloads": {
            "total": total_downloads,
            "last_7d": downloads_7d,
            "safety_check_pdfs": sc_downloads,
            "hazcom_pdfs": hazcom_downloads,
            "heat_guide": heat_downloads,
        },
        "heat_guide_leads": heat_leads,
        "quick_contacts": quick_contacts_stats,
        "sample_reports": sample_reports_stats,
        "hr_osha_guide": hr_osha_guide_stats,
        "lead_sources_30d": lead_sources_30d,
    }


@router.get("/admin/leads")
async def admin_leads(token: str = "", limit: int = 50):
    """Recent leads: safety checks + walkthrough requests."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    checks = await db.safety_check_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    walkthroughs = await db.walkthrough_requests.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    heat_leads = await db.heat_guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    quick_contacts = await db.quick_contact_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)

    return {
        "safety_checks": checks,
        "walkthrough_requests": walkthroughs,
        "heat_guide_leads": heat_leads,
        "quick_contacts": quick_contacts,
    }


@router.get("/admin/downloads")
async def admin_downloads(token: str = "", limit: int = 100):
    """Recent download events."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    events = await db.download_events.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    return {"events": events}


@router.post("/admin/send-summary")
async def send_admin_summary(token: str = ""):
    """Manually trigger the weekly summary email to Vince."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    await send_weekly_summary()
    return {"status": "sent"}


async def send_weekly_summary():
    """Send weekly activity summary email to Vince."""
    now = datetime.now(timezone.utc)
    seven_days_ago = (now - timedelta(days=7)).isoformat()

    checks_7d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": seven_days_ago}})
    high_7d = await db.safety_check_submissions.count_documents({"timestamp": {"$gte": seven_days_ago}, "score_level": "HIGH"})
    walkthroughs_7d = await db.walkthrough_requests.count_documents({"timestamp": {"$gte": seven_days_ago}})
    downloads_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}})
    sc_dl_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}, "type": "safety_check_pdf"})
    hazcom_dl_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}, "type": "hazcom_pdf"})
    heat_dl_7d = await db.download_events.count_documents({"timestamp": {"$gte": seven_days_ago}, "type": "heat_guide"})

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <h2 style="color:#1C2B2B;border-bottom:2px solid #B8972C;padding-bottom:8px;">
        GigLine Weekly Summary
      </h2>
      <p style="color:#666;">Week ending {now.strftime('%B %d, %Y')}</p>
      <h3 style="color:#1C2B2B;margin-top:20px;">Leads</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;">Safety Checks completed</td><td style="font-weight:bold;text-align:right;">{checks_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#c0392b;font-weight:bold;">  — HIGH risk</td><td style="font-weight:bold;text-align:right;color:#c0392b;">{high_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Walkthrough requests</td><td style="font-weight:bold;text-align:right;">{walkthroughs_7d}</td></tr>
      </table>
      <h3 style="color:#1C2B2B;margin-top:20px;">Downloads</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#666;">Safety Check PDFs</td><td style="font-weight:bold;text-align:right;">{sc_dl_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">HazCom Starter Packs</td><td style="font-weight:bold;text-align:right;">{hazcom_dl_7d}</td></tr>
        <tr><td style="padding:6px 0;color:#666;">Heat Guide downloads</td><td style="font-weight:bold;text-align:right;">{heat_dl_7d}</td></tr>
        <tr style="border-top:1px solid #ddd;"><td style="padding:6px 0;font-weight:bold;">Total downloads</td><td style="font-weight:bold;text-align:right;">{downloads_7d}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">
      <p style="color:#999;font-size:12px;">Automated summary from GigLine Safety & Compliance</p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": [VINCE_EMAIL],
            "subject": f"GigLine Weekly Summary — {checks_7d} checks, {walkthroughs_7d} walkthrough requests",
            "html": html,
        })
        logger.info("Weekly summary email sent")
    except Exception as e:
        logger.error(f"Weekly summary email failed: {e}")


@router.get("/admin/seo-health")
async def seo_health_check_endpoint(token: str = "", email: bool = False):
    """Run the SEO/AI-engine health check on production and return the report.

    Usage:
        GET /api/admin/seo-health?token=ADMIN_PW           → JSON report only
        GET /api/admin/seo-health?token=ADMIN_PW&email=1   → JSON report + email Vince if issues found

    Designed to be hit weekly by an external cron service (e.g. cron-job.org)
    with email=1 to get an alert only when something breaks.
    """
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    import sys as _sys
    _sys.path.insert(0, "/app/backend/scripts")
    # Reuse the standalone script's logic
    import importlib.util
    spec = importlib.util.spec_from_file_location("seo_health_check", "/app/backend/scripts/seo_health_check.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)

    results = [module.check_route(p, sch) for p, sch in module.ROUTES]
    sitemap_info = module.check_sitemap()
    total_issues = sum(len(r["issues"]) for r in results) + len(sitemap_info["issues"])

    if email and total_issues > 0:
        module.email_report(results, sitemap_info, total_issues)

    return {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "base_url": module.BASE,
        "total_issues": total_issues,
        "routes_checked": len(results),
        "sitemap": sitemap_info,
        "routes": results,
        "email_sent": bool(email and total_issues > 0),
    }


# ═══ Collection name registry — single source of truth for which collections support which actions ═══
LEAD_COLLECTIONS = {
    # (collection_name, primary_id_field, fallback_id_field_or_None)
    "intake": ("gl_intake_submissions", "clientToken", "id"),
    "walkthrough": ("walkthrough_requests", "id", None),
    "safety_check": ("safety_check_submissions", "id", None),
    "heat_guide": ("heat_guide_leads", "id", None),
}


@router.delete("/admin/lead/{kind}/{doc_id}")
async def delete_lead(kind: str, doc_id: str, token: str = "", hard: bool = False):
    """Soft-delete a lead by copying it to an archive collection then removing the original.

    `kind` selects which collection (intake / walkthrough / safety_check / heat_guide).
    `hard=true` skips the archive copy (permanent delete).
    Recoverable: archived rows live in `<collection>_archive` and can be restored manually if needed.
    """
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    if kind not in LEAD_COLLECTIONS:
        raise HTTPException(status_code=400, detail=f"Unknown lead kind '{kind}'. Valid: {list(LEAD_COLLECTIONS)}")
    coll_name, id_field, fallback_field = LEAD_COLLECTIONS[kind]
    coll = db[coll_name]
    # Try primary id field first; fall back to alternate if not found.
    doc = await coll.find_one({id_field: doc_id})
    matched_field = id_field
    if not doc and fallback_field:
        doc = await coll.find_one({fallback_field: doc_id})
        matched_field = fallback_field
    if not doc:
        raise HTTPException(status_code=404, detail=f"{kind} '{doc_id}' not found")
    if not hard:
        archive = db[f"{coll_name}_archive"]
        doc["archived_at"] = datetime.now(timezone.utc).isoformat()
        doc["archived_by"] = "admin"
        await archive.insert_one(doc)
    result = await coll.delete_one({matched_field: doc_id})
    logger.info(f"Admin deleted {kind}/{doc_id} via {matched_field} (hard={hard})")
    return {"status": "ok", "deleted": result.deleted_count, "archived": not hard}


@router.post("/admin/revenue/manual")
async def add_manual_revenue(body: dict, token: str = ""):
    """Record manually-captured revenue (check/ACH/cash deals) as a synthetic gl_bookings record.

    Body: {
      amount: number (USD, required),
      service: str (optional — e.g. "Safety Walkthrough"),
      clientToken: str (optional — link to existing intake),
      paymentMethod: str (optional — "check"/"ACH"/"cash"/"other"),
      notes: str (optional),
      date: ISO date string (optional — defaults to now)
    }
    """
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        amount = float(body.get("amount") or 0)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="amount must be a number")
    if amount <= 0:
        raise HTTPException(status_code=400, detail="amount must be greater than zero")

    paid_at_raw = body.get("date") or datetime.now(timezone.utc).isoformat()
    record = {
        "bookingId": f"manual-{uuid.uuid4().hex[:10]}",
        "totalCharged": amount,
        "paid": True,
        "manualEntry": True,
        "paymentMethod": body.get("paymentMethod") or "manual",
        "service": body.get("service") or "Manual revenue entry",
        "clientToken": body.get("clientToken") or None,
        "sourceServiceSlug": body.get("source_service_slug") or body.get("sourceServiceSlug") or "manual",
        "notes": body.get("notes") or "",
        "paidAt": paid_at_raw,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "createdBy": "admin",
    }
    await db.gl_bookings.insert_one(record)
    logger.info(f"Admin added manual revenue: ${amount:.2f} method={record['paymentMethod']} token={record['clientToken']}")
    record.pop("_id", None)
    return {"status": "ok", "booking": record}


@router.get("/admin/revenue/list")
async def list_revenue(token: str = "", limit: int = 200):
    """List recent gl_bookings (both Stripe + manual) for admin display."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    rows = await db.gl_bookings.find({"paid": True}, {"_id": 0}).sort("paidAt", -1).to_list(limit)
    total = sum((r.get("totalCharged") or 0) for r in rows)
    return {"bookings": rows, "total_revenue": total, "count": len(rows)}


def _rows_to_csv(rows: list[dict], filename: str) -> StreamingResponse:
    """Stream a list of dicts as a CSV download. Handles varying keys across rows."""
    if not rows:
        rows = [{"info": "no records"}]
    # Collect union of all keys across rows (preserving order of first appearance)
    seen = []
    for r in rows:
        for k in r.keys():
            if k not in seen:
                seen.append(k)
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=seen, extrasaction="ignore")
    writer.writeheader()
    for r in rows:
        # Flatten any nested values to JSON-ish strings so Excel doesn't choke
        safe = {k: ("" if v is None else (v if isinstance(v, (str, int, float, bool)) else str(v))) for k, v in r.items()}
        writer.writerow(safe)
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/admin/export/{kind}.csv")
async def export_csv(kind: str, token: str = ""):
    """Export a collection as CSV (Excel-compatible).

    `kind` options: intake, walkthrough, safety_check, heat_guide, revenue.
    """
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    if kind == "revenue":
        rows = await db.gl_bookings.find({"paid": True}, {"_id": 0}).sort("paidAt", -1).to_list(5000)
        return _rows_to_csv(rows, f"gigline-revenue-{today}.csv")
    if kind not in LEAD_COLLECTIONS:
        raise HTTPException(status_code=400, detail=f"Unknown export kind '{kind}'. Valid: intake, walkthrough, safety_check, heat_guide, revenue")
    coll_name, _, _ = LEAD_COLLECTIONS[kind]
    rows = await db[coll_name].find({}, {"_id": 0}).sort("timestamp", -1).to_list(5000)
    # Many collections use `created_at` instead of `timestamp` — fall back if no rows from sort
    if not rows:
        rows = await db[coll_name].find({}, {"_id": 0}).to_list(5000)
    return _rows_to_csv(rows, f"gigline-{kind}-{today}.csv")
