/**
 * First-Pull Checklist template (Phase 2 draft, Batch 2A.1).
 *
 * Renders a single First-Pull Checklist page from the entry in
 * data/firstPullChecklists.js. Each item is now an object
 * { text, cite, kind } where `kind` is one of:
 *   - required          (specific CFR requirement)
 *   - applicability     (required only when specific conditions apply)
 *   - gigline           (GigLine readiness practice)
 *
 * Form is accessible: persistent <label> with for/id, type="email",
 * autocomplete, aria-describedby, focus moves to first invalid field,
 * unchecked marketing consent, honeypot hidden from keyboard AND screen readers.
 * Draft state, form is not wired to live delivery.
 */
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import SEO from './SEO';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#FAF7F1';
const INK = '#0A1628';
const INK_SOFT = 'rgba(10,22,40,0.72)';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "'Manrope', sans-serif" };

const KIND_META = {
  required:      { label: 'Required',      color: '#0A5C36', bg: 'rgba(10,92,54,0.09)',  border: 'rgba(10,92,54,0.32)' },
  applicability: { label: 'Applicability', color: '#1B4A78', bg: 'rgba(27,74,120,0.09)', border: 'rgba(27,74,120,0.32)' },
  gigline:       { label: 'GigLine',       color: '#8E6D1F', bg: 'rgba(201,168,76,0.13)', border: 'rgba(201,168,76,0.42)' },
};

const KitLink = ({ slug }) => {
  // Released kits get a kit-page link. Waitlisted kits (Incident, New Hire) route to the coming-soon route.
  const KIT_ROUTES = {
    'loto-readiness-kit':          { href: '/citation-proof-kits/loto-readiness-kit',           label: 'See the LOTO Readiness Kit',            live: true },
    'forklift-pit-readiness-kit':  { href: '/citation-proof-kits/forklift-pit-readiness-kit',   label: 'See the Forklift & PIT Readiness Kit',  live: true },
    'hazcom-pro-kit':              { href: '/citation-proof-kits/hazcom-pro-kit',               label: 'See the HazCom Pro Kit',                live: true },
    'incident-to-correction-kit':  { href: '/citation-proof-kits/incident-to-correction-kit',   label: 'Join the Incident-to-Correction waitlist', live: false },
    'new-hire-orientation-kit':    { href: '/citation-proof-kits/new-hire-orientation-kit',     label: 'Join the New Hire Orientation waitlist',   live: false },
  };
  const target = KIT_ROUTES[slug];
  if (!target) return null;
  return (
    <Link
      to={target.href}
      className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px] transition-colors"
      style={{ background: target.live ? NAVY : 'transparent', border: target.live ? 'none' : `1px solid ${NAVY}`, color: target.live ? 'white' : NAVY, ...sans }}
      data-testid="first-pull-cta-kit"
    >
      {target.label}
    </Link>
  );
};

const FirstPullChecklistTemplate = ({ checklist }) => {
  const [form, setForm] = useState({ firstName: '', email: '', company: '', consent: false, website: '' });
  const [submitted, setSubmitted] = useState(false);
  const firstNameRef = useRef(null);
  const emailRef = useRef(null);

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) { firstNameRef.current && firstNameRef.current.focus(); return; }
    if (!form.email.trim())     { emailRef.current && emailRef.current.focus(); return; }
    if (form.website) return; // honeypot triggered, silently drop
    // DRAFT STATE, no live submission.
    setSubmitted(true);
  };

  const slug = checklist.slug;

  return (
    <main className="pb-20" style={{ background: CREAM, color: INK, minHeight: '100vh' }} data-testid={`first-pull-page-${slug}`}>
      <SEO
        title={`${checklist.title} | GigLine`}
        description={checklist.subtitle}
        canonical={`/first-pull/${slug}`}
        noindex
      />

      <div className="max-w-3xl mx-auto px-5 pt-10 md:pt-16">
        <Link to="/resources" className="inline-flex items-center gap-2 mb-6 text-[13px]" style={{ color: INK_MUTED }}>
          <ArrowLeft size={14} /> Resources
        </Link>

        <p className="uppercase font-bold tracking-[0.28em] mb-3" style={{ ...mono, fontSize: '10.5px', color: GOLD }}>
          First-Pull Checklist &middot; {checklist.program}
        </p>

        <h1 className="font-bold leading-[1.1] mb-5 text-[32px] sm:text-[40px] md:text-[48px] tracking-tight" style={{ ...sans, color: NAVY }} data-testid="first-pull-title">
          {checklist.title}
        </h1>

        <p className="text-[17px] md:text-[19px] leading-[1.55] italic mb-8 max-w-2xl" style={{ color: INK_SOFT, ...serif }}>
          {checklist.subtitle}
        </p>

        <p className="text-[15px] leading-[1.72] mb-8 max-w-2xl" style={{ color: INK_SOFT, ...serif }}>
          {checklist.intro}
        </p>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-2" data-testid="first-pull-legend" aria-label="Item classification key">
          {Object.entries(KIND_META).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] px-2.5 py-1" style={{ ...mono, color: v.color, background: v.bg, border: `1px solid ${v.border}` }}>
              <span aria-hidden="true">&#9679;</span> {v.label}
            </span>
          ))}
        </div>

        <ol className="space-y-6 mb-12" data-testid="first-pull-items">
          {checklist.items.map((item, i) => {
            const meta = KIND_META[item.kind] || KIND_META.gigline;
            return (
              <li key={i} className="flex gap-4 items-start">
                <span className="font-bold flex-shrink-0" style={{ ...mono, color: GOLD, fontSize: '13px', width: '28px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5" style={{ ...mono, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }} data-testid={`item-kind-${item.kind}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.65] mb-1.5" style={{ color: INK, ...serif }}>
                    {item.text}
                  </p>
                  <p className="text-[12px] italic" style={{ ...mono, color: INK_MUTED }}>
                    {item.cite}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Email My Checklist optional form, accessible */}
        {!submitted ? (
          <section className="p-6 md:p-7 mb-10" style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '3px' }}>
            <h2 className="uppercase font-bold tracking-[0.22em] mb-2" style={{ ...mono, fontSize: '10.5px', color: NAVY }}>
              Optional. Email me the checklist
            </h2>
            <p id={`first-pull-form-help-${slug}`} className="text-[13.5px] leading-[1.65] mb-5" style={{ color: INK_SOFT, ...serif }}>
              You can copy this checklist directly from the page. If you would like a printable PDF version emailed, share your work email below. Draft state, form is not wired to live delivery.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="first-pull-form" aria-describedby={`first-pull-form-help-${slug}`} noValidate>
              {/* Honeypot: absolutely hidden AND removed from a11y tree */}
              <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} aria-hidden="true" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`fp-first-name-${slug}`} className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>First name</label>
                  <input id={`fp-first-name-${slug}`} ref={firstNameRef} type="text" name="firstName" autoComplete="given-name" required value={form.firstName} onChange={set('firstName')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="first-pull-firstname" />
                </div>
                <div>
                  <label htmlFor={`fp-email-${slug}`} className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Work email</label>
                  <input id={`fp-email-${slug}`} ref={emailRef} type="email" name="email" autoComplete="email" inputMode="email" required value={form.email} onChange={set('email')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="first-pull-email" />
                </div>
              </div>
              <div>
                <label htmlFor={`fp-company-${slug}`} className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Company (optional)</label>
                <input id={`fp-company-${slug}`} type="text" name="company" autoComplete="organization" value={form.company} onChange={set('company')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="first-pull-company" />
              </div>
              <div className="flex items-start gap-2.5">
                <input id={`fp-consent-${slug}`} type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-1 flex-shrink-0" data-testid="first-pull-consent" />
                <label htmlFor={`fp-consent-${slug}`} className="text-[13px] leading-[1.55] cursor-pointer" style={{ ...serif, color: INK_SOFT }}>
                  Also send occasional practical safety guidance from GigLine. Unchecked by default. Unsubscribe any time.
                </label>
              </div>
              <button type="submit" className="inline-flex items-center gap-2 font-bold px-5 py-3 text-[14px]" style={{ background: NAVY, color: 'white', ...sans }} data-testid="first-pull-submit">
                <Mail size={15} /> Email me this checklist
              </button>
            </form>
          </section>
        ) : (
          <section className="p-6 md:p-7 mb-10" style={{ background: 'white', border: `1px solid ${GOLD}`, borderRadius: '3px' }} data-testid="first-pull-confirmation" aria-live="polite">
            <CheckCircle2 size={28} style={{ color: GOLD }} aria-hidden="true" />
            <p className="uppercase font-bold tracking-[0.22em] mt-3 mb-1" style={{ ...mono, fontSize: '11px', color: NAVY }}>
              Requested (draft)
            </p>
            <p className="text-[14.5px] leading-[1.65]" style={{ color: INK_SOFT, ...serif }}>
              In a live send, GigLine would email the {checklist.program} First-Pull Checklist to <strong>{form.email}</strong> within a few minutes.{' '}
              {form.consent
                ? 'Your requested resource will be delivered. You will also receive occasional practical safety guidance from GigLine. Unsubscribe at any time.'
                : 'Your requested resource will be delivered without adding you to ongoing marketing emails.'}
            </p>
          </section>
        )}

        {/* About this checklist */}
        <div className="p-5 mb-10" style={{ background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.35)`, borderRadius: '3px' }} data-testid="first-pull-disclaimer">
          <p className="uppercase font-bold tracking-[0.22em] mb-2" style={{ ...mono, fontSize: '9.5px', color: NAVY }}>
            About this checklist
          </p>
          <p className="text-[12.5px] leading-[1.65] italic" style={{ ...serif, color: INK_SOFT }}>
            {checklist.disclaimer}
          </p>
        </div>

        {/* Appropriate next step */}
        <div className="mb-10" data-testid="first-pull-next-step">
          <p className="uppercase font-bold tracking-[0.22em] mb-3" style={{ ...mono, fontSize: '10.5px', color: GOLD }}>
            If several items are gaps
          </p>
          <p className="text-[15px] leading-[1.72] mb-4 max-w-2xl" style={{ ...serif, color: INK_SOFT }}>
            Two reasonable next steps depending on scope. If gaps are primarily documentation, a Documentation Readiness Review is a fixed-quote engagement starting at $1,700. If gaps span both the floor and the paper, a Compliance Readiness Visit combines both starting at $2,500 (a $500 saving compared with purchasing the two standard scopes separately). The kit below is the self-serve option for a single control area.
          </p>
          <div className="flex flex-wrap gap-3">
            <KitLink slug={checklist.linkedKitSlug} />
            <Link to="/services/documentation-readiness-review" className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px]" style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans }} data-testid="first-pull-cta-doc-review">
              Documentation Readiness Review
            </Link>
            <Link to="/services/compliance-readiness-visit" className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px]" style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans }} data-testid="first-pull-cta-crv">
              Compliance Readiness Visit
            </Link>
          </div>
        </div>

        <p className="text-[11.5px] italic mt-8" style={{ color: INK_MUTED }}>
          {checklist.updatedAt}
        </p>
      </div>
    </main>
  );
};

export default FirstPullChecklistTemplate;
