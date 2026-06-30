import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, DollarSign, FileText, Shield, Truck, Footprints } from 'lucide-react';
import SEO from '../components/SEO';

const defined = {
  headline: "Top 5 OSHA Violations in Small Manufacturing",
  description: "The five most-cited OSHA violations in small manufacturing: Hazard Communication, Lockout/Tagout, Machine Guarding, Powered Industrial Trucks, and Walking-Working Surfaces. Includes CFR references, penalty amounts, and compliance requirements.",
  canonical: "/blog/top-5-osha-violations-small-manufacturing",
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
    "affiliation": {
      "@type": "Organization",
      "name": "GigLine Safety & Compliance",
      "url": "https://giglinecompliance.com"
    }
  },
  "publisher": {
    "@type": "Organization",
    "name": "GigLine Safety & Compliance",
    "url": "https://giglinecompliance.com",
    "logo": { "@type": "ImageObject", "url": "https://www.giglinecompliance.com/gigline-logo-3d.png" }
  },
  "datePublished": defined.datePublished,
  "dateModified": defined.dateModified,
  "mainEntityOfPage": { "@type": "WebPage", "@id": `https://giglinecompliance.com${defined.canonical}` }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the most common OSHA violations in small manufacturing?",
      "acceptedAnswer": { "@type": "Answer", "text": "The five most frequently cited OSHA violations in small manufacturing are: Hazard Communication (29 CFR 1910.1200), Lockout/Tagout (29 CFR 1910.147), Machine Guarding (29 CFR 1910.212), Powered Industrial Trucks (29 CFR 1910.178), and Walking-Working Surfaces (29 CFR 1910.22)." }
    },
    {
      "@type": "Question",
      "name": "What is the penalty for OSHA violations in 2025?",
      "acceptedAnswer": { "@type": "Answer", "text": "Per OSHA's 2026 maximum penalty schedule (effective after January 15, 2026), serious violations can carry penalties up to $16,550 each and willful or repeat violations up to $165,514. Penalties are adjusted annually for inflation." }
    },
    {
      "@type": "Question",
      "name": "What is Hazard Communication (HazCom) and why is it cited so often?",
      "acceptedAnswer": { "@type": "Answer", "text": "Hazard Communication (29 CFR 1910.1200) requires employers to inform employees about chemical hazards through a written program, Safety Data Sheets, container labeling, and training. It is the #1 most-cited OSHA standard because most shops have chemicals but lack the required documentation." }
    },
    {
      "@type": "Question",
      "name": "What are OSHA's forklift training requirements?",
      "acceptedAnswer": { "@type": "Answer", "text": "OSHA 29 CFR 1910.178 requires formal training, practical training, and evaluation of all forklift operators. Training must be specific to the truck type and workplace. Refresher training is required every three years and after any accidents or unsafe operation." }
    },
    {
      "@type": "Question",
      "name": "How can small manufacturers avoid OSHA violations?",
      "acceptedAnswer": { "@type": "Answer", "text": "Small manufacturers can avoid OSHA violations by conducting self-assessments, documenting all training, maintaining required written programs (HazCom, LOTO), performing regular inspections, and keeping training records with employee signatures." }
    }
  ]
};

const combinedSchema = [articleSchema, faqSchema];

const violations = [
  {
    num: 1,
    icon: AlertTriangle,
    title: "Hazard Communication",
    cfr: "29 CFR 1910.1200",
    tagline: "#1 OSHA citation in general industry — multiple consecutive years.",
    cta: { text: "Fix HazCom paperwork now — $29", to: "/hazcom" },
    deepLink: { text: "Read the full HazCom compliance guide →", to: "/blog/hazcom-requirements-small-business" },
    why: [
      "Written HazCom program is missing or incomplete",
      "SDS binder doesn't include all chemicals on site",
      "Secondary containers lack required labels",
      "No documented employee training",
    ],
    requires: [
      "Written Hazard Communication program per 1910.1200(e)",
      "Safety Data Sheet for every hazardous chemical",
      "Labels on all chemical containers including secondary containers",
      "Employee training with documentation",
    ],
  },
  {
    num: 2,
    icon: Shield,
    title: "Lockout/Tagout (Control of Hazardous Energy)",
    cfr: "29 CFR 1910.147",
    tagline: "Frequently results in serious or willful citations due to severity of injuries.",
    why: [
      "No written procedures for specific equipment",
      "Training not documented",
      "Annual inspections not performed",
      "Procedures exist but aren't followed",
    ],
    requires: [
      "Written energy control procedures for each machine",
      "Locks and tags provided to authorized employees",
      "Training for authorized and affected employees",
      "Annual inspection of energy control procedures",
    ],
  },
  {
    num: 3,
    icon: FileText,
    title: "Machine Guarding",
    cfr: "29 CFR 1910.212",
    tagline: "Guards removed for maintenance and not replaced is the most common finding.",
    cta: { text: "Request a safety walkthrough — includes machine guarding audit", to: "/services" },
    why: [
      "Missing guards on grinders, lathes, presses, and saws",
      "Guards removed for maintenance and not replaced",
      "Safety interlocks bypassed or disabled",
      "Inadequate point-of-operation guarding",
    ],
    requires: [
      "Guards on all machines where operation exposes employees to injury",
      "Guards that prevent contact with hazardous areas",
      "Guards that cannot be easily bypassed or removed",
      "Proper anchoring to prevent guard displacement",
    ],
  },
  {
    num: 4,
    icon: Truck,
    title: "Powered Industrial Trucks (Forklifts)",
    cfr: "29 CFR 1910.178",
    tagline: "Most operators were trained informally with no documentation.",
    why: [
      "Operators trained informally with no documentation",
      "Training completed but not specific to equipment type",
      "No evaluation documentation",
      "Pre-shift inspections not performed or recorded",
    ],
    requires: [
      "Formal training (classroom instruction or equivalent)",
      "Practical training (demonstrations and exercises)",
      "Evaluation of operator competence in the workplace",
      "Training specific to the truck type and workplace conditions",
      "Refresher training every three years minimum",
      "Daily pre-shift vehicle inspections",
    ],
  },
  {
    num: 5,
    icon: Footprints,
    title: "Walking-Working Surfaces",
    cfr: "29 CFR 1910.22",
    tagline: "Slips, trips, and falls are the most common source of recordable injuries in general industry.",
    why: [
      "Cluttered aisles and blocked walkways",
      "Trip hazards (cables, hoses, uneven surfaces)",
      "Wet or slippery surfaces without controls",
      "Poor housekeeping practices",
    ],
    requires: [
      "Walking surfaces kept free of hazards (water, grease, debris)",
      "Aisles and passageways clear and marked",
      "Floor holes and openings covered or guarded",
      "Proper drainage where wet processes are used",
    ],
  },
];

const penaltyData = [
  { type: "Serious", amount: "Up to $16,550 per violation" },
  { type: "Other-Than-Serious", amount: "Up to $16,550 per violation" },
  { type: "Willful", amount: "Up to $165,514 per violation" },
  { type: "Repeat", amount: "Up to $165,514 per violation" },
  { type: "Failure to Abate", amount: "Up to $16,550 per day" },
];

const BlogOSHAViolations = () => {
  return (
    <main data-testid="blog-osha-violations">
      <SEO
        title={defined.headline}
        description={defined.description}
        canonical={defined.canonical}
        schema={combinedSchema}
      />

      {/* Hero */}
      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p
            className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            COMPLIANCE GUIDE
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="blog-headline"
          >
            {defined.headline}
          </h1>
          <p className="text-white/70 text-base leading-relaxed mb-6">
            The five most-cited OSHA violations in small manufacturing are Hazard Communication (1910.1200), Lockout/Tagout (1910.147), Machine Guarding (1910.212), Powered Industrial Trucks (1910.178), and Walking-Working Surfaces (1910.22). Each carries penalties up to $16,550 per serious violation or $165,514 for willful violations. Most citations occur because documentation is missing — not because the hazard was unknown.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Vince Lawrence</span>
            <span className="text-white/20">|</span>
            <span>April 2026</span>
            <span className="text-white/20">|</span>
            <span>8 min read</span>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-10 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <div className="bg-[#F9F8F6] border-l-3 border-[#2A52A0] p-6 rounded" style={{ borderLeft: '3px solid #2A52A0' }}>
            <h2 className="text-base font-bold text-[#1C2B2B] mb-3">The Five Standards</h2>
            <ol className="space-y-2">
              {violations.map((v) => (
                <li key={v.num} className="flex items-start gap-3 text-sm text-[#1C2B2B]/70">
                  <span className="font-bold text-[#2A52A0] flex-shrink-0">{v.num}.</span>
                  <span><strong className="text-[#1C2B2B]">{v.title}</strong> — <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>{v.cfr}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Penalty Table */}
      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="penalties">
        <div className="container max-w-3xl">
          <h2
            className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-2"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            What is the penalty for OSHA violations in 2025?
          </h2>
          <p className="text-sm text-[#1C2B2B]/50 mb-6">2026 OSHA maximum penalty schedule, effective after January 15, 2026. Adjusted annually for inflation.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="penalty-table">
              <thead>
                <tr className="border-b-2 border-[#2A52A0]/10">
                  <th className="text-left py-3 pr-4 font-semibold text-[#1C2B2B]">Violation Type</th>
                  <th className="text-right py-3 font-semibold text-[#1C2B2B]">Maximum Penalty</th>
                </tr>
              </thead>
              <tbody>
                {penaltyData.map((row) => (
                  <tr key={row.type} className="border-b border-[#2A52A0]/5">
                    <td className="py-3 pr-4 text-[#1C2B2B]/70">{row.type}</td>
                    <td className="py-3 text-right font-semibold text-[#1C2B2B]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#1C2B2B]/50 mt-4">
            Multiple violations can be cited separately — a single inspection can result in tens of thousands of dollars in fines.
          </p>
        </div>
      </section>

      {/* Violation Sections */}
      {violations.map((v) => (
        <section
          key={v.num}
          className="py-12 md:py-16 border-b border-[#2A52A0]/10"
          id={`violation-${v.num}`}
          data-testid={`violation-section-${v.num}`}
        >
          <div className="container max-w-3xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-[#102A43] text-white w-10 h-10 rounded flex items-center justify-center flex-shrink-0">
                <v.icon size={20} />
              </div>
              <div>
                <p
                  className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {v.cfr}
                </p>
                <h2
                  className="text-xl md:text-2xl font-bold text-[#1C2B2B]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {v.num}. {v.title}
                </h2>
              </div>
            </div>

            <p className="text-[#1C2B2B]/60 italic mb-8 text-sm">{v.tagline}</p>

            {v.cta && (
              <Link
                to={v.cta.to}
                className="inline-flex items-center gap-2 text-sm text-[#1F3F80] font-medium hover:underline mb-4"
              >
                {v.cta.text} <ArrowRight size={14} />
              </Link>
            )}

            {v.deepLink && (
              <div className="mb-8">
                <Link
                  to={v.deepLink.to}
                  className="inline-flex items-center gap-2 text-xs text-[#1C2B2B]/50 hover:text-[#1F3F80] transition-colors"
                >
                  {v.deepLink.text}
                </Link>
              </div>
            )}

            {!v.cta && !v.deepLink && <div className="mb-8" />}

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[#1C2B2B] mb-3 uppercase tracking-wider">Why It's Cited</h3>
                <ul className="space-y-2">
                  {v.why.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70">
                      <span className="text-red-500 mt-0.5 flex-shrink-0 text-xs">&#x2717;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1C2B2B] mb-3 uppercase tracking-wider">What OSHA Requires</h3>
                <ul className="space-y-2">
                  {v.requires.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70">
                      <span className="text-[#2A52A0] mt-0.5 flex-shrink-0 text-xs">&#x2713;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* How to Avoid */}
      <section className="py-12 md:py-16 bg-[#F9F8F6]" data-testid="how-to-avoid">
        <div className="container max-w-3xl">
          <h2
            className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            How can small manufacturers avoid OSHA violations?
          </h2>
          <ol className="space-y-4">
            {[
              { title: "Conduct self-assessments", desc: "Walk the facility looking for the five common violations" },
              { title: "Document everything", desc: "Most citations occur because paperwork is missing, not because hazards are unknown" },
              { title: "Maintain training records", desc: "Keep signed documentation for HazCom, LOTO, forklift, and other required training" },
              { title: "Complete required written programs", desc: "HazCom, LOTO, and other standards require written procedures" },
              { title: "Perform regular inspections", desc: "Daily forklift checks, annual LOTO procedure reviews, quarterly chemical inventory updates" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[#1C2B2B] text-sm">{item.title}</p>
                  <p className="text-sm text-[#1C2B2B]/60">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Signs Section */}
      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <h2
            className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            How do I know if my shop has OSHA violations?
          </h2>
          <p className="text-[#1C2B2B]/60 mb-6 text-sm">Signs your operation may have compliance gaps:</p>
          <ul className="space-y-3 mb-8">
            {[
              "No written Hazard Communication program on file",
              "SDS binder is incomplete or disorganized",
              "Employees were trained but there's no documentation",
              "Forklift operators learned on the job without formal training",
              "Machine guards are missing or have been removed",
              "Lockout/Tagout procedures exist only verbally",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C2B2B]/70">
                <span className="text-[#2A52A0] font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/80 font-medium text-sm">
            A focused safety walkthrough can identify these gaps before an inspector does.
          </p>
        </div>
      </section>

      {/* Related Resources / CTA */}
      <section className="py-14 md:py-20 bg-[#102A43] text-white" data-testid="blog-cta-section">
        <div className="container max-w-3xl">
          <h2
            className="text-xl md:text-2xl font-bold mb-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Related Resources
          </h2>
          <div className="space-y-4 mb-10">
            <Link
              to="/safety-check"
              className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group"
              data-testid="blog-cta-safety-check"
            >
              <div>
                <p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Run the GigLine Safety Check</p>
                <p className="text-xs text-white/50 mt-1">Free 90-second self-assessment</p>
              </div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group"
              data-testid="blog-cta-contact"
            >
              <div>
                <p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Request a Safety Walkthrough</p>
                <p className="text-xs text-white/50 mt-1">On-site review starting at $1,200</p>
              </div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link
              to="/hazcom"
              className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group"
              data-testid="blog-cta-hazcom"
            >
              <div>
                <p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">HazCom Starter Pack</p>
                <p className="text-xs text-white/50 mt-1">Written program, SDS checklist, training log — $29</p>
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
            <Link to="/intake" className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">
              Request a Safety Walkthrough <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Author Box */}
      <section className="py-10 border-t border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#102A43] flex items-center justify-center flex-shrink-0">
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
              <p className="text-xs text-[#1C2B2B]/40 mt-2 italic">
                Penalty amounts reflect OSHA&rsquo;s 2026 maximum penalty adjustments effective after January 15, 2026. Actual penalties depend on classification, employer size, gravity, history, and good-faith factors.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogOSHAViolations;
