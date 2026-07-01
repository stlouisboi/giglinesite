"""GigLine Safety & Compliance — FastAPI application entry point."""

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import asyncio
import os

from config import client, logger

# Route modules
from routes.health import router as health_router
from routes.walkthrough import router as walkthrough_router
from routes.payments import router as payments_router
from routes.hazcom import router as hazcom_router
from routes.heat_guide import router as heat_guide_router
from routes.safety_check import router as safety_check_router, process_drip_emails
from routes.admin import router as admin_router, send_weekly_summary
from routes.admin_crm import router as admin_crm_router
from routes.walkthrough_landing import router as walkthrough_landing_router
from routes.newsletter import router as newsletter_router
from routes.intake import router as intake_router
from routes.portal import router as portal_router
from routes.supervisor_kit import router as supervisor_kit_router
from routes.sample_report import router as sample_report_router
from routes.quick_contact import router as quick_contact_router
from routes.contact_message import router as contact_message_router
from routes.osha_inspection_guide import router as osha_inspection_guide_router

app = FastAPI()

# ── API Router (all routes under /api prefix) ──
api_router = APIRouter(prefix="/api")
api_router.include_router(health_router)
api_router.include_router(walkthrough_router)
api_router.include_router(payments_router)
api_router.include_router(hazcom_router)
api_router.include_router(heat_guide_router)
api_router.include_router(safety_check_router)
api_router.include_router(admin_router)
api_router.include_router(admin_crm_router)
api_router.include_router(walkthrough_landing_router)
api_router.include_router(newsletter_router)
api_router.include_router(intake_router)
api_router.include_router(portal_router)
api_router.include_router(supervisor_kit_router)
api_router.include_router(sample_report_router)
api_router.include_router(quick_contact_router)
api_router.include_router(contact_message_router)
api_router.include_router(osha_inspection_guide_router)

app.include_router(api_router)

# ── CORS ──
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Background schedulers ──
async def drip_scheduler():
    """Process drip emails every 30 minutes."""
    while True:
        try:
            sent = await process_drip_emails()
            if sent > 0:
                logger.info(f"Drip scheduler: sent {sent} email(s)")
        except Exception as e:
            logger.error(f"Drip scheduler error: {str(e)}")
        await asyncio.sleep(1800)


async def weekly_summary_scheduler():
    """Send weekly summary every Monday at 8 AM EST (~13:00 UTC)."""
    from datetime import datetime, timezone
    while True:
        now = datetime.now(timezone.utc)
        if now.weekday() == 0 and now.hour == 13 and now.minute < 30:
            await send_weekly_summary()
        await asyncio.sleep(1800)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(drip_scheduler())
    asyncio.create_task(weekly_summary_scheduler())
    logger.info("Drip email scheduler started (runs every 30 minutes)")
    logger.info("Weekly summary scheduler started (runs Monday 8 AM EST)")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
