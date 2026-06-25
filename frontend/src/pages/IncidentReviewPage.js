import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, Clock, AlertTriangle, Search, FileWarning, ClipboardEdit, Target } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const SLUG = 'incident-review';
const INTAKE_HREF = `/intake?service=${SLUG}`;
const PHONE_HREF = 'tel:3363298899';
const BLUE = '#1a6fc4';
const NAVY = '#0d1b2a';
const GOLD = '#D4A93E';
const CREAM = '#f5f4f0';
const RED = '#dc2626';

const COVERAGE = [
  { icon: Search, title: 'Root Cause Analysis', body: 'A disciplined investigation focused on what actually caused the incident — not just what happened. Identifies contributing factors and systemic gaps, not just the immediate trigger.' },
  { icon: FileWarning, title: 'Regulatory Obligation Review', body: 'What do you have to report? To whom? By when? OSHA recordkeeping and reporting requirements are specific and time-sensitive. We clarify your obligations before you act.' },
  { icon: ClipboardEdit, title: 'Documentation Guidance', body: 'What to write down, what not to write down, and how to document the investigation in a way that demonstrates good-faith corrective action without creating additional liability.' },
  { icon: Target, title: 'Corrective Action Plan', body: 'A prioritized plan to address the root causes identified. Documented corrective action is your strongest defense if OSHA opens an investigation.' },
];

const Eyebrow = ({ children, color = BLUE, className = '' }) => (
  <p className={`uppercase font-bold mb-3 ${className}`} style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}>{children}</p>
);

const IncidentReviewPage = () => {
  return (
    <main data-testid="incident-review-page">
      <SEO
        title="Incident Review — Time-Sensitive | GigLine"
        description="Call GigLine before you file anything or talk to anyone after a workplace incident. Root cause analysis, regulatory obligation review, documentation guidance, and corrective action plan. Same-day response. Private engagement."
        canonical={`/services/${SLUG}`}
        schema={[
          { '@context': 'https://schema.org', '@type': 'Service', name: 'Incident Review', provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com', telephone: '+13363298899' }, areaServed: { '@type': 'State', name: 'North Carolina' }, offers: { '@type': 'Offer', priceCurrency: 'USD', description: 'Incident Review — fixed quote provided on the call. Same-day response.' }, description: 'Time-sensitive post-incident review covering root cause analysis, regulatory obligations, documentation guidance, and corrective action planning.' },
          { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' }, { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.giglinecompliance.com/services' }, { '@type': 'ListItem', position: 3, name: 'Incident Review', item: `https://www.giglinecompliance.com/services/${SLUG}` }] },
        ]}
      />

      {/* Hero — dark navy with RED urgency badge + red CTA, no pricing block */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20" style={{ background: NAVY }} data-testid="ir-hero">
        <div className="container max-w-6xl">
          {/* Time-Sensitive red badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md mb-6"
            style={{ background: 'rgba(220,38,38,0.10)', border: `1px solid ${RED}` }}
            data-testid="ir-urgency-badge"
          >
            <AlertTriangle size={14} style={{ color: '#fca5a5' }} strokeWidth={2.5} />
            <span className="uppercase font-bold" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.18em', color: '#fca5a5' }}>Time-Sensitive</span>
          </div>
          <Eyebrow color={GOLD}>Incident Review</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-5xl">
            <span className="block">Call GigLine before you</span>
            <span className="block" style={{ color: GOLD }}>file anything or talk to anyone.</span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-9 max-w-3xl">
            When something happens on your floor — an injury, a near-miss, an equipment failure — the next 24 hours matter more than most operators realize. What you say, what you document, and what you file can all be used against you. Get a clear picture of what happened and what your obligations are before you act.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors text-white"
              style={{ background: RED }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#b91c1c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
              data-testid="ir-cta-hero"
            >
              <Phone size={16} />Call or Text Now
            </a>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}><Clock size={14} />Same-day response</span>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}><Lock size={14} />Private engagement</span>
          </div>
        </div>
      </section>

      {/* What the Review Covers — 4 cards on white */}
      <section className="py-20 md:py-24 bg-white" data-testid="ir-coverage">
        <div className="container max-w-6xl">
          <Eyebrow>What the Review Covers</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight max-w-3xl" style={{ color: NAVY }}>
            Root cause. Regulatory exposure. Next steps.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {COVERAGE.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="rounded-xl p-7" style={{ background: CREAM, border: '1px solid #e8e5dd' }} data-testid={`ir-coverage-${i + 1}`}>
                  <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(26,111,196,0.10)', color: BLUE }}>
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h3 className="text-[16.5px] font-bold mb-2.5 leading-snug" style={{ color: NAVY }}>{c.title}</h3>
                  <p className="text-[14px] text-[#0d1b2a]/70 leading-[1.7]">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Most Operators Get Wrong — narrative section on cream */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="ir-wrong">
        <div className="container max-w-3xl">
          <Eyebrow color={RED}>What Most Operators Get Wrong</Eyebrow>
          <p className="text-2xl md:text-[28px] font-bold leading-[1.3] mb-7 tracking-tight" style={{ color: NAVY }}>
            The incident report you file in the first 24 hours becomes the foundation of any OSHA investigation that follows.
          </p>
          <p className="text-base md:text-lg text-[#0d1b2a]/75 leading-[1.85]">
            Statements made to coworkers, supervisors, or insurance adjusters before you understand your regulatory obligations can be used against you. The instinct to act quickly is right. The instinct to act <span className="italic font-semibold" style={{ color: NAVY }}>without guidance</span> is where most operations create additional exposure.
          </p>
        </div>
      </section>

      {/* Act Now — red urgent closing CTA */}
      <section className="py-20 md:py-24" style={{ background: NAVY }} data-testid="ir-closing">
        <div className="container max-w-3xl text-center">
          <Eyebrow color={RED}>Act Now</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 tracking-tight text-white">
            Call before you file anything.
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-[1.85] mb-10 max-w-2xl mx-auto">
            Incident review engagements are time-sensitive. Same-day response. Private engagement. Fixed quote provided on the call.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ background: RED }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#b91c1c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = RED)}
              data-testid="ir-bottom-cta-call"
            >
              <Phone size={18} />Call or Text Vince Now — (336) 329-8899
            </a>
          </div>
          <Link to={INTAKE_HREF} className="inline-block mt-6 text-white/60 hover:text-white text-sm transition-colors underline" data-testid="ir-bottom-form-link">
            Or submit a private intake form
          </Link>
        </div>
      </section>
    </main>
  );
};

export default IncidentReviewPage;
