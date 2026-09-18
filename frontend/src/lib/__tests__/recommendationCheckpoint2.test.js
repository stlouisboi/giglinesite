/**
 * Phase 2 Batch 2B, Checkpoint 2: entry-card + service-embed + intake tests.
 *
 * Coverage:
 *   1. Entry-card component returns null unless RECOMMENDATION_ROUTER_ENABLED
 *   2. Every consuming surface imports the entry card / embed / objection block
 *      (Home, /services, /citation-proof-kits, three assessment service pages)
 *   3. Compact embed on service pages seeds Path B
 *   4. Objection support block exposes all twelve mandate items
 *   5. Intake page recognizes lead_source=recommendation-router and swaps the
 *      banner label to "You are requesting"
 *   6. Exit-feedback stub returns null while EXIT_FEEDBACK_ENABLED is false
 *   7. Safety Check action-plan preview does not fetch and does not claim delivery
 *   8. Sample-report memo exists in /app/memory
 *   9. Five-touch opt-in drafts exist and never wire live delivery
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..');
const REPO = path.join(SRC, '..', '..');

const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');
const readRepo = (rel) => fs.readFileSync(path.join(REPO, rel), 'utf8');

describe('RecommendationEntryCard, flag gating', () => {
  const card = read('components/RecommendationEntryCard.js');
  test('is gated by the RECOMMENDATION_ROUTER_ENABLED flag', () => {
    expect(card).toMatch(/if\s*\(\s*!RECOMMENDATION_ROUTER_ENABLED\s*\)\s*return\s+null\s*;/);
  });
  test('links to /recommendation and never renders a purchase CTA', () => {
    expect(card).toMatch(/to="\/recommendation"/);
    expect(card).not.toMatch(/\bcheckout\b/i);
    expect(card).not.toMatch(/stripe\.com\/checkout/i);
  });
});

describe('Consuming surfaces embed the entry card', () => {
  const home = read('pages/HomePage.js');
  const services = read('pages/ServicesPage.js');
  const kits = read('pages/CitationProofKitsPage.js');
  test('Homepage exposes exactly one recommendation entry point gated by the router flag', () => {
    // Post-consolidation the homepage inlines its single rec-entry CTA and
    // guards the label on RECOMMENDATION_ROUTER_ENABLED rather than importing
    // the standalone RecommendationEntryCard. Enforce three constraints:
    //   1. Homepage imports the flag from features.
    //   2. Homepage swaps the CTA label based on the flag.
    //   3. Homepage renders a single rec-entry section, not a repeating card.
    expect(home).toMatch(/RECOMMENDATION_ROUTER_ENABLED[^;]*from\s+['"]\.\.\/config\/features['"]/);
    expect(home).toMatch(/Find My Starting Point/);
    expect(home).toMatch(/Compare (GigLine )?Services/);
    const recEntrySections = (home.match(/data-testid="rec-entry-section"/g) || []).length;
    expect(recEntrySections).toBe(1);
  });
  test('/services imports RecommendationEntryCard + ObjectionSupport', () => {
    expect(services).toMatch(/RecommendationEntryCard/);
    expect(services).toMatch(/ObjectionSupport/);
  });
  test('/citation-proof-kits imports RecommendationEntryCard + ObjectionSupport', () => {
    expect(kits).toMatch(/RecommendationEntryCard/);
    expect(kits).toMatch(/ObjectionSupport/);
  });
});

describe('Service-page compact embed', () => {
  const embed = read('components/ServicePageRecommendationEmbed.js');
  test('embed seeds Path B and is gated by the router flag', () => {
    expect(embed).toMatch(/seedPrimaryAim="B"/);
    expect(embed).toMatch(/if\s*\(\s*!RECOMMENDATION_ROUTER_ENABLED\s*\)\s*return\s+null\s*;/);
  });
  const sw = read('pages/SafetyWalkthroughPage.js');
  const crv = read('pages/ComplianceReadinessVisitPage.js');
  const dr = read('pages/OSHADocumentationReviewNCPage.js');
  test.each([
    ['SafetyWalkthroughPage', sw],
    ['ComplianceReadinessVisitPage', crv],
    ['OSHADocumentationReviewNCPage', dr],
  ])('%s mounts the embed', (_name, src) => {
    expect(src).toMatch(/ServicePageRecommendationEmbed/);
  });
});

describe('ObjectionSupport block, mandate coverage', () => {
  const obj = read('components/ObjectionSupport.js');
  const requiredQuestions = [
    'I do not know where to start',
    'I already have policies and forms',
    'Can my internal team handle this',
    'I need leadership approval',
    'I do not have time to implement',
    'Is a digital kit enough',
    'What is different about the \\$300 system',
    'When would I need the \\$600 binder',
    'Will this guarantee compliance',
    'What happens after I buy',
    'Is GigLine connected to OSHA',
    'Will my facility information remain private',
  ];
  test.each(requiredQuestions)('objection support surfaces "%s"', (needle) => {
    const re = new RegExp(needle);
    expect(obj).toMatch(re);
  });
  test('does not use the words "guarantee" or "approval" as promises', () => {
    // "Will this guarantee compliance?" is the question; the answer must say No.
    const answerIdx = obj.indexOf("Will this guarantee compliance");
    expect(answerIdx).toBeGreaterThan(-1);
    const window = obj.slice(answerIdx, answerIdx + 800);
    expect(window).toMatch(/No\./);
    expect(window).toMatch(/does not guarantee/i);
  });
});

describe('Intake page prefill', () => {
  const intake = read('pages/ClientIntakePage.js');
  test('recognizes the recommendation-router lead source and swaps the banner label', () => {
    expect(intake).toMatch(/lead_source/);
    expect(intake).toMatch(/recommendation-router/);
    expect(intake).toMatch(/You are requesting/);
  });
  test('adds the safety-control-system-buildout slug to the service map', () => {
    expect(intake).toMatch(/'safety-control-system-buildout'/);
  });
  test('banner label uses navy text (contrast fix)', () => {
    expect(intake).not.toMatch(/className="text-white text-sm font-semibold" data-testid="intake-source-banner-slug"/);
  });
});

describe('ExitFeedbackStub', () => {
  const stub = read('components/ExitFeedbackStub.js');
  test('returns null when EXIT_FEEDBACK_ENABLED is false', () => {
    expect(stub).toMatch(/if\s*\(\s*!EXIT_FEEDBACK_ENABLED\s*\)\s*return\s+null\s*;/);
  });
  test('offers finite radio choices with no free-text field', () => {
    expect(stub).toMatch(/EXIT_FEEDBACK_CHOICES/);
    expect(stub).not.toMatch(/<textarea/);
  });
  test('does not fetch or submit', () => {
    expect(stub).not.toMatch(/\bfetch\s*\(/);
    expect(stub).not.toMatch(/\baxios\b/);
  });
});

describe('Safety Check action-plan preview', () => {
  const ap = read('components/SafetyCheckActionPlanPreview.js');
  test('is gated by BOTH the router flag AND EMAIL_DELIVERY_LIVE and does not fetch or claim delivery', () => {
    expect(ap).toMatch(/if\s*\(\s*!RECOMMENDATION_ROUTER_ENABLED\s*\|\|\s*!EMAIL_DELIVERY_LIVE\s*\)\s*return\s+null\s*;/);
    expect(ap).not.toMatch(/\bfetch\s*\(/);
    expect(ap).not.toMatch(/email sent|delivered to your inbox|check your email/i);
    expect(ap).toContain('Preview only, no email was sent');
  });
  test('marketing consent is a separate unchecked checkbox', () => {
    expect(ap).toMatch(/marketing[\s\S]{0,60}useState\(false\)/i);
    expect(ap).toMatch(/opted in|not opted in/);
  });
});

describe('EMAIL_DELIVERY_LIVE flag gating', () => {
  const features = read('config/features.js');
  const card = read('components/RecommendationResultCard.js');
  test('EMAIL_DELIVERY_LIVE exported as false', () => {
    expect(features).toMatch(/export\s+const\s+EMAIL_DELIVERY_LIVE\s*=\s*false\s*;/);
  });
  test('RecommendationResultCard imports EMAIL_DELIVERY_LIVE and hides the email toggle when off', () => {
    expect(card).toMatch(/EMAIL_DELIVERY_LIVE/);
    expect(card).toMatch(/showEmailForm\s*&&\s*EMAIL_DELIVERY_LIVE/);
  });
});

describe('Sample-report review memo exists', () => {
  const memo = readRepo('memory/SAMPLE_REPORT_REVIEW.md');
  test('memo names the mandate rules and Batch 2B "no code change" decision', () => {
    expect(memo).toMatch(/keep the full email-delivery flow disabled/i);
    expect(memo).toMatch(/No Batch 2B code change to `SampleReportPage.js`/);
  });
});

describe('Five-touch opt-in email drafts exist', () => {
  const drafts = [
    'backend/email_templates/drafts/opt-in-followup-README.md',
    'backend/email_templates/drafts/opt-in-followup-day-0.md',
    'backend/email_templates/drafts/opt-in-followup-day-2.md',
    'backend/email_templates/drafts/opt-in-followup-day-5.md',
    'backend/email_templates/drafts/opt-in-followup-day-8.md',
    'backend/email_templates/drafts/opt-in-followup-day-14.md',
  ];
  test.each(drafts)('%s exists', (rel) => {
    const body = readRepo(rel);
    expect(body.length).toBeGreaterThan(50);
  });
  test('no draft implies live delivery or fires without opt-in', () => {
    drafts.forEach((rel) => {
      const body = readRepo(rel);
      // Each draft must be clearly labeled non-live.
      expect(body).toMatch(/DRAFT|Not wired|Not sending/i);
      // No draft can reference the withheld case study.
      expect(body).not.toMatch(/case-study\/metal-fabrication-readiness/);
    });
  });
});

describe('Recommendation delivery + Safety Check action-plan drafts exist', () => {
  const files = [
    'backend/email_templates/drafts/recommendation-delivery.md',
    'backend/email_templates/drafts/safety-check-action-plan.md',
  ];
  test.each(files)('%s exists and is labeled non-live', (rel) => {
    const body = readRepo(rel);
    expect(body.length).toBeGreaterThan(50);
    expect(body).toMatch(/DRAFT|Not wired|Not sending/i);
  });
});
