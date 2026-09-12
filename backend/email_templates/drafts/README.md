# GigLine Phase 2, Draft Delivery Emails, AWAITING OWNER APPROVAL

Every template in this folder is a DRAFT stored for owner review. None of these
templates are wired to Resend, MailerLite, or any live sending pipeline. No
prospect will receive any of these emails until the associated feature flag is
flipped to `true` in `frontend/src/config/features.js` AND the delivery
integration is explicitly approved and wired in the backend.

## Files in this folder

- `12-questions-delivery.md` , transactional delivery email for the
  "12 Questions to Answer Before OSHA Walks In" lead magnet. Sent Day 0 to the
  requester regardless of marketing consent (the lead magnet was requested,
  the resource must be delivered).
- `first-pull-checklist-delivery.md` , transactional delivery email for the
  five First-Pull Checklists (LOTO, PIT, HazCom, Incident, New Hire). Per-slug
  variables control which checklist is delivered.
- `safety-check-action-plan-delivery.md` , transactional delivery email for the
  Safety Check "Email my action plan" option. Includes readiness level,
  identified concern categories, three practical next actions, recommended
  GigLine solution with reason, and disclaimer.
- `lead-followup-sequence.md` , five-touch educational follow-up sequence for
  leads who explicitly opted into ongoing communication. Day 0 / 2 / 5 / 8 / 14.
  DRAFT ONLY, NOT ACTIVATED.
- `post-purchase-lifecycle-sequence.md` , kit and service post-purchase
  lifecycle (Day 0 / 3 / 7 / 14 / 30 / 60 / 90 / Annual). DRAFT ONLY, NOT
  ACTIVATED. To be reviewed and approved before wiring.

## Consent rules

- Transactional delivery emails (the requested resource) send regardless of
  marketing consent, if the buyer asked for the download.
- Educational follow-up sequences send only when the buyer explicitly checked
  the marketing-consent box, an unchecked default is used site-wide.
- Every consent action must be logged with an ISO 8601 timestamp and the source
  page.
- Every marketing email must include a visible unsubscribe mechanism.
- Unsubscribe requests halt every future marketing send for that address.

## Voice guardrails

- No fear-heavy OSHA framing. Balance risk mentions with clarity, control,
  time savings, organization, and proof.
- No promises of compliance, immunity from citations, or guaranteed results.
- No fabricated urgency, countdown timers, or scarcity language.
- No fabricated testimonials, reviews, or statistics.
- Case-study language must reference the anonymized NC metal fabrication
  operation, no client name, city, address, or employee identity.

## How to activate a template

1. Owner reviews the draft in this folder.
2. Owner approves the copy, disclaimer, and consent language.
3. Backend engineer wires the template into `backend/routes/*.py` with the
   appropriate Resend send call, guarded by the matching feature flag in
   `backend/.env`.
4. Frontend engineer flips the feature flag in
   `frontend/src/config/features.js`.
5. QA smoke tests one live send to a controlled inbox before general release.
