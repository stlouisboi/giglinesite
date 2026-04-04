# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (owned by Vince Lawrence) based in Kernersville, NC. Static marketing site with routes (Home, Services, About, Contact, Safety Check). Integrated with Formspree for forms, Stripe for payments, Calendly for booking.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco
- **Backend**: FastAPI (Stripe endpoint only)
- **Deployment**: Vercel (via GitHub)
- **Services**: Formspree (forms), Stripe (payments), Calendly (booking — placeholder)

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

### GL-WEB-004: Homepage Revision Spec (April 2026)
- Rev 1: Safety Check topic list (Lockout/Tagout, Machine Guarding, Ladders, Training & Records) + outcome line below button
- Rev 2: Hero "clear list" → "ranked list"
- Rev 3: "5–50 people" qualifier in Who I Work With section
- Rev 4: Second CTA bar changed to "Not sure where to start? Call or email and I'll tell you which review makes sense."
- Rev 5: Duplicate geography line removed (kept hero instance only)
- Rev 6: Two clarity bullets (GigLine vs LaunchPath) added before Ground 0 CTA

### Infrastructure
- Stripe backend endpoint (POST /api/create-payment-intent)
- Custom domain: giglinecompliance.com via Vercel + Namecheap DNS
- Founder headshot on About page

## Pending / Blocked Items
1. **Calendly URL** — placeholder in BookingModal.js, waiting on user's Calendly account
2. **Stripe Live Keys** — using test keys until LLC is formed

## Upcoming Tasks (P1)
1. **Video Embeds** — User wants videos on site, placement TBD
2. **Ad Tracking & Analytics** — Google Analytics, Vercel Analytics, conversion tracking

## Deployment Notes
- Vercel Pro blocks commits from emergent-agent-e1 (not a team member)
- Workaround: After "Save to Github", manually click Redeploy in Vercel dashboard
- Build command: `yarn build` (runs `craco build`)
- Root directory: `frontend`
