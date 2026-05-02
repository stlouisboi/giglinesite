"""Admin dashboard routes (login, stats, leads, downloads, summary)."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime, timezone, timedelta
import os
import logging

import resend
from config import db, ADMIN_PASSWORD, SENDER_EMAIL, VINCE_EMAIL

router = APIRouter()
logger = logging.getLogger('gigline')


INTERNAL_DOCS_DIR = "/app/backend/internal_docs"


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
    }


@router.get("/admin/leads")
async def admin_leads(token: str = "", limit: int = 50):
    """Recent leads: safety checks + walkthrough requests."""
    if token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")

    checks = await db.safety_check_submissions.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    walkthroughs = await db.walkthrough_requests.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    heat_leads = await db.heat_guide_leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)

    return {"safety_checks": checks, "walkthrough_requests": walkthroughs, "heat_guide_leads": heat_leads}


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

