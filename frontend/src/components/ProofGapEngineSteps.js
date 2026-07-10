import React from 'react';
import { PROOF_GAP_ENGINE } from '../data/citationProofKits';

const NAVY = '#102A43';
const GOLD = '#C9A84C';

/**
 * ProofGapEngineSteps — reusable 4-step Score / Sort / Fix / Pull grid.
 * Used on the catalog page (with intro copy) and on each individual kit page
 * (without intro, as the "How the Kit Works" band).
 */
const ProofGapEngineSteps = ({
  kicker = 'The Proof Gap Engine™',
  heading = 'Four steps. One control loop.',
  intro = 'Every kit in the Citation-Proof Series runs on the same four-step method. It doesn’t matter which control area you’re fixing — the sequence is always the same.',
  showIntro = true,
  bg = 'white',
  compact = false,
}) => {
  return (
    <section
      className={compact ? 'py-12 md:py-16' : 'py-16 md:py-24'}
      style={{ background: bg }}
      data-testid="proof-gap-engine"
    >
      <div className="container max-w-6xl mx-auto px-5 md:px-8">
        {showIntro && (
          <div className="mb-12 max-w-3xl">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              {kicker}
            </p>
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight"
              style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
            >
              {heading}
            </h2>
            <p
              className="text-base md:text-[17px] leading-relaxed"
              style={{ color: 'rgba(10,22,40,0.68)', fontFamily: "Georgia, serif" }}
            >
              {intro}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {PROOF_GAP_ENGINE.map((step) => (
            <div
              key={step.step}
              className="rounded-md p-6 md:p-7 h-full"
              style={{ background: '#FBFBF9', border: '1px solid #e8e5dd' }}
              data-testid={`proof-gap-step-${step.name.toLowerCase()}`}
            >
              <p
                className="uppercase font-bold tracking-[0.18em] mb-3"
                style={{ color: GOLD, fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px' }}
              >
                Step {step.step}
              </p>
              <h3
                className="font-extrabold text-[22px] md:text-[24px] leading-tight mb-2.5"
                style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
              >
                {step.name}
              </h3>
              <p
                className="text-[14.5px] leading-[1.65]"
                style={{ color: 'rgba(10,22,40,0.7)', fontFamily: "Georgia, serif" }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProofGapEngineSteps;
