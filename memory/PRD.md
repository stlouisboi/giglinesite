# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (owned by Vince Lawrence) based in Kernersville, NC. Static marketing site with routes (Home, Services, About, Contact, Safety Check). Integrated with Formspree for forms, Stripe for payments, Calendly for booking. Expanded into full-stack app with FastAPI/MongoDB backend for Safety Check submissions, PDF report generation, and email drip campaigns.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco
- **Backend**: FastAPI + MongoDB (motor) + ReportLab (PDF) + Resend (Email)
- **Deployment**: Vercel (via GitHub)
- **Services**: Formspree (forms), Stripe (live payments), Calendly (live booking), Resend (live email drip)

## What's Been Implemented

### Core Pages
- Home, Services, About, Contact, Safety Check — all live and styled

### GL-WEB-001: Safety Check Tool
- Standalone /safety-check page with client-side scoring
- Homepage teaser component

### GL-WEB-002: Critical SEO/Header Fixes
- Working Formspree handlers (Contact: xeeprzel, Safety Check: xpqoyldy)
- Sticky header with navigation
- SEO component (meta tags, OpenGraph, JSON-LD Schema)
- Mobile sticky CTA, sitemap.xml, robots.txt

### GL-WEB-003: Contact Prominence & Trust Cues
- "Call Vince" contact bar in multiple placements
- Mobile offer heading weight increase
- Local trust cues (hero/about)

### GL-WEB-004: Homepage — Full Structured Replacement (April 2026)
- **COMPLETE** — 8 sections in strict order per spec:
  1. Hero (new H1, subline, positioning line, 2 CTAs, trust bar, local trust cue)
  2. Safety Check Teaser (carried forward from GL-WEB-001)
  3. Call Vince Bar (first placement)
  4. The Reality (3 violation blocks with CFR citations)
  5. What We Do (3 service cards: Walkthrough $650, Doc Review $550, Incident $900)
  6. Call Vince Bar (second placement)
  7. What You Get (5 deliverable bullets, callout)
  8. Who We Work With (4 segment cards)
  9. About (Vince bio, credentials, headshot, founder quote)
  10. For Transportation Operations (LaunchPath bridge)
  11. Final CTA (buttons + contact block)
- All copy locked and matching spec exactly
- Previous homepage content fully removed
- 35/35 QA tests passed

### GL-WEB-005: Safety Check Backend & Email Drip
- MongoDB storage for all form submissions
- Automated email drip system via Resend (LIVE — domain verified)
- Background scheduler runs every 30 minutes

### GL-WEB-006: PDF Report Generation
- ReportLab-powered branded 2-page PDF reports (GO/WAIT/NO-GO variants)
- Download link on Safety Check completion screen

### GL-WEB-007: Contact Form Revisions & Internal Linking Audit (April 2026)
- **COMPLETE** — All 4 contact form changes + GigLine internal linking

### Infrastructure
- Stripe live payments (sk_live key active)
- Resend live emails (domain verified, drip sending)
- Calendly live booking (vincelaw336/safety-consultation)
- Custom domain: giglinecompliance.com via Vercel + Namecheap DNS
- Google Search Console sitemap verified
- Logo SVG files exported (shield-only, full with text, white variant)

## All Integrations — Status
| Service | Status | Key |
|---------|--------|-----|
| Stripe | LIVE | sk_live_... in backend/.env |
| Resend | LIVE | re_eESJoAbu... in backend/.env, domain verified |
| Calendly | LIVE | calendly.com/vincelaw336/safety-consultation |
| Formspree | LIVE | xeeprzel (contact), xpqoyldy (safety check) |

## Key API Endpoints
- `POST /api/safety-check/submit` — Process form, calculate score, generate PDF, schedule emails
- `GET /api/safety-check/report/{submission_id}` — Return generated PDF
- `POST /api/create-payment-intent` — Stripe payment processing
- `POST /api/email-drip/process` — Manual trigger for email scheduler

## DB Schema
- `safety_check_submissions`: {id, name, company, operation_type, score, concern, phone, email, answers, timestamp, flow_type}
- `drip_emails`: {id, submission_id, email, flow_type, sequence_index, status, send_at, sent_at, error}

## Upcoming Tasks
1. **Video Embeds** (P1) — User wants videos on site, placement TBD
2. **Ad Tracking & Analytics** (P1) — Google Analytics, conversion tracking

## Deployment Notes
- After "Save to Github", manually click Redeploy in Vercel dashboard
- Build command: `yarn build` (runs `craco build`)
- Root directory: `frontend`
