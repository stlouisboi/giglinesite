import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, FileText, Users, ClipboardCheck, AlertTriangle, Wrench } from 'lucide-react';
import SEO from '../components/SEO';

const defined = {
  headline: "LOTO Program Requirements for Small Facilities",
  description: "OSHA 1910.147 Control of Hazardous Energy in plain English — written program elements, machine-specific procedures, training, and the citations that catch small facilities. From an OSHA consultant walking NC floors weekly.",
  canonical: "/blog/loto-program-requirements-small-facilities",
  datePublished: "2025-10-28",
  dateModified: "2025-10-28",
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
    { "@type": "Question", "name": "What is OSHA 1910.147?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA 29 CFR 1910.147 — the Control of Hazardous Energy standard — requires employers to establish a program and procedures to disable and lock out machines and equipment during service or maintenance. It applies whenever unexpected energization, start-up, or release of stored energy could cause injury." } },
    { "@type": "Question", "name": "Do small facilities need a written LOTO program?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. 1910.147(c)(4) requires energy control procedures for every piece of equipment. Facilities with under 10 employees are not exempt — the standard applies regardless of size. The only exception is 'cord-and-plug connected equipment' where the plug is under the exclusive control of the employee servicing it." } },
    { "@type": "Question", "name": "How often does LOTO training need to happen?", "acceptedAnswer": { "@type": "Answer", "text": "Initial training at hire or role change, retraining whenever procedures change or new equipment is introduced, and periodic retraining if periodic inspections reveal deficiencies. Annual retraining is not mandated but is best practice. All training must be documented per 1910.147(c)(7)(iv)." } },
    { "@type": "Question", "name": "What is the maximum OSHA penalty for LOTO violations in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Serious LOTO violations carry a maximum penalty of $16,550 per violation under OSHA's 2026 adjusted schedule (29 CFR 1903.15). Willful or repeat violations reach $165,514. LOTO is regularly in OSHA's top 5 most-cited standards." } },
    { "@type": "Question", "name": "Do I need machine-specific LOTO procedures?", "acceptedAnswer": { "@type": "Answer", "text": "Yes for most equipment. 1910.147(c)(4)(i) requires written procedures for machines with more than one energy source, or where a single-source procedure would not fully protect the employee. The safest approach is one written procedure per machine." } },
    { "@type": "Question", "name": "How often do LOTO procedures need to be audited?", "acceptedAnswer": { "@type": "Answer", "text": "OSHA requires an annual periodic inspection of each energy control procedure per 1910.147(c)(6). The inspection must be conducted by an authorized employee not using the procedure being inspected. Documentation must include the equipment, date, inspector, and employees included." } }
  ]
};

const combinedSchema = [articleSchema, faqSchema];

const sixSteps = [
  { icon: AlertTriangle, num: 1, cfr: "1910.147(d)(2)", title: "Notify affected employees", desc: "Anyone in the area who is not performing the service must be told the machine is being locked out." },
  { icon: Lock, num: 2, cfr: "1910.147(d)(3)", title: "Shut down using normal stopping procedure", desc: "Use the operator's stop button or normal shutdown sequence. Do not just cut power at the main." },
  { icon: Wrench, num: 3, cfr: "1910.147(d)(4)", title: "Isolate all energy sources", desc: "Every disconnect, valve, or breaker that could re-energize the machine must be operated to the safe position." },
  { icon: Lock, num: 4, cfr: "1910.147(d)(4)(i)", title: "Apply locks and tags", desc: "One lock per employee. One tag per lock. Personal padlocks — no shared spares in the tool crib." },
  { icon: ClipboardCheck, num: 5, cfr: "1910.147(d)(5)", title: "Release stored energy", desc: "Bleed pneumatic lines, drain hydraulic accumulators, discharge capacitors, block gravity-loaded parts. Every energy source has residual." },
  { icon: FileText, num: 6, cfr: "1910.147(d)(6)", title: "Verify isolation", desc: "Attempt to start the machine using the normal controls. If it stays off, isolation is verified. Return controls to the neutral position." },
];

const programElements = [
  { title: "Statement of purpose", desc: "One paragraph. Why the program exists and to whom it applies." },
  { title: "Scope", desc: "Which machines, processes, and locations are covered. Any exclusions must be documented." },
  { title: "Responsibility assignments", desc: "Named roles for authorized employees, affected employees, and the LOTO program administrator." },
  { title: "Machine-specific procedures", desc: "One written procedure per machine (or per procedure family for identical equipment). Required by 1910.147(c)(4)." },
  { title: "Training records", desc: "Initial training, refresher training, and demonstrated competency per 1910.147(c)(7)." },
  { title: "Periodic inspection procedure", desc: "Annual audit of each procedure by an authorized employee other than the user. Required by 1910.147(c)(6)." },
  { title: "Group lockout procedure", desc: "Required when multiple employees work on the same machine — 1910.147(f)(3)." },
  { title: "Contractor coordination", desc: "How outside contractors interface with your LOTO program per 1910.147(f)(2)." },
];

const BlogLOTOProgram = () => {
  return (
    <main data-testid="blog-loto-program">
      <SEO title={defined.headline} description={defined.description} canonical={defined.canonical} schema={combinedSchema} />

      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>COMPLIANCE GUIDE</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="blog-loto-headline">{defined.headline}</h1>
          <p className="text-white/70 text-base leading-relaxed mb-6">Lockout/Tagout has been in OSHA's top 5 most-cited standards for two decades running. Not because it's complicated — because most small facilities have a written program that was copied from a template ten years ago and never matched the machines actually running on the floor. Here is what 1910.147 requires and how to build a program that would survive an inspection.</p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Vince Lawrence</span><span className="text-white/20">|</span><span>October 2025</span><span className="text-white/20">|</span><span>12 min read</span>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>IN THIS GUIDE</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { id: "what-loto-is", label: "What LOTO actually is" },
              { id: "when-required", label: "When is LOTO required?" },
              { id: "written-program", label: "The written program" },
              { id: "six-steps", label: "The six-step procedure" },
              { id: "machine-specific", label: "Machine-specific procedures" },
              { id: "training", label: "Training requirements" },
              { id: "annual-audit", label: "The annual audit" },
              { id: "citations", label: "Top citation traps" },
            ].map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80] transition-colors">{item.label}</a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="what-loto-is">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>What Lockout/Tagout actually is</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">LOTO is the control of hazardous energy during service or maintenance — <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>29 CFR 1910.147</span>. The goal is straightforward: no machine should be able to start unexpectedly while a person is inside it, under it, or reaching into it.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The energy sources OSHA covers are broader than just electrical:</p>
          <ul className="space-y-2 mb-6">
            {["Electrical (breaker panels, disconnects, plugs)","Pneumatic (compressed air lines, actuators)","Hydraulic (pumps, accumulators, cylinders)","Mechanical (springs, counterweights, gravity)","Thermal (steam, coolant, refrigerant)","Chemical (process piping)"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">Most facilities I visit have a good handle on electrical. Pneumatic and hydraulic are the ones that surface findings — an air line that stays pressurized after the disconnect flips, a hydraulic accumulator that holds pressure for hours after shutdown, springs that release when a guard is removed.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="when-required">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>When is LOTO required?</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Any time an employee must remove or bypass a guard, place any part of their body into an area on a machine where work is actually performed, or reach into a hazardous point of operation. The trigger question:</p>
          <div className="bg-[#F9F8F6] border-l-4 border-[#C9A84C] p-6 my-6">
            <p className="text-sm text-[#1C2B2B] leading-relaxed italic">If this machine could start up right now, is any part of my body in a place where the movement would hurt me?</p>
          </div>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">If the answer is yes, you are in a LOTO situation. That includes:</p>
          <ul className="space-y-2 mb-6">
            {["Clearing a jam","Cleaning a machine while it is not running","Setting up dies, molds, or tooling","Adjusting a fixture","Any maintenance regardless of duration"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">"Minor tool changes" that take place during normal production and are routine, repetitive, and integral to the use of the equipment may be exempt under 1910.147(a)(2)(ii)(B) — but only if alternative measures provide effective protection. Most small facilities cannot meet the exemption test and should just lock out.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="written-program">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Elements of the written program</h2>
          <p className="text-[#1C2B2B]/60 text-sm mb-8">A compliant LOTO program has eight documented elements. If your program is missing any of these, you have a gap.</p>
          <div className="space-y-4">
            {programElements.map((e, i) => (
              <div key={i} className="bg-white border border-[#2A52A0]/10 rounded p-5 flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm mb-1">{e.title}</p><p className="text-sm text-[#1C2B2B]/60">{e.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="six-steps">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The six-step LOTO procedure</h2>
          <p className="text-[#1C2B2B]/60 text-sm mb-8">Every machine-specific procedure follows this same six-step sequence. The details vary; the sequence does not.</p>
          <div className="space-y-6">
            {sixSteps.map((s) => (
              <div key={s.num} className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
                <div className="flex items-start gap-3 mb-3">
                  <s.icon size={22} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.cfr}</p>
                    <h3 className="text-base font-bold text-[#1C2B2B]">Step {s.num}: {s.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-[#1C2B2B]/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="machine-specific">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The machine-specific procedure</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">This is where LOTO programs live or die. Every energized machine needs a written procedure that identifies each energy source, each isolation point, each lock-out device, and each verification step. One page per machine, printed and posted at the machine.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">A compliant machine-specific procedure contains:</p>
          <ul className="space-y-2 mb-6">
            {["Machine name, ID number, and location","Every energy source (electrical, pneumatic, hydraulic, mechanical, thermal)","Location of each isolation point","Type and quantity of locks required","Steps for stored energy release","Steps for isolation verification","Reactivation sequence","Date created and last reviewed"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">The best-run shops I visit have a laminated procedure card zip-tied to each machine's disconnect. The employee never has to leave the machine to know exactly what to do.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="training">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Training requirements — 1910.147(c)(7)</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Three tiers of training, each with different depth:</p>
          <div className="space-y-4 mb-6">
            <div className="bg-white border border-[#2A52A0]/10 rounded p-5">
              <p className="font-semibold text-[#1C2B2B] text-sm mb-2">Authorized employees</p>
              <p className="text-sm text-[#1C2B2B]/60">People who apply locks and perform service. Full training on procedures, energy types, and recognition of hazards.</p>
            </div>
            <div className="bg-white border border-[#2A52A0]/10 rounded p-5">
              <p className="font-semibold text-[#1C2B2B] text-sm mb-2">Affected employees</p>
              <p className="text-sm text-[#1C2B2B]/60">Operators of the machines that get locked out. Awareness training only — recognize when equipment is under LOTO, do not attempt to restart, do not remove or tamper with locks.</p>
            </div>
            <div className="bg-white border border-[#2A52A0]/10 rounded p-5">
              <p className="font-semibold text-[#1C2B2B] text-sm mb-2">Other employees</p>
              <p className="text-sm text-[#1C2B2B]/60">Anyone whose work operations may take them into an area where LOTO is in use. Same general awareness training as affected employees.</p>
            </div>
          </div>
          <p className="text-[#1C2B2B]/60 text-sm">Every training must be documented with employee name, date, topics covered, and trainer signature. Retention requirement: for the duration of employment plus any state-required period.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="annual-audit">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The annual periodic inspection</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">1910.147(c)(6) requires an annual inspection of every energy control procedure. This is where most small facilities fall short. The inspection is not a review of the paperwork — it is a physical audit of authorized employees actually performing the procedure.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The inspection must:</p>
          <ul className="space-y-2 mb-6">
            {["Be conducted at least annually","Be performed by an authorized employee other than the one using the procedure","Include observation of the procedure in use","Correct any deficiencies identified","Be documented with equipment identification, date, employees involved, and inspector"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">The single most common LOTO-related citation I see is "failure to conduct periodic inspection" — 1910.147(c)(6)(i). It carries the same $16,550 exposure as any other serious violation.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="citations">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The five LOTO citations that catch small facilities</h2>
          <ol className="space-y-4">
            {[
              { t: "No machine-specific procedures — 1910.147(c)(4)(i)", d: "The written program exists as a template but no per-machine procedures were ever developed. The template LOTO document alone does not satisfy the standard." },
              { t: "Missing periodic inspection — 1910.147(c)(6)", d: "The annual audit either never happened or was not documented. This is the fastest LOTO citation to prove — the inspector asks for the records and there are none." },
              { t: "Shared locks — 1910.147(c)(5)(ii)", d: "Locks kept in a tool crib and shared between employees. Each authorized employee must have their own personal lock, uniquely keyed." },
              { t: "Training records not retained — 1910.147(c)(7)(iv)", d: "Training happened but there is no signed record. If it's not documented, OSHA treats it as if it didn't happen." },
              { t: "No stored-energy release procedure — 1910.147(d)(5)", d: "The procedure locks out the primary source but never addresses the pneumatic line, hydraulic accumulator, or spring. Most common on presses, injection molders, and material handlers." },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="bg-[#102A43] text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <div><p className="font-semibold text-[#1C2B2B] text-sm">{item.t}</p><p className="text-sm text-[#1C2B2B]/60">{item.d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-14 md:py-20 bg-[#102A43] text-white">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Related Resources</h2>
          <div className="space-y-4 mb-10">
            <Link to="/services/compliance-readiness-visit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Compliance Readiness Visit — from $2,000</p><p className="text-xs text-white/50 mt-1">Full documentation audit including LOTO program review, machine-specific procedure gap analysis, and annual inspection recovery plan.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/loto-procedure-review-nc" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">LOTO Procedure Review</p><p className="text-xs text-white/50 mt-1">Standalone review of your machine-specific procedures against your actual floor.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/safety-walkthrough" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Safety Walkthrough — $1,200</p><p className="text-xs text-white/50 mt-1">Floor-focused review that flags LOTO bypasses, missing locks, and unmarked disconnects.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>KEEP READING</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Link to="/blog/osha-machine-guarding-checklist-small-manufacturers" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Machine Guarding Checklist</Link>
              <Link to="/blog/osha-forklift-compliance-inspector-checklist" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ OSHA Forklift Compliance</Link>
              <Link to="/blog/written-hazcom-program-before-osha-inspection" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ HazCom Before OSHA</Link>
              <Link to="/blog/top-5-osha-violations-small-manufacturing" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Top 5 OSHA Violations</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-3xl">
          <div className="border border-[#2A52A0]/20 bg-white rounded-lg p-6 md:p-8 text-center">
            <p className="text-lg font-bold text-[#1C2B2B] mb-2">LOTO program in a binder collecting dust?</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-5">A Compliance Readiness Visit audits every machine-specific procedure against the actual equipment on your floor — and pre-populates the annual inspection you probably owe.</p>
            <Link to="/intake" className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">Request a Compliance Readiness Visit <ArrowRight size={16} /></Link>
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

export default BlogLOTOProgram;
