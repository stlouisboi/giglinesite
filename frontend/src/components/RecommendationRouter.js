/**
 * RecommendationRouter, Phase 2 Batch 2B (Feb 2026).
 *
 * Shared decision-support UI that drives the standalone /recommendation
 * page and the compact "Is this the right starting point?" embeds on the
 * three assessment service pages.
 *
 * All decision logic is imported from ../data/recommendationEngine.
 * This component only renders the questions, holds transient answer
 * state, and displays a <RecommendationResultCard/> when a result is
 * available.
 *
 * Privacy contract:
 *   - Answer codes live in local component state and, on continue-to-intake,
 *     in sessionStorage under `gl_recommendation_handoff`.
 *   - The URL passed to the intake page carries only `service`, `kit`,
 *     `edition`, `ref`, and `lead_source`. Answer codes and any free text
 *     are NEVER placed in the URL. This is enforced by the engine's
 *     `buildHandoff()` and asserted by tests.
 *
 * Email contract:
 *   - "Email my recommendation" is a preview-only form. No fetch, no
 *     transactional-email API. Confirmation reads "Preview only. No email
 *     was sent." Marketing consent is a separate unchecked checkbox and
 *     does not gate the delivery preview.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, RefreshCw, Mail } from 'lucide-react';
import {
  recommend,
  PATH_ID,
  RESULT_KIND,
  CONTROL_AREA_MAP,
  REVIEW_FOCUS_MAP,
  KIT_EDITIONS,
  OSS_QUALIFICATION_KEYS,
} from '../data/recommendationEngine';
import RecommendationResultCard from './RecommendationResultCard';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK = '#0A1628';
const INK_SOFT = 'rgba(10,22,40,0.72)';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "'Manrope', sans-serif" };

// ──────────────────────────────────────────────────────────────
// Question definitions. Answer VALUES ONLY are used for scoring so
// no free text is ever emitted from the router.
// ──────────────────────────────────────────────────────────────
const Q_PRIMARY = {
  id: 'primaryAim',
  kicker: 'Step 01 of up to 05',
  prompt: 'What are you trying to accomplish right now?',
  helper: 'Pick the closest fit. You can change your answers on the result screen.',
  options: [
    { value: PATH_ID.A, label: 'Fix one known safety-control area myself' },
    { value: PATH_ID.B, label: 'Review conditions on the floor, documentation, or both' },
    { value: PATH_ID.C, label: 'Close findings we already know about' },
    { value: PATH_ID.D, label: 'Build a complete safety-control system' },
    { value: PATH_ID.E, label: 'Maintain a safety foundation that is already working' },
  ],
};

const Q_A_CONTROL = {
  id: 'controlArea',
  kicker: 'Step 02 of up to 05',
  prompt: 'Which control area is the priority?',
  helper: 'Coming-soon kits will not offer a purchase, they will route to a waitlist.',
  options: [
    { value: 'loto', label: 'LOTO, lockout / tagout' },
    { value: 'pit', label: 'Forklift and Powered Industrial Trucks' },
    { value: 'hazcom-basics', label: 'HazCom, basics only ($29 Starter Pack)' },
    { value: 'hazcom-full', label: 'HazCom, complete control (Pro Kit)' },
    { value: 'incident', label: 'Incident correction and closure' },
    { value: 'new-hire', label: 'New-hire orientation' },
    { value: 'several-areas', label: 'Several connected areas' },
    { value: 'not-sure', label: 'I am not sure' },
  ],
};

const Q_A_EDITION = {
  id: 'edition',
  kicker: 'Step 03 of up to 05',
  prompt: 'Which level of control do you need?',
  helper: 'This determines the edition and price of the recommended kit.',
  options: [
    {
      value: 'digital',
      label: `${KIT_EDITIONS.digital.label}, ${KIT_EDITIONS.digital.price.displayPrice}`,
      description: 'Documents and implementation guidance.',
    },
    {
      value: 'controlSystem',
      label: `${KIT_EDITIONS.controlSystem.label}, ${KIT_EDITIONS.controlSystem.price.displayPrice}`,
      description: 'Documents plus control and tracking tools.',
    },
    {
      value: 'binder',
      label: `${KIT_EDITIONS.binder.label}, ${KIT_EDITIONS.binder.price.displayPrice}`,
      description: 'Digital system plus an organized physical binder.',
    },
  ],
};

const Q_B_FOCUS = {
  id: 'reviewFocus',
  kicker: 'Step 02 of up to 05',
  prompt: 'Where do you believe the greatest gap is?',
  helper: 'If you are not sure, that is a valid answer.',
  options: [
    { value: 'floor', label: 'Physical conditions on the floor' },
    { value: 'documentation', label: 'Written programs, training records, SDS, and recordkeeping' },
    { value: 'both', label: 'Both the floor and documentation' },
    { value: 'unsure', label: 'I am not sure' },
  ],
};

const Q_C_FINDINGS = {
  id: 'hasFindingsList',
  kicker: 'Step 02 of up to 05',
  prompt: 'Do you already have a documented findings list?',
  helper: 'Corrective Action Implementation begins with findings assigned owners and target dates.',
  options: [
    { value: true, label: 'Yes, we have a documented list' },
    { value: false, label: 'No, findings are not documented yet' },
  ],
};

const Q_E_1 = {
  id: 'programsExist',
  kicker: 'Step 02 of up to 05',
  prompt: 'Do written programs exist and reflect current operations?',
  options: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
    { value: 'unsure', label: 'I am not sure' },
  ],
};

const Q_E_2 = {
  id: 'trainingCurrent',
  kicker: 'Step 03 of up to 05',
  prompt: 'Is required training current and documented?',
  options: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
    { value: 'unsure', label: 'I am not sure' },
  ],
};

const Q_E_3 = {
  id: 'correctiveActionsTracked',
  kicker: 'Step 04 of up to 05',
  prompt: 'Are corrective actions assigned and tracked to closure?',
  options: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
    { value: 'unsure', label: 'I am not sure' },
  ],
};

const Q_E_4 = {
  id: 'primaryNeedRecurring',
  kicker: 'Step 05 of up to 05',
  prompt: 'Is the main need recurring review and accountability rather than building missing controls?',
  options: [
    { value: true, label: 'Yes' },
    { value: false, label: 'No, we still need to build or fix something' },
  ],
};

// ──────────────────────────────────────────────────────────────
// UI primitives. Editorial navy/gold, matches AssessmentSelector.
// ──────────────────────────────────────────────────────────────
const Kicker = ({ children }) => (
  <p
    className="uppercase font-bold mb-3"
    style={{ color: GOLD, letterSpacing: '0.28em', fontSize: '10.5px', ...mono }}
    data-testid="rr-step-kicker"
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
      fontSize: 'clamp(22px, 3vw, 30px)',
      lineHeight: 1.15,
    }}
    data-testid="rr-step-prompt"
  >
    {children}
  </h3>
);

const Helper = ({ children }) =>
  children ? (
    <p className="text-[14px] md:text-[15px] leading-[1.7] mb-6 max-w-2xl" style={{ color: INK_MUTED }}>
      {children}
    </p>
  ) : null;

const OptionRow = ({ option, selected, onClick, testid }) => (
  <button
    type="button"
    onClick={() => onClick(option.value)}
    aria-pressed={selected}
    data-testid={testid}
    className="group w-full text-left flex items-start gap-4 py-4 md:py-5 transition-colors focus:outline-none"
    style={{ borderTop: `1px solid ${HAIRLINE}`, color: INK }}
  >
    <span
      className="flex-1"
      style={{ ...sans, color: selected ? NAVY : INK, fontWeight: selected ? 600 : 500 }}
    >
      <span className="block text-[15px] md:text-[16px] leading-[1.5]">{option.label}</span>
      {option.description ? (
        <span className="block mt-1 text-[13px] md:text-[14px]" style={{ color: INK_MUTED }}>
          {option.description}
        </span>
      ) : null}
    </span>
    {selected && (
      <Check size={16} strokeWidth={2} style={{ color: GOLD, marginTop: 2 }} aria-hidden="true" />
    )}
  </button>
);

const QuestionBlock = ({ q, value, onSelect, testidPrefix }) => (
  <div data-testid={`rr-question-${q.id}`}>
    <Kicker>{q.kicker}</Kicker>
    <Prompt>{q.prompt}</Prompt>
    <Helper>{q.helper}</Helper>
    <div style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
      {q.options.map((opt) => (
        <OptionRow
          key={String(opt.value)}
          option={opt}
          selected={value === opt.value}
          onClick={onSelect}
          testid={`${testidPrefix}-${q.id}-${String(opt.value)}`}
        />
      ))}
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────
const RecommendationRouter = ({
  seedPrimaryAim = null,
  referringRoute = null,
  source = 'router',
  compact = false,
}) => {
  const [answers, setAnswers] = useState(() =>
    seedPrimaryAim ? { primaryAim: seedPrimaryAim } : {},
  );

  const setAnswer = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setAnswers(seedPrimaryAim ? { primaryAim: seedPrimaryAim } : {});
  }, [seedPrimaryAim]);

  const goBack = useCallback(() => {
    // Remove the last answered key so the previous step re-renders.
    setAnswers((prev) => {
      const keys = Object.keys(prev);
      if (keys.length === 0) return prev;
      const next = { ...prev };
      delete next[keys[keys.length - 1]];
      return next;
    });
  }, []);

  const result = useMemo(() => computeResult(answers), [answers]);
  const currentStep = useMemo(() => resolveCurrentStep(answers, result), [answers, result]);

  const testidPrefix = compact ? 'rr-compact' : 'rr';

  return (
    <section
      className="w-full"
      data-testid={compact ? 'recommendation-router-compact' : 'recommendation-router'}
      data-source={source}
    >
      {!result || result.kind === 'incomplete' ? (
        <QuestionBlock
          q={currentStep}
          value={answers[currentStep.id]}
          onSelect={(v) => setAnswer(currentStep.id, v)}
          testidPrefix={testidPrefix}
        />
      ) : (
        <RecommendationResultCard
          result={result}
          referringRoute={referringRoute}
          source={source}
          onRestart={reset}
        />
      )}

      {Object.keys(answers).length > 0 && (!result || result.kind === 'incomplete') && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-[13px] md:text-[14px] font-semibold transition-colors"
            style={{ color: INK_MUTED, ...mono }}
            data-testid="rr-back-btn"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ color: INK_MUTED, ...mono }}
            data-testid="rr-reset-btn"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Start over
          </button>
        </div>
      )}
    </section>
  );
};

// ──────────────────────────────────────────────────────────────
// Result computation. Runs the shared engine when all required
// answers are present for the selected path. Returns
// { kind: 'incomplete' } while a required answer is missing.
// ──────────────────────────────────────────────────────────────
function computeResult(answers) {
  const aim = answers.primaryAim;
  if (!aim) return { kind: 'incomplete' };

  if (aim === PATH_ID.A) {
    if (!answers.controlArea) return { kind: 'incomplete' };
    const entry = CONTROL_AREA_MAP[answers.controlArea];
    // Kit path needs edition; HazCom Starter Pack + service fallback + not-sure do not.
    const needsEdition =
      entry.kitSlug &&
      entry.kitSlug !== 'hazcom-starter-pack' &&
      entry.kitSlug !== null;
    if (needsEdition && !answers.edition) return { kind: 'incomplete' };
    const out = recommend({
      primaryAim: PATH_ID.A,
      controlArea: answers.controlArea,
      edition: answers.edition,
      answers,
    });
    if (out.kind === 'route-to-path' && out.routeToPath === PATH_ID.B) {
      // Not sure -> ask Path B focus question.
      return { kind: 'incomplete' };
    }
    return out;
  }
  if (aim === PATH_ID.B) {
    if (!answers.reviewFocus) return { kind: 'incomplete' };
    return recommend({ primaryAim: PATH_ID.B, reviewFocus: answers.reviewFocus, answers });
  }
  if (aim === PATH_ID.C) {
    if (typeof answers.hasFindingsList !== 'boolean') return { kind: 'incomplete' };
    const out = recommend({
      primaryAim: PATH_ID.C,
      hasFindingsList: answers.hasFindingsList,
      answers,
    });
    if (out.kind === 'route-to-path' && out.routeToPath === PATH_ID.B) {
      if (!answers.reviewFocus) return { kind: 'incomplete' };
      return recommend({ primaryAim: PATH_ID.B, reviewFocus: answers.reviewFocus, answers });
    }
    return out;
  }
  if (aim === PATH_ID.D) {
    return recommend({ primaryAim: PATH_ID.D, answers });
  }
  if (aim === PATH_ID.E) {
    const missing = OSS_QUALIFICATION_KEYS.find((k) => typeof answers[k] === 'undefined');
    if (missing) return { kind: 'incomplete' };
    const quals = {
      programsExist: answers.programsExist,
      trainingCurrent: answers.trainingCurrent,
      correctiveActionsTracked: answers.correctiveActionsTracked,
      primaryNeedRecurring: answers.primaryNeedRecurring,
    };
    return recommend({ primaryAim: PATH_ID.E, qualifications: quals, answers });
  }
  return { kind: 'incomplete' };
}

function resolveCurrentStep(answers, result) {
  const aim = answers.primaryAim;
  if (!aim) return Q_PRIMARY;

  if (aim === PATH_ID.A) {
    if (!answers.controlArea) return Q_A_CONTROL;
    const entry = CONTROL_AREA_MAP[answers.controlArea];
    if (
      entry.kitSlug &&
      entry.kitSlug !== 'hazcom-starter-pack' &&
      !answers.edition
    ) {
      return Q_A_EDITION;
    }
    // "not sure" -> ask Q_B_FOCUS
    if (!entry.kitSlug && entry.routeTo === 'service-assessment') {
      return Q_B_FOCUS;
    }
    return Q_A_CONTROL;
  }
  if (aim === PATH_ID.B) {
    return Q_B_FOCUS;
  }
  if (aim === PATH_ID.C) {
    if (typeof answers.hasFindingsList !== 'boolean') return Q_C_FINDINGS;
    if (answers.hasFindingsList === false && !answers.reviewFocus) return Q_B_FOCUS;
    return Q_C_FINDINGS;
  }
  if (aim === PATH_ID.D) return Q_PRIMARY;
  if (aim === PATH_ID.E) {
    if (typeof answers.programsExist === 'undefined') return Q_E_1;
    if (typeof answers.trainingCurrent === 'undefined') return Q_E_2;
    if (typeof answers.correctiveActionsTracked === 'undefined') return Q_E_3;
    if (typeof answers.primaryNeedRecurring === 'undefined') return Q_E_4;
    return Q_E_4;
  }
  return Q_PRIMARY;
}

export default RecommendationRouter;
export { computeResult, resolveCurrentStep };
