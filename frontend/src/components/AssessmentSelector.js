/**
 * Shared AssessmentSelector, one component reused across every diagnostic
 * service page and the homepage. Diagnoses whether the primary gap is on
 * the floor, in the documentation, both, or unknown, then recommends
 * Safety Walkthrough, Documentation Readiness Review, or Compliance
 * Readiness Visit.
 *
 * Design language: matches KitSelector, editorial navy / cream / gold,
 * italic serif prompts, mono kickers, hairline dividers, tasteful line
 * icons for domain authority, no boxed option cards.
 *
 * Client-side only. Reads from ASSESSMENT_CATALOG. Never touches checkout.
 */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  HardHat,
  FileText,
  Layers,
  HelpCircle,
  ClipboardCheck,
  Shield,
  AlertOctagon,
  Wrench,
  UserCog,
  Camera,
  ClipboardList,
  Compass,
} from 'lucide-react';
import {
  ASSESSMENT_SERVICES,
  ASSESSMENT_CATALOG,
  STARTING_PRICE_DISCLAIMER,
} from '../data/assessmentCatalog';
import { assessmentEvents } from '../lib/analytics';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK = '#0A1628';
const INK_SOFT = 'rgba(10,22,40,0.72)';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';
const CREAM = '#FAF7F1';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "'Manrope', sans-serif" };

// ── Scoring keys map to catalog slugs ──
const WALK = 'safety-walkthrough';
const DOC = 'documentation-readiness-review';
const CRV = 'compliance-readiness-visit';

const Q1 = {
  id: 'gap',
  kicker: 'Question 01',
  prompt: 'Where do you believe the greatest gap is?',
  helper: 'Trust your gut. If you don\u2019t know, that is a valid answer.',
  options: [
    { value: 'floor', label: 'Physical conditions on the floor', icon: HardHat, score: { [WALK]: 2 } },
    { value: 'docs', label: 'Written programs and records', icon: FileText, score: { [DOC]: 2 } },
    { value: 'both', label: 'Both the floor and documentation', icon: Layers, score: { [CRV]: 3 } },
    { value: 'unknown', label: 'I am not sure', icon: HelpCircle, score: { [CRV]: 2 } },
  ],
};

const Q2 = {
  id: 'trigger',
  kicker: 'Question 02',
  prompt: 'What triggered the review?',
  helper: 'Only one answer, pick the strongest driver.',
  options: [
    { value: 'proactive', label: 'We want a proactive baseline', icon: Compass, score: {} },
    { value: 'osha', label: 'An OSHA inspection may be coming', icon: AlertOctagon, score: { [CRV]: 1 } },
    { value: 'insurer', label: 'An insurer or customer requested information', icon: ClipboardCheck, score: { [DOC]: 1, [CRV]: 1 } },
    { value: 'incident', label: 'We had an injury, complaint, or serious near miss', icon: Shield, score: { [CRV]: 2 } },
    { value: 'expansion', label: 'We expanded, added equipment, or changed operations', icon: Wrench, score: { [WALK]: 1, [CRV]: 1 } },
    { value: 'newmanager', label: 'A new manager inherited safety responsibility', icon: UserCog, score: { [DOC]: 1, [CRV]: 1 } },
  ],
};

const Q3 = {
  id: 'outcome',
  kicker: 'Question 03',
  prompt: 'What result would be most useful right now?',
  helper: 'The final answer, this drives the recommendation.',
  options: [
    { value: 'photos', label: 'Photos and a prioritized floor-level fix list', icon: Camera, score: { [WALK]: 2 } },
    { value: 'records', label: 'A clear list of missing or weak safety records', icon: ClipboardList, score: { [DOC]: 2 } },
    { value: 'baseline', label: 'One complete baseline covering the floor and the files', icon: Layers, score: { [CRV]: 3 } },
    { value: 'scope', label: 'I need help determining the scope', icon: HelpCircle, score: { [CRV]: 2 } },
  ],
};

const QUESTIONS = [Q1, Q2, Q3];

function computeRecommendation(answers) {
  const totals = { [WALK]: 0, [DOC]: 0, [CRV]: 0 };
  QUESTIONS.forEach((q) => {
    const value = answers[q.id];
    const opt = q.options.find((o) => o.value === value);
    if (!opt || !opt.score) return;
    Object.entries(opt.score).forEach(([slug, pts]) => {
      totals[slug] += pts;
    });
  });
  const entries = Object.entries(totals);
  entries.sort((a, b) => b[1] - a[1]);
  const [topSlug, topScore] = entries[0];
  const [, secondScore] = entries[1];
  // Tie rule: if there is any tie among the leaders, recommend CRV because it
  // covers both floor and documentation.
  const winner = topScore === secondScore ? CRV : topSlug;
  return { winner, totals };
}

// ── UI primitives ──
const Kicker = ({ children }) => (
  <p
    className="uppercase font-bold mb-3"
    style={{ color: GOLD, letterSpacing: '0.28em', fontSize: '10.5px', ...mono }}
  >
    {children}
  </p>
);

const Prompt = ({ children }) => (
  <h3
    className="italic mb-2"
    style={{
      ...serif,
      color: NAVY,
      fontSize: 'clamp(24px, 3.2vw, 32px)',
      lineHeight: 1.1,
      letterSpacing: '-0.005em',
    }}
  >
    {children}
  </h3>
);

const Helper = ({ children }) => (
  <p className="text-[14px] md:text-[15px] leading-[1.7] mb-8 max-w-2xl" style={{ color: INK_MUTED }}>
    {children}
  </p>
);

const ProgressDots = ({ total, current }) => (
  <div className="flex items-center gap-2 mb-5" aria-hidden="true">
    {Array.from({ length: total }).map((_, i) => (
      <span
        key={i}
        style={{
          width: i === current ? 20 : 6,
          height: 2,
          background: i <= current ? GOLD : HAIRLINE,
          transition: 'width 200ms ease, background 200ms ease',
        }}
      />
    ))}
    <span
      className="ml-2 uppercase"
      style={{ ...mono, color: INK_MUTED, fontSize: '10.5px', letterSpacing: '0.2em' }}
    >
      Step {current + 1} of {total}
    </span>
  </div>
);

const OptionRow = ({ option, selected, onClick, testid }) => {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={() => onClick(option.value)}
      aria-pressed={selected}
      data-testid={testid}
      className="group w-full text-left flex items-start gap-4 py-4 md:py-5 transition-colors focus:outline-none"
      style={{ borderTop: `1px solid ${HAIRLINE}`, color: INK }}
    >
      {Icon ? (
        <span
          aria-hidden="true"
          className="flex-shrink-0 mt-0.5 transition-colors"
          style={{ color: selected ? GOLD : INK_MUTED }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
      ) : null}
      <span
        className="flex-1 text-[15px] md:text-[16px] leading-[1.55]"
        style={{ ...sans, color: selected ? NAVY : INK, fontWeight: selected ? 600 : 500 }}
      >
        {option.label}
      </span>
      {selected && (
        <Check size={16} strokeWidth={2} style={{ color: GOLD, marginTop: 2 }} aria-hidden="true" />
      )}
    </button>
  );
};

// ── Result card ──
const ResultCard = ({ winner, answers, onRestart, onBack, onCtaClick, source }) => {
  const svc = ASSESSMENT_SERVICES[winner];
  const answerLabels = QUESTIONS.map((q) => {
    const opt = q.options.find((o) => o.value === answers[q.id]);
    return { q: q.prompt, a: opt?.label || '' };
  });
  const whyLine =
    winner === WALK
      ? 'Your answers point to the floor. Someone needs to walk every work cell, document what is exposed, and hand you a photographed fix list before anything else.'
      : winner === DOC
      ? 'Your answers point to the paperwork. Written programs, training records, SDS files, or recordkeeping need a document-by-document review against the standards that apply.'
      : 'Your answers point to both surfaces, or the picture is not clear enough yet to bet on one. The Compliance Readiness Visit covers the floor and the files in one engagement so you know exactly where you stand.';

  // Deep-link to the service page's intake block instead of the master
  // intake form. The buyer lands directly at the "Request This Assessment"
  // section on the specific service page, one more scroll-less step to
  // action. The service page's closing CTA still routes to /intake?service=…
  const primaryHref = `${svc.route}#intake`;
  const secondaryHref = '#assessment-compare';

  return (
    <div data-testid={`assessment-selector-result-${svc.slug}`}>
      <Kicker>Your recommendation</Kicker>
      <h3
        className="italic mb-3"
        style={{ ...serif, color: NAVY, fontSize: 'clamp(28px, 3.6vw, 38px)', lineHeight: 1.05, letterSpacing: '-0.005em' }}
      >
        {svc.name}.
      </h3>
      <p className="text-[13.5px] mb-5" style={{ ...mono, color: INK_MUTED, letterSpacing: '0.12em' }}>
        {svc.price.label}
        {svc.label && (
          <span
            className="ml-3 inline-block px-2 py-0.5"
            style={{ background: GOLD, color: NAVY, fontSize: '10px', letterSpacing: '0.2em' }}
            data-testid="assessment-selector-best-value-tag"
          >
            {svc.label}
          </span>
        )}
      </p>

      <p className="text-[15px] md:text-[16px] leading-[1.75] mb-6 max-w-2xl" style={{ color: INK_SOFT }} data-testid="assessment-selector-why">
        {whyLine}
      </p>

      {/* Combined-value proof for CRV. Shown verbatim per catalog. */}
      {winner === CRV && svc.combined && (
        <div
          className="mb-6 py-3 px-4 max-w-2xl"
          style={{ borderLeft: `2px solid ${GOLD}`, background: 'rgba(201,168,76,0.08)' }}
          data-testid="assessment-selector-combined-value"
        >
          <p className="uppercase font-bold mb-1" style={{ ...mono, fontSize: '10px', color: NAVY, letterSpacing: '0.2em' }}>
            Combined-service value
          </p>
          <p className="text-[13.5px] leading-[1.65]" style={{ color: NAVY, ...serif, fontStyle: 'italic' }}>
            {svc.combined.statement}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-6 max-w-3xl">
        <div>
          <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', color: NAVY, letterSpacing: '0.2em' }}>
            What is included
          </p>
          <ul className="space-y-1.5" data-testid="assessment-selector-included">
            {svc.deliverables.map((d) => (
              <li key={d} className="text-[14px] leading-[1.6] flex gap-2" style={{ color: INK_SOFT }}>
                <Check size={13} style={{ color: GOLD, marginTop: 5, flexShrink: 0 }} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', color: NAVY, letterSpacing: '0.2em' }}>
            What is not included
          </p>
          <ul className="space-y-1.5" data-testid="assessment-selector-excluded">
            {svc.notIncluded.map((d) => (
              <li key={d} className="text-[14px] leading-[1.6] flex gap-2" style={{ color: INK_MUTED }}>
                <span style={{ color: INK_MUTED, marginTop: 6, width: 8, height: 1, background: INK_MUTED, display: 'inline-block', flexShrink: 0 }} aria-hidden="true" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-5 max-w-2xl">
        <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', color: NAVY, letterSpacing: '0.2em' }}>
          Expected next step
        </p>
        <p className="text-[14px] leading-[1.7] italic" style={{ color: INK_SOFT, ...serif }}>
          {svc.nextStep}
        </p>
      </div>

      <div className="mb-6 max-w-2xl">
        <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', color: NAVY, letterSpacing: '0.2em' }}>
          Based on your answers
        </p>
        <ul className="space-y-1" data-testid="assessment-selector-answers-echo">
          {answerLabels.map(({ q, a }, i) => (
            <li key={i} className="text-[13px] leading-[1.6]" style={{ color: INK_MUTED }}>
              <span style={{ ...mono, letterSpacing: '0.08em' }}>Q{i + 1}</span>: {a}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[12.5px] italic leading-[1.6] mb-6 max-w-2xl" style={{ ...serif, color: INK_MUTED }}>
        {STARTING_PRICE_DISCLAIMER}
      </p>

      {/* Ongoing Safety Support gating notice, Phase 2. OSS is never a primary recommendation
          from this selector, it is surfaced only as a later-step option, and only when the
          buyer already has a usable foundation (written programs exist, training is current
          and documented, corrective actions are tracked). If the foundation is still being
          built, the primary recommendation above is the right next step. */}
      <div
        className="mb-8 max-w-2xl"
        style={{
          background: 'rgba(201,168,76,0.09)',
          border: `1px solid rgba(201,168,76,0.35)`,
          padding: '14px 16px',
          borderRadius: '3px',
        }}
        data-testid="assessment-selector-ongoing-support-note"
      >
        <p
          className="uppercase font-bold mb-2"
          style={{ ...mono, fontSize: '10px', color: NAVY, letterSpacing: '0.22em' }}
        >
          A later step, if the foundation is already in place
        </p>
        <p className="text-[13px] leading-[1.65]" style={{ color: INK_SOFT, ...serif }}>
          Ongoing Safety Support ($1,850 per month) is available once written programs exist,
          required training is current and documented, corrective actions are being tracked, and
          the primary need is recurring review and accountability. It is not the right first
          step when active gaps remain, close those with the recommendation above first.{' '}
          <Link
            to="/ongoing-safety-support"
            className="underline"
            style={{ color: NAVY, textDecorationColor: 'rgba(10,22,40,0.35)' }}
            onClick={() => onCtaClick && onCtaClick('ongoing-later-step', 'ongoing-safety-support')}
            data-testid="assessment-selector-ongoing-support-link"
          >
            See what Ongoing Safety Support covers &rarr;
          </Link>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link
          to={primaryHref}
          onClick={() => onCtaClick('primary', svc.slug)}
          className="inline-flex items-center gap-2 font-bold py-3 px-6 transition-colors"
          style={{ background: GOLD, color: NAVY, ...sans, fontSize: '14px' }}
          data-testid="assessment-selector-cta-primary"
        >
          Request This Assessment <ArrowRight size={14} />
        </Link>
        <a
          href={secondaryHref}
          onClick={() => onCtaClick('compare', svc.slug)}
          className="inline-flex items-center gap-2 font-bold py-3 px-5 transition-colors"
          style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans, fontSize: '14px' }}
          data-testid="assessment-selector-cta-compare"
        >
          Compare All Assessments
        </a>
      </div>

      <div className="flex items-center gap-6 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 hover:underline"
          style={{ ...mono, fontSize: '11.5px', color: INK_MUTED, letterSpacing: '0.14em' }}
          data-testid="assessment-selector-back"
        >
          <ArrowLeft size={12} /> Back
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 hover:underline"
          style={{ ...mono, fontSize: '11.5px', color: INK_MUTED, letterSpacing: '0.14em' }}
          data-testid="assessment-selector-restart"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

// ── Assessment comparison strip (used with #assessment-compare hash) ──
export const AssessmentComparisonStrip = ({ currentSlug }) => (
  <div id="assessment-compare" className="scroll-mt-24 mt-10 pt-10" style={{ borderTop: `1px solid ${HAIRLINE}` }} data-testid="assessment-comparison-strip">
    <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.5px', color: GOLD, letterSpacing: '0.24em' }}>
      Compare All Assessments
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ASSESSMENT_CATALOG.map((svc) => (
        <div key={svc.slug} className="pr-4" style={{ borderLeft: svc.slug === currentSlug ? `2px solid ${GOLD}` : `1px solid ${HAIRLINE}`, paddingLeft: 14 }} data-testid={`assessment-compare-card-${svc.slug}`}>
          <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', color: GOLD, letterSpacing: '0.2em' }}>
            {svc.price.label}
            {svc.label && <span className="ml-2" style={{ color: NAVY }}>&middot; {svc.label}</span>}
          </p>
          <h4 className="italic mb-2" style={{ ...serif, color: NAVY, fontSize: '20px', lineHeight: 1.1 }}>
            {svc.name}.
          </h4>
          <p className="text-[13.5px] leading-[1.6] mb-3" style={{ color: INK_SOFT }}>{svc.bestFit}</p>
          <Link to={svc.route} className="inline-flex items-center gap-1 font-bold" style={{ ...mono, fontSize: '11px', color: NAVY, borderBottom: `1px solid ${GOLD}`, paddingBottom: 2, letterSpacing: '0.14em' }}>
            LEARN MORE <ArrowRight size={11} />
          </Link>
        </div>
      ))}
    </div>
  </div>
);

// ── Root ──
const AssessmentSelector = ({ source = 'unknown', embedded = false }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ gap: null, trigger: null, outcome: null });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      assessmentEvents.start(source);
      setStarted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isResult = step >= QUESTIONS.length;
  const recommendation = useMemo(() => (isResult ? computeRecommendation(answers) : null), [isResult, answers]);

  useEffect(() => {
    if (isResult && recommendation) {
      assessmentEvents.result(recommendation.winner, { source, totals: recommendation.totals });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResult, recommendation && recommendation.winner]);

  const q = QUESTIONS[step];
  const selectAnswer = useCallback(
    (questionId, value) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      assessmentEvents.answer(questionId, value, { source });
      setStep((s) => s + 1);
    },
    [source]
  );
  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const restart = useCallback(() => {
    setStep(0);
    setAnswers({ gap: null, trigger: null, outcome: null });
  }, []);
  const handleCta = useCallback(
    (which, slug) => {
      assessmentEvents.cta(which, { recommendation: slug, source });
    },
    [source]
  );

  const selectedValue = q ? answers[q.id] : null;

  return (
    <div
      className="scroll-mt-24"
      style={embedded ? {} : { background: CREAM }}
      data-testid="assessment-selector"
      data-source={source}
    >
      <div
        style={{
          background: 'white',
          border: `1px solid ${HAIRLINE}`,
          padding: '32px 24px',
          boxShadow: '0 1px 0 rgba(10,22,40,0.02)',
          position: 'relative',
        }}
      >
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 2, background: GOLD }} />
        <div className="md:px-6 md:py-4">
          {!isResult && q && (
            <div key={q.id} data-testid={`assessment-selector-step-${q.id}`}>
              <ProgressDots total={QUESTIONS.length} current={step} />
              <Kicker>{q.kicker}</Kicker>
              <Prompt>{q.prompt}</Prompt>
              <Helper>{q.helper}</Helper>
              <div role="radiogroup" aria-label={q.prompt} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                {q.options.map((opt) => (
                  <OptionRow
                    key={opt.value}
                    option={opt}
                    selected={selectedValue === opt.value}
                    onClick={(v) => selectAnswer(q.id, v)}
                    testid={`assessment-selector-option-${q.id}-${opt.value}`}
                  />
                ))}
              </div>
              {step > 0 && (
                <div className="flex items-center gap-6 pt-6 mt-6" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 hover:underline"
                    style={{ ...mono, fontSize: '11.5px', color: INK_MUTED, letterSpacing: '0.14em' }}
                    data-testid="assessment-selector-back-step"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex items-center gap-2 hover:underline"
                    style={{ ...mono, fontSize: '11.5px', color: INK_MUTED, letterSpacing: '0.14em' }}
                    data-testid="assessment-selector-restart-step"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          )}

          {isResult && recommendation && (
            <>
              <ResultCard
                winner={recommendation.winner}
                answers={answers}
                onBack={goBack}
                onRestart={restart}
                onCtaClick={handleCta}
                source={source}
              />
              <AssessmentComparisonStrip currentSlug={recommendation.winner} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentSelector;
