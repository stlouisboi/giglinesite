import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';
import StickyTOC from '../components/StickyTOC';

const defined = {
  headline: 'How much does an OSHA safety consultant cost in 2026?',
  title: 'OSHA Safety Consultant Cost in 2026: What Drives Price',
  description: 'OSHA safety consultant cost in 2026 depends on scope, not a flat rate. See what drives price for walkthroughs, documentation reviews, and incident response.',
  canonical: '/blog/how-much-does-an-osha-safety-consultant-cost-in',
};

const tocItems = [
  { id: 'why-this-matters', label: 'Why this matters' },
  { id: 'cost-in-2026', label: 'Cost in 2026' },
  { id: 'service-types', label: 'Service types compared' },
  { id: 'cost-drivers', label: 'What drives cost' },
  { id: 'worth-the-cost', label: 'Is it worth the cost?' },
  { id: 'pricing-model', label: 'Hourly or project-based?' },
  { id: 'industry-differences', label: 'Manufacturing vs warehouse' },
  { id: 'faq', label: 'FAQ' },
];

const shortAnswer = [
  'OSHA safety consultant cost depends on scope, site size, and urgency — not a flat rate card.',
  'GigLine prices on-site walkthroughs, documentation reviews, and incident response separately by scope.',
  'Emergency incident response costs more than a scheduled walkthrough because of turnaround time.',
  "OSHA's own On-Site Consultation Program offers free help to small businesses, but it moves slower than a paid consultant.",
];

const services = [
  {
    name: 'On-site safety walkthrough',
    driver: 'Facility size, number of hazard zones, single vs. multi-site',
    best: 'Manufacturers and warehouses due for a scheduled check',
  },
  {
    name: 'Documentation readiness review',
    driver: 'Volume of existing records, backlog size, how current your logs are',
    best: 'Contractors and fleets preparing for an audit or inspection',
  },
  {
    name: 'Incident response',
    driver: 'Urgency, investigation depth, reporting requirements',
    best: 'Any operation dealing with an active incident or near-miss',
  },
];

const faqItems = [
  ['How much does an OSHA safety consultant cost in 2026?', 'Cost depends on scope — on-site walkthroughs, documentation reviews, and incident response are priced separately based on facility size, record backlog, and urgency. There is no flat industry rate card in 2026.'],
  ["What's the difference between a walkthrough and a documentation review?", 'A walkthrough inspects your physical floor and equipment for hazards, while a documentation review audits your existing paperwork against OSHA record-keeping requirements. Most operations need both at different points in the year.'],
  ['Is OSHA consultation free anywhere?', "OSHA's own On-Site Consultation Program offers free help to small and medium-sized businesses, but it typically takes longer to schedule than a paid consultant. Paid services move faster for operations facing an upcoming audit or deadline."],
  ['Does incident response cost more than a scheduled walkthrough?', 'Yes. Incident response is priced around urgency and investigation depth, which generally costs more than a scheduled walkthrough booked with advance notice.'],
  ['Do multi-site operations pay more for a compliance review?', 'Yes. Cost scales with the number of sites because each location needs its own walkthrough or documentation check.'],
  ['Who should get a documentation readiness review before an audit?', 'Contractors and fleet operators anticipating a client audit or OSHA inspection benefit most. The cost driver is how current your records already are, not the size of your operation.'],
  ['Can I compare two OSHA consultant quotes fairly?', "Only if both quotes define the same scope in writing — facility size, number of sites, and deliverables. Without a matching scope, two dollar figures aren't comparable."],
];

const Section = ({ id, tone = 'white', children }) => (
  <section id={id} className={`py-12 md:py-16 border-b border-[#2A52A0]/10 ${tone === 'soft' ? 'bg-[#F9F8F6]' : 'bg-white'}`}>
    <div className="container max-w-3xl">{children}</div>
  </section>
);

const H2 = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-5" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{children}</h2>
);

const BlogOSHAConsultantCost = () => {
  return (
    <main data-testid="blog-osha-consultant-cost-preview">
      <SEO title={defined.title} description={defined.description} canonical={defined.canonical} noindex />
      <StickyTOC items={tocItems} />

      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>PRICING GUIDE · PREVIEW</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{defined.headline}</h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-7">There is no single fixed rate for an OSHA safety consultant. Cost depends on the scope of work, not a published price list. The number to watch is what a citation costs versus what a walkthrough costs before one happens.</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
            <span>Vince Lawrence</span><span className="text-white/20">|</span><span>Draft preview</span><span className="text-white/20">|</span><span>6 min read</span>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-[#2A52A0]/10 bg-white">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>IN THIS GUIDE</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {tocItems.map((item) => <li key={item.id}><a className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80]" href={`#${item.id}`}>{item.label}</a></li>)}
          </ul>
        </div>
      </section>

      <Section>
        <p className="text-[#1C2B2B]/70 leading-relaxed mb-8">Consultants price by project scope, site count, and urgency rather than a flat hourly card. The biggest hidden variable is whether you are booking a scheduled walkthrough or calling after an incident, which changes both timeline and price.</p>
        <div className="bg-[#F9F8F6] border border-[#2A52A0]/15 border-l-4 border-l-[#C9A84C] rounded p-6 md:p-8">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>THE SHORT ANSWER</p>
          <ul className="space-y-4">
            {shortAnswer.map((item) => <li key={item} className="flex gap-3 text-sm text-[#1C2B2B]/75 leading-relaxed"><Check size={18} className="text-[#2E6B5E] flex-shrink-0 mt-0.5" />{item}</li>)}
          </ul>
        </div>
      </Section>

      <Section id="why-this-matters" tone="soft">
        <H2>Why this matters</H2>
        <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Manufacturers, warehouses, and fleet operators in the Piedmont Triad get quoted wildly different numbers for what sounds like the same service. The gap usually comes down to what is included: a single walkthrough, a documentation audit, and a full incident response engagement are three different jobs.</p>
        <p className="text-[#1C2B2B]/70 leading-relaxed">Asking how much an OSHA safety consultant costs without specifying the service is like asking what a contractor charges. The answer only means something once you name the scope.</p>
      </Section>

      <Section id="cost-in-2026">
        <H2>How much does an OSHA safety consultant cost in 2026?</H2>
        <p className="text-[#1C2B2B]/70 leading-relaxed mb-8">The honest answer: it is scope-driven, not menu-priced. Here is how the three main service types compare.</p>
        <div className="hidden md:block overflow-hidden border border-[#2A52A0]/15 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-[#102A43] text-white"><tr><th className="p-4 text-sm">Service type</th><th className="p-4 text-sm">What drives cost</th><th className="p-4 text-sm">Best for</th></tr></thead>
            <tbody>{services.map((service, index) => <tr key={service.name} className={index > 0 ? 'border-t border-[#2A52A0]/10' : ''}><td className="p-4 text-sm font-semibold text-[#1C2B2B]">{service.name}</td><td className="p-4 text-sm text-[#1C2B2B]/70">{service.driver}</td><td className="p-4 text-sm text-[#1C2B2B]/70">{service.best}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4">
          {services.map((service) => <article key={service.name} className="border border-[#2A52A0]/15 rounded-lg p-5"><h3 className="font-bold text-[#1C2B2B] mb-3">{service.name}</h3><p className="text-xs font-semibold text-[#2A52A0] uppercase mb-1">Cost driver</p><p className="text-sm text-[#1C2B2B]/70 mb-3">{service.driver}</p><p className="text-xs font-semibold text-[#2A52A0] uppercase mb-1">Best for</p><p className="text-sm text-[#1C2B2B]/70">{service.best}</p></article>)}
        </div>
        <p className="font-semibold text-[#1C2B2B] leading-relaxed mt-8">On-site walkthroughs are the lowest-friction entry point. Documentation reviews cost more when records are behind. Incident response is priced for speed, not convenience.</p>
      </Section>

      <Section id="service-types" tone="soft">
        <H2>Three service types. Three different cost structures.</H2>
        <div className="space-y-8">
          <div><h3 className="text-lg font-bold text-[#1C2B2B] mb-3">On-site safety walkthroughs</h3><p className="text-[#1C2B2B]/70 leading-relaxed mb-3">A walkthrough is a physical inspection of your floor, equipment, and hazard zones against OSHA standards. Cost scales with square footage and distinct hazard areas.</p><p className="text-sm text-[#1C2B2B]/70"><strong>Best for:</strong> operations that have not had a third-party look at their floor in over a year.</p></div>
          <div><h3 className="text-lg font-bold text-[#1C2B2B] mb-3">Documentation readiness reviews</h3><p className="text-[#1C2B2B]/70 leading-relaxed mb-3">This service audits training records, incident logs, and safety data sheets against what an inspector will ask for. The price driver is the backlog.</p><p className="text-sm text-[#1C2B2B]/70"><strong>Best for:</strong> contractors and fleet operators preparing for an audit or a new client's compliance requirement.</p></div>
          <div><h3 className="text-lg font-bold text-[#1C2B2B] mb-3">Incident response services</h3><p className="text-[#1C2B2B]/70 leading-relaxed mb-3">Incident response is priced around urgency and investigation depth, not floor space. A near-miss review costs less than a full investigation with witness statements and corrective actions.</p><p className="text-sm text-[#1C2B2B]/70"><strong>Best for:</strong> an operation that just had an incident and needs documentation and a response plan fast.</p></div>
        </div>
        <figure className="mt-10">
          <img className="w-full rounded-lg border border-[#2A52A0]/10" src="https://gwvckixiegkllthleuyt.supabase.co/storage/v1/object/public/workspace-article-images-public/f07280c8-0ecd-4bc5-a650-f48bd52265a8/body-48083fa5301dfefd48e7e163e9d8a0a3.jpg" alt="Three-column comparison of OSHA consultant service types" />
          <figcaption className="text-xs text-[#1C2B2B]/50 mt-3">Each service type has its own cost driver — floor size, record backlog, or urgency.</figcaption>
        </figure>
      </Section>

      <Section id="cost-drivers">
        <H2>Why OSHA safety consultant cost varies</H2>
        <ul className="space-y-4">
          {[
            ['Facility size and layout', 'More square footage and more hazard zones mean a longer walkthrough.'],
            ['Number of sites', 'Multi-site operations cost more per engagement than a single facility.'],
            ['Documentation backlog', 'Reconstructing missing records takes longer than reviewing current ones.'],
            ['Urgency', 'Incident response after the fact costs more than a scheduled walkthrough.'],
            ['Industry hazard class', 'Powered equipment and chemical storage take longer to inspect than a low-hazard warehouse.'],
            ['Geographic distance', 'Travel time within the Piedmont Triad factors into on-site scheduling and cost.'],
          ].map(([title, copy]) => <li key={title} className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-[#C9A84C] flex-shrink-0 mt-2.5" /><p className="text-[#1C2B2B]/70 leading-relaxed"><strong className="text-[#1C2B2B]">{title}</strong> — {copy}</p></li>)}
        </ul>
        <blockquote className="mt-10 bg-[#102A43] text-white border-l-4 border-l-[#C9A84C] rounded p-7 md:p-9 text-xl md:text-2xl leading-relaxed" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>“A one-time walkthrough tells you if you're compliant today; a review of your documentation tells you if you'll survive an audit.”</blockquote>
      </Section>

      <Section id="worth-the-cost" tone="soft"><H2>Is hiring an OSHA safety consultant worth the cost?</H2><p className="text-[#1C2B2B]/70 leading-relaxed">Yes, for operations that have not had a third-party safety review in the past year or that lack organized documentation. A walkthrough or review is a scheduled expense. A citation and its corrective actions are not. Fleet operators, contractors, and manufacturers with multiple hazard zones benefit most because internal staff often miss what an outside inspector catches.</p></Section>

      <Section id="pricing-model"><H2>Is OSHA consultant pricing hourly or project-based?</H2><p className="text-[#1C2B2B]/70 leading-relaxed">Most OSHA safety consultants price by project scope rather than a straight hourly rate because a walkthrough, documentation review, and incident response each have different deliverables. Ask every consultant to define the scope in writing before quoting. That is the only fair way to compare two quotes.</p></Section>

      <Section id="industry-differences" tone="soft"><H2>Does cost differ between manufacturing and warehouse clients?</H2><p className="text-[#1C2B2B]/70 leading-relaxed">Yes. Manufacturing facilities generally cost more to walk than pure warehouse space because powered equipment, chemical storage, and multi-shift operations add hazard zones. A single-purpose warehouse with straightforward storage and handling usually reviews faster than a production floor.</p></Section>

      <section className="py-12 md:py-16 bg-[#102A43] text-white">
        <div className="container max-w-3xl text-center"><h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Get a scoped compliance quote</h2><p className="text-white/70 mb-8">Walkthroughs, documentation reviews, and incident response priced by scope.</p><Link to="/services/compliance-readiness-visit" className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972C] text-[#102A43] font-bold px-7 py-4 rounded transition-colors">Request a Compliance Readiness Visit <ArrowRight size={18} /></Link></div>
      </section>

      <Section id="faq">
        <H2>Frequently asked questions</H2>
        <div className="divide-y divide-[#2A52A0]/10 border-y border-[#2A52A0]/10">
          {faqItems.map(([q, a]) => <details key={q} className="group py-5"><summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-semibold text-[#1C2B2B]"><span>{q}</span><ChevronDown size={18} className="text-[#2A52A0] group-open:rotate-180 transition-transform flex-shrink-0" /></summary><p className="text-sm text-[#1C2B2B]/70 leading-relaxed pt-4 pr-8">{a}</p></details>)}
        </div>
      </Section>

      <Section tone="soft"><H2>One last thing</H2><p className="text-[#1C2B2B]/70 leading-relaxed">OSHA runs a free On-Site Consultation Program for small and medium-sized businesses. It is a legitimate option, but it operates on OSHA's scheduling timeline, not yours. For Piedmont Triad operations that need a walkthrough or documentation review before a specific deadline, a scoped paid engagement is the faster path. Get the scope in writing before comparing quotes.</p></Section>

      <section className="py-14 md:py-20 bg-[#102A43] text-white">
        <div className="container max-w-3xl"><h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Related resources</h2><div className="space-y-4"><Link to="/services/compliance-readiness-visit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#C9A84C] group"><div><p className="font-semibold">Compliance Readiness Visit</p><p className="text-sm text-white/50 mt-1">Find the floor and paperwork gaps before an inspection.</p></div><ArrowRight size={18} className="text-white/40 group-hover:text-[#C9A84C]" /></Link><Link to="/services/documentation-readiness-review" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#C9A84C] group"><div><p className="font-semibold">Documentation Readiness Review</p><p className="text-sm text-white/50 mt-1">Check logs, records, programs, and missing proof.</p></div><ArrowRight size={18} className="text-white/40 group-hover:text-[#C9A84C]" /></Link></div></div>
      </section>
    </main>
  );
};

export default BlogOSHAConsultantCost;
