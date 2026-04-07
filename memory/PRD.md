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
  - Safety Check: Frame text above questions, "Get My Result" submit, dual post-result CTAs (Schedule a Walkthrough / Request a Documentation Review)
  - About: "If That Sounds Like Your Operation" CTA → Safety Check, phone alternate CTA
  - Contact: "Tell Me About Your Operation." headline, "Send It" submit, below-form expectation text

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
