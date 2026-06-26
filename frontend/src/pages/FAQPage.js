import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

// 27 FAQs authored for answer-engine extraction.
// Each answer is verbatim from approved GL-WEB-009 copy (Feb 2026) and from prior 18-FAQ spec.
// +5 added Feb 2026 covering CRV / Annual Partner / Document Development / Quarterly per audit recommendation.
export const FAQS = [
  {
    q: 'How much does an OSHA safety walkthrough cost in North Carolina?',
    a: "GigLine safety walkthroughs start at $1,200. Price is scoped based on square footage, machine count, employee count, and hazard complexity. Fixed quote before scheduling. No hourly billing, no retainer, no surprise invoice. For context: a single OSHA serious violation can cost up to $16,550 per citation (2026 adjusted rate). The walkthrough identifies what's exposed before an inspector does.",
  },
  {
    q: 'What does an OSHA safety consultant do on-site?',
    a: "During a GigLine Safety Walkthrough, Vince Lawrence \u2014 OSHA 30-Hour Certified safety compliance consultant based in Kernersville, NC \u2014 walks every area of your facility. He photographs findings, documents each one against the applicable CFR standard, and estimates the penalty exposure per finding. Within 48 hours you receive a written report with photo documentation, CFR citations, and a prioritized list of corrective actions. The engagement is private \u2014 findings are not shared, published, or referenced without written permission.",
  },
  {
    q: 'How do I prepare for an OSHA inspection in a small manufacturing plant?',
    a: "The most effective preparation is a third-party walkthrough before OSHA arrives. OSHA inspections are triggered by employee complaints, referrals, fatalities, or programmed inspections \u2014 they do not announce in advance. A GigLine Safety Walkthrough gives you a written report of what an inspector is likely to find, documented against the same standards OSHA uses. The walkthrough starts at $1,200. A single serious citation can cost up to $16,550.",
  },
  {
    q: 'What is a Compliance Readiness Visit?',
    a: "GigLine's most complete single engagement. Combines the Safety Walkthrough and Documentation Review in one on-site visit. One consolidated written report covering both physical findings and documentation gaps, with a prioritized corrective action plan. Starts at $2,000. Booking separately starts at $2,500. The combined visit covers both for less.",
  },
  {
    q: 'What is the difference between a Safety Walkthrough and a Compliance Readiness Visit?',
    a: "The Safety Walkthrough covers the physical floor \u2014 starts at $1,200, report in 48 hours. The CRV adds a full documentation review to the same visit \u2014 written programs, training records, HazCom binder, OSHA 300 log \u2014 starts at $2,000. If unsure, the walkthrough is the lower-barrier starting point.",
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
    a: "You have the written record of every hazard identified, every corrective action taken, and every training record reviewed. A documented corrective-action log may help show good-faith effort, which can matter during an OSHA inspection. Documentation is the single biggest factor in how an OSHA visit goes.",
  },
  {
    q: 'Do you offer follow-up walkthroughs for past clients?',
    a: "Yes. Follow-up walkthroughs for past clients are offered at a reduced rate. Ongoing support is also available through Quarterly Compliance Maintenance ($950/quarter) and the Annual Compliance Control Partner program ($12,000/year, which is $1,000/month equivalent, and includes two walkthroughs, four documentation reviews, quarterly review calls, and direct on-call access between visits).",
  },
  {
    q: 'How should I prepare for a safety walkthrough?',
    a: "Nothing special. Do not stage, clean up, or hide anything — the walkthrough is most valuable when the floor looks the way it normally does. Have your written safety programs, SDS binder, and training records accessible. A brief floor manager or supervisor introduction at the start helps.",
  },
  {
    q: 'How do I book a safety walkthrough with GigLine?',
    a: "Visit https://www.giglinecompliance.com/intake and fill the four-field form, or call (336) 329-8899 directly. You'll hear back within one business day with scheduling options and a confirmed price.",
  },
  {
    q: "What's actually delivered in a Compliance Readiness Visit?",
    a: "The Compliance Readiness Visit (from $2,000) is GigLine's most-requested engagement. You receive: (1) a full on-site walkthrough of the production floor, storage, chemical areas, and egress routes \u2014 2 to 4 hours depending on facility size; (2) a structured review of your written safety programs, training records, OSHA 300/300A/301 logs, inspection records, and SDS inventory using a 53-item checklist across 7 OSHA categories; (3) an 18-page CFR-cited audit report delivered within 48 hours; (4) a single compliance percentage score for floor and files combined; (5) a 90-day remediation tracker, pre-populated and ready to assign to supervisors; (6) a 'What to Say If OSHA Calls' guidance sheet; and (7) a 30-day check-in call. Fixed quote. Private engagement. No retainer.",
  },
  {
    q: "Who is the Annual Compliance Control Partner program designed for?",
    a: "The Annual Compliance Control Partner ($12,000/year, or $1,000/month equivalent) is designed for operations that want a compliance partner they can call \u2014 not just a one-time report. Best fit: facilities with 25+ employees, multiple shifts, or recurring customer-audit requirements where OSHA exposure is ongoing. The annual partnership includes two full Safety Walkthroughs per year, four Documentation Reviews per year, four Quarterly Review Calls (30 minutes each), OSHA 300A posting reminders, a pre-inspection readiness review (so you're not starting from zero if OSHA shows up), on-call access to Vince between visits, and an annual written management safety review. Standalone value of the scheduled services alone exceeds $7,600 \u2014 the partnership rate is $12,000 because it also includes the on-call relationship.",
  },
  {
    q: 'Can GigLine write the safety programs we are missing?',
    a: "Yes. The Document Development service writes the written programs your operation is missing or that the OSHA Documentation Readiness Review flagged as insufficient. Most-requested programs: Lockout/Tagout (LOTO) with machine-specific procedures, Hazard Communication (HazCom), PPE Hazard Assessment, and Emergency Action Plan (EAP). Pricing is quoted after a Documentation Readiness Review identifies which specific gaps exist \u2014 a single program starts at $350, LOTO with up to five machine-specific procedures starts at $650, and a full written program suite (5+ programs) starts at $2,000. The pricing model is fixed-quote, not hourly. Document Development is scoped to your actual gap list \u2014 GigLine does not sell a template suite that may or may not apply.",
  },
  {
    q: 'How does Quarterly Compliance Maintenance work?',
    a: "Quarterly Compliance Maintenance ($950/quarter) keeps the safety system current between annual walkthroughs. Each quarter GigLine performs a documentation review (training records, OSHA 300 log, written program review, SDS inventory check), a corrective action tracker review, and a brief site visit if any changes warrant one. The quarterly cadence keeps small documentation gaps from becoming citation-level exposures and ensures the system you paid to build does not decay between Annual Partner visits. It is the natural next step after the OSHA-Ready Control System buildout for operations that want ongoing accountability without the full Annual Partner commitment.",
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
      <section className="bg-[#0d1b2a] text-white py-16 md:py-24">
        <div className="container max-w-4xl">
          <p
            className="uppercase tracking-[3px] text-[#1a6fc4] mb-5"
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
            Cost, scope, timeline, and what actually happens when you book a GigLine walkthrough. If you don&apos;t see your question here, call (336) 329-8899 or email vince@giglinecompliance.com.
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
                  className="border border-[#dde3ea] rounded-xl bg-white overflow-hidden"
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
                      className="font-semibold text-[#0d1b2a] text-base md:text-lg leading-snug"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {f.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 mt-1 text-[#1a6fc4] transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <div
                      className="px-5 pb-5 md:px-6 md:pb-6 text-[#0d1b2a]/75 leading-relaxed text-sm md:text-base space-y-3"
                      data-testid={`faq-answer-${i}`}
                    >
                      {f.a.split('\n\n').map((para, j) => (
                        <p key={j}>{para}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-[#0d1b2a] text-white">
        <div className="container max-w-2xl text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Ready to schedule a walkthrough?
          </h2>
          <p className="text-white/55 mb-8 text-base md:text-lg">
            One on-site visit. A written report within 48 hours. Starting at $1,200.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/intake"
              className="inline-flex items-center justify-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1a6fc4]/20"
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
