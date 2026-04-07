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
  - Hero: Gold underlines on consequence words, dot grid bg, gold rules on positioning line
  - The Reality: Ghost CFR watermark numbers behind violation cards
  - What We Do: Large gold 01/02/03 display numbers, gold left border
  - What You Get: Numbered sequence with connectors, display-size pull quote
  - Who We Work With: Dark band, 4 columns with dividers, custom SVG icons
  - About: Founder quote as section header, credential pills
  - Transportation: "49 CFR" ghost watermark
  - Final CTA: Pure black bg, two-tone headline, monospace contact block
  - Global: Monospace section labels with gold square marker, scroll reveal animations, CFR in monospace
  - 35/35 tests passed
- **GL-WEB-007**: Contact Form Revisions & Internal Linking Audit

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

## Upcoming Tasks
1. Video Embeds (P1) — placement TBD
2. Ad Tracking & Analytics (P1)

## Deployment Notes
- Save to Github → Manually Redeploy in Vercel dashboard
- Build: `yarn build` (runs `craco build`), Root: `frontend`
