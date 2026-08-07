import React from 'react';
import ServiceLandingPage from '../components/ServiceLandingPage';

const config = {
  slug: 'forklift-compliance-review-nc',
  canonical: '/forklift-compliance-review-nc',
  seoTitle: 'Forklift Safety Compliance Review NC | GigLine Safety & Compliance',
  seoDescription: 'On-site forklift / Powered Industrial Truck safety compliance review for NC manufacturers, warehouses, and distribution operations. 29 CFR 1910.178. Written report in 48 hours. From $1,300.',
  eyebrow: 'Forklift / PIT Compliance Review',
  headline: 'Forklift Safety Compliance Review for NC operations.',
  subhead: 'Powered Industrial Trucks are one of OSHA\u2019s most-cited general industry standards. A focused on-site review of your forklift program, daily inspections, operator certifications, and floor practices \u2014 written report in 48 hours.',
  whoFor: {
    title: 'Built for operations running 1 to 12 forklifts.',
    items: [
      'Small manufacturers and warehouses running propane, electric, or LPG forklifts',
      'Distribution and 3PL operations with multiple shifts and rotating operators',
      'Operations that have had a forklift near-miss, complaint, or recent operator turnover',
      'Plant managers who are not sure whether last year\u2019s operator certifications are still current',
    ],
  },
  commonFindings: [
    'Operator certifications expired or never documented in writing',
    'Daily pre-shift inspection logs incomplete, blank, or filled out from memory at end of day',
    'No site-specific evaluation of pedestrian traffic, blind corners, or load-handling zones',
    'Refresher training not performed after near-miss, damage, or operator change',
    'Forklifts operated with damaged forks, missing horn, broken seat belt, or missing data plate',
    'No documented refresher when a new attachment, fuel type, or trailer type is introduced',
  ],
  whatReviewed: [
    'Written Powered Industrial Truck program against your actual fleet',
    'Operator certification roster vs. current operators on the floor',
    'Daily pre-shift inspection sheets (sample audit)',
    'Forklift physical condition: tires, forks, seat belt, horn, lights, data plate',
    'Pedestrian / forklift separation, aisle marking, blind corner mirrors',
    'Charging area or propane storage compliance (NFPA / OSHA cross-reference)',
    'Documented refresher training following any near-miss or damage incident',
  ],
  reportIncludes: [
    'Photo-documented finding list against 29 CFR 1910.178',
    'Severity priority (high / medium / low) per finding',
    'Specific corrective actions for each gap, with CFR citation',
    'Operator certification roster template if missing',
    'Daily pre-shift inspection log template if missing',
    'A "top 5 fixes" summary the plant manager can hand to the floor',
  ],
  cfrRef: '29 CFR 1910.178 (Powered Industrial Trucks)',
  priceFrom: 'From $1,300',
  ctaPath: '/intake?service=forklift-compliance-review&utm_source=forklift-landing&utm_medium=website&utm_campaign=service-landing',
};

const ForkliftComplianceReviewNCPage = () => <ServiceLandingPage config={config} />;

export default ForkliftComplianceReviewNCPage;
