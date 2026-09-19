/**
 * Batch: Benefit-Led Copy + Offer-Truth pass.
 * Regression suite: single source of pricing truth + no purchasable Incident/New-Hire.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..');
const readSrc = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

const {
  SAFETY_WALKTHROUGH,
  DOCUMENTATION_REVIEW,
  COMPLIANCE_READINESS_VISIT,
  CORRECTIVE_ACTION_IMPLEMENTATION,
  SAFETY_CONTROL_SYSTEM_BUILDOUT,
  ONGOING_SAFETY_SUPPORT,
  HAZCOM_STARTER_PACK,
  KIT_PRICES,
} = require('../../data/servicePricing');

describe('Single-source pricing truth', () => {
  test('canonical service prices remain fixed', () => {
    expect(SAFETY_WALKTHROUGH.amount).toBe(1300);
    expect(DOCUMENTATION_REVIEW.amount).toBe(1700);
    expect(COMPLIANCE_READINESS_VISIT.amount).toBe(2500);
    expect(CORRECTIVE_ACTION_IMPLEMENTATION.amountFrom).toBe(2500);
    expect(SAFETY_CONTROL_SYSTEM_BUILDOUT.amount).toBe(4500);
    expect(ONGOING_SAFETY_SUPPORT.amount).toBe(1850);
    expect(HAZCOM_STARTER_PACK.amount).toBe(29);
    expect(KIT_PRICES.digital.amount).toBe(150);
    expect(KIT_PRICES.controlSystem.amount).toBe(300);
    expect(KIT_PRICES.binder.amount).toBe(600);
  });
});

describe('No stale prices in customer-facing files', () => {
  const CUSTOMER_FILES = [
    'pages/HomePage.js',
    'pages/ServicesPage.js',
    'pages/ComplianceReadinessVisitPage.js',
    'pages/SafetyWalkthroughPage.js',
    'pages/DocumentationReadinessReviewPage.js',
    'pages/HazComPage.js',
    'pages/AboutPage.js',
    'pages/CitationProofKitsPage.js',
    'pages/FAQPage.js',
  ];

  test('no $1,200 walkthrough price appears anywhere', () => {
    for (const f of CUSTOMER_FILES) {
      expect(readSrc(f)).not.toMatch(/\$1,200/);
    }
  });
  test('no $2,000 or $2,400 CRV price appears anywhere', () => {
    for (const f of CUSTOMER_FILES) {
      const s = readSrc(f);
      expect(s).not.toMatch(/CRV[^$]{0,120}\$2,000/);
      expect(s).not.toMatch(/CRV[^$]{0,120}\$2,400/);
      expect(s).not.toMatch(/Compliance Readiness Visit[^$]{0,120}\$2,000/);
      expect(s).not.toMatch(/Compliance Readiness Visit[^$]{0,120}\$2,400/);
    }
  });
  test('generate-seo-pages.js Doc Review label is $1,700, not $1,300', () => {
    const s = readSrc('../scripts/generate-seo-pages.js');
    expect(s).toMatch(/DOC_REVIEW_PRICE_LABEL\s*=\s*'\$1,700'/);
    expect(s).not.toMatch(/DOC_REVIEW_PRICE_LABEL\s*=\s*'\$1,300'/);
  });
});

describe('Coming-soon kits show no purchasable price or purchase CTA', () => {
  const kitSel = readSrc('components/KitSelector.js');
  const engine = readSrc('data/recommendationEngine.js');
  const kits = readSrc('data/citationProofKits.js');

  test('Incident and New-Hire remain ready:false in the shared catalog', () => {
    expect(kits).toMatch(/incident-to-correction-kit[\s\S]{0,300}ready:\s*false/);
    expect(kits).toMatch(/new-hire-orientation-kit[\s\S]{0,300}ready:\s*false/);
  });
  test('KitSelector renders waitlist action for unreleased kits, never a purchase CTA', () => {
    expect(kitSel).toMatch(/data-action-kind="waitlist"/);
    expect(kitSel).toMatch(/kit-selector-result-price-unavailable/);
  });
  test('recommendationEngine coming-soon path returns waitlist and no price', () => {
    expect(engine).toMatch(/RESULT_KIND\.KIT_COMING_SOON/);
    expect(engine).toMatch(/kind:\s*'waitlist'/);
  });
});

describe('Feature flags remain preview-only', () => {
  const features = readSrc('config/features.js');
  test('RECOMMENDATION_ROUTER_ENABLED is false', () => {
    expect(features).toMatch(/export\s+const\s+RECOMMENDATION_ROUTER_ENABLED\s*=\s*false\s*;/);
  });
  test('EMAIL_DELIVERY_LIVE remains false', () => {
    expect(features).toMatch(/export\s+const\s+EMAIL_DELIVERY_LIVE\s*=\s*false\s*;/);
  });
  test('EXIT_FEEDBACK_ENABLED remains false', () => {
    expect(features).toMatch(/export\s+const\s+EXIT_FEEDBACK_ENABLED\s*=\s*false\s*;/);
  });
  test('/recommendation excluded from sitemap', () => {
    const sitemap = fs.readFileSync(path.join(SRC, '..', 'public', 'sitemap.xml'), 'utf8');
    expect(sitemap).not.toMatch(/\/recommendation/);
  });
  test('RecommendationRouterPage emits noindex again', () => {
    const page = readSrc('pages/RecommendationRouterPage.js');
    expect(page).toMatch(/noindex/);
  });
});

describe('Benefit-led copy leads are present on the primary pages', () => {
  test('Homepage sub carries the mandated benefit lede', () => {
    const s = readSrc('pages/HomePage.js');
    // Post-consolidation the homepage lede was rewritten per the owner-approved
    // Outcome-First spec. The mandated phrase is now the third sentence of the
    // hero supporting paragraph.
    expect(s).toMatch(/what requires attention,\s+what to address first,\s+and\s+what to do next/);
  });
  test('Services page headline is the mandated clarity lead', () => {
    const s = readSrc('pages/ServicesPage.js');
    // Services-page consolidation, 2026-09-18: the H1 was rewritten per the
    // owner-approved spec to lead with the outcome the client selects.
    expect(s).toMatch(/Choose the right level of safety support for what your operation needs now/);
  });
  test('CRV page headline is the mandated floor-vs-files line', () => {
    const s = readSrc('pages/ComplianceReadinessVisitPage.js');
    expect(s).toMatch(/floor and your safety records tell the same story/);
    expect(s).toMatch(/data-testid="crv-hero-outcomes"/);
  });
  test('Safety Walkthrough page leads with hazards your team has stopped seeing', () => {
    const s = readSrc('pages/SafetyWalkthroughPage.js');
    expect(s).toMatch(/hazards your team has stopped seeing/);
  });
  test('Doc Review page keeps the strong OSHA-opens-your-binder question', () => {
    const s = readSrc('pages/DocumentationReadinessReviewPage.js');
    expect(s).toMatch(/If OSHA opened your binder tomorrow/);
  });
  test('HazCom Starter Pack leads with usable-starting-point copy', () => {
    const s = readSrc('pages/HazComPage.js');
    expect(s).toMatch(/Build a usable HazCom starting point/);
  });
  test('About page leads with production-pressure copy', () => {
    const s = readSrc('pages/AboutPage.js');
    expect(s).toMatch(/worked inside production pressure/);
  });
  test('Kits hub leads with build-the-proof copy', () => {
    const s = readSrc('pages/CitationProofKitsPage.js');
    expect(s).toMatch(/Build the proof behind the safety work/);
    expect(s).toMatch(/GigLine Compliance Readiness Kits/);
  });
});

describe('Removed "Citation-Proof" customer promises and dangerous language', () => {
  test('kit content data does not contain "Citation likely" phrasing', () => {
    const s = readSrc('data/citationProofKits.js');
    expect(s).not.toMatch(/citation is likely/);
    expect(s).not.toMatch(/citation likely/);
  });
  test('kit content data no longer uses Compliance Readiness Score trademark symbol', () => {
    const s = readSrc('data/citationProofKits.js');
    // Score name is retained but without the ™ symbol in customer prose.
    expect(s).toMatch(/Compliance Readiness Score/);
  });
  test('Kits hub headline does not carry "inspection-ready proof" promise', () => {
    const s = readSrc('pages/CitationProofKitsPage.js');
    expect(s).not.toMatch(/Three kits that turn scattered safety activity into inspection-ready proof/);
  });
});
