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
- **GL-WEB-019 — 4 Site Enhancements + New Gated `/osha-inspection-guide` Page (June 29 2026)**: Five items shipped in one batch.
  - **(1) "Minimal disruption to production."** Bolded sentence appended to Step 03 of How It Works on the homepage. Skim-reader signal that walkthroughs don't shut down the line.
  - **(2) Pricing anchor** on Services page Safety Walkthrough Report card: italic muted line "Most operations fall between $1,200 and $2,000." rendered below body, above CTA. Sets buyer expectation.
  - **(3) HR-facing callout** on HomePage About-Vince section. Gold-bordered cream-bg block addressing HR managers and safety coordinators directly — "first to hear from OSHA, first to be asked for documentation."
  - **(4) Footer Resources** column gets new entry "OSHA Inspection Guide — HR & Safety Leaders" linking to `/osha-inspection-guide`.
  - **(5) New gated page `/osha-inspection-guide`** with email-capture form (email required, first_name + company optional), new backend `POST /api/osha-inspection-guide/submit` route, new `add_to_hr_osha_guide()` MailerLite integration function with group `hr-osha-guide-download`. PDF delivery happens via MailerLite automation attached to that group — backend does NOT serve the PDF directly per spec. Vince also gets a Resend notification per submission. Thank-you state shows "Check your inbox. Your guide is on the way." plus Safety Check CTA. Below the gate, "What's Inside" section renders 4 cards (Before / During / After / Most Common HR-Facing Citations) ungated. Full SEO entry in `generate-seo-pages.js`, sitemap entry added.
  - **Testing:** `testing_agent_v3_fork` iteration_24.json — backend pytest 13/13 PASS, frontend Playwright 100% (5 items + form submission + Safety Check CTA + admin login + 6 regression pages). Zero bugs found.
- **GL-WEB-019 — Pricing-Consistency Sweep + Onboarding Portal Retirement (June 28 2026)**: Acted on a search-snippet anomaly (Google still showing "Starting at $650" for /safety-walkthrough even though the live page reads "From $1,200"). Sweep verified the live `/safety-walkthrough` page is fully clean — the $650 references in source are legitimate Document Development pricing (LOTO + up to 5 machines from $650). However, the sweep surfaced two real issues:
  - **Vince's intake-notification email** was carrying a stale `PRICING REFERENCE` block (`Walkthrough: $650 base → $800+`). Updated to current public pricing across all services: Walkthrough From $1,200, CRV From $2,000, Incident Review From $1,500, Doc Dev tiered, Supervisor Kit $600/$675.
  - **Discovered an orphaned `/onboarding` portal** still live with legacy walkthrough pricing of $650/$750/$900 by tier. Not linked from any nav, but reachable by direct URL or stale bookmarks. Retired the portal end-to-end per user direction: deleted `/app/backend/routes/onboarding.py`, `/app/backend/pdf_generator_agreement.py`, `/app/backend/tests/test_portal_api.py`, `/app/backend/tests/test_portal_section_b.py`, `/app/frontend/src/pages/OnboardingPage.js`. Stripped the `/onboarding/sign-agreement` and `/agreement/{token}/download` endpoints from `routes/portal.py`. Unregistered the onboarding router in `server.py`. Replaced the React `/onboarding` and `/onboarding/confirmed` routes with `<Navigate to="/intake" replace />` so any stale links (bookmarks, QR codes, indexed URLs) cleanly redirect to the current intake flow. Verified live: `/onboarding` → 302 → `/intake`, legacy backend endpoints return 404.
  - **Action for Vince:** Submit `/safety-walkthrough` for reindexing in Google Search Console so the "$650" snippet refreshes to current "From $1,200" pricing. The page itself was already clean — only Google's cached preview was stale.
- **GL-WEB-018 Admin Tile — Quick-Contact metrics (June 28 2026)**: Added a dedicated panel to the `/admin` Portal tab showing Quick-Contact volume + conversion rate (lead → full intake/walkthrough). Backend `/api/admin/stats` now returns a `quick_contacts` block with `total`, `last_7d`, `last_30d`, `converted`, `conversion_rate`. Conversion matches contact email/phone against `gl_intake_submissions` and `walkthrough_requests`. Verified live (6 test leads, 0 converted, 0% rate as expected for fresh smoke data).
- **GL-WEB-018 — Assessment Fact-Check Action Items (June 28 2026)**: Acted on the legitimate gaps surfaced by a 3rd-party site quality assessment (after first verifying which "issues" were actually broken — half of the assessor's "fix immediately" list was already shipped). Four items completed:
  - **(A) Outcome language on service cards.** Each of the 4 home-page service cards now carries an italic "You leave with:" line in a serif font, gold/blue left-bordered, between the description and CTA. Converts input-heavy copy into output-focused conversion language without rewriting the underlying body text.
  - **(B) Cost-of-Inaction stat → scenario.** The "Cost of Waiting" section now ends with a navy/gold scenario block anchored to the real Statesville case study (9-person metals fab, 13 findings, $7,000–$15,621 per-finding citation range). Links directly to /case-study/metals-fabrication-statesville. Numbers are fact-grounded, not invented.
  - **(C) 2-field micro-form ("Just want to talk first?").** New reusable component `<QuickContactCard>` with light/dark variants. Two required fields (name, contact — email OR phone, prospect's choice) + one optional message. Routes to new backend `POST /api/quick-contact/submit` that stores to `db.quick_contact_leads` and emails Vince via Resend. Placed at the TOP of the intake page above the long 7-section form with "— OR — FILL OUT THE FULL INTAKE BELOW FOR A FIXED QUOTE" divider. Captures cold prospects who would otherwise bounce on the long form.
  - **(D) Field Notes ↔ Service page contextual linking.** Built `SERVICE_LINKS_BY_SLUG` map covering all 25 field notes. Each detail page now renders a "Where this gets handled / Want this audited on your floor?" block with 1–2 service cross-link cards (slug → safety-walkthrough / document-development / compliance-readiness-visit / incident-review) above the existing Related Field Notes block. Internal linking density increased from 1 → 2–3 outbound service links per article — material SEO and conversion signal.
  - Testing: `testing_agent_v3_fork` iteration_23.json — backend pytest 16/16 PASS (5 new quick-contact tests + 10 page regressions + 1 health), frontend Playwright 100% on all 4 items with regression clean.
- **GL-WEB-017 — Four-Item Execution Queue (June 28 2026)**: Completed in one batch.
  - **(1) UTM tracking on all Google review CTAs.** All 6 surfaces (backend `.env`, Footer.js, ReportPage.js, WalkthroughLandingPage.js, StatusPage.js, SupervisorKitThankYouPage.js) now use the canonical base URL `https://maps.app.goo.gl/4D3TVUAeyfzbm7WbA` with surface-specific `utm_source` values and shared `utm_campaign=review-request`. Enables review-source attribution in GBP analytics.
  - **(2) Sample Report PDF page (`/sample-report`).** New email-gated page with First Name (req) + Email (req) + Company (optional). New backend route `POST /api/sample-report/submit` mirrors the Heat Guide pattern — Resend delivers the placeholder PDF as an attachment, MailerLite enrollment via `add_to_lead_nurture(source_form='sample_report')`, lead saved to `gl_sample_report_leads`. Placeholder PDF at `/app/backend/sample_report_files/GL_Sample_Compliance_Report.pdf` — swap the file to update the deliverable, no code changes required. Sample Report CTAs added to HomePage, ServicesPage, and CaseStudyMetalsFabricationPage.
  - **(3) Field Notes search + filter bar.** Added keyword search input and CFR subpart dropdown above the article grid on `/field-notes`. Filtering is client-side (no reload, no backend), combines keyword + CFR with AND logic, has empty-state messaging + clear-filters link. CFR options derived from a `CFR_BY_SLUG` map in FieldNotesPage.js — single source of truth.
  - **(4) Resources hub page (`/resources`).** Single index of 5 downloadable assets — Safety Check, Heat Stress Field Guide, HazCom Compliance Guide, Sample Compliance Report, Field Inspection Checklist. New backend route `GET /api/field-checklist` serves the ungated PDF directly. JSON-LD WebPage schema, breadcrumbs, and pre-rendered SEO content via `generate-seo-pages.js`. Footer Resources column updated with "All Resources" entry as the top item.
  - Testing: `testing_agent_v3_fork` iteration_22.json — backend 7/7 pytest pass, frontend 100% pass on every data-testid, regression clean on 7 existing pages.
- **SEO Strategy "Abe" — 3-part execution (June 28 2026)**: Executed user-requested A + B + E SEO strategies. (A) Field Notes expanded from 16 → **25 articles**. Added 9 new long-form pieces (respiratory-protection, silica-respirable-crystalline, hot-work-welding, abrasive-wheels, ladder-safety, eye-face-protection, trenching-excavation, cranes-rigging, nc-osha-vs-federal). Each new article carries the full heat-stress-template treatment: title/subtitle, SEO meta, CFR citation banner, oshaChecks (5–6 items), 3-question FAQ schema, relatedNotes wired for internal linking, 4–7 paragraph whatItIs deep-dive, whatGetsMissed bullets, whatISee narrative, and 8–11 item checklist. All 9 mirrored into `generate-seo-pages.js`, `sitemap.xml`, and `llms.txt`. (B) Verified all 5 priority city landing pages already had full content from prior session — Greensboro, Winston-Salem, High Point, Burlington, Kernersville. No code changes needed for B. (E) Drafted 8-target backlink outreach playbook at `/app/memory/backlink-playbook.md` — ready-to-send templates for NCMEP, Greensboro/Winston-Salem/High Point Chambers, NCDOL BETS (speaker pitch), Carolinas AGC, Triad Business Journal (guest column), and NCMA. Includes cadence/follow-up notes. Frontend testing agent confirmed 100% pass — 25 field notes load correctly, 5 city pages render, no broken internal links. iteration_21.json.
- **Leave-Behind v11 — Premium Visual Redesign (GL-WEB-LB-011, June 27 2026)**: Full visual rebuild of the door-knock flyer. Same v9 copy preserved (every word). Visual system: Inter typeface family (Regular/SemiBold/Black/Italic) embedded; brand tokens (Navy #0B1F3A, Gold #C9A84C, Cream #F5F0E8, Dark Text #1A1A2E); real GigLine logo at top-left; gold rule separator; gold-square bullets; **Cost-of-Inaction stat row** ($16,550 / $165,514 / $2,000) above services with caption; CRV row highlighted with 2pt gold left-border + cream background + gold star; Services + Pricing two-column layout; cream-panel "Three Ways to Start" with 1pt gold left-border and "SCAN TO REQUEST A VISIT" gold label below QR; footer credentials with gold rule separator; explicit privacy commitment ("written permission"); version label baked into disclaimer. Single page, 296 KB. Inter fonts embedded from `/app/backend/assets/fonts/`. Public URLs: `{API}/api/leave-behind/v11` (versioned) and `{API}/api/leave-behind` (always latest). v9 archive route preserved at `/api/leave-behind/v9`. Generator: `backend/scripts/generate_leave_behind_v11.py`.
- **Supervisor Kit page mirrored to Manus reference (June 27 2026)**: Added hero stats bar (4 tiles — 11 Documents / 40+ Inspection Items / 6 CFR Standards / $16,550 Max Penalty). Restructured "What's Inside" — 11 docs now render as SS-XX numbered cards with bold title + 1-line description (previously single-line list). New "Nothing generic. Nothing filler." headline + cream "Estimated compliance value" callout. Value-framing converted to gold-bordered pulled quote attributed to Vince. Pricing cards: em-dash bullets (replaced Check icons), gold "RECOMMENDED" badge on physical card.
- **Homepage Supervisor Kit band (June 27 2026)**: Added navy band between WalkthroughDay rail and Testimonials. Gold "SUPERVISOR SAFETY STARTER SYSTEM" eyebrow, "Need the documentation layer?" headline, body copy with inline gold pricing ($600 digital · $675 physical), gold "See the Kit →" CTA → `/supervisor-kit`.
- **Leave-behind v9 PDF (GL-WEB-LB-009, June 27 2026)**: Single-page letter PDF at `/app/backend/internal_docs/GigLine_LeaveBehind_v9.pdf`. Public download at `GET /api/leave-behind/v9`. QR → `/walkthrough?utm_source=doorknock&utm_medium=doorknock&utm_campaign=leave-behind-v9`. Current pricing: Walkthrough $1,200 / CRV $2,000 / Kit $600·$675 / Incident Review $1,500. Generator script at `backend/scripts/generate_leave_behind_v9.py` — re-run anytime prices change.
- **Google Review prompt on Kit thank-you page (June 27 2026)**: Cream callout panel after order confirmation, gold "Leave a review →" link to `share.google/Uw7Uc7YHr7EiiTuAM`. Fires at the highest-intent moment.
- **Supervisor Kit visibility (June 27 2026)**: Wired 5 entry points to `/supervisor-kit`. **Services page**: new product card as a 5th STANDALONE entry — gold "INCLUDED FREE WITH CRV" badge, "Can't schedule a walkthrough yet? Start here." headline, 8-bullet what's-inside, "See the Full Kit" CTA → `/supervisor-kit`. **Footer**: new top entry in the Resources column. **Field Notes cross-sells**: now data-driven per article; wired on `recordkeeping-300-log` (SS-09 / SS-10 / SS-07), `hazcom` (SS-04 / SS-02 / SS-03 — actual HazCom program documents), `lockout-tagout` (SS-10 / SS-09 / SS-07). Each article owns its own card set + headline + intro. Per Vince: **NO top nav entry** (kit is secondary product, doesn't compete with Schedule a Visit primary CTA).
- **Google Review short link wired (June 27 2026)**: Set `GIGLINE_GOOGLE_REVIEW_URL=https://share.google/Uw7Uc7YHr7EiiTuAM` in backend `.env`. Safety Check PDF "Leave a Google review →" prompt now uses Vince's actual short link (already in use in the homepage footer).
- **"David R." testimonial confirmed real — DO NOT MODIFY (June 27 2026)**. Previous fork's handoff mis-tagged it as a placeholder.
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
- ~~Replace "David R." testimonial placeholder with real Google Review text~~ — **Confirmed real client testimonial, leave as-is. Do not modify. (Vince, June 27 2026)**
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
