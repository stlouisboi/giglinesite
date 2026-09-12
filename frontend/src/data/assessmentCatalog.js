/**
 * Central catalog for GigLine assessment services.
 * Single source of truth. Every service page, comparison card, selector
 * result, and price string reads from here.
 */
import {
  SAFETY_WALKTHROUGH,
  DOCUMENTATION_REVIEW,
  COMPLIANCE_READINESS_VISIT,
  COMBINED_SEPARATE_TOTAL,
  COMBINED_SAVINGS,
  COMBINED_SAVINGS_STATEMENT,
} from './servicePricing';

export const ASSESSMENT_SERVICES = {
  'safety-walkthrough': {
    slug: 'safety-walkthrough',
    name: 'Safety Walkthrough',
    ctaShortName: 'Safety Walkthrough',
    price: SAFETY_WALKTHROUGH,
    route: '/safety-walkthrough',
    intake: '/intake?service=safety-walkthrough',
    bestFit:
      'The buyer primarily needs an independent review of physical workplace conditions.',
    focus: 'floor',
    tagline: 'Floor-level findings, photo documented.',
    deliverables: [
      'On-site walkthrough',
      'Photo-documented findings',
      'OSHA-related references where applicable',
      'Prioritized corrective actions',
      'Top 10 Fixes summary',
      'Written report within 48 hours',
    ],
    notIncluded: [
      'Written program, training record, or SDS review',
      'Recordkeeping and OSHA 300 log audit',
      'Documentation cross-check against floor conditions',
    ],
    nextStep:
      'Request the walkthrough, agree on an on-site date, and receive the written report within 48 hours of the visit.',
    label: null,
  },
  'documentation-readiness-review': {
    slug: 'documentation-readiness-review',
    name: 'Documentation Readiness Review',
    ctaShortName: 'Documentation Review',
    price: DOCUMENTATION_REVIEW,
    route: '/documentation-gap-check',
    intake: '/intake?service=documentation-readiness-review',
    bestFit:
      'The floor may be under control, but written programs, training records, SDS files, inspections, or recordkeeping need to be evaluated.',
    focus: 'documentation',
    tagline: 'Every written program and record against the standard.',
    deliverables: [
      'Structured documentation inventory',
      'Written-program review',
      'Training-record review',
      'SDS and HazCom documentation review',
      'Missing and expired-record findings',
      'Prioritized documentation corrective actions',
      'Findings-review call',
    ],
    notIncluded: [
      'On-site walkthrough of the physical floor',
      'Photo-documented hazard findings',
      'Cross-check between binder and floor reality',
    ],
    nextStep:
      'Request the review, share your programs and records securely, and receive the written findings report within 48 hours.',
    label: null,
  },
  'compliance-readiness-visit': {
    slug: 'compliance-readiness-visit',
    name: 'Compliance Readiness Visit',
    ctaShortName: 'Compliance Readiness Visit',
    price: COMPLIANCE_READINESS_VISIT,
    route: '/osha-compliance-gap-check',
    intake: '/intake?service=compliance-readiness-visit',
    bestFit:
      'The buyer does not know whether the largest gaps are on the floor, in the documentation, or both.',
    focus: 'both',
    tagline: 'The floor and the files, cross-checked in one engagement.',
    deliverables: [
      'Safety Walkthrough',
      'Documentation Readiness Review',
      'Floor and documentation cross-check',
      'Prioritized corrective-action list',
      '30-day roadmap',
      'Combined findings review',
    ],
    notIncluded: [
      'Corrective-action implementation labor (separately quoted)',
      'Digital control-system buildout (separately quoted)',
      'Ongoing retainer or monthly support',
    ],
    nextStep:
      'Request the visit, agree on an on-site date, share documentation securely, and receive the combined findings report with a 30-day roadmap.',
    label: 'BEST VALUE',
    combined: {
      separateTotal: COMBINED_SEPARATE_TOTAL,
      savings: COMBINED_SAVINGS,
      statement: COMBINED_SAVINGS_STATEMENT,
    },
  },
};

export const ASSESSMENT_ORDER = [
  'safety-walkthrough',
  'documentation-readiness-review',
  'compliance-readiness-visit',
];

export const ASSESSMENT_CATALOG = ASSESSMENT_ORDER.map(
  (slug) => ASSESSMENT_SERVICES[slug]
);

export const getAssessment = (slug) => ASSESSMENT_SERVICES[slug] || null;

// Fixed disclaimer text every result card must render verbatim.
export const STARTING_PRICE_DISCLAIMER =
  'Starting prices apply to the standard scope. Final pricing is confirmed through a fixed quote before scheduling.';

export default ASSESSMENT_CATALOG;
