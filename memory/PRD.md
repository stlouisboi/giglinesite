# GigLine Safety & Compliance — PRD

## Problem Statement
Build and expand a professional service business website for GigLine Safety & Compliance. A direct-response funnel targeting small operators (manufacturing, warehouse, contractor) to request paid safety walkthroughs. Handles real Stripe deposits, Safety Check form submissions with email gating, Resend-powered email drip campaigns, Admin dashboard lead tracking, and Field Notes resource library.

## Architecture
- **Frontend:** React + Tailwind CSS (Vercel)
- **Backend:** FastAPI + MongoDB Atlas (Railway: giglinesite-production.up.railway.app)
- **Payments:** Stripe (live key)
- **Email:** Resend (drip campaigns + notifications)
- **Analytics:** Google Analytics 4 (G-FNX42NP1QT)
- **Database:** MongoDB Atlas (cluster0.nb1dqdq.mongodb.net/gigline)

## Backend Architecture (Refactored Apr 2026)
```
/app/backend/
├── server.py          # Thin entry point — mounts routes, CORS, schedulers
├── config.py          # Shared config: DB, Stripe, Resend, constants, SERVICE_PACKAGES
├── models.py          # All Pydantic models
├── stripe_native.py   # Native Stripe SDK wrapper (for Railway)
├── email_sequences.py # Drip email templates + rendering
├── pdf_generator.py   # Safety Check PDF report generation
├── routes/
│   ├── health.py      # GET /health, GET /, status CRUD
│   ├── walkthrough.py # POST /walkthrough/request
│   ├── payments.py    # POST /payments/checkout, GET /payments/status, webhook
│   ├── hazcom.py      # POST /hazcom/checkout, GET /hazcom/verify, download
│   ├── heat_guide.py  # POST /heat-guide/submit
│   ├── safety_check.py# POST /safety-check/submit, submissions, report, drip processing
│   └── admin.py       # Login, stats, leads, downloads, weekly summary
```

## Completed Specs
- **GL-WEB-001–012**: Safety Check, SEO, Contact, Homepage iterations, HazCom, Blog, Heat Guide, OG Image
- **GL-WEB-013**: Homepage — 9-Section Conversion Funnel
- **GL-WEB-014**: Homepage Polish + UTM Tracking
- **GL-WEB-015**: Safety Check 3-Phase Funnel + Homepage additions
- **GL-WEB-016**: Admin Dashboard + Download Tracking + Weekly Email Summary
- **GL-WEB-017**: Layout/Rendering Fixes + Footer Restructure + Field Notes
- **GL-WEB-018**: 10-Section Asymmetric Homepage Redesign (Apr 2026)
- **GL-WEB-019**: Homepage Refinements (Apr 2026)
- **GL-WEB-020**: About Page Overhaul (Apr 2026)
- **GL-WEB-021**: Services Page Redesign (Apr 2026)
- **GL-WEB-022**: Production Deployment (Apr 2026)
- **GL-WEB-023**: GA4 Analytics (Apr 2026)
- **GL-WEB-024**: Pricing Standardization (Apr 2026)
- **GL-WEB-025**: Image Optimization (Apr 2026)
- **GL-WEB-026**: Heat Stress PDF Download on Field Notes (Apr 2026)
- **GL-WEB-027**: Backend Refactoring — server.py split into modular /routes (Apr 2026)
- **GL-WEB-028**: Homepage parsing error fix (Apr 2026)
- **GL-WEB-029**: Production E2E Testing — all forms, Stripe, admin verified (Apr 2026)

## Key Endpoints
- POST /api/walkthrough/request
- POST /api/safety-check/submit
- POST /api/payments/checkout
- GET /api/payments/status/{session_id}
- POST /api/hazcom/checkout
- POST /api/heat-guide/submit
- POST /api/admin/login
- GET /api/admin/stats
- GET /api/health

## Pricing (Backend SERVICE_PACKAGES)
- Walkthrough Small: $650 | Standard: $750
- Doc Review Remote: $550 | On-site: $750
- Incident Standard: $900 | Urgent: $1,200
- Deposits: $200 / $150 / $300
- HazCom Starter Pack: $29

## Upcoming Tasks
- Video embeds (P1) — waiting on YouTube/Vimeo links
- Facebook Pixel / Google Ads conversion tracking (P1)
- Monthly Field Notes content expansion (P2)
- Client testimonials / social proof section (P2)

## Deployment
- Frontend: Vercel (manual redeploy after GitHub push)
- Backend: Railway (auto-deploys on GitHub push)
- Database: MongoDB Atlas (gigline cluster)
- REACT_APP_BACKEND_URL in Vercel must point to Railway URL
