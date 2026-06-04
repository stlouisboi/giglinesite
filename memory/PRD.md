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
- Swap placeholder testimonials with real client quotes when available (P2) — 2 placeholder slots ready on Homepage
- GL-WEB-030: Homepage + Service Page Conversion Fixes (Feb 2026) — DONE
  - Hero CTA changed to "Request a Safety Walkthrough" → /services with pricing direction line below
  - Pricing direction line repeated above footer
  - CTA buttons added after Process and FAQ sections
  - OSHA Issues section: added lead-in sentence + consequence line ("single citation averages $15,625")
  - Testimonials redesigned: 3-card grid (light #F7F9FC bg) — Demar quote in card 1, 2 "Coming soon" placeholder cards
  - About/Founder copy replaced with new Vince Lawrence bio (plastics/building materials/trucking background)
  - "From the Field" Recent Articles section added above final CTA with 4 Field Notes links (heat, forklift, electrical, hazcom)
  - Service Page tier qualifiers updated on all 3 cards (Walkthrough, Documentation, Incident)
  - Post-submit confirmation copy: "After you submit, you'll receive your custom pricing and a scheduling confirmation within one business day."
  - Meta description tightened to 147 chars (under 160) — OSHA 30-Hour Certified emphasized
  - Homepage H1 confirmed in static HTML shell
  - Phone (336) 329-8899 confirmed sitewide (desktop nav + mobile)
- GL-PORT-001 Addendum: Automated pricing logic in Vince notification email (DONE)
- GL-PORT-001 Section B: Client Status Page, Secure Report Delivery, Admin Enhancements, E-Signature (Apr 2026)
  - /status/{token}: 6-stage client status timeline, token-based access, no login
  - /report/{token}: Secure report delivery with PDF viewer, token-based access logged
  - /onboarding: Now 6 steps (added Agreement signing step), payment locked until signed
  - Server-side agreement PDF via reportlab, stored per clientToken
  - Admin: intake-submissions list, bookings list, status updates, report upload, portal-stats summary
  - Enhanced Admin Dashboard UI: summary strip (5 metrics), 5 tabs (Portal/Intakes/Bookings/Leads/Downloads), status badges, urgency badges, flags (W/M/C), view drawer, status update modal, report upload modal
  - Single clientToken per engagement ties together intake, status, agreement, booking, and report

## Generative Engine Optimization (GEO) — May 2026
Goal: get GigLine cited in answers from ChatGPT, Perplexity, Claude, Google AI Overviews, Gemini.
- Full schema package on homepage, services, about, and every city page — LocalBusiness, Service, Person (Vince w/ credentials), FAQPage, BreadcrumbList, Article (blog). All JSON-LD blocks now injected into the pre-rendered static HTML via generate-seo-pages.js (no JS required to read them).
- SEO component upgraded to accept either a single schema object or an array of schemas.
- New /faq page (`/app/frontend/src/pages/FAQPage.js`) with 18 answer-engine-optimized Q&As covering cost, scope, duration, differences vs OSHA inspection, NC service area, report content, credentials, booking. Includes FAQPage + BreadcrumbList schema.
- Each city landing page (/safety-walkthrough/{city}) now has 4 city-specific FAQs + FAQPage schema.
- /faq linked from Footer → Quick Links and from each city FAQ section.
- /faq added to sitemap.xml (priority 0.9).
- llms.txt created at /app/frontend/public/llms.txt — canonical content map for AI crawlers.
- robots.txt expanded with explicit Allow for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bytespider, CCBot, cohere-ai, Meta-ExternalAgent, Meta-ExternalFetcher.
- generate-seo-pages.js rewritten to strip the template LocalBusiness block and inject a route-specific JSON-LD set per page (Person for /about, Article for blog posts, Service+FAQPage for city pages, full FAQPage for /faq, LocalBusiness+Person+FAQPage on home).

## Case Study — Mocksville Plastics OSHA Inspection (Jun 2026)
- New page `/case-studies/mocksville-plastics-osha-inspection` (`/app/frontend/src/pages/CaseStudyMocksvillePage.js`)
- Structured as Hero (kicker + headline + 4-up stats bar) → The Situation → The Walkthrough → 4 Findings (cards with CFR codes + penalty ranges: 1904.32 recordkeeping, 1910.178(l) forklifts, 1910.22(a)(1) housekeeping, 1910.37(a)(3) egress) → The Six Weeks Between (4 FixBlocks) → Inspection Day → What This Buys → What's Repeatable → Navy/gold CTA band routing to /walkthrough
- Article + BreadcrumbList JSON-LD wired into generate-seo-pages.js
- Sitemap entry added (priority 0.9)
- Internal discoverability: shared `/app/frontend/src/components/CaseStudyTeaser.js` (navy + gold band, 3 outcome stat chips, gold CTA) embedded on Homepage (between Google review badge and Process section) and Services page (between Service Cards and Coverage section). Static HTML pre-renderer also includes a "Recent Outcome — Case Study" anchor link on both / and /services for crawler discoverability.

## Deployment
- Frontend: Vercel (manual redeploy after GitHub push)
- Backend: Railway (auto-deploys on GitHub push)
- Database: MongoDB Atlas (gigline cluster)
- REACT_APP_BACKEND_URL in Vercel must point to Railway URL
deploys on GitHub push)
- Database: MongoDB Atlas (gigline cluster)
- REACT_APP_BACKEND_URL in Vercel must point to Railway URL
