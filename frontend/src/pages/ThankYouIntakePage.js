import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Download, ArrowRight, Phone, Mail } from 'lucide-react';
import SEO from '../components/SEO';

/*
  GL-WEB-013 — Thank You / Intake Confirmation Page
  Bookmarkable post-submit destination. Replaces the in-page confirmation
  pattern with a real URL so visitors can share / save the engagement link.
*/

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const BLUE = '#1F6FEB';
const mono = { fontFamily: "'JetBrains Mono', monospace" };
const heading = { fontFamily: "'Manrope', sans-serif" };

const ThankYouIntakePage = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token') || '';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F9FC' }}>
      <SEO
        title="Request Received | GigLine Safety & Compliance"
        description="Your intake has been received. Vince will be in touch within 1 business day."
        canonical="/thank-you-intake"
      />

      {/* Hero band */}
      <section style={{ backgroundColor: NAVY }} className="py-16 md:py-24">
        <div className="container max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-7"
            style={{ background: GOLD }}
          >
            <Check size={32} color={NAVY} strokeWidth={3} />
          </div>
          <p
            className="uppercase font-bold tracking-[3px] mb-4"
            style={{ ...mono, fontSize: '11px', color: GOLD }}
            data-testid="thankyou-kicker"
          >
            GigLine &middot; Request Received
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold leading-tight text-white mb-4"
            style={heading}
            data-testid="thankyou-headline"
          >
            We&rsquo;ve got it. Vince is on it.
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Your intake has been received. A confirmation has been sent to your inbox &mdash;
            check there for the 2026 Triad OSHA Field Manual and a link to your private engagement status page.
          </p>
        </div>
      </section>

      {/* What happens next */}
      <section className="py-14 md:py-20">
        <div className="container max-w-3xl mx-auto px-5 md:px-8">
          <p
            className="uppercase font-bold tracking-[3px] mb-3"
            style={{ ...mono, fontSize: '11px', color: BLUE }}
          >
            What Happens Next
          </p>
          <h2 className="text-2xl md:text-[28px] font-bold leading-tight mb-10" style={{ ...heading, color: NAVY }}>
            Three steps. One business day.
          </h2>

          <div className="space-y-8">
            <Step
              number="01"
              title="Vince reviews your intake"
              desc="Usually within a few hours. He scopes the engagement against your operation type, headcount, and what prompted you to reach out."
            />
            <Step
              number="02"
              title="You get a fixed quote"
              desc="Within one business day of your submission, Vince calls or emails you (whichever you selected) with a proposed scope and price. No retainer, no contract pressure."
            />
            <Step
              number="03"
              title="You confirm, we schedule"
              desc="Once you approve the quote, Vince schedules the walkthrough, review, or service start at a time that works for your operation."
            />
          </div>
        </div>
      </section>

      {/* CTA cards */}
      <section className="pb-16 md:pb-24">
        <div className="container max-w-3xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-5">
          {token && (
            <Link
              to={`/status/${token}`}
              className="block p-6 md:p-7 group transition-all hover:-translate-y-0.5"
              style={{
                background: 'white',
                border: '1px solid rgba(11,31,51,0.10)',
                boxShadow: '0 2px 12px rgba(11,31,51,0.05)',
              }}
              data-testid="thankyou-status-link"
            >
              <p
                className="uppercase font-bold tracking-[3px] mb-3"
                style={{ ...mono, fontSize: '10px', color: BLUE }}
              >
                Your Engagement
              </p>
              <h3 className="text-lg font-bold mb-2" style={{ ...heading, color: NAVY }}>
                View your status page
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(11,31,51,0.62)' }}>
                Bookmark this private link to track your engagement from intake to report delivery.
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: BLUE }}>
                Open status page
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )}

          <a
            href="/assets/gl-fm-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-6 md:p-7 group transition-all hover:-translate-y-0.5 ${!token ? 'md:col-span-2' : ''}`}
            style={{
              background: 'white',
              border: '1px solid rgba(11,31,51,0.10)',
              boxShadow: '0 2px 12px rgba(11,31,51,0.05)',
            }}
            data-testid="thankyou-field-manual"
          >
            <p
              className="uppercase font-bold tracking-[3px] mb-3"
              style={{ ...mono, fontSize: '10px', color: BLUE }}
            >
              Free &middot; 12-Page Reference
            </p>
            <h3 className="text-lg font-bold mb-2" style={{ ...heading, color: NAVY }}>
              2026 Triad OSHA Field Manual
            </h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(11,31,51,0.62)' }}>
              The 7 violations OSHA cites Piedmont Triad manufacturers for most often. CFR codes, penalty ranges, fixes.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: BLUE }}>
              <Download size={14} />
              Download the PDF
            </span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0F1A26' }}>
        <div className="container max-w-3xl mx-auto px-5 md:px-8 py-10 text-center">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Questions before we follow up?
          </p>
          <p className="mt-3 flex items-center justify-center gap-4 md:gap-6 flex-wrap">
            <a
              href="tel:3363298899"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:opacity-80 transition-opacity"
            >
              <Phone size={14} style={{ color: GOLD }} />
              (336) 329-8899
            </a>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>&middot;</span>
            <a
              href="mailto:vince@giglinecompliance.com"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:opacity-80 transition-opacity"
            >
              <Mail size={14} style={{ color: GOLD }} />
              vince@giglinecompliance.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

const Step = ({ number, title, desc }) => (
  <div className="flex items-start gap-5 md:gap-7">
    <span
      className="flex-shrink-0 text-2xl md:text-3xl font-bold leading-none"
      style={{ ...mono, color: GOLD }}
    >
      {number}
    </span>
    <div>
      <h3 className="text-lg md:text-xl font-bold leading-tight mb-1.5" style={{ ...heading, color: NAVY }}>
        {title}
      </h3>
      <p className="text-base leading-relaxed" style={{ color: 'rgba(11,31,51,0.65)' }}>
        {desc}
      </p>
    </div>
  </div>
);

export default ThankYouIntakePage;
