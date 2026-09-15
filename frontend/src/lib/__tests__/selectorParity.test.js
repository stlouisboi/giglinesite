/**
 * Phase 2 Batch 2B follow-up, selector parity regression suite.
 *
 * Fails the build if KitSelector on /citation-proof-kits and the shared
 * recommendationEngine behind /recommendation disagree on release status,
 * pricing, or the included/not-included content contract.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

const KIT_PRICES = require('../../data/servicePricing').KIT_PRICES;
const { getKitReleaseStatus } = require('../../data/citationProofKits');
const {
  editionIncluded,
  editionNotIncluded,
  KIT_REGISTRY,
} = require('../../data/recommendationEngine');

const SELECTOR_SLUGS = [
  'loto-readiness-kit',
  'forklift-pit-readiness-kit',
  'hazcom-pro-kit',
  'incident-to-correction-kit',
  'new-hire-orientation-kit',
];


describe('Release-status parity, KitSelector and recommendationEngine agree', () => {
  test.each(SELECTOR_SLUGS)('%s release status matches across both selectors', (slug) => {
    const shared = getKitReleaseStatus(slug);
    const registry = KIT_REGISTRY[slug];
    expect(registry).toBeDefined();
    expect(registry.ready).toBe(shared.ready);
  });

  test('LOTO, Forklift/PIT, HazCom Pro remain released; Incident + New-Hire remain unreleased', () => {
    expect(getKitReleaseStatus('loto-readiness-kit').ready).toBe(true);
    expect(getKitReleaseStatus('forklift-pit-readiness-kit').ready).toBe(true);
    expect(getKitReleaseStatus('hazcom-pro-kit').ready).toBe(true);
    expect(getKitReleaseStatus('incident-to-correction-kit').ready).toBe(false);
    expect(getKitReleaseStatus('new-hire-orientation-kit').ready).toBe(false);
  });
});

describe('Price parity, KitSelector reads from KIT_PRICES', () => {
  const src = read('components/KitSelector.js');
  test('KitSelector imports KIT_PRICES from servicePricing', () => {
    expect(src).toMatch(/import\s*\{[^}]*KIT_PRICES[^}]*\}\s*from\s*['"]\.\.\/data\/servicePricing['"]/);
  });
  test('KitSelector does not carry inline $150 / $300 / $600 price strings', () => {
    expect(src).not.toMatch(/price:\s*['"]\$150['"]/);
    expect(src).not.toMatch(/price:\s*['"]\$300['"]/);
    expect(src).not.toMatch(/price:\s*['"]\$600['"]/);
  });
  test('KitSelector edition price map references KIT_PRICES lookups', () => {
    expect(src).toMatch(/KIT_PRICES\.digital\.displayPrice/);
    expect(src).toMatch(/KIT_PRICES\.controlSystem\.displayPrice/);
    expect(src).toMatch(/KIT_PRICES\.binder\.displayPrice/);
  });
  test('KIT_PRICES itself carries the expected display strings', () => {
    expect(KIT_PRICES.digital.displayPrice).toBe('$150');
    expect(KIT_PRICES.controlSystem.displayPrice).toBe('$300');
    expect(KIT_PRICES.binder.displayPrice).toBe('$600');
  });
});

describe('Coming-soon presentation, no purchase CTA or purchasable price', () => {
  const src = read('components/KitSelector.js');
  test('KitSelector no longer reads a local kit.released boolean', () => {
    expect(src).not.toMatch(/kit\.released/);
    expect(src).not.toMatch(/released:\s*true/);
    expect(src).not.toMatch(/released:\s*false/);
  });
  test('Kit result renders a "Not released" badge for unreleased kits', () => {
    expect(src).toMatch(/data-testid="kit-selector-result-coming-soon-badge"/);
    expect(src).toMatch(/Not released/);
  });
  test('Unreleased path exposes a "Not currently available" price marker, not a $ price', () => {
    expect(src).toMatch(/data-testid="kit-selector-result-price-unavailable"/);
    expect(src).toMatch(/Not currently available/);
  });
  test('Unreleased primary CTA is a waitlist join, not a purchase-styled CTA', () => {
    expect(src).toMatch(/data-action-kind="waitlist"/);
    expect(src).toMatch(/Join the \{kit\.shortName \|\| 'Kit'\} waitlist/);
  });
  test('Released primary CTA remains data-action-kind=kit with the review path', () => {
    expect(src).toMatch(/data-action-kind="kit"/);
    expect(src).toMatch(/Review the \{kit\.shortName \|\| 'Kit'\}/);
  });
  test('Unreleased path offers CRV as the currently available service alternative, not a released kit', () => {
    expect(src).toMatch(/data-testid="kit-selector-result-service-alternative"/);
    expect(src).toMatch(/compliance-readiness-visit/);
    // The alternative block must NOT recommend LOTO / PIT / HazCom Pro
    // as a substitute for a coming-soon kit.
    const altBlock = src.match(/data-testid="kit-selector-result-service-alternative"[\s\S]{0,600}/);
    expect(altBlock).toBeTruthy();
    expect(altBlock[0]).not.toMatch(/loto-readiness-kit/);
    expect(altBlock[0]).not.toMatch(/forklift-pit-readiness-kit/);
    expect(altBlock[0]).not.toMatch(/hazcom-pro-kit/);
  });
});

describe('Included / Not-included content, shared source', () => {
  const src = read('components/KitSelector.js');
  test('KitSelector imports editionIncluded and editionNotIncluded from recommendationEngine', () => {
    expect(src).toMatch(/import\s*\{[^}]*editionIncluded[^}]*editionNotIncluded[^}]*\}\s*from\s*['"]\.\.\/data\/recommendationEngine['"]/);
  });
  test('Kit result surfaces both included and not-included blocks with stable testids', () => {
    expect(src).toMatch(/data-testid="kit-selector-result-included"/);
    expect(src).toMatch(/data-testid="kit-selector-result-not-included"/);
  });
  test('editionIncluded / editionNotIncluded return non-empty arrays for every edition', () => {
    for (const ed of ['digital', 'controlSystem', 'binder']) {
      expect(editionIncluded(ed).length).toBeGreaterThan(0);
      expect(editionNotIncluded(ed).length).toBeGreaterThan(0);
    }
  });
  test('editionIncluded strings are identical for both selectors (source of truth)', () => {
    // Because the router imports the SAME editionIncluded function, and the
    // selector now imports it too, any content change automatically flows
    // to both. Guard the strings by re-asserting the digital baseline.
    expect(editionIncluded('digital')).toEqual([
      'All required documents for the control area',
      'Implementation guidance and completion checklists',
      'Instant digital delivery',
    ]);
  });
});

describe('Checkout status remains disabled for Incident + New-Hire (backend)', () => {
  const config = fs.readFileSync(path.join(SRC, '..', '..', 'backend', 'routes', 'citation_proof_kits.py'), 'utf8');
  test('backend UNAVAILABLE_KIT_SLUGS still contains both unreleased kits', () => {
    expect(config).toMatch(/UNAVAILABLE_KIT_SLUGS[\s\S]{0,200}incident-to-correction-kit/);
    expect(config).toMatch(/UNAVAILABLE_KIT_SLUGS[\s\S]{0,200}new-hire-orientation-kit/);
  });
  test('backend refuses checkout on unreleased slugs with HTTP 410', () => {
    expect(config).toMatch(/status_code=410/);
  });
});

describe('Recommendation paths remain unchanged (guardrails)', () => {
  const engine = read('data/recommendationEngine.js');
  test('KIT_REGISTRY still lists all six kit slugs', () => {
    for (const s of SELECTOR_SLUGS.concat(['hazcom-starter-pack'])) {
      expect(engine).toMatch(new RegExp(`'${s}'`));
    }
  });
  test('Existing coming-soon result kind still returns waitlist primary action', () => {
    expect(engine).toMatch(/RESULT_KIND\.KIT_COMING_SOON/);
    expect(engine).toMatch(/kind:\s*'waitlist'/);
  });
});
