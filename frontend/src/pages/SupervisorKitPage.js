import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Phone, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import { getAttribution, trackEvent } from '../utils/analytics';

const API = process.env.REACT_APP_BACKEND_URL;

/* ── Brand tokens (match Case Study + Services pages) ── */
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

/* ── The 11 documents — SS-XX prefix + 1-line description (mirrors Manus reference) ── */
const KIT_CONTENTS = [
  { num: '00', title: 'Quick Reference Summary Card', desc: 'Post at your supervisor station. Emergency contacts, when to call, monthly schedule at a glance.' },
  { num: '01', title: 'Welcome & Usage Guide', desc: 'Read first. Sets up the system and tells you exactly how to use each piece.' },
  { num: '02', title: 'Chemical Inventory Log', desc: 'List every chemical on site. Required under 29 CFR 1910.1200(e)(1)(i).' },
  { num: '03', title: 'SDS Index & Binder Log', desc: 'Track SDS location per chemical. Cross-reference with SS-02.' },
  { num: '04', title: 'Written HazCom Program', desc: "Your facility's required written hazard communication program. Fill in, sign, retain." },
  { num: '05', title: '30-Day Supervisor Action Checklist', desc: 'Week-by-week implementation roadmap. Work through it in sequence.' },
  { num: '06', title: 'One Phone Call Card', desc: 'Six scenarios that require you to call GigLine before anything else. Post at supervisor station.' },
  { num: '07', title: 'If OSHA Shows Up', desc: 'Seven-step protocol for the first ten minutes of an inspection. Post near your front entrance.' },
  { num: '08', title: 'When to Call for Help', desc: 'Red Flag List — 20+ conditions requiring immediate action, with CFR citations.' },
  { num: '09', title: 'Monthly Safety Inspection Checklist', desc: '40+ items, signature block, retention instruction. Complete one per month.' },
  { num: '10', title: 'Employee Training Record Log', desc: 'Document every safety training session. Retention: indefinitely.' },
];

/* ── Hero stats ── */
const HERO_STATS = [
  { value: '11', label: 'Documents' },
  { value: '40+', label: 'Inspection Items' },
  { value: '6', label: 'CFR Standards Covered' },
  { value: '$16,550', label: 'Max Penalty Per Violation' },
];

/* ── Pricing cards data ── */
const DIGITAL_BULLETS = [
  'All 11 documents',
  'Print-ready PDF format',
  'Instant delivery to your inbox',
  'GigLine business line for questions: (336) 329-8899',
];

const PHYSICAL_BULLETS = [
  'All 11 documents printed and bound in a 3-ring binder',
  'GigLine 2026 Triad OSHA Field Manual included',
  'Personal contact card — direct access to Vince',
  'Ships USPS Priority within 3 business days',
  'Shipping address captured at checkout',
];

const AUDIENCE_CARDS = [
  {
    label: 'Plant Managers & Operations Leaders',
    body: "You're responsible for what happens on the floor. This gives you the documentation to prove it.",
  },
  {
    label: 'HR & Safety Administrators',
    body: 'Training records, HazCom programs, inspection logs — everything OSHA expects to see in one place.',
  },
  {
    label: 'New or Growing Operations',
    body: "If you're scaling headcount or equipment, this is the foundation to build from before an inspector arrives.",
  },
];

/* ── Small primitives ── */
const SectionLabel = ({ children }) => (
  <p
    className="uppercase font-bold tracking-[0.28em] mb-5"
    style={{ color: GOLD, ...mono, fontSize: '11px' }}
  >
    {children}
  </p>
);

const H2 = ({ children, center = false }) => (
  <h2
    className={`font-bold leading-tight mb-6 text-[26px] md:text-[32px] ${center ? 'text-center' : ''}`}
    style={{ ...sans, color: NAVY }}
  >
    {children}
  </h2>
);

/* ── Pricing card ── */
const PricingCard = ({ label, price, subline, bullets, ctaLabel, ctaTestId, onBuy, loading, featured }) => (
  <div
    className="rounded-lg p-7 md:p-8 flex flex-col h-full relative"
    style={{
      background: featured ? NAVY : 'white',
      border: `1px solid ${featured ? GOLD : BORDER}`,
      boxShadow: featured ? '0 18px 40px rgba(10,22,40,0.18)' : '0 6px 16px rgba(10,22,40,0.06)',
      color: featured ? 'white' : NAVY,
    }}
    data-testid={`kit-card-${featured ? 'physical' : 'digital'}`}
  >
    {featured && (
      <span
        className="absolute -top-3 right-6 uppercase font-bold tracking-[0.18em] px-3 py-1 rounded-sm"
        style={{
          background: GOLD,
          color: NAVY,
          ...mono,
          fontSize: '10.5px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
        }}
        data-testid="kit-card-recommended-badge"
      >
        Recommended
      </span>
    )}
    <p
      className="uppercase font-bold tracking-[0.22em] mb-3"
      style={{ color: GOLD, ...mono, fontSize: '11px' }}
    >
      {label}
    </p>
    <p
      className="font-extrabold leading-none mb-2"
      style={{ ...mono, fontSize: '44px', color: featured ? 'white' : NAVY }}
    >
      {price}
    </p>
    <p
      className="text-sm mb-6 leading-relaxed"
      style={{ color: featured ? 'rgba(255,255,255,0.70)' : TEXT_SUBTLE }}
    >
      {subline}
    </p>
    <ul className="space-y-3 mb-8 flex-1">
      {bullets.map((b, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
          <span
            className="flex-shrink-0 font-bold leading-none"
            style={{ color: GOLD, ...mono, fontSize: '17px', lineHeight: '1.2' }}
            aria-hidden
          >
            &mdash;
          </span>
          <span style={{ color: featured ? 'rgba(255,255,255,0.88)' : TEXT_MUTED }}>{b}</span>
        </li>
      ))}
    </ul>
    <button
      type="button"
      onClick={onBuy}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 font-bold py-4 px-6 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
      style={{
        background: featured ? GOLD : NAVY,
        color: featured ? NAVY : 'white',
        ...sans,
      }}
      data-testid={ctaTestId}
    >
      {loading ? 'Processing...' : ctaLabel}
      <ArrowRight size={18} />
    </button>
  </div>
);

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
        // Hand off to Stripe Checkout
        window.location.href = data.url;
        return;
      }
      setStatus({ ok: false, message: 'Could not start checkout. Please call (336) 329-8899.' });
    } catch (err) {
      setStatus({ ok: false, message: 'Network error. Please call (336) 329-8899.' });
    }
    setLoading((p) => ({ ...p, [variant]: false }));
  };

  return (
    <main
      data-testid="supervisor-kit-page"
      style={{ backgroundColor: BG_WARM, color: NAVY }}
    >
      <SEO
        title="Supervisor Safety Starter System | GigLine Safety & Compliance"
        description="11 documents. CFR citations. Built for the person responsible for safety when no one else is watching. $600 digital. $675 physical with binder, field manual, and direct access to Vince."
        canonical="/supervisor-kit"
      />

      {/* ─────────── HERO ─────────── */}
      <section className="px-5 md:px-8 pt-20 md:pt-28 pb-14 md:pb-16" data-testid="kit-hero">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel>Supervisor Safety Starter System</SectionLabel>
          <h1
            className="font-bold leading-[1.08] tracking-tight mb-6 text-[32px] md:text-[44px] lg:text-[52px]"
            style={{ ...sans, color: NAVY }}
            data-testid="kit-hero-headline"
          >
            Built for the person responsible for safety when no one else is watching.
          </h1>
          <p
            className="text-[17px] md:text-[19px] leading-[1.65] max-w-3xl mx-auto mb-12 md:mb-14"
            style={{ color: TEXT_MUTED, ...serif }}
            data-testid="kit-hero-subhead"
          >
            11 documents. CFR citations. Inspection protocols. Every form maps directly to an OSHA standard. Use it consistently and you will be prepared for any inspection, incident, or audit.
          </p>

          {/* Hero stats bar (mirrors Manus reference) */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
            data-testid="kit-hero-stats"
          >
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center py-5 px-3 rounded-md"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-hero-stat-${i + 1}`}
              >
                <p
                  className="font-extrabold leading-none tracking-tight mb-2"
                  style={{ color: GOLD, ...mono, fontSize: 'clamp(22px, 2.4vw, 30px)' }}
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

      {/* ─────────── WHAT'S INSIDE — SS-XX cards (mirrors Manus reference) ─────────── */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kit-contents">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>What&rsquo;s Inside</SectionLabel>
          <H2>Nothing generic. Nothing filler.</H2>
          <p
            className="text-[16px] md:text-[17px] leading-[1.7] max-w-3xl mb-6"
            style={{ color: TEXT_MUTED, ...serif }}
          >
            Every document maps to a specific OSHA standard. Each one includes the CFR citation, a retention instruction, and a note on what it proves in an inspection.
          </p>
          <div
            className="rounded-md p-4 md:p-5 mb-12 md:mb-14"
            style={{ background: PANEL, border: `1px solid ${BORDER}` }}
            data-testid="kit-value-callout"
          >
            <p className="text-[14.5px] md:text-[15px] leading-[1.6]" style={{ color: NAVY, ...serif }}>
              <strong>Estimated compliance value:</strong> $600&ndash;$800 to have a consultant build these documents from scratch. This kit delivers the same structure, CFR-cited and ready to adapt.
            </p>
          </div>

          <ul
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5"
            data-testid="kit-contents-list"
          >
            {KIT_CONTENTS.map((item) => (
              <li
                key={item.num}
                className="flex items-start gap-4"
                data-testid={`kit-doc-${item.num}`}
              >
                <span
                  className="flex-shrink-0 inline-flex items-center justify-center font-bold rounded-md mt-0.5"
                  style={{
                    background: NAVY,
                    color: GOLD,
                    ...mono,
                    fontSize: '11.5px',
                    width: '46px',
                    height: '24px',
                    letterSpacing: '0.04em',
                  }}
                >
                  SS-{item.num}
                </span>
                <div className="flex-1">
                  <h3
                    className="font-bold text-[15.5px] md:text-[16.5px] leading-snug mb-1"
                    style={{ ...sans, color: NAVY }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-[14.5px] md:text-[15px] leading-[1.6]"
                    style={{ color: TEXT_MUTED, ...serif }}
                  >
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p
            className="text-sm leading-relaxed mt-12 italic"
            style={{ color: TEXT_SUBTLE, ...serif }}
          >
            Digital kit includes all 11 documents as print-ready PDFs. Physical kit includes everything printed and bound in a 3-ring binder, plus the GigLine 2026 Triad OSHA Field Manual and a personal contact card for direct access to Vince.
          </p>
        </div>
      </section>

      {/* ─────────── VALUE FRAMING — pulled quote w/ attribution (mirrors Manus reference) ─────────── */}
      <section className="px-5 md:px-8 py-16 md:py-20" data-testid="kit-value-framing">
        <div className="max-w-3xl mx-auto">
          <blockquote
            className="border-l-4 pl-6 md:pl-7"
            style={{ borderColor: GOLD }}
          >
            <p
              className="text-[17px] md:text-[19px] leading-[1.7] mb-5 italic"
              style={{ color: NAVY, ...serif }}
            >
              &ldquo;Most small operations pay $600&ndash;$800 or more to have a consultant build a written HazCom program, chemical and SDS indexes, training records, and inspection checklists from scratch. This kit gives you that structure &mdash; CFR-cited, GigLine-built &mdash; ready to adapt to your operation.
            </p>
            <p
              className="text-[17px] md:text-[19px] leading-[1.7] mb-6 italic"
              style={{ color: NAVY, ...serif }}
            >
              It is not a substitute for a site-specific walkthrough. It is the foundation you need before one happens &mdash; or the documentation layer you put in place after.&rdquo;
            </p>
            <footer
              className="text-[14px] md:text-[15px] font-bold"
              style={{ color: TEXT_MUTED, ...sans }}
            >
              &mdash; Vince Lawrence, GigLine Safety &amp; Compliance
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ─────────── PRICING CARDS ─────────── */}
      <section className="px-5 md:px-8 pb-20 md:pb-24" data-testid="kit-pricing">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
            <PricingCard
              label="Digital Kit"
              price="$600"
              subline="Instant download — all 11 documents as print-ready PDFs"
              bullets={DIGITAL_BULLETS}
              ctaLabel="Buy Digital Kit — $600"
              ctaTestId="kit-buy-digital"
              onBuy={() => buy('digital')}
              loading={loading.digital}
            />
            <PricingCard
              label="Physical Kit"
              price="$675"
              subline="Printed, bound, and shipped USPS Priority"
              bullets={PHYSICAL_BULLETS}
              ctaLabel="Buy Physical Kit — $675"
              ctaTestId="kit-buy-physical"
              onBuy={() => buy('physical')}
              loading={loading.physical}
              featured
            />
          </div>

          {/* Status banner after click */}
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
              {status.orderToken && (
                <span className="block mt-1 font-mono text-xs opacity-70">
                  Order reference: {status.orderToken}
                </span>
              )}
            </div>
          )}

          <p
            className="text-center text-sm italic mt-8 max-w-2xl mx-auto"
            style={{ color: TEXT_SUBTLE, ...serif }}
            data-testid="kit-crv-note"
          >
            Included at no additional cost with every Compliance Readiness Visit ($2,000). Already a CRV client? Your kit ships separately &mdash; contact (336) 329-8899.
          </p>
        </div>
      </section>

      {/* ─────────── WHO IT'S FOR ─────────── */}
      <section className="px-5 md:px-8 py-20 md:py-24" style={{ background: PANEL }} data-testid="kit-audience">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Who This Is For</SectionLabel>
          <H2>Three audiences. One kit.</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {AUDIENCE_CARDS.map((card, i) => (
              <div
                key={i}
                className="rounded-md p-6"
                style={{ background: 'white', border: `1px solid ${BORDER}` }}
                data-testid={`kit-audience-card-${i + 1}`}
              >
                <p
                  className="font-bold text-[16px] md:text-[17px] mb-3 leading-tight"
                  style={{ ...sans, color: NAVY }}
                >
                  {card.label}
                </p>
                <p
                  className="text-[15px] leading-[1.65]"
                  style={{ color: TEXT_MUTED, ...serif }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── INCLUDED-WITH-CRV BAND ─────────── */}
      <section
        className="px-5 md:px-8 py-16 md:py-20"
        style={{ background: PANEL, borderTop: `1px solid ${BORDER}` }}
        data-testid="kit-crv-band"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="font-bold text-[19px] md:text-[22px] leading-tight mb-3"
            style={{ ...sans, color: NAVY }}
          >
            Already purchased a Compliance Readiness Visit?
          </p>
          <p
            className="text-[17px] md:text-[18px] leading-[1.65] mb-4"
            style={{ color: TEXT_MUTED, ...serif }}
          >
            The Supervisor Safety Starter System is included at no additional cost.
          </p>
          <p className="text-[15px]" style={{ color: TEXT_SUBTLE }}>
            Call or text{' '}
            <a
              href="tel:+13363298899"
              className="font-bold underline hover:no-underline"
              style={{ color: NAVY }}
              data-testid="kit-crv-phone"
            >
              (336) 329-8899
            </a>{' '}
            to arrange delivery.
          </p>
        </div>
      </section>

      {/* ─────────── FOOTER CTA ─────────── */}
      <section
        className="px-5 md:px-8 py-20 md:py-24"
        style={{ background: NAVY, color: 'white' }}
        data-testid="kit-footer-cta"
      >
        <div
          className="max-w-2xl mx-auto text-center"
          style={{ borderTop: `2px solid ${GOLD}`, paddingTop: '36px' }}
        >
          <h2
            className="font-bold leading-tight mb-3 text-[28px] md:text-[36px]"
            style={{ ...sans }}
          >
            Questions before you buy?
          </h2>
          <p className="text-[17px] md:text-[19px] text-white/70 mb-8 leading-relaxed">
            Call or text (336) 329-8899. Vince picks up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+13363298899"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-7 transition-all text-base"
              style={{ background: GOLD, color: NAVY, ...sans }}
              data-testid="kit-footer-phone"
            >
              <Phone size={18} />
              Call (336) 329-8899
            </a>
            <a
              href="mailto:vince@giglinecompliance.com?subject=Supervisor%20Safety%20Starter%20System"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-7 transition-all text-base border-2"
              style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white', ...sans }}
              data-testid="kit-footer-email"
            >
              <Mail size={18} />
              Email Vince
            </a>
          </div>
          <p className="text-sm text-white/45 italic mt-6">
            Or{' '}
            <Link to="/intake" className="underline hover:text-white" data-testid="kit-footer-intake-link">
              start a client intake
            </Link>{' '}
            to scope a full Compliance Readiness Visit.
          </p>
        </div>
      </section>
    </main>
  );
};

export default SupervisorKitPage;
