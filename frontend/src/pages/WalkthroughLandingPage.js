import React, { useState } from 'react';
import { ArrowRight, Phone, Mail, Check, ChevronDown, Star } from 'lucide-react';
import SEO from '../components/SEO';

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const BG_WARM = '#FAF7F1';     // page background — warm off-white
const BG_CARD = '#FFFFFF';     // form / next-steps cards
const BG_SOFT = '#F2EDE3';     // soft cream for section variation
const BORDER = '#E5DDCD';      // subtle warm border
const TEXT_MUTED = 'rgba(10,22,40,0.65)';
const TEXT_SUBTLE = 'rgba(10,22,40,0.45)';

const OPERATION_OPTIONS = [
  'Manufacturing',
  'Warehouse / Distribution',
  'Contractor / Trades',
  'Trucking Fleet',
  'Other',
];

const BEST_TIME_OPTIONS = [
  'Morning (8\u201311am)',
  'Midday (11am\u20132pm)',
  'Afternoon (2\u20135pm)',
];

const API = process.env.REACT_APP_BACKEND_URL;

const WalkthroughLandingPage = () => {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    operation_type: '',
    best_time: '',
    specifics: '',
    website: '', // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/walkthrough-landing/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submit failed');
      setSuccess(true);
      setTimeout(() => {
        document.getElementById('wt-success')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err) {
      setErrorMsg('Something went wrong. Please call (336) 329-8899 directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      data-testid="walkthrough-landing"
      className="min-h-screen"
      style={{ backgroundColor: BG_WARM, color: NAVY }}
    >
      <SEO
        title="Request a Safety Walkthrough | GigLine Safety & Compliance"
        description="Schedule an on-site safety walkthrough with Vince Lawrence. GigLine identifies your top OSHA exposure points and delivers a written report ranked by risk. One visit. No retainer. Serving the Piedmont Triad, NC."
        canonical="/walkthrough"
      />

      {/* ─────────────────────────────────────────────
          SECTION 1 — MINIMAL HEADER (no nav)
      ───────────────────────────────────────────── */}
      <header
        className="px-5 md:px-8 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_WARM }}
        data-testid="wt-header"
      >
        <a href="https://www.giglinecompliance.com" className="flex items-center">
          <img src="/gigline-logo-3d.png?v=3" loading="lazy"
            alt="GigLine Safety & Compliance"
            className="h-9 md:h-11 w-auto"
            width="244"
            height="100" />
        </a>
        <a
          href="tel:3363298899"
          className="inline-flex items-center gap-2 text-sm md:text-base font-semibold"
          style={{ color: NAVY }}
          data-testid="wt-header-call"
        >
          <Phone size={15} style={{ color: GOLD }} />
          <span className="hidden sm:inline">(336) 329-8899</span>
          <span className="sm:hidden">Call</span>
        </a>
      </header>

      {/* ─────────────────────────────────────────────
          SECTION 2 — HERO  (light, type-driven)
      ───────────────────────────────────────────── */}
      <section className="px-5 md:px-8 pt-12 pb-10 md:pt-20 md:pb-14" data-testid="wt-hero">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow tag */}
          <p
            className="inline-block uppercase font-bold tracking-[0.28em] mb-6"
            style={{ color: GOLD, fontSize: '11px' }}
          >
            <span style={{ borderBottom: `1px solid ${GOLD}`, paddingBottom: '4px' }}>
              By Appointment
            </span>
          </p>
          <h1
            className="font-bold leading-[1.1] mb-6 text-[34px] sm:text-[42px] md:text-[54px] tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
            data-testid="wt-headline"
          >
            Request a Safety Walkthrough
          </h1>
          <p className="text-lg md:text-xl leading-relaxed mb-5 max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
            Vince will walk your floor, identify your top exposure points, and give you a written report &mdash; ranked by risk. One visit. No retainer.
          </p>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
            Most facilities have gaps they don&rsquo;t know about. This is how you{' '}
            <span style={{ color: NAVY, fontWeight: 700, borderBottom: `2px solid ${GOLD}`, paddingBottom: '1px' }}>
              find them before OSHA does.
            </span>
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 3 — WHAT HAPPENS AFTER YOU SUBMIT
          Soft cream backdrop with white cards
      ───────────────────────────────────────────── */}
      <section className="px-5 md:px-8 py-12 md:py-16" style={{ backgroundColor: BG_SOFT }} data-testid="wt-next-steps">
        <div className="max-w-4xl mx-auto">
          <p
            className="uppercase font-bold tracking-[0.28em] text-center mb-10"
            style={{ color: GOLD, fontSize: '11px' }}
          >
            Here&rsquo;s what happens next
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              'Vince reviews your request within 24 hours.',
              'He confirms a walkthrough date and time that works for your operation.',
              'He arrives on-site, walks your floor, and delivers a written report within 48 hours of the visit.',
            ].map((text, i) => (
              <li
                key={i}
                className="relative p-6 md:p-7"
                style={{
                  backgroundColor: BG_CARD,
                  border: `1px solid ${BORDER}`,
                  boxShadow: '0 1px 2px rgba(10,22,40,0.04)',
                }}
                data-testid={`wt-step-${i + 1}`}
              >
                <span
                  className="block leading-none mb-4"
                  style={{
                    color: GOLD,
                    fontFamily: 'Georgia, serif',
                    fontSize: '42px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-base md:text-[15px] leading-[1.55]" style={{ color: NAVY }}>
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 4 — THE FORM (primary conversion)
      ───────────────────────────────────────────── */}
      <section
        className="px-5 md:px-8 py-12 md:py-16"
        style={{ backgroundColor: BG_WARM }}
        data-testid="wt-form-section"
      >
        <div className="max-w-2xl mx-auto">
          {success ? (
            <div
              id="wt-success"
              className="p-8 md:p-10 text-center"
              style={{
                backgroundColor: BG_CARD,
                border: `2px solid ${GOLD}`,
              }}
              data-testid="wt-success"
            >
              <span
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
                style={{ backgroundColor: GOLD }}
              >
                <Check size={26} color={NAVY} strokeWidth={3} />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}>
                Request received.
              </h2>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
                Vince will confirm your walkthrough within 24 hours. Check your email for a confirmation.
              </p>
              <p className="mt-6 text-sm" style={{ color: TEXT_SUBTLE }}>
                Need to reach him sooner?{' '}
                <a href="tel:3363298899" style={{ color: NAVY, fontWeight: 700 }}>
                  (336) 329-8899
                </a>
              </p>
            </div>
          ) : (
            <div
              className="p-7 md:p-10"
              style={{
                backgroundColor: BG_CARD,
                border: `1px solid ${BORDER}`,
                boxShadow: '0 4px 24px rgba(10,22,40,0.05)',
              }}
            >
              <h2
                className="text-2xl md:text-3xl font-bold mb-2 text-center"
                style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
                data-testid="wt-form-title"
              >
                Request Your Walkthrough
              </h2>
              <p className="text-center mb-8 text-sm md:text-base" style={{ color: TEXT_MUTED }}>
                Takes 60 seconds. Vince calls back within 24 hours.
              </p>

              <form onSubmit={submit} className="space-y-4" noValidate data-testid="wt-form">
                {/* Honeypot — visually hidden, off-screen */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label>
                    Website
                    <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                  </label>
                </div>

                <Field label="Your Name" required>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="First and last"
                    className={inputCls}
                    data-testid="wt-field-name"
                  />
                </Field>

                <Field label="Company / Facility Name" required>
                  <input
                    type="text"
                    required
                    autoComplete="organization"
                    value={form.company}
                    onChange={update('company')}
                    className={inputCls}
                    data-testid="wt-field-company"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Phone Number" required>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="(336) 555-0100"
                      className={inputCls}
                      data-testid="wt-field-phone"
                    />
                  </Field>
                  <Field label="Email Address" required>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="name@company.com"
                      className={inputCls}
                      data-testid="wt-field-email"
                    />
                  </Field>
                </div>

                <Field label="City / Location" required>
                  <input
                    type="text"
                    required
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={update('city')}
                    placeholder="e.g. Winston-Salem, NC"
                    className={inputCls}
                    data-testid="wt-field-city"
                  />
                </Field>

                <Field label="Type of Operation" required>
                  <SelectWithArrow>
                    <select
                      required
                      value={form.operation_type}
                      onChange={update('operation_type')}
                      className={selectCls}
                      data-testid="wt-field-operation"
                    >
                      <option value="" disabled>Select one&hellip;</option>
                      {OPERATION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </SelectWithArrow>
                </Field>

                <Field label="Best Time to Reach You" required>
                  <SelectWithArrow>
                    <select
                      required
                      value={form.best_time}
                      onChange={update('best_time')}
                      className={selectCls}
                      data-testid="wt-field-besttime"
                    >
                      <option value="" disabled>Select one&hellip;</option>
                      {BEST_TIME_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </SelectWithArrow>
                </Field>

                <Field label="Anything specific you want looked at?">
                  <textarea
                    value={form.specifics}
                    onChange={update('specifics')}
                    maxLength={300}
                    rows={3}
                    placeholder="e.g. forklift area, chemical storage, documentation"
                    className={`${inputCls} resize-none`}
                    data-testid="wt-field-specifics"
                  />
                  <p className="mt-1 text-[11px] text-right" style={{ fontFamily: "'JetBrains Mono', monospace", color: TEXT_SUBTLE }}>
                    {form.specifics.length} / 300
                  </p>
                </Field>

                {errorMsg && (
                  <p className="text-sm text-rose-600 text-center" data-testid="wt-form-error">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-bold text-base md:text-lg py-4 md:py-5 mt-2 transition-all disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: GOLD,
                    color: NAVY,
                    fontFamily: "'Manrope', sans-serif",
                    boxShadow: '0 6px 18px rgba(197,160,89,0.28)',
                  }}
                  data-testid="wt-submit"
                >
                  {submitting ? 'Sending\u2026' : 'Request My Walkthrough'}
                  {!submitting && <ArrowRight size={18} />}
                </button>
                <p className="text-center text-sm mt-3 italic" style={{ color: TEXT_MUTED }}>
                  No obligation. No retainer. Vince will confirm within 24 hours.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 5 — TESTIMONIAL  (single dark anchor)
      ───────────────────────────────────────────── */}
      <section className="px-5 md:px-8 py-12 md:py-16" style={{ backgroundColor: BG_SOFT }} data-testid="wt-testimonial-section">
        <div className="max-w-3xl mx-auto">
          <div
            className="p-8 md:p-12 relative"
            style={{
              backgroundColor: NAVY,
              color: 'white',
            }}
            data-testid="wt-testimonial"
          >
            <span
              aria-hidden="true"
              className="absolute top-4 right-6 select-none pointer-events-none leading-none"
              style={{ color: GOLD, opacity: 0.22, fontFamily: 'Georgia, serif', fontSize: '110px' }}
            >
              &ldquo;
            </span>
            <p
              className="relative text-xl md:text-2xl leading-[1.45] font-medium mb-6 text-white"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Showed up in work boots and asked to see the press line first. Spotted three LOTO gaps in twenty minutes that we&rsquo;d missed for over a year.
            </p>
            <div className="w-10 h-[2px] mb-5" style={{ backgroundColor: GOLD }} />
            <p
              className="text-sm md:text-base font-bold tracking-wide"
              style={{ color: GOLD }}
            >
              &mdash; David R., Plant Manager
            </p>
            <p className="text-xs md:text-sm mt-1 text-white/55">
              Small Manufacturer, Piedmont Triad NC
            </p>
          </div>

          {/* Google rating badge — light variant */}
          <a
            href="https://maps.app.goo.gl/4D3TVUAeyfzbm7WbA?utm_source=walkthrough-landing&utm_medium=qr&utm_campaign=review-request"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white"
            style={{
              backgroundColor: BG_CARD,
              border: `1px solid ${BORDER}`,
              color: NAVY,
            }}
            data-testid="wt-google-badge"
          >
            <span className="font-bold text-lg" style={{ color: NAVY }}>5.0</span>
            <span className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill={GOLD} color={GOLD} />
              ))}
            </span>
            <span className="text-sm" style={{ color: TEXT_MUTED }}>&middot; Google Review</span>
            <span className="text-sm font-semibold ml-1" style={{ color: NAVY }}>Read on Google &rarr;</span>
          </a>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SECTION 6 — MINIMAL FOOTER (light)
      ───────────────────────────────────────────── */}
      <footer
        className="px-5 md:px-8 py-10 md:py-12"
        style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: BG_WARM }}
        data-testid="wt-footer"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <a href="https://www.giglinecompliance.com" className="block">
            <img src="/gigline-logo-3d.png?v=3" loading="lazy"
              alt="GigLine Safety & Compliance"
              className="h-9 md:h-10 w-auto"
              width="244"
              height="100" />
          </a>

          <div className="text-sm md:text-[15px] flex flex-col md:items-end gap-2" style={{ color: TEXT_MUTED }}>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a href="mailto:vince@giglinecompliance.com" className="inline-flex items-center gap-1.5 hover:underline" style={{ color: NAVY }}>
                <Mail size={13} style={{ color: GOLD }} />
                vince@giglinecompliance.com
              </a>
              <span style={{ color: TEXT_SUBTLE }}>&middot;</span>
              <a href="tel:3363298899" className="inline-flex items-center gap-1.5 hover:underline" style={{ color: NAVY }}>
                <Phone size={13} style={{ color: GOLD }} />
                (336) 329-8899
              </a>
              <span style={{ color: TEXT_SUBTLE }}>&middot;</span>
              <a href="https://www.giglinecompliance.com" className="hover:underline" style={{ color: NAVY }}>
                giglinecompliance.com
              </a>
            </p>
          </div>
        </div>

        {/* Cross-sell line */}
        <div className="max-w-5xl mx-auto mt-8 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-xs md:text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
            For trucking fleets:{' '}
            <span style={{ color: NAVY, fontWeight: 700 }}>GigLine finds the gap. LaunchPath installs the system.</span>{' '}
            <a
              href="https://www.launchpathedu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
              style={{ color: NAVY, borderBottom: `2px solid ${GOLD}` }}
            >
              launchpathedu.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
};

// ── helpers ────────────────────────────────────
const inputCls =
  'w-full px-4 py-3.5 md:py-4 bg-white border border-[#D9CFB8] rounded-none focus:outline-none focus:border-[#C5A059] text-[#0A1628] placeholder-[#0A1628]/35 text-[15px] md:text-base transition-colors';
const selectCls = `${inputCls} appearance-none pr-10 cursor-pointer`;

const Field = ({ label, required, children }) => (
  <label className="block">
    <span className="block text-[11px] md:text-xs uppercase tracking-[0.18em] font-bold mb-2" style={{ color: 'rgba(10,22,40,0.55)' }}>
      {label}
      {required && <span style={{ color: '#C5A059' }} className="ml-1">*</span>}
    </span>
    {children}
  </label>
);

const SelectWithArrow = ({ children }) => (
  <div className="relative">
    {children}
    <ChevronDown
      size={16}
      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: 'rgba(10,22,40,0.45)' }}
    />
  </div>
);

export default WalkthroughLandingPage;
