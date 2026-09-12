/**
 * ExitFeedbackStub, Phase 2 Batch 2B, Checkpoint 2 (Feb 2026).
 *
 * Tiny "What stopped you from taking the next step today?" prompt kept
 * entirely behind EXIT_FEEDBACK_ENABLED. The flag is `false` in every
 * environment; the component renders null unless explicitly enabled by
 * flipping the flag. No API is called and no free-text field is offered.
 * The design keeps the prompt as a set of finite radio choices so the
 * data collected can never carry sensitive workplace descriptions.
 */
import React, { useState } from 'react';
import { EXIT_FEEDBACK_ENABLED } from '../config/features';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK = '#0A1628';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

export const EXIT_FEEDBACK_CHOICES = [
  { value: 'leadership-approval', label: 'I need leadership approval' },
  { value: 'unsure-fit', label: 'I am not sure which option fits' },
  { value: 'price', label: 'Price' },
  { value: 'timing', label: 'Timing' },
  { value: 'want-to-talk', label: 'I want to speak with someone first' },
  { value: 'researching', label: 'I am still researching' },
];

const ExitFeedbackStub = ({ source = 'recommendation' }) => {
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  if (!EXIT_FEEDBACK_ENABLED) return null;

  return (
    <section
      className="mt-8 p-5"
      style={{ background: 'white', border: `1px solid ${HAIRLINE}` }}
      data-testid={`exit-feedback-${source}`}
    >
      <p
        className="uppercase font-bold tracking-[0.22em] mb-3"
        style={{ color: GOLD, ...mono, fontSize: '10.5px' }}
      >
        Optional, one tap
      </p>
      <h4
        className="font-bold text-[16px] md:text-[18px] mb-4"
        style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
      >
        What stopped you from taking the next step today?
      </h4>
      {submitted ? (
        <p className="text-[14px]" style={{ color: INK_MUTED }} data-testid="exit-feedback-confirmation">
          Thanks. That feedback stays local to your browser session in this preview build; nothing is transmitted.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EXIT_FEEDBACK_CHOICES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setChoice(c.value);
                setSubmitted(true);
              }}
              className="text-left px-3 py-2 text-[13.5px] transition-colors"
              style={{
                border: `1px solid ${HAIRLINE}`,
                color: INK,
                background: 'white',
              }}
              data-testid={`exit-feedback-option-${c.value}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ExitFeedbackStub;
