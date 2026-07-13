import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Phone, Mail, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { getAttribution, trackEvent } from '../utils/analytics';

const API = process.env.REACT_APP_BACKEND_URL;

/* ── Brand tokens ── */
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

/* ─────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────── */

/* Hero — supporting lines below the subhead */
const HERO_SUPPORTING = [
  'No more guessing where the SDS records are.',
  'No more inspection notes with no follow-up.',
  'No more hazards getting talked about but never assigned.',
  'No more binder that exists but does not get used.',
];

/* Boundaries — what the system does not do */
const NOT_DESIGNED_TO = [
  'Guarantee OSHA compliance',
  'Replace site-specific hazard assessments',
  'Replace required employee training',
  'Replace qualified legal, engineering, medical, or safety advice',
  'Correct hazards automatically',
  'Serve as a substitute for management accountability',
];

/* FAQ — 8 questions the user brief specified */
const FAQ = [
  {
    q: 'Is this an employee safety training course?',
    a: 'No. The Supervisor Safety OS is an operational documentation and control system. It helps supervisors organize inspections, findings, corrective actions, reporting, and recurring safety reviews. Site-specific training may still be required based on your operations and applicable regulations.',
  },
  {
    q: 'How quickly can we start using it?',
    a: 'You can begin reviewing and implementing the digital system immediately after purchase. Start with the quick-start instructions, identify who will own the process, and establish your first inspection and corrective-action cycle.',
  },
  {
    q: 'Is this only for manufacturing facilities?',
    a: 'No. The system can support small manufacturing operations, warehouses, contractors, service businesses, and fleet operations. The organization must adapt the tools to its actual workplace hazards and responsibilities.',
  },
  {
    q: 'Does this guarantee that we will pass an OSHA inspection?',
    a: 'No responsible safety professional can guarantee the outcome of an OSHA inspection. The system is designed to help your organization improve visibility, documentation, corrective-action tracking, and supervisor accountability.',
  },
  {
    q: 'Can we customize the documents?',
    a: 'Customization rights depend on the license included with the purchased edition. Your organization may also need to add site-specific information, responsible personnel, emergency details, and facility procedures.',
  },
  {
    q: 'Can GigLine help us implement the system?',
    a: 'Implementation support may be purchased separately after checkout. This keeps the main purchase process simple while giving organizations the option to receive additional guidance.',
  },
  {
    q: 'Is this for one facility or multiple locations?',
    a: 'The standard license covers a single facility and its supervisors. Multi-site organizations may require an expanded license — contact GigLine for a scoped quote.',
  },
  {
    q: 'Is this a replacement for a safety manager?',
    a: 'No. The system helps supervisors operate more consistently, but it does not replace competent safety leadership or professional support when those resources are necessary.',
  },
];

/* Hero stats bar (4 tiles) */
const HERO_STATS = [
  { value: '17', label: 'Documents' },
  { value: '20-Page', label: 'System' },
  { value: '16', label: 'Inspection Items' },
  { value: 'OSHA-Aligned', label: 'Field Tools' },
];

/* Before / After grid */
const BEFORE_LIST = [
  'Safety records scattered across binders, folders, and memory',
  'Chemical inventory unclear',
  'SDS records hard to verify',
  'Inspections happen inconsistently',
  'Hazards get noticed but not tracked',
  'Training is discussed but not always documented',
  'Emergency contacts are unclear',
  'Nobody knows what to do first',
];

const AFTER_LIST = [
  'You know what was inspected.',
  'You know what still needs correction.',
  'You know who owns the next step.',
  'You know where the record lives.',
];

/* Rhythm — 5-step operating loop (Inspect → Assign → Verify → Document → Review) */
const RHYTHM_STEPS = ['Inspect', 'Assign', 'Verify', 'Document', 'Review'];

/* Rhythm — detailed step descriptions for the solution section */
const RHYTHM_DETAILED = [
  { name: 'Inspect', body: 'Use structured walkthroughs and checklists to identify hazards and documentation gaps.' },
  { name: 'Assign',  body: 'Record the issue, corrective action, responsible person, and expected completion date.' },
  { name: 'Verify',  body: 'Confirm that the correction was completed — not merely discussed.' },
  { name: 'Document',body: 'Maintain visible records showing what was found, what changed, and who verified closure.' },
  { name: 'Review',  body: 'Use a recurring supervisor review process to keep unresolved items from disappearing.' },
];

/* What Is Included — 10 outcome categories (sell the operational function, not the doc code) */
const CONTENTS_CATEGORIES = [
  { name: 'Quick-Start Implementation Guidance',    body: 'Clear instructions showing supervisors how to begin using the system and establish the first operating cycle.' },
  { name: 'Supervisor Inspection Tools',            body: 'Practical inspection sheets for identifying workplace hazards, unsafe conditions, and documentation gaps.' },
  { name: 'Corrective Action Control',              body: 'A defined process for assigning findings, tracking responsibility, setting completion dates, and verifying closure.' },
  { name: 'Hazard and Incident Reporting',          body: 'Tools for documenting hazards, near misses, incidents, and unsafe conditions before they are forgotten or repeated.' },
  { name: 'Stop Work Authority',                    body: 'A clear framework supporting an employee\u2019s or supervisor\u2019s authority to pause work when an uncontrolled hazard presents an immediate risk.' },
  { name: 'Chemical and SDS Control',               body: 'Structured logs and reference tools for tracking workplace chemicals and maintaining safety data sheet visibility.' },
  { name: 'Powered Industrial Truck Checks',        body: 'Documented inspection tools for forklifts and other powered industrial trucks.' },
  { name: 'Toolbox Talk and Knowledge Check',       body: 'A repeatable method for conducting short safety discussions and documenting employee understanding.' },
  { name: 'Emergency Information',                  body: 'A centralized quick-reference sheet for emergency contacts, response information, and critical facility details.' },
  { name: 'Training and Annual Review Tracking',    body: 'Tools for documenting required training, recurring reviews, and supervisor follow-through.' },
];

/* What's Included — 17 documents (code | title | help) — kept for the deep-detail table below the categories */
const KIT_CONTENTS = [
  { code: 'SS-01',  title: 'Start Here / How to Use This System',          help: 'Gives supervisors a clear starting point and shows how the system works.' },
  { code: 'SS-02',  title: '30-Day Action Checklist',                      help: 'Turns setup into a week-by-week plan instead of a someday project.' },
  { code: 'SS-03A', title: 'Chemical Inventory Log — Example',             help: 'Shows what a completed chemical inventory record should look like.' },
  { code: 'SS-03B', title: 'Chemical Inventory Log — Blank',               help: 'Helps list hazardous chemicals used or stored in the facility.' },
  { code: 'SS-04A', title: 'SDS Index — Example',                          help: 'Shows how SDS tracking should be organized.' },
  { code: 'SS-04B', title: 'SDS Index — Blank',                            help: 'Helps verify where Safety Data Sheets are located and accessible.' },
  { code: 'SS-05',  title: 'Written Hazard Communication Program',         help: 'Provides a practical written HazCom program structure for review and sign-off.' },
  { code: 'SS-06A', title: 'Monthly Safety Inspection Checklist — Example',help: 'Shows how to document a completed safety walkthrough.' },
  { code: 'SS-06B', title: 'Monthly Safety Inspection Checklist — Blank',  help: 'Gives supervisors a monthly inspection checklist they can use on the floor.' },
  { code: 'SS-07A', title: 'Corrective Action Log — Example',              help: 'Shows how findings should be assigned, tracked, verified, and closed.' },
  { code: 'SS-07B', title: 'Corrective Action Log — Blank',                help: 'Helps turn open issues into assigned corrective actions with due dates and verification.' },
  { code: 'SS-08',  title: 'OSHA Coverage Map',                            help: 'Shows how the documents support common OSHA-aligned documentation areas.' },
  { code: 'SS-09A', title: 'Employee HazCom Toolbox Talk + Attendance',    help: 'Helps document employee HazCom communication and attendance.' },
  { code: 'SS-09B', title: 'Employee HazCom Knowledge Check',              help: 'Helps confirm employees understood the HazCom talk.' },
  { code: 'SS-10',  title: 'Emergency Response / One Phone Call Card',     help: 'Gives supervisors and employees quick emergency contact and response information.' },
  { code: 'SS-11',  title: '90-Day Implementation Roadmap',                help: 'Turns the system into a 90-day rollout with checkpoints.' },
  { code: 'SS-12',  title: 'Next Step / Book a GigLine Review',            help: 'Shows how to get a second set of eyes after the system is in place.' },
];

/* Value Framing — 4 cards */
const VALUE_CARDS = [
  { label: 'Clarity', body: 'Know what needs to be checked, tracked, and filed.' },
  { label: 'Control', body: 'See what is open, who owns it, and what still needs follow-up.' },
  { label: 'Proof',   body: 'Create records that show what was inspected, trained, corrected, and reviewed.' },
  { label: 'Rhythm',  body: 'Use the 30-day checklist and 90-day roadmap to build consistency instead of waiting for a crisis.' },
];

/* Pricing card content (3 tiers) */
const DIGITAL_BULLETS = [
  'Complete 17-document / 20-page Supervisor Safety OS',
  'Plus 17 individual per-doc PDFs for easy single-page reprints',
  'Example and blank working forms',
  '30-Day Action Checklist',
  '90-Day Implementation Roadmap',
  'HazCom documentation tools',
  'Chemical Inventory and SDS tracking tools',
  'Monthly Safety Inspection Checklist',
  'Corrective Action Log',
  'Emergency Response / One Phone Call Card',
  'OSHA Coverage Map',
];

const PHYSICAL_BULLETS = [
  'Complete Supervisor Safety OS printed and organized',
  'Ready-to-use supervisor copy',
  'Free USPS Priority shipping',
  'Shipping address collected at checkout',
];

const REVIEW_BULLETS = [
  'Review of completed Supervisor Safety OS records',
  'Written feedback on missing or incomplete records',
  'Corrective action follow-up observations',
  'Practical next-step recommendations',
];

/* Who This Is For — 3 cards */
const AUDIENCE_CARDS = [
  {
    label: 'Plant Managers & Operations Leaders',
    body: 'You are responsible for what happens on the floor. This gives your supervisors a system to document what is being checked, corrected, and reviewed.',
  },
  {
    label: 'HR & Safety Administrators',
    body: 'Training records, HazCom documentation, inspection logs, SDS tracking, and corrective actions need a clean home. This gives you one.',
  },
  {
    label: 'New or Growing Operations',
    body: 'If you are adding employees, equipment, chemicals, or customer requirements, this gives you a safety documentation foundation before the pressure hits.',
  },
];

/* Mailto for GigLine Implementation Review CTA (no Stripe SKU — needs scoping) */
const REVIEW_MAILTO = (
  'mailto:vince@giglinecompliance.com'
  + '?subject=' + encodeURIComponent('GigLine Implementation Review Request')
  + '&body=' + encodeURIComponent(
      "Hi Vince,\n\n"
      + "I'd like to schedule a GigLine Implementation Review.\n\n"
      + "- Company:\n"
      + "- Number of employees:\n"
      + "- How long we've had the Supervisor Safety OS in place:\n"
      + "- What we'd like reviewed:\n\n"
      + "Thanks."
    )
);

/* ─────────────────────────────────────────────────────────────
   PRIMITIVES
   ───────────────────────────────────────────────────────────── */

const SectionLabel = ({ children }) => (
  <p
    className="uppercase font-bold tracking-[0.28em] mb-5"
    style={{ color: GOLD, ...mono, fontSize: '11px' }}
  >
    {children}
  </p>
);

const H2 = ({ children, center = false, id }) => (
  <h2
    id={id}
    className={`font-bold leading-tight mb-6 text-[26px] md:text-[32px] ${center ? 'text-center' : ''}`}
    style={{ ...sans, color: NAVY }}
  >
    {children}
  </h2>
);

/* Pricing card — supports button (Stripe) or anchor (mailto) CTA */
const PricingCard = ({
  label, price, subline, body, bullets, bestFor,
  ctaLabel, ctaTestId, onBuy, href, loading, featured,
}) => (
  <div
    className="rounded-lg p-7 md:p-8 flex flex-col h-full relative"
    style={{
      background: featured ? NAVY : 'white',
      border: `1px solid ${featured ? GOLD : BORDER}`,
      boxShadow: featured ? '0 18px 40px rgba(10,22,40,0.18)' : '0 6px 16px rgba(10,22,40,0.06)',
      color: featured ? 'white' : NAVY,
    }}
    data-testid={`kit-card-${ctaTestId.replace(/^kit-buy-/, '')}`}
  >
    {featured && (
      <span
        className="absolute -top-3 right-6 uppercase font-bold tracking-[0.18em] px-3 py-1 rounded-sm"
        style={{ background: GOLD, color: NAVY, ...mono, fontSize: '10.5px', boxShadow: '0 4px 10px rgba(0,0,0,0.12)' }}
      >
        Recommended
      </span>
    )}
    <p className="uppercase font-bold tracking-[0.22em] mb-3" style={{ color: GOLD, ...mono, fontSize: '11px' }}>
      {label}
    </p>
    <p className="font-extrabold leading-none mb-2" style={{ ...mono, fontSize: '40px', color: featured ? 'white' : NAVY }}>
      {price}
    </p>
    <p className="text-sm mb-4 leading-relaxed italic" style={{ color: featured ? 'rgba(255,255,255,0.70)' : TEXT_SUBTLE }}>
      {subline}
    </p>
    {body && (
      <p className="text-[14.5px] mb-5 leading-[1.65]" style={{ color: featured ? 'rgba(255,255,255,0.85)' : TEXT_MUTED, ...serif }}>
        {body}
      </p>
    )}
    <ul className="space-y-2.5 mb-6 flex-1">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[14px] leading-[1.55]">
          <span
            className="flex-shrink-0 font-bold leading-none"
            style={{ color: GOLD, ...mono, fontSize: '17px', lineHeight: '1.2' }}
            aria-hidden
          >&mdash;</span>
          <span style={{ color: featured ? 'rgba(255,255,255,0.88)' : TEXT_MUTED }}>{b}</span>
        </li>
      ))}
    </ul>
    {bestFor && (
      <p
        className="text-[12.5px] italic mb-5 pb-5 leading-relaxed border-b"
        style={{
          color: featured ? 'rgba(255,255,255,0.62)' : TEXT_SUBTLE,
          borderColor: featured ? 'rgba(255,255,255,0.15)' : BORDER,
        }}
      >
        <strong style={{ color: featured ? 'rgba(255,255,255,0.85)' : NAVY, fontStyle: 'normal' }}>Best for:</strong> {bestFor}
      </p>
    )}
    {href ? (
      <a
        href={href}
        className="inline-flex items-center justify-center gap-2 font-bold py-4 px-6 transition-all text-base hover:brightness-110"
        style={{ background: featured ? GOLD : NAVY, color: featured ? NAVY : 'white', ...sans }}
        data-testid={ctaTestId}
      >
        {ctaLabel}
        <ArrowRight size={18} />
      </a>
    ) : (
      <button
        type="button"
        onClick={onBuy}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 font-bold py-4 px-6 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
        style={{ background: featured ? GOLD : NAVY, color: featured ? NAVY : 'white', ...sans }}
        data-testid={ctaTestId}
      >
        {loading ? 'Processing...' : ctaLabel}
        <ArrowRight size={18} />
      </button>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────────────────────── */

const SupervisorKitPage = () => {
  const [loading, setLoading] = useState({ digital: false, physical: false });
  const [status, setStatus] = useState(null);

  const buy = async (variant) => {
    setLoading((p) => ({ ...p, [variant]: true }));
    setStatus(null);
    try {
      const res = await fetch(`${API}/api/checkout/supervisor-kit-${variant}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_url: window.location.origin,
          attribution: getAttribution(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        trackEvent('supervisor_kit_buy_click', { variant, session_id: data.session_id });
        window.location.href = data.url;
        return;
      }
      setStatus({ ok: false, message: 'Could not start checkout. Please call (336) 329-8899.' });
    } catch {
      setStatus({ ok: false, message: 'Network error. Please call (336) 329-8899.' });
    }
    setLoading((p) => ({ ...p, [variant]: false }));
  };

  return (
    <main data-testid="supervisor-kit-page" style={{ backgroundColor: BG_WARM, color: NAVY }}>
      <SEO
        title="GigLine Supervisor Safety OS | Supervisor Safety Documentation System"
        description="Turn scattered safety paperwork into a visible supervisor-run system. The GigLine Supervisor Safety OS helps small manufacturing teams inspect, document, assign, verify, and review safety follow-up."
        canonical="/supervisor-kit"
      />

      {/* ═════════ HERO ═════════ */}
      <section className="px-5 md:px-8 pt-20 md:pt-28 pb-14 md:pb-16" data-testid="kit-hero">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel>GigLine Supervisor Safety OS</SectionLabel>
          <h1
            className="font-bold leading-[1.08] tracking-tight mb-6 text-[32px] md:text-[44px] lg:text-[52px]"
            style={{ ...sans, color: NAVY }}
            data-testid="kit-hero-headline"
          >
            Install a Repeatable Supervisor Safety System &mdash; Without Building It From Scratch.
          </h1>
          <p
            className="text-[17px] md:text-[19px] leading-[1.65] max-w-3xl mx-auto mb-6"
            style={{ color: TEXT_MUTED, ...serif }}
            data-testid="kit-hero-subhead"
          >
            Give supervisors a practical system to identify hazards, assign corrective actions, document follow-through, and keep safety work visible.
          </p>
          <p
            className="text-[15px] md:text-[16px] leading-[1.7] max-w-3xl mx-auto mb-10 italic"
            style={{ color: TEXT_SUBTLE, ...serif }}
            data-testid="kit-hero-audience"
          >
            Built for small manufacturers, warehouses, contractors, and fleet operations that need stronger safety control &mdash; but do not have a full-time safety manager.
          </p>

          {/* Single primary CTA — anchors to pricing/edition selection */}
          <div className="flex flex-col items-center gap-3 mb-14 md:mb-16">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 transition-all text-base hover:brightness-110"
              style={{ background: NAVY, color: 'white', ...sans }}
              data-testid="kit-hero-cta"
            >
              Get the Supervisor Safety OS
              <ArrowRight size={18} />
            </a>
            <p
              className="text-[13px] leading-tight text-center italic"
              style={{ color: TEXT_SUBTLE, ...serif }}
              data-testid="kit-hero-cta-micro"
            >
              Start using the system immediately after purchase.
            </p>
          </div>

          {/* Supporting "no more..." lines — moved below CTA */}
          <ul className="max-w-2xl mx-auto mb-14 space-y-1.5" data-testid="kit-hero-supporting">
            {HERO_SUPPORTING.map((line, i) => (
              <li
                key={i}
                className="text-[15px] md:text-[16px] leading-relaxed italic"
                style={{ color: TEXT_SUBTLE, ...serif }}
              >
                {line}
              </li>
            ))}
          </ul>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto" data-testid="kit-hero-stats">
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center py-5 px-3 rounded-md"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-hero-stat-${i + 1}`}
              >
                <p
                  className="font-extrabold leading-none tracking-tight mb-2"
                  style={{ color: GOLD, ...mono, fontSize: 'clamp(18px, 2vw, 26px)' }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[11.5px] md:text-[12px] uppercase font-bold tracking-[0.08em] leading-tight"
                  style={{ color: TEXT_MUTED, ...sans }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto" style={{ height: '1px', background: BORDER }} />

      {/* ═════════ PROBLEM ═════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kit-problem">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>The Problem</SectionLabel>
          <H2>They don&rsquo;t just have a paperwork problem. They have a visibility problem.</H2>
          <div className="space-y-4 text-[16px] md:text-[17px] leading-[1.75]" style={{ color: TEXT_MUTED, ...serif }}>
            <p>Safety work often happens. The proof does not.</p>
            <p>In small manufacturing operations, safety responsibilities often live in scattered binders, old folders, supervisor memory, inboxes, and good intentions.</p>
            <p>A hazard may get noticed but never assigned.</p>
            <p>A chemical may be used without a clean inventory record.</p>
            <p>An SDS may exist somewhere, but nobody knows where.</p>
            <p>An inspection may happen, but failed items never move into corrective action.</p>
            <p>A supervisor may care about safety but lack a simple system to run every month.</p>
            <p style={{ color: NAVY }} className="pt-4 font-semibold not-italic text-[17px] md:text-[18px] leading-[1.6]">
              Most safety gaps do not start as major failures. They start as things someone noticed, mentioned, meant to fix, and never documented all the way through.
            </p>
            <p style={{ color: TEXT_MUTED }} className="not-italic">
              The Supervisor Safety OS turns those loose ends into a visible system: inspect, document, assign, verify, and review.
            </p>
            <p style={{ color: NAVY }} className="pt-2 font-bold not-italic">That is the gap the Supervisor Safety OS is built to close.</p>
          </div>
        </div>
      </section>

      {/* ═════════ OUTCOME ═════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" style={{ background: PANEL }} data-testid="kit-outcome">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>The Outcome</SectionLabel>
          <H2>What changes after this system is in place?</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-10">
            {/* Before */}
            <div
              className="rounded-md p-6 md:p-7"
              style={{ background: 'white', border: `1px solid ${BORDER}` }}
              data-testid="kit-outcome-before"
            >
              <p className="uppercase font-bold tracking-[0.2em] mb-4" style={{ color: 'rgba(10,22,40,0.5)', ...mono, fontSize: '11px' }}>
                Before the OS
              </p>
              <ul className="space-y-2.5">
                {BEFORE_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-[1.6]" style={{ color: TEXT_MUTED }}>
                    <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(10,22,40,0.35)' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* After */}
            <div
              className="rounded-md p-6 md:p-7"
              style={{ background: NAVY, border: `1px solid ${GOLD}`, color: 'white' }}
              data-testid="kit-outcome-after"
            >
              <p className="uppercase font-bold tracking-[0.2em] mb-4" style={{ color: GOLD, ...mono, fontSize: '11px' }}>
                After the OS
              </p>
              <ul className="space-y-2.5">
                {AFTER_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14.5px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    <Check size={14} strokeWidth={2.5} style={{ color: GOLD, flexShrink: 0, marginTop: 3 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p
            className="text-[15.5px] md:text-[17px] italic leading-[1.7] mt-10 max-w-3xl"
            style={{ color: TEXT_MUTED, ...serif }}
          >
            That is the shift: safety stops living in memory and starts living in a visible system.
          </p>
          <div
            className="mt-8 max-w-3xl border-l-4 pl-5 md:pl-6 py-3"
            style={{ borderColor: GOLD }}
            data-testid="kit-outcome-callout"
          >
            <p
              className="font-bold leading-[1.4] text-[18px] md:text-[22px]"
              style={{ ...sans, color: NAVY }}
            >
              Safety documentation is not about having forms &mdash; it is about proving the work is being followed through.
            </p>
          </div>
        </div>
      </section>

      {/* ═════════ RHYTHM ═════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kit-rhythm">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>The Operating Rhythm</SectionLabel>
          <H2>Turn Loose Safety Tasks Into a Visible Operating System.</H2>
          <p className="text-[16px] md:text-[17px] leading-[1.75] mb-8" style={{ color: TEXT_MUTED, ...serif }}>
            The GigLine Supervisor Safety OS gives your team a repeatable process for managing everyday safety responsibilities. Instead of relying on memory or disconnected forms, supervisors follow a defined operating rhythm:
          </p>
          {/* Visual step chain */}
          <div className="flex flex-wrap gap-2 md:gap-3 items-center mb-10" data-testid="kit-rhythm-steps">
            {RHYTHM_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <span
                  className="inline-flex items-center px-4 py-2.5 font-bold text-[13px] md:text-[14px] rounded"
                  style={{ background: NAVY, color: 'white', letterSpacing: '0.04em', ...sans }}
                >
                  {step}
                </span>
                {i < RHYTHM_STEPS.length - 1 && (
                  <span style={{ color: GOLD, fontWeight: 700 }}>&rarr;</span>
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Rhythm detailed grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-10" data-testid="kit-rhythm-detailed">
            {RHYTHM_DETAILED.map((s, i) => (
              <div
                key={s.name}
                className="rounded-md p-5"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-rhythm-step-${i + 1}`}
              >
                <p className="uppercase font-bold tracking-[0.18em] mb-2" style={{ color: GOLD, ...mono, fontSize: '10.5px' }}>
                  Step {String(i + 1).padStart(2, '0')}
                </p>
                <p className="font-bold text-[19px] md:text-[21px] mb-2 leading-tight" style={{ ...sans, color: NAVY }}>
                  {s.name}
                </p>
                <p className="text-[14.5px] leading-[1.65]" style={{ color: TEXT_MUTED, ...serif }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[16px] md:text-[17px] leading-[1.75]" style={{ color: NAVY, ...serif }}>
            <strong style={{ ...sans }}>This is not another binder that sits on a shelf.</strong> It is a working control system designed to help supervisors manage safety consistently.
          </p>
        </div>
      </section>

      {/* ═════════ WHAT'S INCLUDED ═════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" style={{ background: 'white' }} data-testid="kit-contents">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>What Is Included</SectionLabel>
          <H2>A structured set of tools for running, documenting, and reviewing frontline safety activity.</H2>
          <p className="text-[16px] md:text-[17px] leading-[1.75] max-w-3xl mb-10" style={{ color: TEXT_MUTED, ...serif }}>
            The Supervisor Safety OS is not a stack of random forms. Each tool has a defined operational job.
          </p>

          {/* Outcome-first category grid (10 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-14" data-testid="kit-contents-categories">
            {CONTENTS_CATEGORIES.map((c, i) => (
              <div
                key={c.name}
                className="rounded-md p-5 md:p-6"
                style={{ background: BG_WARM, border: `1px solid ${BORDER}` }}
                data-testid={`kit-contents-category-${i + 1}`}
              >
                <p className="font-bold text-[16.5px] md:text-[17.5px] mb-2 leading-snug" style={{ ...sans, color: NAVY }}>
                  {c.name}
                </p>
                <p className="text-[14.5px] leading-[1.6]" style={{ color: TEXT_MUTED, ...serif }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>

          {/* CTA after Contents — CTA #2 per user's brief */}
          <div className="text-center mb-14" data-testid="kit-contents-cta-wrap">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 transition-all text-base hover:brightness-110"
              style={{ background: NAVY, color: 'white', ...sans }}
              data-testid="kit-contents-cta"
            >
              Get the Supervisor Safety OS
              <ArrowRight size={18} />
            </a>
            <p className="mt-3 text-[13px] italic" style={{ color: TEXT_SUBTLE, ...serif }}>
              Digital access. Practical tools. No system-building required.
            </p>
          </div>

          {/* Full document detail table — kept as reference below the outcome cards */}
          <details className="mt-4 group" data-testid="kit-contents-detail">
            <summary
              className="cursor-pointer font-bold text-[15px] mb-4"
              style={{ color: NAVY, ...sans }}
            >
              See the full 17-document reference &rarr;
            </summary>
            <div className="mt-6 rounded-md p-4 md:p-5 mb-8" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
              <p className="text-[13.5px] md:text-[14.5px] leading-[1.65]" style={{ color: NAVY, ...serif }}>
                Built around common OSHA-aligned documentation areas including HazCom, SDS access, monthly inspections, corrective actions, employee communication, emergency response, and supervisor follow-up.
              </p>
            </div>

          {/* Document table */}
          <div className="overflow-x-auto" data-testid="kit-contents-table-wrap">
            <table className="w-full text-left border-collapse" data-testid="kit-contents-table">
              <thead>
                <tr style={{ borderBottom: `2px solid ${NAVY}` }}>
                  <th
                    className="py-3 pr-4 uppercase font-bold tracking-[0.14em] text-[11px] md:text-[12px]"
                    style={{ color: NAVY, ...mono, whiteSpace: 'nowrap' }}
                  >Code</th>
                  <th
                    className="py-3 px-4 uppercase font-bold tracking-[0.14em] text-[11px] md:text-[12px]"
                    style={{ color: NAVY, ...mono }}
                  >Document</th>
                  <th
                    className="py-3 pl-4 uppercase font-bold tracking-[0.14em] text-[11px] md:text-[12px]"
                    style={{ color: NAVY, ...mono }}
                  >What It Helps You Do</th>
                </tr>
              </thead>
              <tbody>
                {KIT_CONTENTS.map((row, i) => (
                  <tr
                    key={row.code}
                    style={{ borderBottom: `1px solid ${BORDER}` }}
                    data-testid={`kit-doc-${row.code.toLowerCase()}`}
                  >
                    <td className="py-3 pr-4 align-top" style={{ whiteSpace: 'nowrap' }}>
                      <span
                        className="inline-flex items-center justify-center font-bold rounded-md"
                        style={{
                          background: NAVY,
                          color: GOLD,
                          ...mono,
                          fontSize: '11px',
                          padding: '3px 9px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {row.code}
                      </span>
                    </td>
                    <td
                      className="py-3 px-4 align-top font-bold text-[14.5px] md:text-[15.5px] leading-snug"
                      style={{ ...sans, color: NAVY }}
                    >
                      {row.title}
                    </td>
                    <td
                      className="py-3 pl-4 align-top text-[14px] md:text-[15px] leading-[1.6]"
                      style={{ color: TEXT_MUTED, ...serif }}
                    >
                      {row.help}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </details>
        </div>
      </section>

      {/* ═════════ VALUE FRAMING ═════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kit-value">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Why It Matters</SectionLabel>
          <H2>You are not buying forms. You are buying clarity, control, proof, and rhythm.</H2>
          <p className="text-[16px] md:text-[17px] leading-[1.75] max-w-3xl mb-10" style={{ color: TEXT_MUTED, ...serif }}>
            The Supervisor Safety OS helps your team stop relying on memory, scattered files, and verbal follow-up. It gives supervisors a place to record what was checked, what was missing, who owns the next step, and what still needs to be verified.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-14">
            {VALUE_CARDS.map((c) => (
              <div
                key={c.label}
                className="rounded-md p-6"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-value-${c.label.toLowerCase()}`}
              >
                <p
                  className="font-bold text-[19px] md:text-[21px] mb-2 leading-tight"
                  style={{ ...sans, color: NAVY }}
                >
                  {c.label}
                </p>
                <p className="text-[14.5px] md:text-[15px] leading-[1.6]" style={{ color: TEXT_MUTED, ...serif }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
          <blockquote className="border-l-4 pl-6 md:pl-7 max-w-3xl" style={{ borderColor: GOLD }}>
            <p className="text-[17px] md:text-[19px] leading-[1.7] mb-4 italic" style={{ color: NAVY, ...serif }}>
              &ldquo;Most small operations do not fail because nobody cares. They fail because safety work is scattered, undocumented, or never verified. The Supervisor Safety OS gives your team a practical rhythm to inspect, document, assign, verify, and review.&rdquo;
            </p>
            <footer className="text-[14px] md:text-[15px] font-bold" style={{ color: TEXT_MUTED, ...sans }}>
              &mdash; Vince Lawrence, GigLine Safety &amp; Compliance
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ═════════ PRICING (3 tiers) ═════════ */}
      <section id="pricing" className="px-5 md:px-8 py-20 md:py-24" style={{ background: PANEL }} data-testid="kit-pricing">
        <div className="max-w-6xl mx-auto">
          <SectionLabel>Choose Your Edition</SectionLabel>
          <H2>One system. Two editions. Digital-only or physical binder shipped free.</H2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch mt-10">
            <PricingCard
              label="Digital Kit"
              price="$600"
              subline="For teams that want to get organized fast."
              body="Use the Digital Kit to set up your supervisor safety documentation rhythm without starting from a blank page."
              bullets={DIGITAL_BULLETS}
              bestFor="Small teams that need structure now and can implement internally."
              ctaLabel="Buy Digital Kit — $600"
              ctaTestId="kit-buy-digital"
              onBuy={() => buy('digital')}
              loading={loading.digital}
            />
            <PricingCard
              label="Physical Binder Kit"
              price="$700"
              subline="Printed, organized, and ready to put in a supervisor's hands."
              body="For facilities that want a physical binder at the supervisor station, safety office, or production floor."
              bullets={PHYSICAL_BULLETS}
              bestFor="Facilities that want a physical system they can place directly into the hands of a supervisor."
              ctaLabel="Buy Physical Binder Kit — $700"
              ctaTestId="kit-buy-physical"
              onBuy={() => buy('physical')}
              loading={loading.physical}
              featured
            />
            <PricingCard
              label="GigLine Implementation Review — Optional"
              price="From $850"
              subline="For teams that want a second set of eyes after they start using the system."
              body="GigLine reviews your completed records and provides written feedback on missing documentation, open follow-up, and next steps."
              bullets={REVIEW_BULLETS}
              bestFor="Teams that want to know whether the system is being used correctly before an audit, inspection, insurance request, or leadership review."
              ctaLabel="Request GigLine Implementation Review"
              ctaTestId="kit-buy-review"
              href={REVIEW_MAILTO}
            />
          </div>

          {status && (
            <div
              className="mt-8 max-w-3xl mx-auto rounded-md p-4 text-sm leading-relaxed"
              style={{
                background: status.ok ? 'rgba(34,160,108,0.08)' : 'rgba(197,46,46,0.08)',
                border: `1px solid ${status.ok ? 'rgba(34,160,108,0.40)' : 'rgba(197,46,46,0.40)'}`,
                color: status.ok ? '#1F6A4C' : '#7A1C1C',
              }}
              data-testid="kit-checkout-status"
            >
              {status.message}
            </div>
          )}

          <p
            className="text-center text-[14px] md:text-[15px] italic mt-10 max-w-3xl mx-auto"
            style={{ color: TEXT_SUBTLE, ...serif }}
            data-testid="kit-crv-note"
          >
            The Supervisor Safety OS is included at no additional cost with every Compliance Readiness Visit starting at $2,000. Already a CRV client? Contact GigLine at{' '}
            <a href="tel:+13363298899" className="font-bold underline hover:no-underline" style={{ color: NAVY }}>
              (336) 329-8899
            </a>{' '}
            to arrange delivery.
          </p>
        </div>
      </section>

      {/* ═════════ WHO THIS IS FOR ═════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kit-audience">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Who This Is For</SectionLabel>
          <H2>Built for the people carrying safety without a full safety department.</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {AUDIENCE_CARDS.map((card, i) => (
              <div
                key={i}
                className="rounded-md p-6"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-audience-card-${i + 1}`}
              >
                <p className="font-bold text-[16px] md:text-[17px] mb-3 leading-tight" style={{ ...sans, color: NAVY }}>
                  {card.label}
                </p>
                <p className="text-[15px] leading-[1.65]" style={{ color: TEXT_MUTED, ...serif }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ IMPORTANT NOTICE (legal/expectation) ═════════ */}
      <section
        className="px-5 md:px-8 py-16 md:py-20"
        style={{ background: PANEL, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
        data-testid="kit-notice"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle size={20} style={{ color: GOLD, flexShrink: 0, marginTop: 4 }} aria-hidden />
            <SectionLabel>Important Notice</SectionLabel>
          </div>
          <H2>This System Is Not Designed To.</H2>
          <div className="space-y-4 text-[15px] md:text-[16px] leading-[1.75]" style={{ color: TEXT_MUTED, ...serif }}>
            <p>The Supervisor Safety OS is designed to help small manufacturing teams organize basic safety documentation, inspection records, corrective actions, HazCom materials, emergency information, and supervisor-led safety follow-up.</p>
            <p>The Supervisor Safety OS does not:</p>
            <ul className="space-y-2 pl-5" style={{ listStyleType: 'disc' }} data-testid="kit-notice-not-designed-to">
              {NOT_DESIGNED_TO.map((line, i) => (
                <li key={i} style={{ color: TEXT_MUTED }}>{line}</li>
              ))}
            </ul>
            <p><strong style={{ color: NAVY, ...sans }}>The tools provide structure.</strong> Your organization must still implement the process, complete corrective actions, train employees, and verify that workplace controls are effective.</p>
          </div>
          <div className="mt-6">
            <Link
              to="/services/compliance-readiness-visit"
              className="inline-flex items-center gap-2 font-bold text-[14px] md:text-[15px] underline hover:no-underline"
              style={{ color: NAVY }}
              data-testid="kit-notice-crv-link"
            >
              Need a site-specific review? Book a GigLine Compliance Readiness Visit.
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kit-faq">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Frequently Asked Questions</SectionLabel>
          <H2>What buyers ask before they install the system.</H2>
          <div className="space-y-4 mt-8" data-testid="kit-faq-list">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group rounded-md p-5 md:p-6"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-faq-item-${i + 1}`}
              >
                <summary
                  className="cursor-pointer font-bold text-[16px] md:text-[17px] leading-snug list-none flex items-start gap-3"
                  style={{ ...sans, color: NAVY }}
                >
                  <span
                    className="inline-block mt-1 flex-shrink-0"
                    style={{ color: GOLD, ...mono, fontSize: '14px' }}
                  >
                    Q.
                  </span>
                  <span>{item.q}</span>
                </summary>
                <p
                  className="mt-3 pl-7 text-[14.5px] md:text-[16px] leading-[1.75]"
                  style={{ color: TEXT_MUTED, ...serif }}
                >
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ FINAL CTA ═════════ */}
      <section
        className="px-5 md:px-8 py-20 md:py-24"
        style={{ background: NAVY, color: 'white' }}
        data-testid="kit-final-cta"
      >
        <div
          className="max-w-2xl mx-auto text-center"
          style={{ borderTop: `2px solid ${GOLD}`, paddingTop: '36px' }}
        >
          <h2 className="font-bold leading-tight mb-4 text-[28px] md:text-[36px]" style={{ ...sans }}>
            Stop Managing Safety Through Memory.
          </h2>
          <p className="text-[17px] md:text-[19px] text-white/78 mb-3 leading-relaxed">
            Give supervisors a defined process for identifying hazards, assigning corrections, verifying completion, and documenting what happened.
          </p>
          <ul className="text-[15px] md:text-[16px] text-white/65 mb-8 leading-relaxed space-y-0.5 italic">
            <li>No disconnected forms.</li>
            <li>No guessing who owns the next step.</li>
            <li>No rebuilding the process from scratch.</li>
          </ul>
          <div className="flex flex-col gap-3 max-w-md mx-auto mb-8">
            <button
              type="button"
              onClick={() => buy('digital')}
              disabled={loading.digital}
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-6 transition-all text-base disabled:opacity-50 hover:brightness-110"
              style={{ background: GOLD, color: NAVY, ...sans }}
              data-testid="kit-final-cta-digital"
            >
              {loading.digital ? 'Processing…' : 'Get the Supervisor Safety OS — Digital $600'}
            </button>
            <button
              type="button"
              onClick={() => buy('physical')}
              disabled={loading.physical}
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-6 transition-all text-base border-2 disabled:opacity-50 hover:brightness-110"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', background: 'transparent', ...sans }}
              data-testid="kit-final-cta-physical"
            >
              {loading.physical ? 'Processing…' : 'Get the Physical Binder Edition — $700 (free shipping)'}
            </button>
          </div>
          <p className="mt-2 mb-6 text-[13px] italic" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Digital access delivered after purchase. Secure checkout. Clear implementation instructions. Practical tools built for working operations.
          </p>
          <div className="pt-4 border-t border-white/15">
            <p className="text-[15px] text-white/70 leading-relaxed">
              Questions before you buy? Call or text Vince at{' '}
              <a href="tel:+13363298899" className="font-bold text-white underline hover:no-underline" data-testid="kit-final-cta-phone">
                (336) 329-8899
              </a>.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <a
                href="tel:+13363298899"
                className="inline-flex items-center gap-2 text-[13.5px] text-white/75 hover:text-white transition-colors"
                data-testid="kit-final-cta-phone-icon"
              >
                <Phone size={14} /> (336) 329-8899
              </a>
              <a
                href="mailto:vince@giglinecompliance.com"
                className="inline-flex items-center gap-2 text-[13.5px] text-white/75 hover:text-white transition-colors"
                data-testid="kit-final-cta-email-icon"
              >
                <Mail size={14} /> vince@giglinecompliance.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SupervisorKitPage;
