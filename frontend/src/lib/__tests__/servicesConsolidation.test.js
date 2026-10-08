/**
 * Services Page Rebuild, regression suite (2026-02 refresh).
 *
 * Enforces the owner-approved Feb 2026 rebuild spec:
 *   1. Result-focused hero copy + three CTAs + clickable phone
 *   2. Credibility strip with Vince photo, "OSHA 30-Hour General Industry Trained"
 *      credential, and sample-report preview card
 *   3. Featured CRV section with the owner-approved deliverables list and
 *      the "corrective implementation separately quoted" clarification
 *   4. Three-review comparison with "Best for" lines + turnaround row
 *   5. "What happens after submitting a request" section with the no-commit note
 *   6. CAI / Control System / Ongoing cards with separate-scope language
 *   7. Compact self-serve kits
 *   8. FAQ + final CTA with Talk-to-Vince anchor
 * Also pins: pricing matrix sourced from servicePricing constants, no
 * guarantee-of-compliance claims, no residual $1,650 price, no public
 * recommendation-router entry card on this page.
 */
const fs = require('fs');
const path = require('path');
const REPO = path.join(__dirname, '..', '..', '..', '..');
const readRepo = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8');
const src = readRepo('frontend/src/pages/ServicesPage.js');

describe('Services · Hero copy and CTAs', () => {
  test('result-focused headline is present and verbatim', () => {
    const idx = src.indexOf('data-testid="services-hero-h1"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 400);
    expect(block).toMatch(/Know what needs attention\. Know what to fix first\./);
  });
  test('supporting copy mentions workplace conditions and documentation gaps', () => {
    const idx = src.indexOf('data-testid="services-hero-sub"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 500);
    expect(block).toMatch(/reviews your workplace conditions and safety documentation/);
    expect(block).toMatch(/see the gaps, set priorities/);
  });
  test('audience line names Piedmont Triad verticals', () => {
    const idx = src.indexOf('data-testid="services-hero-audience"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 400);
    expect(block).toMatch(/manufacturers, warehouses, contractors, and fleet operations/);
    expect(block).toMatch(/Piedmont Triad/);
  });
  test('primary CTA requests the Compliance Readiness Visit and lands on /intake', () => {
    const idx = src.indexOf('data-testid="services-hero-cta-primary"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toContain('/intake?service=compliance-readiness-visit');
    expect(window).toMatch(/Request a Compliance Readiness Visit/);
  });
  test('secondary CTA points at the sample report', () => {
    const idx = src.indexOf('data-testid="services-hero-cta-secondary"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toContain('/sample-report');
    expect(window).toMatch(/See a Sample Report/);
  });
  test('Talk to Vince First CTA deep-links to #talk-to-vince on /intake', () => {
    // The hero CTA uses the shared TALK_TO_VINCE_HREF constant. Validate the
    // constant itself and the CTA presence rather than inlining the string in
    // every CTA, so the page can share one deep link everywhere.
    expect(src).toMatch(/const TALK_TO_VINCE_HREF\s*=\s*['"]\/intake\?service=compliance-readiness-visit#talk-to-vince['"]/);
    const idx = src.indexOf('data-testid="services-hero-cta-talk"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 1200), idx + 400);
    expect(window).toMatch(/TALK_TO_VINCE_HREF/);
    expect(window).toMatch(/Talk to Vince First/);
  });
  test('price reassurance line uses canonical CRV price and "confirmed in writing" wording', () => {
    const idx = src.indexOf('data-testid="services-hero-price-line"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 500);
    expect(block).toMatch(/COMPLIANCE_READINESS_VISIT\.displayPrice/);
    expect(block).toMatch(/confirmed in writing before scheduling/);
  });
  test('phone number is clickable and uses tel:+13363298899', () => {
    // The phone number is referenced via the shared PHONE_HREF constant.
    expect(src).toMatch(/const PHONE_HREF\s*=\s*['"]tel:\+13363298899['"]/);
    expect(src).toMatch(/const PHONE_DISPLAY\s*=\s*['"]\(336\) 329-8899['"]/);
    const idx = src.indexOf('data-testid="services-hero-phone-link"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toMatch(/href=\{PHONE_HREF\}/);
  });
});

describe('Services · Credibility strip', () => {
  test('Vince founder photo renders in the credibility section', () => {
    const idx = src.indexOf('data-testid="services-credibility-photo"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toMatch(/\/vince-founder\.webp/);
  });
  test('credential line uses the approved OSHA 30-Hour General Industry Trained wording', () => {
    const idx = src.indexOf('data-testid="services-credibility-credential"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 500);
    expect(block).toMatch(/OSHA 30-Hour General Industry Trained/);
    expect(block).not.toMatch(/OSHA 30-Hour Outreach Trained/);
    expect(block).not.toMatch(/OSHA[\s-]*certified/i);
  });
  test('sample report preview card links to /sample-report', () => {
    const idx = src.indexOf('data-testid="services-sample-report-card"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(idx, idx + 1200);
    expect(window).toContain('/sample-report');
    expect(window).toMatch(/data-testid="services-sample-report-cta"/);
  });
});

describe('Services · Featured CRV section', () => {
  test('CRV section exists exactly once', () => {
    const hits = (src.match(/data-testid="services-crv-feature-section"/g) || []).length;
    expect(hits).toBe(1);
  });
  test('CRV deliverables list renders the owner-approved items', () => {
    // The deliverables are declared once in the shared CRV_DELIVERABLES array
    // at the top of the module, then mapped into the <ul> under the testid.
    // Validate both: the constant content, and the fact that the testid list
    // consumes the constant.
    const arrIdx = src.indexOf('const CRV_DELIVERABLES');
    expect(arrIdx).toBeGreaterThan(-1);
    const arrBlock = src.slice(arrIdx, arrIdx + 1200);
    expect(arrBlock).toMatch(/On-site review of observable workplace conditions and work practices/);
    expect(arrBlock).toMatch(/Review of applicable safety programs, training records, inspection records/);
    expect(arrBlock).toMatch(/Written findings identifying floor and documentation gaps/);
    expect(arrBlock).toMatch(/Prioritized corrective-action recommendations/);
    const listIdx = src.indexOf('data-testid="services-crv-deliverables"');
    expect(listIdx).toBeGreaterThan(-1);
    const listBlock = src.slice(listIdx, listIdx + 600);
    expect(listBlock).toMatch(/CRV_DELIVERABLES\.map/);
  });
  test('CRV implementation note explicitly flags corrective work as not included', () => {
    const idx = src.indexOf('data-testid="services-crv-implementation-note"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 600);
    expect(block).toMatch(/Corrective implementation is not included/);
    expect(block).toMatch(/separately before any implementation begins/);
  });
  test('CRV savings note names the $500 difference and qualifies by scope', () => {
    const idx = src.indexOf('data-testid="services-crv-savings-note"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 700);
    expect(block).toMatch(/COMBINED_SAVINGS/);
    expect(block).toMatch(/standard scope/);
    expect(block).toMatch(/may vary when scope expands/);
  });
  test('CRV turnaround line locks the 5-business-day promise', () => {
    const idx = src.indexOf('data-testid="services-crv-turnaround-line"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 300);
    expect(block).toMatch(/within 5 business days of the on-site visit/);
    expect(block).not.toMatch(/within 48 hours/);
  });
  test('CRV section surfaces a Talk-to-Vince CTA alongside the primary CTA', () => {
    const idx = src.indexOf('data-testid="services-crv-talk-cta"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 1200), idx + 400);
    expect(window).toMatch(/TALK_TO_VINCE_HREF/);
    expect(window).toMatch(/Talk to Vince First/);
  });
});

describe('Services · Three-review comparison and "Best for" cards', () => {
  test('each review has a "Best for" card with the approved note', () => {
    const walk = src.indexOf('data-testid="services-bestfor-walkthrough"');
    const docs = src.indexOf('data-testid="services-bestfor-docreview"');
    const crv  = src.indexOf('data-testid="services-bestfor-crv"');
    expect(walk).toBeGreaterThan(-1);
    expect(docs).toBeGreaterThan(-1);
    expect(crv).toBeGreaterThan(-1);
    expect(src.slice(walk, walk + 1200)).toMatch(/concerns about visible hazards and workplace practices/i);
    expect(src.slice(docs, docs + 1200)).toMatch(/concerns about written programs and safety records/i);
    expect(src.slice(crv,  crv  + 1200)).toMatch(/concerns about both, or uncertainty about where the gaps are/i);
  });
  test('comparison table includes a report-delivered row with both turnaround promises', () => {
    const idx = src.indexOf('data-testid="services-compare-table"');
    expect(idx).toBeGreaterThan(-1);
    const block = src.slice(idx, idx + 4000);
    expect(block).toMatch(/Written report delivered/);
    expect(block).toMatch(/Within 48 hours of visit/);
    expect(block).toMatch(/Within 5 business days of visit/);
  });
});

describe('Services · After-submit section (no-commit expectation)', () => {
  test('after-submit section exists exactly once', () => {
    const hits = (src.match(/data-testid="services-after-submit-section"/g) || []).length;
    expect(hits).toBe(1);
  });
  test('headline reinforces that an inquiry asks for scope/quote, not a purchase', () => {
    const idx = src.indexOf('data-testid="services-after-submit-section"');
    const block = src.slice(idx, idx + 1200);
    expect(block).toMatch(/asks for a scope and quote/i);
    expect(block).toMatch(/does not purchase a service/i);
  });
  test('step list enumerates four distinct steps', () => {
    // Steps are rendered via `data-testid={`services-after-submit-step-${i + 1}`}`,
    // so the raw source carries the template literal, not a literal "1".
    // Validate the template plus the AFTER_SUBMIT_STEPS array length.
    expect(src).toMatch(/data-testid=\{`services-after-submit-step-\$\{i \+ 1\}`\}/);
    const arrIdx = src.indexOf('const AFTER_SUBMIT_STEPS');
    expect(arrIdx).toBeGreaterThan(-1);
    const arrBlock = src.slice(arrIdx, arrIdx + 2000);
    // Four { t: ... } entries in the array.
    const entries = (arrBlock.match(/\{\s*t:\s*'/g) || []).length;
    expect(entries).toBe(4);
  });
  test('step 4 mirrors the three turnaround promises per approved clock-start policy', () => {
    // DRR has no on-site visit by definition; the step must not say the DRR
    // report starts "of visit." Owner-approved Feb 2026 revision: Walkthrough
    // and CRV name the on-site visit as the clock reference, DRR is left as
    // "within 5 business days" because the formal clock-start policy for DRR
    // has not been established in the approved scope and must not be invented.
    expect(src).toMatch(/Safety Walkthrough report is delivered within 48 hours of the on-site visit/);
    expect(src).toMatch(/Compliance Readiness Visit report is delivered within 5 business days of the on-site visit/);
    expect(src).toMatch(/Documentation Readiness Review report is delivered within 5 business days\./);
    // Guard against the regression that lumps DRR into "of visit".
    expect(src).not.toMatch(/Documentation Readiness Review[^.]*within 5 business days of (the )?(on-site )?visit/);
  });
  test('after-submit section exposes Talk-to-Vince and phone CTAs', () => {
    expect(src).toMatch(/data-testid="services-after-submit-talk-cta"/);
    expect(src).toMatch(/data-testid="services-after-submit-phone-link"/);
  });
});

describe('Services · Beyond-the-assessment paths', () => {
  test('three cards exist for CAI, Control System, and Ongoing', () => {
    expect(src).toMatch(/data-testid="services-after-card-cai"/);
    expect(src).toMatch(/data-testid="services-after-card-oss-build"/);
    expect(src).toMatch(/data-testid="services-after-card-ongoing"/);
  });
  test('CAI card uses separate-scope language and canonical from-price', () => {
    const idx = src.indexOf('data-testid="services-after-card-cai"');
    const block = src.slice(idx, idx + 1200);
    expect(block).toMatch(/separately scope selected corrective-action work/);
    expect(block).toMatch(/CORRECTIVE_ACTION_IMPLEMENTATION\.amountFrom/);
  });
  test('OSS buildout card uses canonical from-price', () => {
    const idx = src.indexOf('data-testid="services-after-card-oss-build"');
    const block = src.slice(idx, idx + 1200);
    expect(block).toMatch(/SAFETY_CONTROL_SYSTEM_BUILDOUT\.displayPrice/);
  });
  test('Ongoing card uses canonical monthly from-price', () => {
    const idx = src.indexOf('data-testid="services-after-card-ongoing"');
    const block = src.slice(idx, idx + 1200);
    expect(block).toMatch(/ONGOING_SAFETY_SUPPORT\.displayPrice/);
  });
});

describe('Services · Compact kits strip', () => {
  test('kits strip is pulled from released KIT_CATALOG entries only', () => {
    expect(src).toMatch(/releasedFeaturedKits\s*=\s*KIT_CATALOG\.filter/);
    expect(src).toMatch(/!k\.hiddenFromCatalog\s*&&\s*k\.ready/);
  });
  test('kits strip exposes View All link to /citation-proof-kits', () => {
    // The View All link is rendered via the shared secCta(label, href, testid)
    // helper, so the testid appears as an argument string, not an inline attr.
    expect(src).toMatch(/secCta\(\s*['"][^'"]*View All Readiness Kits[^'"]*['"]\s*,\s*['"]\/citation-proof-kits['"]\s*,\s*['"]services-kits-all-cta['"]/);
  });
});

describe('Services · Final CTA and footer anchor', () => {
  test('final CTA offers the three primary paths including Talk-to-Vince anchor', () => {
    expect(src).toMatch(/data-testid="services-final-cta-primary"/);
    expect(src).toMatch(/data-testid="services-final-cta-secondary"/);
    expect(src).toMatch(/data-testid="services-final-cta-talk"/);
    expect(src).toMatch(/\/intake\?service=compliance-readiness-visit#talk-to-vince/);
  });
  test('NC DOL comparison link remains for buyers evaluating alternatives', () => {
    const idx = src.indexOf('data-testid="services-nc-dol-comparison-link"');
    expect(idx).toBeGreaterThan(-1);
    const window = src.slice(Math.max(0, idx - 400), idx + 400);
    expect(window).toContain('/nc-dol-consultation-vs-private-consultant');
  });
});

describe('Services · Pricing is sourced from the single pricing module', () => {
  test('page imports the canonical pricing constants from servicePricing', () => {
    expect(src).toMatch(/from '\.\.\/data\/servicePricing'/);
    expect(src).toMatch(/SAFETY_WALKTHROUGH/);
    expect(src).toMatch(/DOCUMENTATION_REVIEW/);
    expect(src).toMatch(/COMPLIANCE_READINESS_VISIT/);
    expect(src).toMatch(/CORRECTIVE_ACTION_IMPLEMENTATION/);
    expect(src).toMatch(/SAFETY_CONTROL_SYSTEM_BUILDOUT/);
    expect(src).toMatch(/ONGOING_SAFETY_SUPPORT/);
    expect(src).toMatch(/COMBINED_SEPARATE_TOTAL/);
    expect(src).toMatch(/COMBINED_SAVINGS/);
  });
  test('CRV price is rendered from the shared constant, never a literal', () => {
    expect(src).toMatch(/data-testid="services-crv-price"[\s\S]{0,200}COMPLIANCE_READINESS_VISIT\.displayPrice/);
  });
  test('no residual $1,650 anywhere in the page source', () => {
    expect(src).not.toMatch(/\$?1[,]?650/);
  });
});

describe('Services · Private-tool suppression and claim guardrails', () => {
  test('page no longer surfaces a public recommendation-router entry', () => {
    expect(src).not.toMatch(/data-testid="services-rec-entry-cta"/);
    expect(src).not.toMatch(/RecommendationEntryCard/);
    expect(src).not.toMatch(/Find My Starting Point/);
    // The /recommendation route is still private — the only remaining
    // intentional link is from the NC DOL comparison page, which is
    // unrelated. The services page itself must not emit the route.
    expect(src).not.toMatch(/to="\/recommendation"/);
  });
  test('no guarantee-of-compliance language on the services page', () => {
    expect(src).not.toMatch(/OSHA[\s-]*proof/i);
    expect(src).not.toMatch(/fully compliant/i);
    expect(src).not.toMatch(/guaranteed cost prevention/i);
    expect(src).not.toMatch(/guarantees?\s+OSHA\s+compliance(?!\?)/i);
    expect(src).not.toMatch(/prevent citations(?!,)/i);
  });
  test('no unreleased kit or waitlist product carries a purchase CTA', () => {
    expect(src).not.toMatch(/incident-to-correction/);
    expect(src).not.toMatch(/new-hire-orientation/);
  });
});

describe('Services · Structural guarantees', () => {
  test('exactly one h1 on the page', () => {
    const h1 = src.match(/<h1[\s>]/g) || [];
    expect(h1.length).toBe(1);
  });
  test('top-level section count matches the owner-approved order (9 sections)', () => {
    // Owner-approved order (Feb 2026 rebuild):
    //   hero, credibility, crv-feature, comparison, after-submit,
    //   after (beyond-assessment), kits, faq, final-cta.
    const secs = src.match(/data-testid="services-[a-z-]+-section"/g) || [];
    expect(secs.length).toBe(9);
  });
});
