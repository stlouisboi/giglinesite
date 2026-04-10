# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (owned by Vince Lawrence) based in Kernersville, NC. Marketing site with routes (Home, Services, About, Contact, Safety Check). Full-stack app with FastAPI/MongoDB backend for Safety Check submissions, PDF reports, email drip campaigns, Stripe payments, Calendly booking.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco + JetBrains Mono + Playfair Display (Google Fonts)
- **Backend**: FastAPI + MongoDB (motor) + ReportLab (PDF) + Resend (Email)
- **Deployment**: Vercel (via GitHub)
- **Services**: Formspree, Stripe (LIVE), Calendly (LIVE), Resend (LIVE)

## Completed Specs
- **GL-WEB-001**: Safety Check Tool
- **GL-WEB-002**: SEO/Header Fixes
- **GL-WEB-003**: Contact Prominence
- **GL-WEB-004**: Homepage Structured Replacement
- **GL-WEB-005**: Homepage Visual Design Upgrade
- **GL-WEB-007**: Contact Form & Internal Linking
- **GL-COPY-001**: CTA & Copy Funnel Updates
- **GL-SEO-001**: Full SEO Audit & Fixes
- **GL-WEB-008**: HazCom Starter Pack ($29 Stripe)
- **GL-WEB-009**: Homepage Hero Redesign
- **GL-WEB-010**: Blog Posts (2 SEO articles)
- **GL-WEB-011**: Heat Guide email gate
- **GL-WEB-012**: OG Image for social sharing
- **GL-WEB-013**: Homepage Rebuild — 9-Section Conversion Funnel (April 2026)
  - Hero → Reality → Signal → Solution → Deliverables → Objection → Proof → Founder → Final CTA
  - `/request-walkthrough` intake page with Calendly post-submit
  - Backend `POST /api/walkthrough/request` with Resend notification
- **GL-WEB-014**: Homepage Polish + UTM Tracking (April 2026)
  - Hero CTA visual hierarchy (dominant primary, subtle secondary)
  - Founder bio expanded (4 paragraphs + "Navy veteran and shop-floor safety specialist" subtitle)
  - Credentials: removed "fleet operations", added "Safety Coordinator"
  - UTM parameter auto-capture (utm_source/medium/campaign/term/content) on intake form
  - UTM data stored in MongoDB and included in Vince's notification email

## Key API Endpoints
- `POST /api/safety-check/submit`
- `GET /api/safety-check/report/{submission_id}`
- `POST /api/create-payment-intent`
- `POST /api/email-drip/process`
- `POST /api/hazcom/checkout`
- `GET /api/hazcom/verify?session_id=`
- `GET /api/hazcom/download/{filename}?session_id=`
- `POST /api/walkthrough/request` — Intake form + UTM tracking + Vince email
- `POST /api/heat-guide/download`

## Pages
- `/` — Homepage (9-section conversion funnel)
- `/services` — Services & Pricing
- `/about` — About Vince Lawrence
- `/contact` — Contact form
- `/safety-check` — Free Safety Check tool
- `/request-walkthrough` — Walkthrough intake → Calendly scheduling
- `/hazcom` — HazCom Starter Pack ($29)
- `/hazcom/thank-you` — Download page
- `/blog/top-5-osha-violations-small-manufacturing`
- `/blog/hazcom-requirements-small-business`
- `/heat-guide` — Heat Stress lead magnet
- `/payment-success` — Stripe confirmation

## Upcoming Tasks
1. Video Embeds (P1) — Replace proof section placeholder when video ready
2. Ad Tracking & Analytics (P1) — Google Analytics, FB Pixel, Google Ads conversion tracking

## Deployment Notes
- Save to Github → Manually Redeploy in Vercel dashboard
- Build: `yarn build` (runs `craco build`), Root: `frontend`
