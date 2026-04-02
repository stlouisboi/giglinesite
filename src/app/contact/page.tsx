import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — GigLine Compliance',
  description:
    'Contact Vince Lawrence at GigLine Compliance to request a safety walkthrough, documentation review, or incident review. Serving the Triad and surrounding region.',
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-primary py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-accent text-xs font-bold tracking-widest uppercase mb-3">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Let&apos;s Talk About Your Operation
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xl">
            Fill out the form or reach out directly. I respond within one business day.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-secondary py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-primary mb-6">Contact Information</h2>

              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-primary/40 text-xs uppercase tracking-widest mb-1">Email</p>
                  <a
                    href="mailto:vince@giglinecompliance.com"
                    className="text-accent text-sm hover:text-accent/80 transition-colors font-medium"
                  >
                    vince@giglinecompliance.com
                  </a>
                </div>
                <div>
                  <p className="text-primary/40 text-xs uppercase tracking-widest mb-1">Phone</p>
                  <a
                    href="tel:3366714967"
                    className="text-primary text-sm hover:text-accent transition-colors font-medium"
                  >
                    336-671-4967
                  </a>
                </div>
                <div>
                  <p className="text-primary/40 text-xs uppercase tracking-widest mb-1">Website</p>
                  <span className="text-primary/70 text-sm">www.giglinecompliance.com</span>
                </div>
              </div>

              <div className="mt-8 bg-white border border-primary/10 rounded-lg p-5">
                <p className="text-primary font-semibold text-sm mb-2">Availability</p>
                <p className="text-primary/60 text-sm leading-relaxed">
                  Available for limited on-site days each month in the Triad and surrounding region.
                  Remote reviews available nationwide.
                </p>
              </div>

              <div className="mt-4 bg-white border border-primary/10 rounded-lg p-5">
                <p className="text-primary font-semibold text-sm mb-2">Response Time</p>
                <p className="text-primary/60 text-sm">
                  I respond to all inquiries within one business day.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-primary rounded-lg p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
