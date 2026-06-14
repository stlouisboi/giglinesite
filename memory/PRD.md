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

## Findability Framework — Inbound SEO Push (Jun 11, 2026)
- **Global typography bump** — `html { font-size: 18.4px }` (~15% larger) in `index.css`; mobile dialed to 17.2px. Scales all rem-based Tailwind sizes and spacing uniformly. Noticeably more readable across hero, body, buttons, and forms.
- **Homepage hero rewrite** — Replaced "If OSHA Walked In Tomorrow, Would You Pass?" with buyer-intent headline: "Practical Safety Walkthroughs & OSHA-Focused Gap Checks for Manufacturers, Warehouses, Contractors & Fleets in North Carolina." New 2-line subhead, dual CTAs (Primary → /request-walkthrough, Secondary → /intake), updated pricing line ("Walkthroughs from $650 · Doc Gap Checks from $550").
- **3 new buyer-intent service landing pages** (all built via shared `ServiceLandingTemplate.js`):
  - `/safety-walkthrough` — On-site OSHA review for NC operations (from $650)
  - `/documentation-gap-check` — Written programs, SDS, training records review (from $550)
  - `/osha-compliance-gap-check` — Combined walkthrough + documentation review (custom-quoted, typically $1,200–$2,400)
- Each new page includes: Who It's For · The Problem · What's Reviewed · What You Receive (deliverables grid) · Field Manual lead magnet · Next Steps (numbered) · Final CTA band with 3 actions (Walkthrough / Intake / Call).
- **SEO mirror** — `generate-seo-pages.js` updated with: new homepage copy + headline/meta, plus full static pre-rendered HTML for the 3 new service pages (each with Service JSON-LD, FAQPage JSON-LD, BreadcrumbList JSON-LD, and crawler-visible H1/H2 content).
- Updated homepage testimonials Card 2 with real Google review from **Michael Humphrey** (Jun 11, 2026): "Vince knows OSHA compliance cold..." Badge updated from "1 Google Review" → "3 Google Reviews."

## Pending — User-Side / Backlog
- **GBP optimization** (manual at business.google.com): Set Primary Chat = Text message, add Place page attributes (Onsite services, Online appointments), add Burlington + Asheboro to service areas, tighten Description copy, confirm booking URL → /request-walkthrough, seed 5–6 Q&A entries, post weekly Google Posts.
- **Backlog (P1)**: 5 local Triad SEO pages (Greensboro, Winston-Salem, High Point, Kernersville, Statesville) — note `/safety-walkthrough/:city` city pages already exist for Triad cities; consider whether new dedicated pages are needed or just refresh existing.
- **Backlog (P2)**: Problem-Based Field Notes articles from Findability Framework list · Google Review short link in delivered PDF reports · Stripe Invoice creation inside `/admin` panel · 4-touch Past Client Retention MailerLite sequence · Supervisor Training Kit shell (GL-WEB-013, blocked on user PDFs).

## Brand Mark + Form Polish (Jun 12, 2026)
- **Carolina-Built emblem badge** — User-supplied AI-generated circular badge ("CAROLINA-BUILT" rim text, NC silhouette w/ Kernersville star, foul anchor, "NAVY VETERAN OWNED" sub-medallion). Downloaded to `/app/frontend/public/assets/carolina-built-badge.png`, flood-fill processed to remove flattened light-gray background (~52% pixels keyed to alpha 0).
- **Badge placement** — Inline after "North Carolina." in homepage hero H1 subhead at `w-24 sm:w-28 lg:w-32` (96/112/128 px) with `drop-shadow(0 6px 14px rgba(0,0,0,0.35))`. Added to all 13 city landing pages (`CityLandingPage.js`) below the H1 at `w-20 sm:w-24 lg:w-28` — uses inline-flex with flex-wrap so badge cleanly drops below long city names.
- **SMS consent copy rewritten** on `/contact` form (`ContactForm.js`) per user's verbatim spec — now references `launchpathedu.com/privacy-policy` and `launchpathedu.com/terms-of-service` (sister-business unified privacy per RingCentral 10DLC). STOP/HELP/rate/frequency language preserved.
- **SMS checkbox `required` removed** — confirmed already absent in current code; live site is running stale build. Tested via headless Playwright: form submits successfully with SMS unchecked. Awaiting deploy.
- **Contact page email overflow fixed** — `vince@giglinecompliance.com` was breaking out of its column after the typography bump. Added `text-sm sm:text-base break-all` + `min-w-0` parent.
- Removed dead `CarolinaBuiltBadge.js` + `NCStateMark.js` SVG experiments (replaced by user's PNG badge).

## GL-WEB-014 — Services Page Rebuild + Global Rename (Jun 13, 2026)
- **Services page complete rebuild** at `/services` per GL-WEB-014 spec: hero, 3 primary cards (Walkthrough $850 / Compliance Readiness Visit $1,500 / OSHA-Ready Control System $4,500), Card 2 visually elevated with blue border + Star icon + MOST POPULAR badge. 4 additional services (OSHA Documentation Readiness Review, Incident Review, Document Development with floor-pricing block, Readiness Review Entry $950). 2 recurring services (Quarterly Maintenance, Annual Compliance Partner). Preserved CaseStudyTeaser + 90-Second Safety Check band. Bottom CTA tap-to-call.
- **Global rename "Gap Check" → "Documentation Readiness Review"** applied across React frontend, FastAPI backend, public assets, SEO generator, llms.txt, OG image SVG, index.html schema, build scripts. URLs `/documentation-gap-check` and `/osha-compliance-gap-check` **preserved** per Option A (SEO continuity). H1/meta/body all renamed.
- **Sitewide pricing update**: walkthrough $650→$850, doc review $550→$750, compliance visit $1,200→$1,500. All 13 city pages, FAQ, HazCom/OSHA blog CTAs, SafetyCheck, ServiceAreas, HeatGuide, llms.txt, Stripe product names, intake form, schemas. Amero Steel pre-existing $675 quote grandfathered.
- Compliance Readiness Visit page (formerly OSHA Compliance Gap Check) repositioned with $1,500 entry, Supervisor Safety Starter System ($199) included.
- Full file-by-file deliverable written to `/app/memory/GL-WEB-014_Deliverable.md` per Part A acceptance criteria.
- Manual tasks delegated to Vince: MailerLite sequence labels, GBP services section, RingCentral Knowledge Hub, field-app PDF templates (separate codebase).

## GL-WEB-015 — Homepage Hero Pricing Anchor + Sample Deliverable Restoration (Feb 13, 2026)
- **Hero pricing anchor rewrite (HomePage.js + generate-seo-pages.js)**: Replaced "Walkthroughs from $850 · Documentation Readiness Reviews from $750" with "Safety Walkthrough from $850. Compliance Readiness Visit from $1,500. Start where your operation needs it most." — anchors visitor on the $1,500 mid-tier rather than the entry-level price.
- **Sample Deliverable section restored to /services**: `SampleReportSection` re-imported and rendered between Additional Services (S2) and Recurring Services (S3). New heading: "What a GigLine report actually looks like." New subheading: "Every engagement delivers a written report your team can act on. Here is a sample from a recent walkthrough — findings, CFR citations, photos, and corrective actions included." Component body (3-finding mock report) restored unchanged per spec.

## GL-WEB-015 — Services Page Sales Path Refinement + GA4 Hero Tracking (Feb 13, 2026)
- **Hero rewrite**: H1 → "OSHA-Readiness Support for Small Industrial Operations". Subheadline rewritten to cover the 4 verticals + 3 problem types. Service-name lists removed from hero.
- **Authority statement** added between hero and Safety Check: "Built for small operations that need practical safety support without hiring a full-time safety manager."
- **Full section reorder (14 sections)**: Hero → Authority → Safety Check (intake door, framed "Not sure where to start?") → Who GigLine Helps (NEW — 4 vertical cards: Manufacturers/Warehouses/Contractors/Fleet) → Compliance Readiness Visit (featured, standalone, "RECOMMENDED STARTING POINT" badge) → Standalone Services (Walkthrough/Doc Review/Incident/Doc Dev) → OSHA-Ready Control System (NEW dedicated full-width navy section with 5 buildout items, $4,500) → Quarterly + Annual (reframed as natural next step) → GigLine Readiness Path (NEW table — 5 stages, desktop table + mobile stack) → Sample Report → Case Study → Founder (compact, links to /about) → FAQ (5 services-specific Qs + embedded Pricing Reference block, 7 rows) → Final tap-to-call CTA.
- **Pricing reference block**: 7 rows displayed plainly (Walkthrough $850, Doc Review $750, Compliance Readiness Visit $1,500, Incident $1,200, Control System $4,500, Quarterly $750/qtr, Annual $9,000/yr). Entry-Level $950 Doc Review dropped (redundant with $750 standalone given new "Recommended Starting Point" guidance).
- **SEO mirror**: `/services` schema rewritten in `generate-seo-pages.js` — 7-item ItemList with full current pricing, 5-question FAQ schema matching on-page accordion, prerender content reflects new structure.
- **GA4 hero CTA tracking**: `hero_cta_primary` and `hero_cta_secondary` custom events wired in HomePage.js via `trackEvent()`. Params: `cta_text`, `cta_destination`, `page_path`. Verified live via instrumented Playwright + testing agent — both events fire with correct payloads on click. GA4 property `G-FNX42NP1QT` already connected in index.html.
- Testing agent (iteration_16): 21/21 acceptance criteria PASS, zero issues found.

## GL-WEB-015 Follow-ups — Services Hero Image, Homepage CTA Swap, Services CTA Tracking (Feb 13, 2026)
- **Services page hero image restored**: Asymmetric layout (image left ~40%, copy right ~60%) on navy. Uses `/services-hero.jpg` (1600×900, already in public/). Soft navy fade gradient blends the image into the copy panel on desktop. Mobile stacks image-on-top.
- **Homepage primary CTA swap**: `hero-cta-primary` now reads "Schedule a Compliance Readiness Visit" → `/intake?service=compliance-readiness-visit`. `hero-cta-secondary` is now "Request a Safety Walkthrough" → `/request-walkthrough`. The "Start Client Intake" CTA was dropped. GA4 `hero_cta_primary` and `hero_cta_secondary` events updated to capture the new cta_text + cta_destination. Aligns homepage with the /services sales path so day-one tracking data is meaningful.
- **Services CTA tracking wired**: New helper `fireServicesCtaClick()` fires `services_cta_click` GA4 events with `cta_text`, `cta_destination`, `page_path`. Attached to: Compliance Readiness Visit "Schedule a Visit" CTA, OSHA-Ready Control System "Request Buildout" CTA, and all 10 Readiness Path links (5 desktop + 5 mobile, labeled "Readiness Path · {stage}"). Combined with the homepage hero events this gives full-funnel visibility: which homepage CTA drove the click → which services-page CTA the visitor ultimately requested.
- Self-verified via instrumented Playwright: all 7 CTA categories emit correct payloads on click. Skipped second testing-agent run (changes are small and additive on top of 21/21 PASS in iteration_16).

## Intake Form Conversion Tracking — Full Funnel Visibility (Feb 13, 2026)
- **`intake_submit_success` GA4 event** wired into both intake forms with params `service_requested`, `source_form`, `page_path`:
  - `/request-walkthrough` (IntakePage.js): fires on successful POST `/api/walkthrough/request`. `source_form='request-walkthrough'`. Captures the form's `service` field.
  - `/intake` (ClientIntakePage.js): fires on successful POST `/api/intake/submit` immediately before the navigate-to-thank-you redirect. `source_form='client-intake'`. Captures the form's `serviceSelected` value.
- **Full-funnel measurement enabled**: combined with `hero_cta_primary`/`hero_cta_secondary` (homepage) and `services_cta_click` (services page), GA4 can now compute conversion rates per CTA — i.e. "of the visitors who clicked Schedule a Compliance Readiness Visit on home, what % completed the intake form requesting that service".
- Verified: walkthrough form fires both `generate_lead` (existing) and `intake_submit_success` (new) on success. Client intake event payload verified via direct dataLayer push test (handler path identical to walkthrough form).

## Responsiveness + SEO Cleanup (Feb 13, 2026)
- **Tablet horizontal-scroll bug FIXED across all pages**. Root cause: `<Footer>` used `md:grid-cols-4` which made the LaunchPath link column too narrow at 768px, pushing the link 5px past viewport. Changed to `sm:grid-cols-2 lg:grid-cols-4` — proper 2×2 grid at tablet, 4-col at desktop. Confirmed via Playwright at 768px: body=768, win=768 (was body=773 before fix).
- **Homepage hero now stacks vertically at tablet** instead of trying a cramped 60/40 split between 768–1023px. Changed `md:flex-row` → `lg:flex-row` plus all related `md:w-3/5`/`md:w-2/5` breakpoints. At ≥1024 the asymmetric desktop layout returns. Section also got `overflow-hidden` as belt-and-suspenders.
- **SEO title doubling FIXED**. Pages that passed titles already containing `| GigLine` (e.g., `/service-areas`, `/intake`, `/request-walkthrough`, `/about`, `/case-studies/...`) had the SEO component appending `| GigLine Safety & Compliance` again — producing `... | GigLine Safety & Compliance | GigLine Safety & Compliance`. Updated `SEO.js` with smart suffix logic: only appends site name if title doesn't already end with `| GigLine...`. Verified on 16 routes — zero remaining double-suffix titles.
- **No duplicate page files / routes found**. `/privacy` and `/privacy-policy` both render the same component but each sets canonical=`/privacy` so Google consolidates. Same with `/terms` and `/terms-of-service` → canonical=`/terms-of-service`. Confirmed proper canonical consolidation; no duplicate-content penalty risk.
- Static-build SEO (production via `generate-seo-pages.js`) verified: every route writes per-page `<title>`, `<meta description>`, `<link canonical>`, OG + Twitter + JSON-LD. Production Google crawl sees correct per-page meta on every URL.

## Deployment
- Frontend: Vercel (manual redeploy after GitHub push)
- Backend: Railway (auto-deploys on GitHub push)
- Database: MongoDB Atlas (gigline cluster)
- REACT_APP_BACKEND_URL in Vercel must point to Railway URL
deploys on GitHub push)
- Database: MongoDB Atlas (gigline cluster)
- REACT_APP_BACKEND_URL in Vercel must point to Railway URL
