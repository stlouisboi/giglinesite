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
- **GL-WEB-001–010**: Safety Check, SEO, Contact, Homepage iterations, HazCom, Blog, Heat Guide, OG Image, City Pages, Service Area
- **GL-WEB-013–026**: Homepage Funnel, UTM, Safety Check Funnel, Admin Dashboard, Layout Fixes, Asymmetric Redesign, Page Overhauls, Production Deploy, GA4, Pricing, Image Optimization, Heat Guide
- **GL-WEB-027**: Backend Refactoring — server.py split into modular /routes (Apr 2026)
- **GL-WEB-028**: Homepage parsing error fix (Apr 2026)
- **GL-WEB-029**: Production E2E Testing — all forms, Stripe, admin verified (Apr 2026)
- **GL-WEB-011**: Field Notes Expansion + Client Testimonials (Apr 2026)
  - 4 new/enhanced Field Notes: Electrical Safety/Arc Flash, Forklift Safety, Confined Space Entry, Scaffolding Safety
  - Each with oshaChecks, cfrCitation, FAQPage schema, Article JSON-LD, internal links
  - 3-card Testimonials section on Homepage (Demar Archie real review + 2 placeholders)
  - Sitemap updated to 30 URLs

## Field Notes (12 total)
1. Heat Stress
2. Forklift Safety & Daily Inspections (enhanced — oshaChecks, CFR, FAQ schema)
3. Electrical Safety & Arc Flash (enhanced — oshaChecks, CFR, FAQ schema)
4. HazCom & SDS
5. Machine Guarding
6. Walking Surfaces
7. Lockout/Tagout
8. Emergency Action Plans
9. PPE Assessment & Use
10. Fall Protection
11. Confined Space Entry (NEW — oshaChecks, CFR, FAQ schema)
12. Scaffolding Safety (NEW — oshaChecks, CFR, FAQ schema)

## Key Endpoints
- POST /api/walkthrough/request
- POST /api/safety-check/submit
- POST /api/payments/checkout
- GET /api/payments/status/{session_id}
- POST /api/hazcom/checkout
- POST /api/heat-guide/submit
- POST /api/admin/login
- GET /api/admin/stats
- POST /api/intake/submit
- POST /api/intake/upload
- GET /api/onboarding/tiers
- POST /api/onboarding/checkout
- GET /api/onboarding/confirm
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
- Monthly Field Notes content expansion (P2) — 14 articles live, next round TBD
- Swap placeholder testimonials with real client quotes when available (P2)
- GL-PORT-001 Addendum: Automated pricing logic in Vince notification email (DONE)

## Deployment
- Frontend: Vercel (manual redeploy after GitHub push)
- Backend: Railway (auto-deploys on GitHub push)
- Database: MongoDB Atlas (gigline cluster)
- REACT_APP_BACKEND_URL in Vercel must point to Railway URL
deploys on GitHub push)
- Database: MongoDB Atlas (gigline cluster)
- REACT_APP_BACKEND_URL in Vercel must point to Railway URL
