/**
 * Phase 2 Batch 2B follow-up: Share fragment + intake attribution tests.
 *
 * 1. encodeShareFragment and decodeShareFragment round-trip.
 * 2. Only whitelisted answer keys survive decode; unknown keys are dropped.
 * 3. Router source imports useEffect and calls decodeShareFragment on mount.
 * 4. ClientIntakePage sends `lead_source` and `recommendation_answers` in
 *    the submit payload.
 * 5. Backend intake model declares the new fields.
 * 6. Result card has a Share button testid and does not fetch/axios.
 */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', '..');
const APP = path.join(__dirname, '..', '..', '..', '..');

function read(rel) {
  return fs.readFileSync(path.join(SRC, rel), 'utf8');
}
function readApp(rel) {
  return fs.readFileSync(path.join(APP, rel), 'utf8');
}

const { encodeShareFragment, decodeShareFragment } = require('../../lib/shareFragment');

describe('encodeShareFragment / decodeShareFragment', () => {
  test('round-trip preserves allowed answer keys', () => {
    const answers = {
      primaryAim: 'A',
      controlArea: 'loto',
      edition: 'digital',
    };
    const frag = encodeShareFragment(answers);
    expect(frag.startsWith('#')).toBe(true);
    expect(frag).toContain('primaryAim=A');
    expect(frag).toContain('controlArea=loto');
    expect(frag).toContain('edition=digital');
    const decoded = decodeShareFragment(frag);
    expect(decoded).toEqual(answers);
  });

  test('booleans survive round-trip for Path E qualification keys', () => {
    const answers = {
      primaryAim: 'E',
      programsExist: true,
      trainingCurrent: false,
      correctiveActionsTracked: true,
      primaryNeedRecurring: true,
    };
    const frag = encodeShareFragment(answers);
    const decoded = decodeShareFragment(frag);
    expect(decoded.programsExist).toBe(true);
    expect(decoded.trainingCurrent).toBe(false);
    expect(decoded.correctiveActionsTracked).toBe(true);
    expect(decoded.primaryNeedRecurring).toBe(true);
  });

  test('unknown keys are discarded on decode (no injection)', () => {
    const decoded = decodeShareFragment('#primaryAim=A&injuryDetail=amputation&company=Acme');
    expect(decoded).toEqual({ primaryAim: 'A' });
    expect(decoded).not.toHaveProperty('injuryDetail');
    expect(decoded).not.toHaveProperty('company');
  });

  test('empty or malformed fragments return null', () => {
    expect(decodeShareFragment('')).toBeNull();
    expect(decodeShareFragment('#')).toBeNull();
    expect(decodeShareFragment(null)).toBeNull();
    expect(decodeShareFragment(undefined)).toBeNull();
  });

  test('empty answers produce an empty fragment', () => {
    expect(encodeShareFragment({})).toBe('');
    expect(encodeShareFragment(null)).toBe('');
  });

  test('encode never emits PII keys even if provided', () => {
    const answers = {
      primaryAim: 'A',
      email: 'x@y.com',
      phone: '5551234',
      companyName: 'Acme',
      injuryClaimDescription: 'employee amputation',
    };
    const frag = encodeShareFragment(answers);
    expect(frag).toContain('primaryAim=A');
    expect(frag).not.toMatch(/email|phone|companyName|amputation/i);
  });
});

describe('RecommendationRouter share fragment integration', () => {
  const router = read('components/RecommendationRouter.js');
  test('router imports useEffect and calls decodeShareFragment on mount', () => {
    expect(router).toMatch(/useEffect/);
    expect(router).toMatch(/decodeShareFragment\(window\.location\.hash\)/);
  });
  test('router passes encoded fragment to result card via shareFragment prop', () => {
    expect(router).toMatch(/shareFragment=\{encodeShareFragment\(answers\)\}/);
  });
});

describe('RecommendationResultCard Share button', () => {
  const card = read('components/RecommendationResultCard.js');
  test('renders a share button with a stable testid', () => {
    expect(card).toMatch(/data-testid="rr-result-share"/);
  });
  test('share flow uses navigator.clipboard, never fetch or axios', () => {
    expect(card).toMatch(/navigator\.clipboard/);
    expect(card).not.toMatch(/\bfetch\s*\(/);
    expect(card).not.toMatch(/\baxios\b/);
  });
  test('shareable URL points at /recommendation with ref=share', () => {
    expect(card).toMatch(/\/recommendation\?ref=share/);
  });
  test('privacy hint explains the fragment stays client-side', () => {
    expect(card).toMatch(/answers stay in your browser|not visible to GigLine unless you continue/i);
  });
});

describe('ClientIntakePage forwards recommendation-router attribution to backend', () => {
  const intake = read('pages/ClientIntakePage.js');
  test('payload includes lead_source and recommendation_answers', () => {
    expect(intake).toMatch(/lead_source:\s*fromRecommendationRouter\s*\?\s*'recommendation-router'/);
    expect(intake).toMatch(/recommendation_answers/);
  });
  test('reads answers from sessionStorage under the shared handoff key', () => {
    expect(intake).toMatch(/gl_recommendation_handoff/);
  });
  test('trackEvent surfaces lead_source for analytics', () => {
    expect(intake).toMatch(/lead_source:\s*fromRecommendationRouter\s*\?\s*'recommendation-router'\s*:\s*'direct'/);
  });
});

describe('Backend intake model declares router-attribution fields', () => {
  const intakePy = readApp('backend/routes/intake.py');
  test('IntakeSubmission has lead_source, source_service_slug, recommendation_answers', () => {
    expect(intakePy).toMatch(/lead_source:\s*str\s*=\s*""/);
    expect(intakePy).toMatch(/source_service_slug:\s*str\s*=\s*""/);
    expect(intakePy).toMatch(/recommendation_answers:\s*Optional\[dict\]/);
  });
  test('Vince notification renders a router-attribution block when the source is recommendation-router', () => {
    expect(intakePy).toMatch(/RECOMMENDATION ROUTER ATTRIBUTION/);
    expect(intakePy).toMatch(/data\.lead_source\s*==\s*'recommendation-router'/);
  });
});
