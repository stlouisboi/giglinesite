# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (owned by Vince Lawrence) based in Kernersville, NC. Static marketing site with routes (Home, Services, About, Contact, Safety Check). Integrated with Formspree for forms, Stripe for payments, Calendly for booking. Expanded into full-stack app with FastAPI/MongoDB backend for Safety Check submissions, PDF report generation, and email drip campaigns.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco
- **Backend**: FastAPI + MongoDB (motor) + ReportLab (PDF) + Resend (Email)
- **Deployment**: Vercel (via GitHub)
- **Services**: Formspree (forms), Stripe (payments), Calendly (booking — placeholder), Resend (email drip — needs live key)

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

### GL-WEB-004: Homepage Revision Spec
- Rev 1-6: Safety Check topic list, hero ranked list, 5-50 qualifier, second CTA bar, duplicate geography fix, GigLine vs LaunchPath bullets

### GL-WEB-005: Safety Check Backend & Email Drip
- MongoDB storage for all form submissions
- Automated email drip system via Resend (built but needs live API key)
- Background scheduler runs every 30 minutes

### GL-WEB-006: PDF Report Generation
- ReportLab-powered branded 2-page PDF reports (GO/WAIT/NO-GO variants)
- Download link on Safety Check completion screen

### GL-WEB-007: Contact Form Revisions & Internal Linking Audit (April 2026)
- **Workstream 1 — Contact Form Changes** (COMPLETED):
  - Company field replaced with Operation Type dropdown (5 options in spec order)
  - Phone field marked "(optional)", not required
  - "Not Sure — Need Advice" added as first Service Type option
  - Submit button changed to "Request My Walkthrough"
- **Workstream 2 — GigLine Internal Linking** (COMPLETED):
  - Homepage bridge section links to LaunchPath Ground 0
  - Services page fleet section links to launchpathedu.com + Ground 0
  - Safety Check completion CTA links to /contact
  - Footer "For Fleet Operators" links to launchpathedu.com + Ground 0
  - About page credential block links to /contact with "Request a Walkthrough"
- **Workstream 2 — LaunchPath Linking** (OUT OF SCOPE — separate site)
- **Workstream 3 — Risk Map Verification** (OUT OF SCOPE — separate site)

### Infrastructure
- Stripe backend endpoint (POST /api/create-payment-intent)
- Custom domain: giglinecompliance.com via Vercel + Namecheap DNS
- Founder headshot on About page
- Google Search Console sitemap verified

## Pending / Blocked Items
1. **Resend API Key** — Email drip fully built, needs live key from user
2. **Calendly URL** — Placeholder in BookingModal.js, waiting on user's Calendly account
3. **Stripe Live Keys** — Using test keys until LLC is formed

## Upcoming Tasks (P1)
1. **Video Embeds** — User wants videos on site, placement TBD
2. **Ad Tracking & Analytics** — Google Analytics, Vercel Analytics, conversion tracking

## Deployment Notes
- Vercel Pro blocks commits from emergent-agent-e1 (not a team member)
- Workaround: After "Save to Github", manually click Redeploy in Vercel dashboard
- Build command: `yarn build` (runs `craco build`)
- Root directory: `frontend`

## Key API Endpoints
- `POST /api/safety-check/submit` — Process form, calculate score, generate PDF, schedule emails
- `GET /api/safety-check/report/{submission_id}` — Return generated PDF
- `POST /api/create-payment-intent` — Stripe payment processing
- `POST /api/email-drip/process` — Manual trigger for email scheduler

## DB Schema
- `safety_check_submissions`: {id, name, company, operation_type, score, concern, phone, email, answers, timestamp, flow_type}
- `drip_emails`: {id, submission_id, email, flow_type, sequence_index, status, send_at, sent_at, error}
