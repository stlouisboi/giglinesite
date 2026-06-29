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
### P1
- Real case study with findings + corrective actions + outcomes (currently placeholder).
### P2
- Refactor repeated stats querying in `admin.py` into `get_stats_for_collection(db_collection)` helper.
- 4-touch MailerLite retention sequence (Vince user-side build in MailerLite UI).
- MailerLite automation for `hr-osha-guide-download` group (Vince user-side).

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
