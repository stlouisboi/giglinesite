/**
 * "12 Questions to Answer Before OSHA Walks In" (Phase 2 draft, Batch 2A.1).
 *
 * Gated behind OSHA_TWELVE_QUESTIONS_ENABLED. Preview bypass ?preview=1
 * is honored ONLY in the private preview build; production builds redirect
 * to /resources regardless of the query string.
 */
import React, { useRef, useState } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, ArrowRight, Download } from 'lucide-react';
import { OSHA_TWELVE_QUESTIONS_ENABLED } from '../config/features';
import { isPreviewBypassAllowed } from '../lib/previewGate';
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
  {
    q: 'How does your operation handle Hazard Communication for the chemicals your employees actually use?',
    evidence: 'A written Hazard Communication program (29 CFR 1910.1200(e)(1)), an employer-maintained list of hazardous chemicals present, safety data sheets readily accessible during each work shift (1910.1200(g)(8)), employee information and training covering the elements at 1910.1200(h)(3), and workplace container labeling under 1910.1200(f)(6).',
    kind: 'required',
  },
  {
    q: 'For every machine that requires servicing or maintenance, how do employees know the specific steps to shut it down, isolate the energy, and verify it is safe to work on?',
    evidence: 'A written Energy Control Program (29 CFR 1910.147(c)(4)(i)) and machine-specific written energy control procedures (1910.147(c)(4)(i) and (c)(4)(ii)), employee training for authorized, affected, and other employees (1910.147(c)(7)), and certification of periodic inspection of each energy control procedure at least annually per 1910.147(c)(6)(ii).',
    kind: 'required',
  },
  {
    q: 'For every operator on every truck class, who trained them, who evaluated them, and when is the next three-year evaluation due?',
    evidence: 'Operator training and evaluation records per 29 CFR 1910.178(l)(6), truck-type-specific training under (l)(3), refresher training triggers under (l)(4)(ii), and performance evaluation at least once every three years under (l)(4)(iii). Applies when the operation uses powered industrial trucks.',
    kind: 'applicability',
  },
  {
    q: 'When an employee needs to look up the safety data sheet for a chemical they are about to use, how do they do it?',
    evidence: 'Safety data sheets readily accessible during each work shift (29 CFR 1910.1200(g)(8)), reachable at or near every work location where hazardous chemicals are used. GigLine readiness benchmark is retrieval within three minutes; the standard does not set a specific retrieval time.',
    kind: 'required',
  },
  {
    q: 'Who evaluated the PPE hazard assessment for each task, and where is the record?',
    evidence: 'A workplace hazard assessment with written certification identifying the workplace evaluated, the person certifying, the date, and identification of the document as a certification of hazard assessment, per 29 CFR 1910.132(d). PPE training records under 1910.132(f).',
    kind: 'required',
  },
  {
    q: 'When a recordable injury or illness occurs, how quickly is the OSHA 300 log entered and how is the 300A posted?',
    evidence: 'OSHA 300 log entry within seven calendar days after receiving information that a recordable injury or illness occurred (29 CFR 1904.29(b)(3)); 300A summary posted February 1 through April 30 for the previous calendar year (1904.32(b)(6)). Applies to non-exempt employers, see the partial exemption at 1904.1 and industry list at 1904.2.',
    kind: 'applicability',
  },
  {
    q: 'When a fatality, in-patient hospitalization, amputation, or eye loss occurs, how is it reported to OSHA, and how quickly?',
    evidence: 'Fatality reported within eight hours; in-patient hospitalization, amputation, or eye loss reported within twenty-four hours, per 29 CFR 1904.39. The contact channels are the OSHA area office, the OSHA hotline at 1-800-321-6742, or the online form.',
    kind: 'required',
  },
  {
    q: 'For every point-of-operation, ingoing nip point, rotating part, or flying chip hazard, how are employees protected?',
    evidence: 'Machine guarding provided to protect operators and other employees from those hazards, per 29 CFR 1910.212(a). Guarding requirements specific to certain machinery classes appear at 1910.213 through 1910.219. A written machine-specific analysis is a GigLine readiness practice.',
    kind: 'applicability',
  },
  {
    q: 'What is your emergency evacuation plan, and how do employees know what to do when the alarm sounds?',
    evidence: 'A written Emergency Action Plan under 29 CFR 1910.38, required when the standard applies. Content elements at 1910.38(c), employee alarm at 1910.38(d), evacuation procedures at 1910.38(c)(2), and information and training at 1910.38(e) and (f). Applicability, and whether the plan must be written, depends on the applicable standard and the employer size, see 1910.38(b).',
    kind: 'applicability',
  },
  {
    q: 'When an employee will use a respirator, has medical evaluation and fit testing been completed, and is the written respiratory protection program in place?',
    evidence: 'Written respiratory protection program including selection, medical evaluation, fit testing, training, cleaning, storage, and program evaluation, per 29 CFR 1910.134(c). Medical evaluation before fit testing under 1910.134(e). Fit testing under 1910.134(f). Applicability-dependent.',
    kind: 'applicability',
  },
  {
    q: 'When an incident happens, how does the operation record what happened, decide what to fix, and confirm the fix holds?',
    evidence: 'For non-exempt employers, OSHA 301 or an equivalent incident report within seven calendar days, per 29 CFR 1904.29(b)(3). Root-cause investigation, assigned corrective actions with named owners, and follow-up verification that the correction holds are GigLine readiness practices, not universal federal OSHA requirements.',
    kind: 'gigline',
  },
  {
    q: 'For every hazardous chemical container in the workplace, what does the label say?',
    evidence: 'Shipped containers labeled with product identifier, signal word, hazard statement(s), pictogram(s), precautionary statement(s), and supplier identification per 29 CFR 1910.1200(f)(1). Workplace containers labeled with product identifier plus words, pictures, symbols, or a combination that provide general information regarding the hazards, per 1910.1200(f)(6). Portable containers into which chemicals are transferred and used immediately by the same employee are excepted at 1910.1200(f)(8).',
    kind: 'required',
  },
];

const OshaTwelveQuestionsPage = () => {
  const [form, setForm] = useState({ firstName: '', email: '', company: '', consent: false, website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const firstNameRef = useRef(null);
  const emailRef = useRef(null);

  const previewBypass = isPreviewBypassAllowed(searchParams.get('preview'));

  if (!OSHA_TWELVE_QUESTIONS_ENABLED && !previewBypass) {
    return <Navigate to="/resources" replace />;
  }

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) { firstNameRef.current && firstNameRef.current.focus(); return; }
    if (!form.email.trim())     { emailRef.current && emailRef.current.focus(); return; }
    if (form.website) return;
    setSubmitted(true);
  };

  return (
    <main className="pb-20" style={{ background: CREAM, color: INK, minHeight: '100vh' }} data-testid="osha-twelve-questions-page">
      <SEO
        title="12 Questions to Answer Before OSHA Walks In | GigLine"
        description="Twelve calm, factual prompts covering the paper and practices commonly useful during a compliance review. Educational draft. Not a compliance evaluation."
        canonical="/12-questions"
        noindex
      />

      <div className="max-w-3xl mx-auto px-5 pt-10 md:pt-16">
        <p className="uppercase font-bold tracking-[0.28em] mb-3" style={{ ...mono, fontSize: '10.5px', color: GOLD }}>
          Educational Field Guide &middot; Draft
        </p>

        <h1 className="font-bold leading-[1.05] mb-5 text-[36px] sm:text-[44px] md:text-[54px] tracking-tight" style={{ ...sans, color: NAVY }} data-testid="tq-headline">
          12 Questions to Answer Before OSHA Walks In
        </h1>

        <p className="text-[17px] md:text-[19px] leading-[1.55] italic mb-8 max-w-2xl" style={{ color: INK_SOFT, ...serif }}>
          Twelve calm, factual prompts covering the paper and the practices commonly useful during a compliance review. Every prompt names the applicable regulation or notes that the practice is a GigLine readiness benchmark rather than a universal federal requirement.
        </p>

        <p className="text-[15px] leading-[1.72] mb-10 max-w-2xl" style={{ color: INK_SOFT, ...serif }}>
          Reading time, about six minutes. Answering time, longer, because the point is not to read the twelve, it is to walk to where the paper lives and time yourself against your own operation.
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
                <strong style={{ color: NAVY }}>What strong evidence may look like:</strong> {item.evidence}
              </p>
            </li>
          ))}
        </ol>

        {/* Optional lead form + confirmation state */}
        {!submitted ? (
          <section className="p-6 md:p-8 mb-10" style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '3px' }}>
            <h2 className="uppercase font-bold tracking-[0.22em] mb-2" style={{ ...mono, fontSize: '10.5px', color: NAVY }}>
              Optional. Get the printable one-pager
            </h2>
            <p id="tq-form-help" className="text-[13.5px] leading-[1.65] mb-5" style={{ color: INK_SOFT, ...serif }}>
              You can work through these questions directly on this page. If you would prefer a printable one-page PDF version emailed to you, share your work email below. Draft state, form is not wired to live delivery.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="tq-form" aria-describedby="tq-form-help" noValidate>
              <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} aria-hidden="true" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tq-first-name" className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>First name</label>
                  <input id="tq-first-name" ref={firstNameRef} type="text" name="firstName" autoComplete="given-name" required value={form.firstName} onChange={set('firstName')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="tq-firstname" />
                </div>
                <div>
                  <label htmlFor="tq-email" className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Work email</label>
                  <input id="tq-email" ref={emailRef} type="email" name="email" autoComplete="email" inputMode="email" required value={form.email} onChange={set('email')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="tq-email" />
                </div>
              </div>
              <div>
                <label htmlFor="tq-company" className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Company (optional)</label>
                <input id="tq-company" type="text" name="company" autoComplete="organization" value={form.company} onChange={set('company')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="tq-company" />
              </div>
              <div className="flex items-start gap-2.5">
                <input id="tq-consent" type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-1 flex-shrink-0" data-testid="tq-consent" />
                <label htmlFor="tq-consent" className="text-[13px] leading-[1.55] cursor-pointer" style={{ ...serif, color: INK_SOFT }}>
                  Also send occasional practical safety guidance from GigLine. Unchecked by default. Unsubscribe any time.
                </label>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 font-bold px-5 py-3 text-[14px]" style={{ background: NAVY, color: 'white', ...sans }} data-testid="tq-submit">
                <Mail size={15} /> Email me the printable version
              </button>
            </form>
          </section>
        ) : (
          <section className="p-6 md:p-8 mb-10" style={{ background: 'white', border: `1px solid ${GOLD}`, borderRadius: '3px' }} data-testid="tq-confirmation" aria-live="polite">
            <CheckCircle2 size={28} style={{ color: GOLD }} aria-hidden="true" />
            <p className="uppercase font-bold tracking-[0.22em] mt-3 mb-1" style={{ ...mono, fontSize: '11px', color: NAVY }}>
              Requested (draft)
            </p>
            <p className="text-[14.5px] leading-[1.65] mb-4" style={{ color: INK_SOFT, ...serif }}>
              In a live send, GigLine would email the 12 Questions printable one-pager to <strong>{form.email}</strong> within a few minutes.{' '}
              {form.consent
                ? 'Your requested resource will be delivered. You will also receive occasional practical safety guidance from GigLine. Unsubscribe at any time.'
                : 'Your requested resource will be delivered without adding you to ongoing marketing emails.'}
            </p>
            <a href="/assets/12-Questions-Before-OSHA-Walks-In-DRAFT.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold px-5 py-2.5 text-[13px]" style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans }}>
              <Download size={14} aria-hidden="true" /> Download the draft PDF (placeholder)
            </a>
          </section>
        )}

        <div className="p-5 mb-10" style={{ background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.35)`, borderRadius: '3px' }} data-testid="tq-disclaimer">
          <p className="uppercase font-bold tracking-[0.22em] mb-2" style={{ ...mono, fontSize: '9.5px', color: NAVY }}>
            About this field guide
          </p>
          <p className="text-[12.5px] leading-[1.65] italic" style={{ ...serif, color: INK_SOFT }}>
            This is an educational field guide covering paper and practices commonly useful during a compliance review. It is not a compliance evaluation, a legal opinion, or a substitute for a written program review or on-site walkthrough. Federal OSHA standards apply broadly; state OSH plans, including North Carolina OSH, may impose additional requirements. Every question must be evaluated against the specific operation, equipment, and workforce.
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
            <Link to="/services" className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px]" style={{ background: NAVY, color: 'white', ...sans }} data-testid="tq-cta-services">
              See all services <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link to="/intake" className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px]" style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans }} data-testid="tq-cta-intake">
              Request a fixed quote
            </Link>
          </div>
        </div>

        <p className="text-[11.5px] italic mt-8" style={{ color: INK_MUTED }}>
          September 2026 private draft, awaiting owner approval before public release.
        </p>
      </div>
    </main>
  );
};

export default OshaTwelveQuestionsPage;
