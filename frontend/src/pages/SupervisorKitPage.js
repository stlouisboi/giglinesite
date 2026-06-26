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

/* ── The 11 documents (GL-WEB-015 spec) ── */
const KIT_CONTENTS = [
  'Quick Reference Summary Card — post at your supervisor station',
  'Welcome & Usage Guide — read first, sets up the system',
  'Chemical Inventory Log — list every chemical on site',
  'SDS Index & Binder Log — track SDS location per chemical',
  'Written HazCom Program — your required written safety program',
  '30-Day Supervisor Action Checklist — week-by-week implementation roadmap',
  'One Phone Call Card — six scenarios, post at your supervisor station',
  'If OSHA Shows Up — seven-step protocol, post near your front entrance',
  'When to Call for Help — Red Flag List with CFR citations',
  'Monthly Safety Inspection Checklist — 40+ items, signature block, retention instruction',
  'Employee Training Record Log — document every safety training session',
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
    className="rounded-lg p-7 md:p-8 flex flex-col h-full"
    style={{
      background: featured ? NAVY : 'white',
      border: `1px solid ${featured ? GOLD : BORDER}`,
      boxShadow: featured ? '0 18px 40px rgba(10,22,40,0.18)' : '0 6px 16px rgba(10,22,40,0.06)',
      color: featured ? 'white' : NAVY,
    }}
    data-testid={`kit-card-${featured ? 'physical' : 'digital'}`}
  >
    <p
      className="uppercase font-bold tracking-[0.22em] mb-3"
      style={{ color: featured ? GOLD : GOLD, ...mono, fontSize: '11px' }}
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
          <Check
            size={16}
            strokeWidth={3}
            className="flex-shrink-0 mt-0.5"
            style={{ color: GOLD }}
          />
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
        body: JSON.stringify({ attribution: getAttribution() }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        trackEvent('supervisor_kit_buy_click', {
          variant,
          order_token: data.order_token,
        });
        setStatus({
          ok: true,
          message: data.message,
          orderToken: data.order_token,
        });
      } else {
        setStatus({ ok: false, message: 'Something went wrong. Please call (336) 329-8899.' });
      }
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
      <section className="px-5 md:px-8 pt-20 md:pt-28 pb-16 md:pb-20" data-testid="kit-hero">
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
            className="text-[17px] md:text-[19px] leading-[1.65] max-w-3xl mx-auto"
            style={{ color: TEXT_MUTED, ...serif }}
            data-testid="kit-hero-subhead"
          >
            11 documents. CFR citations. Inspection protocols. Every form maps directly to an OSHA standard. Use it consistently and you will be prepared for any inspection, incident, or audit.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto" style={{ height: '1px', background: BORDER }} />

      {/* ─────────── WHAT'S INSIDE ─────────── */}
      <section className="px-5 md:px-8 py-20 md:py-24" data-testid="kit-contents">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>What&rsquo;s Inside</SectionLabel>
          <H2>Every document in the kit maps to a specific OSHA standard. Nothing generic. Nothing filler.</H2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-10" data-testid="kit-contents-list">
            {KIT_CONTENTS.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                data-testid={`kit-doc-${i + 1}`}
              >
                <span
                  className="flex-shrink-0 mt-1 font-bold"
                  style={{ ...mono, color: GOLD, fontSize: '13px', minWidth: '22px' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[15.5px] md:text-base leading-[1.65]" style={{ color: TEXT_MUTED, ...serif }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="text-sm leading-relaxed mt-10 italic"
            style={{ color: TEXT_SUBTLE, ...serif }}
          >
            Digital kit includes all 11 documents as print-ready PDFs. Physical kit includes everything printed and bound in a 3-ring binder, plus the GigLine 2026 Triad OSHA Field Manual and a personal contact card for direct access to Vince.
          </p>
        </div>
      </section>

      {/* ─────────── VALUE FRAMING ─────────── */}
      <section className="px-5 md:px-8 py-16 md:py-20" data-testid="kit-value-framing">
        <div className="max-w-2xl mx-auto">
          <p
            className="text-[17px] md:text-[18px] leading-[1.75] mb-5"
            style={{ color: TEXT_MUTED, ...serif }}
          >
            Most small operations pay $600&ndash;$800 or more to have a consultant build a written HazCom program, chemical and SDS indexes, training records, and inspection checklists from scratch. This kit gives you that structure &mdash; CFR-cited, GigLine-built &mdash; ready to adapt to your operation.
          </p>
          <p
            className="text-[17px] md:text-[18px] leading-[1.75]"
            style={{ color: TEXT_MUTED, ...serif }}
          >
            It is not a substitute for a site-specific walkthrough. It is the foundation you need before one happens &mdash; or the documentation layer you put in place after.
          </p>
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
