# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (owned by Vince Lawrence) based in Kernersville, NC. Marketing site with routes (Home, Services, About, Contact, Safety Check). Full-stack app with FastAPI/MongoDB backend for Safety Check submissions, PDF reports, email drip campaigns, Stripe payments, Calendly booking.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco + JetBrains Mono + Playfair Display (Google Fonts)
- **Backend**: FastAPI + MongoDB (motor) + ReportLab (PDF) + Resend (Email)
- **Deployment**: Vercel (via GitHub)
- **Services**: Formspree, Stripe (LIVE), Calendly (LIVE), Resend (LIVE)

## Completed Specs
- **GL-WEB-001**: Safety Check Tool (standalone page + teaser)
- **GL-WEB-002**: SEO/Header Fixes (Formspree, sticky nav, meta tags, sitemap)
- **GL-WEB-003**: Contact Prominence (Call Vince bar, trust cues)
- **GL-WEB-004**: Homepage Full Structured Replacement (8 sections, locked copy)
- **GL-WEB-005**: Homepage Visual Design Upgrade — "Inspection Standard"
- **GL-WEB-007**: Contact Form Revisions & Internal Linking Audit
- **GL-COPY-001**: CTA & Copy Funnel Updates — All Four Pages
- **GL-SEO-001**: Full SEO Audit & Fixes
- **GL-WEB-008**: HazCom Starter Pack ($29 Stripe product page + PDF delivery)
- **GL-WEB-009**: Homepage Hero Redesign (Heat Stress Mockup two-column)
- **GL-WEB-010**: Blog Posts (2 SEO-optimized articles)
- **GL-WEB-011**: Heat Guide email gate (/heat-guide)
- **GL-WEB-012**: OG Image for social sharing
- **GL-WEB-013**: Homepage Rebuild — Authority-First Conversion Funnel (April 2026)
  - 9-section conversion flow: Hero → Reality → Signal → Solution → Deliverables → Objection → Proof → Founder → Final CTA
  - "THIS IS NOT A FULL AUDIT. IT IS A SIGNAL." standalone visual emphasis section
  - Outcome-based service descriptions ("Walk the floor. Find the gaps.")
  - Strikethrough OSHA comparison in objection handling
  - Full-width Vince background image proof section
  - New `/request-walkthrough` intake page (form → Calendly post-submit)
  - Backend `POST /api/walkthrough/request` stores leads + Resend notification to Vince

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
- `POST /api/hazcom/checkout`
- `GET /api/hazcom/verify?session_id=`
- `GET /api/hazcom/download/{filename}?session_id=`
- `POST /api/walkthrough/request` — Intake form + Vince email notification
- `POST /api/heat-guide/download`

## Pages
- `/` — Homepage (9-section conversion funnel)
- `/services` — Services & Pricing
- `/about` — About Vince Lawrence
- `/contact` — Contact form
- `/safety-check` — Free Safety Check tool
- `/request-walkthrough` — Walkthrough intake form → Calendly scheduling
- `/hazcom` — HazCom Starter Pack ($29 product)
- `/hazcom/thank-you` — Download page (session-validated)
- `/blog/top-5-osha-violations-small-manufacturing` — SEO blog article
- `/blog/hazcom-requirements-small-business` — SEO blog article
- `/heat-guide` — Heat Stress Action Template lead magnet (email gate)
- `/payment-success` — Stripe payment confirmation (noindex)

## Upcoming Tasks
1. Video Embeds (P1) — User has a 30-45s video for the proof section placeholder
2. Ad Tracking & Analytics (P1) — Google Analytics, FB Pixel, Google Ads conversion tracking

## Deployment Notes
- Save to Github → Manually Redeploy in Vercel dashboard
- Build: `yarn build` (runs `craco build`), Root: `frontend`
