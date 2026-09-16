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

/**
 * RECOMMENDATION_ROUTER_ENABLED
 *   Phase 2 Batch 2B (Feb 2026). Central recommendation engine at
 *   /recommendation plus optional entry cards on the homepage, /services,
 *   and /citation-proof-kits, plus compact "Is this the right starting
 *   point?" embeds on the three assessment service pages. Everything is a
 *   preview build. When `false`:
 *     - Route emits noindex, nofollow and only renders behind ?preview=1
 *       on the preview environment (production refuses the bypass).
 *     - No entry cards are surfaced anywhere in the public UI.
 *     - The route is not in the sitemap and not linked from nav.
 *   Flip to `true` only after owner approval, and only in coordination
 *   with the transactional-email wiring in Batch 2C.
 */
export const RECOMMENDATION_ROUTER_ENABLED = false;

/**
 * EMAIL_DELIVERY_LIVE
 *   Phase 2 Batch 2B, held at `false` until real transactional email is
 *   wired (Batch 2C). When `false`, the "Email my recommendation" and
 *   "Email my action plan" toggles are hidden entirely so buyers never
 *   see a "Preview only, no email was sent" confirmation. The router
 *   result itself and every other decision-support surface stays visible.
 */
export const EMAIL_DELIVERY_LIVE = false;

/**
 * EXIT_FEEDBACK_ENABLED
 *   Phase 2 Batch 2B (Feb 2026). Tiny "What stopped you?" prompt on the
 *   recommendation result. Kept off in every environment until owner
 *   confirms placement and copy. Never renders when false.
 */
export const EXIT_FEEDBACK_ENABLED = false;

/**
 * CASE_STUDY_PUBLIC
 *   Phase 2 Batch 2A.2 (Sep 2026). Owner decision: withhold the anonymized
 *   case study from public indexing and production promotion until written
 *   client permission is documented. When `false`:
 *     - Case study route emits noindex, nofollow and only renders behind
 *       ?preview=1 on the preview environment (production refuses).
 *     - Case study is excluded from the sitemap, public search index, home
 *       page teaser, and any internal promotional link.
 *   Flip to `true` only after written client permission is on file.
 */
export const CASE_STUDY_PUBLIC = false;

// Legacy helper used by CitationProofKits routing. Ghost / waitlisted kits
// return false so their pages route to the waitlist rather than checkout.
export function isKitLive(slug) {
  if (slug === 'incident-to-correction-kit' || slug === 'new-hire-orientation-kit') {
    return WAITLIST_KITS_LIVE;
  }
  return true;
}
