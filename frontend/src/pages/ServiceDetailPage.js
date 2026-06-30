import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* Service data — one entry per detail route */
const SERVICES = {
  'safety-walkthrough-report': {
    eyebrow: 'Safety Walkthrough Report',
    title: 'Safety Walkthrough Report',
    headline: 'The first step when you need exposure identified quickly.',
    price: 'From $1,200',
    metaTitle: 'Safety Walkthrough Report — From $1,200 | GigLine',
    metaDesc: 'On-site OSHA walkthrough with photo-documented findings, CFR citations, and a 48-hour written report. Fixed quote. Private engagement. Serving the Piedmont Triad.',
    body: 'An on-site walkthrough focused purely on physical hazards. You get a photo-documented report and a prioritized fix list within 48 hours. No retainer. No follow-up obligation. The walkthrough takes 1\u20133 hours depending on facility size; the report lands in your inbox within two business days.',
    whatsIncluded: [
      'On-site walkthrough (1\u20133 hours, scheduled at your convenience)',
      'Photo-documented hazard findings with location and area annotations',
      'CFR citations + estimated penalty exposure calculated based on OSHA published maximums',
      'Top 10 priority findings \u2014 RED / AMBER / GREEN, CFR citation + corrective action for each',
      'Delivered as PDF within 24\u201348 hours',
      'Fixed quote before scheduling \u2014 no scope creep, no hourly billing',
      '30-day phone follow-up included',
    ],
    process: [
      ['Quote and schedule', "You contact GigLine, share your facility size and industry. A fixed quote is issued within one business day. No hourly billing."],
      ['On-site walkthrough', 'Vince walks your floor for 1\u20133 hours. Photographs every finding. Annotates with location, severity, and CFR citation on the spot.'],
      ['Written report delivered', 'Within 48 hours, you receive a PDF with photo-documented findings, CFR citations, an estimated penalty exposure based on OSHA published maximums, and a prioritized corrective action list.'],
      ['30-day follow-up call', 'A scheduled 30-minute call to discuss what was corrected, what remains, and what to prioritize next.'],
    ],
    best: 'Operations that want to know where they stand on the floor before OSHA, an insurer, or a customer auditor shows up.',
    cta: 'Request a Walkthrough',
    intakeService: 'safety-walkthrough-report',
  },
  'documentation-readiness-review': {
    eyebrow: 'OSHA Documentation Readiness Review',
    title: 'OSHA Documentation Readiness Review',
    headline: 'Know exactly what your files say before an inspector does.',
    price: 'From $1,300',
    metaTitle: 'OSHA Documentation Readiness Review — From $1,300 | GigLine',
    metaDesc: 'A structured 53-item review of written programs, training records, OSHA logs, and SDS compliance. Compliance percentage score + prioritized corrective action sequence.',
    body: 'A structured review of your written programs, training records, OSHA logs, and SDS compliance. You receive a compliance percentage score and a prioritized corrective action sequence \u2014 not a generic checklist. The review covers 53 items across 7 OSHA categories.',
    whatsIncluded: [
      'Written safety programs (LOTO, HazCom, PPE, EAP)',
      'Training records by employee and role',
      'OSHA 300 / 300A / 301 logs',
      'Inspection and maintenance records',
      'SDS inventory and compliance',
      '53-item checklist across 7 OSHA categories',
      'Compliance percentage score + priority corrective action sequence',
    ],
    process: [
      ['Document request', 'You submit your safety documentation digitally or hand over copies in person. GigLine signs an NDA before review begins.'],
      ['Structured review', 'Each document is checked against a 53-item OSHA compliance checklist spanning 7 categories. Two-layer review: program exists + content is legally sufficient.'],
      ['Compliance score + report', 'You receive a compliance percentage score and a prioritized gap list \u2014 most critical citations first \u2014 within 48 hours.'],
      ['Optional next step', 'If gaps are found, the Document Development service writes the missing or insufficient programs to OSHA standard.'],
    ],
    best: 'Operations preparing for an audit, insurance review, or customer pre-qualification who need to know specifically what documentation gaps exist.',
    cta: 'Request a Documentation Review',
    intakeService: 'documentation-readiness-review',
  },
  'compliance-readiness-visit': {
    eyebrow: 'Compliance Readiness Visit',
    title: 'Compliance Readiness Visit',
    headline: 'Floor and files reviewed in a single engagement.',
    price: 'From $2,000',
    metaTitle: 'Compliance Readiness Visit — From $2,000 | GigLine',
    metaDesc: "GigLine's most requested engagement. On-site walkthrough + documentation review in a single visit. 18-page CFR-cited report. 90-day remediation tracker. From $2,000.",
    body: "The most requested GigLine engagement. A Safety Walkthrough and OSHA Documentation Readiness Review combined into a single on-site visit, delivering a single compliance percentage score for both floor and files. The 18-page CFR-cited report is delivered within 48 hours.",
    whatsIncluded: [
      'Full physical hazard walkthrough (2\u20134 hours)',
      'Photo-documented findings with CFR citations',
      'Structured documentation review (53-item checklist)',
      'Single compliance percentage score \u2014 floor and files combined',
      '18-page CFR-cited field audit report within 48 hours',
      'Compliance score with prioritized finding categories',
      '90-day remediation tracker \u2014 pre-populated, ready to assign',
      "'What to Say If OSHA Calls' guidance sheet",
      '30-day check-in call included',
      'Fixed quote \u00b7 Private engagement',
    ],
    process: [
      ['Quote and schedule', 'Single fixed quote covering both walkthrough and documentation review. Visit scheduled within 1\u20132 weeks.'],
      ['On-site visit', 'Vince conducts the walkthrough and reviews documentation on-site over a single 4\u20136 hour engagement.'],
      ['Combined report', 'Single 18-page CFR-cited report covering floor + files. One compliance score. One prioritized fix list. Delivered within 48 hours.'],
      ['30-day check-in call', "A scheduled call to review what's been corrected, answer questions, and prioritize the next 60 days."],
    ],
    best: "The right starting point for any operation that hasn't had a structured compliance review in the past 12 months and wants both the floor and the files reviewed at once.",
    cta: 'Schedule a Compliance Readiness Visit',
    intakeService: 'compliance-readiness-visit',
    badge: 'Most Requested',
  },
  'osha-ready-control-system': {
    eyebrow: 'OSHA-Ready Control System',
    title: 'OSHA-Ready Control System',
    headline: 'Build the safety system that holds up when an inspector asks for it.',
    price: 'From $4,500',
    metaTitle: 'OSHA-Ready Control System Buildout — From $4,500 | GigLine',
    metaDesc: 'A full safety control system buildout. Four binders, digital folder architecture, training matrix, corrective action tracker, and a 90-day maintenance calendar.',
    body: 'A complete safety control system built into your operation. GigLine installs the four-binder physical system, builds your digital folder structure, populates the training matrix and SDS index, sets up the corrective action tracker, and trains your supervisors. Single engagement, multi-week build, lasting system.',
    whatsIncluded: [
      'Four-Binder Physical Command System (Hazard programs / Training records / Inspection logs / Incident & corrective action)',
      'Digital Folder Architecture mirrored to your cloud drive',
      'Training Matrix + SDS Organization with annual refresher calendar',
      'Corrective Action Tracker \u2014 supervisor-closable, OSHA-defensible',
      '90-Day Maintenance Calendar + Supervisor Walkthrough at handoff',
      'On-call access through end of buildout',
      'Single fixed quote \u2014 no hourly billing',
    ],
    process: [
      ['Compliance Readiness Visit first', 'The buildout begins with a CRV so GigLine knows exactly what currently exists, what is missing, and what is insufficient.'],
      ['System install', 'Over 2\u20134 weeks, GigLine builds the four binders, sets up the digital architecture, populates the training matrix, indexes the SDS inventory, and sets up the corrective action tracker.'],
      ['Supervisor handoff walkthrough', "On a single scheduled day, GigLine walks your supervisor team through the full system. Calendar reminders configured for the first 90 days."],
      ['90-day maintenance support', "Through the first 90 days post-handoff, GigLine remains on-call for questions and supervisor support."],
    ],
    best: 'Operations that have completed a Compliance Readiness Visit and are ready to build a defensible, supervisor-maintainable safety system. Best fit for facilities planning to keep the system in place for 3+ years.',
    cta: 'Ask About the Control System',
    intakeService: 'osha-ready-control-system',
    badge: 'Premium Engagement',
  },

  'annual-compliance-partner': {
    eyebrow: 'Annual Compliance Control Partner',
    title: 'Annual Compliance Control Partner',
    headline: 'When OSHA shows up, when someone gets hurt, when your customer asks for your safety program \u2014 you need someone who already knows your operation.',
    price: '$12,000/year',
    priceSecondary: '$1,000/month equivalent',
    metaTitle: 'Annual Compliance Control Partner — $12,000/year | GigLine',
    metaDesc: 'A year-long compliance partnership for small manufacturers. Two walkthroughs + four documentation reviews + quarterly review calls + on-call access. From $12,000/year.',
    body: 'Two full walkthroughs per year. Quarterly documentation reviews. Training record maintenance. OSHA 300A posting reminders. Pre-inspection readiness review. Management safety review. GigLine becomes your ongoing compliance resource \u2014 available when something happens and proactive between visits.',
    whatsIncluded: [
      'Two Safety Walkthroughs per year \u2014 on-site, photographed, reported within 48 hours',
      'Four Documentation Reviews per year \u2014 written programs, training records, OSHA logs',
      'Four Quarterly Review Calls \u2014 30 minutes each, reviewing findings and corrections',
      'OSHA 300A posting reminders flagged in advance of February 1',
      "Pre-inspection readiness review \u2014 you're not starting from zero if OSHA shows up",
      "On-call access between visits \u2014 direct line to Vince",
      "Annual management safety review \u2014 written summary of year's findings and open items",
    ],
    process: [
      ['Kickoff Compliance Readiness Visit', "Year begins with a full CRV \u2014 walkthrough + documentation review \u2014 to establish the baseline."],
      ['Quarterly cadence', "Documentation reviews quarterly, walkthroughs twice per year, review calls scheduled in advance."],
      ['On-call access', "Direct line to Vince between scheduled visits. For incidents, OSHA inquiries, or questions that can't wait."],
      ['Annual review', "End-of-year written summary of findings, corrections completed, and the priority list for the next year."],
    ],
    valueAnchor: {
      standalone: '$7,600+',
      standaloneLabel: 'Standalone value of scheduled services',
      partner: '$12,000',
      partnerLabel: 'Annual Partner rate',
      monthly: '$1,000',
      monthlyLabel: 'Monthly equivalent',
    },
    best: 'Operations that want a consultant they can call, not just a one-time report. Best fit for facilities with 25+ employees, multiple shifts, or recurring customer-audit requirements.',
    cta: 'Ask About Annual Partnership',
    intakeService: 'annual-compliance-partner',
    badge: 'Highest-Value Engagement',
  },
};

const intakeLink = (service) => `/intake?service=${encodeURIComponent(service)}`;

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const svc = SERVICES[slug];

  if (!svc) return <Navigate to="/services" replace />;

  return (
    <main data-testid={`service-detail-${slug}`}>
      <SEO
        title={svc.metaTitle}
        description={svc.metaDesc}
        canonical={`/services/${slug}`}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": svc.title,
            "provider": { "@type": "LocalBusiness", "name": "GigLine Safety & Compliance", "url": "https://www.giglinecompliance.com", "telephone": "+13363298899" },
            "areaServed": { "@type": "State", "name": "North Carolina" },
            "offers": { "@type": "Offer", "price": svc.price.replace(/[^0-9]/g, ''), "priceCurrency": "USD", "description": svc.price },
            "description": svc.metaDesc,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.giglinecompliance.com/" },
              { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.giglinecompliance.com/services" },
              { "@type": "ListItem", "position": 3, "name": svc.title, "item": `https://www.giglinecompliance.com/services/${slug}` },
            ],
          },
        ]}
      />

      {/* ═══ Hero ═══ */}
      <section className="bg-[#2A52A0] text-white py-20 md:py-28">
        <div className="container max-w-4xl">
          {svc.badge && (
            <span
              className="inline-block uppercase font-bold mb-4"
              style={{
                ...mono,
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: '#C9A84C',
                border: '1px solid rgba(201,168,76,0.4)',
                padding: '4px 10px',
                borderRadius: '999px',
              }}
              data-testid={`${slug}-hero-badge`}
            >
              {svc.badge}
            </span>
          )}
          <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#2A52A0' }}>
            {svc.eyebrow}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-5 tracking-tight">
            {svc.headline}
          </h1>
          <div className="mb-7" style={{ width: '56px', height: '3px', background: '#C9A84C', borderRadius: '2px' }} />
          <p className="text-base md:text-lg text-white/75 leading-[1.85] mb-8 max-w-3xl">
            {svc.body}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to={intakeLink(svc.intakeService)}
              className="inline-flex items-center justify-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              data-testid={`${slug}-cta-hero`}
            >
              {svc.cta}
              <ArrowRight size={17} />
            </Link>
            <span className="font-extrabold text-[#C9A84C] text-2xl" style={mono} data-testid={`${slug}-price`}>
              {svc.price}
            </span>
            {svc.priceSecondary && (
              <span className="text-white/55 text-sm" style={mono}>{svc.priceSecondary}</span>
            )}
          </div>
        </div>
      </section>

      {/* ═══ What's Included ═══ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container max-w-4xl">
          <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#2A52A0' }}>
            What&apos;s Included
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-3 tracking-tight">
            Everything in the engagement.
          </h2>
          <div className="mb-10" style={{ width: '56px', height: '3px', background: '#C9A84C', borderRadius: '2px' }} />
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {svc.whatsIncluded.map((line, i) => (
              <li key={i} className="flex items-start gap-3.5 text-[#1C2B2B]/85 text-[15.5px] leading-[1.6]" data-testid={`${slug}-include-${i + 1}`}>
                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5 text-[#2A52A0]" strokeWidth={2} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ Process / What Happens On The Day ═══ */}
      {svc.process && (
        <section className="py-20 md:py-24" style={{ backgroundColor: '#f5f4f0' }}>
          <div className="container max-w-4xl">
            <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#2A52A0' }}>
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1C2B2B] leading-[1.15] mb-3 tracking-tight">
              What happens when you engage GigLine.
            </h2>
            <div className="mb-10" style={{ width: '56px', height: '3px', background: '#C9A84C', borderRadius: '2px' }} />
            <div className="space-y-5">
              {svc.process.map(([step, detail], i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-7 md:p-8 flex gap-5"
                  style={{ border: '1px solid #dde3ea', boxShadow: '0 1px 0 rgba(28,43,43,0.02)' }}
                  data-testid={`${slug}-step-${i + 1}`}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center font-extrabold text-white"
                    style={{ width: 40, height: 40, borderRadius: '50%', background: '#2A52A0', ...mono, fontSize: '15px' }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1C2B2B] mb-2">{step}</h3>
                    <p className="text-[15px] text-[#1C2B2B]/70 leading-[1.75]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Value Anchor (Annual Partner only) ═══ */}
      {svc.valueAnchor && (
        <section className="py-16 bg-white">
          <div className="container max-w-3xl">
            <div className="rounded-2xl p-8 md:p-10" style={{ background: '#2A52A0' }}>
              <p className="uppercase font-bold mb-5" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#C9A84C' }}>
                Value Anchor
              </p>
              <div className="space-y-3 text-base">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-white/65">{svc.valueAnchor.standaloneLabel}</span>
                  <span className="font-bold text-white" style={mono}>{svc.valueAnchor.standalone}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-white/65">{svc.valueAnchor.partnerLabel}</span>
                  <span className="font-bold text-[#C9A84C]" style={mono}>{svc.valueAnchor.partner}</span>
                </div>
                <div className="flex items-baseline justify-between gap-3 pt-3 mt-1" style={{ borderTop: '1px dashed rgba(201,168,76,0.30)' }}>
                  <span className="text-white/65 italic">{svc.valueAnchor.monthlyLabel}</span>
                  <span className="font-bold text-white" style={mono}>{svc.valueAnchor.monthly}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Best For + CTA ═══ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container max-w-4xl text-center">
          <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: '#2A52A0' }}>
            Best For
          </p>
          <p className="text-xl md:text-2xl text-[#1C2B2B] leading-snug mb-12 max-w-3xl mx-auto font-bold">
            {svc.best}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={intakeLink(svc.intakeService)}
              className="inline-flex items-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              data-testid={`${slug}-cta-bottom`}
            >
              {svc.cta}
              <ArrowRight size={18} />
            </Link>
            <a
              href="tel:3363298899"
              className="inline-flex items-center gap-2 bg-white border-2 border-[#2A52A0] hover:bg-[#2A52A0] hover:text-white text-[#1C2B2B] font-bold px-7 py-4 rounded-lg text-base transition-colors"
              data-testid={`${slug}-cta-phone`}
            >
              <Phone size={16} />
              (336) 329-8899
            </a>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-[#2A52A0] hover:text-[#1F3F80] font-bold text-sm mt-8"
            data-testid={`${slug}-back-services`}
          >
            &larr; Back to all services
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetailPage;
