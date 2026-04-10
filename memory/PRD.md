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
- **GL-WEB-015**: Safety Check 3-Phase Funnel + Homepage additions
- **GL-WEB-016**: Admin Dashboard + Download Tracking + Weekly Email Summary
- **GL-WEB-017**: Layout/Rendering Fixes + Footer Restructure + Field Notes (April 2026)
  - Fixed rendering: confirmed no overlapping sections, no duplicated DOM, clean stacking
  - Footer restructured: Resources column (Field Notes, Safety Check, HazCom Starter Pack, Contact)
  - Field Notes index page: `/field-notes` — 6 topics
  - Field Notes detail pages: `/field-notes/:slug`
  - Field Notes NOT on homepage (conversion-focused)
- **GL-WEB-018**: 10-Section Asymmetric Homepage Redesign (Feb 2026)
  - S1: Asymmetric Hero — 60/40 split (left warehouse image, right text + gold CTA)
  - S2: Problem Grid — 4 real-world industrial hazard images in 2×2 grid with overlays
  - S3: Statement Band — "THIS IS NOT A FULL AUDIT. IT IS A SIGNAL."
  - S4: Process — 40/60 split, 5 numbered steps with pricing note
  - S5: Deliverables — 40/60 split, 6 checklist items with check icons
  - S6: Why Not OSHA — 40/60 split, 2-column comparison (strikethrough vs bold)
  - S7: Full-Width Proof Image — warehouse with overlay text
  - S8: Founder — 35/65 split, vince-portrait.png, Navy Veteran + Safety Coordinator pills
  - S9: Final CTA Band — dual buttons + Vince contact info
  - S10: Footer component (unchanged, Resources column with Field Notes)
  - All images from Unsplash CDN + local vince-portrait.png
  - Tested: 100% pass — all sections, navigation, mobile responsiveness, no console errors

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
- `POST /api/heat-guide/download` — Email gate + PDF delivery (tracked)
- `POST /api/admin/login` — Admin auth
- `GET /api/admin/stats?token=` — Dashboard stats
- `GET /api/admin/leads?token=` — Lead tables
- `GET /api/admin/downloads?token=` — Download events
- `POST /api/admin/send-summary?token=` — Manual weekly email

## Pages
- `/` — Homepage (10 sections: Hero, Reality, Signal, Solution, What to Expect, Deliverables, Objection, Proof, Founder, Final CTA)
- `/services` — Services & Pricing
- `/about` — About Vince Lawrence
- `/contact` — Contact form
- `/safety-check` — 3-phase Safety Check funnel
- `/request-walkthrough` — Intake form → Calendly
- `/hazcom` — HazCom Starter Pack ($29)
- `/heat-guide` — Lead magnet (accessible, not homepage-featured)
- `/admin` — Password-protected admin dashboard
- `/field-notes` — Field Notes index (6 topics)
- `/field-notes/:slug` — Individual Field Note detail pages
- `/blog/top-5-osha-violations-small-manufacturing`
- `/blog/hazcom-requirements-small-business`

## Adding New Field Notes
To add a new monthly topic:
1. Add entry to `FIELD_NOTES` array in `FieldNotesPage.js` (slug, title, subtitle, description, topics)
2. Add matching entry to `NOTES` object in `FieldNoteDetailPage.js` (whatItIs, whatGetsMissed, whatISee, checklist)
3. Deploy — no backend changes needed

## Upcoming Tasks
1. Video Embeds (P1) — Replace proof section placeholder
2. Ad Tracking & Analytics (P1) — Google Analytics, FB Pixel, Google Ads conversion tracking

## Deployment Notes
- Save to Github → Manually Redeploy in Vercel dashboard
- Build: `yarn build` (runs `craco build`), Root: `frontend`
- Admin password: stored in backend/.env as ADMIN_PASSWORD
