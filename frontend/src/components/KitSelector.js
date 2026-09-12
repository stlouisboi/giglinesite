/**
 * KitSelector: client-side decision layer inserted into /citation-proof-kits
 * between the Proof Gap Engine explanation and the kit grid.
 *
 * Design language: editorial navy / cream / gold. Italic serif headings, mono
 * kickers, hairline dividers, no boxed cards, no gradients. Tasteful domain
 * icons (LOTO, PIT, HazCom pictograms) signal authority without SaaS clutter.
 *
 * Client-side only. No DB, no form submission, no new checkout. Preserves
 * answers when navigating back. Keyboard accessible via native <button>.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  Truck,
  Flame,
  AlertTriangle,
  ClipboardList,
  Users,
  Layers,
} from 'lucide-react';

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

// ── Question schema ──
const Q_GAP = {
  id: 'gap',
  kicker: 'Question 01',
  prompt: 'What is the main safety gap you need to close first?',
  helper: 'Pick the one that is actually a problem right now. You can add more kits later.',
  options: [
    { value: 'loto', label: 'Hazardous energy control, lockout tagout on machines', icon: Lock },
    { value: 'pit', label: 'Powered industrial trucks, forklift or lift program', icon: Truck },
    { value: 'hazcom', label: 'Chemical safety and hazard communication, SDS and labels', icon: Flame },
    { value: 'incident', label: 'Incident, near miss, and corrective action follow-through', icon: AlertTriangle },
    { value: 'newhire', label: 'New hire onboarding and day-one authorization', icon: Users },
    { value: 'multi', label: 'More than one, I need a broader look at the whole site', icon: Layers },
  ],
};

const Q_STATE = {
  id: 'state',
  kicker: 'Question 02',
  prompt: 'How much of that program do you already have written down?',
  helper: 'Written means an actual document, not a plan you keep in your head.',
  options: [
    { value: 'foundation', label: 'Almost nothing, I need a foundation to build from' },
    { value: 'scattered', label: 'Some documents but they are scattered or out of date' },
    { value: 'documents-no-system', label: 'Full documents but no organized control system' },
  ],
};

const Q_EDITION = {
  id: 'edition',
  kicker: 'Question 03',
  prompt: 'How will your team use the deliverables day to day?',
  helper: 'This decides the edition. All three ship the same core content.',
  options: [
    { value: 'digital', label: 'Digital only, my team works out of Google Drive or SharePoint' },
    { value: 'control-system', label: 'Digital plus the full control system, forms, checklists, and log templates' },
    { value: 'binder', label: 'Pre-printed physical binder for inspectors and supervisors, plus digital' },
  ],
};

// Kit metadata used to render the result card. Only fields the selector
// needs, keeps this file self-contained. Slugs match /citation-proof-kits/:slug.
const KIT_META = {
  loto: {
    slug: 'loto-readiness-kit',
    name: 'LOTO Readiness Kit',
    controlArea: 'Hazardous energy control',
    released: true,
    icon: Lock,
  },
  pit: {
    slug: 'forklift-pit-readiness-kit',
    name: 'Forklift / PIT Readiness Kit',
    controlArea: 'Powered industrial trucks',
    released: true,
    icon: Truck,
  },
  hazcom: {
    slug: 'hazcom-pro-kit',
    name: 'HazCom Pro Kit',
    controlArea: 'Chemical safety and hazard communication',
    released: true,
    icon: Flame,
  },
  incident: {
    slug: 'incident-to-correction-kit',
    name: 'Incident-to-Correction Kit',
    controlArea: 'Incident, near miss, corrective action',
    released: false,
    icon: AlertTriangle,
  },
  newhire: {
    slug: 'new-hire-orientation-kit',
    name: 'New Hire Safety Orientation Kit',
    controlArea: 'Day-one onboarding and authorization',
    released: false,
    icon: Users,
  },
};

const EDITION_META = {
  digital: {
    label: 'Digital Edition',
    price: '$150',
    line: 'Complete kit as a branded PDF plus editable core forms.',
    tierParam: 'digital',
  },
  'control-system': {
    label: 'Compliance Control System',
    price: '$300',
    line: 'Digital plus the full control system: forms, checklists, and log templates.',
    tierParam: 'control-system',
    recommended: true,
  },
  binder: {
    label: 'Compliance Binder Edition',
    price: '$600',
    line: 'Pre-printed, tabbed physical binder with the printed system documents for the selected control area. Digital included.',
    tierParam: 'binder',
  },
};

const HAZCOM_STARTER = {
  slug: 'hazcom-starter-pack',
  name: 'HazCom Starter Pack',
  price: '$29',
  line: 'A right-sized foundation to get your HazCom paperwork on paper before you buy the full HazCom Pro Kit.',
};

// ── Decision logic ──
function deriveRecommendation({ gap, state, edition }) {
  if (gap === 'multi') {
    return { kind: 'crv' };
  }
  if (gap === 'hazcom' && state === 'foundation') {
    return { kind: 'starter' };
  }
  const kit = KIT_META[gap];
  const ed = EDITION_META[edition];
  if (!kit || !ed) return null;
  return { kind: 'kit', kit, edition: ed };
}

// ── Small UI primitives, hairline-only aesthetic ──
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
    <span className="ml-2 uppercase" style={{ ...mono, color: INK_MUTED, fontSize: '10.5px', letterSpacing: '0.2em' }}>
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
      style={{
        borderTop: `1px solid ${HAIRLINE}`,
        color: INK,
      }}
    >
      {Icon ? (
        <span
          aria-hidden="true"
          className="flex-shrink-0 mt-0.5 transition-colors"
          style={{ color: selected ? GOLD : INK_MUTED }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="flex-shrink-0 mt-1 rounded-full"
          style={{
            width: 8,
            height: 8,
            background: selected ? GOLD : 'transparent',
            border: `1.5px solid ${selected ? GOLD : HAIRLINE}`,
          }}
        />
      )}
      <span
        className="flex-1 text-[15px] md:text-[16px] leading-[1.55]"
        style={{
          ...sans,
          color: selected ? NAVY : INK,
          fontWeight: selected ? 600 : 500,
        }}
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
const ResultCard = ({ answers, recommendation, onRestart, onBack }) => {
  const restart = (
    <button
      type="button"
      onClick={onRestart}
      className="inline-flex items-center gap-2 hover:underline"
      style={{ ...mono, fontSize: '11.5px', color: INK_MUTED, letterSpacing: '0.14em' }}
      data-testid="kit-selector-restart"
    >
      Start Over
    </button>
  );
  const back = (
    <button
      type="button"
      onClick={onBack}
      className="inline-flex items-center gap-2 hover:underline"
      style={{ ...mono, fontSize: '11.5px', color: INK_MUTED, letterSpacing: '0.14em' }}
      data-testid="kit-selector-back"
    >
      <ArrowLeft size={12} /> Back
    </button>
  );

  // Multi-gap path: recommend CRV.
  if (recommendation.kind === 'crv') {
    return (
      <div data-testid="kit-selector-result-crv">
        <Kicker>Your recommendation</Kicker>
        <h3 className="italic mb-4" style={{ ...serif, color: NAVY, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.1 }}>
          A single kit will not close the gap. Start with a Compliance Readiness Visit.
        </h3>
        <p className="text-[15px] md:text-[16px] leading-[1.75] mb-8 max-w-2xl" style={{ color: INK_SOFT }}>
          When more than one control area is in trouble, a kit alone leaves half the site exposed. A Compliance Readiness Visit maps every gap across your operation, ranks them in the order OSHA looks at them, and gives you a fixed scope to close them one at a time.
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link
            to="/intake?service=compliance-readiness-visit"
            className="inline-flex items-center gap-2 font-bold py-3 px-6 transition-colors"
            style={{ background: NAVY, color: 'white', ...sans, fontSize: '14px' }}
            data-testid="kit-selector-cta-crv"
          >
            Request a Compliance Readiness Visit <ArrowRight size={14} />
          </Link>
          <a
            href="#kit-grid"
            className="inline-flex items-center gap-2 font-bold py-3 px-5 transition-colors"
            style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans, fontSize: '14px' }}
            data-testid="kit-selector-cta-compare-crv"
          >
            Compare All Kits
          </a>
        </div>
        <div className="flex items-center gap-6 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          {back}
          {restart}
        </div>
      </div>
    );
  }

  // HazCom Starter path.
  if (recommendation.kind === 'starter') {
    return (
      <div data-testid="kit-selector-result-starter">
        <Kicker>Your recommendation</Kicker>
        <h3 className="italic mb-2" style={{ ...serif, color: NAVY, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.1 }}>
          {HAZCOM_STARTER.name}. <span style={{ color: GOLD }}>{HAZCOM_STARTER.price}</span>.
        </h3>
        <p className="text-[14px] mb-6" style={{ ...mono, color: INK_MUTED, letterSpacing: '0.1em' }}>
          Foundation before you build the full HazCom Pro Kit.
        </p>
        <p className="text-[15px] md:text-[16px] leading-[1.75] mb-8 max-w-2xl" style={{ color: INK_SOFT }}>
          {HAZCOM_STARTER.line}
        </p>
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link
            to="/hazcom-starter-pack"
            className="inline-flex items-center gap-2 font-bold py-3 px-6 transition-colors"
            style={{ background: GOLD, color: NAVY, ...sans, fontSize: '14px' }}
            data-testid="kit-selector-cta-primary"
          >
            Review Recommended Kit <ArrowRight size={14} />
          </Link>
          <a
            href="#kit-grid"
            className="inline-flex items-center gap-2 font-bold py-3 px-5 transition-colors"
            style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans, fontSize: '14px' }}
            data-testid="kit-selector-cta-compare"
          >
            Compare All Kits
          </a>
        </div>
        <p className="text-[13.5px] italic leading-[1.7] mb-6 max-w-2xl" style={{ ...serif, color: INK_MUTED }}>
          More than one major gap? <Link to="/intake?service=compliance-readiness-visit" className="underline" style={{ color: NAVY }}>Request a Compliance Readiness Visit.</Link>
        </p>
        <div className="flex items-center gap-6 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
          {back}
          {restart}
        </div>
      </div>
    );
  }

  // Kit path.
  const { kit, edition } = recommendation;
  const Icon = kit.icon;
  const kitHref = kit.released
    ? `/citation-proof-kits/${kit.slug}${edition.tierParam ? `?tier=${edition.tierParam}` : ''}`
    : `/citation-proof-kits/${kit.slug}`;
  return (
    <div data-testid={`kit-selector-result-${kit.slug}`}>
      <Kicker>Your recommendation</Kicker>
      <div className="flex items-start gap-4 mb-3">
        {Icon ? (
          <span aria-hidden="true" style={{ color: GOLD, marginTop: 6 }}>
            <Icon size={26} strokeWidth={1.6} />
          </span>
        ) : null}
        <h3
          className="italic"
          style={{ ...serif, color: NAVY, fontSize: 'clamp(26px, 3.4vw, 36px)', lineHeight: 1.1, letterSpacing: '-0.005em' }}
        >
          {kit.name}, <span style={{ color: GOLD }}>{edition.label}</span>.
        </h3>
      </div>
      <p className="text-[13.5px] mb-6" style={{ ...mono, color: INK_MUTED, letterSpacing: '0.12em' }}>
        {kit.controlArea} &middot; {edition.price}
        {edition.recommended && (
          <span
            className="ml-3 inline-block px-2 py-0.5"
            style={{ background: GOLD, color: NAVY, fontSize: '10px', letterSpacing: '0.2em' }}
          >
            RECOMMENDED FOR MOST FACILITIES
          </span>
        )}
      </p>
      <p className="text-[15px] md:text-[16px] leading-[1.75] mb-6 max-w-2xl" style={{ color: INK_SOFT }}>
        {edition.line}
      </p>
      {!kit.released && (
        <p
          className="text-[13.5px] leading-[1.7] mb-6 max-w-2xl px-3 py-2"
          style={{ background: 'rgba(201,168,76,0.10)', borderLeft: `2px solid ${GOLD}`, color: NAVY }}
          data-testid="kit-selector-result-unreleased-note"
        >
          This kit is in final build. The product page has a waitlist form so you get first access when it ships.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link
          to={kitHref}
          className="inline-flex items-center gap-2 font-bold py-3 px-6 transition-colors"
          style={{ background: GOLD, color: NAVY, ...sans, fontSize: '14px' }}
          data-testid="kit-selector-cta-primary"
        >
          Review Recommended Kit <ArrowRight size={14} />
        </Link>
        <a
          href="#kit-grid"
          className="inline-flex items-center gap-2 font-bold py-3 px-5 transition-colors"
          style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans, fontSize: '14px' }}
          data-testid="kit-selector-cta-compare"
        >
          Compare All Kits
        </a>
      </div>
      <p className="text-[13.5px] italic leading-[1.7] mb-6 max-w-2xl" style={{ ...serif, color: INK_MUTED }}>
        More than one major gap? <Link to="/intake?service=compliance-readiness-visit" className="underline" style={{ color: NAVY }}>Request a Compliance Readiness Visit.</Link>
      </p>
      <div className="flex items-center gap-6 pt-5" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
        {back}
        {restart}
      </div>
    </div>
  );
};

// ── Root ──
const KitSelector = () => {
  const [step, setStep] = useState(0); // 0: gap, 1: state, 2: edition, 3: result
  const [answers, setAnswers] = useState({ gap: null, state: null, edition: null });

  // Determine the actual step flow based on answers.
  // gap === 'multi' → jump to result immediately (skip state + edition).
  // gap === 'hazcom' + state === 'foundation' → jump to result (starter pack), skip edition.
  const flow = useMemo(() => {
    const seq = ['gap'];
    if (answers.gap && answers.gap !== 'multi') {
      seq.push('state');
      // Everyone who is not on the starter path answers edition.
      const isStarter = answers.gap === 'hazcom' && answers.state === 'foundation';
      if (answers.state && !isStarter) seq.push('edition');
    }
    return seq;
  }, [answers]);

  const totalSteps = 3;
  const currentQuestionId = flow[step];
  const isResult = step >= flow.length;

  const recommendation = useMemo(() => {
    if (!isResult) return null;
    return deriveRecommendation(answers);
  }, [isResult, answers]);

  const selectAnswer = useCallback(
    (questionId, value) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };
        // Reset downstream when re-answering an upstream question.
        if (questionId === 'gap') {
          next.state = null;
          next.edition = null;
        } else if (questionId === 'state') {
          next.edition = null;
        }
        return next;
      });
      setStep((s) => s + 1);
    },
    [],
  );

  const goBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const restart = useCallback(() => {
    setStep(0);
    setAnswers({ gap: null, state: null, edition: null });
  }, []);

  const questionByCurrent = (id) => {
    if (id === 'gap') return Q_GAP;
    if (id === 'state') return Q_STATE;
    if (id === 'edition') return Q_EDITION;
    return null;
  };

  const q = questionByCurrent(currentQuestionId);
  const selectedValue = q ? answers[q.id] : null;

  return (
    <section
      id="kit-selector"
      data-testid="kit-selector"
      className="scroll-mt-20 px-5 md:px-8 py-16 md:py-20 lg:py-24"
      style={{ background: CREAM }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Intro */}
        <div className="mb-10 md:mb-14 max-w-3xl">
          <p
            className="uppercase font-bold mb-3"
            style={{ ...mono, color: GOLD, fontSize: '10.5px', letterSpacing: '0.28em' }}
            data-testid="kit-selector-eyebrow"
          >
            Find Your Starting Point
          </p>
          <h2
            className="italic mb-5"
            style={{
              ...serif,
              color: NAVY,
              fontSize: 'clamp(30px, 4.5vw, 48px)',
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
            }}
            data-testid="kit-selector-heading"
          >
            Which GigLine kit fits your operation?
          </h2>
          <p className="text-[15px] md:text-[17px] leading-[1.65] mb-4 max-w-2xl" style={{ color: INK_SOFT }}>
            Answer a few floor-level questions. We&rsquo;ll recommend the control area and edition that best fits the gap you are trying to close.
          </p>
          <p
            className="text-[13.5px] italic leading-[1.7] max-w-2xl"
            style={{ ...serif, color: INK_MUTED }}
          >
            This selector provides a starting recommendation. Review the complete product page before purchasing.
          </p>
        </div>

        {/* Panel */}
        <div
          className="relative"
          style={{
            background: 'white',
            border: `1px solid ${HAIRLINE}`,
            padding: '32px 24px',
            boxShadow: '0 1px 0 rgba(10,22,40,0.02)',
          }}
        >
          {/* Gold hairline top accent */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0"
            style={{ width: 48, height: 2, background: GOLD }}
          />
          <div className="md:px-6 md:py-4">
            {!isResult && q && (
              <div key={q.id} data-testid={`kit-selector-step-${q.id}`}>
                <ProgressDots total={totalSteps} current={Math.min(step, totalSteps - 1)} />
                <Kicker>{q.kicker}</Kicker>
                <Prompt>{q.prompt}</Prompt>
                <Helper>{q.helper}</Helper>
                <div
                  role="radiogroup"
                  aria-label={q.prompt}
                  style={{ borderBottom: `1px solid ${HAIRLINE}` }}
                >
                  {q.options.map((opt) => (
                    <OptionRow
                      key={opt.value}
                      option={opt}
                      selected={selectedValue === opt.value}
                      onClick={(v) => selectAnswer(q.id, v)}
                      testid={`kit-selector-option-${q.id}-${opt.value}`}
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
                      data-testid="kit-selector-back-step"
                    >
                      <ArrowLeft size={12} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={restart}
                      className="inline-flex items-center gap-2 hover:underline"
                      style={{ ...mono, fontSize: '11.5px', color: INK_MUTED, letterSpacing: '0.14em' }}
                      data-testid="kit-selector-restart-step"
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </div>
            )}

            {isResult && recommendation && (
              <ResultCard
                answers={answers}
                recommendation={recommendation}
                onRestart={restart}
                onBack={goBack}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitSelector;
