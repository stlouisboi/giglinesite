/**
 * First-Pull Checklist template (Phase 2 draft).
 *
 * Renders a single First-Pull Checklist page from the entry in
 * data/firstPullChecklists.js. Voice, layout, and typography follow the
 * editorial navy/gold/cream system used elsewhere on the site.
 *
 * Includes an optional Email My Checklist form. The form displays the
 * consent-unchecked default and captures marketing_consent explicitly.
 * The form is intentionally NOT wired to a live backend in the draft state,
 * on submit it renders a confirmation state locally so owner can review the
 * copy and UX.
 */
import React, { useState } from 'react';
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

const FirstPullChecklistTemplate = ({ checklist }) => {
  const [form, setForm] = useState({ firstName: '', email: '', company: '', consent: false, website: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) return;
    // DRAFT STATE: no live submission. Owner reviews the confirmation state below.
    setSubmitted(true);
  };

  return (
    <main
      className="pb-20"
      style={{ background: CREAM, color: INK, minHeight: '100vh' }}
      data-testid={`first-pull-page-${checklist.slug}`}
    >
      <SEO
        title={`${checklist.title} | GigLine`}
        description={checklist.subtitle}
        canonical={`/first-pull/${checklist.slug}`}
        noindex
      />

      <div className="max-w-3xl mx-auto px-5 pt-10 md:pt-16">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 mb-6 text-[13px] transition-colors"
          style={{ color: INK_MUTED }}
        >
          <ArrowLeft size={14} /> Resources
        </Link>

        <p
          className="uppercase font-bold tracking-[0.28em] mb-3"
          style={{ ...mono, fontSize: '10.5px', color: GOLD }}
        >
          First-Pull Checklist · {checklist.program}
        </p>

        <h1
          className="font-bold leading-[1.1] mb-5 text-[32px] sm:text-[40px] md:text-[48px] tracking-tight"
          style={{ ...sans, color: NAVY }}
          data-testid="first-pull-title"
        >
          {checklist.title}
        </h1>

        <p
          className="text-[17px] md:text-[19px] leading-[1.55] italic mb-8 max-w-2xl"
          style={{ color: INK_SOFT, ...serif }}
        >
          {checklist.subtitle}
        </p>

        <p className="text-[15px] leading-[1.72] mb-10 max-w-2xl" style={{ color: INK_SOFT, ...serif }}>
          {checklist.intro}
        </p>

        <ol className="space-y-4 mb-12" data-testid="first-pull-items">
          {checklist.items.map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span
                className="font-bold flex-shrink-0"
                style={{ ...mono, color: GOLD, fontSize: '13px', width: '28px' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                className="text-[15px] leading-[1.65]"
                style={{ color: INK, ...serif }}
              >
                {item}
              </p>
            </li>
          ))}
        </ol>

        {/* Email My Checklist optional form */}
        {!submitted ? (
          <section
            className="p-6 md:p-7 mb-10"
            style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '3px' }}
          >
            <p
              className="uppercase font-bold tracking-[0.22em] mb-2"
              style={{ ...mono, fontSize: '10px', color: NAVY }}
            >
              Optional: Email me the checklist
            </p>
            <p className="text-[13.5px] leading-[1.65] mb-5" style={{ color: INK_SOFT, ...serif }}>
              You can copy this checklist directly from the page. If you would like a printable PDF version emailed, share your work email below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="first-pull-form">
              {/* honeypot */}
              <input type="text" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>First name</label>
                  <input type="text" required value={form.firstName} onChange={set('firstName')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="first-pull-firstname" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Work email</label>
                  <input type="email" required value={form.email} onChange={set('email')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="first-pull-email" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] font-bold mb-1.5" style={{ ...mono, color: NAVY }}>Company (optional)</label>
                <input type="text" value={form.company} onChange={set('company')} className="w-full px-3 py-2.5 text-[14px]" style={{ border: `1px solid ${HAIRLINE}`, background: CREAM }} data-testid="first-pull-company" />
              </div>
              <label className="flex items-start gap-2.5 text-[13px] leading-[1.55] cursor-pointer" style={{ ...serif, color: INK_SOFT }}>
                <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-1 flex-shrink-0" data-testid="first-pull-consent" />
                <span>Also send occasional practical safety guidance from GigLine. Unchecked by default. Unsubscribe any time.</span>
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 font-bold px-5 py-3 text-[14px] transition-colors"
                style={{ background: NAVY, color: 'white', ...sans }}
                data-testid="first-pull-submit"
              >
                <Mail size={15} /> Email me this checklist
              </button>
              <p className="text-[11.5px] italic mt-1" style={{ color: INK_MUTED }}>
                Draft state, form is not wired to live delivery. Owner reviews before enabling.
              </p>
            </form>
          </section>
        ) : (
          <section
            className="p-6 md:p-7 mb-10"
            style={{ background: 'white', border: `1px solid ${GOLD}`, borderRadius: '3px' }}
            data-testid="first-pull-confirmation"
          >
            <CheckCircle2 size={28} style={{ color: GOLD }} />
            <p className="uppercase font-bold tracking-[0.22em] mt-3 mb-1" style={{ ...mono, fontSize: '11px', color: NAVY }}>
              Requested (draft)
            </p>
            <p className="text-[14.5px] leading-[1.65]" style={{ color: INK_SOFT, ...serif }}>
              In a live send, GigLine would email the {checklist.program} First-Pull Checklist to <strong>{form.email}</strong> within a few minutes. {form.consent ? 'You opted into occasional practical safety guidance from GigLine. You can unsubscribe at any time.' : 'You did NOT opt into follow-up guidance. You will only receive this one delivery email.'}
            </p>
          </section>
        )}

        <div
          className="p-5 mb-10"
          style={{ background: 'rgba(201,168,76,0.08)', border: `1px solid rgba(201,168,76,0.35)`, borderRadius: '3px' }}
          data-testid="first-pull-disclaimer"
        >
          <p className="uppercase font-bold tracking-[0.22em] mb-2" style={{ ...mono, fontSize: '9.5px', color: NAVY }}>
            About this checklist
          </p>
          <p className="text-[12.5px] leading-[1.65] italic" style={{ ...serif, color: INK_SOFT }}>
            {checklist.disclaimer}
          </p>
        </div>

        {/* Appropriate next step, no fear-heavy framing */}
        <div className="mb-10" data-testid="first-pull-next-step">
          <p
            className="uppercase font-bold tracking-[0.22em] mb-3"
            style={{ ...mono, fontSize: '10.5px', color: GOLD }}
          >
            If several items are gaps
          </p>
          <p className="text-[15px] leading-[1.72] mb-4 max-w-2xl" style={{ ...serif, color: INK_SOFT }}>
            The reasonable next step is an OSHA Documentation Readiness Review ($1,700), a Compliance Readiness Visit ($2,500, walkthrough plus doc review, saves $500 vs. purchasing them separately), or the Compliance Control System kit that maps to this program.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/services/documentation-readiness-review"
              className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px] transition-colors"
              style={{ background: NAVY, color: 'white', ...sans }}
              data-testid="first-pull-cta-doc-review"
            >
              Documentation Readiness Review
            </Link>
            <Link
              to="/services/compliance-readiness-visit"
              className="inline-flex items-center gap-2 font-bold py-2.5 px-5 text-[13px] transition-colors"
              style={{ border: `1px solid ${NAVY}`, color: NAVY, ...sans }}
              data-testid="first-pull-cta-crv"
            >
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
