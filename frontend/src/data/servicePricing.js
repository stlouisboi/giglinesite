/**
 * GigLine Safety & Compliance — canonical public pricing source of truth.
 *
 * Every public-facing price string in the frontend should import from this
 * module so a single change here propagates cleanly. The one deliberate
 * exception is `citationProofKits.js` (kit ladder) — that file already
 * feeds the SSR pipeline (`generate-seo-pages.js`) via CommonJS require
 * and drives backend Stripe checkout amounts (`backend/config.py`), so
 * kit prices remain locally owned there to avoid an awkward dual-import.
 *
 * If you touch these amounts, update:
 *   • PRD.md
 *   • public/sitemap.xml lastmods on the affected pages
 *   • any SSR routes in scripts/generate-seo-pages.js that inline prices
 */

// ─── FIND ─── diagnostic services ────────────────────────────────────────
export const SAFETY_WALKTHROUGH = {
  amount: 1300,
  label: 'Starting at $1,300',
  shortLabel: 'From $1,300',
};

export const DOCUMENTATION_REVIEW = {
  amount: 1700,
  label: 'Starting at $1,700',
  shortLabel: 'From $1,700',
};

export const COMPLIANCE_READINESS_VISIT = {
  amount: 2500,
  label: 'Starting at $2,500',
  shortLabel: 'From $2,500',
};

// ─── BUILD ─── implementation services ───────────────────────────────────
export const CORRECTIVE_ACTION_IMPLEMENTATION = {
  amountFrom: 2500,
  label: 'Custom quote, typically $2,500+',
  shortLabel: 'Custom quote, from $2,500',
};

export const OSHA_READY_CONTROL_SYSTEM = {
  amount: 4500,
  label: 'Starting at $4,500',
  shortLabel: 'From $4,500',
};

// ─── MAINTAIN ─── ongoing support ─────────────────────────────────────────
export const QUARTERLY_MAINTENANCE = {
  amount: 950,
  label: 'Starting at $950/quarter',
  shortLabel: 'From $950/quarter',
};

export const ANNUAL_PARTNER = {
  amount: 12000,
  label: '$12,000/year',
  shortLabel: '$12,000/year',
};

// ─── Citation-Proof Kit ladder (mirrored, not owned — see citationProofKits.js) ─
export const KIT_PRICES = {
  digital: 150,
  controlSystem: 300,
  binder: 600,
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
