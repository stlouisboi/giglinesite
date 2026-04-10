# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (Vince Lawrence, Kernersville, NC). Direct-response marketing site designed to get small operators (manufacturing, warehouse, contractor, fleet) to request a paid safety walkthrough. Full-stack app with FastAPI/MongoDB backend.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco + JetBrains Mono (Google Fonts)
- **Backend**: FastAPI + MongoDB (motor) + ReportLab (PDF) + Resend (Email)
- **Deployment**: Vercel (via GitHub, manual redeploy required)
- **Services**: Formspree, Stripe (LIVE), Calendly (LIVE), Resend (LIVE)

## Completed Specs
- **GL-WEB-001**: Safety Check Tool
- **GL-WEB-002**: SEO/Header Fixes
- **GL-WEB-003**: Contact Prominence
- **GL-WEB-004–009**: Homepage iterations, visual upgrades, hero redesigns
- **GL-COPY-001**: CTA & Copy Funnel Updates
- **GL-SEO-001**: Full SEO Audit & Fixes
- **GL-WEB-008**: HazCom Starter Pack ($29 Stripe)
- **GL-WEB-010**: Blog Posts (2 SEO articles)
- **GL-WEB-011**: Heat Guide email gate (/heat-guide — accessible but not featured on homepage)
- **GL-WEB-012**: OG Image for social sharing
- **GL-WEB-013**: Homepage — 9-Section Conversion Funnel
- **GL-WEB-014**: Homepage Polish + UTM Tracking
- **GL-WEB-015**: Conversion Overhaul (April 2026)
  - **Safety Check 3-Phase Funnel**: Questions → Email Gate → Dedicated Results Page
    - Email gate: Name*, Company*, Email*, Phone (opt), Role (opt dropdown)
    - Results: "Here's Where Your Exposure Probably Is" + flagged topics + explanations + strong conversion CTA
    - Risk tagging: LOW (0-1 gaps), MEDIUM (2-3), HIGH (4+)
    - HIGH risk → [HIGH RISK] prefix in Vince email notification
  - **Homepage "What to Expect"**: 5-step process section after services
  - **Pricing clarity line**: "$500–$1,000" near walkthrough CTAs
  - **Hero trust line**: "No contracts. One visit. Written report."
  - **Email drip CTA** updated from /contact → /request-walkthrough

## Conversion Flow
```
Homepage → Request a Walkthrough → Intake Form → Calendly (post-submit)
Homepage → Take the Safety Check → 6 Questions → Email Gate → Results → Request a Walkthrough
```

## Key API Endpoints
- `POST /api/safety-check/submit` — 3-phase funnel submission (with role, risk tagging)
- `GET /api/safety-check/report/{id}` — PDF download
- `POST /api/walkthrough/request` — Intake form + UTM + Vince notification
- `POST /api/hazcom/checkout` — Stripe $29 checkout
- `GET /api/hazcom/verify?session_id=` — Payment validation
- `POST /api/heat-guide/download` — Email gate + PDF delivery

## Pages
- `/` — Homepage (10 sections: Hero, Reality, Signal, Solution, What to Expect, Deliverables, Objection, Proof, Founder, Final CTA)
- `/services` — Services & Pricing
- `/about` — About Vince Lawrence
- `/contact` — Contact form
- `/safety-check` — 3-phase Safety Check (questions → gate → results)
- `/request-walkthrough` — Intake form → Calendly scheduling
- `/hazcom` — HazCom Starter Pack ($29)
- `/heat-guide` — Lead magnet (accessible, not homepage-featured)
- `/blog/top-5-osha-violations-small-manufacturing`
- `/blog/hazcom-requirements-small-business`

## DB Collections
- `safety_check_submissions`: name, company, phone, email, role, score_gaps, score_level, answers, timestamp
- `email_drip_queue`: submission_id, emails array with sequence/timing
- `walkthrough_requests`: name, company, operation_type, location, description, utm_*, status, timestamp

## Upcoming Tasks
1. Video Embeds (P1) — Replace proof section placeholder
2. Ad Tracking & Analytics (P1) — Google Analytics, FB Pixel, Google Ads conversion tracking

## Deployment Notes
- Save to Github → Manually Redeploy in Vercel dashboard
- Build: `yarn build` (runs `craco build`), Root: `frontend`
