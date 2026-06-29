import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Tag, BookOpen, Users, AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';

const defined = {
  headline: "HazCom Requirements for Small Businesses",
  description: "Complete guide to OSHA Hazard Communication requirements for small businesses. Covers written programs, Safety Data Sheets, labeling, training, and penalties under 29 CFR 1910.1200.",
  canonical: "/blog/hazcom-requirements-small-business",
  datePublished: "2026-04-07",
  dateModified: "2026-04-07",
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": defined.headline,
  "description": defined.description,
  "author": {
    "@type": "Person",
    "name": "Vince Lawrence",
    "jobTitle": "Safety Consultant",
    "affiliation": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" }
  },
  "publisher": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" },
  "datePublished": defined.datePublished,
  "dateModified": defined.dateModified,
  "mainEntityOfPage": { "@type": "WebPage", "@id": `https://giglinecompliance.com${defined.canonical}` }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do small businesses need a HazCom program?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Any business that uses, stores, or handles hazardous chemicals must comply with OSHA's Hazard Communication Standard (29 CFR 1910.1200). There is no small business exemption. This includes manufacturers, auto shops, fabrication shops, warehouses, and contractors." } },
    { "@type": "Question", "name": "What are the four requirements of a HazCom program?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA 29 CFR 1910.1200 requires four components: (1) a written Hazard Communication program, (2) Safety Data Sheets for every hazardous chemical, (3) proper container labels with GHS elements, and (4) documented employee training." } },
    { "@type": "Question", "name": "What are the penalties for HazCom violations?", "acceptedAnswer": { "@type": "Answer", "text": "Per OSHA's 2026 maximum penalty schedule, serious HazCom violations can run up to $16,550 per violation. Willful or repeat violations can reach $165,514. Common citations include missing written programs, incomplete SDS binders, unlabeled containers, and undocumented training." } },
    { "@type": "Question", "name": "How often is HazCom training required?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA requires HazCom training before initial exposure to hazardous chemicals and whenever new chemical hazards are introduced. Annual refresher training is not mandated but is recommended. All training must be documented with employee signatures." } },
    { "@type": "Question", "name": "What is the difference between MSDS and SDS?", "acceptedAnswer": { "@type": "Answer", "text": "MSDS (Material Safety Data Sheet) was the pre-2012 format with variable structure. SDS (Safety Data Sheet) is the current GHS-aligned format with a standardized 16-section layout and required pictograms. All employers should have transitioned to SDS format." } },
    { "@type": "Question", "name": "Where should the SDS binder be located?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA requires SDS to be readily accessible to employees during their work shift without requiring supervisor permission. Common locations include front office, shop floor near chemical storage, break room, or digital access via computer. The location must be communicated during training." } },
  ]
};

const combinedSchema = [articleSchema, faqSchema];

const fourRequirements = [
  {
    num: 1,
    icon: FileText,
    title: "Written Hazard Communication Program",
    cfr: "1910.1200(e)",
    content: "Employers must develop and maintain a written program that describes how the facility will comply with labeling, SDS, and training requirements.",
    items: [
      "A list of hazardous chemicals in the workplace",
      "Methods for informing employees of hazards",
      "Procedures for maintaining SDS",
      "How contractors will be informed of chemical hazards",
    ],
  },
  {
    num: 2,
    icon: BookOpen,
    title: "Safety Data Sheets (SDS)",
    cfr: "1910.1200(g)",
    content: "Employers must maintain an SDS for every hazardous chemical used at the facility.",
    items: [
      "Be readily accessible to employees during their work shift",
      "Follow the 16-section GHS format",
      "Be obtained from the chemical supplier before use",
    ],
  },
  {
    num: 3,
    icon: Tag,
    title: "Container Labeling",
    cfr: "1910.1200(f)",
    content: "All chemical containers must be labeled with GHS-compliant elements.",
    items: [
      "Product identifier",
      "Hazard pictogram(s)",
      "Signal word (Danger or Warning)",
      "Hazard statement",
      "Precautionary statements",
      "Supplier identification",
    ],
    exception: {
      title: "Immediate Use Exception",
      text: "Secondary containers do not require labels if the chemical is transferred and used immediately by the employee who made the transfer, within the same work shift, and the employee maintains exclusive control of the container. Once the container is set down, stored, or left unattended — even briefly — it must be labeled. This exception is narrow and commonly misapplied."
    },
  },
  {
    num: 4,
    icon: Users,
    title: "Employee Training",
    cfr: "1910.1200(h)",
    content: "Employers must train employees before initial assignment and whenever new chemical hazards are introduced.",
    items: [
      "Location and availability of the written program and SDS",
      "Physical and health hazards of chemicals in the work area",
      "How to detect chemical releases",
      "Protective measures and safe handling procedures",
      "Meaning of labels and warnings",
    ],
  },
];

const penaltyData = [
  { type: "Serious", amount: "$16,550 per violation" },
  { type: "Willful", amount: "$165,514 per violation" },
  { type: "Repeat", amount: "$165,514 per violation" },
];

const commonCitations = [
  "No written HazCom program ($16,550)",
  "Missing SDS for chemicals on site ($16,550 per chemical)",
  "Unlabeled secondary containers ($16,550 per container)",
  "No documented employee training ($16,550)",
];

const BlogHazComRequirements = () => {
  return (
    <main data-testid="blog-hazcom-requirements">
      <SEO
        title={defined.headline}
        description={defined.description}
        canonical={defined.canonical}
        schema={combinedSchema}
      />

      {/* Hero */}
      <section className="bg-[#1C2B2B] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            COMPLIANCE GUIDE
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="blog-hazcom-headline">
            {defined.headline}
          </h1>
          <p className="text-white/70 text-base leading-relaxed mb-6">
            If your business uses any hazardous chemicals — cleaners, solvents, paints, lubricants, welding gases — you need a Hazard Communication program. OSHA 29 CFR 1910.1200 requires four things: a written program, Safety Data Sheets for every chemical, proper container labels, and documented employee training. There is no exemption for small businesses. Penalties reach $16,550 per violation.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Vince Lawrence</span>
            <span className="text-white/20">|</span>
            <span>April 2026</span>
            <span className="text-white/20">|</span>
            <span>10 min read</span>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 border-b border-[#1C2B2B]/10" data-testid="hazcom-toc">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            IN THIS GUIDE
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { id: "do-i-need", label: "Do small businesses need HazCom?" },
              { id: "what-is-hcs", label: "What is the HazCom Standard?" },
              { id: "four-requirements", label: "The four requirements" },
              { id: "chemicals-sds", label: "What chemicals require an SDS?" },
              { id: "written-program", label: "Creating a written program" },
              { id: "sds-location", label: "Where to keep the SDS binder" },
              { id: "penalties", label: "Penalties for violations" },
              { id: "training-frequency", label: "How often is training required?" },
              { id: "consumer-exemption", label: "Household cleaning products?" },
              { id: "msds-vs-sds", label: "MSDS vs SDS" },
              { id: "getting-started", label: "Getting started" },
            ].map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80] transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Do small businesses need HazCom? */}
      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="do-i-need">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Do small businesses need a HazCom program?
          </h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">
            <strong className="text-[#1C2B2B]">Yes.</strong> Any business that uses, stores, or handles hazardous chemicals must comply with OSHA's Hazard Communication Standard (29 CFR 1910.1200). There is no small business exemption.
          </p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-6">
            If your employees are exposed to chemicals at work — even common products like cleaning supplies, paints, adhesives, or lubricants — you are required to have:
          </p>
          <ol className="space-y-2 mb-6">
            {["A written Hazard Communication program", "Safety Data Sheets (SDS) for every hazardous chemical", "Proper labels on all chemical containers", "Documented employee training"].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C2B2B]/70">
                <span className="font-bold text-[#2A52A0] flex-shrink-0">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ol>
          <p className="text-[#1C2B2B]/60 text-sm">
            This applies to manufacturers, auto shops, fabrication shops, warehouses, contractors, and any general industry employer with chemical exposure.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="what-is-hcs">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            What is the OSHA Hazard Communication Standard?
          </h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">
            The <strong className="text-[#1C2B2B]">Hazard Communication Standard (HCS)</strong>, codified at <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>29 CFR 1910.1200</span>, requires employers to inform employees about chemical hazards in the workplace. It is also called "HazCom" or the "Right to Know" law.
          </p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-6">
            The standard was updated in 2012 to align with the Globally Harmonized System (GHS) of classification and labeling, which standardized:
          </p>
          <ul className="space-y-2 mb-6">
            {["Hazard classification criteria", "Label elements (pictograms, signal words, hazard statements)", "Safety Data Sheet format (16 sections)"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70">
                <span className="text-[#2A52A0] font-bold">•</span>{item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#1C2B2B]/50">
            OSHA enforces HazCom under General Industry (1910.1200), Construction (1926.59), and Maritime (1915.1200, 1917.28, 1918.90) standards.
          </p>
        </div>
      </section>

      {/* Four Requirements */}
      <section className="py-12 md:py-16 bg-[#F9F8F6]" data-testid="four-requirements">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            What are the four requirements of a HazCom program?
          </h2>
          <p className="text-[#1C2B2B]/60 text-sm mb-10">
            OSHA 29 CFR 1910.1200 requires employers to implement four components:
          </p>
          <div className="space-y-8">
            {fourRequirements.map((req) => (
              <div key={req.num} className="bg-white border border-[#1C2B2B]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
                <div className="flex items-start gap-3 mb-4">
                  <req.icon size={22} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {req.cfr}
                    </p>
                    <h3 className="text-base font-bold text-[#1C2B2B]">{req.num}. {req.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-[#1C2B2B]/70 mb-4">{req.content}</p>
                <ul className="space-y-2">
                  {req.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/60">
                      <span className="text-[#2A52A0] mt-0.5 flex-shrink-0 text-xs">&#x2713;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {req.exception && (
                  <div className="mt-5 bg-[#F9F8F6] border-l-2 border-[#2A52A0] p-4 rounded-r">
                    <h4 className="text-sm font-bold text-[#1C2B2B] mb-2">{req.exception.title}</h4>
                    <p className="text-xs text-[#1C2B2B]/60 leading-relaxed">{req.exception.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="chemicals-sds">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            What chemicals require an SDS?
          </h2>
          <p className="text-[#1C2B2B]/70 mb-6 text-sm">Any chemical classified as a health hazard or physical hazard requires an SDS. This includes:</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-[#1C2B2B] mb-3 uppercase tracking-wider">Common Chemicals Requiring SDS</h3>
              <ul className="space-y-2">
                {["Cleaning products (degreasers, solvents, disinfectants)", "Paints, coatings, and thinners", "Lubricants and cutting fluids", "Welding gases and filler materials", "Adhesives and sealants", "Fuels (gasoline, diesel, propane)", "Battery acid", "Pesticides and herbicides"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70">
                    <span className="text-red-500 mt-0.5 flex-shrink-0 text-xs">&#x2717;</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1C2B2B] mb-3 uppercase tracking-wider">Exemptions (SDS Not Required)</h3>
              <ul className="space-y-2">
                {["Consumer products used in the same manner and duration as normal consumer use", "Food, drugs, and cosmetics for employee consumption", "Tobacco products", "Wood and wood products (unless treated)", "Articles that do not release hazardous chemicals under normal use"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/60">
                    <span className="text-green-600 mt-0.5 flex-shrink-0 text-xs">&#x2713;</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-[#1C2B2B]/50 mt-6">
            If you're unsure whether a product requires an SDS, request one from the supplier. Most chemical manufacturers provide SDS on their websites.
          </p>
        </div>
      </section>

      {/* How to create a written program */}
      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="written-program">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            How do I create a written HazCom program?
          </h2>
          <p className="text-[#1C2B2B]/70 mb-6 text-sm">A written HazCom program must address:</p>
          <ol className="space-y-3 mb-6">
            {[
              { title: "Chemical inventory", desc: "List all hazardous chemicals present" },
              { title: "Labeling procedures", desc: "How containers will be labeled" },
              { title: "SDS management", desc: "Where SDS are kept, how they are maintained" },
              { title: "Training procedures", desc: "When and how employees will be trained" },
              { title: "Non-routine tasks", desc: "How employees are informed of hazards during maintenance or special operations" },
              { title: "Contractor communication", desc: "How chemical hazards are shared with outside employers" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="bg-[#1C2B2B] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <span className="font-semibold text-[#1C2B2B] text-sm">{item.title}</span>
                  <span className="text-[#1C2B2B]/60 text-sm"> — {item.desc}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-sm text-[#1C2B2B]/60 mb-4">
            The written program must be available to employees upon request and must be reviewed and updated when chemicals or processes change.
          </p>
          <Link to="/hazcom" className="inline-flex items-center gap-2 text-sm text-[#1F3F80] font-medium hover:underline">
            Get a ready-made written HazCom program — $29 <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="sds-location">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Where should the SDS binder be located?
          </h2>
          <p className="text-[#1C2B2B]/70 mb-4 text-sm">OSHA requires that SDS be <strong className="text-[#1C2B2B]">readily accessible</strong> to employees during their work shift. This means:</p>
          <ul className="space-y-2 mb-6">
            {["Employees can access SDS without asking permission", "SDS are available in the work area or can be immediately obtained", "Electronic access is acceptable if employees can retrieve SDS without delay"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70">
                <span className="text-[#2A52A0] font-bold">•</span>{item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#1C2B2B]/70 mb-3">Common locations:</p>
          <ul className="space-y-2 mb-4">
            {["Front office or reception area", "Shop floor near chemical storage", "Break room or common area", "Digital access via computer or tablet"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/60">
                <span className="text-[#1C2B2B]/30">—</span>{item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#1C2B2B]/50">The location must be communicated to all employees during training.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="penalties" data-testid="hazcom-penalties">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-2" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            What are the penalties for HazCom violations?
          </h2>
          <p className="text-sm text-[#1C2B2B]/60 mb-6">
            Hazard Communication is the <strong className="text-[#1C2B2B]">#1 most-cited OSHA standard</strong> in general industry. Penalties under the 2026 OSHA maximum penalty schedule (effective after January 15, 2026):
          </p>
          <table className="w-full text-sm mb-6" data-testid="hazcom-penalty-table">
            <thead>
              <tr className="border-b-2 border-[#1C2B2B]/10">
                <th className="text-left py-3 pr-4 font-semibold text-[#1C2B2B]">Violation Type</th>
                <th className="text-right py-3 font-semibold text-[#1C2B2B]">Maximum Penalty</th>
              </tr>
            </thead>
            <tbody>
              {penaltyData.map((row) => (
                <tr key={row.type} className="border-b border-[#1C2B2B]/5">
                  <td className="py-3 pr-4 text-[#1C2B2B]/70">{row.type}</td>
                  <td className="py-3 text-right font-semibold text-[#1C2B2B]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-[#1C2B2B]/60 mb-3">Common citations include:</p>
          <ul className="space-y-2">
            {commonCitations.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70">
                <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-[#1C2B2B]/50 mt-4">A single HazCom inspection can result in multiple violations totaling tens of thousands of dollars.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="training-frequency">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            How often is HazCom training required?
          </h2>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b-2 border-[#1C2B2B]/10">
                <th className="text-left py-3 pr-4 font-semibold text-[#1C2B2B]">Timing</th>
                <th className="text-left py-3 font-semibold text-[#1C2B2B]">Requirement</th>
              </tr>
            </thead>
            <tbody>
              {[
                { timing: "Initial", req: "Before first exposure to hazardous chemicals" },
                { timing: "New chemical", req: "When a new hazard is introduced to the work area" },
                { timing: "New employee", req: "Before initial assignment to area with chemical exposure" },
              ].map((row) => (
                <tr key={row.timing} className="border-b border-[#1C2B2B]/5">
                  <td className="py-3 pr-4 text-[#1C2B2B] font-medium text-sm">{row.timing}</td>
                  <td className="py-3 text-[#1C2B2B]/70 text-sm">{row.req}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-[#1C2B2B]/50">OSHA does not mandate annual refresher training, but many employers conduct it to maintain awareness. Training must be documented with employee signatures.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="consumer-exemption">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Do I need HazCom if I only use household cleaning products?
          </h2>
          <p className="text-[#1C2B2B]/70 mb-4 text-sm">
            It depends on how the products are used. OSHA provides a <strong className="text-[#1C2B2B]">consumer product exemption</strong> for products used in the same manner and duration as normal consumer use.
          </p>
          <p className="text-[#1C2B2B]/70 mb-4 text-sm">
            If employees use cleaning products more frequently or in greater quantities than a typical consumer — which is common in commercial settings — the exemption does not apply and an SDS is required.
          </p>
          <p className="text-[#1C2B2B]/80 font-medium text-sm">
            When in doubt, obtain the SDS and include the product in your program.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#1C2B2B]/10" id="msds-vs-sds">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            What is the difference between MSDS and SDS?
          </h2>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b-2 border-[#1C2B2B]/10">
                <th className="text-left py-3 pr-4 font-semibold text-[#1C2B2B]">MSDS (Pre-2012)</th>
                <th className="text-left py-3 font-semibold text-[#1C2B2B]">SDS (Current)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { old: "Variable format", current: "Standardized 16-section format" },
                { old: "Inconsistent hazard classification", current: "GHS-aligned classification" },
                { old: "No required pictograms", current: "GHS pictograms required" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#1C2B2B]/5">
                  <td className="py-3 pr-4 text-[#1C2B2B]/50 text-sm">{row.old}</td>
                  <td className="py-3 text-[#1C2B2B]/70 text-sm">{row.current}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-[#1C2B2B]/50">All employers should have transitioned to SDS format. If you still have MSDS documents, they should be replaced with current SDS from the chemical supplier.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="getting-started" data-testid="getting-started">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            How do I get started with HazCom compliance?
          </h2>
          <ol className="space-y-5">
            {[
              { title: "Chemical inventory", desc: "Walk your facility and list every chemical product. Include cleaners, lubricants, paints, solvents, and gases." },
              { title: "Collect SDS", desc: "Obtain an SDS for each chemical from the supplier or manufacturer website. Organize in a binder or digital system." },
              { title: "Written program", desc: "Create a written HazCom program that addresses labeling, SDS access, training, and contractor communication." },
              { title: "Label check", desc: "Verify all containers are properly labeled. Add labels to secondary containers." },
              { title: "Train employees", desc: "Conduct training covering chemical hazards, SDS location, label interpretation, and emergency procedures. Document with signatures." },
              { title: "Maintain", desc: "Update the chemical inventory and SDS when products change. Train new employees before they work with chemicals." },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#2A52A0] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-semibold text-[#1C2B2B] text-sm">{step.title}</p>
                  <p className="text-sm text-[#1C2B2B]/60">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related Resources / CTA */}
      <section className="py-14 md:py-20 bg-[#1C2B2B] text-white" data-testid="hazcom-blog-cta">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Related Resources
          </h2>
          <div className="space-y-4 mb-10">
            <Link to="/hazcom" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group" data-testid="hazcom-blog-cta-pack">
              <div>
                <p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">HazCom Starter Pack — $29</p>
                <p className="text-xs text-white/50 mt-1">Written program, SDS checklist, training log. Fill in your company name and print.</p>
              </div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/safety-check" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div>
                <p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Run the Safety Check</p>
                <p className="text-xs text-white/50 mt-1">Free 90-second assessment to identify HazCom gaps</p>
              </div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/contact" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div>
                <p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Request a Walkthrough</p>
                <p className="text-xs text-white/50 mt-1">On-site review starting at $1,200</p>
              </div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* Walkthrough Callout */}
      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-3xl">
          <div className="border border-[#2A52A0]/20 bg-white rounded-lg p-6 md:p-8 text-center" data-testid="blog-walkthrough-callout">
            <p className="text-lg font-bold text-[#1C2B2B] mb-2">Not sure if these violations exist in your shop?</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-5">A GigLine Safety Walkthrough will flag them with photos and a prioritized fix list — usually within 48 hours.</p>
            <Link to="/intake" className="inline-flex items-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">
              Request a Safety Walkthrough <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Author Box */}
      <section className="py-10 border-t border-[#1C2B2B]/10">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1C2B2B] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">VL</span>
            </div>
            <div>
              <p className="font-semibold text-[#1C2B2B] text-sm">Vince Lawrence</p>
              <p className="text-xs text-[#1C2B2B]/50 mb-2">Safety Consultant, OSHA 30-Hour Certified, U.S. Navy Veteran</p>
              <p className="text-xs text-[#1C2B2B]/50">
                GigLine Safety & Compliance — Kernersville, NC{' '}
                <span className="text-[#1C2B2B]/30 mx-1">|</span>
                <a href="tel:3363298899" className="text-[#1F3F80] hover:underline">(336) 329-8899</a>
                <span className="text-[#1C2B2B]/30 mx-1">|</span>
                <a href="mailto:vince@giglinecompliance.com" className="text-[#1F3F80] hover:underline">vince@giglinecompliance.com</a>
              </p>
              <p className="text-xs text-[#1C2B2B]/40 mt-2 italic">Penalty amounts reflect OSHA&rsquo;s 2026 maximum penalty adjustments effective after January 15, 2026. Actual penalties depend on classification, employer size, gravity, history, and good-faith factors.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogHazComRequirements;
