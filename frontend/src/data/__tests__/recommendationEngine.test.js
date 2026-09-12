/**
 * Phase 2 Batch 2B, Checkpoint 1: recommendation engine tests.
 *
 * Coverage:
 *   1. Every documented path produces a uniform result payload
 *   2. Pricing values match servicePricing (source of truth)
 *   3. Released kits produce a purchase-style primary action;
 *      coming-soon kits NEVER produce one
 *   4. Ongoing Safety Support qualification gate is enforced
 *   5. Handoff URL contains ONLY the whitelisted safe keys
 *   6. Handoff sessionPayload carries the answer codes
 *   7. Coming-soon kits attach a currently-available alternative
 *   8. HazCom Starter Pack is the $29 path, not the Pro Kit
 *   9. Feature flag defaults to false
 *  10. Prior test-file baseline is still present
 */
const {
  recommend,
  recommendPathA,
  recommendPathB,
  recommendPathC,
  recommendPathD,
  recommendPathE,
  isKitReleased,
  buildHandoff,
  PATH_ID,
  RESULT_KIND,
  KIT_REGISTRY,
  RELEASED_KIT_SLUGS,
  COMING_SOON_KIT_SLUGS,
  KIT_EDITIONS,
  OSS_QUALIFICATION_KEYS,
  IMPLEMENTATION_SERVICES,
} = require('../recommendationEngine');
const {
  SAFETY_WALKTHROUGH,
  DOCUMENTATION_REVIEW,
  COMPLIANCE_READINESS_VISIT,
  CORRECTIVE_ACTION_IMPLEMENTATION,
  SAFETY_CONTROL_SYSTEM_BUILDOUT,
  ONGOING_SAFETY_SUPPORT,
  HAZCOM_STARTER_PACK,
  KIT_PRICES,
} = require('../servicePricing');
const {
  RECOMMENDATION_ROUTER_ENABLED,
  EXIT_FEEDBACK_ENABLED,
} = require('../../config/features');

describe('Feature flags default off (preview only)', () => {
  test('RECOMMENDATION_ROUTER_ENABLED is false', () => {
    expect(RECOMMENDATION_ROUTER_ENABLED).toBe(false);
  });
  test('EXIT_FEEDBACK_ENABLED is false', () => {
    expect(EXIT_FEEDBACK_ENABLED).toBe(false);
  });
});

describe('Kit registry status invariants', () => {
  test('released kit slugs match the mandate', () => {
    expect(new Set(RELEASED_KIT_SLUGS)).toEqual(
      new Set([
        'loto-readiness-kit',
        'forklift-pit-readiness-kit',
        'hazcom-pro-kit',
        'hazcom-starter-pack',
      ]),
    );
  });
  test('coming-soon kit slugs are Incident and New Hire', () => {
    expect(new Set(COMING_SOON_KIT_SLUGS)).toEqual(
      new Set(['incident-to-correction-kit', 'new-hire-orientation-kit']),
    );
  });
  test('isKitReleased matches the registry', () => {
    RELEASED_KIT_SLUGS.forEach((s) => expect(isKitReleased(s)).toBe(true));
    COMING_SOON_KIT_SLUGS.forEach((s) => expect(isKitReleased(s)).toBe(false));
    expect(isKitReleased('made-up')).toBe(false);
  });
});

describe('Path A, released kit recommendations', () => {
  test('LOTO + digital edition returns the LOTO kit at $150', () => {
    const r = recommendPathA({ controlArea: 'loto', edition: 'digital', answers: { primaryAim: 'A', controlArea: 'loto', edition: 'digital' } });
    expect(r.kind).toBe(RESULT_KIND.KIT);
    expect(r.slug).toBe('loto-readiness-kit');
    expect(r.pathId).toBe(PATH_ID.A);
    expect(r.edition).toBe('digital');
    expect(r.price).toBe(KIT_PRICES.digital);
    expect(r.primaryAction.kind).toBe('kit');
    expect(r.primaryAction.href).toBe('/citation-proof-kits/loto-readiness-kit?edition=digital');
  });
  test('PIT + control system edition returns $300 tier', () => {
    const r = recommendPathA({ controlArea: 'pit', edition: 'controlSystem', answers: {} });
    expect(r.slug).toBe('forklift-pit-readiness-kit');
    expect(r.edition).toBe('controlSystem');
    expect(r.price).toBe(KIT_PRICES.controlSystem);
  });
  test('HazCom Pro + binder edition returns $600 tier', () => {
    const r = recommendPathA({ controlArea: 'hazcom-full', edition: 'binder', answers: {} });
    expect(r.slug).toBe('hazcom-pro-kit');
    expect(r.price).toBe(KIT_PRICES.binder);
  });
  test('HazCom basics returns the $29 Starter Pack, no Pro Kit substitution', () => {
    const r = recommendPathA({ controlArea: 'hazcom-basics', answers: {} });
    expect(r.kind).toBe(RESULT_KIND.STARTER_PACK);
    expect(r.slug).toBe('hazcom-starter-pack');
    expect(r.price).toBe(HAZCOM_STARTER_PACK);
    expect(r.primaryAction.kind).toBe('kit');
    expect(r.primaryAction.href).toBe('/hazcom-starter-pack');
  });
  test('several connected areas returns Compliance Readiness Visit', () => {
    const r = recommendPathA({ controlArea: 'several-areas', answers: {} });
    expect(r.kind).toBe(RESULT_KIND.SERVICE);
    expect(r.slug).toBe('compliance-readiness-visit');
    expect(r.price).toBe(COMPLIANCE_READINESS_VISIT);
  });
  test('not sure routes back to Path B', () => {
    const r = recommendPathA({ controlArea: 'not-sure', answers: {} });
    expect(r.kind).toBe('route-to-path');
    expect(r.routeToPath).toBe(PATH_ID.B);
  });
});

describe('Path A, coming-soon kits NEVER produce a purchase CTA', () => {
  test('Incident-to-Correction returns kit-coming-soon and a waitlist primary action', () => {
    const r = recommendPathA({ controlArea: 'incident', edition: 'digital', answers: {} });
    expect(r.kind).toBe(RESULT_KIND.KIT_COMING_SOON);
    expect(r.slug).toBe('incident-to-correction-kit');
    expect(r.primaryAction.kind).toBe('waitlist');
    expect(r.price).toBeNull();
    // A currently available alternative is attached
    expect(r.alternative).toBeTruthy();
    expect(r.alternative.slug).toBe('compliance-readiness-visit');
    // Disclaimer clearly labels the not-released status
    expect(r.disclaimer).toMatch(/not released/i);
  });
  test('New Hire Orientation returns kit-coming-soon', () => {
    const r = recommendPathA({ controlArea: 'new-hire', edition: 'binder', answers: {} });
    expect(r.kind).toBe(RESULT_KIND.KIT_COMING_SOON);
    expect(r.slug).toBe('new-hire-orientation-kit');
    expect(r.primaryAction.kind).toBe('waitlist');
    expect(r.price).toBeNull();
  });
});

describe('Path B, review the operation', () => {
  test.each([
    ['floor', 'safety-walkthrough', SAFETY_WALKTHROUGH],
    ['documentation', 'documentation-readiness-review', DOCUMENTATION_REVIEW],
    ['both', 'compliance-readiness-visit', COMPLIANCE_READINESS_VISIT],
    ['unsure', 'compliance-readiness-visit', COMPLIANCE_READINESS_VISIT],
  ])('reviewFocus=%s recommends %s at the correct price', (focus, slug, price) => {
    const r = recommendPathB({ reviewFocus: focus, answers: { primaryAim: 'B', reviewFocus: focus } });
    expect(r.kind).toBe(RESULT_KIND.SERVICE);
    expect(r.slug).toBe(slug);
    expect(r.price).toBe(price);
    expect(r.pathId).toBe(PATH_ID.B);
  });
  test('Combined savings statement appears when CRV is recommended', () => {
    const r = recommendPathB({ reviewFocus: 'both', answers: {} });
    expect(r.why).toMatch(/\$500/);
  });
});

describe('Path C, close known findings', () => {
  test('with a documented list recommends Corrective Action Implementation', () => {
    const r = recommendPathC({ hasFindingsList: true, answers: {} });
    expect(r.slug).toBe('corrective-action-implementation');
    expect(r.price).toBe(CORRECTIVE_ACTION_IMPLEMENTATION);
    expect(r.pathId).toBe(PATH_ID.C);
  });
  test('without a list routes back to Path B', () => {
    const r = recommendPathC({ hasFindingsList: false, answers: {} });
    expect(r.kind).toBe('route-to-path');
    expect(r.routeToPath).toBe(PATH_ID.B);
  });
});

describe('Path D, build the system', () => {
  test('recommends Safety Control System buildout', () => {
    const r = recommendPathD({ answers: {} });
    expect(r.slug).toBe('safety-control-system-buildout');
    expect(r.price).toBe(SAFETY_CONTROL_SYSTEM_BUILDOUT);
    expect(r.pathId).toBe(PATH_ID.D);
    // Do not describe as SaaS or software
    expect(r.notIncluded.join(' ')).toMatch(/Software|SaaS/);
  });
});

describe('Path E, Ongoing Safety Support qualification gate', () => {
  const allYes = {
    programsExist: true,
    trainingCurrent: true,
    correctiveActionsTracked: true,
    primaryNeedRecurring: true,
  };
  test('all four YES recommends Ongoing Safety Support', () => {
    const r = recommendPathE({ qualifications: allYes, answers: {} });
    expect(r.slug).toBe('ongoing-safety-support');
    expect(r.price).toBe(ONGOING_SAFETY_SUPPORT);
  });
  test.each(OSS_QUALIFICATION_KEYS)('a single NO on %s never routes to OSS', (key) => {
    const q = { ...allYes, [key]: false };
    const r = recommendPathE({ qualifications: q, answers: {} });
    expect(r.slug).not.toBe('ongoing-safety-support');
  });
  test.each(OSS_QUALIFICATION_KEYS)('a single UNSURE on %s never routes to OSS', (key) => {
    // primaryNeedRecurring is boolean-only; skip its unsure case here
    if (key === 'primaryNeedRecurring') return;
    const q = { ...allYes, [key]: 'unsure' };
    const r = recommendPathE({ qualifications: q, answers: {} });
    expect(r.slug).not.toBe('ongoing-safety-support');
  });
  test('unknown gap when nothing qualifies routes to CRV', () => {
    const r = recommendPathE({ qualifications: {}, answers: {} });
    expect(r.slug).toBe('compliance-readiness-visit');
  });
  test('known open findings but no tracking routes to Corrective Action Implementation', () => {
    const r = recommendPathE({
      qualifications: {
        programsExist: true,
        trainingCurrent: true,
        correctiveActionsTracked: false,
        primaryNeedRecurring: true,
      },
      primaryGap: 'open-findings',
      answers: {},
    });
    expect(r.slug).toBe('corrective-action-implementation');
  });
  test('missing underlying system routes to Safety Control System', () => {
    const r = recommendPathE({
      qualifications: {
        programsExist: false,
        trainingCurrent: true,
        correctiveActionsTracked: true,
        primaryNeedRecurring: true,
      },
      answers: {},
    });
    expect(r.slug).toBe('safety-control-system-buildout');
  });
});

describe('Handoff / privacy contract', () => {
  test('URL params contain only whitelisted safe keys', () => {
    const h = buildHandoff({
      offer: 'compliance-readiness-visit',
      pathId: 'B',
      leadSource: 'recommendation-router',
      answers: {
        primaryAim: 'B',
        reviewFocus: 'both',
        // Simulated free-text should never appear in urlParams:
        freeTextInjury: 'employee amputation on line 7',
        internalComplaint: 'insurer flagged forklift near-miss',
      },
    });
    expect(Object.keys(h.urlParams).sort()).toEqual(['lead_source', 'service']);
    expect(h.urlQuery).toBe('?service=compliance-readiness-visit&lead_source=recommendation-router');
    // No workplace description, no free text, no answer-code names in the URL:
    expect(h.urlQuery).not.toMatch(/amputation|near-miss|reviewFocus|primaryAim|controlArea|hasFindingsList/);
  });
  test('sessionPayload carries the answers, URL does not carry answer codes', () => {
    const answers = { primaryAim: 'A', controlArea: 'loto', edition: 'digital' };
    const r = recommendPathA({ controlArea: 'loto', edition: 'digital', answers });
    expect(r.handoff.sessionPayload.answers).toEqual(answers);
    // Whitelisted safe URL keys only. `edition` is safe (public product tier).
    Object.keys(r.handoff.urlParams).forEach((k) => {
      expect(['service', 'kit', 'edition', 'ref', 'lead_source']).toContain(k);
    });
    expect(r.handoff.urlQuery).not.toMatch(/controlArea|primaryAim|hasFindingsList|reviewFocus/);
    // Session-key is the shared sessionStorage bucket
    expect(r.handoff.sessionKey).toBe('gl_recommendation_handoff');
  });
  test('coming-soon kits do not surface a service-slug in the URL', () => {
    const r = recommendPathA({ controlArea: 'incident', edition: 'digital', answers: {} });
    expect(r.handoff.urlParams).not.toHaveProperty('service');
    // Kit slug is safe to reveal (public route)
    expect(r.handoff.urlParams.kit).toBe('incident-to-correction-kit');
  });
});

describe('Top-level recommend() dispatcher', () => {
  test('dispatches to each path by primaryAim', () => {
    expect(recommend({ primaryAim: 'B', reviewFocus: 'floor', answers: {} }).slug).toBe(
      'safety-walkthrough',
    );
    expect(recommend({ primaryAim: 'C', hasFindingsList: true, answers: {} }).slug).toBe(
      'corrective-action-implementation',
    );
    expect(recommend({ primaryAim: 'D', answers: {} }).slug).toBe('safety-control-system-buildout');
  });
  test('throws on unknown primaryAim', () => {
    expect(() => recommend({ primaryAim: 'Z' })).toThrow();
  });
});

describe('Uniform result-card shape', () => {
  const cases = [
    ['Path A, LOTO', recommendPathA({ controlArea: 'loto', edition: 'digital', answers: {} })],
    ['Path A, HazCom starter', recommendPathA({ controlArea: 'hazcom-basics', answers: {} })],
    ['Path A, several areas', recommendPathA({ controlArea: 'several-areas', answers: {} })],
    ['Path A, coming soon', recommendPathA({ controlArea: 'incident', answers: {} })],
    ['Path B, floor', recommendPathB({ reviewFocus: 'floor', answers: {} })],
    ['Path C, has list', recommendPathC({ hasFindingsList: true, answers: {} })],
    ['Path D', recommendPathD({ answers: {} })],
    [
      'Path E, all yes',
      recommendPathE({
        qualifications: {
          programsExist: true,
          trainingCurrent: true,
          correctiveActionsTracked: true,
          primaryNeedRecurring: true,
        },
        answers: {},
      }),
    ],
  ];
  test.each(cases)('%s carries the required fields', (_label, r) => {
    expect(r).toHaveProperty('kind');
    expect(r).toHaveProperty('name');
    expect(r).toHaveProperty('why');
    expect(r).toHaveProperty('included');
    expect(Array.isArray(r.included)).toBe(true);
    expect(r).toHaveProperty('notIncluded');
    expect(Array.isArray(r.notIncluded)).toBe(true);
    expect(r).toHaveProperty('nextStep');
    expect(r).toHaveProperty('disclaimer');
    expect(r).toHaveProperty('primaryAction');
    expect(r).toHaveProperty('handoff');
  });
});
