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
  logo: `${BASE_URL}/gigline-logo-full.svg`,
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
  priceRange: '$550–$1200',
  openingHours: 'Mo-Fr 08:00-18:00',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Safety Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Safety Walkthrough & Top 10 Fixes Report' }, price: '650', priceCurrency: 'USD' },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Documentation Review & Gap Check' }, price: '550', priceCurrency: 'USD' },
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
  { q: 'How long are you on-site?', a: "Most walkthroughs run 1 to 3 hours depending on the size of the operation. A small shop may take under an hour. A multi-bay warehouse or production floor typically runs 2 to 3 hours. You'll know the range before I arrive." },
  { q: "What do I get when it's done?", a: "A written report delivered within 48 hours. It includes photo-documented findings, the specific OSHA standard referenced for each one, and a plain-language corrective action for each item. No guesswork about what to fix or why." },
  { q: 'Do you work with my insurance company or report to OSHA?', a: "No. This is a private engagement. Nothing leaves the building except the report I give you. I don't contact your insurer, your carrier, or any regulatory agency. What you do with the findings is entirely your decision." },
  { q: 'What if my operation is outside the Triad?', a: 'On-site walkthroughs are available within roughly 60 miles of Winston-Salem — covering the full Triad and surrounding areas. For locations beyond that range, contact me directly. Travel engagements are available and travel fees may apply.' },
];

// Canonical 18-question FAQ for /faq page
const FULL_FAQS = [
  { q: 'How much does an OSHA safety walkthrough cost in North Carolina?', a: "GigLine safety walkthroughs start at $650 for operations within 30 miles of Kernersville (Winston-Salem, Greensboro, High Point, and the Triad core). Locations 30–60 miles out start at $750 to account for travel — this is all-in, no separate travel fee. Most small-operation walkthroughs fall between $650 and $1,200 depending on square footage and scope. You'll receive a fixed price before scheduling — no hourly billing, no retainer." },
  { q: "What's included in a GigLine safety walkthrough?", a: "An on-site walkthrough of your operation (1–3 hours), photo-documented hazard findings, the specific OSHA standard referenced for each finding, and a written 'Top 10 Fixes' report delivered within 24–48 hours. Findings are color-coded: RED (fix this week), AMBER (fix this month), GREEN (what you're doing right)." },
  { q: 'How long does a safety walkthrough take on-site?', a: 'Most walkthroughs run 1 to 3 hours. A small shop under 10,000 sq ft may take under an hour. A multi-bay warehouse or production floor typically runs 2 to 3 hours. You will know the time estimate before the visit.' },
  { q: "What's the difference between a safety walkthrough and an OSHA inspection?", a: 'An OSHA inspection is performed by a federal compliance officer and can result in citations and fines. A GigLine safety walkthrough is a private, voluntary review performed by an independent consultant. Findings are delivered only to you — nothing is reported to OSHA, your insurance carrier, or any third party.' },
  { q: 'Do I need a written HazCom program if I have fewer than 10 employees?', a: 'Yes. Under OSHA 29 CFR 1910.1200, any employer with hazardous chemicals in the workplace must have a written Hazard Communication program, regardless of headcount. Exemptions are very narrow and apply only to sealed consumer-packaged products used in the same way a household consumer would use them.' },
  { q: 'What areas of North Carolina does GigLine serve?', a: 'GigLine is based in Kernersville, NC and serves the full Piedmont Triad — Winston-Salem, Greensboro, High Point, Burlington, Lexington, Thomasville, Salisbury, and surrounding towns — within roughly 60 miles of Winston-Salem. Scheduled engagements are available in the Charlotte and Raleigh metros with travel considered.' },
  { q: 'Will GigLine report findings to OSHA?', a: "No. Every engagement is private. The only deliverable is the written report handed to the business owner. GigLine does not contact OSHA, the owner's insurance carrier, or any regulatory agency under any circumstances." },
  { q: 'How fast do I get my walkthrough report?', a: 'Reports are delivered within 24 to 48 hours of the on-site visit. The report is a PDF with photos, OSHA citations, and prioritized corrective actions. Most clients receive the report the next business day.' },
  { q: 'What is a "Top 10 Fixes" report?', a: "The GigLine deliverable for a safety walkthrough. It ranks the ten most important findings from your on-site visit, organized RED (fix this week), AMBER (fix this month), and GREEN (reinforce what's working). Each item includes what was observed, why it matters, the OSHA standard cited, and the specific corrective action." },
  { q: 'Does GigLine work with my insurance carrier?', a: 'No. The engagement is strictly between the business owner and GigLine. Nothing is shared with insurance carriers, brokers, or third parties. What you choose to do with the report — including sharing it with your carrier — is entirely your decision.' },
  { q: 'Can I see a sample safety walkthrough report before I book?', a: "Yes. Email vince@giglinecompliance.com or call (336) 329-8899 and request a sanitized sample. Sensitive client details are redacted but the structure, depth, and OSHA references are identical to what you'll receive." },
  { q: 'What industries does GigLine typically work with?', a: 'Small manufacturers, warehouses, distribution centers, fleet operations, general contractors, and specialty trades. Most clients have 5 to 100 employees. The common thread is operations that do not have a full-time safety manager.' },
  { q: 'Does GigLine offer safety training or just inspections?', a: 'GigLine does not deliver formal OSHA training courses. The walkthrough includes on-site coaching while walking the floor, and the report includes corrective actions that often reference training requirements. For formal certification-based training, GigLine can recommend local providers.' },
  { q: 'Is Vince Lawrence OSHA certified?', a: 'Vince Lawrence is OSHA 30-Hour Certified in General Industry and has 25+ years of hands-on experience in manufacturing, fleet, and warehouse safety. He is also a U.S. Navy veteran. GigLine is owner-operated — every walkthrough and report is performed personally by Vince.' },
  { q: 'What happens if OSHA shows up after my walkthrough?', a: 'You have the written record of every hazard identified, every corrective action taken, and every training record reviewed. An OSHA compliance officer who sees an active corrective-action log is usually looking at a cooperative-employer outcome instead of a willful-violation outcome. Documentation is the single biggest factor in how an OSHA visit goes.' },
  { q: 'Do you offer follow-up walkthroughs for past clients?', a: "Yes. Follow-up walkthroughs for past clients are offered at a reduced rate of $550 (versus $650 for a first-time visit). Most operations benefit from a semi-annual or annual follow-up to catch the drift that happens when safety isn't the primary focus." },
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
    title: 'OSHA Safety Walkthroughs for Small Manufacturers | Kernersville NC | GigLine Safety & Compliance',
    description: 'GigLine Safety & Compliance provides on-site OSHA safety walkthroughs and compliance inspections for small manufacturers, warehouses, and fleets in Kernersville, NC and the Piedmont Triad. Starting at $650.',
    canonical: '/',
    schemas: [
      LOCAL_BUSINESS,
      VINCE_PERSON,
      faqSchema(HOMEPAGE_FAQS),
      breadcrumb([{ name: 'Home', path: '/' }]),
    ],
    content: `
      <h1>If OSHA Walked In Tomorrow, Would You Pass?</h1>
      <p>A single OSHA citation averages $15,625. A GigLine safety walkthrough costs a fraction of that — and gives you a clear picture of where you stand.</p>
      <p>GigLine provides on-site safety walkthroughs and OSHA-focused compliance inspections for small warehouses and manufacturing operations in the Piedmont Triad.</p>
      <p><a href="/services">Request a Safety Walkthrough</a> — Walkthrough pricing is based on the size and type of your operation.</p>
      <p>OSHA 30-Hour Certified · 25+ Years Experience · U.S. Navy Veteran · Serving the Triad</p>
      <h2>Common OSHA Safety Issues We See on the Floor</h2>
      <p>These are the violations we find most often in small operations — most owners don't know they're there until an inspector shows up. Blocked electrical panels. Expired forklift certifications. Missing lockout-tagout procedures. No written HazCom program.</p>
      <p>A single citation for any of these averages $15,625. Most walkthroughs cost a fraction of that.</p>
      <h2>What to Expect from a Safety Walkthrough</h2>
      <ol><li>Request — Tell me about your operation.</li><li>Schedule — We set a time. No disruption.</li><li>Walkthrough — I walk your floor during normal work.</li><li>Report — You get clear findings with photos.</li><li>Action — You fix what matters.</li></ol>
      <h2>What You Get in Your Safety Walkthrough Report</h2>
      <p>A written Safety Check report delivered within 24-48 hours. Photo-documented findings. The OSHA standard referenced for each one. A plain-language corrective action for each item.</p>
      <h2>What Clients Say</h2>
      <p>"If you're looking for a partner that can bridge the gap between compliance and real-world execution, GigLine delivers results." — Demar Archie, Warehouse Receiving Manager</p>
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
    title: 'Safety Consultant for Small Manufacturers | Kernersville NC | GigLine',
    description: 'Vince Lawrence — safety consultant for small manufacturers in Kernersville, NC and the Triad. OSHA 30-Hour certified, Navy veteran, 25+ years experience.',
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
    title: 'OSHA Safety Walkthrough & Compliance Services | Kernersville NC | GigLine',
    description: 'On-site OSHA safety walkthroughs, documentation reviews, and incident response for small manufacturers, warehouses, and fleets in Kernersville, NC. From $650.',
    canonical: '/services',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'GigLine Safety Consulting Services',
        itemListElement: [
          { '@type': 'ListItem', position: 1, item: { '@type': 'Service', name: 'Safety Walkthrough & Top 10 Fixes Report', description: 'A structured on-site review of common OSHA exposure areas.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '650', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 2, item: { '@type': 'Service', name: 'Safety Documentation Review & Gap Check', description: 'Review of written safety programs, training records, and inspection forms.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '550', priceCurrency: 'USD' } } },
          { '@type': 'ListItem', position: 3, item: { '@type': 'Service', name: 'Incident Review & Corrective Action Support', description: 'Post-incident review and corrective direction.', provider: { '@id': `${BASE_URL}/#business` }, areaServed: 'North Carolina', offers: { '@type': 'Offer', price: '900', priceCurrency: 'USD' } } },
        ],
      },
      faqSchema([
        { q: 'How much does a GigLine safety walkthrough cost?', a: "Walkthroughs start at $650. Most small-operation walkthroughs fall in the $650–$1,000 range based on square footage and scope. You'll receive a fixed quote before scheduling." },
        { q: "What's included in a documentation review and gap check?", a: "A review of your written safety programs, training records, inspection logs, and required documentation — with a gap analysis that lists what's missing, what needs updating, and what's in good order. Starts at $550." },
        { q: 'When do I need incident review and corrective action support?', a: 'After a recordable injury, near-miss, or OSHA visit — anytime you need to document what happened, identify what broke down, and build corrective action that holds up under review. Starts at $900.' },
        { q: 'Do services require a retainer or long-term contract?', a: 'No. Every GigLine service is a single engagement with a fixed fee. No monthly retainer, no long-term contract. You pay once, you get the report, the engagement is closed.' },
      ]),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }]),
    ],
    content: `
      <h1>Safety Services for Small Operations</h1>
      <p>Each engagement ends with a written report, clear action items, and a defined next step. No ongoing contracts. No retainers.</p>
      <h2>90-Second Safety Check — Free</h2>
      <p>Answer 6 yes-or-no questions about your operation. Get an immediate risk score and a clear next step — no email required to start.</p>
      <h2>Safety Walkthrough &amp; Top 10 Fixes Report — Starting at $650</h2>
      <p>Best for single-building facilities under 50,000 sq ft. On-site walkthrough with written report identifying the ten issues most likely to create trouble first.</p>
      <h2>Documentation Review &amp; Gap Check — Starting at $550</h2>
      <p>Best for operations preparing for audits or rebuilding safety files. Review of written programs, training records, inspection logs, and required documentation.</p>
      <h2>Incident Review &amp; Corrective Action Support — Starting at $900</h2>
      <p>Best for operations responding to a recordable injury or near-miss. Document what happened, identify what broke down, build corrective action that holds up under review.</p>
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
      <h2>Triad Core — Starting at $650 (within 30 miles of Kernersville)</h2>
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
      <h2>Outer Tier — Starting at $750 (travel included)</h2>
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
      <p>Schedule an on-site safety walkthrough with GigLine Safety &amp; Compliance. One visit. Clear findings. Written report within 24-48 hours.</p>
      <p>Serving small manufacturers, warehouses, contractors, and fleets in the Kernersville/Triad, NC area.</p>
      <p>(336) 329-8899 · vince@giglinecompliance.com</p>
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
  routes.push({
    path: `/field-notes/${note.slug}`,
    title: `${note.title} — Field Notes | GigLine Safety & Compliance`,
    description: note.desc,
    canonical: `/field-notes/${note.slug}`,
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: note.title,
        description: note.desc,
        author: { '@id': `${BASE_URL}/#vince` },
        publisher: { '@id': `${BASE_URL}/#business` },
        mainEntityOfPage: `${BASE_URL}/field-notes/${note.slug}`,
      },
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Field Notes', path: '/field-notes' }, { name: note.title, path: `/field-notes/${note.slug}` }]),
    ],
    content: `<h1>${note.title}</h1><p>${note.desc}</p><p>Field Note by Vince Lawrence — GigLine Safety &amp; Compliance — (336) 329-8899</p>`,
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
  if (route.content) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><div data-server-rendered="true" style="font-family:Georgia,serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1C2B2B;">${route.content.trim()}</div></div>`,
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
