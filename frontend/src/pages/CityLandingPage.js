import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const CITIES = {
  'winston-salem': {
    name: 'Winston-Salem',
    region: 'Forsyth County',
    distance: '10 miles from our base in Kernersville',
    industries: 'manufacturing plants, food processing facilities, and distribution centers',
    seoTitle: 'Safety Walkthroughs in Winston-Salem, NC',
    seoDesc: 'On-site OSHA safety walkthroughs for manufacturers, warehouses, and contractors in Winston-Salem, NC. Written report with findings. Starting at $1,200.',
  },
  'greensboro': {
    name: 'Greensboro',
    region: 'Guilford County',
    distance: '15 miles from our base in Kernersville',
    industries: 'warehouses, light manufacturing, and logistics operations',
    seoTitle: 'Safety Walkthroughs in Greensboro, NC',
    seoDesc: 'OSHA safety walkthroughs and compliance support for small operations in Greensboro, NC. One visit. Clear findings. Starting at $1,200.',
  },
  'charlotte': {
    name: 'Charlotte',
    region: 'Mecklenburg County',
    distance: '75 miles from our base in Kernersville',
    industries: 'manufacturing, construction contractors, and warehouse operations',
    seoTitle: 'Safety Walkthroughs in Charlotte, NC',
    seoDesc: 'Safety walkthrough services for manufacturers, warehouses, and contractors in the Charlotte, NC metro area. Written report. Starting at $1,200.',
  },
  'raleigh': {
    name: 'Raleigh',
    region: 'Wake County',
    distance: '75 miles from our base in Kernersville',
    industries: 'growing manufacturing operations, warehouse facilities, and construction sites',
    seoTitle: 'Safety Walkthroughs in Raleigh, NC',
    seoDesc: 'On-site safety walkthroughs for small operations in Raleigh and the Triangle area. Identify OSHA exposure before it becomes a citation. Starting at $1,200.',
  },
  'high-point': {
    name: 'High Point',
    region: 'Guilford County',
    distance: '12 miles from our base in Kernersville',
    industries: 'furniture manufacturing, warehousing, and small fabrication shops',
    seoTitle: 'Safety Walkthroughs in High Point, NC',
    seoDesc: 'Safety walkthrough services for manufacturers and warehouses in High Point, NC. Written findings report. Starting at $1,200.',
  },
  'burlington': {
    name: 'Burlington',
    region: 'Alamance County',
    distance: '30 miles from our base in Kernersville',
    industries: 'textile operations, small manufacturers, and distribution facilities',
    seoTitle: 'Safety Walkthroughs in Burlington, NC',
    seoDesc: 'OSHA safety walkthroughs for small manufacturers and warehouses in Burlington, NC. One visit. Written report. Starting at $1,200.',
  },
  'kernersville': {
    name: 'Kernersville',
    region: 'Forsyth County',
    distance: 'this is our home base',
    industries: 'manufacturing, light industrial operations, and warehousing',
    seoTitle: 'Safety Walkthroughs in Kernersville, NC',
    seoDesc: "On-site OSHA safety walkthroughs for Kernersville manufacturers, warehouses, and contractors. GigLine's home base. Written report. Starting at $1,200.",
    priceStart: 1200,
  },
  'lexington': {
    name: 'Lexington',
    region: 'Davidson County',
    distance: '20 miles from our base in Kernersville',
    industries: 'furniture manufacturing, food production, and small fabrication shops',
    seoTitle: 'Safety Walkthroughs in Lexington, NC',
    seoDesc: 'On-site OSHA safety walkthroughs for manufacturers and fabrication shops in Lexington, NC. Written report with findings. Starting at $1,200.',
    priceStart: 1200,
  },
  'thomasville': {
    name: 'Thomasville',
    region: 'Davidson County',
    distance: '15 miles from our base in Kernersville',
    industries: 'furniture manufacturing, cabinetry, and small production operations',
    seoTitle: 'Safety Walkthroughs in Thomasville, NC',
    seoDesc: 'OSHA safety walkthroughs for furniture manufacturers and small production operations in Thomasville, NC. Written report. Starting at $1,200.',
    priceStart: 1200,
  },
  'clemmons': {
    name: 'Clemmons',
    region: 'Forsyth County',
    distance: '15 miles from our base in Kernersville',
    industries: 'small manufacturers, trade contractors, and light industrial operations',
    seoTitle: 'Safety Walkthroughs in Clemmons, NC',
    seoDesc: 'On-site OSHA safety walkthroughs for small manufacturers and contractors in Clemmons, NC. Written report with findings. Starting at $1,200.',
    priceStart: 1200,
  },
  'mocksville': {
    name: 'Mocksville',
    region: 'Davie County',
    distance: '25 miles from our base in Kernersville',
    industries: 'manufacturing, agricultural operations, and small fabrication shops',
    seoTitle: 'Safety Walkthroughs in Mocksville, NC',
    seoDesc: 'OSHA safety walkthroughs for manufacturers and fabrication shops in Mocksville, NC and Davie County. Written report. Starting at $1,200.',
    priceStart: 1200,
  },
  'salisbury': {
    name: 'Salisbury',
    region: 'Rowan County',
    distance: '50 miles from our base in Kernersville',
    industries: 'manufacturing plants, distribution centers, and industrial operations',
    seoTitle: 'Safety Walkthroughs in Salisbury, NC',
    seoDesc: 'On-site OSHA safety walkthroughs for manufacturers and distribution centers in Salisbury, NC. Written report with findings. Starting at $1,200 + travel fee.',
    priceStart: 1200,
    travelNote: true,
  },
  'asheboro': {
    name: 'Asheboro',
    region: 'Randolph County',
    distance: '35 miles from our base in Kernersville',
    industries: 'manufacturing, metal fabrication, and distribution operations',
    seoTitle: 'Safety Walkthroughs in Asheboro, NC',
    seoDesc: 'OSHA safety walkthroughs for manufacturers and fabrication operations in Asheboro, NC. Written report with findings. Starting at $1,200 + travel fee.',
    priceStart: 1200,
    travelNote: true,
  },
};

const CityLandingPage = () => {
  const { city } = useParams();
  const data = CITIES[city];

  if (!data) return <Navigate to="/services" replace />;

  const priceStart = data.priceStart || 1200;
  const priceRangeTop = 2000;
  const priceStartLabel = data.travelNote ? `$1,200 + travel fee` : `$${priceStart.toLocaleString()}`;
  const priceRangeLabel = `$${priceStart.toLocaleString()}–$${priceRangeTop.toLocaleString()}`;

  const cityFaqs = [
    {
      q: `How much does a safety walkthrough cost in ${data.name}, NC?`,
      a: `Safety walkthroughs for ${data.name}-area operations start at ${priceStartLabel}. Most small operations fall in the ${priceRangeLabel} range depending on square footage and scope. You'll receive a fixed quote before scheduling.${data.travelNote ? ` ${data.name} is outside the Triad core, so a travel fee applies in addition to the base walkthrough price.` : ''}`,
    },
    {
      q: `How quickly can GigLine get on-site in ${data.name}?`,
      a: `${data.name} is ${data.distance}, so most walkthroughs are scheduled within 5–10 business days of the initial request. Urgent or post-incident visits can often be scheduled the same week.`,
    },
    {
      q: `What kind of operations does GigLine walk through in ${data.name}?`,
      a: `${data.industries.charAt(0).toUpperCase() + data.industries.slice(1)}. Typical client size is 5 to 100 employees — operations without a full-time safety manager that need a trained outside eye on the floor.`,
    },
    {
      q: `Will findings from my ${data.name} walkthrough be reported to OSHA?`,
      a: `No. The engagement is private. The only deliverable is the written report handed to you — nothing is shared with OSHA, insurance carriers, or any third party.`,
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Safety Walkthrough in ${data.name}, NC`,
    "description": data.seoDesc,
    "provider": {
      "@type": "LocalBusiness",
      "name": "GigLine Safety & Compliance",
      "telephone": "+13363298899",
      "address": { "@type": "PostalAddress", "addressLocality": "Kernersville", "addressRegion": "NC", "postalCode": "27107" },
    },
    "areaServed": { "@type": "City", "name": data.name, "containedInPlace": { "@type": "State", "name": "North Carolina" } },
    "offers": { "@type": "Offer", "price": String(priceStart), "priceCurrency": "USD" }
  };

  const cityFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": cityFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.giglinecompliance.com/" },
      { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.giglinecompliance.com/services" },
      { "@type": "ListItem", "position": 3, "name": `Safety Walkthrough — ${data.name}, NC`, "item": `https://www.giglinecompliance.com/safety-walkthrough/${city}` },
    ]
  };

  return (
    <main data-testid={`city-page-${city}`}>
      <SEO
        title={data.seoTitle}
        description={data.seoDesc}
        canonical={`/safety-walkthrough/${city}`}
        schema={[serviceSchema, cityFaqSchema, breadcrumbSchema]}
      />

      {/* Hero */}
      <section className="bg-[#0d1b2a] text-white py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={16} className="text-[#1a6fc4]" />
            <p className="uppercase tracking-[3px] text-[#1a6fc4]" style={{ ...mono, fontSize: '11px' }}>
              {data.name}, NC — {data.region}
            </p>
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            <span className="inline-flex items-center gap-4 flex-wrap">
              <span>Safety Walkthroughs in {data.name}</span>
              <img
                src="/assets/carolina-built-badge.png"
                alt="Carolina-Built · Navy Veteran Owned · Kernersville NC"
                className="inline-block w-20 sm:w-24 lg:w-28 h-auto select-none align-middle"
                style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}
                loading="eager"
                data-testid="city-carolina-badge"
              />
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/55 max-w-2xl leading-relaxed mb-8">
            On-site OSHA safety walkthroughs for {data.industries} in {data.name} and {data.region}. I walk your floor, identify what's exposed, and deliver a written report with clear priorities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/request-walkthrough"
              className="inline-flex items-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1a6fc4]/20"
              data-testid="city-cta-primary"
            >
              Request a Walkthrough
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/safety-check"
              className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-semibold px-6 py-4 rounded transition-colors"
              data-testid="city-cta-secondary"
            >
              Take the Free Safety Check
            </Link>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="container max-w-4xl">
          <p className="uppercase tracking-[3px] text-[#1a6fc4] mb-4" style={{ ...mono, fontSize: '11px' }}>
            What You Get
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0d1b2a] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Every Walkthrough Produces a Written Report
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'On-site walkthrough of your operation (60–90 min)',
              'Photo-documented findings',
              'Risk-referenced observations',
              'Clear corrective actions with priorities',
              'Written report delivered in 24–48 hours',
              'No retainer — one engagement, one report',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check size={16} className="flex-shrink-0 mt-1 text-[#1a6fc4]" strokeWidth={2.5} />
                <p className="text-sm text-[#0d1b2a]/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Context */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl">
          <p className="uppercase tracking-[3px] text-[#1a6fc4] mb-4" style={{ ...mono, fontSize: '11px' }}>
            Local Service
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0d1b2a] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Serving {data.name} from Kernersville
          </h2>
          <div className="text-[#0d1b2a]/65 space-y-4 leading-relaxed">
            <p>
              GigLine Safety & Compliance is based in Kernersville, NC — {data.distance}. I serve {data.industries} across {data.region} and the surrounding Piedmont Triad area.
            </p>
            <p>
              Most {data.name} operations I walk into have the same issues: blocked electrical panels, missing training records, fire equipment that hasn't been inspected, and programs that exist on paper but aren't being followed on the floor.
            </p>
            <p className="font-medium text-[#0d1b2a]">
              A walkthrough finds what's actually exposed — before an inspector does.
            </p>
          </div>
        </div>
      </section>

      {/* City-specific FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-3xl">
          <p className="uppercase tracking-[3px] text-[#1a6fc4] mb-4" style={{ ...mono, fontSize: '11px' }}>
            Common Questions
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#0d1b2a] mb-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {data.name} Safety Walkthrough FAQ
          </h2>
          <div className="space-y-6" data-testid={`city-faq-${city}`}>
            {cityFaqs.map((f, i) => (
              <div key={i} className="border-l-2 border-[#1a6fc4]/30 pl-5">
                <h3
                  className="font-semibold text-[#0d1b2a] mb-2 text-base md:text-lg"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {f.q}
                </h3>
                <p className="text-sm md:text-base text-[#0d1b2a]/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-[#dde3ea]">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-[#1a6fc4] hover:text-[#1560ae] font-semibold text-sm"
              data-testid={`city-faq-more-${city}`}
            >
              See all 18 frequently asked questions
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 bg-[#0d1b2a] text-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Starting at {priceStartLabel}
          </h2>
          <p className="text-white/50 mb-8">
            Most walkthroughs for small operations in {data.name} fall between {priceRangeLabel} depending on size. You'll know your price before we schedule.
          </p>
          {data.travelNote && (
            <p className="text-white/50 mb-8 text-sm">
              {data.name} is {data.distance}. A travel fee applies in addition to the base walkthrough price &mdash; quoted before scheduling.
            </p>
          )}
          {(city === 'charlotte' || city === 'raleigh') && (
            <p className="text-white/50 mb-8">
              Charlotte and Raleigh area engagements are available on a scheduled basis. Contact to confirm availability and any applicable travel considerations before booking.
            </p>
          )}
          <Link
            to="/request-walkthrough"
            className="inline-flex items-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1a6fc4]/20"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
          <p className="mt-6 text-white/40 text-sm">
            Or call directly: <a href="tel:3363298899" className="text-[#1a6fc4] hover:underline font-semibold">(336) 329-8899</a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default CityLandingPage;
