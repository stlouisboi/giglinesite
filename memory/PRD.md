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

## Completed Specs
- **GL-WEB-001–012**: Safety Check, SEO, Contact, Homepage iterations, HazCom, Blog, Heat Guide, OG Image
- **GL-WEB-013**: Homepage — 9-Section Conversion Funnel
- **GL-WEB-014**: Homepage Polish + UTM Tracking
- **GL-WEB-015**: Safety Check 3-Phase Funnel + Homepage additions
- **GL-WEB-016**: Admin Dashboard + Download Tracking + Weekly Email Summary
- **GL-WEB-017**: Layout/Rendering Fixes + Footer Restructure + Field Notes
- **GL-WEB-018**: 10-Section Asymmetric Homepage Redesign (Apr 2026)
- **GL-WEB-019**: Homepage Refinements (Apr 2026)
  - Hero copy: "$16,550 citation" hook + "Starting at $650"
  - Unified statement anchor with background depth + vignette
  - Consequence lines on grid cards (no CFR codes)
  - Tightened process copy, OSHA comparison visual contrast
  - Pricing only at final CTA
- **GL-WEB-020**: About Page Overhaul (Apr 2026)
  - Shorter paragraphs, standalone statement anchor
  - Dual CTA (Walkthrough + Safety Check)
  - "Why GigLine" transition line, LaunchPath distinction
- **GL-WEB-021**: Services Page Redesign (Apr 2026)
  - 3-card layout with hover effects, pricing tiers, gold CTAs
  - "Not Sure?" bottom CTA section
- **GL-WEB-022**: Production Deployment (Apr 2026)
  - MongoDB Atlas connected
  - Backend deployed to Railway
  - Stripe refactored to native library (no emergentintegrations dependency)
  - Fixed dollar-to-cents conversion
  - Health check endpoint added
- **GL-WEB-023**: GA4 Analytics (Apr 2026)
  - Route-change tracking on all pages
  - Conversion events: walkthrough requests, safety check completions, PDF downloads, service bookings
- **GL-WEB-024**: Pricing Standardization (Apr 2026)
  - All references updated to "Starting at $650"
- **GL-WEB-025**: Image Optimization (Apr 2026)
  - All field photos compressed (30MB → 800KB total)
  - Sitemap updated with all pages
- **GL-WEB-026**: Heat Stress PDF Download on Field Notes (Apr 2026)

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
