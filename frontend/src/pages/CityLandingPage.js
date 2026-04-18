import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const CITIES = {
  'winston-salem': {
    name: 'Winston-Salem',
    region: 'Forsyth County',
    distance: '10 miles from Kernersville',
    industries: 'manufacturing plants, food processing facilities, and distribution centers',
    seoTitle: 'Safety Walkthroughs in Winston-Salem, NC',
    seoDesc: 'On-site OSHA safety walkthroughs for manufacturers, warehouses, and contractors in Winston-Salem, NC. Written report with findings. Starting at $650.',
  },
  'greensboro': {
    name: 'Greensboro',
    region: 'Guilford County',
    distance: '15 miles from Kernersville',
    industries: 'warehouses, light manufacturing, and logistics operations',
    seoTitle: 'Safety Walkthroughs in Greensboro, NC',
    seoDesc: 'OSHA safety walkthroughs and compliance support for small operations in Greensboro, NC. One visit. Clear findings. Starting at $650.',
  },
  'charlotte': {
    name: 'Charlotte',
    region: 'Mecklenburg County',
    distance: '75 miles from Kernersville',
    industries: 'manufacturing, construction contractors, and warehouse operations',
    seoTitle: 'Safety Walkthroughs in Charlotte, NC',
    seoDesc: 'Safety walkthrough services for manufacturers, warehouses, and contractors in the Charlotte, NC metro area. Written report. Starting at $650.',
  },
  'raleigh': {
    name: 'Raleigh',
    region: 'Wake County',
    distance: '75 miles from Kernersville',
    industries: 'growing manufacturing operations, warehouse facilities, and construction sites',
    seoTitle: 'Safety Walkthroughs in Raleigh, NC',
    seoDesc: 'On-site safety walkthroughs for small operations in Raleigh and the Triangle area. Identify OSHA exposure before it becomes a citation. Starting at $650.',
  },
  'high-point': {
    name: 'High Point',
    region: 'Guilford County',
    distance: '12 miles from Kernersville',
    industries: 'furniture manufacturing, warehousing, and small fabrication shops',
    seoTitle: 'Safety Walkthroughs in High Point, NC',
    seoDesc: 'Safety walkthrough services for manufacturers and warehouses in High Point, NC. Written findings report. Starting at $650.',
  },
  'burlington': {
    name: 'Burlington',
    region: 'Alamance County',
    distance: '30 miles from Kernersville',
    industries: 'textile operations, small manufacturers, and distribution facilities',
    seoTitle: 'Safety Walkthroughs in Burlington, NC',
    seoDesc: 'OSHA safety walkthroughs for small manufacturers and warehouses in Burlington, NC. One visit. Written report. Starting at $650.',
  },
};

const CityLandingPage = () => {
  const { city } = useParams();
  const data = CITIES[city];

  if (!data) return <Navigate to="/services" replace />;

  return (
    <main data-testid={`city-page-${city}`}>
      <SEO
        title={data.seoTitle}
        description={data.seoDesc}
        canonical={`/safety-walkthrough/${city}`}
        schema={{
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
          "offers": { "@type": "Offer", "price": "650", "priceCurrency": "USD" }
        }}
      />

      {/* Hero */}
      <section className="bg-[#0B1F33] text-white py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={16} className="text-[#1F6FEB]" />
            <p className="uppercase tracking-[3px] text-[#1F6FEB]" style={{ ...mono, fontSize: '11px' }}>
              {data.name}, NC — {data.region}
            </p>
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Safety Walkthroughs in {data.name}
          </h1>
          <p className="text-base md:text-lg text-white/55 max-w-2xl leading-relaxed mb-8">
            On-site OSHA safety walkthroughs for {data.industries} in {data.name} and {data.region}. I walk your floor, identify what's exposed, and deliver a written report with clear priorities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/request-walkthrough"
              className="inline-flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1F6FEB]/20"
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
          <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-4" style={{ ...mono, fontSize: '11px' }}>
            What You Get
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
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
                <Check size={16} className="flex-shrink-0 mt-1 text-[#1F6FEB]" strokeWidth={2.5} />
                <p className="text-sm text-[#102133]/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Context */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl">
          <p className="uppercase tracking-[3px] text-[#1F6FEB] mb-4" style={{ ...mono, fontSize: '11px' }}>
            Local Service
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#102133] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Serving {data.name} from Kernersville
          </h2>
          <div className="text-[#102133]/65 space-y-4 leading-relaxed">
            <p>
              GigLine Safety & Compliance is based in Kernersville, NC — {data.distance}. I serve {data.industries} across {data.region} and the surrounding Piedmont Triad area.
            </p>
            <p>
              Most {data.name} operations I walk into have the same issues: blocked electrical panels, missing training records, fire equipment that hasn't been inspected, and programs that exist on paper but aren't being followed on the floor.
            </p>
            <p className="font-medium text-[#102133]">
              A walkthrough finds what's actually exposed — before an inspector does.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 bg-[#0B1F33] text-white">
        <div className="container max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Starting at $650
          </h2>
          <p className="text-white/50 mb-8">
            Most walkthroughs for small operations in {data.name} fall between $650–$1,000 depending on size. You'll know your price before we schedule.
          </p>
          {(city === 'charlotte' || city === 'raleigh') && (
            <p className="text-white/50 mb-8">
              Charlotte and Raleigh area engagements are available on a scheduled basis. Contact to confirm availability and any applicable travel considerations before booking.
            </p>
          )}
          <Link
            to="/request-walkthrough"
            className="inline-flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#1F6FEB]/20"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
          <p className="mt-6 text-white/40 text-sm">
            Or call directly: <a href="tel:3363298899" className="text-[#1F6FEB] hover:underline font-semibold">(336) 329-8899</a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default CityLandingPage;
