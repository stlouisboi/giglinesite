# GigLine Safety & Compliance — Product Requirements Document

## Original Problem Statement
B2B lead generation funnel for an OSHA compliance consultancy (Vince Lawrence / GigLine) targeting the Piedmont Triad NC market. React + FastAPI + MongoDB stack. The application captures qualified walkthrough requests, drives them through a structured intake flow, and tracks revenue and engagement in an internal admin dashboard.

## Architecture
- **Frontend**: React 18, Tailwind CSS, react-router-dom, react-helmet-async
  - SEO pre-rendering via `frontend/scripts/generate-seo-pages.js` (runs post `craco build`)
  - Strict typography lock: **Inter** for text, **JetBrains Mono** for prices/stats
- **Backend**: FastAPI (`/app/backend`)
- **Database**: MongoDB (`gl_intake_submissions`, `gl_bookings`, etc.)

## Routing Source of Truth (Feb 2026)
- `/intake` → `ClientIntakePage` (primary lead capture; reads `?service=<slug>` for attribution)
- `/request-walkthrough` → **legacy redirect to `/intake`** (preserves bookmarks + old SEO)
- Service detail pages live at `/services/<slug>`:
  - `/services/safety-walkthrough` and `/services/safety-walkthrough-report` → `SafetyWalkthroughPage`
  - `/services/document-development` → `DocumentDevelopmentPage`
  - `/services/annual-compliance-partner` → `AnnualCompliancePartnerPage`
  - `/services/compliance-readiness-visit` → `ComplianceReadinessVisitPage`
  - `/services/incident-review` → `IncidentReviewPage`
  - `/services/osha-ready-control-system` → `OshaReadyControlSystemPage`
  - `/services/documentation-readiness-review` and any other slug → `ServiceDetailPage` (data-driven)
- Every service detail page is now pre-rendered by `generate-seo-pages.js` so production deployments no longer fall back to the homepage HTML shell.

## Recently Completed (Feb 2026)
- **Intake Page (GL-WEB-009 changes 6–9, Feb 26 2026)**: Added "What happens next" 4-step block above the form (review → fixed quote → schedule → written report in 48h). Added "About Vince" mirror block at the bottom — navy section with `/vince-founder.png`, 6 stats, and the full About-page body copy. Meta/OG tags skipped per user (no stale `$650` / `$15,625` strings existed on the page).
- Sitewide `/request-walkthrough` → `/intake` cleanup (hero CTA points to `/intake?service=safety-walkthrough-report`).
- App.js redirects legacy `/request-walkthrough` route to `/intake`.
- sitemap.xml, llms.txt, and SEO generator updated to reference `/intake`.
- Added pre-rendered SEO routes for all 7 service detail pages in `generate-seo-pages.js`.
- Admin dashboard: manual revenue entry, intake deletion, CSV exports (revenue + intake).
- 6 pixel-perfect Manus-prototype service pages.
- Deep SEO refresh for 10 Triad city landing pages.
- Real-world floor-finding photography on homepage.
- Source-attribution tracking on intake form (`sourceServiceSlug`).
- Theme-aware favicons.

## Pending / Backlog
**P1**
- Supervisor Training Kit shell (GL-WEB-013): plumb backend PDF storage + Resend transactional email. Needs user to upload 9 PDFs and provide Resend API key.
  - Pricing (per GL-WEB-014, June 13 spec): **Digital $199 · Physical $249**.

**P2**
- Replace "David R." testimonial placeholder with real Google Review text (user to supply).
- Leave-behind v9 rebuild (door-knock QR flyer — updated services/pricing).
- Google Review short link added to delivered report PDFs.
- 4-touch Past Client Retention sequence in MailerLite (needs MailerLite key).
- Founder intro video swap on `/about` (user to film + upload).
- Add "What happens on the day of your walkthrough" section.
- Field Notes content section — 4–6 short articles on common OSHA violations.

## Known Maintenance Risk
- `frontend/scripts/generate-seo-pages.js` is a parallel maintenance burden: any pricing, copy, or routing change must be mirrored there. Worth a one-time consolidation to a shared content source in a future refactor.

## Credentials
- Admin Dashboard password: `gigline2026`

## Key API Endpoints
- `POST /api/admin/revenue/manual`
- `GET  /api/admin/revenue/list`
- `GET  /api/admin/export/revenue.csv`
- `GET  /api/admin/export/intake.csv`
- `DELETE /api/admin/lead/intake/{clientToken}`
