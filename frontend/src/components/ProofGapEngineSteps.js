import React from 'react';
import { PROOF_GAP_ENGINE } from '../data/citationProofKits';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const MONO = { fontFamily: "'JetBrains Mono', monospace" };
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };

/**
 * ProofGapEngineSteps, editorial 4-stage layout.
 * Used on the catalog page (with intro copy) and on each individual kit page
 * (without intro, as the "How the Kit Works" band).
 */
const ProofGapEngineSteps = ({
  kicker = 'The Proof Gap Engine',
  heading = 'Four steps. One control loop.',
  intro = 'Every kit in the GigLine Compliance Control Kit Series runs on the same four-step method. The control area changes; the sequence does not.',
  showIntro = true,
  bg = '#F5F4F0',
  compact = false,
}) => {
  return (
    <section
      className={compact ? 'py-12 md:py-20' : 'py-16 md:py-24 lg:py-28'}
      style={{ background: bg }}
      data-testid="proof-gap-engine"
    >
      <div className="container max-w-6xl mx-auto px-5 md:px-8">
        {showIntro && (
          <div className="mb-12 md:mb-16 lg:mb-20 max-w-3xl">
            <p className="uppercase font-bold mb-3" style={{ ...MONO, fontSize: '10.5px', letterSpacing: '0.22em', color: GOLD }}>
              {kicker}
            </p>
            <h2 className="text-[32px] sm:text-4xl md:text-5xl leading-[1.05] mb-4 italic" style={{ ...SERIF, color: NAVY, letterSpacing: '-0.015em' }}>
              {heading}
            </h2>
            <p className="text-[15px] md:text-lg leading-[1.65]" style={{ color: 'rgba(10,22,40,0.60)' }}>
              {intro}
            </p>
          </div>
        )}

        <div className="relative">
          <div
            className="hidden lg:block absolute left-0 right-0 h-px"
            style={{ top: '56px', background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.45) 6%, rgba(201,168,76,0.45) 94%, transparent 100%)' }}
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 md:gap-x-10 gap-y-12 sm:gap-y-14">
            {PROOF_GAP_ENGINE.map((step, i) => {
              const num = String(step.step).padStart(2, '0');
              return (
                <article key={step.step} className="relative" data-testid={`proof-gap-step-${step.name.toLowerCase()}`}>
                  <div
                    aria-hidden="true"
                    className="select-none leading-none mb-3"
                    style={{
                      ...SERIF,
                      fontSize: 'clamp(72px, 11vw, 108px)',
                      fontWeight: 700,
                      color: 'transparent',
                      WebkitTextStroke: '1.5px rgba(10,22,40,0.35)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {num}
                  </div>
                  <span
                    aria-hidden="true"
                    className="hidden lg:block absolute"
                    style={{ top: '50px', left: '-2px', width: '14px', height: '14px', borderRadius: '50%', background: bg, border: '2px solid ' + GOLD }}
                  />
                  <p className="uppercase font-bold mb-2" style={{ ...MONO, fontSize: '10px', letterSpacing: '0.20em', color: GOLD }}>
                    Stage {num}
                  </p>
                  <h3 className="text-[26px] sm:text-[28px] md:text-[30px] lg:text-[28px] xl:text-[32px] leading-[1.05] mb-3 italic" style={{ ...SERIF, color: NAVY, letterSpacing: '-0.005em' }}>
                    {step.name}.
                  </h3>
                  <p className="text-[14px] leading-[1.75] max-w-[32ch] sm:max-w-[28ch]" style={{ color: 'rgba(10,22,40,0.65)' }}>
                    {step.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofGapEngineSteps;
