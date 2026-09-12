/**
 * GigLine Safety & Compliance, frontend feature flags.
 *
 * SUPERVISOR_KIT_ENABLED
 *   GL-WEB-018 (Jul 2026). Originally env-driven so the Supervisor Safety OS
 *   could be toggled off on production without a redeploy. As of Aug 2026 the
 *   kit is a permanent live product, hard-coded to `true` to eliminate the
 *   Vercel env-var dependency that caused the route to redirect to `/services`
 *   when the variable was not set on the deploy target.
 *
 *   Backend has a matching flag (`SUPERVISOR_KIT_ENABLED` in backend/.env)
 *   that still controls whether checkout endpoints are live.
 *
 * WAITLIST_KITS_LIVE
 *   Phase 2 (Feb 2026). Ghost / waitlist kits (Incident-to-Correction,
 *   New Hire Orientation) remain non-purchasable until every deliverable,
 *   Stripe checkout, fulfillment path, thank-you and recovery flow, and
 *   product-page claim have been individually verified. Kept `false` until
 *   owner approval per Phase 2 spec.
 *
 * FIRST_PULL_CHECKLISTS_ENABLED
 *   Phase 2 (Feb 2026). Educational lead-magnet drafts for five checklists:
 *   LOTO, Forklift & PIT, HazCom, Incident-to-Correction, New Hire Orientation.
 *   Draft copy only. NOT indexed. NOT in sitemap. NOT linked from nav. NOT
 *   wired to production forms or live email automations. Owner reviews each
 *   checklist and its disclaimer before flipping this flag to `true`.
 *
 * OSHA_TWELVE_QUESTIONS_ENABLED
 *   Phase 2 (Feb 2026). Full "12 Questions to Answer Before OSHA Walks In"
 *   lead-magnet experience: landing page, questions, optional lead form,
 *   confirmation state, downloadable resource, draft delivery email. Draft
 *   only. NOT indexed. NOT in sitemap. NOT linked from nav. NOT wired to
 *   production forms or live email automations. Owner reviews and approves
 *   the copy before this flag flips to `true`.
 */

export const SUPERVISOR_KIT_ENABLED = true;

export const WAITLIST_KITS_LIVE = false;

export const FIRST_PULL_CHECKLISTS_ENABLED = false;

export const OSHA_TWELVE_QUESTIONS_ENABLED = false;

// Legacy helper used by CitationProofKits routing. Ghost / waitlisted kits
// return false so their pages route to the waitlist rather than checkout.
export function isKitLive(slug) {
  if (slug === 'incident-to-correction-kit' || slug === 'new-hire-orientation-kit') {
    return WAITLIST_KITS_LIVE;
  }
  return true;
}
