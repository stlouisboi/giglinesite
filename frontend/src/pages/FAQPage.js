import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

// 18 FAQs authored for answer-engine extraction.
// Each answer is 1-4 sentences, factual, concrete, and written the way a human asks a search engine.
export const FAQS = [
  {
    q: 'How much does an OSHA safety walkthrough cost in North Carolina?',
    a: "GigLine safety walkthroughs start at $850. Larger or more complex operations may scope higher. Most small-operation walkthroughs fall between $850 and $1,500 depending on square footage and scope. You'll receive a fixed price before scheduling — no hourly billing, no retainer.",
  },
  {
    q: "What's included in a GigLine safety walkthrough?",
    a: "A GigLine safety walkthrough includes a 1–3-hour on-site review, photo-documented safety observations, OSHA-related references where applicable, and a written \"Top 10 Fixes\" report delivered within 24–48 hours. Findings are color-coded: RED for urgent items, AMBER for near-term corrections, and GREEN for what your team is doing well.",
  },
  {
    q: 'How long does a safety walkthrough take on-site?',
    a: 'Most walkthroughs take 1 to 3 hours on-site. A small shop under 10,000 sq ft may take less than an hour. Larger warehouses, production floors, or multi-area operations may take 2 to 3 hours or require a larger scoped visit. You will receive a time estimate before the visit.',
  },
  {
    q: "What's the difference between a safety walkthrough and an OSHA inspection?",
    a: "An OSHA inspection is performed by a federal or state compliance officer and may result in citations, penalties, and required abatement. A GigLine safety walkthrough is a private, voluntary review performed by an independent consultant. Findings are delivered only to you — nothing is reported to OSHA, your insurance carrier, or any third party.",
  },
  {
    q: 'Do I need a written HazCom program if I have fewer than 10 employees?',
    a: 'In most cases, yes. Under OSHA 29 CFR 1910.1200, employers with hazardous chemicals in the workplace must maintain a written Hazard Communication program, regardless of headcount. Exceptions are limited and generally apply only to sealed consumer-packaged products used in the same way a household consumer would use them.',
  },
  {
    q: 'What areas of North Carolina does GigLine serve?',
    a: 'GigLine is based in Kernersville, NC and serves the Piedmont Triad, including Winston-Salem, Greensboro, High Point, Burlington, Lexington, Thomasville, Salisbury, and surrounding communities. Most on-site work is scheduled within roughly 60 miles of Winston-Salem. Charlotte and Raleigh metro engagements may be considered based on scope and travel.',
  },
  {
    q: 'Will GigLine report findings to OSHA?',
    a: "No. GigLine engagements are private. The written report is delivered to the client only. GigLine does not contact OSHA, your insurance carrier, or any regulatory agency as part of a standard walkthrough or documentation review.",
  },
  {
    q: 'How fast do I get my walkthrough report?',
    a: 'Reports are typically delivered within 24 to 48 hours of the on-site visit. The report is provided as a PDF and may include photos, OSHA-related references where applicable, and prioritized corrective action recommendations. Many clients receive the report by the next business day.',
  },
  {
    q: 'What is a "Top 10 Fixes" report?',
    a: "The GigLine deliverable for a safety walkthrough. It ranks the ten most important findings from your on-site visit, organized RED for urgent items, AMBER for near-term corrections, and GREEN for what your team is doing well. Each item includes what was observed, why it matters, the OSHA-related reference where applicable, and a recommended corrective action.",
  },
  {
    q: 'Does GigLine work with my insurance carrier?',
    a: "No. The engagement is strictly between the business owner and GigLine. Nothing is shared with insurance carriers, brokers, or third parties. What you choose to do with the report — including sharing it with your carrier — is entirely your decision.",
  },
  {
    q: 'Can I see a sample safety walkthrough report before I book?',
    a: 'Yes. Email vince@giglinecompliance.com or call (336) 329-8899 and request a sanitized sample. Sensitive client details are redacted but the structure, depth, and OSHA references are identical to what you\'ll receive.',
  },
  {
    q: 'What industries does GigLine typically work with?',
    a: 'Small manufacturers, warehouses, distribution centers, fleet operations, general contractors, and specialty trades. Most clients have 5 to 100 employees. The common thread is operations that do not have a full-time safety manager.',
  },
  {
    q: 'Does GigLine offer safety training or just inspections?',
    a: 'GigLine does not deliver formal OSHA training courses. The walkthrough includes on-site coaching while walking the floor, and the report includes corrective actions that often reference training requirements. For formal certification-based training, GigLine can recommend local providers.',
  },
  {
    q: 'Is Vince Lawrence OSHA certified?',
    a: "Vince Lawrence is OSHA 30-Hour Certified in General Industry and has 25+ years of hands-on experience in manufacturing, fleet, and warehouse safety. He is also a U.S. Navy veteran. GigLine is owner-operated — every walkthrough and report is performed personally by Vince.",
  },
  {
    q: 'What happens if OSHA shows up after my walkthrough?',
    a: "You have the written record of every hazard identified, every corrective action taken, and every training record reviewed. An OSHA compliance officer who sees an active corrective-action log is usually looking at a cooperative-employer outcome instead of a willful-violation outcome. Documentation is the single biggest factor in how an OSHA visit goes.",
  },
  {
    q: 'Do you offer follow-up walkthroughs for past clients?',
    a: "Yes. Follow-up walkthroughs for past clients are offered at a reduced rate. Ongoing support is also available through Quarterly Compliance Maintenance ($750–$1,750 per quarter) and the Annual Compliance Control Partner program ($9,000–$18,000 per year).",
  },
  {
    q: 'How should I prepare for a safety walkthrough?',
    a: "Nothing special. Do not stage, clean up, or hide anything — the walkthrough is most valuable when the floor looks the way it normally does. Have your written safety programs, SDS binder, and training records accessible. A brief floor manager or supervisor introduction at the start helps.",
  },
  {
    q: 'How do I book a safety walkthrough with GigLine?',
    a: "Visit https://www.giglinecompliance.com/request-walkthrough and fill the four-field form, or call (336) 329-8899 directly. You'll hear back within one business day with scheduling options and a confirmed price.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://www.giglinecompliance.com/faq' },
    ],
  };

  return (
    <main data-testid="faq-page">
      <SEO
        title="Safety Walkthrough FAQ | OSHA Compliance Questions Answered | GigLine"
        description="Answers to the most common questions about OSHA safety walkthroughs in North Carolina — cost, duration, what's included, how reports work, and who GigLine serves."
        canonical="/faq"
        schema={[faqSchema, breadcrumbSchema]}
      />

      {/* Hero */}
      <section className="bg-[#0B1F33] text-white py-16 md:py-24">
        <div className="container max-w-4xl">
          <p
            className="uppercase tracking-[3px] text-[#1F6FEB] mb-5"
            style={{ ...mono, fontSize: '11px' }}
            data-testid="faq-kicker"
          >
            Frequently Asked Questions
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="faq-headline"
          >
            Straight answers about safety walkthroughs and OSHA compliance.
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed">
            Cost, scope, timeline, and what actually happens when you book a GigLine walkthrough. If you don't see your question here, call (336) 329-8899 or email vince@giglinecompliance.com.
          </p>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="container max-w-3xl">
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openIndex === i;
              return (
                <div
                  key={i}
                  className="border border-[#102133]/10 rounded-lg bg-white overflow-hidden"
                  data-testid={`faq-item-${i}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="w-full flex items-start justify-between gap-4 text-left px-5 py-4 md:px-6 md:py-5 hover:bg-[#F9F8F6] transition-colors"
                    data-testid={`faq-question-${i}`}
                    aria-expanded={open}
                  >
                    <span
                      className="font-semibold text-[#102133] text-base md:text-lg leading-snug"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {f.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 mt-1 text-[#1F6FEB] transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <div
                      className="px-5 pb-5 md:px-6 md:pb-6 text-[#102133]/75 leading-relaxed text-sm md:text-base"
                      data-testid={`faq-answer-${i}`}
                    >
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-[#0B1F33] text-white">
        <div className="container max-w-2xl text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Ready to schedule a walkthrough?
          </h2>
          <p className="text-white/55 mb-8 text-base md:text-lg">
            One on-site visit. A written report within 48 hours. Starting at $850.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/request-walkthrough"
              className="inline-flex items-center justify-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1F6FEB]/20"
              data-testid="faq-cta-primary"
            >
              Request a Walkthrough
              <ArrowRight size={18} />
            </Link>
            <a
              href="tel:3363298899"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-semibold px-6 py-4 rounded transition-colors"
              data-testid="faq-cta-call"
            >
              Call (336) 329-8899
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;
