import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import ContactMessageForm from '../components/ContactMessageForm';
import ScopeCallCTA from '../components/ScopeCallCTA';

const ContactPage = () => {
  return (
    <main data-testid="contact-page">
      <SEO 
        title="Contact"
        description="Contact GigLine Safety & Compliance. Request a walkthrough, documentation review, or incident response support. Vince Lawrence — (336) 329-8899."
        canonical="/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How quickly can you schedule a walkthrough?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Most walkthroughs can be scheduled within 1-2 weeks. For time-sensitive situations (pending audits, recent incidents), faster scheduling is often available."
              }
            },
            {
              "@type": "Question",
              "name": "Do you work outside of North Carolina?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Remote documentation reviews are available nationwide. On-site walkthroughs outside the Triad area may incur travel costs."
              }
            },
            {
              "@type": "Question",
              "name": "What if I'm not sure which service I need?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Describe your situation and Vince will recommend the right approach. No pressure, no sales pitch — just honest guidance."
              }
            }
          ]
        }}
      />
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="contact-headline">
              Tell Me About Your Operation.
            </h1>
            <p className="text-lg text-white/90">
              One line is all it takes to start the conversation. Describe what you're running, and I'll tell you what makes sense.
            </p>
          </div>
        </div>
      </section>

      {/* Quick-Action CTA Block (GL-WEB-021) */}
      <section className="py-12 md:py-14" style={{ backgroundColor: '#FBFBF9', borderBottom: '1px solid rgba(28,43,43,0.08)' }} data-testid="contact-quick-actions">
        <div className="container max-w-5xl">
          <p
            className="text-base md:text-lg leading-[1.7] text-[#1C2B2B]/85 mb-3 max-w-3xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <strong className="text-[#1C2B2B]">Request a walkthrough or ask a question first.</strong>
          </p>
          <p className="text-sm md:text-base leading-[1.7] text-[#1C2B2B]/65 mb-7 max-w-3xl">
            GigLine serves small manufacturers, warehouses, contractors, and fleet operations within roughly 60 miles of Winston-Salem. Most walkthroughs are scheduled during normal business hours. Reports delivered within 24&ndash;48 hours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <a
              href="tel:3363298899"
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded transition-colors font-semibold text-white text-[15px]"
              style={{ background: '#102A43', border: '1px solid #C9A84C' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#152538')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2A52A0')}
              data-testid="contact-cta-call"
            >
              <Phone size={17} /> Call Vince
            </a>
            <a
              href="mailto:vince@giglinecompliance.com"
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded transition-colors font-semibold text-white text-[15px]"
              style={{ background: '#102A43', border: '1px solid #C9A84C' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#152538')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2A52A0')}
              data-testid="contact-cta-email"
            >
              <Mail size={17} /> Email Vince
            </a>
            <Link
              to="/intake"
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded transition-colors font-bold text-[#1C2B2B] text-[15px]"
              style={{ background: '#C9A84C', border: '1px solid #C9A84C' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#bf962f')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#C9A84C')}
              data-testid="contact-cta-walkthrough"
            >
              Request Walkthrough <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* What happens after you send this — 3-step process */}
      <section className="py-12 md:py-16 bg-secondary" data-testid="contact-process-block">
        <div className="container max-w-5xl">
          <p
            className="text-xs font-semibold tracking-widest uppercase text-primary/60 text-center mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}
          >
            What happens after you send this
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10">
            A short, honest process.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                label: 'Vince reads it personally',
                copy: 'Every message goes directly to Vince. No intake team, no auto-routing.',
              },
              {
                n: '02',
                label: 'You get a plain answer',
                copy: "Within one business day: what makes sense for your operation, what it costs, and whether a walkthrough is the right move.",
              },
              {
                n: '03',
                label: "No commitment until you're ready",
                copy: 'Nothing gets scheduled until you say so. The first conversation is just a conversation.',
              },
            ].map((s) => (
              <div
                key={s.n}
                className="bg-white rounded-lg p-7 shadow-sm border border-primary/5 hover:border-accent/40 transition-colors"
                data-testid={`contact-process-step-${s.n}`}
              >
                <p
                  className="text-3xl md:text-4xl font-extrabold mb-4"
                  style={{ color: '#C9A84C', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {s.n}
                </p>
                <h3 className="font-bold text-primary text-base mb-2 leading-snug">
                  {s.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-primary mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <a
                  href="mailto:vince@giglinecompliance.com"
                  className="flex items-start gap-4 group"
                  data-testid="contact-page-email"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Mail size={24} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-primary group-hover:text-accent transition-colors text-sm sm:text-base break-all">
                      vince@giglinecompliance.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+13363298899"
                  className="flex items-start gap-4 group"
                  data-testid="contact-page-phone"
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Phone size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-primary group-hover:text-accent transition-colors">
                      (336) 329-8899
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-primary">
                      Kernersville, NC
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Serving the Triad and surrounding region
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Note */}
              <div className="mt-8 bg-secondary rounded-lg p-6" data-testid="availability-note">
                <div className="flex items-start gap-3">
                  <Clock size={24} className="text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Availability</h3>
                    <p className="text-sm text-muted-foreground">
                      Available for limited on-site days each month in the Triad and surrounding region. 
                      Remote reviews available nationwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-6 p-4 border border-accent/30 rounded-lg bg-accent/5">
                <p className="text-sm text-primary">
                  <strong>Response time:</strong> I respond to all inquiries within one business day. 
                  For urgent incidents, note that in your message.
                </p>
              </div>

              {/* Veteran-Owned trust badge */}
              <div className="mt-8 flex flex-col items-start" data-testid="contact-veteran-badge-block">
                <img
                  src="/assets/veteran-owned-badge.webp"
                  alt="Veteran-Owned Company"
                  width="200"
                  height="128"
                  loading="lazy"
                  className="rounded-sm"
                  style={{ maxWidth: '200px', height: 'auto' }}
                  data-testid="contact-veteran-badge"
                />
                <p className="mt-3 text-xs text-[#1C2B2B]/60 leading-relaxed">
                  U.S. Navy veteran-owned &amp; operated. Founded by <strong>Vince Lawrence</strong>.
                </p>
              </div>
            </div>

            {/* GL-WEB-024 — Simple Contact Form + Calendly Scope Call CTA, stacked. */}
            <div className="lg:col-span-2 space-y-6">
              <ContactMessageForm />

              <ScopeCallCTA />

              <p className="text-sm text-[#1C2B2B]/60 leading-relaxed" data-testid="contact-full-intake-fallback">
                Ready for a full engagement? Share operation type, headcount, machine count, and deadlines using the{' '}
                <Link
                  to="/intake"
                  className="font-semibold text-[#2A52A0] hover:text-[#1C2B2B] underline underline-offset-4 transition-colors"
                >
                  full intake form &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
            Common Questions
          </h2>
          <div className="max-w-3xl mx-auto grid gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm" data-testid="faq-1">
              <h3 className="font-semibold text-primary mb-2">
                How quickly can you schedule a walkthrough?
              </h3>
              <p className="text-muted-foreground">
                Most walkthroughs can be scheduled within 1-2 weeks. For time-sensitive situations 
                (pending audits, recent incidents), I can often accommodate faster.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm" data-testid="faq-2">
              <h3 className="font-semibold text-primary mb-2">
                Do you work outside of North Carolina?
              </h3>
              <p className="text-muted-foreground">
                Remote documentation reviews are available nationwide. On-site walkthroughs outside 
                the Triad area may incur travel costs. Contact me to discuss your location.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm" data-testid="faq-3">
              <h3 className="font-semibold text-primary mb-2">
                What if I'm not sure which service I need?
              </h3>
              <p className="text-muted-foreground">
                No problem. Describe your situation in the form and I'll recommend the right approach. 
                No pressure, no sales pitch — just honest guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
