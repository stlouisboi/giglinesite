/**
 * Services Page Consolidation, regression suite (2026-09-18).
 * Enforces owner-approved spec: pricing matrix, CRV recommended state,
 * separate-scope corrective language, exact founder credential, no $1,650,
 * single rec-entry gated by flag, no unreleased kit purchase CTA.
 */
const fs = require('fs');
const path = require('path');
const REPO = path.join(__dirname, '..', '..', '..', '..');
const readRepo = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8');
const src = readRepo('frontend/src/pages/ServicesPage.js');

describe('Services · Pricing matrix', () => {
  test('Safety Walkthrough card renders canonical $1,300 from servicePricing', () => {
    expect(src).toMatch(/data-testid="service-card-walkthrough-price"[^>]*>\{SAFETY_WALKTHROUGH\.displayPrice\}/);
  });
  test('Documentation Readiness Review card renders canonical $1,700', () => {
    expect(src).toMatch(/data-testid="service-card-docreview-price"[^>]*>\{DOCUMENTATION_REVIEW\.displayPrice\}/);
  });
  test('Compliance Readiness Visit card renders canonical $2,500', () => {
    expect(src).toMatch(/data-testid="service-card-crv-price"[^>]*>\{COMPLIANCE_READINESS_VISIT\.displayPrice\}/);
  });
  test('CAI pricing line shows custom quote + $2,500 from-price', () => {
    const idx = src.indexOf('data-testid="cai-pricing-line"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 500);
    expect(block).toMatch(/Custom quote\.\s*Most projects begin at/);
    expect(block).toMatch(/CORRECTIVE_ACTION_IMPLEMENTATION\.amountFrom/);
  });
  test('Control System price line shows canonical $4,500', () => {
    expect(src).toMatch(/data-testid="control-system-price-line"[\s\S]{0,200}SAFETY_CONTROL_SYSTEM_BUILDOUT\.displayPrice/);
  });
  test('Ongoing Safety Support shows canonical $1,850/mo', () => {
    expect(src).toMatch(/data-testid="ongoing-price-line"[\s\S]{0,200}ONGOING_SAFETY_SUPPORT\.displayPrice/);
  });
  test('CRV savings line uses shared COMBINED_SAVINGS constant', () => {
    const idx = src.indexOf('data-testid="crv-savings-line"');
    expect(idx).toBeGreaterThan(-1);
    expect(src.slice(idx, idx + 300)).toMatch(/\{COMBINED_SAVINGS\}/);
  });
  test('no residual $1,650 anywhere in the page source', () => {
    expect(src).not.toMatch(/\$?1[,]?650/);
  });
});

describe('Services · CRV recommended and separation of implementation', () => {
  test('CRV card carries visible "recommended starting point" badge', () => {
    const idx = src.indexOf('data-testid="crv-recommended-badge"');
    expect(idx).toBeGreaterThan(-1);
    expect(src.slice(idx, idx + 400)).toMatch(/Recommended starting point/i);
  });
  test('CRV feature clarifies that corrective implementation is NOT included', () => {
    const idx = src.indexOf('data-testid="crv-implementation-clarification"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 600);
    expect(block).toMatch(/identifies and prioritizes gaps/);
    expect(block).toMatch(/separate written scope/);
  });
  test('Corrective Action Implementation uses separate-scope language', () => {
    expect(src).toMatch(/separately scope selected corrective-action work/);
    expect(src).toMatch(/separate proposal for the selected corrective actions/);
  });
});

describe('Services · CTA hierarchy and destinations', () => {
  // Some CTAs render through the secCta helper: `secCta('Label', '/path', 'testid')`.
  // Others render as an inline `<Link to="/path" data-testid="testid">`.
  // The assertion verifies that the (destination, testid) pair appears in the
  // page source with the testid string within 1kB of the destination string.
  const destMap = {
    'services-hero-cta-primary': '/intake?service=compliance-readiness-visit',
    'crv-primary-cta': '/intake?service=compliance-readiness-visit',
    'services-final-cta-primary': '/intake?service=compliance-readiness-visit',
    'cai-cta': '/intake?service=corrective-action-implementation',
    'control-system-cta': '/services/safety-control-system-buildout',
    'ongoing-cta': '/ongoing-safety-support',
    'kits-all-cta': '/citation-proof-kits',
    'services-about-link': '/about',
    'services-rec-entry-secondary-link': '/contact',
    'service-card-walkthrough-cta': '/services/safety-walkthrough-report',
    'service-card-docreview-cta': '/services/documentation-readiness-review',
  };
  test.each(Object.entries(destMap))('%s links to %s', (id, dest) => {
    const idxId = src.indexOf(id);
    expect(idxId).toBeGreaterThan(-1);
    // Look in a 1.5kB window around the testid to find the destination.
    const start = Math.max(0, idxId - 800);
    const window = src.slice(start, idxId + 800);
    expect(window).toContain(dest);
  });
});

describe('Services · Recommendation gating and founder credential', () => {
  test('exactly one rec-entry-section on the page', () => {
    const hits = (src.match(/data-testid="services-rec-entry-section"/g) || []).length;
    expect(hits).toBe(1);
  });
  test('RECOMMENDATION_ROUTER_ENABLED gates the CTA branch', () => {
    expect(src).toMatch(/RECOMMENDATION_ROUTER_ENABLED\s*\?/);
    expect(src).toMatch(/Find My Starting Point/);
    expect(src).toMatch(/Compare the Three Reviews/);
  });
  test('founder credential uses the exact approved wording', () => {
    const idx = src.indexOf('data-testid="services-founder-credential"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 500);
    expect(block).toMatch(/OSHA 30-Hour General Industry Trained/);
    expect(block).not.toMatch(/OSHA[\s-]*certified/i);
    expect(block).not.toMatch(/OSHA[\s-]*approved consultant/i);
    expect(block).not.toMatch(/OSHA representative/i);
  });
});

describe('Services · Structural guarantees', () => {
  test('exactly 15 major sections before the footer', () => {
    const secs = src.match(/data-testid="services-[a-z-]+-section"/g) || [];
    // 15 sections in order: hero, framework, diagnostic, crv-feature, comparison,
    // after, cai, control-system, ongoing, kits, paths, rec-entry, faq, founder,
    // final-cta.
    expect(secs.length).toBe(15);
  });
  test('exactly one h1 on the page', () => {
    const h1 = src.match(/<h1[\s>]/g) || [];
    expect(h1.length).toBe(1);
  });
  test('no unreleased kit or waitlist product carries a purchase CTA', () => {
    expect(src).not.toMatch(/incident-to-correction/);
    expect(src).not.toMatch(/new-hire-orientation/);
  });
  test('kit strip pulls only released kits from KIT_CATALOG', () => {
    expect(src).toMatch(/releasedFeaturedKits\s*=\s*KIT_CATALOG\.filter/);
    expect(src).toMatch(/!k\.hiddenFromCatalog\s*&&\s*k\.ready/);
  });
  test('no guarantee-of-compliance language', () => {
    expect(src).not.toMatch(/OSHA[\s-]*proof/i);
    expect(src).not.toMatch(/Citation[\s-]*Proof/);
    expect(src).not.toMatch(/fully compliant/i);
    expect(src).not.toMatch(/guarantees?\s+OSHA\s+compliance(?!\?)/i);
  });
});
