import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertTriangle, FileText, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

/**
 * Reusable service landing page used by Forklift, LOTO, and OSHA Doc Review NC pages.
 * Each consumer passes a config object describing the service, target buyer, and findings.
 */

const NAVY = '#102A43';
const BLUE = '#2A52A0';
const GOLD = '#C9A84C';
const CREAM = '#F9F8F6';
const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

export const ServiceLandingPage = ({ config }) => {
  const {
    slug,
    seoTitle,
    seoDescription,
    eyebrow,
    headline,
    subhead,
    whoFor,
    commonFindings,
    whatReviewed,
    reportIncludes,
    cfrRef,
    priceFrom,
    ctaPath,
    canonical,
  } = config;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: seoTitle.split(' | ')[0],
    description: seoDescription,
    provider: { '@id': 'https://www.giglinecompliance.com/#business' },
    areaServed: { '@type': 'State', name: 'North Carolina' },
    serviceType: 'OSHA Compliance Consulting',
    offers: { '@type': 'Offer', priceCurrency: 'USD', price: priceFrom.replace(/[^\d]/g, '') },
    url: `https://www.giglinecompliance.com${canonical}`,
  };

  return (
    <main data-testid={`service-landing-${slug}`}>
      <SEO title={seoTitle} description={seoDescription} canonical={canonical} schema={schema} />

      {/* Hero */}
      <section className="pt-20 md:pt-24 pb-14 md:pb-20" style={{ background: NAVY }} data-testid={`${slug}-hero`}>
        <div className="container max-w-4xl">
          <p
            className="uppercase font-bold mb-4"
            style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.22em', color: GOLD }}
          >
            {eyebrow}
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-[50px] font-extrabold leading-[1.08] mb-6 tracking-tight text-white max-w-3xl"
            data-testid={`${slug}-headline`}
          >
            {headline}
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-[1.7] max-w-3xl mb-7">
            {subhead}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={ctaPath}
              className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded transition-colors text-white"
              style={{ background: BLUE, fontSize: '15px' }}
              data-testid={`${slug}-hero-cta`}
            >
              Request a Review <ArrowRight size={16} />
            </Link>
            <span className="text-sm text-white/55" style={mono}>
              {priceFrom} · Report in 48 hours
            </span>
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-14 md:py-20 bg-white" data-testid={`${slug}-who`}>
        <div className="container max-w-4xl">
          <p
            className="uppercase font-bold mb-3"
            style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.22em', color: GOLD }}
          >
            Who This Is For
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-7 leading-tight" style={{ color: NAVY, ...serif }}>
            {whoFor.title}
          </h2>
          <ul className="space-y-3 max-w-3xl">
            {whoFor.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] md:text-base leading-[1.7]" style={{ color: NAVY }}>
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#1f6b48' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Common findings */}
      <section className="py-14 md:py-20" style={{ background: CREAM }} data-testid={`${slug}-findings`}>
        <div className="container max-w-4xl">
          <p
            className="uppercase font-bold mb-3"
            style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.22em', color: GOLD }}
          >
            Common Findings
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-7 leading-tight" style={{ color: NAVY, ...serif }}>
            What GigLine sees in the field.
          </h2>
          <ul className="space-y-3 max-w-3xl">
            {commonFindings.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] md:text-base leading-[1.7]" style={{ color: NAVY }}>
                <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#8a6a18' }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What GigLine reviews + Report contents — two-column */}
      <section className="py-14 md:py-20 bg-white" data-testid={`${slug}-deliverables`}>
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div data-testid={`${slug}-reviewed`}>
              <p
                className="uppercase font-bold mb-3"
                style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.22em', color: GOLD }}
              >
                What GigLine Reviews
              </p>
              <h3 className="text-xl md:text-2xl font-bold mb-5 leading-tight" style={{ color: NAVY, ...serif }}>
                On-site, photographed, CFR-cited.
              </h3>
              <ul className="space-y-2.5">
                {whatReviewed.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[15px] leading-[1.6]" style={{ color: NAVY }}>
                    <span style={{ color: BLUE, fontWeight: 700, marginTop: '1px' }}>·</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-testid={`${slug}-report`}>
              <p
                className="uppercase font-bold mb-3"
                style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.22em', color: GOLD }}
              >
                What the Report Includes
              </p>
              <h3 className="text-xl md:text-2xl font-bold mb-5 leading-tight" style={{ color: NAVY, ...serif }}>
                Written, prioritized, signed.
              </h3>
              <ul className="space-y-2.5">
                {reportIncludes.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[15px] leading-[1.6]" style={{ color: NAVY }}>
                    <FileText size={15} className="flex-shrink-0 mt-1" style={{ color: BLUE }} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {cfrRef && (
            <p className="text-xs text-[#1C2B2B]/55 mt-10 italic max-w-3xl" style={mono}>
              Regulation reference: {cfrRef}
            </p>
          )}
        </div>
      </section>

      {/* Service area */}
      <section className="py-10 md:py-12" style={{ background: CREAM, borderTop: '1px solid rgba(28,43,43,0.08)', borderBottom: '1px solid rgba(28,43,43,0.08)' }} data-testid={`${slug}-area`}>
        <div className="container max-w-3xl text-center">
          <p className="text-sm leading-relaxed" style={{ color: '#1C2B2B', ...mono }}>
            <MapPin size={14} className="inline-block mr-1.5 -mt-0.5" />
            Serving NC Piedmont Triad &mdash; Kernersville, Winston-Salem, Greensboro, High Point, Burlington, Lexington, Thomasville, Salisbury, Statesville, Asheboro, and surrounding.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-14 md:py-20 bg-white" data-testid={`${slug}-cta`}>
        <div className="container max-w-2xl text-center">
          <p
            className="text-2xl md:text-3xl font-bold mb-6 leading-tight"
            style={{ color: NAVY, ...serif }}
          >
            {headline.includes('LOTO') || headline.includes('Lockout') ? 'Get the LOTO program reviewed before someone gets hurt.' : headline.includes('Forklift') ? 'Get the forklift program reviewed before OSHA does.' : 'Get the documentation reviewed before someone else asks for it.'}
          </p>
          <Link
            to={ctaPath}
            className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded transition-colors text-white"
            style={{ background: BLUE }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1F3F80')}
            onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
            data-testid={`${slug}-bottom-cta`}
          >
            Request a Review <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-[#1C2B2B]/50 mt-5" style={mono}>
            {priceFrom} · Findings in 48 hours · NC Piedmont Triad
          </p>
        </div>
      </section>
    </main>
  );
};

export default ServiceLandingPage;
