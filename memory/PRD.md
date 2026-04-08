# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (owned by Vince Lawrence) based in Kernersville, NC. Marketing site with routes (Home, Services, About, Contact, Safety Check). Full-stack app with FastAPI/MongoDB backend for Safety Check submissions, PDF reports, email drip campaigns, Stripe payments, Calendly booking.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco + JetBrains Mono (Google Fonts)
- **Backend**: FastAPI + MongoDB (motor) + ReportLab (PDF) + Resend (Email)
- **Deployment**: Vercel (via GitHub)
- **Services**: Formspree, Stripe (LIVE), Calendly (LIVE), Resend (LIVE)

## Completed Specs
- **GL-WEB-001**: Safety Check Tool (standalone page + teaser)
- **GL-WEB-002**: SEO/Header Fixes (Formspree, sticky nav, meta tags, sitemap)
- **GL-WEB-003**: Contact Prominence (Call Vince bar, trust cues)
- **GL-WEB-004**: Homepage Full Structured Replacement (8 sections, locked copy)
- **GL-WEB-005**: Homepage Visual Design Upgrade — "Inspection Standard" (April 2026)
- **GL-WEB-007**: Contact Form Revisions & Internal Linking Audit
- **GL-COPY-001**: CTA & Copy Funnel Updates — All Four Pages (April 2026)
  - Home: "Take the Free Safety Check" primary CTA, "Request a Review" secondary CTA (hero + after offers + final CTA)
  - Safety Check: Frame text above questions, "Get My Result" submit, **conditional** post-result CTAs based on result band:
    - NO-GO (4-6 gaps) → "Schedule a Walkthrough"
    - WAIT (2-3 gaps) → "Request a Documentation Review"  
    - GO (0-1 gaps) → soft nudge "Reach Out if You Want a Second Look"
  - About: "If That Sounds Like Your Operation" CTA → Safety Check, phone alternate CTA
  - Contact: "Tell Me About Your Operation." headline, "Send It" submit, below-form expectation text
  - PDF bundle + ongoing support triggered by email drip (no product page needed)
- **GL-SEO-001**: Full SEO Audit & Fixes (April 2026)
  - 404 catch-all page with branded design and CTAs
  - Fixed duplicate homepage title tag
  - Added canonical="/" to homepage
  - Fixed Schema.org address (Winston-Salem → Kernersville)
  - Added noindex to /payment-success
  - Added FAQPage schema to Contact page (3 Q&As → rich snippets)
  - Added Service ItemList schema to Services page (3 services + pricing)
  - SEO component extended with noindex + JSON-LD schema support
  - **Post-build SSR meta injection**: `scripts/generate-seo-pages.js` creates per-route HTML files with unique title, description, canonical, OG, and Twitter meta tags so Google's crawler sees correct metadata without JS execution
  - Added `vercel.json` with SPA fallback rewrite + security headers

## All Integrations — Status
| Service | Status |
|---------|--------|
| Stripe | LIVE (sk_live key) |
| Resend | LIVE (domain verified, drip sending) |
| Calendly | LIVE (vincelaw336/safety-consultation) |
| Formspree | LIVE (xeeprzel, xpqoyldy) |

## Key API Endpoints
- `POST /api/safety-check/submit`
- `GET /api/safety-check/report/{submission_id}`
- `POST /api/create-payment-intent`
- `POST /api/email-drip/process`
- `POST /api/hazcom/checkout` — Creates Stripe $29 checkout session
- `GET /api/hazcom/verify?session_id=` — Validates payment for download page
- `GET /api/hazcom/download/{filename}?session_id=` — Protected PDF download

## Upcoming Tasks
1. Video Embeds (P1) — placement TBD
2. Ad Tracking & Analytics (P1)

## Pages
- `/` — Homepage
- `/services` — Services & Pricing
- `/about` — About Vince Lawrence
- `/contact` — Contact form
- `/safety-check` — Free Safety Check tool
- `/hazcom` — HazCom Starter Pack ($29 product)
- `/hazcom/thank-you` — Download page (session-validated)
- `/blog/top-5-osha-violations-small-manufacturing` — SEO blog article
- `/blog/hazcom-requirements-small-business` — SEO blog article
- `/heat-guide` — Heat Stress Action Template lead magnet (email gate placeholder)
- `/payment-success` — Stripe payment confirmation (noindex)

## Deployment Notes
- Save to Github → Manually Redeploy in Vercel dashboard
- Build: `yarn build` (runs `craco build`), Root: `frontend`
