/**
 * GigLine Recommendation Engine, Phase 2 Batch 2B.
 *
 * ONE shared decision engine used by:
 *   - The full /recommendation router
 *   - The compact "Is this the right starting point?" embed on the three
 *     assessment service pages (Safety Walkthrough, Documentation Readiness
 *     Review, Compliance Readiness Visit)
 *   - The Safety Check follow-up "Email my action plan" recommendation
 *   - Any future decision-support surface
 *
 * Rules that are enforced here, not at the component layer, so no caller
 * can accidentally develop a contradictory branch:
 *
 *   1. Coming-soon kits (ready === false) NEVER produce a purchase CTA.
 *      They resolve to a `coming-soon` result kind whose primary action is
 *      a waitlist join. A currently available alternative service is
 *      always attached.
 *
 *   2. Ongoing Safety Support (OSS, $1,850/mo) can only be recommended
 *      when all four qualification conditions are affirmatively "yes".
 *      Any "no" or "unsure" answer routes to the appropriate diagnostic,
 *      implementation, or system-build service instead. OSS is never
 *      recommended merely because a buyer said they want ongoing help.
 *
 *   3. Every result exposes: recommendation, why, included, notIncluded,
 *      price, nextStep, one alternative, answersUsed, disclaimer.
 *
 *   4. Pricing strings are pulled from ../data/servicePricing so no price
 *      can drift here.
 *
 *   5. Free-text answers and workplace-condition answers must NEVER be
 *      passed through the URL. The engine returns a `handoff` object
 *      containing (a) `urlParams` (safe) and (b) `sessionPayload`
 *      (private, sessionStorage only). Callers must respect this split.
 */

import {
  SAFETY_WALKTHROUGH,
  DOCUMENTATION_REVIEW,
  COMPLIANCE_READINESS_VISIT,
  CORRECTIVE_ACTION_IMPLEMENTATION,
  SAFETY_CONTROL_SYSTEM_BUILDOUT,
  ONGOING_SAFETY_SUPPORT,
  HAZCOM_STARTER_PACK,
  KIT_PRICES,
  COMBINED_SAVINGS_STATEMENT,
} from './servicePricing';
import { STARTING_PRICE_DISCLAIMER } from './assessmentCatalog';
import { getKitReleaseStatus } from './citationProofKits';

// ────────────────────────────────────────────────────────────────
// Kit catalog for the router. Release state is read from the SHARED
// getKitReleaseStatus helper in citationProofKits.js so this file and
// KitSelector.js can never disagree about whether a kit is purchasable.
// ────────────────────────────────────────────────────────────────
export const KIT_REGISTRY = {
  'loto-readiness-kit': {
    slug: 'loto-readiness-kit',
    name: 'Machine-Specific LOTO Readiness Kit',
    ready: getKitReleaseStatus('loto-readiness-kit').ready,
    route: '/citation-proof-kits/loto-readiness-kit',
  },
  'forklift-pit-readiness-kit': {
    slug: 'forklift-pit-readiness-kit',
    name: 'Forklift / PIT Readiness Kit',
    ready: getKitReleaseStatus('forklift-pit-readiness-kit').ready,
    route: '/citation-proof-kits/forklift-pit-readiness-kit',
  },
  'hazcom-pro-kit': {
    slug: 'hazcom-pro-kit',
    name: 'HazCom Pro Kit',
    ready: getKitReleaseStatus('hazcom-pro-kit').ready,
    route: '/citation-proof-kits/hazcom-pro-kit',
  },
  'incident-to-correction-kit': {
    slug: 'incident-to-correction-kit',
    name: 'Incident-to-Correction Kit',
    ready: getKitReleaseStatus('incident-to-correction-kit').ready,
    route: '/citation-proof-kits/incident-to-correction-kit',
  },
  'new-hire-orientation-kit': {
    slug: 'new-hire-orientation-kit',
    name: 'New Hire Safety Orientation Kit',
    ready: getKitReleaseStatus('new-hire-orientation-kit').ready,
    route: '/citation-proof-kits/new-hire-orientation-kit',
  },
  'hazcom-starter-pack': {
    slug: 'hazcom-starter-pack',
    // HazCom Starter Pack lives on its own /hazcom-starter-pack page,
    // not in the KIT_DETAILS catalog. Always released.
    name: 'HazCom Starter Pack',
    ready: true,
    route: '/hazcom-starter-pack',
  },
};

export const KIT_EDITIONS = {
  digital: {
    key: 'digital',
    label: 'Digital Compliance Kit',
    price: KIT_PRICES.digital,
    description:
      'Documents and implementation guidance in a downloadable set. Print or use digitally.',
  },
  controlSystem: {
    key: 'controlSystem',
    label: 'Compliance Control System',
    price: KIT_PRICES.controlSystem,
    description:
      'Everything in the Digital kit plus control-and-tracking tools that make the paperwork auditable.',
  },
  binder: {
    key: 'binder',
    label: 'Inspector-Ready Binder Edition',
    price: KIT_PRICES.binder,
    description:
      'The full Compliance Control System organized in a shipped, tab-labeled physical binder.',
  },
};

// ────────────────────────────────────────────────────────────────
// Path-A control-area map. The `bestKit` may be a released kit, a
// coming-soon kit, or the HazCom Starter Pack. The `serviceFallback`
// is the assessment service the router routes to when the buyer picks
// "several connected areas" or "not sure".
// ────────────────────────────────────────────────────────────────
export const CONTROL_AREA_MAP = {
  loto: {
    label: 'Lockout / Tagout (LOTO)',
    kitSlug: 'loto-readiness-kit',
  },
  pit: {
    label: 'Forklift and Powered Industrial Trucks',
    kitSlug: 'forklift-pit-readiness-kit',
  },
  'hazcom-basics': {
    label: 'HazCom, basics only',
    kitSlug: 'hazcom-starter-pack',
  },
  'hazcom-full': {
    label: 'HazCom, complete control',
    kitSlug: 'hazcom-pro-kit',
  },
  incident: {
    label: 'Incident correction and closure',
    kitSlug: 'incident-to-correction-kit',
  },
  'new-hire': {
    label: 'New-hire orientation',
    kitSlug: 'new-hire-orientation-kit',
  },
  'several-areas': {
    label: 'Several connected areas',
    kitSlug: null,
    routeTo: 'compliance-readiness-visit',
  },
  'not-sure': {
    label: 'I am not sure',
    kitSlug: null,
    routeTo: 'service-assessment',
  },
};

// ────────────────────────────────────────────────────────────────
// Path-B answers map to a specific assessment service. This
// mirrors AssessmentSelector's decision logic (do NOT diverge from
// it, single source of truth is here).
// ────────────────────────────────────────────────────────────────
export const REVIEW_FOCUS_MAP = {
  floor: 'safety-walkthrough',
  documentation: 'documentation-readiness-review',
  both: 'compliance-readiness-visit',
  unsure: 'compliance-readiness-visit',
};

// ────────────────────────────────────────────────────────────────
// Path-E qualification gate. All four must be `true` for OSS to be
// recommended. Any `false` or `unsure` routes elsewhere.
// ────────────────────────────────────────────────────────────────
export const OSS_QUALIFICATION_KEYS = [
  'programsExist',
  'trainingCurrent',
  'correctiveActionsTracked',
  'primaryNeedRecurring',
];

// ────────────────────────────────────────────────────────────────
// Result-kind vocabulary. Consumers must not invent new kinds.
// ────────────────────────────────────────────────────────────────
export const RESULT_KIND = Object.freeze({
  SERVICE: 'service',
  KIT: 'kit',
  KIT_COMING_SOON: 'kit-coming-soon',
  STARTER_PACK: 'starter-pack',
});

// Path IDs mirror the mandate exactly (A/B/C/D/E) so tests can assert on them.
export const PATH_ID = Object.freeze({
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
});

// ────────────────────────────────────────────────────────────────
// Service catalog for the router. Keeps naming, price, included,
// not-included, and next-step aligned with the mandate copy.
// The three assessment services reuse assessmentCatalog data via
// getServiceRecommendation() so we do not duplicate it here.
// ────────────────────────────────────────────────────────────────
export const IMPLEMENTATION_SERVICES = {
  'corrective-action-implementation': {
    slug: 'corrective-action-implementation',
    name: 'Corrective Action Implementation',
    ctaShortName: 'Corrective Action Implementation',
    price: CORRECTIVE_ACTION_IMPLEMENTATION,
    route: '/services/corrective-action-implementation',
    intake: '/intake?service=corrective-action-implementation',
    included: [
      'Assignment of an owner to every open finding',
      'Target-date scheduling and closure tracking',
      'Documented corrective-action evidence per finding',
      'Written or photographic closure verification',
      'A closed-loop corrective-action log',
    ],
    notIncluded: [
      'Initial floor walkthrough (see Safety Walkthrough)',
      'Documentation review (see Documentation Readiness Review)',
      'Ongoing monthly retainer (see Ongoing Safety Support)',
    ],
    nextStep:
      'Share the current findings list, agree on scope, and receive a fixed quote before any implementation work begins.',
  },
  'safety-control-system-buildout': {
    slug: 'safety-control-system-buildout',
    name: 'Safety Control System',
    ctaShortName: 'Safety Control System',
    price: SAFETY_CONTROL_SYSTEM_BUILDOUT,
    route: '/services/safety-control-system-buildout',
    intake: '/intake?service=safety-control-system-buildout',
    included: [
      'Site-specific written safety-program buildout',
      'Digital-first documentation structure',
      'Training-record and evidence organization',
      'Corrective-action log baseline',
      'Supervisor handoff at delivery',
    ],
    notIncluded: [
      'Software license or SaaS subscription',
      'Generic template binder without site tailoring',
      'Ongoing monthly retainer (see Ongoing Safety Support)',
    ],
    nextStep:
      'Request the buildout, share your operation profile, and receive a fixed quote and delivery timeline.',
  },
  'ongoing-safety-support': {
    slug: 'ongoing-safety-support',
    name: 'Ongoing Safety Support',
    ctaShortName: 'Ongoing Safety Support',
    price: ONGOING_SAFETY_SUPPORT,
    route: '/ongoing-safety-support',
    intake: '/intake?service=ongoing-safety-support',
    included: [
      'One scheduled on-site visit per month',
      'Corrective-action tracker updates',
      'Records review',
      'Monthly management report',
    ],
    notIncluded: [
      'Buildout of missing written programs (see Safety Control System)',
      'Initial diagnostic (see Compliance Readiness Visit)',
      'Implementation labor on legacy open findings (see Corrective Action Implementation)',
    ],
    nextStep:
      'Confirm foundation qualification, agree on the monthly cadence, and receive a fixed quote before scheduling.',
  },
};

// Cached exports to keep test-time introspection simple.
export const REGISTERED_KIT_SLUGS = Object.freeze(Object.keys(KIT_REGISTRY));
export const RELEASED_KIT_SLUGS = Object.freeze(
  REGISTERED_KIT_SLUGS.filter((slug) => KIT_REGISTRY[slug].ready === true),
);
export const COMING_SOON_KIT_SLUGS = Object.freeze(
  REGISTERED_KIT_SLUGS.filter((slug) => KIT_REGISTRY[slug].ready === false),
);

// ────────────────────────────────────────────────────────────────
// Assessment-service metadata is imported lazily to avoid a hard
// circular dependency between the two data modules.
// ────────────────────────────────────────────────────────────────
function loadAssessmentService(slug) {
  // eslint-disable-next-line global-require
  const { ASSESSMENT_SERVICES } = require('./assessmentCatalog');
  return ASSESSMENT_SERVICES[slug] || null;
}

// ────────────────────────────────────────────────────────────────
// Builders that return uniform result payloads for the result card.
// Each returns { kind, slug, name, price, why, included, notIncluded,
//   nextStep, alternative, disclaimer, primaryAction, handoff }.
// ────────────────────────────────────────────────────────────────
function buildServiceResult({ slug, why, alternativeSlug, pathId, answers }) {
  const svc = loadAssessmentService(slug) || IMPLEMENTATION_SERVICES[slug];
  if (!svc) {
    throw new Error(`Unknown service slug: ${slug}`);
  }
  const alt = alternativeSlug
    ? loadAssessmentService(alternativeSlug) || IMPLEMENTATION_SERVICES[alternativeSlug]
    : null;

  const included = svc.deliverables || svc.included || [];
  const notIncluded = svc.notIncluded || [];

  return {
    kind: RESULT_KIND.SERVICE,
    pathId,
    slug: svc.slug,
    name: svc.name,
    price: svc.price,
    why,
    included,
    notIncluded,
    nextStep: svc.nextStep,
    alternative: alt
      ? {
          slug: alt.slug,
          name: alt.name,
          price: alt.price,
          route: alt.route,
        }
      : null,
    disclaimer: STARTING_PRICE_DISCLAIMER,
    primaryAction: {
      kind: 'service',
      label: `Request ${svc.ctaShortName || svc.name}`,
      href: svc.intake,
    },
    handoff: buildHandoff({
      offer: svc.slug,
      pathId,
      answers,
      leadSource: 'recommendation-router',
    }),
  };
}

function buildKitResult({ kitSlug, edition, why, alternativeSlug, pathId, answers }) {
  const kit = KIT_REGISTRY[kitSlug];
  if (!kit) {
    throw new Error(`Unknown kit slug: ${kitSlug}`);
  }
  const editionEntry = edition ? KIT_EDITIONS[edition] : null;

  if (kit.ready === false) {
    // Coming-soon path, purchase-CTA MUST NOT be produced. Route to a
    // clearly labeled unavailable result plus the CRV as the currently
    // available alternative unless a caller overrides.
    const altSvc = alternativeSlug
      ? loadAssessmentService(alternativeSlug) || IMPLEMENTATION_SERVICES[alternativeSlug]
      : loadAssessmentService('compliance-readiness-visit');
    return {
      kind: RESULT_KIND.KIT_COMING_SOON,
      pathId,
      slug: kit.slug,
      name: kit.name,
      price: null,
      why,
      included: [
        'Notification when the kit is released',
        'No card charged and no automatic enrollment',
      ],
      notIncluded: [
        'A purchase path today, this kit is not released yet',
        'A dated launch commitment',
      ],
      nextStep:
        'Join the waitlist. In the meantime, the alternative below is the closest currently available path.',
      alternative: altSvc
        ? {
            slug: altSvc.slug,
            name: altSvc.name,
            price: altSvc.price,
            route: altSvc.route,
          }
        : null,
      disclaimer:
        'This kit is not released. Any release date shown is aspirational, not a commitment. GigLine will notify waitlisted requesters when the kit ships.',
      primaryAction: {
        kind: 'waitlist',
        label: `Join the ${kit.name} waitlist`,
        href: kit.route,
      },
      handoff: buildHandoff({
        offer: null,
        kitSlug: kit.slug,
        pathId,
        answers,
        leadSource: 'recommendation-router',
      }),
    };
  }

  // Special-case: HazCom Starter Pack, no edition selection, $29 flat.
  if (kit.slug === 'hazcom-starter-pack') {
    return {
      kind: RESULT_KIND.STARTER_PACK,
      pathId,
      slug: kit.slug,
      name: kit.name,
      price: HAZCOM_STARTER_PACK,
      why,
      included: [
        '11-page starter pack, HazCom essentials',
        'Written program starter, SDS binder checklist, training log template',
        'Immediate digital download',
      ],
      notIncluded: [
        'Machine-specific procedures (see LOTO Readiness Kit)',
        'Full chemical-control system (see HazCom Pro Kit)',
        'Physical binder shipment (Pro Kit only)',
      ],
      nextStep:
        'Purchase the $29 Starter Pack and use it as the first step toward the HazCom Pro Kit if you need the full system later.',
      alternative: {
        slug: 'hazcom-pro-kit',
        name: 'HazCom Pro Kit',
        price: KIT_PRICES.digital,
        route: KIT_REGISTRY['hazcom-pro-kit'].route,
      },
      disclaimer: STARTING_PRICE_DISCLAIMER,
      primaryAction: {
        kind: 'kit',
        label: 'View the $29 HazCom Starter Pack',
        href: kit.route,
      },
      handoff: buildHandoff({
        offer: null,
        kitSlug: kit.slug,
        pathId,
        answers,
        leadSource: 'recommendation-router',
      }),
    };
  }

  const edLabel = editionEntry ? editionEntry.label : 'Digital Compliance Kit';
  const edPrice = editionEntry ? editionEntry.price : KIT_PRICES.digital;

  return {
    kind: RESULT_KIND.KIT,
    pathId,
    slug: kit.slug,
    edition: editionEntry ? editionEntry.key : 'digital',
    editionLabel: edLabel,
    name: `${kit.name}, ${edLabel}`,
    price: edPrice,
    why,
    included: editionIncluded(editionEntry ? editionEntry.key : 'digital'),
    notIncluded: editionNotIncluded(editionEntry ? editionEntry.key : 'digital'),
    nextStep:
      'View the kit page, confirm the edition, and complete checkout when ready.',
    alternative: alternativeSlug
      ? (() => {
          const alt = loadAssessmentService(alternativeSlug) || IMPLEMENTATION_SERVICES[alternativeSlug];
          return alt
            ? { slug: alt.slug, name: alt.name, price: alt.price, route: alt.route }
            : null;
        })()
      : null,
    disclaimer: STARTING_PRICE_DISCLAIMER,
    primaryAction: {
      kind: 'kit',
      label: `View the ${kit.name}`,
      href: `${kit.route}?edition=${editionEntry ? editionEntry.key : 'digital'}`,
    },
    handoff: buildHandoff({
      offer: null,
      kitSlug: kit.slug,
      edition: editionEntry ? editionEntry.key : 'digital',
      pathId,
      answers,
      leadSource: 'recommendation-router',
    }),
  };
}

export function editionIncluded(edition) {
  if (edition === 'binder') {
    return [
      'Everything in the Digital kit',
      'Everything in the Compliance Control System',
      'Shipped, tab-labeled inspector-ready binder',
      'Free USPS Priority shipping',
    ];
  }
  if (edition === 'controlSystem') {
    return [
      'Everything in the Digital kit',
      'Control and tracking tools that make the paperwork auditable',
      'Instant digital delivery',
    ];
  }
  return [
    'All required documents for the control area',
    'Implementation guidance and completion checklists',
    'Instant digital delivery',
  ];
}

export function editionNotIncluded(edition) {
  if (edition === 'binder') {
    return [
      'On-site GigLine visit (see Safety Walkthrough or CRV)',
      'Documentation review of your existing programs (see Documentation Readiness Review)',
    ];
  }
  if (edition === 'controlSystem') {
    return [
      'Shipped physical binder (see Inspector-Ready Binder Edition)',
      'On-site visit or documentation review',
    ];
  }
  return [
    'Control-and-tracking tools (see Compliance Control System)',
    'Shipped physical binder (see Inspector-Ready Binder Edition)',
    'On-site visit or documentation review',
  ];
}

// ────────────────────────────────────────────────────────────────
// Private handoff builder. Enforces the URL / session split.
// ────────────────────────────────────────────────────────────────

// Answer codes and any free-text responses live in `sessionPayload`.
// URL is limited to non-sensitive strings only.
const SAFE_URL_KEYS = Object.freeze([
  'service',
  'kit',
  'edition',
  'ref',
  'lead_source',
]);

/**
 * Returns { urlParams, urlQuery, sessionPayload, sessionKey }.
 * - `urlParams` is a plain object suitable for URLSearchParams.
 * - `urlQuery` is the encoded string (starts with `?` when non-empty).
 * - `sessionPayload` is the private object caller must store in
 *   sessionStorage under `sessionKey`.
 */
export function buildHandoff({ offer, kitSlug, edition, pathId, answers, leadSource, referringRoute }) {
  const urlParams = {};
  if (offer) urlParams.service = offer;
  if (kitSlug) urlParams.kit = kitSlug;
  if (edition) urlParams.edition = edition;
  if (referringRoute) urlParams.ref = referringRoute;
  if (leadSource) urlParams.lead_source = leadSource;

  const sanitized = Object.fromEntries(
    Object.entries(urlParams).filter(([k]) => SAFE_URL_KEYS.includes(k)),
  );

  const search = new URLSearchParams(sanitized).toString();
  const urlQuery = search ? `?${search}` : '';

  const sessionPayload = {
    pathId: pathId || null,
    answers: answers || null,
    createdAt: null, // caller stamps when writing to sessionStorage
  };

  return {
    urlParams: sanitized,
    urlQuery,
    sessionKey: 'gl_recommendation_handoff',
    sessionPayload,
  };
}

// ────────────────────────────────────────────────────────────────
// PATH A, specific control gap.
// Input: { primaryAim: 'A', controlArea, edition, originalArea? }
// Returns a uniform result payload OR routes to service-assessment
// (Path B seed) when the buyer says "several areas" / "not sure".
// ────────────────────────────────────────────────────────────────
export function recommendPathA({ controlArea, edition, answers }) {
  const entry = CONTROL_AREA_MAP[controlArea];
  if (!entry) {
    throw new Error(`Unknown control area: ${controlArea}`);
  }

  if (entry.kitSlug) {
    const kit = KIT_REGISTRY[entry.kitSlug];
    const why = kit.ready
      ? `You told us the priority is ${entry.label}. The ${kit.name} is the packaged system built for that control area.`
      : `You told us the priority is ${entry.label}. The ${kit.name} is in build and not currently released; the alternative below is the closest available path today.`;
    return buildKitResult({
      kitSlug: entry.kitSlug,
      edition,
      why,
      pathId: PATH_ID.A,
      answers,
    });
  }

  if (entry.routeTo === 'compliance-readiness-visit') {
    return buildServiceResult({
      slug: 'compliance-readiness-visit',
      why:
        'You told us several connected areas need work. A Compliance Readiness Visit is the single engagement that covers the floor and the files together, and it saves $500 versus purchasing the two standard scopes separately.',
      alternativeSlug: 'safety-walkthrough',
      pathId: PATH_ID.A,
      answers,
    });
  }

  // "Not sure" hands the buyer to Path B's diagnostic branch.
  return {
    kind: 'route-to-path',
    routeToPath: PATH_ID.B,
    reason: 'Buyer picked "I am not sure" on Path A control area.',
    pathId: PATH_ID.A,
  };
}

// ────────────────────────────────────────────────────────────────
// PATH B, need to identify gaps. Uses the same decision logic as
// AssessmentSelector's Q1: floor / documentation / both / unsure.
// ────────────────────────────────────────────────────────────────
export function recommendPathB({ reviewFocus, answers }) {
  const slug = REVIEW_FOCUS_MAP[reviewFocus];
  if (!slug) {
    throw new Error(`Unknown reviewFocus: ${reviewFocus}`);
  }

  const why =
    reviewFocus === 'floor'
      ? 'You want an outside review of what a walkthrough will find on the floor. A Safety Walkthrough is the narrow, floor-only scope with photo documentation.'
      : reviewFocus === 'documentation'
      ? 'You want your written programs, training records, SDS, and recordkeeping reviewed against the standards. A Documentation Readiness Review is the file-only scope.'
      : `You need both surfaces reviewed, or you are not sure yet. A Compliance Readiness Visit combines the walkthrough and the documentation review in one engagement. ${COMBINED_SAVINGS_STATEMENT}`;

  const alternativeSlug =
    slug === 'compliance-readiness-visit' ? 'safety-walkthrough' : 'compliance-readiness-visit';

  return buildServiceResult({
    slug,
    why,
    alternativeSlug,
    pathId: PATH_ID.B,
    answers,
  });
}

// ────────────────────────────────────────────────────────────────
// PATH C, close known findings.
// If the buyer confirms they already have a documented findings list,
// recommend Corrective Action Implementation. Otherwise route back
// to the appropriate assessment.
// ────────────────────────────────────────────────────────────────
export function recommendPathC({ hasFindingsList, answers }) {
  if (hasFindingsList !== true) {
    return {
      kind: 'route-to-path',
      routeToPath: PATH_ID.B,
      reason:
        'Corrective Action Implementation is for closing existing findings. Without a documented list, the correct starting point is the assessment.',
      pathId: PATH_ID.C,
    };
  }
  return buildServiceResult({
    slug: 'corrective-action-implementation',
    why:
      'You have a documented findings list and you need those findings assigned, tracked, and closed with evidence. Corrective Action Implementation delivers exactly that scope, most projects begin at $2,500.',
    alternativeSlug: 'compliance-readiness-visit',
    pathId: PATH_ID.C,
    answers,
  });
}

// ────────────────────────────────────────────────────────────────
// PATH D, build the system.
// ────────────────────────────────────────────────────────────────
export function recommendPathD({ answers }) {
  return buildServiceResult({
    slug: 'safety-control-system-buildout',
    why:
      'You need an organized, site-specific safety-control system rather than one isolated kit or a diagnostic. The Safety Control System is a digital-first buildout that ties the programs, records, and corrective-action tracking together.',
    alternativeSlug: 'compliance-readiness-visit',
    pathId: PATH_ID.D,
    answers,
  });
}

// ────────────────────────────────────────────────────────────────
// PATH E, maintain a working foundation. All four qualification
// keys must be `true`. Any false or unsure routes elsewhere.
// ────────────────────────────────────────────────────────────────
export function recommendPathE({ qualifications, primaryGap, answers }) {
  const q = qualifications || {};
  const allYes = OSS_QUALIFICATION_KEYS.every((k) => q[k] === true);

  if (allYes) {
    return buildServiceResult({
      slug: 'ongoing-safety-support',
      why:
        'Your written programs, training records, and corrective-action tracking are in place, and your primary need is recurring review and accountability. Ongoing Safety Support is the maintenance scope, $1,850 per month.',
      alternativeSlug: 'compliance-readiness-visit',
      pathId: PATH_ID.E,
      answers,
    });
  }

  // Route to the appropriate build/diagnostic depending on where the
  // foundation is weak.
  const gap = primaryGap || detectGap(q);

  if (gap === 'unknown' || gap === 'connected') {
    return buildServiceResult({
      slug: 'compliance-readiness-visit',
      why:
        'Ongoing Safety Support fits operations whose foundation is already in place. Your answers point to unknown or connected gaps, so a Compliance Readiness Visit is the correct starting point.',
      alternativeSlug: 'documentation-readiness-review',
      pathId: PATH_ID.E,
      answers,
    });
  }
  if (gap === 'open-findings') {
    return buildServiceResult({
      slug: 'corrective-action-implementation',
      why:
        'Ongoing Safety Support fits operations whose corrective actions are already being tracked to closure. You have known open findings, Corrective Action Implementation is the correct next scope.',
      alternativeSlug: 'compliance-readiness-visit',
      pathId: PATH_ID.E,
      answers,
    });
  }
  if (gap === 'missing-system') {
    return buildServiceResult({
      slug: 'safety-control-system-buildout',
      why:
        'Ongoing Safety Support fits operations whose written programs and records already exist. Your answers point to a missing underlying system, the Safety Control System is the correct next scope.',
      alternativeSlug: 'compliance-readiness-visit',
      pathId: PATH_ID.E,
      answers,
    });
  }
  // Documentation-only uncertainty
  return buildServiceResult({
    slug: 'documentation-readiness-review',
    why:
      'Ongoing Safety Support fits operations with documentation already reviewed and current. Your answers point to documentation-only uncertainty, a Documentation Readiness Review is the correct next scope.',
    alternativeSlug: 'compliance-readiness-visit',
    pathId: PATH_ID.E,
    answers,
  });
}

function detectGap(q) {
  if (q.programsExist === false || q.programsExist === 'unsure') return 'missing-system';
  if (q.correctiveActionsTracked === false) return 'open-findings';
  if (q.trainingCurrent === false || q.trainingCurrent === 'unsure') return 'documentation';
  if (q.primaryNeedRecurring === false) return 'connected';
  return 'unknown';
}

// ────────────────────────────────────────────────────────────────
// Top-level dispatcher. Consumers pass { primaryAim, ...pathInput }.
// Returns a uniform result payload. Never throws for the mandate's
// documented answer set.
// ────────────────────────────────────────────────────────────────
export function recommend({ primaryAim, ...input }) {
  if (primaryAim === PATH_ID.A) return recommendPathA(input);
  if (primaryAim === PATH_ID.B) return recommendPathB(input);
  if (primaryAim === PATH_ID.C) return recommendPathC(input);
  if (primaryAim === PATH_ID.D) return recommendPathD(input);
  if (primaryAim === PATH_ID.E) return recommendPathE(input);
  throw new Error(`Unknown primaryAim: ${primaryAim}`);
}

// ────────────────────────────────────────────────────────────────
// Helpers exposed for tests + result-card use.
// ────────────────────────────────────────────────────────────────
export function isKitReleased(slug) {
  const kit = KIT_REGISTRY[slug];
  return !!(kit && kit.ready === true);
}

export function getKitEdition(key) {
  return KIT_EDITIONS[key] || null;
}
