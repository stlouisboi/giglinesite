/**
 * ObjectionSupport, Phase 2 Batch 2B, Checkpoint 2 (Feb 2026).
 *
 * Twelve short, honest answers to the customer objections named in the
 * batch mandate. Placed near buying decisions (Services overview, Kit
 * catalog, and the /recommendation router page).
 *
 * Copy rules preserved:
 *   - No fake urgency, countdowns, or invented scarcity
 *   - No fear-heavy penalty repetition
 *   - No "guarantee" language, no "approval" language
 *   - No implied OSHA affiliation
 *   - No em/en dashes; commas and periods only
 *
 * Data-testids are stable for Batch 2C Playwright regression.
 */
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK = '#0A1628';
const INK_SOFT = 'rgba(10,22,40,0.72)';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

export const OBJECTIONS = [
  {
    id: 'where-to-start',
    q: 'I do not know where to start.',
    a: 'Answer the five short questions on the recommendation page. GigLine returns one primary next step, one alternative, and clear inclusions and exclusions. No contact information is required to see the result.',
  },
  {
    id: 'already-have-programs',
    q: 'I already have policies and forms.',
    a: 'A Documentation Readiness Review reads what you have, against the standards that apply, and lists what is missing, expired, or out of alignment. If your programs match your operation on paper and on the floor, you should hear that too.',
  },
  {
    id: 'internal-team',
    q: 'Can my internal team handle this?',
    a: 'Yes, in many cases. GigLine hands off the report, the corrective-action log, and the priority order so an internal owner can drive closure. When the operation lacks capacity or an outside perspective is preferred, GigLine can implement.',
  },
  {
    id: 'leadership-approval',
    q: 'I need leadership approval.',
    a: 'Ask for the recommendation preview and a fixed-quote email. GigLine sends the scope, price, and turnaround in writing so you can circulate it internally before scheduling.',
  },
  {
    id: 'no-time',
    q: 'I do not have time to implement another program.',
    a: 'The Safety Walkthrough takes a few hours on-site and a written report lands within 48 hours. The kits ship as usable checklists and forms, not a new platform. Ongoing Safety Support absorbs the recurring work when your foundation qualifies.',
  },
  {
    id: 'digital-enough',
    q: 'Is a digital kit enough?',
    a: 'A Digital Compliance Kit at $150 is enough when you have someone who can print, organize, and complete the forms. If you want the paperwork controlled and trackable, the $300 Compliance Control System adds the control-and-tracking tools.',
  },
  {
    id: 'why-300',
    q: 'What is different about the $300 system?',
    a: 'The $300 Compliance Control System is the $150 Digital kit plus the control-and-tracking tools that make the paperwork auditable, completion signals, evidence organization, and a control index sized to the operation.',
  },
  {
    id: 'when-600',
    q: 'When would I need the $600 binder?',
    a: 'The $600 Inspector-Ready Binder Edition is the $300 Compliance Control System organized in a shipped, tab-labeled physical binder. Pick it when the safety records need to sit on a desk, on a wall, or in a field truck, not on a laptop.',
  },
  {
    id: 'guarantee',
    q: 'Will this guarantee compliance?',
    a: 'No. GigLine does not guarantee an inspection outcome and does not act on behalf of OSHA. GigLine documents what a walkthrough and a documentation review find, prioritizes what to close, and helps close it. Actual compliance is a function of what the operation does with that record.',
  },
  {
    id: 'after-buy',
    q: 'What happens after I buy?',
    a: 'Kits and the Starter Pack deliver immediately by download; the Binder Edition ships within a few business days. Services begin with a fixed-quote email, an agreed on-site date, and a written report within 48 hours of the visit.',
  },
  {
    id: 'osha-affiliation',
    q: 'Is GigLine connected to OSHA?',
    a: 'No. GigLine is a private North Carolina safety-and-compliance practice. GigLine does not represent, speak for, or receive information from OSHA. GigLine reads the same public standards you can read.',
  },
  {
    id: 'privacy',
    q: 'Will my facility information remain private?',
    a: 'Yes. Reports, findings, photos, and program documents remain confidential. GigLine does not publish client information without written permission. Any case study on the site is used only when the client has agreed in writing.',
  },
];

const ObjectionSupport = ({ heading = 'Common questions before you decide', anchor = 'objections' }) => {
  const [open, setOpen] = useState(null);
  return (
    <section
      className="w-full"
      id={anchor}
      data-testid="objection-support-section"
    >
      <p
        className="uppercase font-bold tracking-[0.28em] mb-3"
        style={{ color: GOLD, ...mono, fontSize: '11px' }}
        data-testid="objection-support-kicker"
      >
        Decision support
      </p>
      <h2
        className="font-bold leading-tight mb-8 text-[26px] md:text-[32px]"
        style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
        data-testid="objection-support-heading"
      >
        {heading}
      </h2>
      <div className="space-y-3">
        {OBJECTIONS.map((item, i) => {
          const isOpen = open === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden"
              style={{
                backgroundColor: 'white',
                border: `1px solid ${isOpen ? GOLD : HAIRLINE}`,
              }}
              data-testid={`objection-item-${item.id}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-start justify-between gap-4 text-left px-5 md:px-6 py-4 md:py-5"
                style={{ color: NAVY }}
                data-testid={`objection-trigger-${item.id}`}
              >
                <span className="text-[15.5px] md:text-[17px] font-bold leading-snug pr-2">
                  {item.q}
                </span>
                <span
                  className="flex-shrink-0 mt-1"
                  style={{ color: GOLD }}
                  aria-hidden="true"
                >
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              {isOpen && (
                <div
                  className="px-5 md:px-6 pb-5 pt-1"
                  data-testid={`objection-answer-${item.id}`}
                >
                  <p
                    className="text-[14.5px] md:text-[15.5px] leading-[1.7]"
                    style={{ color: INK_SOFT, ...serif }}
                  >
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ObjectionSupport;
