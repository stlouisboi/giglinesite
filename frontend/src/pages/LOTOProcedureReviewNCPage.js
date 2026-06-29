import React from 'react';
import ServiceLandingPage from '../components/ServiceLandingPage';

const config = {
  slug: 'loto-procedure-review-nc',
  canonical: '/loto-procedure-review-nc',
  seoTitle: 'Lockout Tagout Procedure Review NC | GigLine Safety & Compliance',
  seoDescription: 'On-site Lockout/Tagout (LOTO) procedure review for NC manufacturers and fabricators. Machine-specific procedures, authorized employee training, annual audit. 29 CFR 1910.147. From $1,200.',
  eyebrow: 'LOTO Procedure Review',
  headline: 'Lockout/Tagout Procedure Review for NC operations.',
  subhead: 'LOTO failures are one of OSHA\u2019s top fatality-driver standards. A focused on-site review of your machine-specific procedures, authorized employee training, energy-isolation hardware, and annual audit \u2014 written report in 48 hours.',
  whoFor: {
    title: 'Built for operations with energized production equipment.',
    items: [
      'Metals fabricators, plastics, food processing, and other manufacturers with energized equipment',
      'Operations that perform maintenance, setup, clearing jams, or blade changes',
      'Facilities that have grown beyond a "we all know the equipment" verbal procedure',
      'Plant managers who suspect their LOTO procedures were written generically and never matched to actual machines',
    ],
  },
  commonFindings: [
    'No machine-specific LOTO procedures \u2014 only a generic written program',
    'Authorized employee training not documented (or dated more than 12 months ago)',
    'Annual LOTO procedure audit not performed or not documented',
    'Energy-isolation devices missing, mismatched, or not unique per employee',
    'Outside contractors performing maintenance without a verified LOTO program of their own',
    'No documented procedure for clearing jams, blade changes, or other "minor servicing" tasks that still require LOTO',
  ],
  whatReviewed: [
    'Written LOTO program against 29 CFR 1910.147',
    'Each energized machine: is there a written, machine-specific procedure?',
    'Authorized vs. affected vs. other-employee training records',
    'Annual LOTO audit documentation',
    'Lockout hardware: locks, hasps, tags, lockboxes — quantity and condition',
    'Group lockout / multi-employee procedures where applicable',
    'Contractor LOTO coordination if outside maintenance is used',
  ],
  reportIncludes: [
    'Photo-documented finding list against 29 CFR 1910.147',
    'Severity priority (high / medium / low) per finding',
    'Per-machine procedure template for any machine missing a written procedure',
    'Authorized employee training roster template if missing',
    'Annual LOTO audit template if missing',
    'A "top 5 fixes" summary the plant manager can hand to the maintenance team',
  ],
  cfrRef: '29 CFR 1910.147 (The Control of Hazardous Energy / Lockout-Tagout)',
  priceFrom: 'From $1,200',
  ctaPath: '/intake?service=loto-procedure-review&utm_source=loto-landing&utm_medium=website&utm_campaign=service-landing',
};

const LOTOProcedureReviewNCPage = () => <ServiceLandingPage config={config} />;

export default LOTOProcedureReviewNCPage;
