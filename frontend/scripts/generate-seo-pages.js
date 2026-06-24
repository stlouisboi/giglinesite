/**
 * Post-build SEO Pre-rendering Script — GL-PORT-001 Priority 1
 *
 * Generates per-route HTML files with:
 *   1. Correct meta tags (title, description, OG, Twitter, canonical)
 *   2. Real page content injected into the HTML body for crawlers
 *   3. LocalBusiness + FAQPage + Service + Person + BreadcrumbList JSON-LD
 *      injected directly into the <head> of every pre-rendered page so AI
 *      answer engines and classic crawlers see structured facts without JS.
 *
 * Runs after `craco build`.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const BASE_URL = 'https://www.giglinecompliance.com';

// ───────────────────────────────────────────────
// GL-WEB-008 — Staged content update for OSHA Documentation Readiness Review
// (Document Review Module / GL-SPEC-APP-002 launch). Flag stays false until
// Vince confirms conditions 1–5 in GL-WEB-008 Section 5.
// ───────────────────────────────────────────────
const GL_WEB_008 = process.env.REACT_APP_GL_WEB_008_ENABLED === 'true';
const DOC_REVIEW_DESCRIPTION = 'Two-layer review of your safety documentation. The first layer checks whether required programs exist — 53 items across seven OSHA categories. The second layer checks whether each document contains what it’s legally required to contain — element by element, standard by standard. You get a single compliance report covering both.';
const DOC_REVIEW_PRICE_NUM = '2500';
const DOC_REVIEW_PRICE_LABEL = '$1,300';
const SERVICES_META_DESCRIPTION = 'OSHA-readiness support for small industrial operations. GigLine helps manufacturers, warehouses, contractors, and fleet operations identify visible hazards, verify documentation compliance element by element, and resolve inspection-readiness issues before they become citations. Fixed pricing. No retainer.';

// ───────────────────────────────────────────────
// Shared schema fragments
// ───────────────────────────────────────────────
const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#business`,
  name: 'GigLine Safety & Compliance',
  description:
    'On-site OSHA safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, and contractors in North Carolina.',
  url: BASE_URL,
  telephone: '+13363298899',
  email: 'vince@giglinecompliance.com',
  image: `${BASE_URL}/og-image.png`,
  logo: `${BASE_URL}/gigline-logo-2026-v2.png`,
  founder: { '@type': 'Person', '@id': `${BASE_URL}/#vince`, name: 'Vince Lawrence' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kernersville',
    addressRegion: 'NC',
    postalCode: '27107',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 36.1198, longitude: -80.0735 },
  areaServed: [
    { '@type': 'State', name: 'North Carolina' },
    { '@type': 'City', name: 'Winston-Salem' },
    { '@type': 'City', name: 'Greensboro' },
    { '@type': 'City', name: 'High Point' },
    { '@type': 'City', name: 'Kernersville' },
    { '@type': 'City', name: 'Clemmons' },
    { '@type': 'City', name: 'Lexington' },
    { '@type': 'City', name: 'Thomasville' },
    { '@type': 'City', name: 'Mocksville' },
    { '@type': 'City', name: 'Asheboro' },
    { '@type': 'City', name: 'Salisbury' },
    { '@type': 'City', name: 'Burlington' },
    { '@type': 'City', name: 'Charlotte' },
    { '@type': 'City', name: 'Raleigh' },
  ],
  priceRange: '$750–$4500',
  openingHours: 'Mo-Fr 08:00-18:00',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Safety Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Safety Walkthrough & Top 10 Fixes Report' }, price: '650', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'OSHA Documentation Readiness Review' }, price: DOC_REVIEW_PRICE_NUM, priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Incident Review & Corrective Action Support' }, price: '900', priceCurrency: 'USD' },
    ],
  },
};

const VINCE_PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/#vince`,
  name: 'Vince Lawrence',
  jobTitle: 'Safety Coordinator & Founder',
  worksFor: { '@id': `${BASE_URL}/#business` },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kernersville',
    addressRegion: 'NC',
    postalCode: '27107',
  },
  telephone: '+13363298899',
  email: 'vince@giglinecompliance.com',
  url: `${BASE_URL}/about`,
  image: `${BASE_URL}/vince-portrait.jpg`,
  description:
    'Vince Lawrence is a safety consultant with 25+ years of experience in manufacturing, fleet, and warehouse operations. OSHA 30-Hour Certified in General Industry. U.S. Navy veteran. Founder of GigLine Safety & Compliance in Kernersville, NC.',
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certification', name: 'OSHA 30-Hour General Industry Certification' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'military service', name: 'U.S. Navy Veteran' },
  ],
  knowsAbout: [
    'OSHA compliance',
    'safety walkthroughs',
    'hazard communication',
    'incident investigation',
    'machine guarding',
    'fall protection',
    'lockout/tagout',
    'forklift safety',
    'manufacturing safety',
    'warehouse safety',
    'fleet safety',
  ],
  areaServed: { '@type': 'State', name: 'North Carolina' },
};

// Homepage FAQ mirrors the visible FAQ section on the homepage
const HOMEPAGE_FAQS = [
  { q: 'How long are you on-site?', a: "Most walkthroughs take 1 to 3 hours on-site depending on the size of the operation. A small shop may take less than an hour. Larger warehouses, production floors, or multi-area operations may take 2 to 3 hours or require a larger scoped visit. You'll know the range before I arrive." },
  { q: "What do I get when it's done?", a: "A written report delivered within 24 to 48 hours. It includes photo-documented findings, OSHA-related references where applicable, and a plain-language corrective action recommendation for each item. No guesswork about what to fix or why." },
  { q: 'Do you work with my insurance company or report to OSHA?', a: "No. This is a private engagement. Nothing leaves the building except the report I give you. As part of a standard engagement, I don't contact your insurer, your carrier, or any regulatory agency. What you do with the findings is entirely your decision." },
  { q: 'What if my operation is outside the Triad?', a: 'On-site walkthroughs are available within roughly 60 miles of Winston-Salem — covering the full Triad and surrounding areas. For locations beyond that range, contact me directly. Travel engagements are available and travel fees may apply.' },
];

// Canonical 18-question FAQ for /faq page
const FULL_FAQS = [
  { q: 'How much does an OSHA safety walkthrough cost in North Carolina?', a: "GigLine safety walkthroughs start at $1,200 for operations within 30 miles of Kernersville (Winston-Salem, Greensboro, High Point, and the Triad core). Larger or more complex operations may scope higher. Most small-operation walkthroughs fall between $1,200 and $2,000 depending on square footage and scope. You'll receive a fixed price before scheduling — no hourly billing, no retainer." },
  { q: "What's included in a GigLine safety walkthrough?", a: "A GigLine safety walkthrough includes a 1–3-hour on-site review, photo-documented safety observations, OSHA-related references where applicable, and a written 'Top 10 Fixes' report delivered within 24–48 hours. Findings are color-coded: RED for urgent items, AMBER for near-term corrections, and GREEN for what your team is doing well." },
  { q: 'How long does a safety walkthrough take on-site?', a: 'Most walkthroughs take 1 to 3 hours on-site. A small shop under 10,000 sq ft may take less than an hour. Larger warehouses, production floors, or multi-area operations may take 2 to 3 hours or require a larger scoped visit. You will receive a time estimate before the visit.' },
  { q: "What's the difference between a safety walkthrough and an OSHA inspection?", a: 'An OSHA inspection is performed by a federal or state compliance officer and may result in citations, penalties, and required abatement. A GigLine safety walkthrough is a private, voluntary review performed by an independent consultant. Findings are delivered only to you — nothing is reported to OSHA, your insurance carrier, or any third party.' },
  { q: 'Do I need a written HazCom program if I have fewer than 10 employees?', a: 'In most cases, yes. Under OSHA 29 CFR 1910.1200, employers with hazardous chemicals in the workplace must maintain a written Hazard Communication program, regardless of headcount. Exceptions are limited and generally apply only to sealed consumer-packaged products used in the same way a household consumer would use them.' },
  { q: 'What areas of North Carolina does GigLine serve?', a: 'GigLine is based in Kernersville, NC and serves the Piedmont Triad, including Winston-Salem, Greensboro, High Point, Burlington, Lexington, Thomasville, Salisbury, and surrounding communities. Most on-site work is scheduled within roughly 60 miles of Winston-Salem. Charlotte and Raleigh metro engagements may be considered based on scope and travel.' },
  { q: 'Will GigLine report findings to OSHA?', a: "No. GigLine engagements are private. The written report is delivered to the client only. GigLine does not contact OSHA, your insurance carrier, or any regulatory agency as part of a standard walkthrough or documentation review." },
  { q: 'How fast do I get my walkthrough report?', a: 'Reports are typically delivered within 24 to 48 hours of the on-site visit. The report is provided as a PDF and may include photos, OSHA-related references where applicable, and prioritized corrective action recommendations. Many clients receive the report by the next business day.' },
  { q: 'What is a "Top 10 Fixes" report?', a: "The GigLine deliverable for a safety walkthrough. It ranks the ten most important findings from your on-site visit, organized RED for urgent items, AMBER for near-term corrections, and GREEN for what your team is doing well. Each item includes what was observed, why it matters, the OSHA-related reference where applicable, and a recommended corrective action." },
  { q: 'Does GigLine work with my insurance carrier?', a: 'No. The engagement is strictly between the business owner and GigLine. Nothing is shared with insurance carriers, brokers, or third parties. What you choose to do with the report — including sharing it with your carrier — is entirely your decision.' },
  { q: 'Can I see a sample safety walkthrough report before I book?', a: "Yes. Email vince@giglinecompliance.com or call (336) 329-8899 and request a sanitized sample. Sensitive client details are redacted but the structure, depth, and OSHA references are identical to what you'll receive." },
  { q: 'What industries does GigLine typically work with?', a: 'Small manufacturers, warehouses, distribution centers, fleet operations, general contractors, and specialty trades. Most clients have 5 to 100 employees. The common thread is operations that do not have a full-time safety manager.' },
  { q: 'Does GigLine offer safety training or just inspections?', a: 'GigLine does not deliver formal OSHA training courses. The walkthrough includes on-site coaching while walking the floor, and the report includes corrective actions that often reference training requirements. For formal certification-based training, GigLine can recommend local providers.' },
  { q: 'Is Vince Lawrence OSHA certified?', a: 'Vince Lawrence is OSHA 30-Hour Certified in General Industry and has 25+ years of hands-on experience in manufacturing, fleet, and warehouse safety. He is also a U.S. Navy veteran. GigLine is owner-operated — every walkthrough and report is performed personally by Vince.' },
  { q: 'What happens if OSHA shows up after my walkthrough?', a: 'You have the written record of every hazard identified, every corrective action taken, and every training record reviewed. An OSHA compliance officer who sees an active corrective-action log is usually looking at a cooperative-employer outcome instead of a willful-violation outcome. Documentation is the single biggest factor in how an OSHA visit goes.' },
  { q: 'Do you offer follow-up walkthroughs for past clients?', a: "Yes. Follow-up walkthroughs for past clients are offered at a reduced rate. Most operations benefit from a semi-annual or annual follow-up to catch the drift that happens when safety isn't the primary focus — and ongoing support is available through Quarterly Compliance Maintenance and the Annual Compliance Control Partner program." },
  { q: 'How should I prepare for a safety walkthrough?', a: 'Nothing special. Do not stage, clean up, or hide anything — the walkthrough is most valuable when the floor looks the way it normally does. Have your written safety programs, SDS binder, and training records accessible. A brief floor manager or supervisor introduction at the start helps.' },
  { q: 'How do I book a safety walkthrough with GigLine?', a: "Visit https://www.giglinecompliance.com/request-walkthrough and fill the four-field form, or call (336) 329-8899 directly. You'll hear back within one business day with scheduling options and a confirmed price." },
];

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${BASE_URL}${it.path}`,
    })),
  };
}

// ───────────────────────────────────────────────
// Routes
// ───────────────────────────────────────────────
const routes = [
  {
    path: '/',
    title: 'Safety Walkthroughs & OSHA Documentation Readiness Reviews for NC Manufacturers, Warehouses & Fleets | GigLine',
    description: 'Practical safety walkthroughs and OSHA Documentation Readiness Reviews for manufacturers, warehouses, contractors, and fleet operations in North Carolina. Written report in 48 hours. (336) 329-8899.',
    canonical: '/',
    schemas: [
      LOCAL_BUSINESS,
      VINCE_PERSON,
      faqSchema(HOMEPAGE_FAQS),
      breadcrumb([{ name: 'Home', path: '/' }]),
    ],
    content: `
      <h1>Find the gaps before OSHA does.</h1>
      <p>On-site safety walkthroughs for manufacturers, warehouses, contractors, and fleet operations across the Piedmont Triad. Fixed quote. Private engagement. Report in 48 hours.</p>
      <p><a href="/request-walkthrough">Request a Walkthrough</a> &middot; <a href="/safety-check">Take the Safety Check</a></p>
      <p>OSHA 30-Hour Certified · 25+ Years Experience · U.S. Navy Veteran · Serving the Triad</p>
      <h2>What We Find on the Floor — Most violations are hiding in plain sight.</h2>
      <p>OSHA doesn't find things your team missed. They find things your team stopped seeing. Here's what shows up on almost every walkthrough.</p>
      <ol>
        <li><strong>Incomplete LOTO Procedures</strong> — Machine-specific written procedures missing or not posted at the point of use.</li>
        <li><strong>Forklift &amp; PIT Gaps</strong> — Expired operator certifications, missing pre-shift inspection logs, unmarked pedestrian zones.</li>
        <li><strong>Hazard Communication Failures</strong> — SDSs not accessible, unlabeled secondary containers, training records that don't match inventory.</li>
        <li><strong>Electrical Hazard Exposures</strong> — Open junction boxes, missing knockouts, energized equipment without proper guarding.</li>
        <li><strong>Blocked or Unmarked Egress</strong> — Exit routes obstructed by inventory, emergency lighting untested, exit signs burned out.</li>
        <li><strong>Recordkeeping Deficiencies</strong> — OSHA 300 logs not current, 300A summaries not posted Feb–April, retention deficits.</li>
      </ol>
      <h2>Why GigLine — Not a software tool. Not a template audit. A person who walks your floor.</h2>
      <p><strong>Fixed Quote. No Surprises.</strong> Every engagement is quoted in advance and held — no hourly billing, no scope creep.</p>
      <p><strong>Private by Default.</strong> GigLine does not share, publish, or reference client facility data. Your findings stay between us.</p>
      <p><strong>Built on the Floor, Not in a Classroom.</strong> Vince Lawrence spent years inside manufacturing operations — glass and vinyl, rubber compounding, metals fabrication, including time at BF Goodrich and Amero Steel.</p>
      <h2>The Cost of Waiting — The average OSHA serious violation costs $16,550.</h2>
      <p>That's per citation. A single inspection can produce multiple citations across multiple standards. The Safety Walkthrough starts at $1,200. Max penalty per willful or repeat violation: $165,514. Time from walkthrough to written report: 48 hours.</p>
      <p>OSHA doesn't announce inspections. They arrive after a complaint, a referral, or a fatality — or as part of a programmed inspection targeting your industry. By the time they're on your floor, the window to fix things has closed. The walkthrough is that window.</p>
      <h2>Services — Three ways to work with GigLine.</h2>
      <ul>
        <li><a href="/safety-walkthrough">Safety Walkthrough</a> — From $1,200. Documented on-site walkthrough with photo evidence, CFR citations, penalty exposure per finding, and a Top 10 Fixes report within 48 hours.</li>
        <li><a href="/osha-compliance-gap-check">Compliance Readiness Visit</a> — From $2,000. Walkthrough plus a full Documentation Review in a single visit. Most Requested.</li>
        <li><a href="/documentation-gap-check">OSHA Documentation Readiness Review (standalone)</a> — From $1,300.</li>
        <li><a href="/safety-check">Safety Check</a> — Free 90-second self-assessment of the six most common OSHA violations in general industry. No contact info required.</li>
      </ul>
      <h2>How It Works — Four steps. No surprises.</h2>
      <ol>
        <li><strong>You reach out.</strong> Fill out the intake form or call directly. No commitment.</li>
        <li><strong>We give you a fixed quote.</strong> Based on facility size, complexity, and scope.</li>
        <li><strong>We walk your floor.</strong> Typically 1–3 hours on-site, photographing findings against applicable OSHA standards.</li>
        <li><strong>You get a written report in 48 hours.</strong> Photo documentation, CFR citations, penalty exposure, prioritized corrective actions.</li>
      </ol>
      <h2>About Vince — "I didn't learn this by visiting other people's facilities."</h2>
      <p>I spent years inside manufacturing operations before I ever called myself a safety professional. Glass and vinyl. Rubber compounding. Metals fabrication. BF Goodrich. Amero Steel. I was on the floor — doing Gemba walks, writing LOTO procedures, building programs from scratch because nothing existed yet.</p>
      <p>GigLine exists because most small and mid-size manufacturers can't afford a full-time safety manager — but they can afford to know what's on their floor before OSHA does. That's what I do.</p>
      <p><em>Service area: on-site within 60 miles of Winston-Salem, including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities.</em></p>
      <h2>What Clients Say</h2>
      <p>"If you're looking for a partner that can bridge the gap between compliance and real-world execution, GigLine delivers results." — Demar Archie, Warehouse Receiving Manager</p>
      <h2>Recent Outcome &mdash; Case Study</h2>
      <p><a href="/case-studies/mocksville-plastics-osha-inspection">How a 60-Person Plastics Manufacturer in Mocksville Passed OSHA &mdash; With Zero Citations</a>. Scheduled inspection, four high-risk findings flagged in the walkthrough, six weeks of corrective action, clean record on inspection day.</p>
      <h2>Final CTA — Know what's on your floor before OSHA does.</h2>
      <p>The walkthrough takes a few hours. The report is in your hands in 48. The cost is a fraction of a single citation. Questions first? Call or text directly: (336) 329-8899.</p>
      <h2>Frequently Asked Questions</h2>
      ${HOMEPAGE_FAQS.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join('')}
      <p><a href="/faq">See all 18 frequently asked questions →</a></p>
      <h2>About Vince Lawrence</h2>
      <p>Vince Lawrence is a safety consultant based in Kernersville, NC. OSHA 30-Hour Certified. 25+ years in manufacturing, fleet, and warehouse safety operations. U.S. Navy veteran.</p>
      <p>I've walked floors in plastics manufacturing, building materials distribution, and trucking operations across the Triad. I know what inspectors look for because I've helped operations correct the same violations hundreds of times.</p>
      <p>GigLine is a private engagement. Nothing leaves your facility except the report I hand you.</p>
      <p>Service area: On-site walkthroughs within 60 miles of Winston-Salem, including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities.</p>
      <h2>From the Field</h2>
      <p><a href="/field-notes/heat-stress">Heat Stress</a> — How heat exposure gets missed, what triggers OSHA attention, and what small operations can do about it.</p>
      <p><a href="/field-notes/forklift-safety">Forklift Safety</a> — Certification gets the headlines, but daily inspections and pedestrian separation are where most operations break down.</p>
      <p><a href="/field-notes/electrical-safety">Electrical Access</a> — Blocked electrical panels are one of OSHA's most cited violations.</p>
      <p><a href="/field-notes/hazcom">HazCom &amp; SDS</a> — Missing labels, outdated SDS binders, and no written program.</p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — vince@giglinecompliance.com</p>
    `,
  },
  {
    path: '/about',
    title: 'Vince Lawrence — Safety Consultant | Kernersville NC | GigLine',
    description: '25+ years on the floor. OSHA 30-Hour certified. Navy veteran. The same eyes an inspector uses — before they show up. (336) 329-8899.',
    canonical: '/about',
    schemas: [VINCE_PERSON, breadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
    content: `
      <h1>About Vince Lawrence</h1>
      <p>Safety consultant based in Kernersville, NC. OSHA 30-Hour Certified. 25+ years in manufacturing, fleet, and warehouse safety operations. U.S. Navy veteran.</p>
      <p>GigLine Safety &amp; Compliance provides on-site safety walkthroughs, documentation reviews, and incident response support for small manufacturers, warehouses, contractors, and fleets in the Piedmont Triad and surrounding areas.</p>
      <p>Contact: (336) 329-8899 · vince@giglinecompliance.com</p>
    `,
  },
  {
    path: '/services',
    title: 'GigLine Safety Services — Walkthroughs, Compliance Visits & OSHA-Ready Systems | From $1,200',
    description: SERVICES_META_DESCRIPTION,
    canonical: '/services',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'GigLine Safety Consulting Services',
        itemListElement: [
          { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Compliance Readiness Visit', description: 'Combined on-site walkthrough and OSHA Documentation Readiness Review delivered as a single readiness report. Recommended starting point.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '2000', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Safety Walkthrough & Top 10 Fixes Report', description: 'A structured on-site review of common OSHA exposure areas with a Top 10 priority report.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '1200', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'OSHA Documentation Readiness Review', description: DOC_REVIEW_DESCRIPTION, provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: DOC_REVIEW_PRICE_NUM, priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Incident Review & Corrective Action Support', description: 'Post-incident review, OSHA recordability determination, and corrective action documentation.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '1200', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'GigLine OSHA-Ready Control System', description: 'Complete four-binder physical command system, digital folder architecture, training matrix, SDS organization, and corrective action tracker. Includes supervisor walkthrough at handoff.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '4500', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Quarterly Compliance Maintenance', description: 'Ongoing quarterly documentation review, training record audit, and corrective action tracker review.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '750', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 7, item: { '@type': 'Service', name: 'Annual Compliance Control Partner', description: 'Two annual walkthroughs, quarterly documentation reviews, OSHA 300A posting reminders, and pre-inspection readiness support.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '9000', priceCurrency: 'USD' } } },
        ],
      },
      faqSchema([
        { q: 'How do I know which service to start with?', a: 'Most clients start with the Compliance Readiness Visit. It reviews both the floor and the documentation in one visit, gives you a single compliance score, and tells you exactly what to fix first. If you only need one side reviewed, start with the Safety Walkthrough or the OSHA Documentation Readiness Review.' },
        { q: 'Are the prices fixed or do they go up later?', a: 'Fixed quote before scheduling. The price you see is the starting point — GigLine confirms scope and confirms the final fixed quote in writing before any visit is scheduled. No hourly billing. No retainer.' },
        { q: 'Do I have to sign up for ongoing services?', a: 'No. Every service is a single engagement. Quarterly Maintenance and the Annual Compliance Control Partner are optional — they exist for operations that want the system kept current after the Control System is built.' },
        { q: 'Will GigLine share findings with OSHA or my insurance carrier?', a: 'No. The engagement is private. The only deliverable is the written report handed to you. Nothing is shared with OSHA, insurance carriers, or any third party.' },
        { q: 'What happens after I submit a request?', a: 'GigLine reviews the intake within one business day, confirms scope and fixed pricing, and schedules the visit. Most walkthroughs are scheduled within 5–7 business days of the confirmed quote.' },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]),
    ],
    content: `
      <h1>OSHA-Readiness Support for Small Industrial Operations</h1>
      <p>GigLine helps manufacturers, warehouses, contractors, and fleet operations identify visible safety hazards, documentation gaps, and inspection-readiness issues before they become citations, insurance problems, or customer-audit failures.</p>
      <p><em>Built for small operations that need practical safety support without hiring a full-time safety manager.</em></p>
      <h2>Not sure where to start?</h2>
      <p>Take the free 90-Second Safety Check — six yes-or-no questions, immediate risk score, no email required to start. Ready for a professional review? <a href="/intake?service=compliance-readiness-visit">Schedule a Compliance Readiness Visit</a>.</p>
      <h2>Who GigLine Helps</h2>
      <p>Manufacturers, warehouses & distribution, contractors, and fleet operations — the four operation types most likely to receive an OSHA inspection, an insurance review, or a customer-audit request in the Piedmont Triad.</p>
      <h2>Compliance Readiness Visit — Recommended Starting Point — Starting at $2,000</h2>
      <p>The floor and the files reviewed in a single visit. Full safety walkthrough on-site, OSHA Documentation Readiness Review, single compliance percentage score, photo documentation, CFR citations, written report within 48 hours. Supervisor Safety Starter System ($199 value) included.</p>
      <h2>Standalone Services</h2>
      <h3>Safety Walkthrough Report — Starting at $1,200</h3>
      <p>On-site walkthrough (1–3 hours). Photo-documented hazard findings. CFR citations + 2026 penalty exposure per finding. Top 10 Fixes report — RED / AMBER / GREEN priority. Delivered within 24–48 hours.</p>
      <h3>OSHA Documentation Readiness Review — Starting at ${DOC_REVIEW_PRICE_LABEL}</h3>
      <p>Structured review of written programs, training records, OSHA logs, inspection records, and SDS compliance. 53-item checklist across seven OSHA categories.</p>
      <h3>Incident Review & Corrective Action Support — Starting at $1,200</h3>
      <p>Post-injury or post-near-miss response. Root cause analysis. OSHA recordability determination. OSHA 301 completion. Corrective action plan.</p>
      <h3>Document Development — Quote after documentation review</h3>
      <p>GigLine writes the programs you are missing. LOTO, HazCom, PPE hazard assessment, Emergency Action Plan, machine-specific procedures.</p>
      <h2>GigLine OSHA-Ready Control System — Starting at $4,500</h2>
      <p>Premium engagement. Four-binder physical command system, digital folder architecture, training matrix + SDS organization, corrective action tracker, 90-day maintenance calendar, supervisor walkthrough at handoff.</p>
      <h2>The Natural Next Step — Quarterly and Annual Support</h2>
      <p>Quarterly Compliance Maintenance — Starting at $950/quarter. Annual Compliance Control Partner — Starting at $9,000/year.</p>
      <h2>The GigLine Readiness Path</h2>
      <p>Find the issues — Safety Walkthrough from $1,200. Check the files — OSHA Documentation Readiness Review from ${DOC_REVIEW_PRICE_LABEL}. Review both — Compliance Readiness Visit from $2,000. Build the system — OSHA-Ready Control System from $4,500. Keep it current — Quarterly Maintenance from $950/quarter.</p>
      <h2>Recent Outcome &mdash; Case Study</h2>
      <p><a href="/case-studies/mocksville-plastics-osha-inspection">How a 60-Person Plastics Manufacturer in Mocksville Passed OSHA &mdash; With Zero Citations</a>.</p>
      <p>After payment, you'll receive a scheduling confirmation within one business day.</p>
      <p>GigLine Safety &amp; Compliance — Kernersville, NC — (336) 329-8899</p>
    `,
  },
  {
    path: '/faq',
    title: 'Safety Walkthrough FAQ | OSHA Compliance Questions Answered | GigLine',
    description: "Answers to the most common questions about OSHA safety walkthroughs in North Carolina — cost, duration, what's included, how reports work, and who GigLine serves.",
    canonical: '/faq',
    schemas: [
      faqSchema(FULL_FAQS),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }]),
    ],
    content: `
      <h1>Frequently Asked Questions</h1>
      <p>Straight answers about safety walkthroughs and OSHA compliance. If your question isn't here, call (336) 329-8899 or email vince@giglinecompliance.com.</p>
      ${FULL_FAQS.map((f) => `<h2>${f.q}</h2><p>${f.a}</p>`).join('')}
      <p><a href="/request-walkthrough">Request a Safety Walkthrough →</a></p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — Kernersville, NC</p>
    `,
  },
  {
    path: '/service-areas',
    title: 'Service Areas — NC Safety Walkthroughs | GigLine Safety & Compliance',
    description: 'GigLine provides on-site OSHA safety walkthroughs across 13 North Carolina cities — Kernersville, Winston-Salem, Greensboro, High Point, Burlington and more. Find your city.',
    canonical: '/service-areas',
    schemas: [breadcrumb([{ name: 'Home', path: '/' }, { name: 'Service Areas', path: '/service-areas' }])],
    content: `
      <h1>Service Areas — On-Site Safety Walkthroughs Across North Carolina</h1>
      <p>Based in Kernersville, NC. Routine engagements within 60 miles of Winston-Salem. Scheduled engagements available in Charlotte and Raleigh metros.</p>
      <h2>Triad Core — Starting at $1,200 (within 30 miles of Kernersville)</h2>
      <ul>
        <li><a href="/safety-walkthrough/kernersville">Kernersville, NC</a> — GigLine HQ</li>
        <li><a href="/safety-walkthrough/winston-salem">Winston-Salem, NC</a> — 10 miles</li>
        <li><a href="/safety-walkthrough/high-point">High Point, NC</a> — 12 miles</li>
        <li><a href="/safety-walkthrough/greensboro">Greensboro, NC</a> — 15 miles</li>
        <li><a href="/safety-walkthrough/clemmons">Clemmons, NC</a> — 15 miles</li>
        <li><a href="/safety-walkthrough/thomasville">Thomasville, NC</a> — 15 miles</li>
        <li><a href="/safety-walkthrough/lexington">Lexington, NC</a> — 20 miles</li>
        <li><a href="/safety-walkthrough/mocksville">Mocksville, NC</a> — 25 miles</li>
        <li><a href="/safety-walkthrough/burlington">Burlington, NC</a> — 30 miles</li>
      </ul>
      <h2>Outer Tier — Starting at $1,200 + travel fee</h2>
      <ul>
        <li><a href="/safety-walkthrough/asheboro">Asheboro, NC</a> — 35 miles</li>
        <li><a href="/safety-walkthrough/salisbury">Salisbury, NC</a> — 50 miles</li>
      </ul>
      <h2>Scheduled Engagements — Charlotte and Raleigh metros</h2>
      <p>Charlotte and Raleigh area walkthroughs are available on a scheduled basis. Travel considerations apply. Contact directly to confirm.</p>
      <ul>
        <li><a href="/safety-walkthrough/charlotte">Charlotte, NC</a> — 75 miles</li>
        <li><a href="/safety-walkthrough/raleigh">Raleigh, NC</a> — 75 miles</li>
      </ul>
      <p>Operations beyond 60 miles: call (336) 329-8899 — travel engagements available case-by-case.</p>
    `,
  },
  {
    path: '/contact',
    title: 'Contact | GigLine Safety & Compliance',
    description: 'Contact GigLine Safety & Compliance. Request a walkthrough, documentation review, or incident response support. Vince Lawrence — (336) 329-8899. Kernersville, NC.',
    canonical: '/contact',
    schemas: [LOCAL_BUSINESS, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])],
    content: `
      <h1>Contact GigLine Safety &amp; Compliance</h1>
      <p>Phone: (336) 329-8899</p>
      <p>Email: vince@giglinecompliance.com</p>
      <p>Location: Kernersville, NC — Serving the Piedmont Triad and surrounding areas within 60 miles of Winston-Salem.</p>
    `,
  },
  {
    path: '/safety-check',
    title: 'Free 90-Second Safety Check | GigLine Safety & Compliance',
    description: "Free 90-second safety check. Six questions mapped to OSHA's most-cited violations. Get an instant risk rating and clear next steps.",
    canonical: '/safety-check',
    schemas: [LOCAL_BUSINESS],
    content: `
      <h1>90-Second Safety Check</h1>
      <p>Six yes-or-no questions mapped to OSHA's most-cited violations. Get an immediate risk score and clear next steps — free, no email required to start.</p>
      <p>Questions cover: Hazard Communication (SDS), Forklift Certification, Lockout/Tagout, Machine Guarding, Ladder Safety, and Training Records.</p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899</p>
    `,
  },
  {
    path: '/hazcom',
    title: 'HazCom Starter Pack — $29 | GigLine Safety & Compliance',
    description: "HazCom Starter Pack — $29. Written HazCom program, SDS binder checklist, and training log. 11 pages. Fixes OSHA's #1 citation in general industry.",
    canonical: '/hazcom',
    schemas: [LOCAL_BUSINESS],
    content: `
      <h1>HazCom Starter Pack — $29</h1>
      <p>Written HazCom Program, SDS Binder Checklist + Index, Training Verification Log. 11 pages total. Fill your company name. Print. Done.</p>
      <p>Addresses OSHA 29 CFR 1910.1200 — the #1 citation in general industry.</p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899</p>
    `,
  },
  {
    path: '/blog/top-5-osha-violations-small-manufacturing',
    title: 'Top 5 OSHA Violations in Small Manufacturing | GigLine Safety & Compliance',
    description: 'The five most-cited OSHA violations in small manufacturing: Hazard Communication, Lockout/Tagout, Machine Guarding, Powered Industrial Trucks, and Walking-Working Surfaces.',
    canonical: '/blog/top-5-osha-violations-small-manufacturing',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'The Top 5 OSHA Violations in Small Manufacturing — And What They Actually Cost',
        author: { '@id': `${BASE_URL}/#vince` },
        publisher: { '@id': `${BASE_URL}/#business` },
        mainEntityOfPage: `${BASE_URL}/blog/top-5-osha-violations-small-manufacturing`,
        datePublished: '2026-04-17',
      },
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/field-notes' }, { name: 'Top 5 OSHA Violations', path: '/blog/top-5-osha-violations-small-manufacturing' }]),
    ],
    content: `
      <h1>The Top 5 OSHA Violations in Small Manufacturing — And What They Actually Cost</h1>
      <p>By Vince Lawrence — GigLine Safety &amp; Compliance</p>
      <h2>1. Hazard Communication (29 CFR 1910.1200)</h2><p>The #1 citation in general industry. Missing written program, unlabeled containers, no SDS binder, or undocumented training. Penalty: up to $16,550 per violation.</p>
      <h2>2. Lockout/Tagout (29 CFR 1910.147)</h2><p>Missing written procedures, no annual audit, untrained authorized employees. One of the most dangerous violations — failure to control energy causes approximately 120 fatalities and 50,000 injuries per year.</p>
      <h2>3. Machine Guarding (29 CFR 1910.212)</h2><p>Missing or inadequate point-of-operation guards on machines like presses, mills, lathes, and saws.</p>
      <h2>4. Powered Industrial Trucks (29 CFR 1910.178)</h2><p>Operators not certified, no daily pre-shift inspections, pedestrian separation missing.</p>
      <h2>5. Walking-Working Surfaces (29 CFR 1910.22)</h2><p>Blocked aisles, unprotected edges, damaged flooring, poor housekeeping in work areas.</p>
      <p>Not sure if these violations exist in your shop? A GigLine Safety Walkthrough will flag them with photos and a prioritized fix list.</p>
    `,
  },
  {
    path: '/blog/hazcom-requirements-small-business',
    title: 'HazCom Requirements for Small Businesses | GigLine Safety & Compliance',
    description: 'Complete guide to OSHA Hazard Communication requirements for small businesses. Written programs, Safety Data Sheets, labeling, training, and penalties under 29 CFR 1910.1200.',
    canonical: '/blog/hazcom-requirements-small-business',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'HazCom Requirements Every Small Business Needs to Know',
        author: { '@id': `${BASE_URL}/#vince` },
        publisher: { '@id': `${BASE_URL}/#business` },
        mainEntityOfPage: `${BASE_URL}/blog/hazcom-requirements-small-business`,
        datePublished: '2026-04-17',
      },
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/field-notes' }, { name: 'HazCom Requirements', path: '/blog/hazcom-requirements-small-business' }]),
    ],
    content: `
      <h1>HazCom Requirements Every Small Business Needs to Know</h1>
      <p>By Vince Lawrence — GigLine Safety &amp; Compliance</p>
      <p>Hazard Communication (HazCom) under 29 CFR 1910.1200 is OSHA's most-cited standard in general industry. This guide covers what small businesses need to comply.</p>
      <h2>Written HazCom Program</h2><p>Every employer with hazardous chemicals must have a written program describing how the workplace will comply with labeling, SDS, and training requirements.</p>
      <h2>Safety Data Sheets (SDS)</h2><p>An SDS must be maintained for every hazardous chemical in the workplace and be immediately accessible to employees during their shift.</p>
      <h2>Container Labeling</h2><p>All containers of hazardous chemicals must be labeled with the product name, signal word, hazard statements, and pictograms.</p>
      <h2>Employee Training</h2><p>Employees must be trained on chemical hazards, how to read labels and SDS, and the location of the written program.</p>
    `,
  },
  {
    path: '/request-walkthrough',
    title: 'Request a Safety Walkthrough | GigLine Safety & Compliance',
    description: 'Request an on-site safety walkthrough for your operation. One visit. Clear findings. Written report within 24-48 hours. Kernersville, NC.',
    canonical: '/request-walkthrough',
    schemas: [LOCAL_BUSINESS],
    content: `
      <h1>Request a Safety Walkthrough</h1>
      <p>Schedule an on-site safety walkthrough with GigLine Safety &amp; Compliance. One visit. Clear findings. Written report within 24-48 hours. <strong>Starting at $1,200</strong>.</p>
      <p>Serving small manufacturers, warehouses, contractors, and fleets in the Kernersville/Triad, NC area.</p>

      <h2>Three ways to reach Vince</h2>
      <p style="margin: 24px 0;">
        <a href="tel:+13363298899" style="display:inline-block; background:#1F6FEB; color:#fff; padding:14px 28px; border-radius:8px; font-weight:700; text-decoration:none; margin: 4px 8px 4px 0;">Call (336) 329-8899</a>
        <a href="mailto:vince@giglinecompliance.com?subject=Safety%20Walkthrough%20Request&amp;body=Hi%20Vince%2C%0A%0AI%27d%20like%20to%20schedule%20a%20safety%20walkthrough%20for%20my%20operation.%0A%0ABusiness%3A%20%0AOperation%20type%3A%20%0ALocation%20(city%2C%20NC)%3A%20%0AHeadcount%3A%20%0AReason%20for%20outreach%3A%20%0A%0APreferred%20contact%20method%3A%20%0A%0AThanks%2C%0A" style="display:inline-block; background:#0B1F33; color:#fff; padding:14px 28px; border-radius:8px; font-weight:700; text-decoration:none; margin: 4px 0;">Email Vince Directly</a>
      </p>
      <p>Or fill out the 4-field form on this page if JavaScript is enabled.</p>
      <p>Email: <a href="mailto:vince@giglinecompliance.com">vince@giglinecompliance.com</a><br>
      Phone: <a href="tel:+13363298899">(336) 329-8899</a><br>
      Hours: Monday&ndash;Friday 8 AM&ndash;6 PM ET</p>
    `,
  },
  {
    path: '/walkthrough',
    title: 'Request a Safety Walkthrough | GigLine Safety & Compliance',
    description: 'Schedule an on-site safety walkthrough with Vince Lawrence. GigLine identifies your top OSHA exposure points and delivers a written report ranked by risk. One visit. No retainer. Serving the Piedmont Triad, NC.',
    canonical: '/walkthrough',
    schemas: [LOCAL_BUSINESS],
    content: `
      <h1>Request a Safety Walkthrough</h1>
      <p>Vince Lawrence will walk your floor, identify your top exposure points, and deliver a written report &mdash; ranked by risk. One visit. No retainer.</p>
      <p>Most facilities have gaps they don't know about. This is how you <strong>find them before OSHA does.</strong></p>
      <h2>Here's what happens next</h2>
      <ol>
        <li>Vince reviews your request within 24 hours.</li>
        <li>He confirms a walkthrough date and time that works for your operation.</li>
        <li>He arrives on-site, walks your floor, and delivers a written report within 48 hours of the visit.</li>
      </ol>
      <p>Contact: <a href="tel:3363298899">(336) 329-8899</a> &middot; <a href="mailto:vince@giglinecompliance.com">vince@giglinecompliance.com</a> &middot; <a href="https://www.giglinecompliance.com">giglinecompliance.com</a></p>
      <p>Serving the Piedmont Triad, North Carolina.</p>
    `,
  },
  {
    path: '/case-studies/mocksville-plastics-osha-inspection',
    title: 'OSHA Inspection Case Study: Mocksville Plastics Manufacturer Cleared with Zero Citations | GigLine',
    description: 'A 60-person plastics manufacturer in Mocksville, NC had a scheduled OSHA inspection six weeks away. After a GigLine walkthrough flagged 4 high-risk findings, all were fixed before inspection day. Outcome: zero citations.',
    canonical: '/case-studies/mocksville-plastics-osha-inspection',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'How a 60-Person Plastics Manufacturer in Mocksville Passed OSHA — With Zero Citations',
        description: 'A 60-person plastics manufacturer in Mocksville, NC had a scheduled OSHA inspection six weeks away. After a GigLine walkthrough flagged 4 high-risk findings, all were fixed before inspection day. Outcome: zero citations.',
        author: { '@id': `${BASE_URL}/#vince` },
        publisher: { '@id': `${BASE_URL}/#business` },
        mainEntityOfPage: `${BASE_URL}/case-studies/mocksville-plastics-osha-inspection`,
        datePublished: '2026-06-04',
        articleSection: 'Case Study',
      },
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Case Studies', path: '/case-studies' },
        { name: 'Mocksville Plastics Manufacturer', path: '/case-studies/mocksville-plastics-osha-inspection' },
      ]),
    ],
    content: `
      <h1>How a 60-Person Plastics Manufacturer in Mocksville Passed OSHA &mdash; With Zero Citations</h1>
      <p><em>What changed in the six weeks between the walkthrough and inspection day.</em></p>

      <p><strong>Location:</strong> Mocksville, NC &middot; <strong>Headcount:</strong> ~60 employees &middot; <strong>Engagement:</strong> Spring 2026 &middot; <strong>Time to Inspection:</strong> 6 weeks &middot; <strong>Outcome:</strong> Zero Citations</p>

      <h2>The Situation</h2>
      <p>A plastics manufacturer in Mocksville, NC &mdash; roughly 60 employees, two-shift operation &mdash; had OSHA on the calendar. Not a complaint. Not a referral. A scheduled inspection.</p>
      <p>The plant manager called Vince in Spring 2026, about six weeks out from the inspection date. He hired GigLine for one purpose: walk the floor like an OSHA Compliance Officer would, find what they'd find, and tell him what to fix and in what order.</p>

      <h2>The Walkthrough &mdash; Four High-Risk Findings</h2>
      <p>Vince walked the facility for three hours. The Top 10 Fixes report landed in the plant manager's inbox 36 hours later. Four findings would have been almost-certain citations on inspection day:</p>

      <h3>01 &mdash; Recordkeeping (29 CFR 1904.32)</h3>
      <p>OSHA 300 Log not posted; no 300A Annual Summary signed by a company executive. Penalty range: $1,190 to $16,550 per violation. Recordkeeping citations stack &mdash; each missing record can be cited separately.</p>

      <h3>02 &mdash; Powered Industrial Trucks (29 CFR 1910.178(l))</h3>
      <p>Three forklift operators with certifications older than three years. No daily pre-shift inspection log. Refresher training is required every three years. Penalty range: $1,190 to $16,550 per operator, per violation.</p>

      <h3>03 &mdash; Walking and Working Surfaces (29 CFR 1910.22(a)(1))</h3>
      <p>Scrap accumulated under press lines. Pallets in pedestrian zones. Material handlers stepping around obstructions. Housekeeping isn't an aesthetic complaint &mdash; it's a written OSHA standard.</p>

      <h3>04 &mdash; Emergency Egress (29 CFR 1910.37(a)(3))</h3>
      <p>Two of four emergency exits had partial obstructions in the path of egress. Exit routes must be unobstructed at all times.</p>

      <h2>The Six Weeks Between</h2>
      <p>The plant manager assigned each finding to someone with a fix-by date within 48 hours. By inspection day, all four high-risk items were closed and documented:</p>
      <ul>
        <li><strong>Recordkeeping:</strong> 300A Summary signed by the president and posted. 5-year retention file reorganized.</li>
        <li><strong>Forklift program:</strong> All three operators completed refresher training with documented evaluation. Daily pre-shift inspection log on every truck.</li>
        <li><strong>Housekeeping:</strong> Written program drafted. Daily end-of-shift sweep routines. Pedestrian aisles repainted.</li>
        <li><strong>Egress:</strong> All four exit paths cleared. "No storage zone" marked. Monthly egress audits added to the standing checklist.</li>
      </ul>

      <h2>Inspection Day</h2>
      <p>The OSHA Compliance Officer arrived on the scheduled date. The walkthrough took about four hours. The plant manager and supervisors had documentation ready for every question. At the closing conference, the Compliance Officer noted observations but did not issue a single citation. <strong>No formal findings. No fines. Clean record.</strong></p>

      <h2>What This Buys</h2>
      <p>Four findings at the higher end of the penalty range &mdash; plus the multiplier for willful or repeated classifications &mdash; could have run past $75,000. A safety walkthrough plus six weeks of disciplined corrective action got them to zero.</p>

      <h2>What's Repeatable</h2>
      <p>Most manufacturers Vince walks into have at least three of the same four issues. Recordkeeping gaps, expired forklift certifications, housekeeping drift, egress obstructions. Not lazy problems &mdash; the kind of problems that come from running a 60-person operation without a full-time safety manager.</p>

      <p>If you have OSHA on the calendar, or worried they're coming, <a href="https://www.giglinecompliance.com/walkthrough">request a walkthrough</a>. One visit. A written report within 48 hours. A list of things to fix in priority order. No retainer.</p>

      <p>GigLine Safety &amp; Compliance &mdash; Vince Lawrence &mdash; (336) 329-8899 &mdash; <a href="https://www.giglinecompliance.com">giglinecompliance.com</a></p>
    `,
  },
  {
    path: '/field-notes',
    title: 'OSHA Safety Tips for Small Manufacturers | GigLine Field Notes',
    description: 'OSHA safety tips and plain-language guidance for small manufacturers. Field notes on HazCom, forklift safety, electrical, LOTO, PPE, and fall protection.',
    canonical: '/field-notes',
    schemas: [LOCAL_BUSINESS],
    content: `
      <h1>Field Notes</h1>
      <p>Practical safety topics for small manufacturers, warehouses, and contractors. Each field note covers what OSHA requires, what gets missed, and a quick checklist.</p>
      <ul>
        <li>Heat Stress</li><li>Forklift Safety &amp; Daily Inspections</li><li>Electrical Safety &amp; Arc Flash</li>
        <li>HazCom &amp; SDS</li><li>Machine Guarding</li><li>Walking Surfaces</li>
        <li>Lockout/Tagout</li><li>Emergency Action Plans</li><li>PPE Assessment &amp; Use</li>
        <li>Fall Protection</li><li>Confined Space Entry</li><li>Scaffolding Safety</li>
        <li>Hearing Conservation</li><li>Bloodborne Pathogens</li>
      </ul>
    `,
  },
  {
    path: '/heat-guide',
    title: 'Heat Stress Action Template 2026 | GigLine Safety & Compliance',
    description: 'Free 2026 Heat Stress Action Template for NC manufacturing and warehouse operations. Daily heat check, trigger levels, required controls.',
    canonical: '/heat-guide',
    schemas: [LOCAL_BUSINESS],
    content: `
      <h1>2026 Heat Stress Action Template</h1>
      <p>Free heat stress prevention template for NC manufacturing and warehouse operations. Daily heat check with three trigger levels, required controls, and HIIPP checklist.</p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899</p>
    `,
  },
  // ── Findability Framework: buyer-intent service landing pages ──
  {
    path: '/safety-walkthrough',
    title: 'Safety Walkthrough — On-Site OSHA Review for NC Operations | GigLine',
    description: 'On-site safety walkthrough for manufacturers, warehouses, contractors, and fleet operations across North Carolina. Photo-documented findings, OSHA references, and a written report in 48 hours. Starting at $1,200.',
    canonical: '/safety-walkthrough',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'On-Site Safety Walkthrough',
        description: 'On-site OSHA-focused safety walkthrough for manufacturers, warehouses, contractors, and fleet operations across North Carolina. Written report delivered within 24-48 hours.',
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        offers: { '@type': 'Offer', price: '650', priceCurrency: 'USD' },
      },
      faqSchema([
        { q: 'Who is the safety walkthrough built for?', a: 'Small to mid-size manufacturers, warehouses, distribution centers, contractors, and fleet operations in North Carolina — typically 5 to 100 employees with no full-time safety manager on staff.' },
        { q: 'What gets reviewed during a safety walkthrough?', a: 'Walking-working surfaces and egress, electrical panel clearance, machine guarding and energy control, powered industrial trucks, hazard communication, PPE and fall protection, and recordkeeping — the same OSHA standards an inspector would focus on.' },
        { q: 'What do I receive after the walkthrough?', a: 'A PDF report within 24-48 hours with photo-documented findings, OSHA-related references where applicable, prioritized corrective action recommendations, and color-coded priorities (RED, AMBER, GREEN).' },
        { q: 'How much does a safety walkthrough cost?', a: 'Walkthroughs start at $1,200. Most engagements fall between $1,200 and $2,000 depending on size and scope. Fixed quote before scheduling. No retainer.' },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'Safety Walkthrough', path: '/safety-walkthrough' }]),
    ],
    content: `
      <h1>On-Site Safety Walkthroughs for Manufacturers, Warehouses, Contractors &amp; Fleets</h1>
      <p>A trained outside eye on your floor. We walk your operation the way an OSHA Compliance Officer would, flag what would get cited, and hand you a written, prioritized fix list within 48 hours. Starting at $1,200.</p>
      <h2>Who It's For</h2>
      <p>Small to mid-size manufacturer, warehouse, distribution center, contractor, or fleet operation in North Carolina with 5 to 100 employees and no full-time safety manager. Especially built for operations with OSHA on the calendar, a recent recordable injury, or a recent expansion.</p>
      <h2>What's Reviewed</h2>
      <p>Walking-working surfaces and egress (29 CFR 1910.22, 1910.37). Electrical panel clearance (29 CFR 1910.303-335). Machine guarding and energy control (29 CFR 1910.212, 1910.147). Forklift certification and pedestrian separation (29 CFR 1910.178). Hazard communication and SDS access (29 CFR 1910.1200). PPE, fall protection, and ladder safety. OSHA 300 log and training records.</p>
      <h2>What You Receive</h2>
      <p>Photo-documented findings. OSHA-related references where applicable. Plain-language corrective action recommendations. Color-coded priorities (RED for urgent items, AMBER for near-term corrections, GREEN for what your team is doing well). Top 10 Fixes summary. Private engagement — nothing leaves your facility except the report.</p>
      <h2>Next Steps</h2>
      <ol><li>Request a walkthrough — 4-field form takes 60 seconds.</li><li>Or start a full client intake.</li><li>Schedule the visit during normal work hours.</li><li>1 to 3 hours on the floor.</li><li>Written report in 48 hours.</li></ol>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — vince@giglinecompliance.com</p>
    `,
  },
  {
    path: '/documentation-gap-check',
    title: 'OSHA Documentation Readiness Review — Written Programs, SDS & Training Records | GigLine',
    description: `Independent OSHA Documentation Readiness Review of your written safety programs, SDS binder, training records, and required OSHA documentation. Written findings report in 48 hours. Starting at ${DOC_REVIEW_PRICE_LABEL}. Serving NC manufacturers, warehouses, contractors, and fleets.`,
    canonical: '/documentation-gap-check',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'OSHA Documentation Readiness Review',
        description: 'Independent review of written OSHA safety programs, SDS binders, training records, and required documentation. Written findings report delivered within 48 hours.',
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        offers: { '@type': 'Offer', price: DOC_REVIEW_PRICE_NUM, priceCurrency: 'USD' },
      },
      faqSchema([
        { q: 'Who is an OSHA Documentation Readiness Review for?', a: 'Operations that have safety paperwork but aren\'t sure it would hold up under an OSHA inspector\'s review — typically 10 to 100 employees preparing for an OSHA inspection, insurance audit, or customer compliance review.' },
        { q: 'What documents are reviewed?', a: 'Written Hazard Communication program and SDS binder, Lockout/Tagout program, Powered Industrial Truck certifications, PPE hazard assessments, Bloodborne pathogens plan, Emergency Action Plan, OSHA 300 log and 300A summary, and training records.' },
        { q: 'Is the documentation review remote or on-site?', a: 'OSHA Documentation Readiness Reviews are remote-friendly. We send a secure upload link and a prep checklist by email — no need to mail physical binders. On-site reviews are also available.' },
        { q: 'How much does an OSHA Documentation Readiness Review cost?', a: `OSHA Documentation Readiness Reviews start at ${DOC_REVIEW_PRICE_LABEL}. Fixed quote before scheduling.` },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'OSHA Documentation Readiness Review', path: '/documentation-gap-check' }]),
    ],
    content: `
      <h1>Independent Review of Your Safety Documentation — Programs, SDS &amp; Training Records</h1>
      <p>If OSHA opened your binder tomorrow, what would they find? An OSHA Documentation Readiness Review walks every written program, training record, and SDS file against the actual standards — and tells you exactly what is missing, expired, or out of date. Starting at ${DOC_REVIEW_PRICE_LABEL}.</p>
      <h2>Who It's For</h2>
      <p>Operations preparing for an OSHA inspection, insurance audit, or customer compliance review. New safety coordinators inheriting binders. Companies past the size where paperwork can stay informal. Contractors asked for documentation by a GC or insurer.</p>
      <h2>What's Reviewed</h2>
      <p>Written Hazard Communication program and SDS binder index against actual chemical inventory. Lockout/Tagout written program, machine-specific procedures, annual audit records. Powered Industrial Truck operator certifications, refresher dates, daily inspection logs. PPE hazard assessments. Bloodborne pathogens exposure control plan. Emergency Action Plan. OSHA 300 log, 300A annual summary, 5-year retention file. Training records.</p>
      <h2>What You Receive</h2>
      <p>Document-by-document inventory. Readiness analysis — missing programs, missing records, expired certifications. OSHA-related references where applicable for each gap. Prioritized corrective action recommendations. Plain-language templates for the most common missing programs. Optional 30-minute follow-up call.</p>
      <h2>Next Steps</h2>
      <ol><li>Start a client intake — select OSHA Documentation Readiness Review.</li><li>Share documents securely via the link we send.</li><li>Independent review against current OSHA standards.</li><li>Written findings report in 48 hours.</li><li>Optional follow-up call to walk through findings.</li></ol>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — vince@giglinecompliance.com</p>
    `,
  },
  {
    path: '/osha-compliance-gap-check',
    title: 'Compliance Readiness Visit — Pre-Inspection Review for NC Operations | GigLine',
    description: 'Full Compliance Readiness Visit — combined on-site walkthrough and OSHA Documentation Readiness Review. Built for operations preparing for an OSHA inspection, audit, or insurance review. Written report in 48 hours. Serving NC manufacturers, warehouses, contractors, and fleets.',
    canonical: '/osha-compliance-gap-check',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Compliance Readiness Visit',
        description: 'A combined on-site walkthrough and OSHA Documentation Readiness Review for operations preparing for an OSHA inspection, audit, or insurance review. The most thorough engagement GigLine offers.',
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        offers: { '@type': 'Offer', price: '2000', priceCurrency: 'USD' },
      },
      faqSchema([
        { q: 'Who is a Compliance Readiness Visit for?', a: 'Operations with OSHA on the calendar, those that had a recordable injury or workers\' comp flag, businesses where an insurance carrier or major customer asked for documented compliance evidence, or operations going through M&A due diligence.' },
        { q: 'What is included in a Compliance Readiness Visit?', a: 'A combined on-site walkthrough and OSHA Documentation Readiness Review — covering both the floor AND the binder, plus a cross-check between them. Includes the Supervisor Safety Starter System ($199 value).' },
        { q: 'How is this different from a safety walkthrough?', a: 'A safety walkthrough covers the floor. An OSHA Documentation Readiness Review covers the binder. A Compliance Readiness Visit does both, plus a cross-check that confirms the floor reality matches the written programs.' },
        { q: 'How much does a Compliance Readiness Visit cost?', a: 'Compliance Readiness Visits start at $2,000. Custom-quoted by operation size and scope. No retainer.' },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'Compliance Readiness Visit', path: '/osha-compliance-gap-check' }]),
    ],
    content: `
      <h1>A Compliance Readiness Visit Before an Inspection, Audit, or Insurance Review</h1>
      <p>The most thorough engagement GigLine offers. A combined on-site walkthrough and documentation review — covering the floor AND the binder — so you know exactly where you stand against the OSHA standards that apply to your operation. Most engagements between $1,200 and $2,400.</p>
      <h2>Who It's For</h2>
      <p>OSHA inspection on the calendar. Recent recordable injury, severe near-miss, or workers' comp flag. Insurance carrier or major customer requesting documented compliance evidence. M&amp;A due diligence. New safety responsibility and need a full independent baseline.</p>
      <h2>What's Reviewed</h2>
      <p>On-site walkthrough — every floor area, work cell, storage, and egress path. Written program review — HazCom, LOTO, PIT, PPE, EAP, Bloodborne, and industry-specific programs. Training record audit — every active employee mapped to required training with expiration tracking. Recordkeeping audit — 300 log, 300A, 5-year retention, incident reports. Cross-check between floor reality and written programs. Industry-specific exposure check.</p>
      <h2>What You Receive</h2>
      <p>Executive summary — 5 to 10 biggest exposures in priority order. Floor findings with OSHA references and corrective actions. Documentation findings — program gaps, missing records, expired certifications. Training matrix — every employee, every required training, current status. Recordkeeping report. 30-60-90 day corrective action roadmap. Optional follow-up call to brief leadership.</p>
      <h2>Next Steps</h2>
      <ol><li>Call (336) 329-8899 or start a client intake.</li><li>Receive a custom quote within one business day.</li><li>Schedule the engagement — typically completes within 7 to 14 days.</li><li>On-site walkthrough plus 2 to 3 days of independent review.</li><li>Written compliance report delivered.</li><li>Optional 60-minute leadership brief.</li></ol>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — vince@giglinecompliance.com</p>
    `,
  },
];

// City landing pages
const CITY_META = {
  'winston-salem':  { name: 'Winston-Salem',  distance: '10 miles from Kernersville', industries: 'manufacturing plants, food processing facilities, and distribution centers', price: 650 },
  'greensboro':     { name: 'Greensboro',     distance: '15 miles from Kernersville', industries: 'warehouses, light manufacturing, and logistics operations', price: 650 },
  'high-point':     { name: 'High Point',     distance: '12 miles from Kernersville', industries: 'furniture manufacturing, warehousing, and small fabrication shops', price: 650 },
  'charlotte':      { name: 'Charlotte',      distance: '75 miles from Kernersville', industries: 'manufacturing, construction contractors, and warehouse operations', price: 650 },
  'raleigh':        { name: 'Raleigh',        distance: '75 miles from Kernersville', industries: 'growing manufacturing operations, warehouse facilities, and construction sites', price: 650 },
  'burlington':     { name: 'Burlington',     distance: '30 miles from Kernersville', industries: 'textile operations, small manufacturers, and distribution facilities', price: 650 },
  'kernersville':   { name: 'Kernersville',   distance: 'GigLine HQ',                  industries: 'manufacturing, light industrial operations, and warehousing', price: 650 },
  'lexington':      { name: 'Lexington',      distance: '20 miles from Kernersville', industries: 'furniture manufacturing, food production, and small fabrication shops', price: 650 },
  'thomasville':    { name: 'Thomasville',    distance: '15 miles from Kernersville', industries: 'furniture manufacturing, cabinetry, and small production operations', price: 650 },
  'clemmons':       { name: 'Clemmons',       distance: '15 miles from Kernersville', industries: 'small manufacturers, trade contractors, and light industrial operations', price: 650 },
  'mocksville':     { name: 'Mocksville',     distance: '25 miles from Kernersville', industries: 'manufacturing, agricultural operations, and small fabrication shops', price: 650 },
  'salisbury':      { name: 'Salisbury',      distance: '50 miles from Kernersville', industries: 'manufacturing plants, distribution centers, and industrial operations', price: 750, travelNote: true },
  'asheboro':       { name: 'Asheboro',       distance: '35 miles from Kernersville', industries: 'manufacturing, metal fabrication, and distribution operations', price: 750, travelNote: true },
};

Object.keys(CITY_META).forEach((city) => {
  const m = CITY_META[city];
  const priceTop = m.price === 650 ? 1000 : 1200;
  const cityFaqs = [
    { q: `How much does a safety walkthrough cost in ${m.name}, NC?`, a: `Safety walkthroughs for ${m.name}-area operations start at $${m.price}. Most small operations fall in the $${m.price}–$${priceTop} range depending on square footage and scope. You'll receive a fixed quote before scheduling.${m.travelNote ? ` ${m.name} pricing includes travel from Kernersville — no separate travel fee at the time of the walkthrough.` : ''}` },
    { q: `How quickly can GigLine get on-site in ${m.name}?`, a: `${m.name} is ${m.distance}, so most walkthroughs are scheduled within 5–10 business days of the initial request. Urgent or post-incident visits can often be scheduled the same week.` },
    { q: `What kind of operations does GigLine walk through in ${m.name}?`, a: `${m.industries.charAt(0).toUpperCase() + m.industries.slice(1)}. Typical client size is 5 to 100 employees — operations without a full-time safety manager that need a trained outside eye on the floor.` },
    { q: `Will findings from my ${m.name} walkthrough be reported to OSHA?`, a: `No. The engagement is private. The only deliverable is the written report handed to you — nothing is shared with OSHA, insurance carriers, or any third party.` },
  ];

  routes.push({
    path: `/safety-walkthrough/${city}`,
    title: `Safety Walkthrough ${m.name}, NC | GigLine Safety & Compliance`,
    description: `On-site OSHA safety walkthroughs for small manufacturers and warehouses in ${m.name}, NC. Written report with findings, photos, and corrective actions. Starting at $${m.price}.`,
    canonical: `/safety-walkthrough/${city}`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Safety Walkthrough in ${m.name}, NC`,
        description: `On-site OSHA safety walkthroughs for ${m.industries} in ${m.name} and surrounding areas. Written report delivered within 24–48 hours. Starting at $${m.price}.`,
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'City', name: m.name, containedInPlace: { '@type': 'State', name: 'North Carolina' } },
        offers: { '@type': 'Offer', price: String(m.price), priceCurrency: 'USD' },
      },
      faqSchema(cityFaqs),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: `${m.name} Walkthrough`, path: `/safety-walkthrough/${city}` }]),
    ],
    content: `
      <h1>Safety Walkthrough — ${m.name}, NC</h1>
      <p>On-site OSHA safety walkthroughs for ${m.industries} in ${m.name} and surrounding areas. Starting at $${m.price}. Written report delivered within 24-48 hours.</p>
      <h2>${m.name} Safety Walkthrough FAQ</h2>
      ${cityFaqs.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join('')}
      <p><a href="/faq">See all 18 frequently asked questions →</a></p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — Kernersville, NC (${m.distance})</p>
    `,
  });
});

// Field note detail pages
const fieldNotes = [
  {
    slug: 'ai-generated-safety-programs',
    title: 'AI-Generated Safety Programs',
    desc: 'Operators are using ChatGPT to generate OSHA safety programs. The output looks compliant — until an inspector arrives. Why AI-generated programs fail at the floor level.',
    customSeoTitle: "AI-Generated Safety Programs vs. OSHA Compliance: What ChatGPT Can't See on Your Floor | GigLine Safety & Compliance",
    customH1: "An AI-Generated Safety Program Is Not a Working Safety Program",
    ogImage: '/assets/field-notes/ai-safety-programs-hero.png',
    customContent: `
      <h1>An AI-Generated Safety Program Is Not a Working Safety Program</h1>
      <p><em>What ChatGPT can't see on your floor — and why OSHA can.</em></p>
      <p>A lot of operators are using ChatGPT and similar tools to generate safety programs right now. The output may look legitimate. It may cite real OSHA standards. The formatting may be clean. You can print it, put it in a binder, and feel like the box is checked.</p>
      <p>The problem is this: <strong>OSHA does not just look at your binder. OSHA looks at your operation.</strong></p>
      <p>An AI-generated program does not know your equipment. It does not know about the machine in the back corner with a missing guard. It does not know your employees are skipping lockout steps because nobody showed them the correct process. It does not know your SDS binder lists chemicals you no longer use while missing chemicals used every day.</p>
      <p>A generic program describes what a compliant operation should look like. It does not prove what your operation actually looks like.</p>
      <p>When an OSHA compliance officer walks in, they may review paperwork, ask employees questions, observe equipment, and compare written procedures against what is happening on the floor. When the paperwork and the work do not match, that gap can become a problem.</p>
      <p><strong>The document is not the program. The program is what your people do every day.</strong></p>
      <h2>What Gets Missed in AI-Generated Programs</h2>
      <ul>
        <li>The unguarded machine in the back corner — never appears in any AI-generated written program</li>
        <li>Employees skipping lockout/tagout steps because the AI program does not match the equipment</li>
        <li>SDS binders that include chemicals removed from service and miss chemicals added last month</li>
        <li>Training records that reference generic AI-suggested topics, not the actual equipment in use</li>
        <li>Written procedures that describe a different facility — wrong square footage, wrong layout, wrong hazards</li>
        <li>Lockout-tagout procedures with no machine-specific energy isolation — generic boilerplate that would not pass an inspection</li>
        <li>Employees and supervisors who cannot describe procedures the written program says they should follow</li>
      </ul>
      <h2>What an OSHA Compliance Officer Actually Checks</h2>
      <ul>
        <li>Whether written programs match the equipment and chemicals actually on site</li>
        <li>Employee interviews — supervisors and operators asked to describe procedures from memory</li>
        <li>Training records traceable to specific employees, dates, and tasks</li>
        <li>SDS binder cross-referenced against current chemical inventory</li>
        <li>Floor observation matched against written lockout/tagout and machine-specific procedures</li>
        <li>Recordkeeping (OSHA 300 log, 300A summary) reconciled against incident history</li>
      </ul>
      <h2>What GigLine Looks For on the Floor</h2>
      <p><em>When I walk an operation with AI-generated documentation, the binder usually looks polished. Real OSHA standards are cited. Formatting is clean. Then I ask the floor supervisor to describe the lockout procedure for the press they ran this morning — and they cannot. I check the SDS binder against the chemical drum I just walked past — and it is not in there. The gap between the document and the work is exactly what an inspector will find.</em></p>
      <h2>What to Do About It</h2>
      <p>If you used AI to generate safety documentation — or you are not sure whether your safety program reflects your current operation — a GigLine walkthrough can help you find out where you stand. Practical review of visible safety gaps, documentation concerns, and corrective action priorities. No software to learn. No generic binder talk. Just ground truth from the floor.</p>
      <h2>Frequently Asked Questions</h2>
      <h3>Can I use ChatGPT to write my OSHA safety program?</h3>
      <p>You can use it as a starting point, but an AI-generated safety program does not reflect your actual operation. It does not know your equipment, your chemicals, your training history, or your facility layout. OSHA does not just review your binder — they walk your floor, interview your supervisors, and compare what is written against what is happening.</p>
      <h3>What does OSHA actually look at during an inspection?</h3>
      <p>OSHA Compliance Officers review paperwork, ask employees questions, observe equipment and work practices, and compare written procedures against the floor reality. They pay close attention to whether supervisors can describe procedures from memory, whether SDS binders match current chemical use, and whether training records can be traced back to specific employees and tasks.</p>
      <h3>Why do AI-generated safety programs fail OSHA inspections?</h3>
      <p>Generic AI-generated programs describe what a compliant operation should look like — they do not prove what your operation actually looks like. They miss site-specific hazards. When OSHA sees a polished written program that does not match floor reality, the gap itself becomes evidence.</p>
      <p>Request a Safety Walkthrough: <a href="${BASE_URL}/request-walkthrough">${BASE_URL}/request-walkthrough</a> · Call or text (336) 329-8899 · GigLine Safety &amp; Compliance — Kernersville, NC</p>
    `,
    customFaqs: [
      { q: 'Can I use ChatGPT to write my OSHA safety program?', a: 'You can use it as a starting point, but an AI-generated safety program does not reflect your actual operation. It does not know your equipment, your chemicals, your training history, or your facility layout. OSHA does not just review your binder — they walk your floor, interview your supervisors, and compare what is written against what is happening. When the two do not match, that gap can become a citation.' },
      { q: 'What does OSHA actually look at during an inspection?', a: 'OSHA Compliance Officers review paperwork, ask employees questions, observe equipment and work practices, and compare written procedures against the floor reality. They pay close attention to whether supervisors can describe procedures from memory, whether SDS binders match current chemical use, and whether training records can be traced back to specific employees and tasks.' },
      { q: 'Why do AI-generated safety programs fail OSHA inspections?', a: 'Generic AI-generated programs describe what a compliant operation should look like — they do not prove what your operation actually looks like. They miss site-specific hazards. When OSHA sees a polished written program that does not match floor reality, the gap itself becomes evidence.' },
      { q: 'What is the difference between a document and a working safety program?', a: 'A document describes procedures. A working safety program is what your people do every day. OSHA cites the gap between the two. The fastest way to find that gap is an outside walkthrough — someone who looks at your floor with fresh eyes and compares what they see against what is written.' },
    ],
  },
  { slug: 'heat-stress', title: 'Heat Stress', desc: 'Heat illness prevention for NC manufacturing and warehouse operations.' },
  { slug: 'forklift-safety', title: 'Forklift Safety & Daily Inspections', desc: 'OSHA forklift inspection requirements. Daily pre-shift checklists, operator certification, pedestrian separation.' },
  { slug: 'electrical-safety', title: 'Electrical Safety & Arc Flash', desc: 'OSHA electrical panel clearance, arc flash labeling, lockout-tagout for electrical maintenance.' },
  { slug: 'hazcom', title: 'HazCom & SDS', desc: 'Hazard Communication standard requirements. Written programs, SDS management, container labeling, employee training.' },
  { slug: 'machine-guarding', title: 'Machine Guarding', desc: 'OSHA machine guarding requirements for presses, lathes, mills, and saws.' },
  { slug: 'walking-surfaces', title: 'Walking Surfaces', desc: 'Walking-working surface requirements. Aisle clearance, floor conditions, housekeeping.' },
  { slug: 'lockout-tagout', title: 'Lockout/Tagout', desc: 'Control of hazardous energy. Written procedures, authorized employees, annual audits.' },
  { slug: 'emergency-action-plans', title: 'Emergency Action Plans', desc: 'Emergency action plan requirements for small operations. Evacuation routes, alarm systems, training.' },
  { slug: 'ppe-assessment', title: 'PPE Assessment & Use', desc: 'Personal protective equipment hazard assessment, selection, training, and documentation.' },
  { slug: 'fall-protection', title: 'Fall Protection', desc: 'Fall protection for warehouses. Mezzanines, loading docks, elevated platforms, the 4-foot rule.' },
  { slug: 'confined-space', title: 'Confined Space Entry', desc: 'Permit-required confined space program. Atmospheric testing, entry permits, rescue procedures.' },
  { slug: 'scaffolding-safety', title: 'Scaffolding Safety', desc: 'OSHA scaffolding requirements. Competent person, guardrails, load capacity, daily inspections.' },
  { slug: 'hearing-conservation', title: 'Hearing Conservation', desc: 'Hearing conservation program requirements. Noise monitoring, audiometric testing, hearing protection.' },
  { slug: 'bloodborne-pathogens', title: 'Bloodborne Pathogens', desc: 'Bloodborne pathogens exposure control plan. First aid responders, Hepatitis B, sharps disposal.' },
];
fieldNotes.forEach((note) => {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: note.customH1 || note.title,
      description: note.desc,
      author: { '@id': `${BASE_URL}/#vince` },
      publisher: { '@id': `${BASE_URL}/#business` },
      mainEntityOfPage: `${BASE_URL}/field-notes/${note.slug}`,
    },
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'Field Notes', path: '/field-notes' }, { name: note.title, path: `/field-notes/${note.slug}` }]),
  ];
  if (note.customFaqs && note.customFaqs.length) {
    schemas.push(faqSchema(note.customFaqs));
  }
  routes.push({
    path: `/field-notes/${note.slug}`,
    title: note.customSeoTitle || `${note.title} — Field Notes | GigLine Safety & Compliance`,
    description: note.desc,
    canonical: `/field-notes/${note.slug}`,
    ogImage: note.ogImage,
    schemas,
    content: note.customContent || `<h1>${note.title}</h1><p>${note.desc}</p><p>Field Note by Vince Lawrence — GigLine Safety &amp; Compliance — (336) 329-8899</p>`,
  });
});

// ───────────────────────────────────────────────
// HTML generation
// ───────────────────────────────────────────────
function buildSchemaBlock(schemas) {
  if (!schemas || !schemas.length) return '';
  return schemas
    .map((s) => `    <script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');
}

function generateRouteHTML(templateHTML, route) {
  let html = templateHTML;

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

  // description
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${route.description}" />`,
  );

  // canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${BASE_URL}${route.canonical}" />`,
  );

  // OG
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${BASE_URL}${route.canonical}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${route.description}" />`);
  if (route.ogImage) {
    const ogImageUrl = route.ogImage.startsWith('http') ? route.ogImage : `${BASE_URL}${route.ogImage}`;
    html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${ogImageUrl}" />`);
    html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${ogImageUrl}" />`);
  }

  // Twitter
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${route.description}" />`);

  // Strip ALL existing JSON-LD schema blocks from the template (LocalBusiness
  // from index.html) so every route gets a clean, route-specific schema set.
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

  // Inject route-specific schema block right before </head>
  const schemaBlock = buildSchemaBlock(route.schemas || []);
  if (schemaBlock) {
    html = html.replace('</head>', `${schemaBlock}\n  </head>`);
  }

  // Inject crawler-visible content into #root
  // ── FOUC fix ──
  // We position the pre-rendered content off-screen (sr-only style) so it stays
  // in the HTML source (indexable by AI engines / crawlers that read raw HTML),
  // but does not visually render for human visitors before React hydrates.
  // Result: no flash of unstyled serif text before the React tree mounts.
  if (route.content) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><div data-server-rendered="true" aria-hidden="true" style="position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;font-family:Georgia,serif;color:#1C2B2B;">${route.content.trim()}</div></div>`,
    );
  }

  return html;
}

function main() {
  const templatePath = path.join(BUILD_DIR, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('Build index.html not found. Run craco build first.');
    process.exit(1);
  }

  const templateHTML = fs.readFileSync(templatePath, 'utf-8');
  let generated = 0;

  for (const route of routes) {
    const routePath = route.path === '/' ? '' : route.path;
    const routeDir = routePath ? path.join(BUILD_DIR, routePath) : BUILD_DIR;
    const routeFile = routePath ? path.join(routeDir, 'index.html') : path.join(BUILD_DIR, 'index.html');

    if (routePath) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    const routeHTML = generateRouteHTML(templateHTML, route);
    fs.writeFileSync(routeFile, routeHTML);
    generated++;
    console.log(`  SEO: ${route.path || '/'} → ${routePath ? routePath + '/index.html' : 'index.html'}`);
  }

  console.log(`\n  SEO: Generated ${generated} pre-rendered HTML files with content + JSON-LD schema.`);
  console.log('  All pages include route-specific LocalBusiness / FAQPage / Service / Person / BreadcrumbList JSON-LD.\n');
}

main();
