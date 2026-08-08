import React from 'react';
import ServiceLandingTemplate from '../components/ServiceLandingTemplate';

/* GL-WEB-008 staged content swap — see ServicesPage.js for details. */
const GL_WEB_008 = process.env.REACT_APP_GL_WEB_008_ENABLED === 'true';
const PRICE_LABEL = '$1,300';

const DocumentationGapCheckPage = () => (
  <ServiceLandingTemplate
    seoTitle="OSHA Documentation Readiness Review — Written Programs, SDS & Training Records"
    seoDescription={`Independent OSHA Documentation Readiness Review of your written safety programs, SDS binder, training records, and required OSHA documentation. Written findings report in 48 hours. Starting at ${PRICE_LABEL}. Serving NC manufacturers, warehouses, contractors, and fleets.`}
    canonical="/documentation-gap-check"
    eyebrow="Service · OSHA Documentation Readiness Review"
    headline="Independent Review of Your Safety Documentation — Programs, SDS & Training Records."
    subheadline="If OSHA opened your binder tomorrow, what would they find? An OSHA Documentation Readiness Review walks every written program, training record, and SDS file against the actual standards — and tells you exactly what is missing, expired, or out of date."
    priceLine={`Starting at ${PRICE_LABEL} · Fixed quote before scheduling · Remote-friendly or on-site.`}
    heroImage={{
      src: '/service-hero-doc-review.jpg',
      alt: 'GigLine Documentation Readiness Review — stack of navy hardcover safety-compliance binders with color-coded tabs, printed safety-program pages with highlighter and red pen, and a laptop showing a checklist on a manufacturing office desk',
    }}
    whoItsFor={{
      intro: 'This engagement is built for operations that have safety paperwork — but aren\'t sure it would hold up under an inspector\'s review.',
      bullets: [
        'Operations preparing for an OSHA inspection, insurance audit, or customer compliance review.',
        'New safety coordinator or office manager inheriting binders from a predecessor.',
        'Companies that have grown past the size where paperwork can stay informal — usually 10 to 100 employees.',
        'Contractors or fleet operators asked for documentation by a GC, insurer, or client.',
        'Anyone who suspects their written programs were copied off the internet and never tailored to their operation.',
      ],
    }}
    theProblem={{
      intro:
        'OSHA does not just look at the floor. They open binders. Most small operations have written programs that are either missing entirely, written for someone else\'s operation, or stuck three OSHA revisions behind. The gaps usually look like this:',
      bullets: [
        'No written Hazard Communication program, or one that does not match the chemicals actually on site.',
        'SDS binder missing sheets for current products, or full of expired sheets from products no longer in use.',
        'Forklift operator certifications older than three years with no documented refresher.',
        'Training records that exist but cannot be tied back to the specific employee, date, and standard.',
        'No written lockout-tagout procedures, or generic procedures that do not identify the actual energy sources on each machine.',
        'OSHA 300 log not maintained, or 300A summary never signed by a company executive.',
      ],
    }}
    whatIsReviewed={{
      intro:
        'An OSHA Documentation Readiness Review covers every written safety program, training record, and required document that an OSHA Compliance Officer would request during an inspection — typically delivered as a remote review with a follow-up call.',
      bullets: [
        'Written Hazard Communication program and SDS binder index against your actual chemical inventory.',
        'Lockout/Tagout written program, machine-specific procedures, and annual audit records.',
        'Powered Industrial Truck — operator certification list, training records, refresher dates, daily inspection logs.',
        'PPE hazard assessments and selection documentation per work area.',
        'Bloodborne pathogens exposure control plan, first-aid responder roster.',
        'Emergency Action Plan, evacuation drills, and post-drill documentation.',
        'Recordkeeping — OSHA 300 log, 300A annual summary, 5-year retention file.',
        'Training records — content, dates, instructor, employee acknowledgment.',
      ],
    }}
    whatYouReceive={{
      intro:
        'A written findings report listing every document reviewed, what is in place, what is missing, what needs updating — and what to do about each one.',
      bullets: [
        'Document-by-document inventory — what was reviewed and what was found.',
        'Gap analysis — missing programs, missing records, expired certifications.',
        'OSHA-related references where applicable for each gap so the exposure risk is explicit.',
        'Prioritized corrective action list — what to fix this week, this month, and this quarter.',
        'Plain-language templates and checklists for the most common missing programs.',
        'Optional 30-minute follow-up call to walk through findings.',
      ],
    }}
    nextSteps={{
      intro:
        'OSHA Documentation Readiness Reviews are usually remote-friendly. We ask you to share a small batch of programs and records securely, and the findings report comes back within 48 hours.',
      steps: [
        { label: 'Request a Documentation Readiness Review', desc: 'Use the master intake form and select "OSHA Documentation Readiness Review" as the service. You get a response within one business day.' },
        { label: 'Share Your Documents Securely', desc: 'We send a secure upload link or a prep checklist by email so you know exactly what to gather. No mailing physical binders.' },
        { label: 'Independent Review', desc: 'Vince reviews each program and record against the current OSHA standards. Most reviews complete in 4 to 8 hours of independent work.' },
        { label: 'Written Findings Report in 48 Hours', desc: 'PDF delivered to your inbox with the document-by-document inventory, readiness analysis, and prioritized corrective action recommendations.' },
        { label: 'Follow-Up Call (Optional)', desc: 'Schedule a 30-minute call to walk through findings, ask questions, and decide on next steps.' },
      ],
    }}
    closingHeadline="Find the paperwork gaps before OSHA does — with an OSHA Documentation Readiness Review."
  />
);

export default DocumentationGapCheckPage;
