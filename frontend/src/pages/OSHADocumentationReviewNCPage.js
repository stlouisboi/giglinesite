import React from 'react';
import ServiceLandingPage from '../components/ServiceLandingPage';

const config = {
  slug: 'osha-documentation-review-nc',
  canonical: '/osha-documentation-review-nc',
  seoTitle: 'OSHA Documentation Review NC | Written Programs, Training, OSHA 300 | GigLine',
  seoDescription: 'Off-site OSHA documentation readiness review for NC manufacturers, warehouses, and contractors. Written programs, training records, OSHA 300 log, SDS binder, retention. From $1,700.',
  eyebrow: 'OSHA Documentation Review',
  headline: 'OSHA Documentation Review for NC operations.',
  subhead: 'The paperwork OSHA, your insurance carrier, or a customer auditor asks for first. An off-site readiness review of your written programs, training records, OSHA 300/300A logs, SDS inventory, and retention practices \u2014 written report in 48 hours.',
  whoFor: {
    title: 'Built for operations whose binder may not match their floor.',
    items: [
      'Small manufacturers, warehouses, and contractors without a full-time safety manager',
      'Operations preparing for a customer audit, insurance loss control visit, or new contract',
      'HR managers asked by leadership whether the safety records are "ready"',
      'Operations that have inherited a binder from a previous owner, manager, or template package',
    ],
  },
  commonFindings: [
    'Written programs exist but were never updated when equipment, chemicals, or workflows changed',
    'OSHA 300 log incomplete, blank, or missing the 300A summary from the prior year',
    'SDS binder contains products no longer in use; missing SDS for products currently on the floor',
    'Training records exist for some employees, not all \u2014 or stop at hire date with no refresher',
    'PPE Hazard Assessment never written, or written generically and not by task',
    'Emergency Action Plan does not match the actual building, exits, or evacuation roles',
  ],
  whatReviewed: [
    'Written safety programs: HazCom, LOTO, PPE, EAP, Bloodborne Pathogens, etc.',
    'Training records: hire date, refresher cadence, machine-specific certifications',
    'OSHA 300 log + 300A summary + injury and illness recordkeeping',
    'SDS inventory cross-referenced to chemicals actually on site',
    'PPE Hazard Assessment by task / position',
    'Document retention: 5-year rule, terminated employee records, training certificates',
    'Inspection logs: fire extinguisher, eye wash, forklift pre-shift, etc.',
  ],
  reportIncludes: [
    'Document-by-document finding list with CFR citation per gap',
    'Severity priority (high / medium / low)',
    'A prioritized corrective action plan with target completion dates',
    'Templates for any missing documents the operation can adopt as-is',
    'A "top 5 documents to fix first" summary',
    'Optional referral to Document Development if multiple programs need to be written',
  ],
  cfrRef: '29 CFR Part 1904 (Recordkeeping) and applicable Subpart standards',
  priceFrom: 'From $1,300',
  ctaPath: '/intake?service=osha-documentation-review&utm_source=docreview-landing&utm_medium=website&utm_campaign=service-landing',
};

const OSHADocumentationReviewNCPage = () => <ServiceLandingPage config={config} />;

export default OSHADocumentationReviewNCPage;
