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
  priceRange: '$950–$12000',
  paymentAccepted: 'Credit Card, ACH, Check, Stripe',
  currenciesAccepted: 'USD',
  slogan: 'Find the gaps before OSHA does.',
  knowsAbout: [
    'OSHA compliance',
    'OSHA 29 CFR 1910 (General Industry)',
    'OSHA 29 CFR 1926 (Construction)',
    'safety walkthroughs',
    'hazard communication (HazCom)',
    'lockout/tagout (LOTO)',
    'machine guarding',
    'forklift / powered industrial truck safety',
    'fall protection',
    'respiratory protection',
    'incident investigation',
    'OSHA 300 recordkeeping',
    'safety program documentation',
    'manufacturing safety',
    'warehouse safety',
    'fleet safety',
    'contractor safety',
    'North Carolina OSHA inspection preparation',
  ],
  openingHours: 'Mo-Fr 08:00-18:00',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Safety Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Safety Walkthrough & Top 10 Fixes Report' }, price: '1200', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'OSHA Documentation Readiness Review' }, price: DOC_REVIEW_PRICE_NUM, priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Incident Review & Corrective Action Support' }, price: '1500', priceCurrency: 'USD' },
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
  { q: "What do I get when it's done?", a: "A written report delivered within 48 hours. It includes photo-documented findings, OSHA-related references where applicable, and a plain-language corrective action recommendation for each item. No guesswork about what to fix or why." },
  { q: 'Do you work with my insurance company or report to OSHA?', a: "No. This is a private engagement. Nothing leaves the building except the report I give you. As part of a standard engagement, I don't contact your insurer, your carrier, or any regulatory agency. What you do with the findings is entirely your decision." },
  { q: 'What if my operation is outside the Triad?', a: 'On-site walkthroughs are available within roughly 60 miles of Winston-Salem — covering the full Triad and surrounding areas. For locations beyond that range, contact me directly. Travel engagements are available and travel fees may apply.' },
];

// Canonical 18-question FAQ for /faq page
const FULL_FAQS = [
  { q: 'How much does an OSHA safety walkthrough cost in North Carolina?', a: "GigLine safety walkthroughs start at $1,200. Price is scoped based on square footage, machine count, employee count, and hazard complexity. Fixed quote before scheduling. No hourly billing, no retainer, no surprise invoice. For context: a single OSHA serious violation can cost up to $16,550 per citation (2026 adjusted rate). The walkthrough identifies what's exposed before an inspector does." },
  { q: 'What does an OSHA safety consultant do on-site?', a: "During a GigLine Safety Walkthrough, Vince Lawrence — OSHA 30-Hour Certified safety compliance consultant based in Kernersville, NC — walks every area of your facility. He photographs findings, documents each one against the applicable CFR standard, and provides an estimated penalty exposure based on OSHA published maximums. Within 48 hours you receive a written report with photo documentation, CFR citations, and a prioritized list of corrective actions. The engagement is private — findings are not shared, published, or referenced without written permission." },
  { q: 'How do I prepare for an OSHA inspection in a small manufacturing plant?', a: "The most effective preparation is a third-party walkthrough before OSHA arrives. OSHA inspections are triggered by employee complaints, referrals, fatalities, or programmed inspections — they do not announce in advance. A GigLine Safety Walkthrough gives you a written report of the conditions an inspector may review, documented against the same standards OSHA uses. The walkthrough starts at $1,200. A single serious citation can cost up to $16,550." },
  { q: 'What is a Compliance Readiness Visit?', a: "GigLine's most complete single engagement. Combines the Safety Walkthrough and Documentation Review in one on-site visit. One consolidated written report covering both physical findings and documentation gaps, with a prioritized corrective action plan. Starts at $2,000. Booking separately starts at $2,500. The combined visit covers both for less." },
  { q: 'What is the difference between a Safety Walkthrough and a Compliance Readiness Visit?', a: "The Safety Walkthrough covers the physical floor — starts at $1,200, report in 48 hours. The CRV adds a full documentation review to the same visit — written programs, training records, HazCom binder, OSHA 300 log — starts at $2,000. If unsure, the walkthrough is the lower-barrier starting point." },
  { q: "What's included in a GigLine safety walkthrough?", a: "A GigLine safety walkthrough includes a 1–3-hour on-site review, photo-documented safety observations, OSHA-related references where applicable, and a written 'Top 10 Fixes' report delivered within 48 hours. Findings are color-coded: RED for urgent items, AMBER for near-term corrections, and GREEN for what your team is doing well." },
  { q: 'How long does a safety walkthrough take on-site?', a: 'Most walkthroughs take 1 to 3 hours on-site. A small shop under 10,000 sq ft may take less than an hour. Larger warehouses, production floors, or multi-area operations may take 2 to 3 hours or require a larger scoped visit. You will receive a time estimate before the visit.' },
  { q: "What's the difference between a safety walkthrough and an OSHA inspection?", a: 'An OSHA inspection is performed by a federal or state compliance officer and may result in citations, penalties, and required abatement. A GigLine safety walkthrough is a private, voluntary review performed by an independent consultant. Findings are delivered only to you — nothing is reported to OSHA, your insurance carrier, or any third party.' },
  { q: 'Do I need a written HazCom program if I have fewer than 10 employees?', a: 'In most cases, yes. Under OSHA 29 CFR 1910.1200, employers with hazardous chemicals in the workplace must maintain a written Hazard Communication program, regardless of headcount. Exceptions are limited and generally apply only to sealed consumer-packaged products used in the same way a household consumer would use them.' },
  { q: 'What areas of North Carolina does GigLine serve?', a: 'GigLine is based in Kernersville, NC and serves the Piedmont Triad, including Winston-Salem, Greensboro, High Point, Burlington, Lexington, Thomasville, Salisbury, and surrounding communities. Most on-site work is scheduled within roughly 60 miles of Winston-Salem. Charlotte and Raleigh metro engagements may be considered based on scope and travel.' },
  { q: 'Will GigLine report findings to OSHA?', a: "No. GigLine engagements are private. The written report is delivered to the client only. GigLine does not contact OSHA, your insurance carrier, or any regulatory agency as part of a standard walkthrough or documentation review." },
  { q: 'How fast do I get my walkthrough report?', a: 'Reports are typically delivered within 48 hours of the on-site visit. The report is provided as a PDF and may include photos, OSHA-related references where applicable, and prioritized corrective action recommendations. Many clients receive the report by the next business day.' },
  { q: 'What is a "Top 10 Fixes" report?', a: "The GigLine deliverable for a safety walkthrough. It ranks the ten most important findings from your on-site visit, organized RED for urgent items, AMBER for near-term corrections, and GREEN for what your team is doing well. Each item includes what was observed, why it matters, the OSHA-related reference where applicable, and a recommended corrective action." },
  { q: 'Does GigLine work with my insurance carrier?', a: 'No. The engagement is strictly between the business owner and GigLine. Nothing is shared with insurance carriers, brokers, or third parties. What you choose to do with the report — including sharing it with your carrier — is entirely your decision.' },
  { q: 'Can I see a sample safety walkthrough report before I book?', a: "Yes. Email vince@giglinecompliance.com or call (336) 329-8899 and request a sanitized sample. Sensitive client details are redacted but the structure, depth, and OSHA references are identical to what you'll receive." },
  { q: 'What industries does GigLine typically work with?', a: 'Small manufacturers, warehouses, distribution centers, fleet operations, general contractors, and specialty trades. Most clients have 5 to 100 employees. The common thread is operations that do not have a full-time safety manager.' },
  { q: 'Does GigLine offer safety training or just inspections?', a: 'GigLine does not deliver formal OSHA training courses. The walkthrough includes on-site coaching while walking the floor, and the report includes corrective actions that often reference training requirements. For formal certification-based training, GigLine can recommend local providers.' },
  { q: 'Is Vince Lawrence OSHA certified?', a: 'Vince Lawrence is OSHA 30-Hour Certified in General Industry and has 25+ years of hands-on experience in manufacturing, fleet, and warehouse safety. He is also a U.S. Navy veteran. GigLine is owner-operated — every walkthrough and report is performed personally by Vince.' },
  { q: 'What happens if OSHA shows up after my walkthrough?', a: 'You have the written record of every hazard identified, every corrective action taken, and every training record reviewed. A documented corrective-action log may help show good-faith effort, which can matter during an OSHA inspection. Documentation is the single biggest factor in how an OSHA visit goes.' },
  { q: 'Do you offer follow-up walkthroughs for past clients?', a: "Yes. Follow-up walkthroughs for past clients are offered at a reduced rate. Most operations benefit from a semi-annual or annual follow-up to catch the drift that happens when safety isn't the primary focus — and ongoing support is available through Quarterly Compliance Maintenance and the Annual Compliance Control Partner program." },
  { q: 'How should I prepare for a safety walkthrough?', a: 'Nothing special. Do not stage, clean up, or hide anything — the walkthrough is most valuable when the floor looks the way it normally does. Have your written safety programs, SDS binder, and training records accessible. A brief floor manager or supervisor introduction at the start helps.' },
  { q: 'How do I book a safety walkthrough with GigLine?', a: "Visit https://www.giglinecompliance.com/intake and fill the four-field form, or call (336) 329-8899 directly. You'll hear back within one business day with scheduling options and a confirmed price." },
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
    title: 'OSHA Safety Walkthrough — Piedmont Triad NC | GigLine',
    description: "Safety becomes the thing you'll get to. OSHA doesn't wait. On-site safety walkthroughs for NC manufacturers and warehouses — fixed quote, written report in 48 hours. (336) 329-8899.",
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
      <p><a href="/intake">Request a Walkthrough</a> &middot; <a href="/safety-check">Take the Safety Check</a></p>
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
      <p><strong>Built on the Floor, Not in a Classroom.</strong> Vince Lawrence spent years inside manufacturing operations — glass and vinyl, rubber compounding, metals fabrication.</p>
      <h2>The Cost of Waiting — A serious OSHA violation can cost up to $16,550 per citation.</h2>
      <p>That's per citation. A single inspection can produce multiple citations across multiple standards. The Safety Walkthrough starts at $1,200. Max penalty per willful or repeat violation: $165,514. Time from walkthrough to written report: 48 hours.</p>
      <p>OSHA doesn't announce inspections. They arrive after a complaint, a referral, or a fatality — or as part of a programmed inspection targeting your industry. By the time they're on your floor, the window to fix things has closed. The walkthrough is that window.</p>
      <h2>Services — Three ways to work with GigLine.</h2>
      <ul>
        <li><a href="/safety-walkthrough">Safety Walkthrough</a> — From $1,200. Documented on-site walkthrough with photo evidence, CFR citations, estimated penalty exposure based on OSHA published maximums, and a Top 10 Fixes report within 48 hours.</li>
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
      <p>Before I started GigLine, I spent years inside manufacturing. Not visiting facilities — working in them. Glass and vinyl. Rubber compounding. Metals fabrication. I was on the floor supervising crews, coordinating safety, doing Gemba walks, creating safety orientation for new hires, and seeing firsthand where safety systems broke down under production pressure.</p>
      <p>GigLine exists because most small and mid-size manufacturers can't afford a full-time safety manager — but they can afford to know what's on their floor before OSHA does. That's what I do.</p>
      <p><em>Service area: on-site within 60 miles of Winston-Salem, including Greensboro, High Point, Kernersville, Lexington, Thomasville, Salisbury, Burlington, and surrounding communities.</em></p>
      <h2>What Clients Say</h2>
      <p>"If you're looking for a partner that can bridge the gap between compliance and real-world execution, GigLine delivers results." — Demar Archie, Warehouse Receiving Manager</p>
      <h2>Recent Engagement &mdash; Case Study</h2>
      <p><a href="/case-study/metals-fabrication-statesville">What a Safety Walkthrough Actually Finds</a>. A 9-person metals fabrication facility in Statesville, NC. Combined walkthrough and documentation review. 13 findings across machine guarding, compressed gas storage, and documentation gaps. 12 of 13 corrective actions closed within four days of the walkthrough.</p>
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
    title: 'Safety Consultant Kernersville NC — Vince Lawrence | GigLine',
    description: '25+ years on the floor. OSHA 30-Hour certified. Navy veteran. An OSHA-informed floor review before an inspector shows up. (336) 329-8899.',
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
    title: 'OSHA Compliance Services — Walkthroughs & Audits | GigLine',
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
          { '@type': 'ListItem', position: 4, item: { '@type': 'Service', name: 'Incident Review & Corrective Action Support', description: 'Post-incident review, OSHA recordability determination, and corrective action documentation.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '1500', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 5, item: { '@type': 'Service', name: 'GigLine OSHA-Ready Control System', description: 'Complete four-binder physical command system, digital folder architecture, training matrix, SDS organization, and corrective action tracker. Includes supervisor walkthrough at handoff.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '4500', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 6, item: { '@type': 'Service', name: 'Quarterly Compliance Maintenance', description: 'Ongoing quarterly documentation review, training record audit, and corrective action tracker review.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '950', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 7, item: { '@type': 'Service', name: 'Annual Compliance Control Partner', description: 'Two annual walkthroughs, four documentation reviews per year, quarterly review calls, OSHA 300A posting reminders, pre-inspection readiness review, and direct on-call access between visits. $1,000/month equivalent.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '12000', priceCurrency: 'USD' } } },
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
      <p>The floor and the files reviewed in a single visit. Full safety walkthrough on-site, OSHA Documentation Readiness Review, single compliance percentage score, photo documentation, CFR citations, written report within 48 hours. Supervisor Safety Starter System included.</p>
      <h2>Standalone Services</h2>
      <h3>Safety Walkthrough Report — Starting at $1,200</h3>
      <p>On-site walkthrough (1–3 hours). Photo-documented hazard findings. CFR citations + estimated penalty exposure based on OSHA published maximums. Top 10 Fixes report — RED / AMBER / GREEN priority. Delivered within 48 hours.</p>
      <h3>OSHA Documentation Readiness Review — Starting at ${DOC_REVIEW_PRICE_LABEL}</h3>
      <p>Structured review of written programs, training records, OSHA logs, inspection records, and SDS compliance. 53-item checklist across seven OSHA categories.</p>
      <h3>Incident Review & Corrective Action Support — Starting at $1,500</h3>
      <p>Post-injury or post-near-miss response. Root cause analysis. OSHA recordability determination. OSHA 301 completion. Corrective action plan.</p>
      <h3>Document Development — From $350</h3>
      <p>GigLine writes the programs you are missing. LOTO, HazCom, PPE hazard assessment, Emergency Action Plan, machine-specific procedures. Floor pricing: single program from $350, LOTO + 5 machines from $650, LOTO + 6–15 machines from $1,200, full suite (5+ programs) from $2,000. Scoped and quoted after a Documentation Readiness Review.</p>
      <h2>GigLine OSHA-Ready Control System — Starting at $4,500</h2>
      <p>Premium engagement. Four-binder physical command system, digital folder architecture, training matrix + SDS organization, corrective action tracker, 90-day maintenance calendar, supervisor walkthrough at handoff.</p>
      <h2>The Natural Next Step — Quarterly and Annual Support</h2>
      <p>Quarterly Compliance Maintenance — Starting at $950/quarter. Annual Compliance Control Partner — $12,000/year ($1,000/month equivalent).</p>
      <h2>The GigLine Readiness Path</h2>
      <p>Find the issues — Safety Walkthrough from $1,200. Check the files — OSHA Documentation Readiness Review from ${DOC_REVIEW_PRICE_LABEL}. Review both — Compliance Readiness Visit from $2,000. Build the system — OSHA-Ready Control System from $4,500. Keep it current — Quarterly Maintenance from $950/quarter.</p>
      <h2>Recent Engagement &mdash; Case Study</h2>
      <p><a href="/case-study/metals-fabrication-statesville">What a Safety Walkthrough Actually Finds</a>.</p>
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
      <p><a href="/intake">Request a Safety Walkthrough →</a></p>
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
        description: 'The five most-cited OSHA violations in small manufacturing: Hazard Communication, Lockout/Tagout, Machine Guarding, Powered Industrial Trucks, and Walking-Working Surfaces.',
        image: `${BASE_URL}/og-image.png`,
        author: { '@id': `${BASE_URL}/#vince` },
        publisher: { '@id': `${BASE_URL}/#business` },
        mainEntityOfPage: `${BASE_URL}/blog/top-5-osha-violations-small-manufacturing`,
        datePublished: '2025-10-15',
        dateModified: '2026-02-15',
        articleSection: 'OSHA Compliance',
        inLanguage: 'en-US',
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
        description: 'Complete guide to OSHA Hazard Communication requirements for small businesses. Written programs, Safety Data Sheets, labeling, training, and penalties under 29 CFR 1910.1200.',
        image: `${BASE_URL}/og-image.png`,
        author: { '@id': `${BASE_URL}/#vince` },
        publisher: { '@id': `${BASE_URL}/#business` },
        mainEntityOfPage: `${BASE_URL}/blog/hazcom-requirements-small-business`,
        datePublished: '2025-11-12',
        dateModified: '2026-02-15',
        articleSection: 'OSHA Compliance',
        inLanguage: 'en-US',
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
    path: '/intake',
    title: 'Request a Safety Walkthrough | GigLine Safety & Compliance',
    description: 'Request an on-site safety walkthrough for your operation. One visit. Clear findings. Written report within 48 hours. Kernersville, NC.',
    canonical: '/intake',
    schemas: [LOCAL_BUSINESS],
    content: `
      <h1>Request a Safety Walkthrough</h1>
      <p>Schedule an on-site safety walkthrough with GigLine Safety &amp; Compliance. One visit. Clear findings. Written report within 48 hours. <strong>Starting at $1,200</strong>.</p>
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
    path: '/supervisor-kit',
    title: 'Supervisor Safety Starter System | GigLine Safety & Compliance',
    description: '11 documents. CFR citations. Built for the person responsible for safety when no one else is watching. $600 digital. $675 physical with binder, field manual, and direct access to Vince.',
    canonical: '/supervisor-kit',
    schemas: [
      LOCAL_BUSINESS,
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Supervisor Safety Starter System', path: '/supervisor-kit' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Supervisor Safety Starter System',
        description: '11-document supervisor-ready safety system built for small manufacturing, warehouse, and contractor operations. CFR-cited. Inspection protocols. HazCom program, SDS index, training records, monthly inspection checklist, "If OSHA Shows Up" protocol, and more.',
        brand: { '@type': 'Brand', name: 'GigLine Safety & Compliance' },
        category: 'Workplace Safety / OSHA Compliance Documentation',
        offers: [
          {
            '@type': 'Offer',
            name: 'Digital Kit',
            description: 'Instant download — all 11 documents as print-ready PDFs',
            price: '600',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/supervisor-kit`,
          },
          {
            '@type': 'Offer',
            name: 'Physical Kit',
            description: 'Printed, bound, and shipped USPS Priority. Includes GigLine 2026 Triad OSHA Field Manual and direct contact card.',
            price: '675',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/supervisor-kit`,
          },
        ],
      },
    ],
    content: `
      <h1>Supervisor Safety Starter System</h1>
      <p><strong>Built for the person responsible for safety when no one else is watching.</strong></p>
      <p>11 documents. CFR citations. Inspection protocols. Every form maps directly to an OSHA standard. Use it consistently and you will be prepared for any inspection, incident, or audit.</p>

      <h2>What&rsquo;s inside</h2>
      <ol>
        <li>Quick Reference Summary Card &mdash; post at your supervisor station</li>
        <li>Welcome &amp; Usage Guide &mdash; read first, sets up the system</li>
        <li>Chemical Inventory Log &mdash; list every chemical on site</li>
        <li>SDS Index &amp; Binder Log &mdash; track SDS location per chemical</li>
        <li>Written HazCom Program &mdash; your required written safety program</li>
        <li>30-Day Supervisor Action Checklist &mdash; week-by-week implementation roadmap</li>
        <li>One Phone Call Card &mdash; six scenarios, post at your supervisor station</li>
        <li>If OSHA Shows Up &mdash; seven-step protocol, post near your front entrance</li>
        <li>When to Call for Help &mdash; Red Flag List with CFR citations</li>
        <li>Monthly Safety Inspection Checklist &mdash; 40+ items, signature block, retention instruction</li>
        <li>Employee Training Record Log &mdash; document every safety training session</li>
      </ol>

      <h2>Pricing</h2>
      <p><strong>Digital Kit &mdash; $600.</strong> Instant download. All 11 documents as print-ready PDFs.</p>
      <p><strong>Physical Kit &mdash; $675.</strong> Printed and bound in a 3-ring binder. Includes the GigLine 2026 Triad OSHA Field Manual and a personal contact card for direct access to Vince. Ships USPS Priority within 3 business days.</p>
      <p><em>Included at no additional cost with every Compliance Readiness Visit ($2,000).</em></p>

      <h2>Questions?</h2>
      <p>Call or text <a href="tel:+13363298899">(336) 329-8899</a>. Vince picks up.</p>
    `,
  },
  {
    path: '/case-study/metals-fabrication-statesville',
    title: 'What a Safety Walkthrough Actually Finds | GigLine Case Study',
    description: "A metals fabrication facility in Statesville, NC brought GigLine in for a combined walkthrough and documentation review. 13 findings. 80.3 compliance score. Here's what the engagement delivered.",
    canonical: '/case-study/metals-fabrication-statesville',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'What a Safety Walkthrough Actually Finds — Statesville Metals Fabrication Case Study',
        description: 'A 9-person metals fabrication facility in Statesville, NC. Combined walkthrough and documentation review. 13 findings. 80.3 compliance score. 12 of 13 corrective actions closed within four days of the walkthrough.',
        image: `${BASE_URL}/og-image.png`,
        author: { '@id': `${BASE_URL}/#vince` },
        publisher: { '@id': `${BASE_URL}/#business` },
        mainEntityOfPage: `${BASE_URL}/case-study/metals-fabrication-statesville`,
        datePublished: '2026-01-20',
        dateModified: '2026-02-15',
        articleSection: 'Case Study',
        inLanguage: 'en-US',
      },
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Case Studies', path: '/case-studies' },
        { name: 'Statesville Metals Fabrication', path: '/case-study/metals-fabrication-statesville' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What if my walkthrough turns up more than 13 findings?',
            acceptedAnswer: { '@type': 'Answer', text: "That depends on the facility. A newer operation with a plant manager actively building programs — like the one in this engagement — is going to look different from a 20-year-old facility that hasn't had a third-party review in a decade. More findings isn't a failure. It's information. The report prioritizes every finding by citation risk so you know what to fix first and what can wait. You leave with a ranked corrective action plan, not a list of problems with no direction attached." },
          },
          {
            '@type': 'Question',
            name: 'Does an 80.3 compliance score mean the facility was OSHA-ready?',
            acceptedAnswer: { '@type': 'Answer', text: "Not exactly. The compliance score measures written-program coverage — how complete your documentation is relative to what OSHA expects to see. An 80.3 means solid coverage on paper with targeted gaps underneath. The physical findings (the propane cylinder, the unguarded shear blade) are captured separately in the priority ratings. A facility can score well on documentation and still have serious physical hazards. That's exactly why the walkthrough covers both." },
          },
          {
            '@type': 'Question',
            name: 'What does the written report actually contain?',
            acceptedAnswer: { '@type': 'Answer', text: "Every finding documented against the applicable CFR standard, with the specific regulation cited. Photo documentation of physical hazards. A penalty exposure estimate per finding based on OSHA published maximums. A corrective action for each finding with a recommended timeline. A compliance score and document coverage summary. A corrective action log pre-populated with every finding, ready to assign owners and track close-out. The report in this engagement ran 18 pages and was delivered four days after the walkthrough." },
          },
          {
            '@type': 'Question',
            name: "What if I can't fix everything before an OSHA inspection arrives?",
            acceptedAnswer: { '@type': 'Answer', text: "Fix the P2 findings first — those are the serious citation risks with dollar exposure attached. A documented corrective action plan with assigned owners and target dates is evidence of good-faith effort. OSHA distinguishes between a facility that knew about a hazard and ignored it and one that identified it, documented it, and was actively working through remediation. The written report gives you that documentation. It doesn't guarantee anything, but it puts you in a materially better position than having no record at all." },
          },
          {
            '@type': 'Question',
            name: 'Will GigLine share my findings with anyone?',
            acceptedAnswer: { '@type': 'Answer', text: "No. Findings are not shared, published, or referenced without written permission. Not with OSHA, not with your insurer, not with anyone. The report belongs to you. The engagement in this case study is referenced publicly only because the client permitted it — and the client name is withheld at their request. Every engagement operates the same way by default." },
          },
        ],
      },
    ],
    content: `
      <h1>What a Safety Walkthrough Actually Finds</h1>
      <p><em>A metals fabrication facility in Statesville, NC brought GigLine in for a combined Safety Walkthrough and Documentation Review. Thirteen findings. One written report. No inspection ever happened &mdash; and that is the point.</em></p>
      <p><em>Client name withheld at the client&rsquo;s request. All findings, citations, and outcomes are accurate to the engagement. Report ID: 62FC03EB. Visit date: June 18, 2026.</em></p>

      <p><strong>Location:</strong> Statesville, NC &middot; <strong>Headcount:</strong> 9 employees &middot; <strong>Scope:</strong> Walkthrough + Documentation Review &middot; <strong>Visit:</strong> June 18, 2026 &middot; <strong>Compliance Score:</strong> 80.3 / 100</p>

      <h2>The Situation</h2>
      <p>A 9-person metals fabrication operation in Statesville, NC. Two roll formers, two forklifts, an active flammables cabinet, a growing crew. The plant manager held an OSHA 30-Hour General Industry certification and had built out most of his safety documentation &mdash; some of it using AI-generated templates. He brought GigLine in to confirm his programs were ready before production scaled.</p>

      <h2>What the Walkthrough Found</h2>
      <p>13 findings. 7 serious citation risk (P2). 6 documentation gaps (P3). 0 critical. Compliance score: 80.3 out of 100.</p>

      <h3>Finding 10 &mdash; Unsecured propane cylinder (29 CFR 1910.110(b)(6)(i))</h3>
      <p>One propane cylinder stored upright with no chain, bracket, or restraint &mdash; positioned immediately adjacent to the flammable liquids storage cabinet with no separation distance. Estimated penalty exposure based on OSHA published maximums: up to $16,550 (Serious).</p>

      <h3>Finding 12 &mdash; Unguarded shear point of operation (29 CFR 1910.212(a)(1))</h3>
      <p>The shear blade on the roll former cut-off mechanism was accessible during operation. The perimeter rail did not address the point of operation. Estimated penalty exposure based on OSHA published maximums: up to $16,550 (Serious).</p>

      <h3>Documentation gaps</h3>
      <p>The IIPP existed but was built from an AI-generated template &mdash; wrong facility address, missing required elements, not reviewed against actual operations. The SDS library was missing a sheet for Star Fire AW46 Hydraulic Oil &mdash; a product actively in use. Estimated penalty exposure based on OSHA published maximums under 29 CFR 1910.1200(g)(1): up to $16,550 per violation. Three required documents were missing entirely: Heat Stress Prevention Plan, Bloodborne Pathogen Exposure Control Plan, and a Corrective Action Log.</p>

      <p><em>Note: Penalty figures are educational estimates based on OSHA published maximum penalty schedules (29 CFR 1903.15 / 2026 adjusted rates). Actual penalties assessed by OSHA vary by employer size, history, good-faith effort, and gravity of the violation.</em></p>

      <h2>What the Engagement Delivered</h2>
      <p>A written report documenting all 13 findings against applicable CFR standards, with photo documentation of the two highest-priority physical hazards and a corrective action summary pre-populated with every finding, priority rating, assigned due date, and recommended corrective action.</p>

      <h2>What This Engagement Is Not</h2>
      <p>No OSHA inspection followed this walkthrough. There is no citation outcome to report. The value is the written record itself &mdash; a documented baseline of what existed, what was missing, and what needed to change, in the plant manager&rsquo;s hands, before anyone outside the facility looked. <strong>A written record of good-faith corrective action is defensible. A belief that things are in order is not.</strong></p>

      <h2>The Pattern</h2>
      <p>AI-generated documents that don&rsquo;t match actual operations, missing machine-specific procedures, chemical hazards without complete SDS coverage, and physical hazards the team has stopped seeing &mdash; these are among the most frequently cited violations in general industry OSHA enforcement. They are also fixable.</p>

      <p>A Safety Walkthrough starts at $1,200. Written report within 48 hours. <a href="https://www.giglinecompliance.com/intake?service=safety-walkthrough-report">Request a Walkthrough</a>.</p>

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
  {
    path: '/sample-report',
    title: 'Sample Compliance Report | GigLine Safety & Compliance',
    description: 'See exactly what you get. A real GigLine compliance report — facility name redacted. Findings, CFR citations, penalty exposure, and the prioritized fix list. Download free.',
    canonical: '/sample-report',
    schemas: [
      LOCAL_BUSINESS,
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }, { name: 'Sample Report', path: '/sample-report' }]),
    ],
    content: `
      <h1>Sample Compliance Report</h1>
      <p>A real GigLine compliance report — facility name redacted. This is what your team receives within 48 hours of the walkthrough.</p>
      <h2>What the report includes</h2>
      <ul>
        <li>Photo-documented findings — every observation captured on the floor.</li>
        <li>CFR citation per finding — specific regulation, not generic language.</li>
        <li>2026 estimated penalty exposure based on OSHA published maximums — $16,550 serious / $165,514 willful.</li>
        <li>RED / AMBER / GREEN priority sorting so supervisors know what to fix first.</li>
        <li>30 / 60 / 90-day corrective action plan with owners and target dates.</li>
      </ul>
      <p>Enter your first name and email and we send the redacted PDF to your inbox. Free. No spam.</p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — Kernersville, NC</p>
    `,
  },
  {
    path: '/resources',
    title: 'Safety Resources | GigLine Safety & Compliance',
    description: 'Free and gated safety resources for manufacturing and warehouse supervisors — guides, checklists, and compliance tools from GigLine.',
    canonical: '/resources',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Safety Resources | GigLine Safety & Compliance',
        description: 'Free and gated safety resources for manufacturing and warehouse supervisors — guides, checklists, and compliance tools from GigLine.',
        url: `${BASE_URL}/resources`,
      },
      LOCAL_BUSINESS,
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }]),
    ],
    content: `
      <h1>Resources</h1>
      <p>Guides, checklists, and tools built for the person responsible for safety.</p>
      <ul>
        <li><a href="/osha-compliance-guide">The OSHA Compliance Guide</a> — Full topical index. All 25 Field Notes organized into six hazard clusters. Ungated.</li>
        <li><a href="/safety-check">Safety Check</a> — 90-second self-screen. Ungated.</li>
        <li><a href="/heat-guide">Heat Stress Field Guide</a> — 2026 Heat Stress Action Template. Email capture.</li>
        <li><a href="/blog/hazcom-requirements-small-business">HazCom Compliance Guide</a> — Full breakdown of the OSHA HazCom standard.</li>
        <li><a href="/sample-report">Sample Compliance Report</a> — A redacted real report. Email capture.</li>
        <li><a href="/osha-inspection-guide">OSHA Inspection Guide — HR & Safety Leaders</a> — What OSHA looks for when they walk in. Email capture.</li>
        <li><a href="/supervisor-kit">Supervisor Safety Starter System</a> — The full digital kit of CFR-cited written programs, training rosters, and OSHA-response templates. From $600.</li>
        <li><a href="${BASE_URL}/api/field-checklist">Field Inspection Checklist</a> — The printable on-floor checklist GigLine uses during walkthroughs. Ungated PDF.</li>
      </ul>
      <p>GigLine Safety &amp; Compliance — Vince Lawrence — (336) 329-8899 — Kernersville, NC</p>
    `,
  },
  {
    path: '/osha-inspection-guide',
    title: 'OSHA Inspection Guide for HR & Safety Leaders | GigLine Safety & Compliance',
    description: 'What OSHA looks for when they walk in — and what your documentation needs to show. Free guide for HR managers and safety coordinators in the NC Piedmont Triad.',
    canonical: '/osha-inspection-guide',
    schemas: [
      LOCAL_BUSINESS,
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Resources', path: '/resources' }, { name: 'OSHA Inspection Guide', path: '/osha-inspection-guide' }]),
    ],
    content: `
      <h1>What OSHA Looks For When They Walk In.</h1>
      <p>A practical guide for HR managers, safety coordinators, and plant managers — what to have ready before the inspection, what happens during it, and what to do in the 15-day window after.</p>
      <p><strong>Vince Lawrence · GigLine Safety &amp; Compliance · OSHA 30-Hour Certified · 25+ Years in Manufacturing</strong></p>
      <h2>What's Inside</h2>
      <ul>
        <li><strong>Before the Inspection</strong> — Written programs, OSHA logs, training records, and physical readiness with CFR citations for each.</li>
        <li><strong>During the Inspection</strong> — The five phases: opening conference, walkaround, employee interviews, closing conference, citation issuance.</li>
        <li><strong>After the Inspection</strong> — The 24-hour action window and the 15-day citation response period — step by step.</li>
        <li><strong>Most Common HR-Facing Citations</strong> — OSHA 300 Log, training records, written programs, HazCom — the documentation gaps inspectors find most often, with penalty exposure per violation.</li>
      </ul>
      <p>Enter your email and we send the guide directly. No spam. One delivery.</p>
      <p>GigLine Safety &amp; Compliance — Vince Lawrence — (336) 329-8899 — Kernersville, NC</p>
    `,
  },
  // ── OSHA Compliance Guide — Pillar page (topical index of all 25 Field Notes) ──
  {
    path: '/osha-compliance-guide',
    title: 'The OSHA Compliance Guide — All 25 Topics, Organized by Hazard | GigLine',
    description: 'The complete OSHA compliance reference for NC small manufacturing and warehouse operations. 25 CFR-cited field notes organized into six hazard clusters — written by Vince Lawrence, GigLine Safety & Compliance.',
    canonical: '/osha-compliance-guide',
    schemas: [
      LOCAL_BUSINESS,
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'OSHA Compliance Field Notes — Topical Index',
        url: `${BASE_URL}/osha-compliance-guide`,
        description: 'A topical index of 25 CFR-cited OSHA compliance articles by Vince Lawrence, organized into six hazard clusters for NC small manufacturing and warehouse operations.',
        inLanguage: 'en-US',
        isPartOf: { '@id': `${BASE_URL}/#business` },
      },
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Resources', path: '/resources' },
        { name: 'OSHA Compliance Guide', path: '/osha-compliance-guide' },
      ]),
    ],
    content: `
      <h1>The OSHA Compliance Guide for Small Manufacturing &amp; Warehouse Operations</h1>
      <p>25 CFR-cited field notes — organized into six hazard clusters. Hazard Communication. Machine guarding and energy control. Fall and height work. PPE. Recordkeeping and enforcement. Operations and environment. Each note is written from the floor, not the binder.</p>
      <p><em>By Vince Lawrence — GigLine Safety &amp; Compliance — OSHA 30-Hour Certified — U.S. Navy Veteran — Kernersville, NC</em></p>

      <h2>Cluster 01 — Chemical &amp; Health Exposure</h2>
      <p>Hazard Communication is the #1 most-cited OSHA standard in general industry. The exposure programs below are where the documentation almost always lags behind the floor.</p>
      <ul>
        <li><a href="/field-notes/hazcom">HazCom &amp; SDS</a> — #1 OSHA citation, 29 CFR 1910.1200</li>
        <li><a href="/field-notes/respiratory-protection">Respiratory Protection</a> — Written program, medical eval, fit test (1910.134)</li>
        <li><a href="/field-notes/silica-respirable-crystalline">Respirable Crystalline Silica</a> — Stone fab, concrete, foundries (1910.1053)</li>
        <li><a href="/field-notes/hearing-conservation">Hearing Conservation</a> — Noise monitoring + audiometric testing (1910.95)</li>
        <li><a href="/field-notes/bloodborne-pathogens">Bloodborne Pathogens</a> — Exposure control plan + Hep B (1910.1030)</li>
      </ul>

      <h2>Cluster 02 — Mechanical &amp; Energy Control</h2>
      <p>Machinery, electrical, and hot work. The standards in this cluster cause more of OSHA's serious citations and fatality reports than any other group in general industry.</p>
      <ul>
        <li><a href="/field-notes/machine-guarding">Machine Guarding</a> — Point-of-operation guards (1910.212)</li>
        <li><a href="/field-notes/lockout-tagout">Lockout/Tagout (LOTO)</a> — Control of hazardous energy (1910.147)</li>
        <li><a href="/field-notes/electrical-safety">Electrical Access</a> — Panel clearance, arc flash (1910.303)</li>
        <li><a href="/field-notes/abrasive-wheels">Abrasive Wheels &amp; Bench Grinders</a> — Tongue guards, ring test (1910.215)</li>
        <li><a href="/field-notes/cranes-rigging">Overhead Cranes &amp; Rigging</a> — Inspections, sling capacity (1910.179 / 1910.184)</li>
        <li><a href="/field-notes/hot-work-welding">Hot Work, Welding &amp; Cutting</a> — Permits, fire watch (Subpart Q)</li>
      </ul>

      <h2>Cluster 03 — Fall &amp; Height Work</h2>
      <p>The 4-foot rule, ladder geometry, scaffold competence. Falls remain among the most-cited OSHA standards every year — and the most preventable.</p>
      <ul>
        <li><a href="/field-notes/fall-protection">Fall Protection</a> — Mezzanines, docks, the 4-foot rule (1910.28)</li>
        <li><a href="/field-notes/ladder-safety">Portable Ladder Safety</a> — 4-to-1 angle, three-point contact (1910.23)</li>
        <li><a href="/field-notes/scaffolding-safety">Scaffolding Safety</a> — Competent person, guardrails (1910.27)</li>
        <li><a href="/field-notes/walking-surfaces">Walking Surfaces</a> — Aisles, edges, housekeeping (1910.22)</li>
      </ul>

      <h2>Cluster 04 — PPE &amp; Personal Protection</h2>
      <p>PPE without a written hazard assessment is a citation waiting to happen. These two notes anchor the standard for every other exposure type on this page.</p>
      <ul>
        <li><a href="/field-notes/ppe-assessment">PPE Assessment &amp; Use</a> — Written hazard assessment + selection (1910.132)</li>
        <li><a href="/field-notes/eye-face-protection">Eye &amp; Face Protection</a> — Z87.1, side shields, face shields (1910.133)</li>
      </ul>

      <h2>Cluster 05 — Process, Recordkeeping &amp; Enforcement</h2>
      <p>The paperwork OSHA asks for first. If the 300 log is missing or the EAP cannot be produced, the inspection narrative is already written before the floor walk begins.</p>
      <ul>
        <li><a href="/field-notes/recordkeeping-300-log">OSHA Recordkeeping &amp; the 300 Log</a> — Recordables, 300A, severe injury reports (Part 1904)</li>
        <li><a href="/field-notes/emergency-action-plans">Emergency Action Plans</a> — Evacuation, alarm, training (1910.38)</li>
        <li><a href="/field-notes/nc-osha-vs-federal">NC State Plan vs. Federal OSHA</a> — NCDOL inspections, BETS consultation</li>
        <li><a href="/field-notes/ai-generated-safety-programs">AI-Generated Safety Programs</a> — What ChatGPT cannot see on your floor</li>
      </ul>

      <h2>Cluster 06 — Operations, Movement &amp; Environment</h2>
      <p>Vehicles, confined spaces, trenches, heat. Hazards that change with the day, the season, and the task — and that an inspector asks the floor supervisor to describe from memory.</p>
      <ul>
        <li><a href="/field-notes/forklift-safety">Forklift Safety</a> — Daily inspections, certification (1910.178)</li>
        <li><a href="/field-notes/confined-space">Confined Space Entry</a> — Permits, testing, rescue (1910.146)</li>
        <li><a href="/field-notes/trenching-excavation">Trenching &amp; Excavation</a> — Protective systems, competent person (1926.651)</li>
        <li><a href="/field-notes/heat-stress">Heat Stress</a> — General Duty Clause + NEP CPL 03-00-024</li>
      </ul>

      <h2>Reading is the easy part.</h2>
      <p>See what these standards look like on your floor. <a href="/intake?service=safety-walkthrough-report&utm_source=osha-guide-pillar&utm_medium=website&utm_campaign=pillar-cta">Request a Safety Walkthrough</a>. From $1,200. Findings in 48 hours. NC Piedmont Triad.</p>
      <p>GigLine Safety &amp; Compliance — Vince Lawrence — (336) 329-8899 — Kernersville, NC</p>
    `,
  },
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
        description: 'On-site OSHA-focused safety walkthrough for manufacturers, warehouses, contractors, and fleet operations across North Carolina. Written report delivered within 48 hours.',
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        offers: { '@type': 'Offer', price: '1200', priceCurrency: 'USD' },
      },
      faqSchema([
        { q: 'Who is the safety walkthrough built for?', a: 'Small to mid-size manufacturers, warehouses, distribution centers, contractors, and fleet operations in North Carolina — typically 5 to 100 employees with no full-time safety manager on staff.' },
        { q: 'What gets reviewed during a safety walkthrough?', a: 'Walking-working surfaces and egress, electrical panel clearance, machine guarding and energy control, powered industrial trucks, hazard communication, PPE and fall protection, and recordkeeping — the same OSHA standards an inspector would focus on.' },
        { q: 'What do I receive after the walkthrough?', a: 'A PDF report within 48 hours with photo-documented findings, OSHA-related references where applicable, prioritized corrective action recommendations, and color-coded priorities (RED, AMBER, GREEN).' },
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
  // ─── Service-area landing pages (keyword-targeted, registered Jan 2026) ───
  {
    path: '/forklift-compliance-review-nc',
    title: 'Forklift Safety Compliance Review NC | GigLine Safety & Compliance',
    description: 'On-site forklift / Powered Industrial Truck safety compliance review for NC manufacturers, warehouses, and distribution operations. 29 CFR 1910.178. Written report in 48 hours. From $1,200.',
    canonical: '/forklift-compliance-review-nc',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Forklift / Powered Industrial Truck Compliance Review',
        description: 'On-site focused review of forklift program, daily inspection logs, operator certifications, pedestrian separation, and floor practices against 29 CFR 1910.178. Written report within 48 hours.',
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        serviceType: 'Forklift Compliance Review',
        offers: { '@type': 'Offer', price: '1200', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      },
      faqSchema([
        { q: 'What does the Forklift Compliance Review cover?', a: 'The written PIT program against your actual fleet, operator certification roster vs. floor operators, daily pre-shift inspection logs, forklift physical condition (forks, seat belt, horn, tires, data plate), pedestrian / forklift separation and aisle marking, charging or propane storage compliance, and refresher training documentation.' },
        { q: 'Which OSHA standard governs forklifts?', a: '29 CFR 1910.178 (Powered Industrial Trucks). This is consistently one of OSHA\'s most-cited general-industry standards.' },
        { q: 'How long does the on-site visit take?', a: 'Typically 1 to 3 hours on the floor depending on fleet size. Written report delivered within 48 hours.' },
        { q: 'How much does a Forklift Compliance Review cost?', a: 'From $1,200. Fixed quote provided before scheduling. No retainer.' },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'Forklift Compliance Review', path: '/forklift-compliance-review-nc' }]),
    ],
    content: `
      <h1>Forklift Safety Compliance Review for NC Operations</h1>
      <p>Powered Industrial Trucks are one of OSHA's most-cited general-industry standards. A focused on-site review of your forklift program, daily inspections, operator certifications, and floor practices — written report in 48 hours. From $1,200.</p>
      <h2>Built for Operations Running 1 to 12 Forklifts</h2>
      <p>Small manufacturers and warehouses running propane, electric, or LPG forklifts. Distribution and 3PL operations with multiple shifts and rotating operators. Operations that have had a forklift near-miss, complaint, or recent operator turnover. Plant managers who are not sure whether last year's operator certifications are still current.</p>
      <h2>Common Findings</h2>
      <p>Operator certifications expired or never documented in writing. Daily pre-shift inspection logs incomplete, blank, or filled out from memory at end of day. No site-specific evaluation of pedestrian traffic, blind corners, or load-handling zones. Refresher training not performed after near-miss, damage, or operator change. Forklifts operated with damaged forks, missing horn, broken seat belt, or missing data plate. No documented refresher when a new attachment, fuel type, or trailer type is introduced.</p>
      <h2>What Gets Reviewed</h2>
      <p>Written Powered Industrial Truck program against your actual fleet. Operator certification roster vs. current operators on the floor. Daily pre-shift inspection sheets (sample audit). Forklift physical condition: tires, forks, seat belt, horn, lights, data plate. Pedestrian / forklift separation, aisle marking, blind corner mirrors. Charging area or propane storage compliance (NFPA / OSHA cross-reference). Documented refresher training following any near-miss or damage incident.</p>
      <h2>What You Receive</h2>
      <p>Photo-documented finding list against 29 CFR 1910.178. Severity priority (high / medium / low) per finding. Specific corrective actions for each gap, with CFR citation. Operator certification roster template if missing. Daily pre-shift inspection log template if missing. A "top 5 fixes" summary the plant manager can hand to the floor.</p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — vince@giglinecompliance.com</p>
    `,
  },
  {
    path: '/loto-procedure-review-nc',
    title: 'Lockout Tagout Procedure Review NC | GigLine Safety & Compliance',
    description: 'On-site Lockout/Tagout (LOTO) procedure review for NC manufacturers and fabricators. Machine-specific procedures, authorized employee training, annual audit. 29 CFR 1910.147. From $1,200.',
    canonical: '/loto-procedure-review-nc',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Lockout/Tagout (LOTO) Procedure Review',
        description: 'On-site review of machine-specific lockout/tagout procedures, authorized employee training, energy-isolation hardware, and annual audit against 29 CFR 1910.147. Written report within 48 hours.',
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        serviceType: 'Lockout/Tagout Procedure Review',
        offers: { '@type': 'Offer', price: '1200', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      },
      faqSchema([
        { q: 'What does the LOTO Procedure Review cover?', a: 'Written Control of Hazardous Energy program against your actual machinery, machine-specific lockout procedures with energy-source identification, authorized vs. affected employee training rosters, lock and tag hardware (sufficient padlocks, dedicated assignments), annual procedure audit documentation, and group lockout / shift change practices.' },
        { q: 'Which OSHA standard governs LOTO?', a: '29 CFR 1910.147 (Control of Hazardous Energy / Lockout-Tagout). LOTO failures are one of OSHA\'s top fatality-driver standards.' },
        { q: 'Are machine-specific procedures actually required?', a: 'Yes — under 1910.147(c)(4), a written procedure must exist for each machine or piece of equipment that has more than one energy source or that requires more than a simple single-source lockout.' },
        { q: 'How much does a LOTO Procedure Review cost?', a: 'From $1,200. Fixed quote provided before scheduling. No retainer.' },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'LOTO Procedure Review', path: '/loto-procedure-review-nc' }]),
    ],
    content: `
      <h1>Lockout/Tagout Procedure Review for NC Operations</h1>
      <p>LOTO failures are one of OSHA's top fatality-driver standards. A focused on-site review of your machine-specific procedures, authorized employee training, energy-isolation hardware, and annual audit — written report in 48 hours. From $1,200.</p>
      <h2>Built for Manufacturers, Fabricators &amp; Maintenance-Intensive Operations</h2>
      <p>Small to mid-size manufacturers and fabricators with multiple energy sources on the floor (electrical, pneumatic, hydraulic, thermal, gravity). Operations where maintenance is performed by in-house technicians, contractors, or rotating shift supervisors. Operations preparing for an OSHA inspection, an insurance loss-control audit, or a customer compliance review.</p>
      <h2>Common Findings</h2>
      <p>No machine-specific written procedures for equipment with multiple energy sources. Procedures exist on paper but are not posted at the machines, or are out of date relative to current equipment. Annual audit not performed or not documented. Authorized employee training not refreshed when new equipment is added or when procedures change. Lock and tag hardware not assigned to individual employees (shared locks, generic tags). Group lockout / shift change handoff practices not formalized.</p>
      <h2>What Gets Reviewed</h2>
      <p>Written Control of Hazardous Energy program against your actual machinery list. Machine-specific lockout procedures (sample audit). Authorized vs. affected employee training rosters. Lock and tag hardware: sufficient quantity, dedicated assignment, color/tag standardization. Annual procedure audit documentation under 1910.147(c)(6). Group lockout and shift-change practices. Contractor and outside service LOTO coordination.</p>
      <h2>What You Receive</h2>
      <p>Photo-documented finding list against 29 CFR 1910.147. Severity priority (high / medium / low) per finding. Specific corrective actions, with CFR citation. Machine-specific procedure template if your existing format is incomplete. Annual audit template if missing. A "top 5 fixes" summary the plant or maintenance manager can act on first.</p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — vince@giglinecompliance.com</p>
    `,
  },
  {
    path: '/osha-documentation-review-nc',
    title: 'OSHA Documentation Review NC | Written Programs, Training, OSHA 300 | GigLine',
    description: 'Off-site OSHA documentation readiness review for NC manufacturers, warehouses, and contractors. Written programs, training records, OSHA 300 log, SDS binder, retention. From $1,300.',
    canonical: '/osha-documentation-review-nc',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'OSHA Documentation Review (NC)',
        description: 'Off-site OSHA documentation readiness review of written safety programs, training records, OSHA 300/300A logs, SDS inventory, and retention practices. Written findings report within 48 hours.',
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        serviceType: 'OSHA Documentation Review',
        offers: { '@type': 'Offer', price: '1300', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      },
      faqSchema([
        { q: 'What is reviewed in the OSHA Documentation Review?', a: 'Written safety programs (HazCom, LOTO, IIPP, Bloodborne Pathogens, Emergency Action Plan, Heat Stress, PPE Hazard Assessment), training records and refresher cycles, OSHA 300 / 300A logs and posting compliance, SDS inventory against chemicals in active use, and retention practices for required documents.' },
        { q: 'Is the review remote or on-site?', a: 'Off-site / remote-friendly. We send a secure upload link and a prep checklist by email — no need to mail physical binders. On-site option available if preferred.' },
        { q: 'How long does the review take?', a: 'Once documents are received, written findings report is delivered within 48 hours.' },
        { q: 'How much does an OSHA Documentation Review cost?', a: 'From $1,300. Fixed quote provided before any documents are reviewed.' },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: 'OSHA Documentation Review', path: '/osha-documentation-review-nc' }]),
    ],
    content: `
      <h1>OSHA Documentation Review for NC Operations</h1>
      <p>The paperwork OSHA, your insurance carrier, or a customer auditor asks for first. An off-site readiness review of your written programs, training records, OSHA 300/300A logs, SDS inventory, and retention practices — written report in 48 hours. From $1,300.</p>
      <h2>Built for Operations Preparing for an Audit, Inspection, or Customer Compliance Review</h2>
      <p>Small to mid-size manufacturers, warehouses, distribution centers, and contractors in NC. New safety coordinators inheriting binders from a predecessor. Companies past the size where paperwork can stay informal. Operations that have a customer or insurer asking for documentation.</p>
      <h2>Common Findings</h2>
      <p>Written programs built from a downloaded template with wrong facility name, wrong addresses, or required elements missing. Training records that show "completed" without dates, signatures, or topic outlines. OSHA 300 log incomplete or not posted Feb 1 - Apr 30 as required. SDS binder missing sheets for chemicals actively in use on the floor. No documented schedule for annual program review.</p>
      <h2>What Gets Reviewed</h2>
      <p>Written HazCom program and SDS binder against actual chemical inventory. Lockout/Tagout written program and machine-specific procedures (paperwork side). IIPP / written safety program. Emergency Action Plan and exit-map currency. Heat Stress, Bloodborne Pathogens, Respiratory, and Hearing Conservation programs where applicable. OSHA 300 / 300A log and posting compliance. Training records: rosters, dates, signatures, topic outlines. Document retention practices and review-cycle documentation.</p>
      <h2>What You Receive</h2>
      <p>Document-by-document finding list against the applicable CFR standard. Severity priority per finding. Specific corrective actions and templates for any missing or insufficient documents. A "top 5 documents to fix first" summary for the safety coordinator. Optional re-review at no extra cost once corrections are made (within 60 days).</p>
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
        { q: 'What is included in a Compliance Readiness Visit?', a: 'A combined on-site walkthrough and OSHA Documentation Readiness Review — covering both the floor AND the binder, plus a cross-check between them. Includes the Supervisor Safety Starter System.' },
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

// Service detail pages (pixel-perfect dedicated pages) — must be pre-rendered so
// production deployments don't serve the homepage HTML shell as a fallback for
// these slugs.
const SERVICE_DETAIL_ROUTES = [
  {
    slug: 'safety-walkthrough-report',
    title: 'Safety Walkthrough Report — From $1,200 | GigLine',
    description: 'On-site OSHA walkthrough with photo-documented findings, CFR citations, and a 48-hour written report. Fixed quote. Private engagement. Serving the Piedmont Triad.',
    h1: 'Find what\'s exposed. Before OSHA does.',
    summary: 'An on-site walkthrough focused purely on physical hazards. Photo-documented findings, CFR citations, and a prioritized fix list delivered within 48 hours. From $1,200.',
    price: '1200',
    breadcrumbName: 'Safety Walkthrough Report',
  },
  {
    slug: 'documentation-readiness-review',
    title: 'OSHA Documentation Readiness Review — From $1,300 | GigLine',
    description: 'A structured 53-item review of written programs, training records, OSHA logs, and SDS compliance. Compliance percentage score + prioritized corrective action sequence.',
    h1: 'Know exactly what your files say before an inspector does.',
    summary: 'A structured review of written programs, training records, OSHA logs, and SDS compliance. 53 items across 7 OSHA categories. Compliance score + prioritized corrective actions. From $1,300.',
    price: '1300',
    breadcrumbName: 'OSHA Documentation Readiness Review',
  },
  {
    slug: 'compliance-readiness-visit',
    title: 'Compliance Readiness Visit — From $2,000 | GigLine',
    description: "GigLine's most requested engagement. On-site walkthrough + documentation review in a single visit. 18-page CFR-cited report. 90-day remediation tracker. From $2,000.",
    h1: 'Floor and files reviewed in a single engagement.',
    summary: 'The most requested GigLine engagement. A Safety Walkthrough and OSHA Documentation Readiness Review combined into a single on-site visit. 18-page CFR-cited report delivered in 48 hours. From $2,000.',
    price: '2000',
    breadcrumbName: 'Compliance Readiness Visit',
  },
  {
    slug: 'annual-compliance-partner',
    title: 'Annual Compliance Control Partner — $12,000/year | GigLine',
    description: 'A year-long compliance partnership for small manufacturers. Two walkthroughs + four documentation reviews + quarterly review calls + on-call access. From $12,000/year.',
    h1: 'When OSHA shows up, you need someone who already knows your operation.',
    summary: 'Two full walkthroughs per year. Quarterly documentation reviews. Training record maintenance. Pre-inspection readiness review. On-call access between visits. $12,000/year ($1,000/month equivalent).',
    price: '12000',
    breadcrumbName: 'Annual Compliance Control Partner',
  },
  {
    slug: 'document-development',
    title: 'Safety Document Development — Written OSHA Programs | GigLine',
    description: 'Custom-written OSHA safety programs for small NC operations — LOTO, HazCom, PPE, EAP, and more. Built to your facility, your equipment, your employees. Not a template.',
    h1: 'Written safety programs that match your operation.',
    summary: 'Custom-written OSHA safety programs — LOTO, HazCom, PPE, EAP, and more. Built specifically for your facility, equipment, and employees. Not a template. Five program tiers available.',
    price: '1500',
    breadcrumbName: 'Safety Document Development',
  },
  {
    slug: 'incident-review',
    title: 'Incident Review — Root-Cause Analysis for NC Operations | GigLine',
    description: 'Independent third-party incident review after a recordable injury, near-miss, or workers\' comp claim. Root-cause analysis with corrective actions and documentation guidance.',
    h1: 'A clear-eyed review after something went wrong.',
    summary: 'Independent third-party review after a recordable injury, near-miss, or workers\' comp claim. Root-cause analysis with corrective actions, documentation guidance, and an OSHA-defensible written report.',
    price: '1500',
    breadcrumbName: 'Incident Review',
  },
  {
    slug: 'osha-ready-control-system',
    title: 'OSHA-Ready Control System — Premium Engagement | GigLine',
    description: 'A complete OSHA control system for small manufacturers — written programs, training, recordkeeping, and audit-ready documentation, built and maintained by GigLine.',
    h1: 'A complete OSHA control system built around your operation.',
    summary: 'A premium engagement for small manufacturers ready to operate at full OSHA-ready status. Written programs, training, recordkeeping, and audit-ready documentation built and maintained by GigLine.',
    price: '18000',
    breadcrumbName: 'OSHA-Ready Control System',
  },
];

SERVICE_DETAIL_ROUTES.forEach((svc) => {
  routes.push({
    path: `/services/${svc.slug}`,
    title: svc.title,
    description: svc.description,
    canonical: `/services/${svc.slug}`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: svc.breadcrumbName,
        description: svc.description,
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'State', name: 'North Carolina' },
        offers: { '@type': 'Offer', price: svc.price, priceCurrency: 'USD' },
      },
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: svc.breadcrumbName, path: `/services/${svc.slug}` },
      ]),
    ],
    content: `
      <h1>${svc.h1}</h1>
      <p>${svc.summary}</p>
      <p><a href="/intake?service=${svc.slug}">Request this engagement</a> · Call or text (336) 329-8899 · GigLine Safety &amp; Compliance — Kernersville, NC</p>
    `,
  });
});

// City landing pages
const CITY_META = {
  'winston-salem':  { name: 'Winston-Salem',  distance: '10 miles from Kernersville', industries: 'manufacturing plants, food processing facilities, and distribution centers', price: 1200 },
  'greensboro':     { name: 'Greensboro',     distance: '15 miles from Kernersville', industries: 'warehouses, light manufacturing, and logistics operations', price: 1200 },
  'high-point':     { name: 'High Point',     distance: '12 miles from Kernersville', industries: 'furniture manufacturing, warehousing, and small fabrication shops', price: 1200 },
  'charlotte':      { name: 'Charlotte',      distance: '75 miles from Kernersville', industries: 'manufacturing, construction contractors, and warehouse operations', price: 1200 },
  'raleigh':        { name: 'Raleigh',        distance: '75 miles from Kernersville', industries: 'growing manufacturing operations, warehouse facilities, and construction sites', price: 1200 },
  'burlington':     { name: 'Burlington',     distance: '30 miles from Kernersville', industries: 'textile operations, small manufacturers, and distribution facilities', price: 1200 },
  'kernersville':   { name: 'Kernersville',   distance: 'GigLine HQ',                  industries: 'manufacturing, light industrial operations, and warehousing', price: 1200 },
  'lexington':      { name: 'Lexington',      distance: '20 miles from Kernersville', industries: 'furniture manufacturing, food production, and small fabrication shops', price: 1200 },
  'thomasville':    { name: 'Thomasville',    distance: '15 miles from Kernersville', industries: 'furniture manufacturing, cabinetry, and small production operations', price: 1200 },
  'clemmons':       { name: 'Clemmons',       distance: '15 miles from Kernersville', industries: 'small manufacturers, trade contractors, and light industrial operations', price: 1200 },
  'mocksville':     { name: 'Mocksville',     distance: '25 miles from Kernersville', industries: 'manufacturing, agricultural operations, and small fabrication shops', price: 1200 },
  'salisbury':      { name: 'Salisbury',      distance: '50 miles from Kernersville', industries: 'manufacturing plants, distribution centers, and industrial operations', price: 1200, travelNote: true },
  'asheboro':       { name: 'Asheboro',       distance: '35 miles from Kernersville', industries: 'manufacturing, metal fabrication, and distribution operations', price: 1200, travelNote: true },
};

Object.keys(CITY_META).forEach((city) => {
  const m = CITY_META[city];
  const priceTop = 2000;
  const priceStartLabel = m.travelNote ? `$1,200 + travel fee` : `$${m.price.toLocaleString()}`;
  const priceRangeLabel = `$${m.price.toLocaleString()}–$${priceTop.toLocaleString()}`;
  const cityFaqs = [
    { q: `How much does a safety walkthrough cost in ${m.name}, NC?`, a: `Safety walkthroughs for ${m.name}-area operations start at ${priceStartLabel}. Most small operations fall in the ${priceRangeLabel} range depending on square footage and scope. You'll receive a fixed quote before scheduling.${m.travelNote ? ` ${m.name} is outside the Triad core, so a travel fee applies in addition to the base walkthrough price.` : ''}` },
    { q: `How quickly can GigLine get on-site in ${m.name}?`, a: `${m.name} is ${m.distance}, so most walkthroughs are scheduled within 5–10 business days of the initial request. Urgent or post-incident visits can often be scheduled the same week.` },
    { q: `What kind of operations does GigLine walk through in ${m.name}?`, a: `${m.industries.charAt(0).toUpperCase() + m.industries.slice(1)}. Typical client size is 5 to 100 employees — operations without a full-time safety manager that need a trained outside eye on the floor.` },
    { q: `Will findings from my ${m.name} walkthrough be reported to OSHA?`, a: `No. The engagement is private. The only deliverable is the written report handed to you — nothing is shared with OSHA, insurance carriers, or any third party.` },
  ];

  routes.push({
    path: `/safety-walkthrough/${city}`,
    title: `Safety Walkthrough ${m.name}, NC | GigLine Safety & Compliance`,
    description: `On-site OSHA safety walkthroughs for small manufacturers and warehouses in ${m.name}, NC. Written report with findings, photos, and corrective actions. Starting at ${priceStartLabel}.`,
    canonical: `/safety-walkthrough/${city}`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Safety Walkthrough in ${m.name}, NC`,
        description: `On-site OSHA safety walkthroughs for ${m.industries} in ${m.name} and surrounding areas. Written report delivered within 48 hours. Starting at ${priceStartLabel}.`,
        provider: { '@id': `${BASE_URL}/#business` },
        areaServed: { '@type': 'City', name: m.name, containedInPlace: { '@type': 'State', name: 'North Carolina' } },
        offers: { '@type': 'Offer', price: String(m.price), priceCurrency: 'USD' },
      },
      faqSchema(cityFaqs),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: `${m.name} Walkthrough`, path: `/safety-walkthrough/${city}` }]),
    ],
    content: `
      <h1>Safety Walkthrough — ${m.name}, NC</h1>
      <p>On-site OSHA safety walkthroughs for ${m.industries} in ${m.name} and surrounding areas. Starting at ${priceStartLabel}. Written report delivered within 48 hours.</p>
      <h2>${m.name} Safety Walkthrough FAQ</h2>
      ${cityFaqs.map((f) => `<h3>${f.q}</h3><p>${f.a}</p>`).join('')}
      <p><a href="/faq">See all 18 frequently asked questions →</a></p>
      <p>GigLine Safety &amp; Compliance — (336) 329-8899 — Kernersville, NC (${m.distance})</p>
    `,
  });
});

// Field note detail pages
const NOTE_HERO_IMAGES = {
  'electrical-safety': '/assets/field-notes/electrical-safety-exposed-wires.jpg',
  'forklift-safety': '/assets/field-notes/forklift-safety-inspection.jpg',
  'lockout-tagout': '/assets/field-notes/lockout-tagout-lock.jpeg',
  'hazcom': '/assets/field-notes/hazcom-sds-binder.jpg',
  'walking-surfaces': '/assets/field-notes/walking-surfaces-housekeeping.jpg',
  'emergency-action-plans': '/assets/field-notes/emergency-action-plans-blocked-egress.jpg',
  'recordkeeping-300-log': '/assets/field-notes/recordkeeping-300-log.jpg',
  'machine-guarding': '/assets/field-notes/machine-guarding-shear.jpg',
  'ai-generated-safety-programs': '/assets/field-notes/ai-safety-programs-hero.jpg',
};

const RELATED_NOTES = {
  'heat-stress': ['walking-surfaces', 'ppe-assessment', 'recordkeeping-300-log'],
  'forklift-safety': ['walking-surfaces', 'lockout-tagout', 'ppe-assessment'],
  'electrical-safety': ['lockout-tagout', 'machine-guarding', 'ppe-assessment'],
  'hazcom': ['ppe-assessment', 'machine-guarding', 'respiratory-protection'],
  'machine-guarding': ['lockout-tagout', 'electrical-safety', 'ppe-assessment'],
  'walking-surfaces': ['fall-protection', 'forklift-safety', 'ladder-safety'],
  'lockout-tagout': ['machine-guarding', 'electrical-safety', 'confined-space'],
  'emergency-action-plans': ['hazcom', 'walking-surfaces', 'bloodborne-pathogens'],
  'ppe-assessment': ['hazcom', 'machine-guarding', 'eye-face-protection'],
  'fall-protection': ['walking-surfaces', 'scaffolding-safety', 'ladder-safety'],
  'confined-space': ['lockout-tagout', 'ppe-assessment', 'emergency-action-plans'],
  'scaffolding-safety': ['fall-protection', 'ppe-assessment', 'ladder-safety'],
  'hearing-conservation': ['ppe-assessment', 'machine-guarding', 'respiratory-protection'],
  'bloodborne-pathogens': ['ppe-assessment', 'emergency-action-plans', 'recordkeeping-300-log'],
  'recordkeeping-300-log': ['hazcom', 'emergency-action-plans', 'bloodborne-pathogens'],
  'ai-generated-safety-programs': ['hazcom', 'lockout-tagout', 'recordkeeping-300-log'],
  'respiratory-protection': ['ppe-assessment', 'hazcom', 'silica-respirable-crystalline'],
  'silica-respirable-crystalline': ['respiratory-protection', 'hazcom', 'ppe-assessment'],
  'hot-work-welding': ['ppe-assessment', 'eye-face-protection', 'machine-guarding'],
  'abrasive-wheels': ['machine-guarding', 'eye-face-protection', 'ppe-assessment'],
  'ladder-safety': ['fall-protection', 'walking-surfaces', 'scaffolding-safety'],
  'eye-face-protection': ['ppe-assessment', 'hot-work-welding', 'abrasive-wheels'],
  'trenching-excavation': ['fall-protection', 'confined-space', 'ppe-assessment'],
  'cranes-rigging': ['machine-guarding', 'lockout-tagout', 'walking-surfaces'],
  'nc-osha-vs-federal': ['recordkeeping-300-log', 'hazcom', 'emergency-action-plans'],
};

const fieldNotes = [
  {
    slug: 'ai-generated-safety-programs',
    title: 'AI-Generated Safety Programs',
    desc: 'Operators are using ChatGPT to generate OSHA safety programs. The output looks compliant — until an inspector arrives. Why AI-generated programs fail at the floor level.',
    customSeoTitle: "AI-Generated Safety Programs vs. OSHA Compliance: What ChatGPT Can't See on Your Floor | GigLine Safety & Compliance",
    customH1: "An AI-Generated Safety Program Is Not a Working Safety Program",
    ogImage: '/assets/field-notes/ai-safety-programs-hero.jpg',
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
      <p>Request a Safety Walkthrough: <a href="${BASE_URL}/intake">${BASE_URL}/intake</a> · Call or text (336) 329-8899 · GigLine Safety &amp; Compliance — Kernersville, NC</p>
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
  { slug: 'recordkeeping-300-log', title: 'OSHA Recordkeeping & the 300 Log', customSeoTitle: 'OSHA 300 Log & Recordkeeping — GigLine Field Notes', desc: '29 CFR Part 1904. Recordable injuries, the 300A summary posting requirement, and the severe injury reports OSHA expects within 8 or 24 hours of an event.' },
  { slug: 'respiratory-protection', title: 'Respiratory Protection', desc: 'OSHA respiratory protection program — written program, medical evaluation, fit testing, training, and cartridge change-out schedules under 29 CFR 1910.134.' },
  { slug: 'silica-respirable-crystalline', title: 'Respirable Crystalline Silica', desc: 'OSHA silica standard for stone fab, concrete, foundries. Exposure assessment, engineering controls, medical surveillance under 29 CFR 1910.1053.' },
  { slug: 'hot-work-welding', title: 'Hot Work, Welding & Cutting', desc: 'OSHA Subpart Q. Hot work permits, fire watch, compressed gas cylinder safety, ventilation, and welding PPE for small NC fab shops.' },
  { slug: 'abrasive-wheels', title: 'Abrasive Wheels & Bench Grinders', desc: 'Tongue guards within 1/4 inch, work rests within 1/8 inch, ring testing, RPM matching — 29 CFR 1910.215 in plain language.' },
  { slug: 'ladder-safety', title: 'Portable Ladder Safety', desc: 'OSHA portable ladder requirements. Inspection, 4-to-1 angle, 3-foot extension above landing, three-point contact, load rating — 29 CFR 1910.23.' },
  { slug: 'eye-face-protection', title: 'Eye & Face Protection', desc: 'OSHA Z87.1 eye and face protection requirements, side shields, face shields for grinding and chemical handling, and the PPE hazard assessment — 29 CFR 1910.133.' },
  { slug: 'trenching-excavation', title: 'Trenching & Excavation', desc: 'OSHA trenching standard (29 CFR 1926.651). Protective systems, competent person, soil classification, egress, and the rules that prevent collapses.' },
  { slug: 'cranes-rigging', title: 'Overhead Cranes & Rigging', desc: 'Daily inspections, annual inspections, sling condition, rated capacity, operator training — OSHA 29 CFR 1910.179 and 1910.184 for fab and metals shops.' },
  { slug: 'nc-osha-vs-federal', title: 'NC State Plan vs. Federal OSHA', desc: 'How North Carolina OSHA differs from federal OSHA. NCDOL inspections, free consultation through BETS, and what changes for Triad operations.' },
];
fieldNotes.forEach((note, idx) => {
  // Distribute publication dates evenly from 2025-09-01 → 2026-02-01 for freshness signals
  const startMs = new Date('2025-09-01T00:00:00Z').getTime();
  const endMs = new Date('2026-02-01T00:00:00Z').getTime();
  const span = fieldNotes.length > 1 ? (endMs - startMs) / (fieldNotes.length - 1) : 0;
  const datePublished = note.publishedAt || new Date(startMs + span * idx).toISOString().slice(0, 10);
  const dateModified = note.modifiedAt || '2026-02-15';
  const imageAbs = note.ogImage
    ? (note.ogImage.startsWith('http') ? note.ogImage : `${BASE_URL}${note.ogImage}`)
    : (NOTE_HERO_IMAGES[note.slug] ? `${BASE_URL}${NOTE_HERO_IMAGES[note.slug]}` : `${BASE_URL}/og-image.png`);

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: note.customH1 || note.title,
      description: note.desc,
      image: imageAbs,
      datePublished,
      dateModified,
      author: { '@id': `${BASE_URL}/#vince` },
      publisher: { '@id': `${BASE_URL}/#business` },
      mainEntityOfPage: `${BASE_URL}/field-notes/${note.slug}`,
      articleSection: 'OSHA Compliance',
      inLanguage: 'en-US',
    },
    breadcrumb([{ name: 'Home', path: '/' }, { name: 'Field Notes', path: '/field-notes' }, { name: note.title, path: `/field-notes/${note.slug}` }]),
  ];
  if (note.customFaqs && note.customFaqs.length) {
    schemas.push(faqSchema(note.customFaqs));
  }

  // Build a title lookup so the related-notes block can use proper titles
  // (computed once below the loop would be cleaner; doing it inline keeps the diff small)
  const noteTitleBySlug = Object.fromEntries(fieldNotes.map((n) => [n.slug, n.title]));
  const relatedSlugs = (RELATED_NOTES[note.slug] || []).filter((s) => noteTitleBySlug[s]);
  const relatedHtml = relatedSlugs.length
    ? `<h2>Related Field Notes</h2><ul>${relatedSlugs
        .map((s) => `<li><a href="/field-notes/${s}">${noteTitleBySlug[s]}</a></li>`)
        .join('')}<li><a href="/services">Safety Walkthrough Services →</a></li></ul>`
    : '';

  const baseContent = note.customContent || `<h1>${note.title}</h1><p>${note.desc}</p><p>Field Note by Vince Lawrence — GigLine Safety &amp; Compliance — (336) 329-8899</p>`;

  routes.push({
    path: `/field-notes/${note.slug}`,
    title: note.customSeoTitle || `${note.title} — Field Notes | GigLine Safety & Compliance`,
    description: note.desc,
    canonical: `/field-notes/${note.slug}`,
    ogImage: note.ogImage || NOTE_HERO_IMAGES[note.slug],
    schemas,
    content: baseContent + relatedHtml,
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

  // <title> — still replaced (always present in template)
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

  // Per-page SEO tags injected before </head> (description, canonical, hreflang,
  // og:url/title/description, twitter:title/description). These do NOT exist in
  // the static template — Helmet handles them client-side. The SSR script injects
  // them so raw-HTML crawlers see them in production.
  const perPageTags = [
    `<meta name="description" content="${route.description}" />`,
    `<link rel="canonical" href="${BASE_URL}${route.canonical}" />`,
    `<link rel="alternate" hreflang="en-us" href="${BASE_URL}${route.canonical}" />`,
    `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${route.canonical}" />`,
    `<meta property="og:url" content="${BASE_URL}${route.canonical}" />`,
    `<meta property="og:title" content="${route.title}" />`,
    `<meta property="og:description" content="${route.description}" />`,
    `<meta name="twitter:title" content="${route.title}" />`,
    `<meta name="twitter:description" content="${route.description}" />`,
  ];

  // Optional og:image override (replaces the default if route specifies one)
  if (route.ogImage) {
    const ogImageUrl = route.ogImage.startsWith('http') ? route.ogImage : `${BASE_URL}${route.ogImage}`;
    html = html.replace(/<meta property="og:image" content="https:\/\/www\.giglinecompliance\.com\/og-image\.png"\s*\/?>/, `<meta property="og:image" content="${ogImageUrl}" />`);
    html = html.replace(/<meta name="twitter:image" content="https:\/\/www\.giglinecompliance\.com\/og-image\.png"\s*\/?>/, `<meta name="twitter:image" content="${ogImageUrl}" />`);
  }

  // Strip ALL existing JSON-LD schema blocks from the template (LocalBusiness
  // from index.html) so every route gets a clean, route-specific schema set.
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');

  // Inject route-specific schema block right before </head>
  const schemaBlock = buildSchemaBlock(route.schemas || []);

  // Combine per-page tags + schema and inject before </head>
  const injection = `    ${perPageTags.join('\n    ')}\n${schemaBlock || ''}\n  `;
  html = html.replace('</head>', `${injection}</head>`);

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
