import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, AlertTriangle, Wrench, ClipboardCheck, Eye, FileText } from 'lucide-react';
import SEO from '../components/SEO';

const defined = {
  headline: "OSHA Machine Guarding Checklist for Small Manufacturers",
  description: "The machine guarding requirements OSHA cites most often in small manufacturing — with a practical checklist, CFR citations, and 2026 penalty exposures. Written by a safety consultant who walks NC production floors weekly.",
  canonical: "/blog/osha-machine-guarding-checklist-small-manufacturers",
  datePublished: "2025-10-14",
  dateModified: "2025-10-14",
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": defined.headline,
  "description": defined.description,
  "author": { "@type": "Person", "name": "Vince Lawrence", "jobTitle": "Safety Consultant", "affiliation": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" } },
  "publisher": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" },
  "datePublished": defined.datePublished,
  "dateModified": defined.dateModified,
  "mainEntityOfPage": { "@type": "WebPage", "@id": `https://giglinecompliance.com${defined.canonical}` }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is OSHA's machine guarding standard for small businesses?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA 29 CFR 1910.212 applies to every general industry employer regardless of size. It requires that any machine part, function, or process that may cause injury be safeguarded. The standard also covers point of operation guarding under 1910.212(a)(3) and specific machine categories under 1910.213–219." } },
    { "@type": "Question", "name": "Which machine guarding violations does OSHA cite most often?", "acceptedAnswer": { "@type": "Answer", "text": "The top three in general industry are: unguarded point of operation (1910.212(a)(3)(ii)), missing perimeter guarding on rotating parts (1910.212(a)(1)), and lack of guards on abrasive wheels (1910.215). Machine guarding is consistently in OSHA's Top 10 most-cited standards list." } },
    { "@type": "Question", "name": "What is the maximum OSHA penalty for a machine guarding violation in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Serious machine guarding violations carry a maximum penalty of $16,550 per violation under OSHA's 2026 adjusted penalty schedule (29 CFR 1903.15). Willful or repeat violations can reach $165,514 per violation. Small employers may qualify for reductions, but every unguarded point of operation is a separate citable violation." } },
    { "@type": "Question", "name": "Do I need machine-specific written procedures?", "acceptedAnswer": { "@type": "Answer", "text": "Yes for anything requiring lockout/tagout (1910.147) — every energized machine needs its own written LOTO procedure. Machine guarding itself is generally covered by the site-wide guarding program, but shear points, kick presses, and abrasive wheels benefit from machine-specific safe operating procedures posted at the workstation." } },
    { "@type": "Question", "name": "Can I use presence-sensing devices instead of physical guards?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. OSHA 1910.212 accepts light curtains, presence-sensing mats, two-hand controls, and safety fences as alternative safeguarding — provided they meet ANSI B11 series standards for the specific machine and are validated to stop hazardous motion before the operator reaches the point of operation. The choice is engineering, not documentation." } },
    { "@type": "Question", "name": "How do I verify guards weren't removed during production?", "acceptedAnswer": { "@type": "Answer", "text": "A documented daily machine inspection log signed by the operator or supervisor. Photographic evidence of the guarded state at shift start. Supervisor walk-arounds during production. Bypass of a guard for maintenance without LOTO is one of the fastest ways to convert a good machine guarding program into a citation and a serious injury." } }
  ]
};

const combinedSchema = [articleSchema, faqSchema];

const hazards = [
  { icon: AlertTriangle, cfr: "1910.212(a)(1)", title: "Point of operation exposure", desc: "The spot where actual work is performed on the material. Presses, shears, saws, punches, milling machines — anywhere the tooling contacts the workpiece." },
  { icon: Wrench, cfr: "1910.212(a)(1)", title: "In-going nip points", desc: "Two rotating parts moving toward each other. Rollers, gears, chain-and-sprocket drives, belts and pulleys under 7 feet from the floor." },
  { icon: Shield, cfr: "1910.212(a)(1)", title: "Rotating parts", desc: "Any exposed shaft, coupling, spindle, or flywheel that could catch clothing, hair, or PPE. This includes set screws, keys, and bolts protruding from rotating members." },
  { icon: Eye, cfr: "1910.212(a)(1)", title: "Flying chips and sparks", desc: "Grinding, cutting, welding, and abrasive operations. Requires either enclosed guarding, shields, or supplementary PPE — not just safety glasses." },
];

const checklist = [
  { area: "Point of Operation", items: [
    "Every press, shear, punch, and cutter has a fixed, interlocked, or presence-sensing guard covering the point of operation",
    "Two-hand controls where used are anti-tie-down type and require concurrent activation",
    "Light curtains are tested weekly with a documented log",
    "Foot switches have covers to prevent inadvertent activation",
  ]},
  { area: "Rotating & Reciprocating Parts", items: [
    "All exposed shafts, couplings, and set screws below 7 feet from the floor are guarded",
    "Belts, pulleys, chains, and sprockets within 7 feet of the floor are enclosed",
    "Gears with any part exposed below 7 feet are fully enclosed",
    "Flywheels within 7 feet of the floor are fully guarded",
  ]},
  { area: "Abrasive Wheels (1910.215)", items: [
    "Wheel safety guards installed on all bench, pedestal, and portable grinders",
    "Work rest gap ≤ 1/8 inch from wheel face",
    "Tongue guard gap ≤ 1/4 inch from wheel periphery",
    "Wheels ring-tested before mounting and inspected for damage before each use",
  ]},
  { area: "Documentation", items: [
    "Machine guarding hazard assessment completed and dated for every machine",
    "Guard removal/reinstallation logged (typically tied into LOTO records)",
    "Operator training documented with employee name, machine, and date",
    "Monthly supervisor guarding walk-through documented on a checklist",
  ]},
];

const BlogMachineGuardingChecklist = () => {
  return (
    <main data-testid="blog-machine-guarding-checklist">
      <SEO title={defined.headline} description={defined.description} canonical={defined.canonical} schema={combinedSchema} />

      {/* Hero */}
      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>COMPLIANCE GUIDE</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="blog-machine-guarding-headline">{defined.headline}</h1>
          <p className="text-white/70 text-base leading-relaxed mb-6">Machine guarding sits in the OSHA Top 10 every single year. Not because employers are careless — because there are dozens of nip points, pinch points, and points of operation in a small production shop, and it only takes one missing guard to draw a citation. This checklist walks you through what an OSHA inspector actually looks for, in the order they look for it.</p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Vince Lawrence</span><span className="text-white/20">|</span><span>October 2025</span><span className="text-white/20">|</span><span>11 min read</span>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="py-8 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>IN THIS GUIDE</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { id: "what-standard-requires", label: "What 1910.212 actually says" },
              { id: "four-hazards", label: "The four hazard categories" },
              { id: "checklist", label: "The walkthrough checklist" },
              { id: "top-citations", label: "Top citation traps" },
              { id: "penalties", label: "2026 penalty exposure" },
              { id: "training", label: "Training & documentation" },
              { id: "abrasive-wheels", label: "Abrasive wheels (1910.215)" },
              { id: "action-plan", label: "30-day action plan" },
            ].map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80] transition-colors">{item.label}</a></li>
            ))}
          </ul>
        </div>
      </section>

      {/* What the standard requires */}
      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="what-standard-requires">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>What OSHA 1910.212 actually says</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The full text of the general machine guarding standard runs about half a page. Compliance officers reduce it to one sentence: <em>"One or more methods of machine guarding shall be provided to protect the operator and other employees in the machine area from hazards such as those created by point of operation, ingoing nip points, rotating parts, flying chips and sparks."</em></p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">That is the entire enforcement framework. If any of those four hazards exists on a machine in your facility and the operator or a nearby employee can reach it during normal operation or a foreseeable circumstance, you need a guard. Which kind of guard is engineering — fixed, interlocked, adjustable, self-adjusting, presence-sensing. Whether you need one is not a judgment call.</p>
          <p className="text-[#1C2B2B]/60 text-sm">Most facilities I walk into have 80% of guards in place. It's the 20% — a shear head with the perimeter fence removed for a jam five months ago, a bench grinder with a work rest gap you could put a finger through, a floor-level belt drive on an old blower — that generates the citation.</p>
        </div>
      </section>

      {/* Four hazards */}
      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="four-hazards">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The four hazard categories OSHA cites</h2>
          <div className="space-y-6">
            {hazards.map((h, i) => (
              <div key={i} className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
                <div className="flex items-start gap-3 mb-3">
                  <h.icon size={22} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{h.cfr}</p>
                    <h3 className="text-base font-bold text-[#1C2B2B]">{h.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-[#1C2B2B]/70 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="checklist" data-testid="mg-checklist">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The walkthrough checklist</h2>
          <p className="text-[#1C2B2B]/60 text-sm mb-8">Print this and walk the floor with it. If any item is unchecked, it is either a finding waiting to be documented or an active citation risk.</p>
          <div className="space-y-8">
            {checklist.map((c, i) => (
              <div key={i} className="border-l-4 border-[#C9A84C] pl-5">
                <h3 className="text-base font-bold text-[#1C2B2B] mb-3">{c.area}</h3>
                <ul className="space-y-2">
                  {c.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><ClipboardCheck size={16} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top citation traps */}
      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="top-citations">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The five citations that trip up small manufacturers</h2>
          <ol className="space-y-4">
            {[
              { t: "Bench grinder work rest gaps", d: "1910.215(a)(4) requires the gap between the work rest and wheel face to be no more than 1/8 inch. This is the single most-cited machine guarding item in small shops. Adjust or replace." },
              { t: "Shear point of operation on roll formers", d: "The cut-off blade on a roll former is a point of operation under 1910.212(a)(3)(ii). Perimeter rails don't cover it. Requires light curtains, an enclosure, or a two-hand control positioned outside the hazard zone." },
              { t: "Missing chip guards on lathes and mills", d: "The chuck end and any exposed rotating tooling need a guard adequate to contain flying chips. 1910.212(a)(1). A pair of safety glasses is not a guard." },
              { t: "Unguarded floor-level belt drives", d: "Any belt or pulley within 7 feet of the floor is required to be enclosed per 1910.219. Older ventilation blowers, air compressors mounted low, and drive motors on abrasive saws are the usual suspects." },
              { t: "Guards removed for jam clearing and not reinstalled", d: "Especially common on shears and material feeders. The guard sits on a workbench three feet away. If OSHA sees the machine running without it — even briefly — that's a citation regardless of intent." },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm">{item.t}</p><p className="text-sm text-[#1C2B2B]/60">{item.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Penalties */}
      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="penalties">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>2026 penalty exposure</h2>
          <div className="bg-white border border-[#2A52A0]/10 rounded overflow-hidden">
            {[
              { type: "Serious violation", amount: "Up to $16,550 per violation" },
              { type: "Willful violation", amount: "Up to $165,514 per violation" },
              { type: "Repeat violation", amount: "Up to $165,514 per violation" },
              { type: "Other-than-serious", amount: "Up to $16,550 per violation" },
            ].map((p, i) => (
              <div key={i} className={`flex justify-between items-center py-4 px-6 ${i > 0 ? 'border-t border-[#2A52A0]/10' : ''}`}>
                <span className="text-sm font-medium text-[#1C2B2B]">{p.type}</span>
                <span className="text-sm font-bold text-[#1F3F80]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.amount}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#1C2B2B]/50 mt-4 italic">Source: 29 CFR 1903.15(d), OSHA 2026 Civil Penalty Adjustments. Every unguarded point of operation on a distinct machine can be a separate citable violation.</p>
        </div>
      </section>

      {/* Training */}
      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="training">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Training and documentation</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Physical guards fail the audit if there is no record showing operators knew how to use them. OSHA does not prescribe a training curriculum for machine guarding under 1910.212 — but the general duty clause and 1910.132 (PPE hazard assessment) essentially require you to document that operators were trained on the specific hazards of the machines they run.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">At minimum, keep training records that include:</p>
          <ul className="space-y-2 mb-6">
            {["Employee name and signature","Date of training","Machines covered","Topics: hazards, guard function, procedure for jams, when to shut down","Trainer name and qualification"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">The best training records I see in the field are one page per employee, laminated, hanging in the machine cell. Any inspector — internal or OSHA — can find them in ten seconds.</p>
        </div>
      </section>

      {/* Abrasive wheels */}
      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="abrasive-wheels">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The abrasive wheel problem (1910.215)</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Bench and pedestal grinders deserve their own section because they generate more machine guarding citations than any other equipment in general industry. Three geometric requirements — that's it — and most shops fail at least one:</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">1.</span><span><strong className="text-[#1C2B2B]">Work rest gap ≤ 1/8"</strong> — measured from the wheel face to the tool rest. Anything bigger and a workpiece can wedge, causing the wheel to burst.</span></li>
            <li className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">2.</span><span><strong className="text-[#1C2B2B]">Tongue guard gap ≤ 1/4"</strong> — the adjustable piece at the top of the wheel guard that follows the wheel as it wears down.</span></li>
            <li className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">3.</span><span><strong className="text-[#1C2B2B]">Ring test before mounting</strong> — tap the wheel with a non-metallic object. A cracked wheel produces a dull thud. An intact wheel rings clearly.</span></li>
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">Add a laminated card at every grinder station with these three specs and a small ruler. Any employee can verify compliance in under 30 seconds.</p>
        </div>
      </section>

      {/* Action plan */}
      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="action-plan">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The 30-day action plan</h2>
          <ol className="space-y-6">
            {[
              { title: "Week 1: Inventory & assess", desc: "Walk the floor with the checklist above. Photograph every guard. Flag every missing, damaged, or bypassed guard with a red tag. Do not judge yet — just catalog." },
              { title: "Week 2: Fix the P1 items", desc: "Anything creating immediate injury risk gets fixed this week. Grinder gaps, missing point-of-operation guards, unlocked floor-level belt drives. Reinstall or replace." },
              { title: "Week 3: Documentation", desc: "Write or update the guarding portion of your IIPP. Create a per-machine hazard assessment. Assemble training records. Print laminated cards for grinder stations." },
              { title: "Week 4: Train & verify", desc: "Retrain every operator on the machines they touch. Sign each training record. Establish a monthly supervisor guarding walk-through with a signed checklist. Post the OSHA 300A if you haven't." },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm">{step.title}</p><p className="text-sm text-[#1C2B2B]/60">{step.desc}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-14 md:py-20 bg-[#102A43] text-white" data-testid="mg-blog-cta">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Related Resources</h2>
          <div className="space-y-4 mb-10">
            <Link to="/safety-walkthrough" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Safety Walkthrough — $1,200</p><p className="text-xs text-white/50 mt-1">On-site machine-by-machine review with a photo-documented "Top 10 Fixes" report in 48 hours.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/services/compliance-readiness-visit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Compliance Readiness Visit</p><p className="text-xs text-white/50 mt-1">Floor + documentation audit. Combined report + 90-day remediation tracker.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/safety-check" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Run the Free Safety Check</p><p className="text-xs text-white/50 mt-1">90-second self-assessment. Score your operation on machine guarding + 6 other categories.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>KEEP READING</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Link to="/blog/loto-program-requirements-small-facilities" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ LOTO Program Requirements</Link>
              <Link to="/blog/osha-forklift-compliance-inspector-checklist" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ OSHA Forklift Compliance</Link>
              <Link to="/blog/osha-300-log-common-mistakes-citations" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ OSHA 300 Log Mistakes</Link>
              <Link to="/blog/top-5-osha-violations-small-manufacturing" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Top 5 OSHA Violations</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Walkthrough Callout */}
      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-3xl">
          <div className="border border-[#2A52A0]/20 bg-white rounded-lg p-6 md:p-8 text-center">
            <p className="text-lg font-bold text-[#1C2B2B] mb-2">Not sure which guards are missing in your shop?</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-5">A GigLine Safety Walkthrough documents every unguarded hazard with photos and CFR citations — usually within 48 hours.</p>
            <Link to="/intake" className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">Request a Safety Walkthrough <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Author */}
      <section className="py-10 border-t border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#102A43] flex items-center justify-center flex-shrink-0"><span className="text-white font-bold text-sm">VL</span></div>
            <div>
              <p className="font-semibold text-[#1C2B2B] text-sm">Vince Lawrence</p>
              <p className="text-xs text-[#1C2B2B]/50 mb-2">Safety Consultant, OSHA 30-Hour Certified, U.S. Navy Veteran</p>
              <p className="text-xs text-[#1C2B2B]/50">GigLine Safety & Compliance — Kernersville, NC <span className="text-[#1C2B2B]/30 mx-1">|</span> <a href="tel:3363298899" className="text-[#1F3F80] hover:underline">(336) 329-8899</a> <span className="text-[#1C2B2B]/30 mx-1">|</span> <a href="mailto:vince@giglinecompliance.com" className="text-[#1F3F80] hover:underline">vince@giglinecompliance.com</a></p>
              <p className="text-xs text-[#1C2B2B]/40 mt-2 italic">Penalty amounts reflect OSHA&rsquo;s 2026 maximum penalty adjustments effective after January 15, 2026. Actual penalties depend on classification, employer size, gravity, history, and good-faith factors.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogMachineGuardingChecklist;
