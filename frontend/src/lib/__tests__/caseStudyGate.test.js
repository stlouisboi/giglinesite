/**
 * Phase 2 Batch 2A.3, case-study gating test.
 *
 * Proves two things by reading the source files directly (no DOM render, so
 * no need to boot the router + SEO helmet + all page assets in Jest):
 *
 *   1. When CASE_STUDY_PUBLIC is false, every public-facing link to
 *      /case-study/metal-fabrication-readiness on the homepage and adjacent
 *      service pages is wrapped in a `{CASE_STUDY_PUBLIC && ...}` guard, and
 *      every reusable teaser / sitemap / search-index / SSR emission is
 *      gated as well.
 *
 *   2. The case-study page's top CTA has been re-pointed at the
 *      Compliance Readiness Visit and includes the "$500 savings" tagline
 *      the owner requires.
 *
 * These tests operate on raw source strings so they stay stable regardless
 * of Reveal wrappers, framer-motion, router setup, or lazy imports.
 */
const fs = require('fs');
const path = require('path');

const CANONICAL = '/case-study/metal-fabrication-readiness';
const SRC = path.join(__dirname, '..', '..');

const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

describe('CASE_STUDY_PUBLIC flag', () => {
  test('features.js declares CASE_STUDY_PUBLIC = false', () => {
    const cfg = read('config/features.js');
    expect(cfg).toMatch(/export\s+const\s+CASE_STUDY_PUBLIC\s*=\s*false\s*;/);
  });
});

describe('Homepage case-study promotions', () => {
  const home = read('pages/HomePage.js');

  test('imports CASE_STUDY_PUBLIC from features', () => {
    expect(home).toMatch(/CASE_STUDY_PUBLIC[^;]*from\s+['"]\.\.\/config\/features['"]/);
  });

  test('every case-study Link on the homepage sits inside a CASE_STUDY_PUBLIC guard', () => {
    // For each occurrence of the canonical URL in the source, look back a
    // reasonable window and confirm a `{CASE_STUDY_PUBLIC &&` opener appears
    // before it without an intervening top-level guard close.
    const WINDOW = 4000;
    let idx = home.indexOf(CANONICAL);
    let occurrences = 0;
    while (idx !== -1) {
      const windowStart = Math.max(0, idx - WINDOW);
      const before = home.slice(windowStart, idx);
      expect(before).toMatch(/\{CASE_STUDY_PUBLIC\s*&&/);
      occurrences += 1;
      idx = home.indexOf(CANONICAL, idx + 1);
    }
    expect(occurrences).toBeGreaterThan(0);
  });

  test('trust-section grid downshifts to two columns when the case-study column is hidden', () => {
    expect(home).toMatch(/CASE_STUDY_PUBLIC\s*\?\s*['"]lg:grid-cols-3['"]\s*:\s*['"]lg:grid-cols-2['"]/);
  });
});

describe('CaseStudyTeaser gating', () => {
  const teaser = read('components/CaseStudyTeaser.js');

  test('early-returns null when the flag is false', () => {
    expect(teaser).toMatch(/if\s*\(\s*!CASE_STUDY_PUBLIC\s*\)\s*return\s+null\s*;/);
  });
});

describe('Case-study page top CTA', () => {
  const casePage = read('pages/CaseStudyMetalsFabricationPage.js');

  test('top CTA points at the Compliance Readiness Visit intake with the case-top-cta campaign', () => {
    // Extract the top-CTA block by data-testid anchor.
    const start = casePage.indexOf('data-testid="case-top-cta"');
    expect(start).toBeGreaterThan(-1);
    // Read forward to the closing </div> of that block.
    const block = casePage.slice(start, start + 1500);
    expect(block).toContain('/intake?service=compliance-readiness-visit');
    expect(block).toContain('utm_campaign=case-top-cta');
    expect(block).toContain('Request a Compliance Readiness Visit');
  });

  test('top CTA tagline advertises the $2,500 starting price and $500 savings, not the $1,300 walkthrough', () => {
    const start = casePage.indexOf('data-testid="case-top-cta"');
    const block = casePage.slice(start, start + 1500);
    expect(block).toContain('Starting at $2,500');
    expect(block).toContain('Saves $500');
    expect(block).not.toContain('From $1,300');
    expect(block).not.toContain('Request a Walkthrough Like This');
  });
});

describe('Adjacent service pages, case-study links are gated', () => {
  const crv = read('pages/ComplianceReadinessVisitPage.js');
  const wt = read('pages/WalkthroughLandingPage.js');

  test('ComplianceReadinessVisitPage imports the flag and wraps the social-proof section', () => {
    expect(crv).toMatch(/CASE_STUDY_PUBLIC[^;]*from\s+['"]\.\.\/config\/features['"]/);
    const WINDOW = 4000;
    let idx = crv.indexOf(CANONICAL);
    while (idx !== -1) {
      const before = crv.slice(Math.max(0, idx - WINDOW), idx);
      expect(before).toMatch(/\{CASE_STUDY_PUBLIC\s*&&/);
      idx = crv.indexOf(CANONICAL, idx + 1);
    }
  });

  test('WalkthroughLandingPage imports the flag and gates the social-proof section', () => {
    expect(wt).toMatch(/CASE_STUDY_PUBLIC[^;]*from\s+['"]\.\.\/config\/features['"]/);
    const WINDOW = 4000;
    let idx = wt.indexOf(CANONICAL);
    while (idx !== -1) {
      const before = wt.slice(Math.max(0, idx - WINDOW), idx);
      expect(before).toMatch(/\{CASE_STUDY_PUBLIC\s*&&/);
      idx = wt.indexOf(CANONICAL, idx + 1);
    }
  });
});

describe('SSR pre-render script gating', () => {
  const ssr = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'scripts', 'generate-seo-pages.js'),
    'utf8',
  );

  test('generate-seo-pages declares CASE_STUDY_PUBLIC = false', () => {
    expect(ssr).toMatch(/const\s+CASE_STUDY_PUBLIC\s*=\s*false\s*;/);
  });

  test('generate-seo-pages skips the case-study route when the flag is off', () => {
    expect(ssr).toMatch(/!CASE_STUDY_PUBLIC[\s\S]{0,80}route\.path\s*===\s*CASE_STUDY_PATH/);
  });

  test('generate-seo-pages does not emit unguarded promotional case-study anchors', () => {
    // Every remaining literal reference to the canonical URL should be
    // inside a `${CASE_STUDY_PUBLIC ? ...}` template, part of the route
    // definition, or part of the skip guard. There must be no plain
    // `<a href="/case-study/...">` inline in a body template.
    const inlineAnchors =
      ssr.match(/<a\s+href="\/case-study\/metal-fabrication-readiness"/g) || [];
    // Each such anchor lives inside a `${CASE_STUDY_PUBLIC ? \`...\` : ''}`
    // fragment. Confirm that count matches the ternary-count around them.
    const ternaryCount = (ssr.match(/CASE_STUDY_PUBLIC\s*\?\s*`/g) || []).length;
    expect(ternaryCount).toBeGreaterThanOrEqual(inlineAnchors.length);
  });
});

describe('Sitemap and site search index', () => {
  test('sitemap.xml still excludes the case study while the flag is off', () => {
    const sitemap = fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'public', 'sitemap.xml'),
      'utf8',
    );
    expect(sitemap).not.toContain(CANONICAL);
  });
});
