import React from 'react';
import ServiceLandingTemplate from '../components/ServiceLandingTemplate';

const OshaComplianceGapCheckPage = () => (
  <ServiceLandingTemplate
    seoTitle="Compliance Readiness Visit — Pre-Inspection Review for NC Operations"
    seoDescription="Full Compliance Readiness Visit — combined on-site walkthrough and OSHA Documentation Readiness Review. Built for operations preparing for an OSHA inspection, audit, or insurance review. Written report in 48 hours. Serving NC manufacturers, warehouses, contractors, and fleets."
    canonical="/osha-compliance-gap-check"
    eyebrow="Service · Compliance Readiness Visit"
    headline="A Compliance Readiness Visit Before an Inspection, Audit, or Insurance Review."
    subheadline="The most thorough engagement GigLine offers. A combined on-site walkthrough and documentation review — covering the floor AND the binder — so you know exactly where you stand against the OSHA standards that apply to your operation."
    priceLine="From $2,500 · Baseline scope covers one facility, up to five core categories, up to 25 uploaded files, one findings-review call. Additional categories separately scoped. No retainer."
    whoItsFor={{
      intro: 'This is the right engagement if any of these describe where you are right now:',
      bullets: [
        'OSHA has a scheduled inspection on the calendar — or you have reason to think one is coming.',
        'You had a recordable injury, severe near-miss, or workers\' compensation flag that put compliance back on the agenda.',
        'Your insurance carrier or a major customer asked for documented evidence of an OSHA compliance review.',
        'You are merging, expanding, or being acquired and need a clean compliance baseline for due diligence.',
        'You inherited responsibility for safety and want a full, independent picture before deciding what to change.',
      ],
    }}
    theProblem={{
      intro:
        'A safety walkthrough catches what is exposed on the floor. An OSHA Documentation Readiness Review catches what is missing in the binder. An OSHA Compliance Officer looks at both — and most operations have gaps in both. A Compliance Readiness Visit is built to surface every one of them, in priority order, before the inspector does.',
      bullets: [
        'Floor conditions that contradict the written program — guards removed, panels blocked, exits obstructed.',
        'Training records that exist but cannot be matched to the employees and tasks observed on the floor.',
        'Programs written years ago that no longer match the equipment, chemicals, or workflow on site.',
        'Recordkeeping that looks complete until it gets cross-referenced against actual incident logs and OSHA 300 entries.',
        'Industry-specific exposures — combustible dust, heat, confined space, hazardous energy — that were never assessed.',
      ],
    }}
    whatIsReviewed={{
      intro:
        'A full Compliance Readiness Visit is the combination of a walkthrough and an OSHA Documentation Readiness Review, plus a cross-check between them. Typical engagements run 1 day on-site plus 2 to 3 days of independent review.',
      bullets: [
        'On-site walkthrough — every floor area, every work cell, every storage and egress path.',
        'Written program review — HazCom, LOTO, PIT, PPE, EAP, Bloodborne, and any industry-specific programs.',
        'Training record audit — every active employee mapped to required training, with expiration tracking.',
        'Recordkeeping audit — 300 log, 300A summary, 5-year retention file, incident reports.',
        'Cross-check — does the floor reality match the binder? Does the binder cover the floor reality?',
        'Industry-specific exposure check — heat, combustible dust, confined space, fall protection, machine-specific energy control.',
        'Interview-style walk with supervisors and operators — the same conversation an OSHA Compliance Officer would have.',
      ],
    }}
    whatYouReceive={{
      intro:
        'The most comprehensive deliverable GigLine produces. Built so an owner, plant manager, or safety lead can hand it to the team and start closing gaps Monday morning.',
      bullets: [
        'Executive summary — the 5 to 10 biggest exposures, in priority order, with citation-risk ranking.',
        'Floor findings — photo-documented hazards with OSHA-related references where applicable and corrective action recommendations.',
        'Documentation findings — written program gaps, missing records, expired certifications.',
        'Training matrix — every employee, every required training, current status and next due date.',
        'Recordkeeping report — what is in compliance, what needs reconstruction, what needs to be posted.',
        'A 30-60-90 day corrective action roadmap — what to close this week, this month, and this quarter.',
        'Optional follow-up call to brief leadership and assign owners to each open item.',
      ],
    }}
    nextSteps={{
      intro:
        'Most operations move quickly once they decide to do a Compliance Readiness Visit — especially when OSHA is already on the calendar. The first conversation is free.',
      steps: [
        { label: 'Start the Conversation', desc: 'Call (336) 329-8899 or start a client intake. We discuss your operation, your timing, and what triggered the request.' },
        { label: 'Receive a Custom Quote', desc: 'Compliance Readiness Visits are scoped to your size, industry, and timeline. Most quotes are returned within one business day.' },
        { label: 'Schedule the Engagement', desc: 'We agree on an on-site date and a documentation window. Most engagements complete within 7 to 14 days end-to-end.' },
        { label: 'On-Site Walkthrough + Documentation Review', desc: 'Typically 1 full day on-site followed by 2 to 3 days of independent documentation review and cross-check.' },
        { label: 'Written Compliance Report', desc: 'PDF delivered with executive summary, findings, training matrix, recordkeeping report, and 30-60-90 day roadmap.' },
        { label: 'Leadership Brief (Optional)', desc: 'Schedule a 60-minute call to walk owners, plant managers, and supervisors through findings and assign ownership.' },
      ],
    }}
    closingHeadline="Walk into the inspection with a closed gap list — not a surprise."
  />
);

export default OshaComplianceGapCheckPage;
