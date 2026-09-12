#!/usr/bin/env node
/**
 * GigLine Safety & Compliance, canonical sitemap generator.
 *
 * SINGLE SOURCE OF TRUTH for /public/sitemap.xml.
 * All indexable public routes live in ROUTES below. Every entry emits one
 * well-formed <url> block with <loc>, <lastmod>, <changefreq>, and <priority>.
 *
 * Explicitly EXCLUDED (do not add to ROUTES):
 *   - Redirects  (see /app/frontend/src/App.js <Navigate> routes + vercel.json)
 *       /services/document-development           -> /services/documentation-readiness-review
 *       /services/annual-compliance-partner      -> /ongoing-safety-support
 *       /services/quarterly-compliance-maintenance -> /ongoing-safety-support
 *       /services/ongoing-safety-support         -> /ongoing-safety-support
 *       /services/safety-walkthrough(-report)    -> /safety-walkthrough
 *       /privacy /terms /request-walkthrough /onboarding /walkthrough
 *       /osha-ready-control-system, /osha-compliance-gap-check, /documentation-gap-check
 *   - Private / admin: /admin, /status, /report subroutes
 *   - Thank-you & confirmation pages: /thank-you-... routes,
 *       /citation-proof-kits/<slug>/thank-you, /hazcom-thank-you, /supervisor-kit-thank-you
 *   - Unavailable / gated products: /supervisor-kit (feature flag),
 *       /citation-proof-kits/incident-to-correction-kit,
 *       /citation-proof-kits/new-hire-orientation-kit
 *   - Legal & policy: kept indexable (see below) but not marketing pages.
 *
 * Run with:  node frontend/scripts/generate-sitemap.js
 * Output:    frontend/public/sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://www.giglinecompliance.com';
const TODAY = new Date().toISOString().slice(0, 10);

// changefreq/priority defaults per section, override per-entry when needed.
const ROUTES = [
  // ── Core pages ─────────────────────────────────────────────────────
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/services', priority: '0.9', changefreq: 'monthly' },
  { loc: '/about', priority: '0.8', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  { loc: '/faq', priority: '0.9', changefreq: 'monthly' },
  { loc: '/service-areas', priority: '0.9', changefreq: 'monthly' },
  { loc: '/intake', priority: '0.9', changefreq: 'monthly' },

  // Legal & compliance policy
  { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },

  // ── Service pages (active offers only) ─────────────────────────────
  { loc: '/safety-walkthrough', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/documentation-readiness-review', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/compliance-readiness-visit', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/incident-review', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/corrective-action-implementation', priority: '0.85', changefreq: 'monthly' },
  { loc: '/services/safety-control-system-buildout', priority: '0.8', changefreq: 'monthly' },
  { loc: '/ongoing-safety-support', priority: '0.9', changefreq: 'monthly' },

  // ── Location landing pages ─────────────────────────────────────────
  { loc: '/forklift-compliance-review-nc', priority: '0.8', changefreq: 'monthly' },
  { loc: '/loto-procedure-review-nc', priority: '0.8', changefreq: 'monthly' },
  { loc: '/osha-documentation-review-nc', priority: '0.8', changefreq: 'monthly' },
  { loc: '/osha-compliance-guide', priority: '0.9', changefreq: 'monthly' },
  { loc: '/osha-inspection-guide', priority: '0.85', changefreq: 'monthly' },

  // ── Free tools & lead magnets ──────────────────────────────────────
  { loc: '/safety-check', priority: '0.9', changefreq: 'monthly' },
  { loc: '/citation-cost-calculator', priority: '0.85', changefreq: 'monthly' },
  { loc: '/hazcom', priority: '0.8', changefreq: 'monthly' },
  { loc: '/hazcom-starter-pack', priority: '0.85', changefreq: 'monthly' },
  { loc: '/heat-guide', priority: '0.7', changefreq: 'monthly' },
  { loc: '/resources', priority: '0.85', changefreq: 'monthly' },
  { loc: '/sample-report', priority: '0.85', changefreq: 'monthly' },
  { loc: '/sample-corrective-action-log', priority: '0.7', changefreq: 'monthly' },

  // ── Case studies ───────────────────────────────────────────────────
  { loc: '/case-study/metals-fabrication-statesville', priority: '0.9', changefreq: 'yearly' },

  // ── GigLine Compliance Control Kit Series (released only) ──────────
  { loc: '/citation-proof-kits', priority: '0.9', changefreq: 'weekly' },
  { loc: '/citation-proof-kits/loto-readiness-kit', priority: '0.8', changefreq: 'weekly' },
  { loc: '/citation-proof-kits/forklift-pit-readiness-kit', priority: '0.8', changefreq: 'weekly' },
  { loc: '/citation-proof-kits/hazcom-pro-kit', priority: '0.7', changefreq: 'weekly' },

  // ── Blog articles ──────────────────────────────────────────────────
  { loc: '/field-notes', priority: '0.85', changefreq: 'monthly' },
  { loc: '/blog/top-5-osha-violations-small-manufacturing', priority: '0.9', changefreq: 'monthly' },
  { loc: '/blog/hazcom-requirements-small-business', priority: '0.9', changefreq: 'monthly' },
  { loc: '/blog/loto-program-requirements-small-facilities', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/osha-300-log-common-mistakes-citations', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/osha-forklift-compliance-inspector-checklist', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/osha-machine-guarding-checklist-small-manufacturers', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/written-hazcom-program-before-osha-inspection', priority: '0.7', changefreq: 'monthly' },
  { loc: '/blog/mid-year-2026-osha-update-nc-manufacturers', priority: '0.85', changefreq: 'monthly' },
  { loc: '/blog/osha-penalty-north-carolina-2026', priority: '0.9', changefreq: 'monthly' },

  // ── Field notes (25 articles) ──────────────────────────────────────
  ...[
    'heat-stress', 'ai-generated-safety-programs', 'forklift-safety',
    'electrical-safety', 'hazcom', 'machine-guarding', 'walking-surfaces',
    'lockout-tagout', 'emergency-action-plans', 'ppe-assessment',
    'fall-protection', 'confined-space', 'scaffolding-safety',
    'hearing-conservation', 'bloodborne-pathogens', 'recordkeeping-300-log',
    'respiratory-protection', 'silica-respirable-crystalline',
    'hot-work-welding', 'abrasive-wheels', 'ladder-safety',
    'eye-face-protection', 'trenching-excavation', 'cranes-rigging',
    'nc-osha-vs-federal',
  ].map((slug) => ({ loc: `/field-notes/${slug}`, priority: '0.7', changefreq: 'monthly' })),

  // ── City landing pages (safety walkthrough per city) ───────────────
  ...[
    'kernersville', 'winston-salem', 'greensboro', 'high-point',
    'clemmons', 'lexington', 'thomasville', 'mocksville',
    'burlington', 'asheboro', 'salisbury', 'charlotte', 'raleigh',
  ].map((city) => ({
    loc: `/safety-walkthrough/${city}`,
    priority: city === 'kernersville' ? '0.9' : '0.8',
    changefreq: 'monthly',
  })),
];

// Dedupe by loc while preserving the first occurrence.
const seen = new Set();
const deduped = ROUTES.filter((r) => {
  if (seen.has(r.loc)) return false;
  seen.add(r.loc);
  return true;
});

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const urlBlocks = deduped
  .map((r) => {
    const lastmod = r.lastmod || TODAY;
    return (
      `  <url>\n` +
      `    <loc>${xmlEscape(BASE + r.loc)}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>${r.changefreq}</changefreq>\n` +
      `    <priority>${r.priority}</priority>\n` +
      `  </url>`
    );
  })
  .join('\n');

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${urlBlocks}\n` +
  `</urlset>\n`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`[sitemap] wrote ${deduped.length} URLs -> ${outPath}`);

// Quick well-formedness self-check.
// (For a full validator we rely on xmllint in CI; this catches the common bugs
// the manual sitemap suffered from: unmatched <url> tags, duplicate entries.)
const openCount = (xml.match(/<url>/g) || []).length;
const closeCount = (xml.match(/<\/url>/g) || []).length;
if (openCount !== closeCount) {
  console.error(`[sitemap] FAILED, unmatched <url> tags: ${openCount} open vs ${closeCount} close`);
  process.exit(1);
}
console.log(`[sitemap] tags balanced (${openCount} open == ${closeCount} close)`);
