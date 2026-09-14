/**
 * SafetyCheckActionPlanPreview, Phase 2 Batch 2B, Checkpoint 2 (Feb 2026).
 *
 * Non-transmitting preview of the "Email my action plan" flow. Renders
 * after the Safety Check result. No fetch, no transactional-email SDK
 * import. Marketing consent is a separate unchecked checkbox that does
 * not gate the delivery preview.
 *
 * Gated behind RECOMMENDATION_ROUTER_ENABLED so the preview only surfaces
 * to owner review; production Safety Check keeps its current behavior.
 */
import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { RECOMMENDATION_ROUTER_ENABLED, EMAIL_DELIVERY_LIVE } from '../config/features';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SafetyCheckActionPlanPreview = ({ tier, noCount, recommendation, source = 'safety-check' }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!RECOMMENDATION_ROUTER_ENABLED || !EMAIL_DELIVERY_LIVE) return null;

  const disabled = !firstName.trim() || !email.trim();

  const onSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    // Preview only. No fetch, no API, no delivery claim.
    setSubmitted(true);
  };

  return (
    <section
      className="mt-8 p-5 md:p-6"
      style={{ background: 'white', border: `1px solid ${GOLD}`, color: NAVY }}
      data-testid={`safety-check-action-plan-${source}`}
    >
      <p
        className="uppercase font-bold tracking-[0.24em] mb-2"
        style={{ color: GOLD, ...mono, fontSize: '10.5px' }}
      >
        Preview only, decision support
      </p>
      <h3
        className="font-bold text-[18px] md:text-[20px] mb-3"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        Want the action plan in writing?
      </h3>
      <p className="text-[14px] leading-[1.65] mb-4" style={{ color: INK_MUTED }}>
        The result above stays visible without an email. This optional preview
        shows what a written action-plan email would contain, once GigLine's
        transactional email pipeline is turned on in a later batch. Nothing is
        transmitted in this preview.
      </p>

      {!expanded && !submitted && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center gap-2 font-bold px-4 py-2.5 text-[13.5px]"
          style={{ background: NAVY, color: 'white' }}
          data-testid="safety-check-action-plan-open"
        >
          <Mail size={14} />
          Show the email preview
        </button>
      )}

      {expanded && !submitted && (
        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-2"
          data-testid="safety-check-action-plan-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="block mb-1.5 text-[12.5px] font-bold uppercase tracking-[0.16em]" style={{ ...mono }}>
                First name
              </span>
              <input
                id="sc-ap-firstname"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2.5 text-[15px]"
                style={{ border: `1px solid ${HAIRLINE}` }}
                data-testid="safety-check-action-plan-firstname"
              />
            </label>
            <label className="block">
              <span className="block mb-1.5 text-[12.5px] font-bold uppercase tracking-[0.16em]" style={{ ...mono }}>
                Work email
              </span>
              <input
                id="sc-ap-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-[15px]"
                style={{ border: `1px solid ${HAIRLINE}` }}
                data-testid="safety-check-action-plan-email"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="block mb-1.5 text-[12.5px] font-bold uppercase tracking-[0.16em]" style={{ ...mono, color: INK_MUTED }}>
                Company, optional
              </span>
              <input
                id="sc-ap-company"
                type="text"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2.5 text-[15px]"
                style={{ border: `1px solid ${HAIRLINE}` }}
                data-testid="safety-check-action-plan-company"
              />
            </label>
          </div>
          <label className="mt-4 flex items-start gap-3" htmlFor="sc-ap-marketing">
            <input
              id="sc-ap-marketing"
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              style={{ marginTop: 3 }}
              data-testid="safety-check-action-plan-marketing"
            />
            <span className="text-[13.5px] leading-[1.6]" style={{ color: INK_MUTED }}>
              Also send occasional practical safety guidance from GigLine.{' '}
              Unchecked by default. Unsubscribe any time.
            </span>
          </label>
          <button
            type="submit"
            disabled={disabled}
            className="mt-5 inline-flex items-center gap-2 font-bold px-5 py-2.5 text-[14px]"
            style={{
              background: NAVY,
              color: 'white',
              opacity: disabled ? 0.4 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            data-testid="safety-check-action-plan-submit"
          >
            Generate preview
            <ArrowRight size={14} />
          </button>
        </form>
      )}

      {submitted && (
        <div
          className="mt-2 p-4"
          style={{ background: '#FAF7F1', border: `1px solid ${HAIRLINE}` }}
          data-testid="safety-check-action-plan-confirmation"
        >
          <p className="text-[14px] font-bold uppercase tracking-[0.22em] mb-2" style={{ color: GOLD, ...mono, fontSize: '10.5px' }}>
            Preview only, no email was sent
          </p>
          <p className="text-[14px] leading-[1.65]" style={{ color: INK_MUTED }}>
            The action-plan email has not been transmitted. GigLine will wire
            the transactional-email pipeline after owner review in a later batch.
          </p>
          <p
            className="mt-3 text-[13px] leading-[1.6]"
            style={{ color: INK_MUTED }}
            data-testid="safety-check-action-plan-consent-status"
          >
            Marketing consent status recorded for preview:{' '}
            <strong style={{ color: NAVY }}>{marketing ? 'opted in' : 'not opted in'}</strong>.
            {marketing
              ? ' Your action plan would be delivered. You would also receive occasional practical safety guidance from GigLine. Unsubscribe at any time.'
              : ' Your action plan would be delivered without adding you to ongoing marketing emails.'}
          </p>
        </div>
      )}
    </section>
  );
};

export default SafetyCheckActionPlanPreview;
