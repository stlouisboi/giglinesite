import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services — GigLine Compliance',
  description:
    'Three flat-fee safety engagements: Safety Walkthrough & Top 10 Fixes Report, Documentation Review & Gap Check, and Incident Review & Corrective Action Support.',
};

const services = [
  {
    number: '01',
    title: 'Safety Walkthrough & Top 10 Fixes Report',
    price: 'Starting at $650–$750',
    summary:
      'An on-site visit where I walk your facility, identify your top hazards, and hand you a written report you can act on immediately. No fluff — a numbered list ranked by severity, with clear language about what to fix first.',
    deliverables: [
      'On-site safety walkthrough of your facility or operation',
      'Written Top 10 Fixes Report delivered within 2–3 business days',
      'Priority ranking by severity (immediate, short-term, long-term)',
      'Verbal debrief after the walkthrough',
      'Plain-language explanations — no OSHA jargon without context',
    ],
    bestFor: 'Operations that have never had a formal safety review, or those preparing for an OSHA inspection.',
  },
  {
    number: '02',
    title: 'Safety Documentation Review & Gap Check',
    price: 'Starting at $550 remote / $750 on-site',
    summary:
      'I review your existing safety programs, records, and documentation against OSHA standards and tell you exactly where you have gaps. Available remotely or on-site.',
    deliverables: [
      'Review of safety programs, written plans, and records',
      'Gap analysis against applicable OSHA standards',
      'Written summary of deficiencies with citations',
      'Recommendations for immediate corrections',
      'Prioritized action list by risk level',
    ],
    bestFor: 'Operations with some documentation in place that want to know what is missing before an audit.',
  },
  {
    number: '03',
    title: 'Incident Review & Corrective Action Support',
    price: 'Starting at $900–$1,500',
    summary:
      'After a workplace incident, you need to understand what happened, document it correctly, and demonstrate that you are fixing the root cause. I work through the facts with you and produce a corrective action plan.',
    deliverables: [
      'Review of incident facts, witness statements, and documentation',
      'Root cause analysis using a structured methodology',
      'Written corrective action plan',
      'Guidance on OSHA recordkeeping requirements (300 log, 301)',
      'Support for written response to any regulatory inquiry',
    ],
    bestFor: 'Operations that have had a recordable incident, near-miss, or received an OSHA citation.',
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">Services</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Three Engagements. A Written Deliverable. A Clear Next Step.
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl">
            Every engagement produces something written that you can act on. No open-ended retainers.
            No guessing what you are paying for. Flat fee, defined scope, delivered output.
          </p>
        </div>
      </section>

      {/* Services detail */}
      {services.map((service, i) => (
        <section
          key={service.number}
          className={`py-16 px-4 ${i % 2 === 0 ? 'bg-secondary' : 'bg-white'}`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3">
                <p className="text-accent text-xs font-bold tracking-widest uppercase mb-2">
                  Offer {service.number}
                </p>
                <h2 className="text-2xl font-bold text-primary mb-2">{service.title}</h2>
                <p className="text-accent font-semibold text-sm mb-4">{service.price}</p>
                <p className="text-primary/70 text-sm leading-relaxed mb-6">{service.summary}</p>
                <Link
                  href="/contact"
                  className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-3 rounded text-sm transition-colors"
                >
                  Request This Service
                </Link>
              </div>
              <div className="lg:col-span-2">
                <p className="text-primary/40 text-xs uppercase tracking-widest mb-3 font-semibold">
                  What you receive
                </p>
                <ul className="flex flex-col gap-3 mb-6">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex gap-2 text-primary/80 text-sm">
                      <span className="text-accent shrink-0 mt-0.5">›</span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="bg-primary/5 border border-primary/10 rounded p-4">
                  <p className="text-primary/50 text-xs uppercase tracking-widest mb-1 font-semibold">Best for</p>
                  <p className="text-primary/70 text-sm leading-relaxed">{service.bestFor}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Not Sure Which One Fits?</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Reach out and describe your operation. I will tell you which engagement makes sense
            and what it will cost. No obligation.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 rounded transition-colors"
          >
            Contact Me
          </Link>
        </div>
      </section>
    </>
  );
}
