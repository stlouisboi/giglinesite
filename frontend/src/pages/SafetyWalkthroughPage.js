import React from 'react';
import ServiceLandingTemplate from '../components/ServiceLandingTemplate';

const SafetyWalkthroughPage = () => (
  <ServiceLandingTemplate
    seoTitle="Safety Walkthrough — On-Site OSHA Review for NC Operations"
    seoDescription="On-site safety walkthrough for manufacturers, warehouses, contractors, and fleet operations across North Carolina. Photo-documented findings, OSHA references, and a written report in 48 hours. Starting at $1,200."
    canonical="/safety-walkthrough"
    eyebrow="Service · Safety Walkthrough"
    headline="On-Site Safety Walkthroughs for Manufacturers, Warehouses, Contractors & Fleets."
    subheadline="A trained outside eye on your floor. We walk your operation the way an OSHA Compliance Officer would, flag what would get cited, and hand you a written, prioritized fix list within 48 hours."
    priceLine="Starting at $1,200 · Fixed quote before scheduling · No retainer."
    whoItsFor={{
      intro: 'This is the right engagement if any of these describe your operation:',
      bullets: [
        'Small to mid-size manufacturer, warehouse, distribution center, contractor, or fleet operation in North Carolina.',
        'Typically 5 to 100 employees with no full-time safety manager on staff.',
        'You have OSHA on the calendar — a scheduled inspection, an audit, or a renewal review.',
        'You had a recordable injury, near-miss, or insurance flag and need to know what else is exposed.',
        "You've expanded — new equipment, new building, new headcount — and want a fresh set of eyes.",
      ],
    }}
    theProblem={{
      intro:
        'Most small operations run safe by habit, not by program. The gaps are not lazy problems — they are the kind of things that drift when nobody has the bandwidth to walk the floor with a clipboard. Then OSHA shows up, or an injury happens, and the exposure becomes obvious.',
      bullets: [
        'Blocked electrical panels and partially obstructed egress paths.',
        'Forklift certifications older than three years, missing pre-shift inspection logs.',
        'Missing or inadequate machine guarding on press lines, mills, and saws.',
        "No written lockout-tagout procedures or annual program audit.",
        'Housekeeping drift in pedestrian aisles and around press lines.',
      ],
    }}
    whatIsReviewed={{
      intro:
        'A standard walkthrough runs 1 to 3 hours on-site, covering the same OSHA standards an inspector would focus on for general industry, warehousing, and small construction operations.',
      bullets: [
        'Walking-working surfaces, aisle clearance, and emergency egress (29 CFR 1910.22, 1910.37).',
        'Electrical panel clearance, arc flash labeling, and energized work practices (29 CFR 1910.303-335).',
        'Machine guarding, point-of-operation protection, and energy control (29 CFR 1910.212, 1910.147).',
        'Powered industrial trucks — forklift certification, daily inspection, pedestrian separation (29 CFR 1910.178).',
        'Hazard communication — labeling, SDS access, written program (29 CFR 1910.1200).',
        'Personal protective equipment, fall protection, and ladder safety where applicable.',
        'Recordkeeping — OSHA 300 log, 300A summary, training records.',
      ],
    }}
    whatYouReceive={{
      intro:
        'Every walkthrough produces a written report — no verbal-only summaries. Reports are delivered as a PDF within 24 to 48 hours of the on-site visit.',
      bullets: [
        'Photo-documented findings — what was observed and where.',
        'OSHA-related references where applicable.',
        'A plain-language corrective action for each item — what to fix and how.',
        'Color-coded priorities: RED (fix this week), AMBER (fix this month), GREEN (reinforce what is working).',
        "A 'Top 10 Fixes' summary so you know where to start Monday morning.",
        'Private engagement — nothing leaves your facility except the report we hand you.',
      ],
    }}
    nextSteps={{
      intro:
        'Two ways to start. Both end with a fixed quote and a confirmed walkthrough date.',
      steps: [
        { label: 'Request a Walkthrough', desc: 'Fill the 4-field form on the request page. Takes about 60 seconds. You get a response within one business day.' },
        { label: 'Start a Full Client Intake', desc: 'Use the master intake form if you already know which service you need or want to share more detail about your operation, history, and timing.' },
        { label: 'Schedule the Visit', desc: 'We agree on a date and time that does not disrupt your shift. Most walkthroughs run during normal work hours.' },
        { label: 'Walkthrough On-Site', desc: '1 to 3 hours on the floor. We document hazards and ask supervisors and operators the same questions an OSHA Compliance Officer would ask.' },
        { label: 'Written Report in 48 Hours', desc: "PDF delivered to your inbox with photos, OSHA references, and prioritized fixes. You decide what to fix and in what order." },
      ],
    }}
    closingHeadline="If you're not sure what's exposed — start with a walkthrough."
  />
);

export default SafetyWalkthroughPage;
