# GigLine Safety & Compliance — PRD

## Original Problem Statement
B2B lead-generation funnel for an OSHA compliance consultancy (GigLine, Vince Lawrence). React + FastAPI + MongoDB. Strict factual accuracy on case studies, pixel-matched prototypes, industry-specific SEO copy, real-world photography, source-attribution tracking. SEO schemas in JSON-LD must stay synced between React components and the static pre-render script (`generate-seo-pages.js`).

## Personas
- HR Manager / Safety Coordinator (NC Piedmont Triad mfg + warehouse)
- Owner-operator of small manufacturing shop (gets cited, needs help fast)
- Supervisor on the floor (the person who actually does safety)

## Core Stack
React 18 (CRA), Tailwind, FastAPI, MongoDB (motor), Stripe LIVE, Resend LIVE, MailerLite LIVE. Static SSR HTML pre-render via `frontend/scripts/generate-seo-pages.js`.

## Implemented (current state — Feb 2026)
- Mature funnel: home, services, intake, walkthrough, Safety Check (tiered results), Field Notes (25), Case Study, About, Contact.
- Supervisor Safety Starter System paid checkout (LIVE Stripe + Resend auto-PDF delivery + thank-you page polling).
- Gated lead magnets w/ auto-open PDF + email delivery: Heat Guide, Sample Report (real redacted 18-page PDF), OSHA Inspection Guide (HR-targeted).
- `/resources` hub w/ 8 tiles (OSHA Compliance Guide [pillar], Safety Check, Heat Guide, HazCom, Sample Report, OSHA Inspection Guide, Supervisor Safety Starter System, Field Checklist).
- Admin Dashboard `/api/admin/stats` tiles: safety checks, risk breakdown, walkthroughs, downloads, heat guide leads, quick contacts, sample reports, **hr_osha_guide** [Feb 2026].
- Quick-Contact micro-form on intake with attribution tracking.
- Theme-aware favicons, auto-OG image generation, JSON-LD schema sync in `generate-seo-pages.js`.
- Footer + global Google Review link w/ UTM params.
- Legacy `$650` `/onboarding` retired — all walkthrough copy cites "From $1,200".
- Factual-accuracy sweep done (no Amero Steel / BF Goodrich employment claims).
- Backlink playbook in `/app/memory/backlink-playbook.md`.

## Roadmap (prioritized)
### P0 — none open
### P1 — none open
### P2
- Wire real hero photos to remaining 16 Field Notes (low priority per user, waiting on uploads).
- Refactor repeated stats querying in `admin.py` into `get_stats_for_collection(db_collection)` helper.
- Quick-Contact 30-day trendline tile on Admin Dashboard (mini chart per lead magnet).
- "Featured In" logo strip on `/about` when first guest article publishes.
- 4-touch MailerLite retention sequence (Vince user-side build in MailerLite UI).
- MailerLite automation for `hr-osha-guide-download` group (Vince user-side).
- (Optional) `hreflang="en-us"` + enriched local-business schema (`priceRange`/`servicearea`) for stronger NC-local visibility on "OSHA consultant near me" queries.

## Architecture Notes
- All backend routes under `/api`.
- All env via `.env` (REACT_APP_BACKEND_URL, MONGO_URL, ADMIN_PASSWORD=`gigline2026`, Stripe/Resend/MailerLite keys).
- Mongo collections: `walkthrough_requests`, `gl_intake_submissions`, `quick_contacts`, `sample_report_leads`, `osha_inspection_guide_leads`, `heat_guide_leads`, `safety_checks`, plus downloads tracking.
- Admin auth: simple password via `ADMIN_PASSWORD` env (`gigline2026`). `/api/admin/stats?token=...`.
- LIVE Stripe in `.env` — never run real card tests.

## Critical Conventions
- `generate-seo-pages.js` must mirror every content/page change for SSR + SEO.
- All gated downloads: dual-delivery (Resend email + MailerLite group + auto-open PDF tab via `window.open(download_url)`).
- No legacy `$650` pricing anywhere — always "From $1,200" for walkthroughs.
- `data-testid` on every interactive element and critical UI element.

## Recent Changelog
- 2026-02 — **Wave 2 audit fix shipped** (canonical hygiene + 301 redirects):
  - **3-way duplicate consolidated**: `/services/safety-walkthrough` + `/services/safety-walkthrough-report` → 301 to `/safety-walkthrough`. Canonical on the page updated from `/services/safety-walkthrough` to `/safety-walkthrough` (matches sitemap). BreadcrumbList schema updated.
  - **Privacy duplicate fixed**: `/privacy` → 301 to `/privacy-policy`. `PrivacyPolicyPage` canonical updated to `/privacy-policy`. Two dangling `href="/privacy"` refs in `ClientIntakePage.js` updated.
  - **Terms duplicate fixed**: `/terms` → 301 to `/terms-of-service`.
  - **HTTP-level 301s on Vercel**: Added 8 `redirects` rules to `vercel.json` (legacy `/services/safety-walkthrough*`, `/privacy`, `/terms`, `/request-walkthrough`, `/onboarding`, `/onboarding/confirmed`, `/case-studies/mocksville-plastics-osha-inspection`). React `<Navigate>` remains as belt-and-suspenders fallback. Google now sees true 301s, transfers PageRank cleanly.
  - **Aliases kept** (verified unique content): `/walkthrough` (booking landing page), `/documentation-gap-check` (Documentation Readiness Review service), `/osha-compliance-gap-check` (Compliance Readiness Visit service). All have distinct keyword-intent content and canonical URLs.
  - Verified: 6 redirects ✓, 3 canonicals ✓.
- 2026-02 — **Wave 1 audit fix shipped** (image optimization + dedupe SEO meta tags):
  - **Image weight reduction: 24.1 MB → 2.5 MB (89%, ~21.5 MB saved sitewide)**. Optimized 13 oversized images: 9 PNG photos converted to JPG (max 1600px, quality 82) + 2 graphics PNGs palette-quantized + 2 JPGs re-encoded. Per-page weight dropped 57-64% on heavy pages (forklift Field Note 3.5MB → 1.3MB, About 2.9MB → 1.3MB, city pages 3.0MB → 1.2MB). Updated 5 file references across FieldNoteDetailPage, FieldNotesPage, HomePage, AboutPage, ClientIntakePage, SSR script.
  - **Removed duplicate SEO meta tags** — Stripped static per-page meta tags (`description`, `canonical`, `og:url`/`title`/`description`, `twitter:title`/`description`) from `public/index.html` so `react-helmet-async` is the single source of truth client-side. Updated `generate-seo-pages.js` to INJECT these tags into static HTML at build time (instead of `.replace()` against now-absent template tags). Verified: every page now serves exactly ONE canonical, description, og:url tag.
  - **Page audit results**: 22 routes tested at mobile (390×844) + tablet (768×1024) → **0 horizontal overflow**, single H1 per page, 100% alt-tag coverage, all routes 200 OK, NotFound page correctly noindex'd.
- 2026-02 — **Sitewide audit copy sweep shipped** (P0 from user audit punch list, mirrored to `generate-seo-pages.js`):
  - "The same eyes an inspector uses" → "An OSHA-informed floor review before an inspector shows up"
  - "what an inspector is likely to find" → "conditions an inspector may review"
  - "penalty exposure per finding" → "estimated penalty exposure based on OSHA published maximums" (sitewide replace_all across HomePage, ClientIntakePage, WalkthroughDaySection, ServicesPage, ServiceDetailPage, SampleReportPage, OshaInspectionGuidePage, CityLandingPage, generate-seo-pages.js)
  - All "$16,550 / $165,514 / $14,502" dollar refs prefixed with "Up to " (FieldNoteDetailPage, BlogHazComRequirements, BlogOSHAViolations penaltyData tables, SampleReportSection findings)
  - "$15,621" residual on `/services` Sample Report finding 3 normalized to "Up to $16,550 (Serious)"
  - "24–48 hours / 24-48 hours / 24 to 48 hours" → "within 48 hours" everywhere (FAQ, City pages, Services, ServiceDetail, SSR script)
  - Added educational disclaimer paragraph below Case Study findings (`data-testid="case-penalty-disclaimer"`) clarifying penalty figures are estimates based on OSHA published maximums per 29 CFR 1903.15
  - Case Study finding column header renamed "Penalty Exposure" → "Estimated Penalty Exposure"
- 2026-02 — **New favicon shipped** — Black/silver-"g"/gold-buckle brand mark replaces previous icon. Generated all required sizes (16/32/48/180/192/512 PNG + multi-res `favicon.ico`) and bumped cache-buster `?v=4` in `index.html` so browsers pick up immediately.
- 2026-02 — **Audit batch 2 shipped (d/e/f/g/h):** (d) `/about` got 3 new sections — Who I Help, Why the Name GigLine (Navy origin), Service Area with 12-city pill grid; (e) `/faq` got 7 new entries (legal risk, supervisor presence, post-incident timing, insurance loss control, monthly support, etc.); (f) `/safety-walkthrough` got "Best Fit / Not Best Fit" buyer self-qualification block; (g) 3 new service-specific landing pages created via reusable `<ServiceLandingPage>` component — `/forklift-compliance-review-nc`, `/loto-procedure-review-nc`, `/osha-documentation-review-nc` — each with Schema.org Service JSON-LD, sitemap.xml entries; (h) Case Study page gained a top inline CTA above the body.
- 2026-02 — **Audit response batch shipped**: (1) Brand hex aligned site-wide to canonical `#1C2B2B` / `#2A52A0` / `#C9A84C` (1,187 replacements across 45 files); (2) Case study penalty ranges normalized to 2026 OSHA max ($16,550); (3) Blog penalty/date notes updated (Top 5 OSHA + HazCom) — "January 2025" → "2026 max effective Jan 15, 2026"; (4) Homepage hero microcopy "Private engagement. Report in 48 hours" → "Private findings. Written report within 48 hours"; (5) Homepage case study teaser updated to use 2026 max + "four days" closure; (6) Safety Walkthrough page gained "What a GigLine walkthrough is — and what it isn't" Does/Doesn't scope block + legal disclaimer; (7) Sample Report page got an ungated "Open the PDF directly" escape hatch above the email gate (lead capture preserved as the secondary option); (8) Kevin Stutts pull-quote TODO removed (quote verified).
- 2026-02 — `/contact` micro-form swap: replaced heavy ContactForm with QuickContactCard (already wired to `/api/quick-contact/submit`) + "Use the full intake form →" fallback link. Reduces friction for visitors who just want to start a conversation.
- 2026-02 — Pillar page trust strip on `/osha-compliance-guide` — 3-stat navy/gold bar above the closing CTA ("25+ Years · 12 of 13 · NC-Based").
- 2026-02 — `admin.py` refactor: extracted repetitive lead-magnet stats querying into `lead_magnet_stats()` helper. 60+ lines deduplicated. Endpoint shape unchanged, all values verified identical via curl.
- 2026-02 — Strengthened `/about` with "For Editors & Publications" press-bio block: 5 credential pills + 3 copy-paste-ready blocks (one-liner, 90-word bio, direct contact) with working copy-to-clipboard buttons. Added `sameAs` array to Person JSON-LD (giglinecompliance.com / /about / /osha-compliance-guide) so Google connects citations across the site.
- 2026-02 — **GL-WEB-021 shipped**: Compliance Readiness priceLine fixed to "From $2,000 · range $2,000–$2,400"; `/contact` Quick-Action CTA block added (Call / Email / Request Walkthrough buttons + intro copy); Safety Check tier copy updated per spec — low tier now routes to `/osha-inspection-guide`, all tiers include "Want Vince to review your score?" mailto footer; sitewide noscript fallback rewritten as GigLine pitch line.
- 2026-02 — **GL-WEB-020 shipped**: Homepage "Recent Engagement" compact proof block added between "What We Find" and "Why GigLine" (navy + gold accent linking to case study); Case Study page metrics bar relabeled ("To Close 12 of 13"); 13-row Corrective Actions table + Outcome block + pull quote live; all "findings closed" copy updated to "corrective actions closed within four days of the walkthrough" across homepage, schema, and SSR mirrors.
- 2026-02 — Fixed Navbar tagline from "Greensboro, NC" → "Kernersville, NC" (was the last stale location reference sitewide).
- 2026-02 — Wired **8 real walkthrough photos** as hero images on Field Note detail pages: HazCom, Electrical Safety, Lockout/Tagout, Forklift Safety, Walking Surfaces, Emergency Action Plans, Recordkeeping & 300 Log, Machine Guarding. Each photo also flows into the page's `og:image` meta + Article schema `image` (rich social previews + Google rich results per topic). Total: 9 of 25 Field Notes now have hero photos.
- 2026-02 — Fixed broken machine-guarding photo in Sample Report Section on `/services` — saved real photo to `/floor-findings/machine-guarding.jpg`.
- 2026-02 — Built **OSHA Compliance Guide pillar page** at `/osha-compliance-guide`. Topical index of all 25 Field Notes organized into 6 hazard clusters (Chemical & Health, Mechanical & Energy, Fall & Height, PPE, Process & Recordkeeping, Operations). CollectionPage + WebPage + BreadcrumbList schema. Added to /resources hub, sitemap.xml, and SSR pre-render with full content + 25 internal links. Removed retired `/onboarding` URL from sitemap.
- 2026-02 — Expanded "Related Field Notes" cross-linking from 2 → 3 per note across all 25 Field Notes (React side). Mirrored into `generate-seo-pages.js` SSR pre-render so crawlers see the internal links without JS — topic-cluster signal for Google.
- 2026-02 — Upgraded Article JSON-LD schema on all 25 Field Notes + 2 inline blog articles + 1 case study (added `image`, `datePublished`, `dateModified`, `articleSection`, `inLanguage` — Google rich-result eligible). Corrected 3 inline schemas that had future `datePublished` dates.
- 2026-02 — Fixed Admin Dashboard HR tile (`hr_osha_guide` dict added to `/api/admin/stats` response).
- 2026-02 — Added Supervisor Safety Starter System tile to `/resources` page + mirrored in `generate-seo-pages.js`.
- 2026-02 (prev fork) — GL-WEB-020: Auto-open PDF on all gated downloads.
- 2026-02 (prev fork) — GL-WEB-019: HR-facing copy + new `/osha-inspection-guide` page.
- 2026-02 (prev fork) — Sample Report swapped to real redacted PDF.
- 2026-02 (prev fork) — Legacy `/onboarding` retired.
- 2026-02 (prev fork) — Factual sweep + Google Review UTM consolidation.
- 2026-02 (prev fork) — 9 new Field Notes (25 total) + backlink playbook.

## Test Credentials
See `/app/memory/test_credentials.md`.
