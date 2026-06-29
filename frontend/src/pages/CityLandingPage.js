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
    industries: 'biotech and pharmaceutical operations, medical device manufacturers, and food processing facilities',
    seoTitle: 'Safety Walkthroughs in Winston-Salem, NC',
    seoDesc: 'On-site OSHA safety walkthroughs for biotech, pharmaceutical, medical device, and food processing operations in Winston-Salem, NC. Written report with findings. Starting at $1,200.',
    leadParagraph: "Winston-Salem's industrial base centers on biotech, pharmaceutical, and medical device manufacturing — a cluster that grew from the city's legacy tobacco infrastructure and now includes operations from contract pharmaceutical packagers to specialty medical-device producers concentrated around the Innovation Quarter and the Hanes Mill Road corridor. RJ Reynolds, Hanesbrands, and Krispy Kreme anchor the legacy industrial footprint, while a newer generation of life sciences operations — many in renovated mid-century plants — operate under a parallel set of OSHA requirements covering chemical handling, cleanroom hazards, lockout/tagout on packaging lines, and respiratory protection for compounded materials.\n\nGigLine works with Winston-Salem operations that need outside compliance support without a retained safety consultant on payroll. A typical engagement starts with an on-site walkthrough — Vince walks your floor for one to three hours, photographs every finding, and annotates each with the relevant CFR citation and 2026 penalty exposure. The written report lands in your inbox within 24 to 48 hours with a prioritized RED / AMBER / GREEN fix list. Operations preparing for FDA-adjacent customer audits or insurance reviews typically choose the Compliance Readiness Visit, which combines the floor walkthrough with a 53-item documentation review and produces a single compliance score for both. Winston-Salem engagements — ten miles from GigLine's Kernersville base — are typically scheduled within 5 to 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'greensboro': {
    name: 'Greensboro',
    region: 'Guilford County',
    distance: '15 miles from our base in Kernersville',
    industries: 'aviation component manufacturers, food and beverage producers, light industrial operations, and logistics centers',
    seoTitle: 'Safety Walkthroughs in Greensboro, NC',
    seoDesc: 'OSHA safety walkthroughs for Greensboro manufacturers, aviation suppliers, food and beverage producers, and distribution operations. Written report with findings. Starting at $1,200.',
    leadParagraph: "Greensboro's manufacturing corridor along I-40 and Battleground Avenue includes operations in aviation components, food and beverage production, and industrial distribution. Honda Aircraft's home base sits south of the city, Volvo Trucks anchors the heavy equipment corridor, and the food and beverage cluster — from beverage bottlers to specialty food producers — continues to expand around the Piedmont Triad International Airport. Underneath those flagship operations sits a wider ecosystem of light manufacturers, contract fabricators, and tier-2 suppliers — the operations most likely to face an OSHA inspection without a full-time safety manager on staff.\n\nGigLine works with Greensboro operations that fit that profile: 5 to 100 employees, single facility, no dedicated safety department. A typical engagement starts with an on-site walkthrough — Vince walks your floor for one to three hours, photographs every finding, and annotates each with the relevant CFR citation and 2026 penalty exposure. Within 24 to 48 hours you receive a written report with a prioritized fix list — RED, AMBER, or GREEN — that supervisors can actually work from. Operations that need both the floor and the files reviewed in one visit choose the Compliance Readiness Visit, which combines the walkthrough with a documentation review and produces a single compliance percentage score for both. Greensboro engagements are scheduled within 5 to 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'charlotte': {
    name: 'Charlotte',
    region: 'Mecklenburg County',
    distance: '75 miles from our base in Kernersville',
    industries: 'light manufacturers, construction contractors, distribution operations, and small fabrication shops',
    seoTitle: 'Safety Walkthroughs in Charlotte, NC',
    seoDesc: 'OSHA safety walkthroughs for Charlotte light manufacturers, construction contractors, plastics processors, and distribution operations. Written report. Starting at $1,200.',
    leadParagraph: "Charlotte is North Carolina's largest metropolitan economy, anchored by financial services downtown but built on a vast industrial perimeter — manufacturing operations along I-77 and I-485, construction contractors building out the suburban growth corridor, and the distribution and logistics infrastructure that feeds the Carolinas regional market. The South End, West Boulevard, and Steele Creek industrial corridors host plastics processors, metal fabricators, building-materials suppliers, food and beverage producers, and the contractor fleets that support residential and commercial construction across Mecklenburg County. Across all of those operations, the most common OSHA exposures track the same pattern: machine guarding, forklift traffic, fall protection on construction sites, electrical panel clearances, and the documentation gaps that disqualify bids on customer pre-qualification audits.\n\nGigLine works with Charlotte-area operations that fit the small-operator profile: 5 to 100 employees, single facility, no full-time safety person. Engagements include the on-site walkthrough, the Compliance Readiness Visit, and the documentation development that follows. Charlotte is seventy-five miles from GigLine's Kernersville base — engagements scheduled within 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'raleigh': {
    name: 'Raleigh',
    region: 'Wake County',
    distance: '75 miles from our base in Kernersville',
    industries: 'contract pharmaceutical and medical device operations, food and beverage producers, electronics assemblers, and small manufacturers',
    seoTitle: 'Safety Walkthroughs in Raleigh, NC',
    seoDesc: 'OSHA safety walkthroughs for Raleigh, Durham, and Triangle-area pharma, medical device, food production, and small manufacturing operations. Written report. Starting at $1,200.',
    leadParagraph: "Raleigh and the broader Research Triangle sit at the center of North Carolina's life sciences and technology economy, but the industrial footprint underneath that growth is real — contract pharmaceutical packagers, medical device fabricators, food and beverage producers, and the manufacturing and construction operations that support the region's continued residential and commercial expansion. The corridors along I-40, I-440, and Highway 70 host the manufacturing and distribution operations most exposed to OSHA inspections: machine shops, electronics assembly, food processing, building-materials production, and the contractor fleets working across Wake and Durham counties. For operations adjacent to FDA-regulated customers — biotech, pharma, medical device — the OSHA documentation requirements run in parallel with FDA expectations, and customer pre-qualification audits are routine.\n\nGigLine works with Triangle-area operations that need outside compliance support without a retained consultant on payroll. Engagements include the on-site walkthrough, the Compliance Readiness Visit, and document development. Raleigh is seventy-five miles from GigLine's Kernersville base — engagements scheduled within 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'high-point': {
    name: 'High Point',
    region: 'Guilford County',
    distance: '12 miles from our base in Kernersville',
    industries: 'furniture manufacturers, woodworking shops, upholstery operations, and warehousing',
    seoTitle: 'Safety Walkthroughs in High Point, NC',
    seoDesc: 'OSHA safety walkthroughs for High Point furniture manufacturers, woodworking shops, and upholstery operations. Written findings report. Starting at $1,200.',
    leadParagraph: "High Point is the furniture capital of North Carolina, and the industrial corridor along Main Street, South Main, and the routes leading into the showroom district remains anchored by furniture manufacturers, woodworking shops, upholstery operations, and the warehousing and logistics infrastructure that supports the twice-yearly High Point Market. Wood dust, finishing-line solvents, table saws and edge banders, pneumatic staplers, forklift traffic, and lift truck propane handling are present in nearly every furniture operation — and every one of those hazards is governed by a specific OSHA standard that the average operation has either underdocumented or never written down.\n\nGigLine works with High Point furniture manufacturers, cabinetry shops, and contract upholstery operations that fit the small-operator profile: 5 to 100 employees, single facility, no full-time safety person. A typical engagement starts with an on-site walkthrough — Vince walks your shop floor for one to three hours, photographs every finding, and annotates each with the relevant CFR citation and 2026 penalty exposure. The written report lands within 24 to 48 hours with a prioritized RED / AMBER / GREEN fix list. Operations preparing for a customer audit before Market or recovering from a wood-dust or finishing-line incident typically choose the Compliance Readiness Visit, which combines the walkthrough with a documentation review. High Point is twelve miles from GigLine's Kernersville base, and most engagements are scheduled within 5 to 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'burlington': {
    name: 'Burlington',
    region: 'Alamance County',
    distance: '30 miles from our base in Kernersville',
    industries: 'textile and apparel manufacturers, small fabrication shops, plastics processors, and distribution operations',
    seoTitle: 'Safety Walkthroughs in Burlington, NC',
    seoDesc: 'OSHA safety walkthroughs for Burlington and Alamance County textile manufacturers, fabrication shops, plastics processors, and distribution operations. Starting at $1,200.',
    leadParagraph: "Burlington's industrial base grew from the textile and apparel mills that defined Alamance County through the twentieth century, and while many of the original operations have closed, the corridor along I-40, I-85, and Highway 70 still hosts a working ecosystem of textile and apparel manufacturers, small fabrication shops, plastics processors, and the distribution and logistics operations that move freight between the Triad and the Triangle. The OSHA exposures common to Burlington operations include machine guarding on textile and packaging lines, lockout/tagout on production equipment, forklift traffic in warehouses, chemical handling on dyehouse and finishing operations, and the documentation gaps that follow when a small operation grows past 10 or 15 employees without adding a safety role.\n\nGigLine works with Burlington and Alamance County operations that fit the small-operator profile: 5 to 100 employees, single facility, no dedicated safety person. Burlington is thirty miles from GigLine's Kernersville base — engagements scheduled within 5 to 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'kernersville': {
    name: 'Kernersville',
    region: 'Forsyth County',
    distance: 'this is our home base',
    industries: 'light manufacturing, plastics and packaging operations, distribution centers, and fleet operations',
    seoTitle: 'Safety Walkthroughs in Kernersville, NC',
    seoDesc: "On-site OSHA safety walkthroughs for Kernersville plastics, packaging, light manufacturers, and distribution operations. GigLine's home base. Written report. Starting at $1,200.",
    priceStart: 1200,
    leadParagraph: "Kernersville sits at the intersection of I-40 and Highway 66, and the industrial corridors along Linville Road, Macy Grove Road, and the Kernersville Business Park host a concentrated mix of light manufacturers, plastics and packaging operations, building-materials producers, and the distribution and fleet operations that feed the broader Triad logistics network. FedEx Ground's regional hub, multiple UPS distribution facilities, and a growing cluster of contract plastics injection-molding and food-grade packaging operations sit alongside small fabrication shops and family-owned production businesses — the operations that most often face an OSHA exposure without a safety manager on staff.\n\nGigLine is based in Kernersville, which means most local engagements are scheduled inside a week — no travel fee, no scheduling friction. A typical engagement starts with an on-site walkthrough — Vince walks your floor for one to three hours, photographs every finding, and annotates each with the relevant CFR citation and 2026 penalty exposure. The written report lands within 24 to 48 hours with a prioritized RED / AMBER / GREEN fix list. Operations that need both floor and file reviewed in one visit choose the Compliance Readiness Visit, which combines the walkthrough with a 53-item documentation review and produces a single compliance percentage score for both. Kernersville operations also account for GigLine's largest concentration of Quarterly Maintenance and Annual Compliance Partner engagements — the cadence work that catches drift between scheduled visits. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'lexington': {
    name: 'Lexington',
    region: 'Davidson County',
    distance: '20 miles from our base in Kernersville',
    industries: 'food processing facilities, meat packing operations, and small fabrication shops',
    seoTitle: 'Safety Walkthroughs in Lexington, NC',
    seoDesc: 'On-site OSHA safety walkthroughs for Lexington food processors, meat packing operations, and fabrication shops. Written report with findings. Starting at $1,200.',
    priceStart: 1200,
    leadParagraph: "Lexington's industrial base is anchored by food processing and meat packing operations — a corridor that runs from the Tyson Foods complex south of town through smaller protein and specialty food producers concentrated along Old Highway 64 and the I-85 frontage. The city's furniture legacy still operates around Salisbury Street and the Lexington Business Center, and the Childress Vineyards area continues to draw food and beverage production. Across all of those operations, the OSHA exposures are some of the highest-stakes in the Triad: machine guarding on processing lines, ammonia refrigeration system safety (PSM-covered for many sites), confined space entry, slip-and-fall on wet floors, lockout/tagout on packaging equipment, and forklift safety throughout the warehouse footprint.\n\nGigLine works with Lexington-area food processors, fabrication shops, and small manufacturers that fit the small-operator profile: 5 to 100 employees, single facility, no dedicated safety manager. A typical engagement starts with an on-site walkthrough — Vince walks your floor for one to three hours, photographs every finding, and annotates each with the relevant CFR citation and 2026 penalty exposure. The written report lands within 24 to 48 hours with a prioritized RED / AMBER / GREEN fix list. Operations preparing for a customer audit, an insurance review, or recovering from an incident typically choose the Compliance Readiness Visit, which combines the walkthrough with a 53-item documentation review. Lexington is twenty miles from GigLine's Kernersville base, and most engagements are scheduled within 5 to 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'thomasville': {
    name: 'Thomasville',
    region: 'Davidson County',
    distance: '15 miles from our base in Kernersville',
    industries: 'furniture manufacturers, woodworking and cabinetry shops, upholstery operations, and small fabrication shops',
    seoTitle: 'Safety Walkthroughs in Thomasville, NC',
    seoDesc: 'OSHA safety walkthroughs for Thomasville furniture manufacturers, woodworking shops, upholstery operations, and small fabrication shops. Written report. Starting at $1,200.',
    priceStart: 1200,
    leadParagraph: "Thomasville sits in the heart of North Carolina's furniture corridor, ten miles south of High Point along Highway 109, and the industrial footprint along Randolph Street, National Highway, and the I-85 frontage continues to be anchored by furniture manufacturers, woodworking and cabinetry shops, upholstery operations, and the small fabrication and packaging shops that support the broader Triad supply chain. The furniture sector here carries the same OSHA exposures as High Point — wood dust, finishing-line solvents, table saws and edge banders, pneumatic staplers, forklift traffic, and lift truck propane handling — every one of which is governed by a specific OSHA standard that the average operation has either underdocumented or never written down.\n\nGigLine works with Thomasville furniture manufacturers and small fabrication shops that fit the small-operator profile: 5 to 100 employees, single facility, no full-time safety person. Thomasville is fifteen miles from GigLine's Kernersville base — engagements scheduled within 5 to 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
  },
  'clemmons': {
    name: 'Clemmons',
    region: 'Forsyth County',
    distance: '15 miles from our base in Kernersville',
    industries: 'light manufacturers, automotive parts suppliers, small fabrication shops, and food and beverage producers',
    seoTitle: 'Safety Walkthroughs in Clemmons, NC',
    seoDesc: 'OSHA safety walkthroughs for Clemmons light manufacturers, automotive parts suppliers, fabrication shops, and food and beverage producers. Written report. Starting at $1,200.',
    priceStart: 1200,
    leadParagraph: "Clemmons sits along Lewisville-Clemmons Road and the I-40 corridor west of Winston-Salem, and the industrial pockets along Stadium Drive and Clemmons Road host a mix of light manufacturers, automotive parts suppliers, small fabrication shops, food and beverage producers, and the warehousing and distribution operations that support the broader western Forsyth County economy. The OSHA exposures most common across Clemmons operations include machine guarding, forklift traffic, electrical panel clearances, chemical storage and labeling, and the lockout/tagout documentation gaps that follow when a small operation outgrows the safety practices that worked at five employees.\n\nGigLine works with Clemmons-area operations that need outside compliance support without a retained safety consultant. Engagements include the on-site walkthrough, the Compliance Readiness Visit, and document development. Clemmons is fifteen miles from GigLine's Kernersville base — engagements scheduled within 5 to 10 business days. Fixed quote before scheduling. Private engagement. No retainer.",
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
      <section className="bg-[#1C2B2B] text-white py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={16} className="text-[#2A52A0]" />
            <p className="uppercase tracking-[3px] text-[#2A52A0]" style={{ ...mono, fontSize: '11px' }}>
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
              to="/intake"
              className="inline-flex items-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#2A52A0]/20"
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

      {/* Local Context — industry-specific lead paragraph (deep SEO for priority Triad cities) */}
      {data.leadParagraph && (
        <section className="py-16 md:py-20 bg-white" data-testid={`city-lead-${city}`}>
          <div className="container max-w-3xl">
            <p className="uppercase tracking-[3px] text-[#2A52A0] mb-4" style={{ ...mono, fontSize: '11px' }}>
              {data.name} Industrial Profile
            </p>
            <h2
              className="text-2xl md:text-[32px] font-bold text-[#1C2B2B] mb-8 leading-[1.2]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              OSHA exposure across {data.name}&rsquo;s industrial corridor.
            </h2>
            <div className="space-y-5 text-[15.5px] md:text-base text-[#1C2B2B]/80 leading-[1.85]">
              {data.leadParagraph.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What You Get */}
      <section className="py-16 md:py-24" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="container max-w-4xl">
          <p className="uppercase tracking-[3px] text-[#2A52A0] mb-4" style={{ ...mono, fontSize: '11px' }}>
            What You Get
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
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
                <Check size={16} className="flex-shrink-0 mt-1 text-[#2A52A0]" strokeWidth={2.5} />
                <p className="text-sm text-[#1C2B2B]/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Context */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-4xl">
          <p className="uppercase tracking-[3px] text-[#2A52A0] mb-4" style={{ ...mono, fontSize: '11px' }}>
            Local Service
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Serving {data.name} from Kernersville
          </h2>
          <div className="text-[#1C2B2B]/65 space-y-4 leading-relaxed">
            <p>
              GigLine Safety & Compliance is based in Kernersville, NC — {data.distance}. I serve {data.industries} across {data.region} and the surrounding Piedmont Triad area.
            </p>
            <p>
              Most {data.name} operations I walk into have the same issues: blocked electrical panels, missing training records, fire equipment that hasn't been inspected, and programs that exist on paper but aren't being followed on the floor.
            </p>
            <p className="font-medium text-[#1C2B2B]">
              A walkthrough finds what's actually exposed — before an inspector does.
            </p>
          </div>
        </div>
      </section>

      {/* City-specific FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container max-w-3xl">
          <p className="uppercase tracking-[3px] text-[#2A52A0] mb-4" style={{ ...mono, fontSize: '11px' }}>
            Common Questions
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {data.name} Safety Walkthrough FAQ
          </h2>
          <div className="space-y-6" data-testid={`city-faq-${city}`}>
            {cityFaqs.map((f, i) => (
              <div key={i} className="border-l-2 border-[#2A52A0]/30 pl-5">
                <h3
                  className="font-semibold text-[#1C2B2B] mb-2 text-base md:text-lg"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {f.q}
                </h3>
                <p className="text-sm md:text-base text-[#1C2B2B]/70 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-[#dde3ea]">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-[#2A52A0] hover:text-[#1F3F80] font-semibold text-sm"
              data-testid={`city-faq-more-${city}`}
            >
              See all 18 frequently asked questions
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-20 bg-[#1C2B2B] text-white">
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
            to="/intake"
            className="inline-flex items-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded transition-colors shadow-lg shadow-[#2A52A0]/20"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
          <p className="mt-6 text-white/40 text-sm">
            Or call directly: <a href="tel:3363298899" className="text-[#2A52A0] hover:underline font-semibold">(336) 329-8899</a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default CityLandingPage;
