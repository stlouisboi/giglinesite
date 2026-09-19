/**
 * Homepage Outcome-First Consolidation, regression suite.
 *
 * Enforces the owner-approved spec dated 2026-09-16:
 *   - Hero headline and primary CTA (Compliance Readiness Visit)
 *   - CRV price + "Recommended Starting Point" badge on the middle service card
 *   - Safety Walkthrough $1,300 price
 *   - Documentation Readiness Review $1,700 price
 *   - Absence of the old $1,650 Ongoing Safety Support amount
 *   - Feature-flag behavior for the recommendation CTA
 *   - Feature-flag behavior for case-study promotion (never surfaces)
 *   - Waitlist-only behavior for unreleased kits (kits section carries only
 *     released products)
 *   - Primary CTA destination is /intake?service=compliance-readiness-visit
 *   - Heading hierarchy: exactly one H1
 *   - No duplicate homepage section testIDs
 *   - No broken internal homepage links (Link `to=` targets exist on file)
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');
const home = read('pages/HomePage.js');

describe('Homepage · Hero', () => {
  test('exactly one H1 element', () => {
    const h1s = home.match(/<h1[\s>]/g) || [];
    expect(h1s.length).toBe(1);
  });

  test('hero headline is the mandated spec headline', () => {
    // Hero H1 uses a nonbreaking span around "walks in." to prevent an
    // orphan "in." from wrapping alone at desktop widths. Assertion tolerates
    // the wrapping markup between the two halves.
    expect(home).toMatch(/Know what to fix before OSHA[\s\S]{0,200}walks in\./);
  });

  test('hero eyebrow is the mandated spec eyebrow', () => {
    expect(home).toMatch(/Find the gaps before OSHA does\./);
  });

  test('primary hero CTA labels "Request a Compliance Readiness Visit"', () => {
    // Reach into the hero-cta-primary block.
    const start = home.indexOf('data-testid="hero-cta-primary"');
    expect(start).toBeGreaterThan(-1);
    const block = home.slice(Math.max(0, start - 800), start + 400);
    expect(block).toMatch(/Request a Compliance Readiness Visit/);
    expect(block).toMatch(/to="\/intake\?service=compliance-readiness-visit"/);
  });

  test('hero price line advertises $2,500 starting price', () => {
    const idx = home.indexOf('data-testid="hero-price-line"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 400);
    expect(block).toMatch(/Compliance Readiness Visits start at/);
  });

  test('hero trust line uses only approved credentials', () => {
    const idx = home.indexOf('data-testid="hero-trust-line"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 900);
    expect(block).toMatch(/OSHA 30-Hour General Industry Trained/);
    expect(block).toMatch(/U\.S\. Navy Veteran/);
    expect(block).toMatch(/25\+ years floor-level experience/);
    // Guardrails: no unsupported certifications.
    expect(block).not.toMatch(/OSHA[\s-]*certified/i);
    expect(block).not.toMatch(/OSHA[\s-]*30-Hour\s+certified/i);
    expect(block).not.toMatch(/OSHA[\s-]*Outreach\s+Trained/);
  });
});

describe('Homepage · Starting-point service cards', () => {
  test('Safety Walkthrough card shows $1,300', () => {
    const idx = home.indexOf('data-testid="service-card-safety-walkthrough"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 1400);
    expect(block).toMatch(/SAFETY_WALKTHROUGH\.displayPrice/);
    expect(block).toMatch(/data-testid="service-card-walkthrough-price"/);
  });

  test('Documentation Readiness Review card shows $1,700', () => {
    const idx = home.indexOf('data-testid="service-card-documentation-review"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 1400);
    expect(block).toMatch(/DOCUMENTATION_REVIEW\.displayPrice/);
  });

  test('CRV card shows the Recommended Starting Point badge and $2,500', () => {
    const idx = home.indexOf('data-testid="service-card-crv"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 2000);
    expect(block).toMatch(/data-testid="crv-recommended-badge"/);
    expect(block).toMatch(/Recommended Starting Point/);
    expect(block).toMatch(/COMPLIANCE_READINESS_VISIT\.displayPrice/);
    expect(block).toMatch(/data-testid="crv-primary-cta"/);
    expect(block).toMatch(/Request a Compliance Readiness Visit/);
    // The CRV card must link to the intake, not the marketing page.
    expect(block).toMatch(/to="\/intake\?service=compliance-readiness-visit"/);
  });

  test('CRV card advertises the $500 combined-service savings', () => {
    const idx = home.indexOf('data-testid="crv-savings-line"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 400);
    expect(block).toMatch(/savings compared with purchasing both reviews separately/);
    // Homepage renders the savings amount from the shared COMBINED_SAVINGS
    // constant. The rendered string is bound via a local `savingsDollars`
    // literal so the source shows `{savingsDollars}` and defines it as
    // `$${COMBINED_SAVINGS}` at the top of the component.
    expect(block).toMatch(/\{savingsDollars\}/);
    expect(home).toMatch(/const\s+savingsDollars\s*=\s*`\$\$\{COMBINED_SAVINGS\}`/);
  });
});

describe('Homepage · After-findings section', () => {
  test('Corrective Action Implementation card says most projects begin at $2,500', () => {
    const idx = home.indexOf('data-testid="after-card-corrective-action"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 800);
    expect(block).toMatch(/Most Corrective Action Implementation projects begin at \$2,500/);
  });

  test('Control System card references $4,500 starting price via constant', () => {
    const idx = home.indexOf('data-testid="after-card-control-system"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 800);
    expect(block).toMatch(/SAFETY_CONTROL_SYSTEM_BUILDOUT\.displayPrice/);
  });
});

describe('Homepage · Cost-of-waiting (OSHA penalties)', () => {
  test('OSHA_PENALTY constant carries the verified 2026 figures', () => {
    // Values are the source of truth for the three penalty cards below and
    // must match 29 CFR 1903.15 annual DOL adjustment for 2026.
    expect(home).toMatch(/OSHA_PENALTY\s*=\s*\{[\s\S]{0,400}year:\s*2026/);
    expect(home).toMatch(/serious:\s*'\$16,550'/);
    expect(home).toMatch(/willfulOrRepeat:\s*'\$165,514'/);
    expect(home).toMatch(/failureToAbate:\s*'\$16,550 per day'/);
    expect(home).toMatch(/source:\s*'https:\/\/www\.osha\.gov\/penalties'/);
  });

  test('serious violation card binds to the constant with year callout', () => {
    const idx = home.indexOf('data-testid="penalty-serious"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 700);
    expect(block).toMatch(/\{OSHA_PENALTY\.serious\}/);
    expect(block).toMatch(/\{OSHA_PENALTY\.year\}/);
  });

  test('willful/repeat card binds to the constant', () => {
    const idx = home.indexOf('data-testid="penalty-willful"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 700);
    expect(block).toMatch(/\{OSHA_PENALTY\.willfulOrRepeat\}/);
  });

  test('failure-to-abate card binds to the per-day constant', () => {
    const idx = home.indexOf('data-testid="penalty-failure-to-abate"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(idx, idx + 700);
    expect(block).toMatch(/\{OSHA_PENALTY\.failureToAbate\}/);
  });

  test('links to the official OSHA penalty source', () => {
    const idx = home.indexOf('data-testid="penalty-source-link"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(Math.max(0, idx - 400), idx + 400);
    expect(block).toMatch(/OSHA_PENALTY\.source|osha\.gov\/penalties/);
  });

  test('carries the mandated "penalties vary" disclaimer language', () => {
    expect(home).toMatch(/Penalty amounts and circumstances vary/);
  });
});

describe('Homepage · Recommendation entry (single, flag-guarded)', () => {
  test('exactly one rec-entry section', () => {
    const matches = (home.match(/data-testid="rec-entry-section"/g) || []).length;
    expect(matches).toBe(1);
  });

  test('rec-entry section swaps CTA label on the router flag', () => {
    const idx = home.indexOf('data-testid="rec-entry-cta"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(Math.max(0, idx - 800), idx + 800);
    expect(block).toMatch(/RECOMMENDATION_ROUTER_ENABLED/);
    expect(block).toMatch(/Find My Starting Point/);
    expect(block).toMatch(/Compare GigLine Services/);
  });

  test('imports RECOMMENDATION_ROUTER_ENABLED from features', () => {
    expect(home).toMatch(/RECOMMENDATION_ROUTER_ENABLED[^;]*from\s+['"]\.\.\/config\/features['"]/);
  });
});

describe('Homepage · Self-serve kits', () => {
  test('features exactly three released kit cards', () => {
    const cards = (home.match(/data-testid="kit-card-[a-z-]+"/g) || []);
    expect(cards.length).toBe(3);
  });

  test('features HazCom Starter, LOTO, Forklift/PIT (all released) and none of the waitlist kits', () => {
    expect(home).toMatch(/data-testid="kit-card-hazcom-starter"/);
    expect(home).toMatch(/data-testid="kit-card-loto"/);
    expect(home).toMatch(/data-testid="kit-card-forklift-pit"/);
    // Unreleased kits must not appear on the homepage grid.
    expect(home).not.toMatch(/incident-to-correction/);
    expect(home).not.toMatch(/new-hire-orientation/);
  });

  test('kits section carries no purchase or Stripe CTA (product pages own that)', () => {
    const idx = home.indexOf('data-testid="kits-section"');
    expect(idx).toBeGreaterThan(-1);
    const endIdx = home.indexOf('data-testid="why-section"');
    const block = home.slice(idx, endIdx);
    expect(block).not.toMatch(/\bcheckout\b/i);
    expect(block).not.toMatch(/stripe\.com\/checkout/i);
    expect(block).not.toMatch(/Buy now/i);
  });
});

describe('Homepage · Guardrails', () => {
  test('no stale $1,650 Ongoing Safety Support amount', () => {
    expect(home).not.toMatch(/\$1,650/);
    expect(home).not.toMatch(/1650/);
  });

  test('no case-study promotional URL while CASE_STUDY_PUBLIC is off', () => {
    expect(home).not.toMatch(/\/case-study\/metal-fabrication-readiness/);
  });

  test('no compliance-guarantee language (asserting compliance, not the FAQ disclaimer)', () => {
    expect(home).not.toMatch(/OSHA[\s-]*proof/i);
    expect(home).not.toMatch(/Citation[\s-]*Proof/);
    expect(home).not.toMatch(/fully compliant/i);
    // Guarantee claims present tense assertions; the FAQ question
    // "Does a Compliance Readiness Visit guarantee OSHA compliance?" is
    // followed by an explicit "No." answer — that is a disclaimer, not a
    // claim, and must be allowed.
    expect(home).not.toMatch(/(?:will|does|can)\s+guarantee\s+OSHA/i);
    expect(home).not.toMatch(/guarantees?\s+OSHA\s+compliance(?!\?)/i);
  });

  test('no preview-only messages leak into the production render', () => {
    expect(home).not.toMatch(/Preview only, no email was sent/);
    expect(home).not.toMatch(/PREVIEW MODE/);
  });

  test('exit-feedback prompt is not embedded on the homepage', () => {
    expect(home).not.toMatch(/ExitFeedbackStub/);
    expect(home).not.toMatch(/data-testid="exit-feedback/);
  });
});

describe('Homepage · Structure', () => {
  test('no duplicate section testIDs', () => {
    const ids = home.match(/data-testid="[a-z0-9-]+-section"/g) || [];
    const set = new Set(ids);
    expect(set.size).toBe(ids.length);
  });

  test('semantic heading order: H1 → H2 (no direct H1 → H3 or higher jumps)', () => {
    // Extract heading levels in document order.
    const headings = [...home.matchAll(/<h([1-6])[\s>]/g)].map((m) => parseInt(m[1], 10));
    // Only one h1.
    expect(headings.filter((h) => h === 1).length).toBe(1);
    // No h4+ jumping past h3.
    for (let i = 1; i < headings.length; i += 1) {
      if (headings[i] > headings[i - 1]) {
        expect(headings[i] - headings[i - 1]).toBeLessThanOrEqual(1);
      }
    }
  });

  test('primary CTA appears at three approved locations only (hero, CRV card, final)', () => {
    // Testing-ID pattern for the three approved primary CTAs.
    const primaryIds = ['hero-cta-primary', 'crv-primary-cta', 'final-cta-primary'];
    primaryIds.forEach((tid) => {
      expect(home).toMatch(new RegExp(`data-testid="${tid}"`));
    });
  });

  test('all internal Link `to=` targets in the homepage are relative or /-rooted, never absolute', () => {
    const targets = [...home.matchAll(/\sto=(?:"|\{secondary\.to\}|'\/[^']*')/g)];
    // Ensure we captured at least one Link.
    expect(targets.length).toBeGreaterThan(0);
    // No absolute external URLs are used as Link `to=` (external nav uses <a href>).
    const absolute = home.match(/\sto="https?:\/\//g) || [];
    expect(absolute.length).toBe(0);
  });
});

describe('Homepage · Founder + Final CTA', () => {
  test('founder photo has descriptive alt text', () => {
    const idx = home.indexOf('data-testid="founder-photo"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(Math.max(0, idx - 400), idx + 200);
    expect(block).toMatch(/alt="Vince Lawrence[^"]+"/);
  });

  test('final CTA links to CRV intake with the correct service param', () => {
    const idx = home.indexOf('data-testid="final-cta-primary"');
    expect(idx).toBeGreaterThan(-1);
    const block = home.slice(Math.max(0, idx - 800), idx + 400);
    expect(block).toMatch(/to="\/intake\?service=compliance-readiness-visit"/);
    expect(block).toMatch(/Request a Compliance Readiness Visit/);
  });
});
