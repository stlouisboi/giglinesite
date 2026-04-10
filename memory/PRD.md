# GigLine Safety & Compliance — PRD

## Original Problem Statement
Build a professional service business website for GigLine Safety & Compliance (Vince Lawrence, Kernersville, NC). Direct-response marketing site designed to get small operators to request paid safety walkthroughs. Full-stack app with FastAPI/MongoDB backend.

## Tech Stack
- **Frontend**: React (CRA) + Tailwind CSS + Craco + JetBrains Mono
- **Backend**: FastAPI + MongoDB (motor) + ReportLab (PDF) + Resend (Email)
- **Deployment**: Vercel (via GitHub, manual redeploy)
- **Services**: Formspree, Stripe (LIVE), Calendly (LIVE), Resend (LIVE)

## Completed Specs
- **GL-WEB-001–012**: Safety Check, SEO, Contact, Homepage iterations, HazCom, Blog, Heat Guide, OG Image
- **GL-WEB-013**: Homepage — 9-Section Conversion Funnel
- **GL-WEB-014**: Homepage Polish + UTM Tracking
- **GL-WEB-015**: Safety Check 3-Phase Funnel + Homepage "What to Expect" + Pricing + Trust Line
- **GL-WEB-016**: Admin Dashboard + Download Tracking + Weekly Email Summary (April 2026)
  - Password-protected admin dashboard at `/admin`
  - 3 tabs: Overview (stats), Leads (tables), Downloads (event log)
  - Overview shows: Lead counts, Risk Breakdown (HIGH/MEDIUM/LOW), Download counts
  - Leads tab: Safety Check submissions with Score/Risk, Walkthrough Requests with UTM source, Heat Guide Leads
  - Downloads tab: Event log for Safety Check PDFs, HazCom Packs, Heat Guides
  - Download tracking on all 3 PDF endpoints (safety_check, hazcom, heat_guide)
  - Risk Score [X/6] in Vince notification email subject line
  - Role field in Vince email body
  - Weekly email summary every Monday 8 AM EST (leads, risk breakdown, download counts)
  - Manual "Send Weekly Summary" button in admin header

## Conversion Flow
```
Homepage → Request a Walkthrough → Intake Form → Calendly (post-submit)
Homepage → Take the Safety Check → 6 Questions → Email Gate → Results → Request a Walkthrough
```

## Key API Endpoints
- `POST /api/safety-check/submit` — 3-phase funnel submission
- `GET /api/safety-check/report/{id}` — PDF download (tracked)
- `POST /api/walkthrough/request` — Intake form + UTM + Vince notification
- `POST /api/hazcom/checkout` — Stripe $29 checkout
- `GET /api/hazcom/download/{filename}?session_id=` — HazCom PDF download (tracked)
- `POST /api/heat-guide/submit` — Email gate + PDF delivery (tracked)
- `POST /api/admin/login` — Admin auth
- `GET /api/admin/stats?token=` — Dashboard stats
- `GET /api/admin/leads?token=` — Lead tables
- `GET /api/admin/downloads?token=` — Download events
- `POST /api/admin/send-summary?token=` — Manual weekly email

## Pages
- `/` — Homepage (10 sections)
- `/services` — Services & Pricing
- `/about` — About Vince Lawrence
- `/contact` — Contact form
- `/safety-check` — 3-phase Safety Check funnel
- `/request-walkthrough` — Intake form → Calendly
- `/hazcom` — HazCom Starter Pack ($29)
- `/heat-guide` — Lead magnet (accessible, not homepage-featured)
- `/admin` — Password-protected admin dashboard
- `/blog/top-5-osha-violations-small-manufacturing`
- `/blog/hazcom-requirements-small-business`

## DB Collections
- `safety_check_submissions`: name, company, phone, email, role, score_gaps, score_level, answers, timestamp
- `walkthrough_requests`: name, company, operation_type, location, description, utm_*, status, timestamp
- `download_events`: type (safety_check_pdf/hazcom_pdf/heat_guide), timestamp, metadata
- `heat_guide_leads`: email, created_at
- `hazcom_deliveries`: session_id, email, sent_at
- `email_drip_queue`: submission_id, emails array with sequence/timing

## Upcoming Tasks
1. Video Embeds (P1) — Replace proof section placeholder
2. Ad Tracking & Analytics (P1) — Google Analytics, FB Pixel, Google Ads conversion tracking

## Deployment Notes
- Save to Github → Manually Redeploy in Vercel dashboard
- Build: `yarn build` (runs `craco build`), Root: `frontend`
- Admin password: stored in backend/.env as ADMIN_PASSWORD
