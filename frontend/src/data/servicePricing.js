/**
 * GigLine Safety & Compliance, canonical public pricing source of truth.
 *
 * Every public-facing price string, JSON-LD offer, intake option, analytics
 * value, and SSR route must derive from these constants. If a price appears
 * inline anywhere else in the codebase, it is a bug. Update this file and
 * propagate.
 *
 * ── Phase 1 (Feb 2026) removals ─────────────────────────────────────────
 * - Quarterly Compliance Maintenance ($950/quarter)  , superseded by Ongoing Safety Support
 * - Annual Compliance Control Partner ($12,000/year) , superseded by Ongoing Safety Support
 * - Document Development tiers ($350 / $650 / $1,200 / $2,000)
 *   , subsumed into Corrective Action Implementation (custom quote from $2,500)
 * - Stale walkthrough at $1,200 , canonical is $1,300
 * - Stale documentation review at $1,300 , canonical is $1,700
 * - Stale CRV at $2,000 , canonical is $2,500
 * - Stale Ongoing Safety Support at $1,650 , canonical is $1,850
 * ────────────────────────────────────────────────────────────────────────
 */

// ─── FIND ─── diagnostic services ────────────────────────────────────────
export const SAFETY_WALKTHROUGH = {
  amount: 1300,
  amountStr: '1300',
  label: 'Starting at $1,300',
  shortLabel: 'From $1,300',
  displayPrice: '$1,300',
  slug: 'safety-walkthrough',
};

export const DOCUMENTATION_REVIEW = {
  amount: 1700,
  amountStr: '1700',
  label: 'Starting at $1,700',
  shortLabel: 'From $1,700',
  displayPrice: '$1,700',
  slug: 'documentation-readiness-review',
};

export const COMPLIANCE_READINESS_VISIT = {
  amount: 2500,
  amountStr: '2500',
  label: 'Starting at $2,500',
  shortLabel: 'From $2,500',
  displayPrice: '$2,500',
  slug: 'compliance-readiness-visit',
};

// ─── BUILD ─── implementation services ───────────────────────────────────
export const CORRECTIVE_ACTION_IMPLEMENTATION = {
  amountFrom: 2500,
  amountStr: '2500',
  label: 'Custom quote, most projects begin at $2,500',
  shortLabel: 'Custom quote',
  displayPrice: 'Custom quote',
  slug: 'corrective-action-implementation',
};

export const SAFETY_CONTROL_SYSTEM_BUILDOUT = {
  amount: 4500,
  amountStr: '4500',
  label: 'Starting at $4,500',
  shortLabel: 'From $4,500',
  displayPrice: '$4,500',
  slug: 'safety-control-system-buildout',
};

// ─── MAINTAIN ─── ongoing support ─────────────────────────────────────────
// Ongoing Safety Support is the ONLY approved MAINTAIN offer.
// Quarterly and Annual Partner programs are deprecated. Do not reintroduce.
export const ONGOING_SAFETY_SUPPORT = {
  amount: 1850,
  amountStr: '1850',
  label: 'Starting at $1,850 per month',
  shortLabel: 'From $1,850/mo',
  displayPrice: '$1,850/mo',
  slug: 'ongoing-safety-support',
  path: '/ongoing-safety-support',
};

// ─── Kit ladder (GigLine Compliance Control Kit Series) ──────────────────
// Kit prices are canonical here for the frontend. The backend Stripe amounts
// live in backend/config.py and MUST match.
export const HAZCOM_STARTER_PACK = {
  amount: 29,
  amountStr: '29',
  displayPrice: '$29',
  label: '$29',
};

export const KIT_PRICES = {
  digital: { amount: 150, amountStr: '150', displayPrice: '$150', label: 'Digital Compliance Kit, $150' },
  controlSystem: { amount: 300, amountStr: '300', displayPrice: '$300', label: 'Compliance Control System, $300' },
  binder: { amount: 600, amountStr: '600', displayPrice: '$600', label: 'Compliance Binder Edition, $600' },
};

// ─── Combined-value hook math (Owner-approved language) ──────────────────
export const COMBINED_SEPARATE_TOTAL = 3000;
export const COMBINED_SAVINGS = 500;

/**
 * Approved public-facing savings language. Use this string verbatim wherever
 * the combined-service value proposition appears. Do not paraphrase.
 */
export const COMBINED_SAVINGS_STATEMENT =
  'At the standard starting scope, the Safety Walkthrough and Documentation Readiness Review total $3,000 when purchased separately. The combined Compliance Readiness Visit starts at $2,500, a $500 combined-service savings.';

/**
 * Baseline scope defined for the Documentation Readiness Review (standalone)
 * AND the documentation portion of the Compliance Readiness Visit, unless a
 * larger scope is separately quoted.
 */
export const DOC_REVIEW_BASELINE_SCOPE = [
  'One facility',
  'Up to five core safety program or evidence categories',
  'Up to 25 uploaded files',
  'Representative training and evidence records',
  'Prioritized findings',
  'One findings-review call',
];

/**
 * Full offer catalog, used by JSON-LD OfferCatalog on the homepage and the
 * services page. Order = display order.
 */
export const OFFER_CATALOG = [
  SAFETY_WALKTHROUGH,
  DOCUMENTATION_REVIEW,
  COMPLIANCE_READINESS_VISIT,
  CORRECTIVE_ACTION_IMPLEMENTATION,
  SAFETY_CONTROL_SYSTEM_BUILDOUT,
  ONGOING_SAFETY_SUPPORT,
];

/**
 * priceRange string for LocalBusiness schema. Updated when floor/ceiling
 * of the offer ladder changes.
 */
export const PRICE_RANGE = '$29–$4500';
