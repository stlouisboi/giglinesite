import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FileText, ClipboardCheck, AlertTriangle, Tag } from 'lucide-react';
import SEO from '../components/SEO';
import StickyTOC from '../components/StickyTOC';

const tocItems = [
  { id: "why-hazcom", label: "Why HazCom keeps getting cited" },
  { id: "inspector-flow", label: "The inspector's five-step flow" },
  { id: "elements", label: "Required program elements" },
  { id: "sds-binder", label: "The SDS binder" },
  { id: "labels", label: "Container labels" },
  { id: "training", label: "Training documentation" },
  { id: "citations", label: "Top citation traps" },
  { id: "action", label: "30-day cleanup plan" },
];

const defined = {
  headline: "Written HazCom Program: What You Need Before an OSHA Inspection",
  description: "The written Hazard Communication program checklist OSHA works through during an inspection — chemical inventory, SDS binder, GHS labels, training records. From a consultant walking Piedmont Triad shops weekly.",
  canonical: "/blog/written-hazcom-program-before-osha-inspection",
  datePublished: "2025-11-25",
  dateModified: "2025-11-25",
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
    { "@type": "Question", "name": "What must be in a written HazCom program?", "acceptedAnswer": { "@type": "Answer", "text": "Per 29 CFR 1910.1200(e)(1), the written program must contain: (1) a list of hazardous chemicals in the workplace, (2) methods used to inform employees of hazards, (3) how labels and other forms of warning are used, and (4) how SDS are maintained. Small businesses often have a template but no chemical inventory attached — that alone is a citable gap." } },
    { "@type": "Question", "name": "Does an OSHA inspector ask to see the SDS binder first?", "acceptedAnswer": { "@type": "Answer", "text": "In most general industry inspections, yes. The inspector will ask an employee to retrieve the SDS for a specific chemical they use. If the employee can't find it within a reasonable time — usually 60 seconds or less — that is treated as failure to make SDS 'readily accessible' under 1910.1200(g)(1). Digital binders count if employees can reach a computer or tablet." } },
    { "@type": "Question", "name": "What labels does OSHA require on secondary containers?", "acceptedAnswer": { "@type": "Answer", "text": "Under 1910.1200(f)(6), secondary containers (spray bottles, transfer jugs, mixing tanks) that are not used exclusively by the person who filled them must be labeled with the product identifier AND general information regarding hazards. GHS pictograms are the safest approach. An unlabeled spray bottle is one of the fastest citations to write." } },
    { "@type": "Question", "name": "How long must HazCom training records be kept?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA's HazCom standard does not specify a retention period, but 29 CFR 1904.33 requires OSHA-related records to be kept for the duration of the injury/illness log they support. Best practice: keep HazCom training records for the duration of employment plus five years. Some state OSHA programs (including North Carolina) have their own retention requirements." } },
    { "@type": "Question", "name": "Do consumer products need to be in the HazCom program?", "acceptedAnswer": { "@type": "Answer", "text": "Products used in the workplace in the same manner and duration as a household consumer would use them are exempt under 1910.1200(b)(6)(ix). One person cleaning a break room with a single spray bottle of Windex — probably exempt. A janitorial crew using industrial-quantity Windex daily for several hours — not exempt. When in doubt, include it in your program." } },
    { "@type": "Question", "name": "What is the maximum HazCom penalty in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Serious HazCom violations carry up to $16,550 per violation under OSHA's 2026 adjusted schedule (29 CFR 1903.15). Willful or repeat violations reach $165,514. HazCom violations can be cited per chemical or per container, multiplying exposure — a facility with 20 unlabeled containers can face 20 separate citations." } }
  ]
};

const combinedSchema = [articleSchema, faqSchema];

const inspectorFlow = [
  { icon: FileText, cfr: "1910.1200(e)(1)", title: "Written program", desc: "The inspector asks for the written HazCom program by name. A generic template with your company name at the top is not enough — it must reference your actual facility, chemicals, and procedures." },
  { icon: BookOpen, cfr: "1910.1200(g)(8)", title: "Chemical inventory", desc: "A list of every hazardous chemical in the workplace. Product name, location, and approximate quantity. Facilities miss this by having an old SDS binder but no separate inventory list." },
  { icon: ClipboardCheck, cfr: "1910.1200(g)(1)", title: "SDS accessibility test", desc: "Ask an employee: 'Show me the SDS for the WD-40 in the machine shop.' They should be able to produce it within 60 seconds. This is the most common on-the-spot HazCom test." },
  { icon: Tag, cfr: "1910.1200(f)", title: "Container labels", desc: "Walk-through inspection of every chemical container. Original manufacturer labels intact, GHS pictograms visible, and every secondary container labeled." },
  { icon: AlertTriangle, cfr: "1910.1200(h)", title: "Training records", desc: "The inspector picks 2-3 employees, asks their hire date, and asks for their HazCom training records. Missing or undated records mean untrained-employee findings." },
];

const requiredElements = [
  { title: "Company name and site address", desc: "Not just the corporate parent. The specific facility being covered by this document." },
  { title: "Chemical inventory list", desc: "Every hazardous chemical, product name, manufacturer, and location. This is the item most templates leave blank." },
  { title: "SDS management procedure", desc: "How SDS are obtained from suppliers, where they are kept, how updates are handled, and who is responsible." },
  { title: "Labeling program", desc: "How original labels are preserved, how secondary containers are labeled, and how process/pipeline labeling is handled." },
  { title: "Employee training procedure", desc: "Who trains, what topics are covered, how initial training is conducted, and how retraining triggers are handled." },
  { title: "Non-routine task procedure", desc: "How employees are informed about hazards for tasks they don't do daily — maintenance, spill cleanup, tank entry." },
  { title: "Multi-employer / contractor procedure", desc: "How your HazCom information is shared with contractors on site, and how you get theirs." },
  { title: "Signature and review date", desc: "Signed by a responsible person and reviewed at least annually. An eight-year-old signature on an otherwise good document is still a red flag." },
];

const BlogHazComPreInspection = () => {
  return (
    <main data-testid="blog-hazcom-pre-inspection">
      <SEO title={defined.headline} description={defined.description} canonical={defined.canonical} schema={combinedSchema} />
      <StickyTOC items={tocItems} />

      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>COMPLIANCE GUIDE</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="blog-hazcom-pre-headline">{defined.headline}</h1>
          <p className="text-white/70 text-base leading-relaxed mb-6">Hazard Communication is OSHA's second-most-cited standard in general industry, year after year. Not because the rule is complicated — because the paperwork requirements outnumber the physical ones and most small facilities have a written program that looks nothing like the actual chemicals on their floor. Here is exactly what an OSHA inspector works through during a HazCom-focused inspection.</p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Vince Lawrence</span><span className="text-white/20">|</span><span>November 2025</span><span className="text-white/20">|</span><span>11 min read</span>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>IN THIS GUIDE</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { id: "why-hazcom", label: "Why HazCom keeps getting cited" },
              { id: "inspector-flow", label: "The inspector's five-step flow" },
              { id: "elements", label: "Required program elements" },
              { id: "sds-binder", label: "The SDS binder" },
              { id: "labels", label: "Container labels" },
              { id: "training", label: "Training documentation" },
              { id: "citations", label: "Top citation traps" },
              { id: "action", label: "30-day cleanup plan" },
            ].map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80] transition-colors">{item.label}</a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="why-hazcom">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Why HazCom keeps getting cited</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">HazCom is deceptively simple. The standard has four core requirements — written program, SDS access, container labels, employee training. Every facility owner I meet believes they meet all four. Then we walk the shop and find:</p>
          <ul className="space-y-2 mb-6">
            {["A written program from 2018 that references chemicals no longer used","An SDS binder that hasn't been updated since a new degreaser was introduced","Six spray bottles of chemical products that have no labels","Two new hires who never received HazCom training because the person who does training was on vacation that week"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">Every one of those is a citation. And because HazCom violations can be cited per-chemical or per-container, a single walkthrough can generate five or six findings on the same standard.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="inspector-flow">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The inspector's five-step HazCom flow</h2>
          <div className="space-y-6">
            {inspectorFlow.map((s, i) => (
              <div key={i} className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
                <div className="flex items-start gap-3 mb-3">
                  <s.icon size={22} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.cfr}</p>
                    <h3 className="text-base font-bold text-[#1C2B2B]">Step {i + 1}: {s.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-[#1C2B2B]/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="elements">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Eight elements your written program must contain</h2>
          <p className="text-[#1C2B2B]/60 text-sm mb-8">If your program is a template with your company name pasted at the top, most of these elements are probably missing or generic.</p>
          <div className="space-y-4">
            {requiredElements.map((e, i) => (
              <div key={i} className="bg-white border border-[#2A52A0]/10 rounded p-5 flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm mb-1">{e.title}</p><p className="text-sm text-[#1C2B2B]/60">{e.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="sds-binder">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The SDS binder — what "readily accessible" actually means</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">OSHA 1910.1200(g)(1) requires that Safety Data Sheets be "readily accessible to employees during their work shift." The inspector's definition of "readily accessible":</p>
          <div className="bg-[#F9F8F6] border-l-4 border-[#C9A84C] p-6 my-6">
            <p className="text-sm text-[#1C2B2B] leading-relaxed italic">The employee can retrieve the SDS for any chemical they use during their normal work shift, without asking a supervisor, without leaving the building, and without needing a computer login they don't have.</p>
          </div>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Acceptable formats:</p>
          <ul className="space-y-2 mb-6">
            {["Physical binder in a location every employee can reach","Digital SDS on a shared computer accessible during all shifts","Cloud-based SDS platform (VelocityEHS, MSDSonline) with kiosk access","QR-code-linked SDS posted at chemical storage points"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">Not acceptable: an SDS binder in the office manager's locked file cabinet. A digital SDS on a supervisor-only computer. A binder that hasn't been updated since 2019.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="labels">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Container labels — GHS requirements</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Every original container from a manufacturer must have the six GHS label elements (1910.1200(f)(1)):</p>
          <ol className="space-y-3 mb-6">
            {["Product identifier","Signal word (Danger or Warning)","Hazard statements","Pictograms","Precautionary statements","Supplier information"].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">{i + 1}.</span>{item}</li>
            ))}
          </ol>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Secondary containers (transfer bottles, mix tanks) require, at minimum: product identifier and general information regarding hazards. Best practice is to use GHS-compliant labels with pictograms even on secondary containers.</p>
          <p className="text-[#1C2B2B]/60 text-sm">The fastest HazCom citation I have ever seen an inspector write: "unlabeled spray bottle in janitorial cart." Ten seconds from noticing to documenting.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="training">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Training documentation</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">1910.1200(h) requires that employees be trained at the time of initial assignment and whenever a new chemical hazard is introduced. Every training must be documented with:</p>
          <ul className="space-y-2 mb-6">
            {["Employee name and signature","Date of training","Topics covered (map to 1910.1200(h)(3))","Trainer name and signature","List of chemicals or chemical categories covered"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The required training topics (1910.1200(h)(3)):</p>
          <ol className="space-y-2 mb-6">
            {["The requirements of the HazCom standard","Any operations in the work area where hazardous chemicals are present","Location of the written program, chemical list, and SDS","Methods to detect the presence or release of chemicals","Physical and health hazards of chemicals","Protective measures — engineering controls, work practices, PPE","Details of the labeling program and how to read SDS"].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">{i + 1}.</span>{item}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="citations">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Six HazCom citations that catch small facilities</h2>
          <ol className="space-y-4">
            {[
              { t: "Generic written program — 1910.1200(e)(1)", d: "Template document with no site-specific chemical inventory attached. Cited as failure to have a compliant written program." },
              { t: "SDS not readily accessible — 1910.1200(g)(1)", d: "Employee cannot locate the SDS within a reasonable time during work shift. Often caused by a locked office or shift-timing gap." },
              { t: "Missing SDS for specific chemical — 1910.1200(g)(2)", d: "A chemical is in use on the floor but no SDS is on file. Common with recently-introduced products where the receiving team didn't route the SDS to the safety file." },
              { t: "Unlabeled secondary container — 1910.1200(f)(6)", d: "Spray bottles, transfer jugs, sample cups on the floor without the required identifier and hazard information." },
              { t: "Missing training records — 1910.1200(h)(1)", d: "Training was provided but the record is undated, unsigned, or missing entirely." },
              { t: "Program not updated — 1910.1200(e)(4)", d: "Written program signed years ago, has not been reviewed, and does not reflect current chemicals or personnel." },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm">{item.t}</p><p className="text-sm text-[#1C2B2B]/60">{item.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="action">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>30-day HazCom cleanup plan</h2>
          <ol className="space-y-6">
            {[
              { title: "Week 1: Chemical inventory", desc: "Walk the facility. Photograph every chemical container. Build a spreadsheet: product name, manufacturer, location, approximate quantity, SDS on file (Y/N)." },
              { title: "Week 2: SDS reconciliation", desc: "Any chemical without an SDS — request from the manufacturer or download from the online catalog. Add every new SDS to the binder/digital system." },
              { title: "Week 3: Label sweep", desc: "Photograph every unlabeled secondary container. Print GHS-compliant labels or purchase pre-printed labels for common products. Post at each chemical storage station." },
              { title: "Week 4: Training refresh", desc: "Retrain every employee on the updated chemical inventory. Sign records. File in employee training folders. Post the written program in an accessible location." },
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
            <Link to="/supervisor-kit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Supervisor Safety Starter System — $600</p><p className="text-xs text-white/50 mt-1">11 print-ready documents including a written HazCom program template, chemical inventory sheet, and training log.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/hazcom" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">HazCom Starter Pack — $29</p><p className="text-xs text-white/50 mt-1">Written program, SDS checklist, and training log for immediate download.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/services/compliance-readiness-visit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Compliance Readiness Visit</p><p className="text-xs text-white/50 mt-1">Full HazCom audit combined with floor walkthrough — one visit, one written report.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>KEEP READING</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Link to="/blog/osha-machine-guarding-checklist-small-manufacturers" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Machine Guarding Checklist</Link>
              <Link to="/blog/loto-program-requirements-small-facilities" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ LOTO Program Requirements</Link>
              <Link to="/blog/osha-forklift-compliance-inspector-checklist" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Forklift Compliance</Link>
              <Link to="/blog/osha-300-log-common-mistakes-citations" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ OSHA 300 Log Mistakes</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-3xl">
          <div className="border border-[#2A52A0]/20 bg-white rounded-lg p-6 md:p-8 text-center">
            <p className="text-lg font-bold text-[#1C2B2B] mb-2">Not sure if your HazCom program would survive an inspection?</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-5">The Supervisor Safety Starter System gives you a fillable written program, chemical inventory, and training log — ready for print and site-specific use in an hour.</p>
            <Link to="/supervisor-kit" className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">Get the Supervisor Kit <ArrowRight size={16} /></Link>
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

export default BlogHazComPreInspection;
