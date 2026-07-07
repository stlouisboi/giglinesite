"""Shared configuration: DB, Stripe, Resend, service packages, constants."""

from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from dotenv import load_dotenv
import os
import logging

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe
try:
    from emergentintegrations.payments.stripe.checkout import (
        StripeCheckout,
        CheckoutSessionResponse,
        CheckoutStatusResponse,
        CheckoutSessionRequest,
    )
    USE_NATIVE_STRIPE = False
except ImportError:
    USE_NATIVE_STRIPE = True

import stripe as stripe_lib

stripe_api_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')

# Resend
import resend

resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
VINCE_EMAIL = os.environ.get('VINCE_EMAIL', 'vince@giglinecompliance.com')

# Admin
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'gigline2026')

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger('gigline')

# ── SERVICE PACKAGES ──

SERVICE_PACKAGES = {
    "walkthrough_small": {
        "name": "Safety Walkthrough & Top 10 Fixes Report (Small Site)",
        "amount": 650.00,
        "description": "Local small site - single building, 1 shift",
    },
    "walkthrough_standard": {
        "name": "Safety Walkthrough & Top 10 Fixes Report (Standard)",
        "amount": 750.00,
        "description": "Standard site walkthrough with full report",
    },
    "documentation_remote": {
        "name": "OSHA Documentation Readiness Review (Remote)",
        "amount": 550.00,
        "description": "Remote review - send PDFs/scans for analysis",
    },
    "documentation_onsite": {
        "name": "OSHA Documentation Readiness Review (On-site)",
        "amount": 750.00,
        "description": "On-site document review with follow-up",
    },
    "incident_standard": {
        "name": "Incident Review & Corrective Action Support (Standard)",
        "amount": 900.00,
        "description": "Non-emergency incident review, single incident",
    },
    "incident_urgent": {
        "name": "Incident Review & Corrective Action Support (Urgent)",
        "amount": 1200.00,
        "description": "High-urgency or complex incident support",
    },
    "deposit_walkthrough": {
        "name": "Deposit - Safety Walkthrough (Balance due before visit)",
        "amount": 200.00,
        "description": "Reserve your walkthrough date. Remaining balance due before on-site visit.",
        "is_deposit": True,
        "deposit_for": "walkthrough",
    },
    "deposit_documentation": {
        "name": "Deposit - Documentation Review (Balance due before delivery)",
        "amount": 150.00,
        "description": "Reserve your review slot. Remaining balance due before report delivery.",
        "is_deposit": True,
        "deposit_for": "documentation",
    },
    "deposit_incident": {
        "name": "Deposit - Incident Review (Balance due before engagement)",
        "amount": 300.00,
        "description": "Secure immediate support. Remaining balance due before engagement begins.",
        "is_deposit": True,
        "deposit_for": "incident",
    },
}

HAZCOM_PRODUCT = {
    "name": "HazCom Starter Pack — Small Shop Edition",
    "amount": 29.00,
    "description": "Written HazCom Program, SDS Binder Checklist + Index, Training Verification Log (11 pages total)",
}

HAZCOM_FILES = {
    "GL-HAZCOM-001_Written_Program.pdf": ROOT_DIR / "hazcom_files" / "GL-HAZCOM-001_Written_Program.pdf",
    "GL-HAZCOM-002_SDS_Binder_Checklist.pdf": ROOT_DIR / "hazcom_files" / "GL-HAZCOM-002_SDS_Binder_Checklist.pdf",
    "GL-HAZCOM-003_Training_Log.pdf": ROOT_DIR / "hazcom_files" / "GL-HAZCOM-003_Training_Log.pdf",
}

HEAT_STRESS_PDF = ROOT_DIR / "heat_files" / "GL_Heat_Stress_Print_2026.pdf"

# ── Sample Compliance Report (GL-WEB-017 Item 2) ──
# Placeholder PDF in place. Swap the file at this path to update the deliverable.
SAMPLE_REPORT_PDF = ROOT_DIR / "sample_report_files" / "GL_Sample_Compliance_Report.pdf"

# ── OSHA Inspection Guide (GL-WEB-019) ──
# Backend-side Resend fallback delivery. Primary delivery still runs via MailerLite automation.
OSHA_GUIDE_PDF = ROOT_DIR / "osha_guide_files" / "GigLine_OSHA_Inspection_Guide.pdf"

# ── Supervisor Safety Starter System (GL-WEB-015) ──
SUPERVISOR_KIT_PRODUCTS = {
    "digital": {
        "name": "Supervisor Safety Starter System — Digital Kit",
        "amount_cents": 60000,  # $600
        "sku": "supervisor-kit-digital",
        "needs_shipping": False,
    },
    "physical": {
        "name": "Supervisor Safety Starter System — Physical Kit",
        "amount_cents": 67500,  # $675
        "sku": "supervisor-kit-physical",
        "needs_shipping": True,
    },
}

# The 11 PDFs that make up the kit. Names match the labels shown on /supervisor-kit.
SUPERVISOR_KIT_FILES = {
    "SS-00_Quick_Reference_Card.pdf": ROOT_DIR / "kit_files" / "SS-00_Quick_Reference_Card.pdf",
    "SS-01_Welcome.pdf": ROOT_DIR / "kit_files" / "SS-01_Welcome.pdf",
    "SS-02_Chemical_Inventory_Log.pdf": ROOT_DIR / "kit_files" / "SS-02_Chemical_Inventory_Log.pdf",
    "SS-03_SDS_Index.pdf": ROOT_DIR / "kit_files" / "SS-03_SDS_Index.pdf",
    "SS-04_Written_HazCom_Program.pdf": ROOT_DIR / "kit_files" / "SS-04_Written_HazCom_Program.pdf",
    "SS-05_30Day_Action_Checklist.pdf": ROOT_DIR / "kit_files" / "SS-05_30Day_Action_Checklist.pdf",
    "SS-06_One_Phone_Call_Card.pdf": ROOT_DIR / "kit_files" / "SS-06_One_Phone_Call_Card.pdf",
    "SS-07_If_OSHA_Shows_Up.pdf": ROOT_DIR / "kit_files" / "SS-07_If_OSHA_Shows_Up.pdf",
    "SS-08_When_To_Call_For_Help.pdf": ROOT_DIR / "kit_files" / "SS-08_When_To_Call_For_Help.pdf",
    "SS-09_Monthly_Safety_Inspection.pdf": ROOT_DIR / "kit_files" / "SS-09_Monthly_Safety_Inspection.pdf",
    "SS-10_Training_Record_Log.pdf": ROOT_DIR / "kit_files" / "SS-10_Training_Record_Log.pdf",
}

# ── Google Business Profile review URL ──
# Vince can swap to a short link (g.page/r/...) via env var without code change.
# Fallback is a Google search for GigLine in Kernersville, NC.
GIGLINE_GOOGLE_REVIEW_URL = os.environ.get(
    'GIGLINE_GOOGLE_REVIEW_URL',
    'https://g.page/r/CdlAYUu_I3xpEAI/review',
)

# GL-WEB-018 (Jul 2026) — Supervisor Safety Starter System feature flag.
# When false: checkout endpoints return 503, /supervisor-kit redirects to /services,
# UI tiles/links are hidden across the site. /verify keeps working so existing
# paid orders can still be confirmed. Flip via SUPERVISOR_KIT_ENABLED=true in .env.
SUPERVISOR_KIT_ENABLED = os.environ.get('SUPERVISOR_KIT_ENABLED', 'false').lower() == 'true'
