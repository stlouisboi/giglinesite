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
    "sku": "hazcom-starter-pack",
    "amount": 29.00,
    "description": "Written HazCom Program, SDS Binder Checklist + Index, Training Verification Log (11 pages total)",
    "image_path": "/assets/field-notes/hazcom-sds-binder.webp",
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

# ── GigLine Supervisor Safety OS (GL-WEB-015) ──
SUPERVISOR_KIT_PRODUCTS = {
    "digital": {
        "name": "GigLine Supervisor Safety OS — Digital Kit",
        "amount_cents": 60000,  # $600
        "sku": "supervisor-kit-digital",
        "needs_shipping": False,
        "image_path": "/assets/gl-fm-2026-cover.webp",
    },
    "physical": {
        "name": "GigLine Supervisor Safety OS — Physical Binder Kit",
        "amount_cents": 70000,  # $700 (includes free USPS Priority shipping)
        "sku": "supervisor-kit-physical",
        "needs_shipping": True,
        "image_path": "/assets/gl-fm-2026-cover.webp",
    },
}

# v1.1 — Digital fulfillment attaches the complete 20-page master PDF PLUS every
# one of the 17 individual per-doc PDFs so buyers can reprint any single form
# on demand without re-splitting the bound system.
SUPERVISOR_KIT_FILES = {
    "GigLine_Supervisor_Safety_OS_v1.pdf": ROOT_DIR / "kit_files" / "GigLine_Supervisor_Safety_OS_v1.pdf",
}

_KIT_INDIVIDUAL_DIR = ROOT_DIR / "kit_files" / "os_v1_individual"
SUPERVISOR_KIT_INDIVIDUAL_FILES = {
    "SS-01_Start_Here.pdf":                             _KIT_INDIVIDUAL_DIR / "SS-01_Start_Here.pdf",
    "SS-02_30_Day_Action_Checklist.pdf":                _KIT_INDIVIDUAL_DIR / "SS-02_30_Day_Action_Checklist.pdf",
    "SS-03A_Chemical_Inventory_Log_Example.pdf":        _KIT_INDIVIDUAL_DIR / "SS-03A_Chemical_Inventory_Log_Example.pdf",
    "SS-03B_Chemical_Inventory_Log_Blank.pdf":          _KIT_INDIVIDUAL_DIR / "SS-03B_Chemical_Inventory_Log_Blank.pdf",
    "SS-04A_SDS_Index_Example.pdf":                     _KIT_INDIVIDUAL_DIR / "SS-04A_SDS_Index_Example.pdf",
    "SS-04B_SDS_Index_Blank.pdf":                       _KIT_INDIVIDUAL_DIR / "SS-04B_SDS_Index_Blank.pdf",
    "SS-05_Written_HazCom_Program.pdf":                 _KIT_INDIVIDUAL_DIR / "SS-05_Written_HazCom_Program.pdf",
    "SS-06A_Monthly_Safety_Inspection_Example.pdf":     _KIT_INDIVIDUAL_DIR / "SS-06A_Monthly_Safety_Inspection_Example.pdf",
    "SS-06B_Monthly_Safety_Inspection_Blank.pdf":       _KIT_INDIVIDUAL_DIR / "SS-06B_Monthly_Safety_Inspection_Blank.pdf",
    "SS-07A_Corrective_Action_Log_Example.pdf":         _KIT_INDIVIDUAL_DIR / "SS-07A_Corrective_Action_Log_Example.pdf",
    "SS-07B_Corrective_Action_Log_Blank.pdf":           _KIT_INDIVIDUAL_DIR / "SS-07B_Corrective_Action_Log_Blank.pdf",
    "SS-08_OSHA_Coverage_Map.pdf":                      _KIT_INDIVIDUAL_DIR / "SS-08_OSHA_Coverage_Map.pdf",
    "SS-09A_HazCom_Toolbox_Talk.pdf":                   _KIT_INDIVIDUAL_DIR / "SS-09A_HazCom_Toolbox_Talk.pdf",
    "SS-09B_HazCom_Knowledge_Check.pdf":                _KIT_INDIVIDUAL_DIR / "SS-09B_HazCom_Knowledge_Check.pdf",
    "SS-10_Emergency_Response_Card.pdf":                _KIT_INDIVIDUAL_DIR / "SS-10_Emergency_Response_Card.pdf",
    "SS-11_90_Day_Implementation_Roadmap.pdf":          _KIT_INDIVIDUAL_DIR / "SS-11_90_Day_Implementation_Roadmap.pdf",
    "SS-12_Next_Step_Book_GigLine_Review.pdf":          _KIT_INDIVIDUAL_DIR / "SS-12_Next_Step_Book_GigLine_Review.pdf",
}

# Complete-first ordering matches the customer's expected inbox experience:
# the bound master opens first, then the individual files sit below it.
SUPERVISOR_KIT_FILES = {**SUPERVISOR_KIT_FILES, **SUPERVISOR_KIT_INDIVIDUAL_FILES}

# ── Google Business Profile review URL ──
# Vince can swap to a short link (g.page/r/...) via env var without code change.
# Fallback is a Google search for GigLine in Kernersville, NC.
GIGLINE_GOOGLE_REVIEW_URL = os.environ.get(
    'GIGLINE_GOOGLE_REVIEW_URL',
    'https://g.page/r/CdlAYUu_I3xpEAI/review',
)

# GL-WEB-018 (Jul 2026) — GigLine Supervisor Safety OS feature flag.
# When false: checkout endpoints return 503, /supervisor-kit redirects to /services,
# UI tiles/links are hidden across the site. /verify keeps working so existing
# paid orders can still be confirmed. Flip via SUPERVISOR_KIT_ENABLED=true in .env.
SUPERVISOR_KIT_ENABLED = os.environ.get('SUPERVISOR_KIT_ENABLED', 'false').lower() == 'true'

# ── Citation-Proof Kit Series (Feb 2026) ──
# 6 product/tier combinations across 2 kits — 3 tiers each.
# All ship via Stripe Checkout. Digital + Control System are electronic-only
# (auto-attach PDF). Binder Edition attaches the SAME PDF as Control System
# and also physically ships a pre-printed, tabbed binder — Stripe collects
# the ship-to address inline during checkout, Vince receives an ACTION
# REQUIRED "SHIP THIS BINDER" email with the address block.
CITATION_PROOF_KIT_PRODUCTS = {
    ("loto-readiness-kit", "digital"): {
        "name": "Machine-Specific LOTO Readiness Kit — Digital Compliance Kit",
        "short_name": "Machine-Specific LOTO Readiness Kit",
        "tier_label": "Digital Compliance Kit",
        "amount_cents": 15000,
        "sku": "citation-proof-loto-digital",
        "pdf_path": "/app/backend/kit_files/GigLine_LOTO_Digital_Compliance_Kit_150.pdf",
        "pdf_filename": "GigLine_LOTO_Digital_Compliance_Kit.pdf",
        "physical_binder": False,
        "collect_shipping": False,
        "image_path": "/assets/kits/loto/loto-hero.png",
    },
    ("loto-readiness-kit", "control-system"): {
        "name": "Machine-Specific LOTO Readiness Kit — Compliance Control System",
        "short_name": "Machine-Specific LOTO Readiness Kit",
        "tier_label": "Compliance Control System",
        "amount_cents": 30000,
        "sku": "citation-proof-loto-control-system",
        "pdf_path": "/app/backend/kit_files/GigLine_LOTO_Compliance_Control_System_300.pdf",
        "pdf_filename": "GigLine_LOTO_Compliance_Control_System.pdf",
        "physical_binder": False,
        "collect_shipping": False,
        "image_path": "/assets/kits/loto/loto-hero.png",
    },
    ("loto-readiness-kit", "binder"): {
        "name": "Machine-Specific LOTO Readiness Kit — Inspector-Ready Binder Edition",
        "short_name": "Machine-Specific LOTO Readiness Kit",
        "tier_label": "Inspector-Ready Binder Edition",
        "amount_cents": 60000,
        "sku": "citation-proof-loto-binder",
        "pdf_path": "/app/backend/kit_files/GigLine_LOTO_Compliance_Control_System_300.pdf",
        "pdf_filename": "GigLine_LOTO_Compliance_Control_System.pdf",
        "physical_binder": True,
        "collect_shipping": True,
        "image_path": "/assets/kits/loto/loto-physical-mockup.png",
    },
    ("forklift-pit-readiness-kit", "digital"): {
        "name": "Forklift / PIT Readiness Kit — Digital Compliance Kit",
        "short_name": "Forklift / PIT Readiness Kit",
        "tier_label": "Digital Compliance Kit",
        "amount_cents": 15000,
        "sku": "citation-proof-pit-digital",
        "pdf_path": "/app/backend/kit_files/GigLine_PIT_Digital_Compliance_Kit_150.pdf",
        "pdf_filename": "GigLine_PIT_Digital_Compliance_Kit.pdf",
        "physical_binder": False,
        "collect_shipping": False,
        "image_path": "/assets/kits/pit/pit-hero.png",
    },
    ("forklift-pit-readiness-kit", "control-system"): {
        "name": "Forklift / PIT Readiness Kit — Compliance Control System",
        "short_name": "Forklift / PIT Readiness Kit",
        "tier_label": "Compliance Control System",
        "amount_cents": 30000,
        "sku": "citation-proof-pit-control-system",
        "pdf_path": "/app/backend/kit_files/GigLine_PIT_Compliance_Control_System_300.pdf",
        "pdf_filename": "GigLine_PIT_Compliance_Control_System.pdf",
        "physical_binder": False,
        "collect_shipping": False,
        "image_path": "/assets/kits/pit/pit-hero.png",
    },
    ("forklift-pit-readiness-kit", "binder"): {
        "name": "Forklift / PIT Readiness Kit — Inspector-Ready Binder Edition",
        "short_name": "Forklift / PIT Readiness Kit",
        "tier_label": "Inspector-Ready Binder Edition",
        "amount_cents": 60000,
        "sku": "citation-proof-pit-binder",
        "pdf_path": "/app/backend/kit_files/GigLine_PIT_Compliance_Control_System_300.pdf",
        "pdf_filename": "GigLine_PIT_Compliance_Control_System.pdf",
        "physical_binder": True,
        "collect_shipping": True,
        "image_path": "/assets/kits/pit/pit-physical-mockup.png",
    },
    ("hazcom-pro-kit", "digital"): {
        "name": "HazCom Pro Kit — Digital Compliance Kit",
        "short_name": "HazCom Pro Kit",
        "tier_label": "Digital Compliance Kit",
        "amount_cents": 15000,
        "sku": "citation-proof-hazcom-pro-digital",
        "pdf_path": "/app/backend/kit_files/GigLine_HazCom_Pro_Digital_Compliance_Kit_150.pdf",
        "pdf_filename": "GigLine_HazCom_Pro_Digital_Compliance_Kit.pdf",
        "physical_binder": False,
        "collect_shipping": False,
        "image_path": "/assets/kits/hazcom-pro/hazcom-digital-150-sq.png",
    },
    ("hazcom-pro-kit", "control-system"): {
        "name": "HazCom Pro Kit — Compliance Control System",
        "short_name": "HazCom Pro Kit",
        "tier_label": "Compliance Control System",
        "amount_cents": 30000,
        "sku": "citation-proof-hazcom-pro-control-system",
        "pdf_path": "/app/backend/kit_files/GigLine_HazCom_Pro_Compliance_Control_System_300.pdf",
        "pdf_filename": "GigLine_HazCom_Pro_Compliance_Control_System.pdf",
        "physical_binder": False,
        "collect_shipping": False,
        "image_path": "/assets/kits/hazcom-pro/hazcom-control-300-sq.png",
    },
    ("hazcom-pro-kit", "binder"): {
        "name": "HazCom Pro Kit — Inspector-Ready Binder Edition",
        "short_name": "HazCom Pro Kit",
        "tier_label": "Inspector-Ready Binder Edition",
        "amount_cents": 60000,
        "sku": "citation-proof-hazcom-pro-binder",
        "pdf_path": "/app/backend/kit_files/GigLine_HazCom_Pro_Compliance_Control_System_300.pdf",
        "pdf_filename": "GigLine_HazCom_Pro_Compliance_Control_System.pdf",
        "physical_binder": True,
        "collect_shipping": True,
        "image_path": "/assets/kits/hazcom-pro/hazcom-binder-600-sq.png",
    },
}

# Backwards-compat alias — old endpoint / old code paths still expect only the
# $150 digital entries under this name. Keep in sync with the digital entries above.
CITATION_PROOF_KIT_DIGITAL_PRODUCTS = {
    slug: {**cfg, "slug": slug}
    for (slug, tier), cfg in CITATION_PROOF_KIT_PRODUCTS.items()
    if tier == "digital"
}
