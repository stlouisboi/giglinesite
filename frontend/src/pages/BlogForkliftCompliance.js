import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, FileText, Users, ClipboardCheck, AlertTriangle, Award } from 'lucide-react';
import SEO from '../components/SEO';
import StickyTOC from '../components/StickyTOC';
import { SUPERVISOR_KIT_ENABLED } from '../config/features';

const tocItems = [
  { id: "what-standard", label: "The 1910.178 standard" },
  { id: "six-checks", label: "Six things inspectors check" },
  { id: "certifications", label: "Operator certifications" },
  { id: "daily-log", label: "The daily inspection log" },
  { id: "traffic", label: "Traffic controls" },
  { id: "citations", label: "Top forklift citations" },
  { id: "penalties", label: "2026 penalty exposure" },
  { id: "action", label: "30-day cleanup plan" },
];

const defined = {
  headline: "OSHA Forklift Compliance: What Inspectors Actually Check",
  description: "The forklift-related items OSHA inspectors ask for first — operator certifications, daily inspection logs, traffic controls — with the CFR sections and 2026 penalty exposures. From a consultant walking Piedmont Triad warehouse floors weekly.",
  canonical: "/blog/osha-forklift-compliance-inspector-checklist",
  datePublished: "2025-11-11",
  dateModified: "2025-11-11",
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  "headline": defined.headline, "description": defined.description,
  "author": { "@type": "Person", "name": "Vince Lawrence", "jobTitle": "Safety Consultant", "affiliation": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" } },
  "publisher": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" },
  "datePublished": defined.datePublished, "dateModified": defined.dateModified,
  "mainEntityOfPage": { "@type": "WebPage", "@id": `https://giglinecompliance.com${defined.canonical}` }
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "How often does forklift operator certification need to be renewed?", "acceptedAnswer": { "@type": "Answer", "text": "Every three years per OSHA 29 CFR 1910.178(l)(4)(iii). Evaluation of each operator's performance must be conducted at least once every three years, or sooner if the operator is involved in an accident, near-miss, has an unsafe operation observation, is assigned a different type of truck, or if workplace conditions change." } },
    { "@type": "Question", "name": "What is required in an OSHA forklift inspection log?", "acceptedAnswer": { "@type": "Answer", "text": "1910.178(q)(7) requires inspection before use — at least daily, and before each shift if used around the clock. The log should identify the truck, the date, the operator, and defects found. If a defect makes the truck unsafe, it must be removed from service until repaired. Written records are best practice; some OSHA regions accept verbal reports if documented." } },
    { "@type": "Question", "name": "What is the maximum OSHA penalty for forklift violations in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Serious forklift violations carry up to $16,550 per violation under OSHA's 2026 penalty schedule (29 CFR 1903.15). Willful or repeat violations reach $165,514. Multi-employee training or certification failures can result in one citation per employee, multiplying exposure." } },
    { "@type": "Question", "name": "Do I need separate certifications for different types of forklifts?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. OSHA classifies powered industrial trucks into seven classes (electric riders, electric narrow aisle, motorized hand trucks, internal combustion cushion tire, internal combustion pneumatic tire, electric stand-up, and rough terrain). Operators must be certified for each class of truck they operate. A Class 4 certification does not authorize operation of a Class 7 rough-terrain truck." } },
    { "@type": "Question", "name": "Are pedestrian traffic controls required around forklifts?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA does not prescribe specific pedestrian controls, but 1910.176(a) and the general duty clause require separation of pedestrians and powered industrial trucks. Best-practice controls include painted pedestrian lanes, blue safety lights, convex mirrors at intersections, defined loading zones, and 'no phone' rules for operators." } },
    { "@type": "Question", "name": "Can I certify my own forklift operators?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, as long as the trainer has the knowledge, training, and experience to train operators and evaluate their competence per 1910.178(l)(2)(iii). The trainer does not need external credentials, but must be able to demonstrate they meet OSHA's competency criteria. Training records must be complete and retained for the duration of the operator's employment." } }
  ]
};

const combinedSchema = [articleSchema, faqSchema];

const inspectorChecks = [
  { icon: Award, cfr: "1910.178(l)(4)(iii)", title: "Operator certifications", desc: "Certificates on file for every operator, dated within three years, listing the specific truck classes each is authorized to operate. Missing dates, missing signatures, or expired evaluations are the most common finding." },
  { icon: ClipboardCheck, cfr: "1910.178(q)(7)", title: "Daily inspection logs", desc: "A written pre-shift inspection log for every truck. Missing dates, unsigned entries, or a defect noted with no follow-up abatement — all citation triggers." },
  { icon: Truck, cfr: "1910.178(l)(6)", title: "Refresher training records", desc: "Evidence that any operator involved in an accident, near-miss, or unsafe-operation observation was retrained. If your incident log shows an event and your training records don't show follow-up, that's a finding." },
  { icon: AlertTriangle, cfr: "1910.178(m)(14)", title: "Fueling and battery-charging areas", desc: "Designated location, ventilation, no smoking signs, fire extinguisher, eye-wash if lead-acid batteries. Battery-charging area is a favorite inspector stop." },
  { icon: Users, cfr: "1910.178(m)(10)", title: "Pedestrian-truck separation", desc: "Painted lanes, mirrors at blind corners, signage. Not required by rule name, but OSHA cites under the general duty clause when the traffic pattern creates struck-by hazards." },
  { icon: FileText, cfr: "1910.178(n)(1)", title: "Load-handling documentation", desc: "The data plate on every truck is legible and matches the operator's training. Attachments (side-shifters, roll clamps, drum handlers) modify capacity — the modified plate must be posted." },
];

const dailyChecklist = [
  { area: "Pre-start (engine off)", items: ["Tires — inflated, no cuts, correct pressure","Forks — no cracks, aligned, retention pin secure","Chains — no broken links, lubricated, correct tension","Hoses and lines — no leaks or damage","Overhead guard — no damage, all bolts present","Data plate legible with capacity and lift height","Fluid levels — oil, hydraulic, coolant, battery","Fire extinguisher — pressure OK, tagged current"] },
  { area: "Start-up & running (engine on)", items: ["Horn functions","Backup alarm functions","Headlights, taillights, and strobes","Steering has no excessive play","Brakes hold on incline","Parking brake holds","Lift and lower controls smooth","Tilt controls smooth in both directions","No unusual noises or smells"] },
];

const BlogForkliftCompliance = () => {
  return (
    <main data-testid="blog-forklift-compliance">
      <SEO title={defined.headline} description={defined.description} canonical={defined.canonical} schema={combinedSchema} />
      <StickyTOC items={tocItems} />

      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>COMPLIANCE GUIDE</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="blog-forklift-headline">{defined.headline}</h1>
          <p className="text-white/70 text-base leading-relaxed mb-6">Every warehouse walkthrough I do starts the same way: I ask for the forklift certifications and the last thirty days of inspection logs. In about half of facilities, the certifications are current and the logs are missing. In the other half it's the reverse. Here is what OSHA actually asks for during a forklift-focused inspection and how to have all of it ready before they walk in.</p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Vince Lawrence</span><span className="text-white/20">|</span><span>November 2025</span><span className="text-white/20">|</span><span>10 min read</span>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>IN THIS GUIDE</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { id: "what-standard", label: "The 1910.178 standard" },
              { id: "six-checks", label: "Six things inspectors check" },
              { id: "certifications", label: "Operator certifications" },
              { id: "daily-log", label: "The daily inspection log" },
              { id: "traffic", label: "Traffic controls" },
              { id: "citations", label: "Top forklift citations" },
              { id: "penalties", label: "2026 penalty exposure" },
              { id: "action", label: "30-day cleanup plan" },
            ].map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80] transition-colors">{item.label}</a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="what-standard">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>What OSHA 1910.178 covers</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The powered industrial truck standard — <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>29 CFR 1910.178</span> — is one of OSHA's most cited standards year after year. It applies to any high-lift trucks, lift trucks, tractors, platform trucks, motorized hand trucks, and other specialized industrial vehicles powered by electric motors or internal combustion engines.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The standard breaks down into a handful of program areas:</p>
          <ul className="space-y-2 mb-6">
            {["Truck design and modifications (1910.178(a))","Truck operations (1910.178(m))","Loading (1910.178(o))","Battery charging installations (1910.178(g))","Maintenance and inspection (1910.178(q))","Operator training and certification (1910.178(l))"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">Operator training (l) and inspection logs (q) are the two subsections that generate the most citations. Both are documentation problems, not equipment problems.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="six-checks">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Six things a forklift inspector checks first</h2>
          <div className="space-y-6">
            {inspectorChecks.map((c, i) => (
              <div key={i} className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
                <div className="flex items-start gap-3 mb-3">
                  <c.icon size={22} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{c.cfr}</p>
                    <h3 className="text-base font-bold text-[#1C2B2B]">{c.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-[#1C2B2B]/70 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="certifications">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Operator certification — what it actually requires</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">OSHA does not license forklift operators. The employer certifies them. That certification must include three parts:</p>
          <ol className="space-y-4 mb-6">
            <li className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">1.</span><span><strong className="text-[#1C2B2B]">Formal instruction</strong> — classroom or video training covering the topics in 1910.178(l)(3)(i).</span></li>
            <li className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">2.</span><span><strong className="text-[#1C2B2B]">Practical training</strong> — hands-on driving and load-handling exercises specific to the truck type and workplace.</span></li>
            <li className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">3.</span><span><strong className="text-[#1C2B2B]">Evaluation of performance</strong> — an observed evaluation of the operator actually driving the truck in the workplace. This is the piece most facilities skip or document poorly.</span></li>
          </ol>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The certificate itself must list:</p>
          <ul className="space-y-2 mb-6">
            {["Operator name","Date of training","Date of evaluation","Truck classes the operator is authorized to run","Signature of the trainer or evaluator"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">Missing signature on the practical evaluation is the single most common defect I see on otherwise complete certifications.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="daily-log">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The daily inspection log — what to include</h2>
          <p className="text-[#1C2B2B]/60 text-sm mb-8">Split into two phases. Every operator, every truck, every shift.</p>
          <div className="space-y-8">
            {dailyChecklist.map((c, i) => (
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

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="traffic">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Traffic controls — what OSHA looks for</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Struck-by-forklift is one of the top mechanisms of fatality in warehouse operations. OSHA does not prescribe specific engineering controls, but during any inspection with forklift activity the officer will note the traffic separation between pedestrians and trucks.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">A well-controlled facility typically has:</p>
          <ul className="space-y-2 mb-6">
            {["Yellow-painted pedestrian walkways separated from truck paths","Convex mirrors at every blind intersection","Blue safety spotlights projected onto the floor 15 feet ahead of the truck (Class 1 & 4 pedestrian visibility)","Physical barriers (bollards, rails) at pedestrian doorways and workstations","Defined loading zones with signage and cone-off","A written policy prohibiting phone use by operators","Speed limits posted at aisle entrances","Horns required at intersections and blind corners"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="citations">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The five forklift citations that hit small warehouses</h2>
          <ol className="space-y-4">
            {[
              { t: "Expired operator evaluations — 1910.178(l)(4)(iii)", d: "The three-year clock runs on the evaluation, not the classroom training. A facility that hasn't documented a walking-around observation in three years is out of compliance even if all operators completed initial training." },
              { t: "Missing daily inspection log — 1910.178(q)(7)", d: "Inspections are performed but there is no written record. Or logs exist for the front two trucks but not the back forklift used weekly in the drum-storage area." },
              { t: "Damaged or missing data plate — 1910.178(a)(6)", d: "The nameplate is scraped off, unreadable, or the truck was modified with an attachment and the new capacity plate was never obtained from the manufacturer." },
              { t: "Attachment used without capacity plate — 1910.178(a)(4)", d: "Side-shifters, roll clamps, and drum-handling attachments change lifting capacity. When the truck runs with the attachment, the modified capacity plate must be posted." },
              { t: "No signal alarm on truck operating in an area with obstructed vision — 1910.178(l)(3)(ii)", d: "OSHA increasingly cites when facilities operate trucks in areas where visibility is limited and there is no backup alarm, spotter, or convex mirror system in place." },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm">{item.t}</p><p className="text-sm text-[#1C2B2B]/60">{item.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

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
          <p className="text-xs text-[#1C2B2B]/50 mt-4 italic">Source: 29 CFR 1903.15(d), OSHA 2026 Civil Penalty Adjustments. Missing training for multiple operators can be cited per-operator, multiplying exposure.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="action">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>30-day forklift cleanup plan</h2>
          <ol className="space-y-6">
            {[
              { title: "Week 1: Certification audit", desc: "Pull every operator file. Verify formal training, practical training, and evaluation dates. Anyone with an evaluation older than 3 years — schedule a re-evaluation." },
              { title: "Week 2: Inspection log recovery", desc: "Print a standardized pre-shift checklist for every truck. Attach a clipboard to each truck's overhead guard. Track completion daily for the first two weeks." },
              { title: "Week 3: Data plates and attachments", desc: "Photograph every data plate. Any missing or illegible one — order a replacement from the manufacturer. Confirm each attachment has its modified capacity plate posted." },
              { title: "Week 4: Traffic and training", desc: "Paint pedestrian lanes. Install convex mirrors. Post speed limit signs at aisle entrances. Update the operator training curriculum to include the site-specific traffic plan." },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm">{step.title}</p><p className="text-sm text-[#1C2B2B]/60">{step.desc}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-[#102A43] text-white">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Related Resources</h2>
          <div className="space-y-4 mb-10">
            <Link to="/safety-walkthrough" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Safety Walkthrough — $1,200</p><p className="text-xs text-white/50 mt-1">Warehouse floor review including forklift program, traffic controls, and pedestrian separation.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            {SUPERVISOR_KIT_ENABLED && (
            <Link to="/supervisor-kit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Supervisor Safety Starter System — $600</p><p className="text-xs text-white/50 mt-1">11 print-ready documents including forklift inspection log and operator certification template.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            )}
            <Link to="/forklift-compliance-review-nc" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Forklift Compliance Review</p><p className="text-xs text-white/50 mt-1">Standalone forklift program audit including certifications and daily inspection logs.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>KEEP READING</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Link to="/blog/osha-machine-guarding-checklist-small-manufacturers" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Machine Guarding Checklist</Link>
              <Link to="/blog/loto-program-requirements-small-facilities" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ LOTO Program Requirements</Link>
              <Link to="/blog/osha-300-log-common-mistakes-citations" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ OSHA 300 Log Mistakes</Link>
              <Link to="/blog/written-hazcom-program-before-osha-inspection" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ HazCom Before OSHA</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-3xl">
          <div className="border border-[#2A52A0]/20 bg-white rounded-lg p-6 md:p-8 text-center">
            <p className="text-lg font-bold text-[#1C2B2B] mb-2">Not sure your forklift program would survive an inspection?</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-5">A Safety Walkthrough documents the state of your certifications, inspection logs, and traffic controls before OSHA does — with photos and a fix list in 48 hours.</p>
            <Link to="/intake" className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">Request a Safety Walkthrough <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

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

export default BlogForkliftCompliance;
