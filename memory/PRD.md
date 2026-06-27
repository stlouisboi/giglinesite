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
- **Supervisor Kit PDF auto-delivery (GL-WEB-013, June 27 2026)**: All 11 SS-prefixed PDFs uploaded to `/app/backend/kit_files/`. `_send_kit_buyer_email()` in `routes/supervisor_kit.py` now base64-encodes and attaches all 11 PDFs to the digital-variant Resend confirmation email (~1.17 MB payload, under the 40 MB Resend limit). Email copy updated: "All 11 documents are attached" instead of the manual-delivery placeholder. Thank-you page copy refreshed to match. Physical variant unchanged (USPS shipping).
- **Field Notes content expansion (5 articles)**: Expanded `machine-guarding`, `walking-surfaces`, `emergency-action-plans`, `ppe-assessment`, and `fall-protection` from stubs to full heat-stress-template articles (CFR citation banners, 3-item FAQ schema, 6-item oshaChecks, 5-paragraph whatItIs deep-dives, 7-item whatGetsMissed, expanded checklists, relatedNotes wired). Total content added: ~5,000 words of SEO-aligned long-form.
- **Cross-sell card on `recordkeeping-300-log` (June 26 2026)**: Added `kitCrossSell` flag in `NOTES` model + 3-card "Related Documents" section in `FieldNoteDetailPage.js`. Cards link SS-09 (Monthly Safety Inspection Checklist), SS-10 (Employee Training Record Log), and SS-07 (If OSHA Shows Up) to the `/supervisor-kit` page. CTA: "See the Full Kit ($600 digital)".
- **Field Notes content cluster (GL-WEB-FN-001, June 26 2026)**: Expanded `lockout-tagout`. Created new `recordkeeping-300-log`. Added slug alias `confined-space-entry-permits` → `confined-space`.
- **Stripe pass 2 — Supervisor Kit (GL-WEB-015, June 26 2026)**: Real Stripe Checkout. Digital ($600); Physical ($675, US shipping). `/supervisor-kit/thank-you` page wired with idempotent verification, Resend email, MailerLite tagging. **NOTE: STRIPE_API_KEY in .env is a LIVE key.**
- **Google Review link in Safety Check PDF (GL-WEB-PDF-001, June 26 2026)**: Prompt above footer with env-overridable `GIGLINE_GOOGLE_REVIEW_URL`.
- **MailerLite Retention 4-touch (GL-WEB-RET-001, June 26 2026)**: Auto-enrollment in `Retention - 4 Touch` group via `move_to_past_client()`. UI copy at `/app/memory/mailerlite-retention-4touch.md`.
- **"What happens on the day" component (June 26 2026)**: `WalkthroughDaySection.js` on `/` and `/services`.
- **Case Study Addendum (GL-WEB-016, June 26 2026)**: "After the Report" section added.
- **Supervisor Kit landing page (GL-WEB-015, June 26 2026)**: `/supervisor-kit` page with dual pricing cards.
- **Intake Page (GL-WEB-009 changes 6–9, Feb 26 2026)**: "What happens next" 4-step + "About Vince" mirror block.
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
