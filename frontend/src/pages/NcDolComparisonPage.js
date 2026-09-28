import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink, Info } from 'lucide-react';
import SEO from '../components/SEO';

const NAVY_DEEP = '#0a1a2e';
const NAVY = '#102A43';
const GOLD = '#C9A84C';
const mono = { fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace' };
const heading = { fontFamily: 'Georgia, "Times New Roman", serif' };

const CANONICAL = 'https://www.giglinecompliance.com/nc-dol-consultation-vs-private-consultant';

const COMPARISON_ROWS = [
  { feature: 'Cost', nc: 'Free', gigline: 'Safety Walkthroughs start at $1,300' },
  { feature: 'Relationship', nc: 'State consultation program separate from enforcement, subject to program requirements', gigline: 'Independent private consultancy' },
  { feature: 'Citations during the visit', nc: 'None', gigline: 'GigLine has no enforcement authority' },
  { feature: 'Scheduling', nc: 'Based on program availability', gigline: 'Based on GigLine\u2019s confirmed availability' },
  { feature: 'Hazard identification', nc: 'Yes', gigline: 'Yes' },
  { feature: 'Written-program assistance', nc: 'May review programs and provide examples', gigline: 'Customized program development can be separately scoped' },
  { feature: 'Training', nc: 'May conduct or arrange training', gigline: 'Training may be included when specifically scoped' },
  { feature: 'Correction responsibility', nc: 'Employer must correct and verify identified hazards under program requirements', gigline: 'Employer remains responsible; GigLine can help plan and complete corrective work' },
  { feature: 'Implementation support', nc: 'Consultation, recommendations, and certain follow-up assistance', gigline: 'Separately scoped hands-on implementation available' },
  { feature: 'Ongoing support', nc: 'Consultant assistance and certain return visits may be available', gigline: 'Project implementation and monthly support are available' },
  { feature: 'Geographic coverage', nc: 'Statewide North Carolina program', gigline: 'Piedmont Triad-focused private service' },
  { feature: 'Deliverables', nc: 'Based on NC DOL\u2019s consultation process', gigline: 'Defined in the GigLine proposal before work begins' },
];

const NC_DOL_PROVIDES = [
  'No-cost consultation for eligible employers',
  'No citations or penalties issued during the consultation',
  'Confidential workplace evaluation',
  'Safety and health hazard identification',
  'Review of applicable written programs and work practices',
  'Recommendations for improving the safety and health program',
  'Training that may be conducted or arranged',
  'Example programs that may help an employer develop its own policies',
];

const NcDolComparisonPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${CANONICAL}#webpage`,
    url: CANONICAL,
    name: 'NC DOL Free Safety Consultation vs. a Private Consultant',
    description: 'Plain-language comparison of North Carolina\u2019s free On-Site Consultation Program and a private GigLine engagement for Piedmont Triad employers.',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com/' },
    dateModified: '2026-09-18',
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
      { '@type': 'ListItem', position: 2, name: 'Resources', item: 'https://www.giglinecompliance.com/resources' },
      { '@type': 'ListItem', position: 3, name: 'NC DOL Consultation vs. Private Consultant', item: CANONICAL },
    ],
  };

  return (
    <main className="bg-white" data-testid="nc-dol-comparison-page">
      <SEO
        title="NC DOL Consultation vs. Private Consultant | GigLine"
        description="Compare NC DOL\u2019s free On-Site Consultation Program with private safety support from GigLine for Piedmont Triad manufacturers, warehouses, and contractors."
        canonical="/nc-dol-consultation-vs-private-consultant"
        ogTitle="NC DOL Free Safety Consultation vs. a Private Consultant"
        ogUrl={CANONICAL}
        schemas={[webPageLd, breadcrumbLd]}
      />

      {/* HERO */}
      <section className="relative py-16 md:py-24" style={{ backgroundColor: NAVY_DEEP }} data-testid="nc-dol-hero">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="uppercase text-amber-400 mb-4" style={{ ...mono, fontSize: '11px', letterSpacing: '0.18em' }}>
            AN HONEST COMPARISON FOR PIEDMONT TRIAD EMPLOYERS
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
            style={heading}
            data-testid="nc-dol-h1"
          >
            NC DOL Free Safety Consultation vs. a Private Consultant
          </h1>
          <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8 max-w-3xl">
            North Carolina offers small employers confidential, no-cost workplace safety consultation. So why would a manufacturer, warehouse, contractor, or fleet operation pay for private support? Here is the straight answer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/intake?service=compliance-readiness-visit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-slate-900 min-h-[44px]"
              style={{ backgroundColor: GOLD }}
              data-testid="nc-dol-hero-cta-primary"
            >
              Request a Compliance Readiness Visit <ArrowRight size={16} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-white border border-white/30 hover:bg-white/10 min-h-[44px]"
              data-testid="nc-dol-hero-cta-secondary"
            >
              Compare GigLine Services
            </Link>
          </div>
        </div>
      </section>

      {/* S1 */}
      <section className="py-14 md:py-20 bg-white" data-testid="nc-dol-s1">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6" style={heading}>
            Let&rsquo;s start with the truth about the free program.
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            NC DOL&rsquo;s Occupational Safety and Health On-Site Consultation Program is legitimate. If your budget is zero and you need safety help, use it. I am not going to tell a small employer to turn down a valuable free resource just so I can sell a walkthrough.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            But free consultation and private consulting are not the same engagement. The right choice depends on your timeline, what you need completed, and whether your team has the capacity to handle the corrective work.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-3 my-6 text-slate-900 italic text-lg"
            style={{ borderColor: GOLD, background: '#FAF7F0' }}
            data-testid="nc-dol-s1-pullquote"
          >
            Free does not mean useless, and paid does not automatically mean better. The question is which option fits your operation.
          </blockquote>
        </div>
      </section>

      {/* S2 */}
      <section className="py-14 md:py-20 bg-slate-50" data-testid="nc-dol-s2">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-4" style={heading}>
            What the NC DOL consultation program provides
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            The state program is designed to help smaller employers identify and eliminate workplace hazards. According to NC DOL, consultation services are free, confidential, and separate from compliance enforcement.
          </p>
          <ul className="grid gap-3 md:grid-cols-2 mb-8">
            {NC_DOL_PROVIDES.map((item, i) => (
              <li key={i} className="flex items-start gap-3 bg-white p-4 rounded border border-slate-200" data-testid={`nc-dol-provides-${i}`}>
                <Check size={18} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <span className="text-slate-800 text-[15px]">{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://www.labor.nc.gov/occupational-safety-and-health-consultation-program"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-[#2A52A0] hover:underline"
            data-testid="nc-dol-source-official"
          >
            Read about the official NC DOL consultation program <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* S3 */}
      <section className="py-14 md:py-20 bg-white" data-testid="nc-dol-s3">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6" style={heading}>
            What employers agree to when they use the program
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            The consultation does not produce citations or penalties, but it does create responsibilities for the participating employer.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            NC DOL states that employers must correct hazards identified during the visit and provide written confirmation by the agreed correction date. An extension may be requested when more time is needed.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            The employer also agrees to post the identified hazard list. Refusal to correct or verify correction of a serious hazard can result in referral to the NC DOL Compliance Bureau.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-3 my-6 text-slate-900 italic text-lg"
            style={{ borderColor: GOLD, background: '#FAF7F0' }}
            data-testid="nc-dol-s3-pullquote"
          >
            The free program is not an enforcement inspection, but it is also not a consequence-free practice walkthrough. Employers must be prepared to act on what is found.
          </blockquote>
          <ul className="mt-6 grid gap-2 text-sm">
            <li>
              <a href="https://www.labor.nc.gov/frequently-asked-questions" target="_blank" rel="noopener noreferrer" className="text-[#2A52A0] hover:underline inline-flex items-center gap-2" data-testid="nc-dol-source-faqs">
                NC DOL Consultation FAQs <ExternalLink size={12} aria-hidden="true" />
              </a>
            </li>
            <li>
              <a href="https://www.labor.nc.gov/what-expect-during-visit" target="_blank" rel="noopener noreferrer" className="text-[#2A52A0] hover:underline inline-flex items-center gap-2" data-testid="nc-dol-source-visit">
                What to Expect During an NC DOL Visit <ExternalLink size={12} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* S4 */}
      <section className="py-14 md:py-20 bg-slate-50" data-testid="nc-dol-s4">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6" style={heading}>
            Where GigLine fits
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4 max-w-3xl">
            NC DOL can help you identify hazards, understand applicable requirements, and improve your safety program. That is valuable.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6 max-w-3xl">
            GigLine is built for the owner or manager who needs a defined scope, a confirmed schedule, a prioritized written report, and the option to get help completing the work.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-3 my-6 text-slate-900 italic text-lg max-w-3xl"
            style={{ borderColor: GOLD, background: '#FAF7F0' }}
          >
            Finding the gap is one part. Closing it is another.
          </blockquote>
          <p className="text-lg text-slate-700 leading-relaxed mb-10 max-w-3xl">
            If a written program is missing, records are scattered, corrective actions are sitting open, or a customer audit is approaching, you may need more than another list. You may need someone to help build the system and organize the proof.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { title: 'Defined scope and price', body: 'We confirm what is included, what it costs, and what you will receive before the engagement is scheduled.' },
              { title: 'Prioritized written findings', body: 'GigLine documents the gaps, explains why they matter, and organizes corrective actions by priority instead of handing you an unstructured list.' },
              { title: 'Optional implementation', body: 'When requested, GigLine can separately scope program development, record organization, corrective-action tracking, and other implementation work.' },
              { title: 'Continued support', body: 'Project-based implementation and ongoing support are available when you want continuity from someone already familiar with your operation.' },
            ].map((f) => (
              <div key={f.title} className="bg-white p-6 rounded border border-slate-200" data-testid={`nc-dol-feature-${f.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{f.title}</h3>
                <p className="text-slate-700 text-[15px] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S5 Comparison */}
      <section className="py-14 md:py-20 bg-white" data-testid="nc-dol-s5" id="nc-dol-compare">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-8" style={heading}>
            Side-by-side comparison
          </h2>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded border border-slate-200">
            <table className="w-full text-sm" data-testid="nc-dol-compare-table">
              <thead>
                <tr style={{ backgroundColor: NAVY, color: 'white' }}>
                  <th className="text-left p-4 font-semibold" scope="col">Feature</th>
                  <th className="text-left p-4 font-semibold" scope="col">NC DOL On-Site Consultation</th>
                  <th className="text-left p-4 font-semibold" scope="col">GigLine Private Engagement</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((r, i) => (
                  <tr key={r.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <th scope="row" className="text-left p-4 font-semibold text-slate-900 align-top border-t border-slate-200 w-[22%]">{r.feature}</th>
                    <td className="p-4 text-slate-700 align-top border-t border-slate-200">{r.nc}</td>
                    <td className="p-4 text-slate-700 align-top border-t border-slate-200">{r.gigline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile stacked cards */}
          <div className="md:hidden grid gap-4" data-testid="nc-dol-compare-cards">
            {COMPARISON_ROWS.map((r) => (
              <div key={r.feature} className="rounded border border-slate-200 overflow-hidden">
                <div className="px-4 py-2 text-white font-semibold text-sm" style={{ backgroundColor: NAVY }}>{r.feature}</div>
                <dl className="grid grid-cols-1 divide-y divide-slate-200">
                  <div className="p-4">
                    <dt className="text-[11px] uppercase tracking-wider text-slate-500 mb-1" style={mono}>NC DOL On-Site Consultation</dt>
                    <dd className="text-slate-800 text-[15px]">{r.nc}</dd>
                  </div>
                  <div className="p-4 bg-slate-50">
                    <dt className="text-[11px] uppercase tracking-wider text-slate-500 mb-1" style={mono}>GigLine Private Engagement</dt>
                    <dd className="text-slate-800 text-[15px]">{r.gigline}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-600 italic max-w-3xl">
            A private engagement does not remove an employer&rsquo;s responsibility to correct workplace hazards or comply with applicable law.
          </p>
        </div>
      </section>

      {/* S6 */}
      <section className="py-14 md:py-20 bg-slate-50" data-testid="nc-dol-s6">
        <div className="max-w-5xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-8" style={heading}>
            Which option fits your operation?
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="bg-white p-6 md:p-8 rounded border border-slate-200" data-testid="nc-dol-fit-ncdol">
              <h3 className="font-bold text-slate-900 mb-4 text-xl">Consider NC DOL when:</h3>
              <ul className="space-y-2">
                {['Cost is the primary constraint', 'Your schedule is flexible', 'You want help establishing a safety baseline', 'Your team can manage the correction and verification process', 'You understand and can meet the program\u2019s participation requirements'].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-slate-800"><Check size={16} className="text-emerald-700 flex-shrink-0 mt-1" /><span>{b}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 md:p-8 rounded border-2" style={{ borderColor: GOLD }} data-testid="nc-dol-fit-gigline">
              <h3 className="font-bold text-slate-900 mb-4 text-xl">Consider GigLine when:</h3>
              <ul className="space-y-2">
                {['You need a defined scope and confirmed schedule', 'You want a prioritized written deliverable', 'You need customized documents rather than general examples', 'You want help completing and tracking corrective actions', 'You are preparing for a customer audit, insurance review, or operational change', 'You want continued support from someone familiar with your operation'].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-slate-800"><Check size={16} className="text-emerald-700 flex-shrink-0 mt-1" /><span>{b}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* S7 */}
      <section className="py-14 md:py-20 bg-white" data-testid="nc-dol-s7">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6" style={heading}>
            My honest recommendation
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            If money is tight, your timeline is flexible, and your team can manage the correction process, contact NC DOL. It is a legitimate resource, and using it may be the right decision.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            If the clock is already running, you need a defined deliverable, or you want help turning findings into completed corrections and organized documentation, talk with GigLine.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            I will ask a few questions about your operation, explain what fits, and give you the scope and price before anything is scheduled. If the free state program makes more sense for your situation, I will tell you that too.
          </p>
          <blockquote
            className="border-l-4 pl-5 py-3 my-6 text-slate-900 italic text-lg"
            style={{ borderColor: GOLD, background: '#FAF7F0' }}
          >
            No pressure. No scare tactics. Just a straight answer about what your operation needs.
          </blockquote>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: NAVY_DEEP }} data-testid="nc-dol-final-cta">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={heading}>
            Need help deciding where to start?
          </h2>
          <p className="text-lg text-white/85 leading-relaxed mb-8 max-w-2xl mx-auto">
            Tell me what is happening in your operation, what deadline you are facing, and what help you need. We will determine whether a GigLine engagement fits before anything is scheduled.
          </p>
          <Link
            to="/intake?service=compliance-readiness-visit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-slate-900 min-h-[44px]"
            style={{ backgroundColor: GOLD }}
            data-testid="nc-dol-final-cta-primary"
          >
            Request a Compliance Readiness Visit <ArrowRight size={16} />
          </Link>
          <p className="text-sm text-white/70 mt-4">
            Starting at $2,500. Scope and price confirmed before scheduling.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/85">
            <Link to="/services" className="hover:text-white underline" data-testid="nc-dol-final-cta-secondary-services">Compare GigLine Services</Link>
            <Link to="/safety-check" className="hover:text-white underline" data-testid="nc-dol-final-cta-safety-check">Take the 90-Second Safety Check</Link>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="py-10 bg-slate-100 border-t border-slate-200" data-testid="nc-dol-disclaimer">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
            <Info size={16} className="text-slate-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              GigLine Safety &amp; Compliance is an independent private consultancy. GigLine does not represent OSHA, the North Carolina Department of Labor, or any regulatory agency. This comparison is based on publicly available NC DOL information reviewed in September 2026. Program requirements and availability may change. Employers remain responsible for complying with applicable workplace safety and health requirements.
            </span>
          </p>
          <p className="mt-3 text-xs text-slate-500" style={mono}>Last reviewed September 2026</p>
        </div>
      </section>
    </main>
  );
};

export default NcDolComparisonPage;
