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
- **Stripe pass 2 — Supervisor Kit (GL-WEB-015, June 26 2026)**: Replaced stub kit checkout with real Stripe Checkout. Digital ($600, no shipping); Physical ($675, US shipping + phone capture). Built `/supervisor-kit/thank-you` page that polls `GET /api/supervisor-kit/verify` → sends Resend confirmation email to buyer + Vince notification + tags buyer in MailerLite (`supervisor-kit-digital` / `supervisor-kit-physical`). Idempotent. `stripe_native.create_checkout()` extended with `customer_email`, `collect_shipping`, `product_name` kwargs. **NOTE: STRIPE_API_KEY in .env is a LIVE key — real cards are charged.**
- **Google Review link in Safety Check PDF (GL-WEB-PDF-001, June 26 2026)**: Added a small "Found this helpful? Leave a Google review →" prompt above the footer in `pdf_generator.py`. URL is a config constant `GIGLINE_GOOGLE_REVIEW_URL` (env override `GIGLINE_GOOGLE_REVIEW_URL`), defaults to a Google search for GigLine in Kernersville, NC. Swap to `g.page/r/...` short link via env when Vince has one.
- **MailerLite Retention 4-touch sequence (GL-WEB-RET-001, June 26 2026)**: Wired automatic enrollment in MailerLite group `Retention - 4 Touch` when booking status flips to `report_delivered` (via `move_to_past_client()`). Vince builds the four delay→email steps in MailerLite UI; copy + cadence written to `/app/memory/mailerlite-retention-4touch.md` (Day 30 / 60 / 90 / 180).
- **"What happens on the day of your walkthrough" section (June 26 2026)**: New DRY component `WalkthroughDaySection.js` with `variant` prop (`crv` shows all 6 steps with gold "CRV ONLY" badge on step 4; `walkthrough` hides step 4). Used on `/` (light surface, above testimonials) and `/services` (panel surface, under CRV detail block).
- **Case Study Addendum (GL-WEB-016, June 26 2026)**: Inserted new "After the Report" section between "What the Engagement Delivered" and "What This Engagement Is Not" on `CaseStudyMetalsFabricationPage.js`. 12 of 13 findings closed in 7 days; remaining shear-blade finding has documented remediation plan. Quote rendered without named attribution.
- **Supervisor Safety Starter System landing page (GL-WEB-015, June 26 2026)**: `/supervisor-kit` page with hero, 11-document grid, value framing, dual pricing cards ($600 digital / $675 physical with featured navy+gold treatment), "Who This Is For" 3-card row, "Included with CRV" band, phone/email footer CTA. SEO with Product + Offer JSON-LD schema.
- **Intake Page (GL-WEB-009 changes 6–9, Feb 26 2026)**: Added "What happens next" 4-step block above the form. Added "About Vince" mirror block at bottom.
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
- Supervisor Training Kit content (GL-WEB-013): Vince to upload the 11 PDFs so digital delivery can become automated. Currently digital confirmation email tells the buyer "Vince will email your kit PDFs within 1 business day."
- MailerLite UI build: assemble the 4 delay→email steps for the `Retention - 4 Touch` automation (copy lives in `/app/memory/mailerlite-retention-4touch.md`).
- Optional: set `GIGLINE_GOOGLE_REVIEW_URL` env var to a `g.page/r/...` short link once Vince claims one.

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
