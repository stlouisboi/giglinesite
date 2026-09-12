import React, { useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, ArrowRight, Download } from 'lucide-react';
import { OSHA_TWELVE_QUESTIONS_ENABLED } from '../config/features';
import SEO from '../components/SEO';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#FAF7F1';
const INK = '#0A1628';
const INK_SOFT = 'rgba(10,22,40,0.72)';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "'Manrope', sans-serif" };

const QUESTIONS = [
  { q: 'Where is the written safety and health program, and when was it last reviewed?', paper: 'A dated, revision-numbered document with a named owner. Reviewed within the last 12 months.' },
  { q: 'Which employees are authorized to lock out equipment, and where are their annual periodic inspection records?', paper: 'A signed authorized-employee list plus one periodic inspection record per authorized employee per procedure per year.' },
  { q: 'Who trained every operator on every truck class they are qualified for, and when?', paper: 'PIT operator evaluation records per operator per truck class, refresher records, and a documented three-year re-evaluation cadence.' },
  { q: 'Where does an employee look up the safety data sheet for a chemical they are about to use?', paper: 'A retrievable SDS binder or digital library reachable within three minutes at every work location, cross-referenced to a current chemical inventory.' },
  { q: 'When was the last time every fire extinguisher on-site was visually inspected, and by whom?', paper: 'A monthly visual inspection log per extinguisher, plus an annual maintenance service tag from a qualified vendor.' },
  { q: 'Where is your OSHA 300 log for the current calendar year, and where was the OSHA 300A posted last February 1?', paper: 'Current calendar-year 300 log, prior-year 300A, and a dated photo or witness signature confirming the 300A was posted Feb 1 through April 30.' },
  { q: 'Which employees have been trained on hazard communication, and what were the eight topics covered?', paper: 'HazCom training records naming every topic covered per 29 CFR 1910.1200(h)(3): hazard identification, physical vs. health hazards, protective measures, work practice controls, PPE, SDS use, labeling, program location.' },
  { q: 'Where is your written Emergency Action Plan and when was the last drill?', paper: 'A written EAP naming egress routes, alarm signals, muster point, evacuation coordinator, plus a documented drill record within the last twelve months.' },
  { q: 'Who evaluated the PPE hazard assessment for each task, and where is the record?', paper: 'A written PPE Hazard Assessment per task or job classification, signed and dated by a qualified person per 29 CFR 1910.132(d).' },
  { q: 'Where is your machine guarding documentation for every point-of-operation hazard?', paper: 'A machine-specific written analysis of point-of-operation, ingoing nip point, rotating part, and flying chip hazards, with the guarding solution documented and dated.' },
  { q: 'Where does an incident go from "it happened" to "it is closed"?', paper: 'An incident report form, root-cause investigation record, corrective action assignment with owner and target date, and follow-up verification that the correction holds.' },
  { q: 'Who is the named safety coordinator, and where is their contact information posted?', paper: 'A named person with phone or email, listed in the written program and posted at least in the primary work areas or on the shared drive.' },
];

const OshaTwelveQuestionsPage = () => {
  const [form, setForm] = useState({ firstName: '', email: '', company: '', consent: false, website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const previewBypass = searchParams.get('preview') === '1';

  if (!OSHA_TWELVE_QUESTIONS_ENABLED && !previewBypass) {
    return <Navigate to="/resources" replace />;
  }

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) return;
    // DRAFT STATE: local confirmation only. Backend wiring pending owner approval.
    setSubmitted(true);
  };

  return (
    <main className="pb-20" style={{ background: CREAM, color: INK, minHeight: '100vh' }} data-testid="osha-twelve-questions-page">
      <SEO
        title="12 Questions to Answer Before OSHA Walks In | GigLine"
        description="Twelve prompts the walkthrough asks first, with the paper each one actually needs. Educational draft. Not a compliance evaluation."
        canonical="/12-questions"
        noindex
      />

      <div className="max-w-3xl mx-auto px-5 pt-10 md:pt-16">
        <p className="uppercase font-bold tracking-[0.28em] mb-3" style={{ ...mono, fontSize: '10.5px', color: GOLD }}>
          Educational Field Guide · Draft
        </p>

        <h1 className="font-bold leading-[1.05] mb-5 text-[36px] sm:text-[44px] md:text-[54px] tracking-tight" style={{ ...sans, color: NAVY }} data-testid="tq-headline">
          12 Questions to Answer Before OSHA Walks In
        </h1>

        <p className="text-[17px] md:text-[19px] leading-[1.55] italic mb-8 max-w-2xl" style={{ color: INK_SOFT, ...serif }}>
          Twelve prompts the site walkthrough typically asks first, with the paper each question actually needs behind it. If a question does not have an obvious answer at your operation, that is not a citation, it is a gap worth reviewing in daylight rather than during an inspection.
        </p>

        <p className="text-[15px] leading-[1.72] mb-10 max-w-2xl" style={{ color: INK_SOFT, ...serif }}>
          Reading time, about six minutes. Answering time, longer, because the point is not to read the twelve, it is to walk to where the paper lives and time yourself.
        </p>

        <ol className="space-y-8 mb-14" data-testid="tq-questions">
          {QUESTIONS.map((item, i) => (
            <li key={i} style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: '20px' }}>
              <p className="uppercase font-bold tracking-[0.28em] mb-2" style={{ ...mono, fontSize: '10.5px', color: GOLD }}>
                Question {String(i + 1).padStart(2, '0')}
              </p>
              <p className="font-bold leading-[1.35] mb-3 text-[19px] md:text-[22px]" style={{ ...sans, color: NAVY }}>
                {item.q}
              </p>
              <p className="text-[14.5px] leading-[1.7]" style={{ color: INK_SOFT, ...serif }}>
                <strong style={{ color: NAVY }}>What the paper looks like:</strong> {item.paper}
              </p>
            </li>
          ))}
        </ol>

        {/* Optional lead form + confirmation state */}
        {!submitted ? (
          <section className="p-6 md:p-8 mb-10" style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '3px' }}>
            <p className="uppercase font-bold tracking-[0.22em] mb-2" style={{ ...mono, fontSize: '10.5px', color: NAVY }}>
              Optional: get the printable one-pager
            </p>
            <p className="text-[13.5px] leading-[1.65] mb-5" style={{ color: INK_SOFT, ...serif }}>
              You can work through these questions directly on this page. If you would prefer a printable one-page PDF version emailed to you, share your work email below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="tq-form">
              <input type="text" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>First name</label>
                  <input type="text" required value={form.firstName} onChange={set('firstName')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="tq-firstname" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Work email</label>
                  <input type="email" required value={form.email} onChange={set('email')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="tq-email" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Company (optional)</label>
                <input type="text" value={form.company} onChange={set('company')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="tq-company" />
              </div>
              <label className="flex items-start gap-2.5 text-[13px] leading-[1.55] cursor-pointer" style={{ ...serif, color: INK_SOFT }}>
                <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-1 flex-shrink-0" data-testid="tq-consent" />
                <span>Also send occasional practical safety guidance from GigLine. Unchecked by default. Unsubscribe any time.</span>
              </label>
              <button type="submit" className="inline-flex items-center gap-2 font-bold px-5 py-3 text-[14px] transition-colors" style={{ background: NAVY, color: 'white', ...sans }} data-testid="tq-submit">
                <Mail size={15} /> Email me the printable version
              </button>
              <p className="text-[11.5px] italic mt-1" style={{ color: INK_MUTED }}>
                Draft state, form is not wired to live delivery. Owner reviews before enabling.
              </p>
            </form>
          </section>
        ) : (
          <section className="p-6 md:p-8 mb-10" style={{ background: 'white', border: `1px solid ${GOLD}`, borderRadius: '3px' }} data-testid="tq-confirmation">
            <CheckCircle2 size={28} style={{ color: GOLD }} />
            <p className="uppercase font-bold tracking-[0.22em] mt-3 mb-1" style={{ ...mono, fontSize: '11px', color: NAVY }}>
              Requested (draft)
            </p>
            <p className="text-[14.5px] leading-[1.65] mb-4" style={{ color: INK_SOFT, ...serif }}>
              In a live send, GigLine would email the 12 Questions printable one-pager to <strong>{form.email}</strong> within a few minutes. {form.consent ? 'You opted into occasional practical safety guidance from GigLine. You can unsubscribe at any time.' : 'You did NOT opt into follow-up guidance. You will only receive this one delivery email.'}
            </p>
            <a href="/assets/12-Questions-Before-OSHA-Walks-In-DRAFT.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold px-5 py-2.5 text-[13px] transition-colors" style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans }}>
              <Download size={14} /> Download the draft PDF (placeholder)
            </a>
          </section>
        )}

        <div className="p-5 mb-10" style={{ background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.35)`, borderRadius: '3px' }} data-testid="tq-disclaimer">
          <p className="uppercase font-bold tracking-[0.22em] mb-2" style={{ ...mono, fontSize: '9.5px', color: NAVY }}>
            About this field guide
          </p>
          <p className="text-[12.5px] leading-[1.65] italic" style={{ ...serif, color: INK_SOFT }}>
            This is an educational field guide. It is not a compliance evaluation, a legal opinion, or a substitute for a written program review or on-site walkthrough. Federal OSHA standards apply broadly; state OSH plans may impose additional requirements. Every question must be evaluated against your specific operation, equipment, and workforce.
          </p>
        </div>

        <div className="mb-10" data-testid="tq-next-step">
          <p className="uppercase font-bold tracking-[0.22em] mb-3" style={{ ...mono, fontSize: '10.5px', color: GOLD }}>
            If several questions do not have obvious answers
          </p>
          <p className="text-[15px] leading-[1.72] mb-4 max-w-2xl" style={{ ...serif, color: INK_SOFT }}>
            The reasonable next step is one of GigLine's fixed-quote engagements. All three are private, no retainer required.
          </p>
          <ul className="text-[14.5px] leading-[1.75] space-y-1.5" style={{ ...serif, color: INK }}>
            <li><strong>Safety Walkthrough, $1,300.</strong> On-site review of physical hazards, written report in 48 hours.</li>
            <li><strong>Documentation Readiness Review, $1,700.</strong> Structured review of written programs, training records, evidence.</li>
            <li><strong>Compliance Readiness Visit, $2,500.</strong> Both, in a single visit. Saves $500 vs. purchasing separately.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/services" className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px] transition-colors" style={{ background: NAVY, color: 'white', ...sans }} data-testid="tq-cta-services">
              See all services <ArrowRight size={14} />
            </Link>
            <Link to="/intake" className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px] transition-colors" style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans }} data-testid="tq-cta-intake">
              Request a fixed quote
            </Link>
          </div>
        </div>

        <p className="text-[11.5px] italic mt-8" style={{ color: INK_MUTED }}>
          Feb 2026 draft, awaiting owner approval before public release.
        </p>
      </div>
    </main>
  );
};

export default OshaTwelveQuestionsPage;
