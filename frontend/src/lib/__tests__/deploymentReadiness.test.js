/**
 * Deployment-readiness regression suite.
 *
 * Locks in three fixes applied before the production-bound cut:
 *
 *   1. City-page pricing: every /safety-walkthrough/<city> SSR page must
 *      inherit the canonical Safety Walkthrough price from servicePricing.js.
 *      No hardcoded per-city price. No "$1,200" or "$2,100" copy or Offer.
 *      Travel markets must qualify the price with "plus applicable travel fee".
 *   2. Kit series terminology in structured data: BreadcrumbList JSON-LD on
 *      the kit hub and every released kit detail page must display
 *      "GigLine Compliance Readiness Kits". No "Citation-Proof" language
 *      may appear in any customer-facing or SSR/JSON-LD context (route
 *      slugs are unchanged and internal code identifiers are exempt).
 *   3. /recommendation must emit robots="noindex, nofollow, noarchive".
 *      The SEO component's noindex behavior is shared, so we also confirm
 *      indexable pages are unaffected (they never render the robots meta
 *      at all).
 */
const fs = require('fs');
const path = require('path');

const REPO = path.join(__dirname, '..', '..', '..', '..');
const readRepo = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8');

const CITY_SLUGS = [
  'winston-salem', 'greensboro', 'high-point', 'charlotte', 'raleigh',
  'burlington', 'kernersville', 'lexington', 'thomasville', 'clemmons',
  'mocksville', 'salisbury', 'asheboro',
];
const TRAVEL_MARKETS = new Set(['salisbury', 'asheboro']);

// ─── 1. City-page pricing (SSR generator source) ───────────────────────────
describe('City landing pages inherit the canonical Safety Walkthrough price', () => {
  const gen = readRepo('frontend/scripts/generate-seo-pages.js');
  const pricing = readRepo('frontend/src/data/servicePricing.js');
  const canonicalMatch = pricing.match(/SAFETY_WALKTHROUGH\s*=\s*\{[^}]*?amount:\s*(\d+)/);
  const canonicalAmount = canonicalMatch ? parseInt(canonicalMatch[1], 10) : null;

  test('generator parses the canonical amount from servicePricing.js', () => {
    expect(canonicalAmount).toBe(1300);
    expect(gen).toMatch(/readCanonicalSafetyWalkthroughAmount/);
    expect(gen).toMatch(/SAFETY_WALKTHROUGH_AMOUNT/);
  });

  test('CITY_META no longer carries a hardcoded per-city price', () => {
    // Extract just the CITY_META block for isolated inspection.
    const block = gen.match(/const CITY_META = \{[\s\S]*?\n\};/);
    expect(block).not.toBeNull();
    expect(block[0]).not.toMatch(/price:\s*\d+/);
    expect(block[0]).not.toMatch(/priceTop/);
  });

  test('generator never emits the stale $1,200 or $2,100 upper bound', () => {
    // Guard against the exact prior copy patterns.
    expect(gen).not.toMatch(/\$1,200/);
    expect(gen).not.toMatch(/\$2,100/);
    expect(gen).not.toMatch(/priceTop\s*=\s*2100/);
    expect(gen).not.toMatch(/priceRangeLabel/);
  });

  test('generator produces "Starting at $1,300" for non-travel markets and adds travel-fee qualifier for travel markets', () => {
    expect(gen).toMatch(/Starting at \$\{SAFETY_WALKTHROUGH_DISPLAY\}/);
    expect(gen).toMatch(/plus applicable travel fee/);
    // Travel markets are the only cities that carry travelNote:true.
    const travelInMeta = [...gen.matchAll(/'([^']+)':\s*\{[^}]*travelNote:\s*true[^}]*\}/g)].map((m) => m[1]);
    expect(new Set(travelInMeta)).toEqual(TRAVEL_MARKETS);
  });

  test('every city slug is present in CITY_META', () => {
    for (const slug of CITY_SLUGS) {
      expect(gen).toMatch(new RegExp(`'${slug}':`));
    }
  });
});

// ─── 1b. City-page pricing (built SSR HTML output, only if a build exists) ─
describe('Built SSR HTML for city pages carries corrected pricing', () => {
  const BUILD_DIR = path.join(REPO, 'frontend', 'build');
  const hasBuild = fs.existsSync(path.join(BUILD_DIR, 'safety-walkthrough'));
  const readBuilt = (slug) => {
    const p = path.join(BUILD_DIR, 'safety-walkthrough', slug, 'index.html');
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
  };

  const maybeIt = hasBuild ? test : test.skip;

  maybeIt('all 13 city pages display "Starting at $1,300"', () => {
    for (const slug of CITY_SLUGS) {
      const html = readBuilt(slug);
      expect(html).not.toBeNull();
      expect(html).toMatch(/Starting at \$1,300/);
    }
  });

  maybeIt('travel-market city pages include the travel-fee qualifier', () => {
    for (const slug of TRAVEL_MARKETS) {
      const html = readBuilt(slug);
      expect(html).toMatch(/plus applicable travel fee/);
    }
  });

  maybeIt('no city page displays stale $1,200 or $2,100 copy', () => {
    for (const slug of CITY_SLUGS) {
      const html = readBuilt(slug);
      expect(html).not.toMatch(/\$1,200/);
      expect(html).not.toMatch(/\$2,100/);
    }
  });

  maybeIt('no city-page JSON-LD Offer carries price 1200 or 2100', () => {
    for (const slug of CITY_SLUGS) {
      const html = readBuilt(slug);
      expect(html).not.toMatch(/"price"\s*:\s*"?1200"?/);
      expect(html).not.toMatch(/"price"\s*:\s*"?2100"?/);
      expect(html).toMatch(/"price"\s*:\s*"1300"/);
    }
  });
});

// ─── 2. Kit series terminology in structured data + SSR body ───────────────
describe('Kit series terminology: "GigLine Compliance Readiness Kits"', () => {
  const gen = readRepo('frontend/scripts/generate-seo-pages.js');

  test('generator uses the approved series name in every breadcrumb', () => {
    // No Breadcrumb entry may carry the retired "Citation-Proof Kits" label.
    const breadcrumbCalls = [...gen.matchAll(/breadcrumb\(\[[\s\S]*?\]\)/g)].map((m) => m[0]);
    for (const call of breadcrumbCalls) {
      expect(call).not.toMatch(/Citation-Proof Kits/);
    }
    // Both the hub and detail breadcrumbs carry the new name.
    expect(gen).toMatch(/name:\s*'GigLine Compliance Readiness Kits',\s*path:\s*'\/citation-proof-kits'/);
  });

  test('no customer-facing SSR copy contains "Citation-Proof"', () => {
    // Strip only bare comments; brand text lives inline in template strings.
    const stripped = gen
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    expect(stripped).not.toMatch(/Citation-Proof/);
  });

  const BUILD_DIR = path.join(REPO, 'frontend', 'build');
  const hasBuild = fs.existsSync(path.join(BUILD_DIR, 'citation-proof-kits', 'index.html'));
  const maybeIt = hasBuild ? test : test.skip;

  maybeIt('built kit hub HTML has no Citation-Proof breadcrumb or body copy', () => {
    const html = fs.readFileSync(path.join(BUILD_DIR, 'citation-proof-kits', 'index.html'), 'utf8');
    expect(html).not.toMatch(/Citation-Proof/);
    expect(html).toMatch(/GigLine Compliance Readiness Kits/);
  });

  maybeIt('built released-kit detail pages carry the approved breadcrumb name', () => {
    const slugs = ['loto-readiness-kit', 'forklift-pit-readiness-kit', 'hazcom-pro-kit'];
    for (const slug of slugs) {
      const p = path.join(BUILD_DIR, 'citation-proof-kits', slug, 'index.html');
      if (!fs.existsSync(p)) continue;
      const html = fs.readFileSync(p, 'utf8');
      expect(html).not.toMatch(/Citation-Proof/);
      expect(html).toMatch(/GigLine Compliance Readiness Kits/);
    }
  });
});

// ─── 3. /recommendation robots meta ────────────────────────────────────────
describe('SEO robots directives', () => {
  const seo = readRepo('frontend/src/components/SEO.js');

  test('noindex emits the full directive: noindex, nofollow, noarchive', () => {
    expect(seo).toMatch(/name="robots"\s+content="noindex,\s*nofollow,\s*noarchive"/);
  });

  test('noindex is still gated on the noindex prop, so indexable pages remain unaffected', () => {
    // The robots meta is only rendered when the boolean prop is truthy.
    // If this line moves, add an equivalent regression here.
    expect(seo).toMatch(/\{noindex\s*&&\s*<meta name="robots"/);
  });

  test('/recommendation page passes the noindex prop', () => {
    const page = readRepo('frontend/src/pages/RecommendationRouterPage.js');
    // Assert both the SEO tag and the prop are present.
    expect(page).toMatch(/<SEO[\s\S]*?noindex[\s\S]*?\/>/);
  });

  test('indexable page samples do NOT pass noindex', () => {
    const samples = [
      'frontend/src/pages/HomePage.js',
      'frontend/src/pages/ServicesPage.js',
      'frontend/src/pages/AboutPage.js',
    ];
    for (const rel of samples) {
      const src = readRepo(rel);
      const seoTag = src.match(/<SEO[\s\S]*?\/>/);
      if (seoTag) {
        // Presence of noindex prop is what makes a page non-indexable.
        expect(seoTag[0]).not.toMatch(/\bnoindex\b/);
      }
    }
  });
});
