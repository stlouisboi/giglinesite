import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

const whoIWorkWith = [
  { title: 'Small Manufacturers & Fabrication Shops', icon: '🏭' },
  { title: 'Warehouses & Distribution Centers', icon: '📦' },
  { title: 'Contractors & Maintenance Operations', icon: '🔧' },
  { title: 'Trucking Fleets 5–25 Trucks', icon: '🚛' },
];

const offers = [
  {
    number: '01',
    title: 'Safety Walkthrough & Top 10 Fixes Report',
    price: 'Starting at $650–$750',
    deliverables: [
      'On-site safety walkthrough',
      'Written Top 10 Fixes Report',
      'Priority ranking by severity',
      'Verbal debrief after walkthrough',
    ],
  },
  {
    number: '02',
    title: 'Safety Documentation Review & Gap Check',
    price: 'Starting at $550 remote / $750 on-site',
    deliverables: [
      'Review of safety programs and records',
      'Gap analysis against OSHA standards',
      'Written summary of deficiencies',
      'Recommendations for immediate corrections',
    ],
  },
  {
    number: '03',
    title: 'Incident Review & Corrective Action Support',
    price: 'Starting at $900–$1,500',
    deliverables: [
      'Review of incident facts and documentation',
      'Root cause analysis',
      'Written corrective action plan',
      'Guidance on OSHA recordkeeping requirements',
    ],
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Your Operation Has Gaps.<br />
            Find Them Before OSHA Does.
          </h1>
          <p className="text-lg text-white/75 leading-relaxed max-w-2xl mb-8">
            Safety walkthroughs, documentation reviews, and incident response for small shops,
            warehouses, fleets, and contractors. One engagement. A written report. A clear list
            of what to fix first.
          </p>

          {/* Military origin callout */}
          <div className="border-l-4 border-accent bg-accent/10 px-6 py-5 rounded-r mb-10 max-w-2xl">
            <p className="text-white/80 text-sm leading-relaxed italic">
              &ldquo;In the military, your gig line is the straight line between your shirt, belt,
              and fly. If it&apos;s off, you&apos;re out of standard. GigLine Compliance brings that
              same straight-line standard to safety and compliance for small operations.&rdquo;
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 rounded text-base transition-colors"
          >
            Request a Walkthrough or Review
          </Link>

          {/* Trust bar */}
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/50">
            <span>✓ 25+ Years Safety Leadership</span>
            <span>✓ OSHA 30-Hour Certified</span>
            <span>✓ U.S. Navy Veteran</span>
          </div>
        </div>
      </section>

      {/* Who I Work With */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-2">Who I Work With</h2>
          <p className="text-primary/60 text-sm mb-10">
            Small operations with real exposure — and not enough time to find it on their own.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whoIWorkWith.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-primary/10 rounded-lg p-6 shadow-sm"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-primary font-semibold text-sm leading-snug">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Offers */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">What I Offer</h2>
          <p className="text-white/50 text-sm mb-10">Three flat-fee engagements. No retainers. No surprises.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.number}
                className="border border-accent/30 rounded-lg p-6 flex flex-col"
              >
                <p className="text-accent text-xs font-bold tracking-widest mb-3">OFFER {offer.number}</p>
                <h3 className="text-white font-bold text-lg leading-snug mb-3">{offer.title}</h3>
                <p className="text-accent text-sm font-semibold mb-4">{offer.price}</p>
                <ul className="flex-1 flex flex-col gap-2 mb-6">
                  {offer.deliverables.map((d) => (
                    <li key={d} className="text-white/70 text-sm flex gap-2">
                      <span className="text-accent mt-0.5 shrink-0">›</span>
                      {d}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="text-center border border-accent text-accent hover:bg-accent hover:text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
                >
                  Request This Service
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background / Why Bring Me In */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-6">Why Bring Me In</h2>
          <ul className="flex flex-col gap-3 mb-8">
            {[
              '25+ years of safety leadership across manufacturing, warehouse, and transportation',
              'OSHA 30-hour and 10-hour certified',
              'Background in manufacturing, warehouse, and transportation operations',
              'U.S. Navy veteran — built on discipline and straight-line standards',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-primary/80 text-sm">
                <span className="text-accent font-bold shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <blockquote className="border-l-4 border-accent pl-5 text-primary font-semibold text-lg leading-relaxed">
            &ldquo;I find what is exposed. I tell you exactly what to fix. You keep the liability off the floor.&rdquo;
          </blockquote>
          <p className="text-primary/50 text-sm mt-2">— Vince Lawrence, Founder</p>
        </div>
      </section>

      {/* For Carriers and Fleets */}
      <section className="bg-accent/10 border-y border-accent/20 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">For Carriers and Fleets</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xl mx-auto">
            If you operate trucks or manage drivers, the exposure starts before your first load moves.
            LaunchPath Transportation EDU offers foundational training resources — including a free
            Ground 0 briefing — to help carriers and fleet managers understand what they&apos;re
            up against before an audit or incident.
          </p>
          <a
            href="https://launchpathedu.com/ground-0-briefing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 rounded text-sm transition-colors"
          >
            Start with Ground 0 — Free ↗
          </a>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-primary py-16 px-4" id="contact">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Reach out with the form or contact me directly. I respond within one business day.
              </p>
              <div className="flex flex-col gap-3">
                <a href="mailto:vince@giglinecompliance.com" className="text-accent text-sm hover:text-accent/80 transition-colors">
                  vince@giglinecompliance.com
                </a>
                <a href="tel:3366714967" className="text-white/70 text-sm hover:text-white transition-colors">
                  336-671-4967
                </a>
                <p className="text-white/40 text-xs mt-2 leading-relaxed">
                  Available for limited on-site days each month in the Triad and surrounding region.
                  Remote reviews available nationwide.
                </p>
              </div>
            </div>
            <div>
              <ContactForm compact />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
