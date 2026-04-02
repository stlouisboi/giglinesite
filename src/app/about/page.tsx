import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — GigLine Compliance',
  description:
    'Vince Lawrence brings 25+ years of safety leadership, OSHA certification, and a U.S. Navy veteran background to small operations in the Triad and surrounding region.',
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">About</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Vince Lawrence
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-2xl">
            25+ years in safety leadership. OSHA 30-hour certified. U.S. Navy veteran.
            Founded GigLine Compliance to serve the small operations that get overlooked.
          </p>
        </div>
      </section>

      {/* Bio + Headshot */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Headshot placeholder */}
            <div className="lg:col-span-1">
              <div
                className="w-full aspect-square max-w-xs mx-auto lg:mx-0 bg-primary/10 border-2 border-accent/30 rounded-lg flex items-center justify-center text-center"
                aria-label="Headshot placeholder"
              >
                <div>
                  <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-primary/60 text-sm font-medium">Photo of Vince Lawrence</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2 flex flex-col gap-4 text-primary/80 text-sm leading-relaxed">
              <p>
                Vince Lawrence has spent more than 25 years working in and around safety — in manufacturing
                plants, warehouses, transportation operations, and contracting environments. He has held
                safety leadership roles across multiple industries, built programs from the ground up,
                and worked through the aftermath of incidents that could have been prevented.
              </p>
              <p>
                He is OSHA 30-hour certified in both General Industry and Construction, and holds the
                10-hour certification as well. His background spans the full range of what small
                operations deal with: hazard communication, machine guarding, lockout/tagout, powered
                industrial trucks, recordkeeping, and incident investigation.
              </p>
              <p>
                Before his career in safety, Vince served in the U.S. Navy. Military service instilled
                a standard that carried through everything that followed — precision, accountability,
                and no tolerance for things being out of standard.
              </p>
              <p>
                GigLine Compliance was founded to serve the businesses that don&apos;t have a full-time
                safety department. The small shop with 15 employees. The warehouse with 30 workers and
                a stack of old OSHA posters. The fleet operator who knows compliance is important
                but doesn&apos;t know where to start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The gig line story */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">The Name</h2>
          <div className="border-l-4 border-accent bg-accent/10 px-6 py-5 rounded-r mb-6">
            <p className="text-white/80 text-sm leading-relaxed italic">
              &ldquo;In the military, your gig line is the straight line between your shirt, belt,
              and fly. If it&apos;s off, you&apos;re out of standard. Inspectors notice. It costs you.
              Most small operations have the same problem with safety — something is off, and it&apos;s
              visible to anyone who knows what to look for. GigLine Compliance brings that same
              straight-line standard to safety and compliance for small operations.&rdquo;
            </p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            The gig line represents alignment. Everything in line, everything visible, nothing out of standard.
            That is the standard this work is built on.
          </p>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-8">Background & Credentials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Experience', value: '25+ years in safety leadership' },
              { label: 'Certification', value: 'OSHA 30-hour (General Industry & Construction)' },
              { label: 'Certification', value: 'OSHA 10-hour certified' },
              { label: 'Industries', value: 'Manufacturing, warehouse, transportation, contracting' },
              { label: 'Military', value: 'U.S. Navy veteran' },
              { label: 'Service area', value: 'Triad region (on-site) · Nationwide (remote)' },
            ].map((item) => (
              <div key={item.value} className="bg-white border border-primary/10 rounded p-4">
                <p className="text-primary/40 text-xs uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-primary font-semibold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LaunchPath reference */}
      <section className="bg-accent/10 border-y border-accent/20 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-3">LaunchPath Transportation EDU</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Vince is also affiliated with LaunchPath Transportation EDU, which provides foundational
            training and resources for carriers, fleet managers, and drivers. If your concern is
            on the transportation side, LaunchPath offers a free Ground 0 briefing as a starting point.
          </p>
          <a
            href="https://launchpathedu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-sm hover:text-accent/80 transition-colors"
          >
            Visit LaunchPath Transportation EDU ↗
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Find Your Gaps?</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Contact me to discuss your operation and which engagement makes sense.
            I respond within one business day.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 rounded transition-colors"
          >
            Request a Walkthrough or Review
          </Link>
        </div>
      </section>
    </>
  );
}
