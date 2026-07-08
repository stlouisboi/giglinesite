import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, ClipboardCheck, AlertTriangle, Calendar, Users, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import StickyTOC from '../components/StickyTOC';
import { SUPERVISOR_KIT_ENABLED } from '../config/features';

const tocItems = [
  { id: "who-must-keep", label: "Who must keep the 300 log?" },
  { id: "three-forms", label: "The three forms" },
  { id: "six-mistakes", label: "Six common mistakes" },
  { id: "recordability", label: "The recordability test" },
  { id: "300a-window", label: "The 300A posting window" },
  { id: "retention", label: "Retention requirements" },
  { id: "penalties", label: "2026 penalty exposure" },
  { id: "action", label: "Annual cleanup plan" },
];

const defined = {
  headline: "OSHA 300 Log: Common Mistakes That Trigger Citations",
  description: "The recordkeeping mistakes OSHA cites most on the 300 log — misclassification, missing 300A postings, incomplete 301 forms. With 2026 penalty exposure and a working-copy walkthrough from a consultant who reviews these logs weekly.",
  canonical: "/blog/osha-300-log-common-mistakes-citations",
  datePublished: "2025-12-09",
  dateModified: "2025-12-09",
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
    { "@type": "Question", "name": "Who has to keep an OSHA 300 log?", "acceptedAnswer": { "@type": "Answer", "text": "Every employer with more than 10 employees at any time during the previous calendar year, unless the employer is in a partially exempt low-hazard industry listed in 29 CFR 1904 Subpart B Appendix A. NAICS codes such as retail, professional services, and some clerical operations are exempt. If any doubt exists — keep the log." } },
    { "@type": "Question", "name": "When does the OSHA 300A summary need to be posted?", "acceptedAnswer": { "@type": "Answer", "text": "The 300A annual summary must be posted from February 1 through April 30 each year, in a conspicuous location where notices to employees are customarily posted per 29 CFR 1904.32. A copy must also be certified by a company executive. Not posting the 300A is one of the most citable recordkeeping violations because the calendar is public knowledge." } },
    { "@type": "Question", "name": "What is the difference between the 300 log and the 301 form?", "acceptedAnswer": { "@type": "Answer", "text": "The 300 log is a summary — one line per case with basic classification. The 301 form (or an equivalent) is the detailed incident record for each individual case — dates, description of the event, treatment, and outcome. The 300 log points to the 301 form; both must be maintained per 29 CFR 1904." } },
    { "@type": "Question", "name": "How long does OSHA 300 recordkeeping need to be retained?", "acceptedAnswer": { "@type": "Answer", "text": "Five years following the end of the calendar year the records cover, per 29 CFR 1904.33(a). This applies to the 300 log, the 300A summary, and the 301 incident reports. Records must be updated to reflect any changes discovered during the retention period." } },
    { "@type": "Question", "name": "What is the maximum OSHA penalty for recordkeeping violations in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Recordkeeping violations carry up to $16,550 per violation for serious classifications under OSHA's 2026 adjusted schedule (29 CFR 1903.15). Willful or repeat recordkeeping violations reach $165,514. Failure to post the 300A is often cited separately from failure to maintain the 300 log itself." } },
    { "@type": "Question", "name": "Do all injuries have to be recorded on the 300 log?", "acceptedAnswer": { "@type": "Answer", "text": "No. Only work-related injuries and illnesses that meet the recordability criteria in 29 CFR 1904.7 — death, days away from work, restricted work, medical treatment beyond first aid, loss of consciousness, or diagnosis of a significant injury or illness. First-aid-only cases are not recordable. The line between first aid and medical treatment is where most recordability errors occur." } }
  ]
};

const combinedSchema = [articleSchema, faqSchema];

const commonMistakes = [
  { icon: AlertTriangle, num: 1, title: "Misclassifying first aid vs medical treatment", desc: "The most common recordability error. 1904.7(b)(5)(ii) lists 14 first-aid procedures — anything beyond that list is medical treatment and the case is recordable. Prescription strength medication, sutures, IV fluids — all medical treatment, always recordable." },
  { icon: Calendar, num: 2, title: "Missing the 300A posting window", desc: "1904.32 requires the 300A summary posted February 1 through April 30. Not posted, posted late, posted in the wrong location — three separate citations. The date on the certification signature must be before February 1." },
  { icon: Users, num: 3, title: "Executive certification missing", desc: "1904.32(b)(4) requires a company executive to certify the 300A summary. Not a supervisor. Not the office manager. An owner, corporate officer, or the highest-ranking manager at the location. Missing signature is a stand-alone citation." },
  { icon: FileText, num: 4, title: "301 form not completed within 7 days", desc: "1904.29(b)(3) requires the equivalent of the 301 form completed within 7 calendar days of the incident being reported. Facilities that document the 300 line but never fill out the 301 create two citations — one for the missing form, one for records incomplete." },
  { icon: ClipboardCheck, num: 5, title: "Restricted work and days-away miscounted", desc: "1904.7(b)(4) counts calendar days, not scheduled work days. A restricted-work case that runs Friday-through-Monday counts as 4 days, not 2. Under-counting these days is often cited as record falsification, which is far more serious than a simple recordkeeping error." },
  { icon: BookOpen, num: 6, title: "Privacy cases not de-identified", desc: "1904.29(b)(6) requires privacy-case designation (sexual assault, HIV, mental illness, needle-stick, etc.) with the employee name replaced by 'Privacy Case' on the 300 log. Facilities that either don't use the designation OR fail to de-identify are cited for privacy violations." },
];

const BlogOSHA300LogMistakes = () => {
  return (
    <main data-testid="blog-osha-300-mistakes">
      <SEO title={defined.headline} description={defined.description} canonical={defined.canonical} schema={combinedSchema} />
      <StickyTOC items={tocItems} />

      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>COMPLIANCE GUIDE</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="blog-osha-300-headline">{defined.headline}</h1>
          <p className="text-white/70 text-base leading-relaxed mb-6">The OSHA 300 log is one page. The 300A summary is one page. The 301 incident report is one page. Together they are the fastest, cleanest paperwork requirement OSHA has — and one of the top citation sources every year. Because a one-page form still has fifteen ways to be wrong. Here are the six most common mistakes I see when I open small-facility 300 logs, and how to fix each one.</p>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>Vince Lawrence</span><span className="text-white/20">|</span><span>December 2025</span><span className="text-white/20">|</span><span>11 min read</span>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>IN THIS GUIDE</p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {[
              { id: "who-must-keep", label: "Who must keep the 300 log?" },
              { id: "three-forms", label: "The three forms" },
              { id: "six-mistakes", label: "Six common mistakes" },
              { id: "recordability", label: "The recordability test" },
              { id: "300a-window", label: "The 300A posting window" },
              { id: "retention", label: "Retention requirements" },
              { id: "penalties", label: "2026 penalty exposure" },
              { id: "action", label: "Annual cleanup plan" },
            ].map((item) => (
              <li key={item.id}><a href={`#${item.id}`} className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80] transition-colors">{item.label}</a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="who-must-keep">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Who must keep an OSHA 300 log?</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The rule is in 29 CFR 1904.1: any employer with more than 10 employees at any point in the previous calendar year, unless the employer's primary business is in a partially-exempt industry listed in 1904 Subpart B Appendix A.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Common exempt industries include:</p>
          <ul className="space-y-2 mb-6">
            {["Most retail and wholesale trade","Most finance, insurance, and real estate","Some clerical and administrative services","Certain professional services"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Common NON-exempt industries — every manufacturer, warehouse, contractor, fleet, healthcare, food service, auto repair, and specialty trade GigLine works with is required to maintain the log.</p>
          <p className="text-[#1C2B2B]/60 text-sm">Even exempt employers must report fatalities and hospitalizations to OSHA (1904.39). Everyone is covered by the reporting rules; only recordkeeping is partially exempt.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="three-forms">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The three forms — and what each is for</h2>
          <div className="space-y-6">
            <div className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
              <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>1904.7</p>
              <h3 className="text-base font-bold text-[#1C2B2B] mb-2">OSHA 300 — Log of Work-Related Injuries and Illnesses</h3>
              <p className="text-sm text-[#1C2B2B]/70">A running list of every recordable case for the calendar year. One line per case. Includes date, employee name, job title, location, description, and classification (death / days away / restricted / job transfer / medical treatment / other recordable).</p>
            </div>
            <div className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #C9A84C' }}>
              <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>1904.32</p>
              <h3 className="text-base font-bold text-[#1C2B2B] mb-2">OSHA 300A — Summary of Work-Related Injuries and Illnesses</h3>
              <p className="text-sm text-[#1C2B2B]/70">The year-end summary. Totals from the 300 log by classification, plus average employee count and total hours worked. Must be posted February 1 through April 30 and certified by a company executive.</p>
            </div>
            <div className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
              <p className="text-xs text-[#1C2B2B]/40 font-semibold tracking-widest uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>1904.29(b)(3)</p>
              <h3 className="text-base font-bold text-[#1C2B2B] mb-2">OSHA 301 — Injury and Illness Incident Report</h3>
              <p className="text-sm text-[#1C2B2B]/70">The detailed record for each individual case. Employee information, description of the incident, treatment, physician, dates. Must be completed within 7 calendar days of the case being reported to the employer.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="six-mistakes">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-10" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The six most common mistakes</h2>
          <div className="space-y-6">
            {commonMistakes.map((m) => (
              <div key={m.num} className="bg-white border border-[#2A52A0]/10 rounded p-6" style={{ borderTop: '3px solid #2A52A0' }}>
                <div className="flex items-start gap-3 mb-3">
                  <m.icon size={22} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                  <h3 className="text-base font-bold text-[#1C2B2B]">Mistake {m.num}: {m.title}</h3>
                </div>
                <p className="text-sm text-[#1C2B2B]/70 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="recordability">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The recordability test</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">1904.7 lists the six criteria that make a case recordable. If any one applies, the case must go on the 300 log:</p>
          <ol className="space-y-3 mb-6">
            {["Death","Days away from work (even one)","Restricted work or transfer to another job","Medical treatment beyond first aid","Loss of consciousness","Diagnosis of a significant injury or illness by a licensed healthcare professional"].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#1C2B2B]/70"><span className="font-bold text-[#2A52A0] flex-shrink-0">{i + 1}.</span>{item}</li>
            ))}
          </ol>
          <div className="bg-white border-l-4 border-[#C9A84C] p-6 my-6">
            <p className="text-sm text-[#1C2B2B] leading-relaxed"><strong>The first-aid list is finite.</strong> 1904.7(b)(5)(ii) lists 14 specific procedures that are first aid — not medical treatment. Anything else is recordable. Common trap: an over-the-counter pain reliever is first aid. A prescription-strength version of the same drug is medical treatment.</p>
          </div>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Full first-aid list from 1904.7(b)(5)(ii):</p>
          <ul className="space-y-1 mb-6 text-sm text-[#1C2B2B]/60">
            {["Non-prescription medications at non-prescription strength","Tetanus immunizations","Cleaning, flushing, or soaking surface wounds","Bandages, gauze pads, or butterfly closures","Hot or cold therapy","Non-rigid means of support (elastic bandages, wraps, non-rigid back belts)","Temporary immobilization while transporting","Drilling a fingernail or toenail to relieve pressure","Draining fluid from a blister","Eye patches","Removing foreign bodies from the eye using irrigation or a cotton swab","Removing splinters or foreign material from areas other than the eye","Finger guards","Massages"].map((item, i) => (
              <li key={i} className="flex items-start gap-2"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="300a-window">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The 300A posting window</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Every February 1 through April 30, the 300A annual summary for the prior calendar year must be posted in a conspicuous location where employee notices are customarily posted. This is the single most predictable OSHA citation opportunity in the calendar — the dates are public and inspectors look for the poster.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">The posted 300A must:</p>
          <ul className="space-y-2 mb-6">
            {["Cover the previous calendar year","Be signed and dated by a company executive (owner, officer, highest-ranking manager at the site)","Be certified: the executive signs a statement that the summary is true, accurate, and complete","Remain posted continuously through April 30","Be posted at each physical establishment (not just corporate HQ) if the company has multiple sites"].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#1C2B2B]/70"><span className="text-[#2A52A0] font-bold">•</span>{item}</li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/60 text-sm">Establishments with 20+ employees in certain industries must also submit their 300A to OSHA's Injury Tracking Application by March 2 each year — 1904.41. Applies to most manufacturing and warehouse operations.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="retention">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Retention requirements — 1904.33</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">Five years following the end of the calendar year the records cover. In 2026 you need to have on file the 300, 300A, and 301 records for calendar years 2021 through 2025.</p>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-4">During the retention period, you are required to update the records if newer information becomes available — for example, an injury that becomes worse and progresses from restricted-work to lost-work status must be updated retroactively.</p>
          <p className="text-[#1C2B2B]/60 text-sm">Store the 5-year archive in a secured, dated folder — physical or digital. When OSHA arrives and asks for the 2023 log, "I have to check with corporate" is not the answer that keeps this inspection short.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F9F8F6]" id="penalties">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>2026 penalty exposure</h2>
          <div className="bg-white border border-[#2A52A0]/10 rounded overflow-hidden">
            {[
              { type: "Serious recordkeeping violation", amount: "Up to $16,550 per violation" },
              { type: "Willful violation", amount: "Up to $165,514 per violation" },
              { type: "Repeat violation", amount: "Up to $165,514 per violation" },
              { type: "Falsification of records", amount: "Criminal referral possible" },
            ].map((p, i) => (
              <div key={i} className={`flex justify-between items-center py-4 px-6 ${i > 0 ? 'border-t border-[#2A52A0]/10' : ''}`}>
                <span className="text-sm font-medium text-[#1C2B2B]">{p.type}</span>
                <span className="text-sm font-bold text-[#1F3F80]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.amount}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#1C2B2B]/50 mt-4 italic">Source: 29 CFR 1903.15(d), OSHA 2026 Civil Penalty Adjustments. Recordkeeping citations often bundle — missing 300 log, missing 300A posting, and missing 301 form can be three separate citations for the same underlying incident.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 border-b border-[#2A52A0]/10" id="action">
        <div className="container max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-8" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>The annual cleanup plan</h2>
          <ol className="space-y-6">
            {[
              { title: "January: Close out the prior year", desc: "Finalize the 300 log for the closed calendar year. Verify every case has a matching 301 form. Reconcile classifications against the recordability criteria. Compute totals for the 300A." },
              { title: "February 1: Post the 300A", desc: "Executive-certified 300A summary posted in the employee break room, time clock area, or notice board. Retain the posted copy on file. Submit to OSHA ITA if required (by March 2)." },
              { title: "May 1: Take down and file", desc: "Remove the 300A from the notice board. File it in the retention archive with the corresponding 300 log and 301 forms." },
              { title: "Ongoing: Every new case", desc: "Add a line to the current-year 300 log within 7 calendar days of the case being reported. Complete the corresponding 301 form within the same window. Update if the case changes classification (lost days extend, restricted becomes lost, etc.)." },
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
            <Link to="/services/compliance-readiness-visit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">Compliance Readiness Visit — from $2,000</p><p className="text-xs text-white/50 mt-1">Full recordkeeping audit — every 300 log, 300A summary, and 301 form reviewed with a written corrective action list.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            <Link to="/osha-documentation-review-nc" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">OSHA Documentation Review</p><p className="text-xs text-white/50 mt-1">Standalone review of your written programs, training records, and OSHA logs.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            {SUPERVISOR_KIT_ENABLED && (
            <Link to="/supervisor-kit" className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded hover:border-[#2A52A0]/40 transition-colors group">
              <div><p className="font-medium text-white group-hover:text-[#2A52A0] transition-colors text-sm">GigLine Supervisor Safety OS — $600</p><p className="text-xs text-white/50 mt-1">11 print-ready documents including a working 300 log, 300A summary template, and 301 form.</p></div>
              <ArrowRight size={18} className="text-white/30 group-hover:text-[#2A52A0] transition-colors flex-shrink-0" />
            </Link>
            )}
          </div>
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>KEEP READING</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <Link to="/blog/osha-machine-guarding-checklist-small-manufacturers" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Machine Guarding Checklist</Link>
              <Link to="/blog/loto-program-requirements-small-facilities" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ LOTO Program Requirements</Link>
              <Link to="/blog/osha-forklift-compliance-inspector-checklist" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ Forklift Compliance</Link>
              <Link to="/blog/written-hazcom-program-before-osha-inspection" className="text-white/70 hover:text-[#2A52A0] transition-colors">→ HazCom Before OSHA</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-3xl">
          <div className="border border-[#2A52A0]/20 bg-white rounded-lg p-6 md:p-8 text-center">
            <p className="text-lg font-bold text-[#1C2B2B] mb-2">Not sure your 300 log would survive an audit?</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-5">A Compliance Readiness Visit reviews every OSHA log for the past five years, flags misclassifications, and produces a corrective action list you can hand to your bookkeeper.</p>
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

export default BlogOSHA300LogMistakes;
