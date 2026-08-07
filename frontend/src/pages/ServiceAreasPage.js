import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

// Same metadata used by city pages — kept inline so this page stays self-contained
// and Google sees a real internal-linking hub for the 13 city URLs.
const SERVICE_AREAS = [
  { slug: 'kernersville',  name: 'Kernersville',  region: 'Forsyth County',    distance: 'GigLine HQ',                  price: 650 },
  { slug: 'winston-salem', name: 'Winston-Salem', region: 'Forsyth County',    distance: '10 miles from Kernersville',  price: 650 },
  { slug: 'high-point',    name: 'High Point',    region: 'Guilford County',   distance: '12 miles from Kernersville',  price: 650 },
  { slug: 'greensboro',    name: 'Greensboro',    region: 'Guilford County',   distance: '15 miles from Kernersville',  price: 650 },
  { slug: 'clemmons',      name: 'Clemmons',      region: 'Forsyth County',    distance: '15 miles from Kernersville',  price: 650 },
  { slug: 'thomasville',   name: 'Thomasville',   region: 'Davidson County',   distance: '15 miles from Kernersville',  price: 650 },
  { slug: 'lexington',     name: 'Lexington',     region: 'Davidson County',   distance: '20 miles from Kernersville',  price: 650 },
  { slug: 'mocksville',    name: 'Mocksville',    region: 'Davie County',      distance: '25 miles from Kernersville',  price: 650 },
  { slug: 'burlington',    name: 'Burlington',    region: 'Alamance County',   distance: '30 miles from Kernersville',  price: 650 },
  { slug: 'asheboro',      name: 'Asheboro',      region: 'Randolph County',   distance: '35 miles from Kernersville',  price: 750 },
  { slug: 'salisbury',     name: 'Salisbury',     region: 'Rowan County',      distance: '50 miles from Kernersville',  price: 750 },
  { slug: 'charlotte',     name: 'Charlotte',     region: 'Mecklenburg County',distance: '75 miles from Kernersville',  price: null },
  { slug: 'raleigh',       name: 'Raleigh',       region: 'Wake County',       distance: '75 miles from Kernersville',  price: null },
];

const ServiceAreasPage = () => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: 'https://www.giglinecompliance.com/' },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: 'https://www.giglinecompliance.com/service-areas' },
    ],
  };

  return (
    <main data-testid="service-areas-page">
      <SEO
        title="Service Areas — NC Safety Walkthroughs | GigLine Safety & Compliance"
        description="GigLine provides on-site OSHA safety walkthroughs across 13 North Carolina cities — Kernersville, Winston-Salem, Greensboro, High Point, Burlington and more. Find your city."
        canonical="/service-areas"
        schema={breadcrumbSchema}
      />

      {/* Hero */}
      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-4xl">
          <p
            className="uppercase tracking-[3px] text-[#2A52A0] mb-5"
            style={{ ...mono, fontSize: '11px' }}
            data-testid="service-areas-kicker"
          >
            Service Areas
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={serif}
            data-testid="service-areas-headline"
          >
            On-site safety walkthroughs across North Carolina.
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-2xl leading-relaxed">
            Based in Kernersville, NC. Routine engagements within 60 miles of Winston-Salem, with scheduled engagements available in the Charlotte and Raleigh metros. Pick your city for local detail and pricing.
          </p>
        </div>
      </section>

      {/* Tier 1 — Triad core */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="container max-w-5xl">
          <p
            className="uppercase tracking-[3px] text-[#2A52A0] mb-3"
            style={{ ...mono, fontSize: '11px' }}
          >
            Triad Core — Starting at $1,300
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8"
            style={serif}
          >
            Within 30 miles of Kernersville
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_AREAS.filter((c) => c.price === 650).map((city) => (
              <Link
                key={city.slug}
                to={`/safety-walkthrough/${city.slug}`}
                className="group block bg-white rounded-lg border border-[#2A52A0]/10 hover:border-[#2A52A0] p-5 transition-colors"
                data-testid={`area-link-${city.slug}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3
                      className="font-semibold text-[#1C2B2B] text-lg leading-snug"
                      style={serif}
                    >
                      {city.name}
                    </h3>
                    <p className="text-xs text-[#1C2B2B]/50 mt-1">{city.region}</p>
                  </div>
                  <MapPin size={16} className="text-[#2A52A0] flex-shrink-0 mt-1" />
                </div>
                <p className="text-xs text-[#1C2B2B]/65 mt-3">{city.distance}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2A52A0] group-hover:gap-2 transition-all">
                  View details
                  <ArrowRight size={14} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tier 2 — Outer */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-5xl">
          <p
            className="uppercase tracking-[3px] text-[#2A52A0] mb-3"
            style={{ ...mono, fontSize: '11px' }}
          >
            Outer Tier — Starting at $1,300 + travel fee
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8"
            style={serif}
          >
            30–60 miles from Kernersville (travel included)
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {SERVICE_AREAS.filter((c) => c.price === 750).map((city) => (
              <Link
                key={city.slug}
                to={`/safety-walkthrough/${city.slug}`}
                className="group block bg-[#F9F8F6] rounded-lg border border-[#2A52A0]/10 hover:border-[#2A52A0] p-5 transition-colors"
                data-testid={`area-link-${city.slug}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3
                      className="font-semibold text-[#1C2B2B] text-lg leading-snug"
                      style={serif}
                    >
                      {city.name}
                    </h3>
                    <p className="text-xs text-[#1C2B2B]/50 mt-1">{city.region}</p>
                  </div>
                  <MapPin size={16} className="text-[#2A52A0] flex-shrink-0 mt-1" />
                </div>
                <p className="text-xs text-[#1C2B2B]/65 mt-3">{city.distance}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2A52A0] group-hover:gap-2 transition-all">
                  View details
                  <ArrowRight size={14} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tier 3 — Scheduled metros */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="container max-w-5xl">
          <p
            className="uppercase tracking-[3px] text-[#2A52A0] mb-3"
            style={{ ...mono, fontSize: '11px' }}
          >
            Scheduled Engagements
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-3"
            style={serif}
          >
            Charlotte and Raleigh metros
          </h2>
          <p className="text-[#1C2B2B]/65 mb-8 max-w-2xl text-sm md:text-base leading-relaxed">
            Charlotte and Raleigh area walkthroughs are available on a scheduled basis. Contact directly to confirm availability and pricing — travel considerations apply.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
            {SERVICE_AREAS.filter((c) => c.price === null).map((city) => (
              <Link
                key={city.slug}
                to={`/safety-walkthrough/${city.slug}`}
                className="group block bg-white rounded-lg border border-[#2A52A0]/10 hover:border-[#2A52A0] p-5 transition-colors"
                data-testid={`area-link-${city.slug}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3
                      className="font-semibold text-[#1C2B2B] text-lg leading-snug"
                      style={serif}
                    >
                      {city.name}
                    </h3>
                    <p className="text-xs text-[#1C2B2B]/50 mt-1">{city.region}</p>
                  </div>
                  <MapPin size={16} className="text-[#2A52A0] flex-shrink-0 mt-1" />
                </div>
                <p className="text-xs text-[#1C2B2B]/65 mt-3">{city.distance}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2A52A0] group-hover:gap-2 transition-all">
                  View details
                  <ArrowRight size={14} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Outside service area note + CTA */}
      <section className="py-16 md:py-20 bg-[#102A43] text-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={serif}>
            Operation outside these cities?
          </h2>
          <p className="text-white/55 mb-8 text-base md:text-lg leading-relaxed">
            Travel engagements beyond 60 miles are available case-by-case. Call directly and I'll let you know if it makes sense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/intake"
              className="inline-flex items-center justify-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#2A52A0]/20"
              data-testid="service-areas-cta-primary"
            >
              Request a Walkthrough
              <ArrowRight size={18} />
            </Link>
            <a
              href="tel:3363298899"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-semibold px-6 py-4 rounded transition-colors"
              data-testid="service-areas-cta-call"
            >
              Call (336) 329-8899
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServiceAreasPage;
