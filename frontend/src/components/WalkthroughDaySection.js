import React from 'react';

/**
 * "What happens on the day of your walkthrough" — six-step rail.
 *
 * @param {'crv'|'walkthrough'} variant
 *   - 'crv' (default): renders all six steps; Step 4 (Documentation review) shows a CRV-only badge.
 *   - 'walkthrough': hides Step 4 entirely (5-step rail).
 * @param {'light'|'panel'} surface
 *   - 'light' (default): warm cream background (homepage band).
 *   - 'panel': slightly cooler panel background (services page detail).
 */

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const BG_WARM = '#FAF7F1';
const PANEL = '#F3ECDB';
const BORDER = '#E5DDCD';
const TEXT_MUTED = 'rgba(10,22,40,0.72)';
const TEXT_SUBTLE = 'rgba(10,22,40,0.55)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const sans = { fontFamily: "'Manrope', sans-serif" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const ALL_STEPS = [
  {
    id: 1,
    title: 'Vince arrives',
    body: "No clipboard, no form to fill out. Brief introductory conversation — who's on site, what areas are in scope, anything you want him to pay particular attention to.",
    crvOnly: false,
  },
  {
    id: 2,
    title: 'Floor walkthrough',
    body: 'Every production area, storage zone, and egress path. Vince moves through the facility the way an OSHA inspector would — looking at equipment, chemical storage, guarding, housekeeping, and anything that creates exposure.',
    crvOnly: false,
  },
  {
    id: 3,
    title: 'Photo documentation',
    body: 'Every finding is photographed on-site. No reconstruction from memory after the fact. The photo goes in the report with the finding it documents.',
    crvOnly: false,
  },
  {
    id: 4,
    title: 'Documentation review',
    body: 'Written programs, training records, OSHA 300 log, HazCom binder. Reviewed against current standards. Gaps documented the same way physical findings are.',
    crvOnly: true,
  },
  {
    id: 5,
    title: 'Exit conversation',
    body: 'Before Vince leaves, he walks you through what he found. No surprises in the report. You know the findings before you read them.',
    crvOnly: false,
  },
  {
    id: 6,
    title: 'Written report within 48 hours',
    body: 'CFR citations, estimated penalty exposure based on OSHA published maximums, prioritized corrective action plan, photo documentation. Delivered by email. Yours to keep.',
    crvOnly: false,
  },
];

export const WalkthroughDaySection = ({ variant = 'crv', surface = 'light' }) => {
  const steps = variant === 'walkthrough' ? ALL_STEPS.filter((s) => !s.crvOnly) : ALL_STEPS;
  const bg = surface === 'panel' ? PANEL : BG_WARM;

  return (
    <section
      className="px-5 md:px-8 py-20 md:py-24"
      style={{ background: bg, borderTop: `1px solid ${BORDER}` }}
      data-testid={`walkthrough-day-section-${variant}`}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="uppercase font-bold tracking-[0.28em] mb-5"
          style={{ color: GOLD, ...mono, fontSize: '11px' }}
          data-testid="walkthrough-day-eyebrow"
        >
          What happens on the day of your walkthrough
        </p>
        <h2
          className="font-bold leading-tight mb-10 md:mb-12 text-[26px] md:text-[34px] max-w-3xl"
          style={{ ...sans, color: NAVY }}
        >
          Six steps. No mystery. {variant === 'crv' && (
            <span style={{ color: TEXT_SUBTLE }} className="font-normal">Five for a walkthrough-only engagement.</span>
          )}
        </h2>

        <ol className="space-y-5 md:space-y-6">
          {steps.map((step, idx) => (
            <li
              key={step.id}
              className="flex items-start gap-5 md:gap-7"
              data-testid={`walkthrough-day-step-${step.id}`}
            >
              <span
                className="flex-shrink-0 flex items-center justify-center font-bold rounded-full"
                style={{
                  background: NAVY,
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  ...mono,
                  fontSize: '14px',
                }}
                aria-hidden
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 pt-1">
                <div className="flex items-baseline flex-wrap gap-2 mb-1.5">
                  <h3
                    className="font-bold text-[17px] md:text-[18.5px] leading-tight"
                    style={{ ...sans, color: NAVY }}
                  >
                    {step.title}
                  </h3>
                  {step.crvOnly && variant === 'crv' && (
                    <span
                      className="uppercase font-bold tracking-[0.18em] px-2 py-0.5 rounded-sm"
                      style={{
                        ...mono,
                        fontSize: '10px',
                        color: NAVY,
                        background: GOLD,
                      }}
                      data-testid="walkthrough-day-crv-badge"
                    >
                      CRV only
                    </span>
                  )}
                </div>
                <p
                  className="text-[15.5px] md:text-base leading-[1.7]"
                  style={{ color: TEXT_MUTED, ...serif }}
                >
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default WalkthroughDaySection;
