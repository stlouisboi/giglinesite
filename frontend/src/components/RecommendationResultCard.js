/**
 * RecommendationResultCard, Phase 2 Batch 2B (Feb 2026).
 *
 * Uniform result-card structure used everywhere the recommendation engine
 * surfaces a result. Never renders a purchase CTA for a coming-soon kit,
 * only a waitlist join.
 *
 * Privacy contract:
 *   - Answer codes come in via `result.handoff.sessionPayload`. When the
 *     buyer continues to intake, this component writes that payload into
 *     `sessionStorage` under `result.handoff.sessionKey`, then navigates
 *     to the intake URL using ONLY the safe query string
 *     `result.handoff.urlQuery`.
 *   - The card must remain visible at all times without an email address.
 *
 * Email contract:
 *   - "Email my recommendation" opens a preview-only form. On submit, the
 *     form displays a "Preview only. No email was sent." confirmation.
 *     No fetch, no transactional-email API call. Marketing consent is a
 *     separate unchecked checkbox and does not gate the delivery preview.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Mail, RefreshCw, ChevronRight, Share2 } from 'lucide-react';
import { RESULT_KIND } from '../data/recommendationEngine';
import { writeHandoffToSession } from '../lib/recommendationHandoff';
import { EMAIL_DELIVERY_LIVE } from '../config/features';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK = '#0A1628';
const INK_SOFT = 'rgba(10,22,40,0.72)';
const INK_MUTED = 'rgba(10,22,40,0.55)';
const HAIRLINE = 'rgba(10,22,40,0.14)';
const CREAM = '#FAF7F1';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const sans = { fontFamily: "'Manrope', sans-serif" };

// ──────────────────────────────────────────────────────────────
// Re-export so existing importers keep working.
// ──────────────────────────────────────────────────────────────
export { writeHandoffToSession };

// ──────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────
const Kicker = ({ children, testid }) => (
  <p
    className="uppercase font-bold mb-3"
    style={{ color: GOLD, letterSpacing: '0.28em', fontSize: '10.5px', ...mono }}
    data-testid={testid}
  >
    {children}
  </p>
);

const PriceBadge = ({ price, testid }) =>
  price ? (
    <span
      className="inline-block font-bold px-2.5 py-1"
      style={{
        color: NAVY,
        background: 'rgba(201,168,76,0.14)',
        border: `1px solid ${GOLD}`,
        fontSize: '12.5px',
        ...mono,
      }}
      data-testid={testid}
    >
      {price.label || price.displayPrice}
    </span>
  ) : (
    <span
      className="inline-block font-bold px-2.5 py-1"
      style={{
        color: NAVY,
        background: 'rgba(10,22,40,0.06)',
        border: `1px solid ${HAIRLINE}`,
        fontSize: '12.5px',
        ...mono,
      }}
      data-testid={testid}
    >
      Not currently available
    </span>
  );

const List = ({ items, testid, muted }) => (
  <ul className="space-y-1.5" data-testid={testid}>
    {items.map((line, i) => (
      <li
        key={i}
        className="flex items-start gap-2 text-[14.5px] md:text-[15px] leading-[1.6]"
        style={{ color: muted ? INK_MUTED : INK_SOFT }}
      >
        <span
          aria-hidden="true"
          className="mt-1.5 flex-shrink-0"
          style={{
            width: 5,
            height: 5,
            background: muted ? INK_MUTED : GOLD,
            borderRadius: 999,
          }}
        />
        <span>{line}</span>
      </li>
    ))}
  </ul>
);

// ──────────────────────────────────────────────────────────────
// Email My Recommendation, preview only. No fetch, no email.
// ──────────────────────────────────────────────────────────────
const EmailPreviewForm = ({ result }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const disabled = !firstName.trim() || !email.trim();

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (disabled) {
        setError('First name and work email are required to generate the preview.');
        return;
      }
      // Explicit non-transmission: this is a preview only. Do NOT call
      // any transactional-email API here. The card cannot imply
      // delivery until Batch 2C wiring is separately approved.
      setError('');
      setSubmitted(true);
    },
    [disabled],
  );

  if (submitted) {
    return (
      <div
        className="p-5 md:p-6 mt-6"
        style={{ background: CREAM, border: `1px solid ${GOLD}` }}
        data-testid="rr-email-preview-confirmation"
      >
        <Kicker testid="rr-email-preview-confirmation-kicker">
          Preview only, no email was sent
        </Kicker>
        <p className="text-[15px] md:text-base leading-[1.7]" style={{ color: INK_SOFT }}>
          The requested delivery has not been transmitted. GigLine will connect the
          transactional-email pipeline after owner review in a later batch.
        </p>
        <p
          className="mt-4 text-[13px] md:text-[14px] leading-[1.7]"
          style={{ color: INK_MUTED }}
          data-testid="rr-email-preview-consent-status"
        >
          Marketing consent status recorded for preview:{' '}
          <strong style={{ color: NAVY }}>{marketing ? 'opted in' : 'not opted in'}</strong>.
          {marketing
            ? ' Your recommendation would be delivered. You would also receive occasional practical safety guidance from GigLine. Unsubscribe at any time.'
            : ' Your recommendation would be delivered without adding you to ongoing marketing emails.'}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-6"
      data-testid="rr-email-preview-form"
      aria-describedby="rr-email-preview-help"
    >
      <div
        className="p-5 md:p-6"
        style={{ background: 'white', border: `1px solid ${HAIRLINE}` }}
      >
        <Kicker>Optional, email my recommendation</Kicker>
        <p
          id="rr-email-preview-help"
          className="text-[13.5px] leading-[1.65] mb-4"
          style={{ color: INK_MUTED }}
        >
          The recommendation above is already yours. Filling this out generates a
          transactional-email preview only. GigLine is not sending real email in this
          preview.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <span
              className="block mb-1.5 text-[12.5px] font-bold uppercase tracking-[0.16em]"
              style={{ color: INK, ...mono }}
            >
              First name
            </span>
            <input
              id="rr-email-firstname"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2.5 text-[15px]"
              style={{ border: `1px solid ${HAIRLINE}`, background: 'white', color: INK }}
              data-testid="rr-email-preview-firstname"
            />
          </label>
          <label className="block">
            <span
              className="block mb-1.5 text-[12.5px] font-bold uppercase tracking-[0.16em]"
              style={{ color: INK, ...mono }}
            >
              Work email
            </span>
            <input
              id="rr-email-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-[15px]"
              style={{ border: `1px solid ${HAIRLINE}`, background: 'white', color: INK }}
              data-testid="rr-email-preview-email"
            />
          </label>
          <label className="block md:col-span-2">
            <span
              className="block mb-1.5 text-[12.5px] font-bold uppercase tracking-[0.16em]"
              style={{ color: INK_MUTED, ...mono }}
            >
              Company, optional
            </span>
            <input
              id="rr-email-company"
              type="text"
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2.5 text-[15px]"
              style={{ border: `1px solid ${HAIRLINE}`, background: 'white', color: INK }}
              data-testid="rr-email-preview-company"
            />
          </label>
        </div>

        {/* Explicit and separate marketing consent, unchecked by default. */}
        <label
          className="mt-4 flex items-start gap-3 cursor-pointer"
          htmlFor="rr-email-marketing-consent"
        >
          <input
            id="rr-email-marketing-consent"
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            style={{ marginTop: 3 }}
            data-testid="rr-email-preview-marketing-consent"
          />
          <span className="text-[13.5px] leading-[1.6]" style={{ color: INK_SOFT }}>
            Also send occasional practical safety guidance from GigLine.{' '}
            <span style={{ color: INK_MUTED }}>Unchecked by default. Unsubscribe any time.</span>
          </span>
        </label>

        {error && (
          <p
            className="mt-3 text-[13px]"
            style={{ color: '#8B2500' }}
            role="alert"
            data-testid="rr-email-preview-error"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="mt-5 inline-flex items-center gap-2 font-bold px-5 py-2.5 text-[14px] transition-opacity"
          style={{
            background: NAVY,
            color: 'white',
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          data-testid="rr-email-preview-submit"
        >
          Generate preview
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
};

// ──────────────────────────────────────────────────────────────
// Main card
// ──────────────────────────────────────────────────────────────
const RecommendationResultCard = ({ result, referringRoute, source, onRestart, shareFragment = '' }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [shareState, setShareState] = useState('idle'); // idle | copied | error

  const isComingSoon = result.kind === RESULT_KIND.KIT_COMING_SOON;

  const shareableUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    // Attach a short attribution ref so Vince can see share-driven traffic
    // when the recipient continues to /intake. The fragment stays client-side.
    return `${origin}/recommendation?ref=share${shareFragment || ''}`;
  }, [shareFragment]);

  const onShareClick = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareableUrl);
      } else {
        // Legacy fallback, execCommand copy
        const ta = document.createElement('textarea');
        ta.value = shareableUrl;
        ta.style.position = 'fixed';
        ta.style.left = '-1000px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2500);
    } catch (e) {
      setShareState('error');
      setTimeout(() => setShareState('idle'), 2500);
    }
  }, [shareableUrl]);

  const onPrimaryClick = useCallback(
    (e) => {
      // Waitlist and kit anchors route via <Link>. For the intake path
      // (service recommendations), write session and follow the safe URL.
      if (result.primaryAction.kind === 'service') {
        writeHandoffToSession(result.handoff);
      }
      // No preventDefault, the Link/anchor handles navigation.
    },
    [result],
  );

  const answersSummary = useMemo(() => {
    const raw = result.handoff && result.handoff.sessionPayload && result.handoff.sessionPayload.answers;
    if (!raw) return [];
    return Object.entries(raw)
      .filter(([k, v]) => typeof v !== 'undefined' && v !== null)
      .map(([k, v]) => ({ key: k, value: String(v) }));
  }, [result]);

  const primaryHref =
    result.primaryAction.kind === 'service'
      ? `${result.primaryAction.href}${result.primaryAction.href.includes('?') ? '&' : '?'}${new URLSearchParams({
          ...(result.handoff.urlParams || {}),
        }).toString()}`
      : result.primaryAction.href;

  return (
    <article
      className="w-full"
      data-testid={`rr-result-card-${result.slug}`}
      data-result-kind={result.kind}
      data-path-id={result.pathId}
      data-source={source || 'router'}
    >
      <div className="mb-1 flex items-center flex-wrap gap-3">
        <Kicker testid="rr-result-kicker">Your recommendation</Kicker>
        <span
          className="uppercase font-bold tracking-[0.16em] px-2 py-0.5"
          style={{
            fontSize: '9.5px',
            color: NAVY,
            background: 'rgba(10,22,40,0.06)',
            border: `1px solid ${HAIRLINE}`,
            ...mono,
          }}
          data-testid="rr-result-path-id"
        >
          Path {result.pathId}
        </span>
      </div>

      <h3
        className="font-bold leading-tight mb-3 text-[26px] md:text-[32px] tracking-tight"
        style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
        data-testid="rr-result-name"
      >
        {result.name}
      </h3>

      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <PriceBadge price={result.price} testid="rr-result-price" />
        {isComingSoon && (
          <span
            className="uppercase font-bold tracking-[0.18em] px-2 py-0.5"
            style={{
              fontSize: '10px',
              color: '#8a6a18',
              background: 'rgba(197,160,89,0.18)',
              border: `1px solid ${GOLD}`,
              ...mono,
            }}
            data-testid="rr-result-coming-soon-badge"
          >
            Not released
          </span>
        )}
      </div>

      <p
        className="text-[15.5px] md:text-[17px] leading-[1.7] mb-6 max-w-3xl"
        style={{ color: INK_SOFT, ...serif }}
        data-testid="rr-result-why"
      >
        {result.why}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" data-testid="rr-result-included-block">
        <div>
          <Kicker>What is included</Kicker>
          <List items={result.included} testid="rr-result-included-list" />
        </div>
        <div>
          <Kicker>What is not included</Kicker>
          <List items={result.notIncluded} testid="rr-result-not-included-list" muted />
        </div>
      </div>

      <div className="mb-6" data-testid="rr-result-next-step-block">
        <Kicker>Expected next step</Kicker>
        <p className="text-[15px] md:text-[16px] leading-[1.7]" style={{ color: INK_SOFT }}>
          {result.nextStep}
        </p>
      </div>

      {result.alternative && (
        <div className="mb-6" data-testid="rr-result-alternative-block">
          <Kicker>One alternative</Kicker>
          <p className="text-[14.5px] md:text-[15.5px] leading-[1.7]" style={{ color: INK_SOFT }}>
            <Link
              to={result.alternative.route}
              className="font-bold underline"
              style={{ color: NAVY }}
              data-testid="rr-result-alternative-link"
            >
              {result.alternative.name}
            </Link>
            {result.alternative.price ? (
              <>
                , <span style={mono}>{result.alternative.price.label || result.alternative.price.displayPrice}</span>
              </>
            ) : null}
          </p>
        </div>
      )}

      {answersSummary.length > 0 && (
        <details className="mb-6" data-testid="rr-result-answers-used">
          <summary
            className="uppercase font-bold cursor-pointer inline-block mb-2"
            style={{ color: INK_MUTED, letterSpacing: '0.2em', fontSize: '10.5px', ...mono }}
          >
            Answers used to reach this recommendation
          </summary>
          <ul className="mt-2 space-y-1 text-[13.5px]" style={{ color: INK_MUTED, ...mono }}>
            {answersSummary.map((a) => (
              <li key={a.key} data-testid={`rr-answer-${a.key}`}>
                <span style={{ color: INK_SOFT }}>{a.key}:</span> {a.value}
              </li>
            ))}
          </ul>
        </details>
      )}

      <p
        className="text-[12.5px] md:text-[13px] italic leading-[1.7] mb-8"
        style={{ color: INK_MUTED }}
        data-testid="rr-result-disclaimer"
      >
        {result.disclaimer}
      </p>

      {/* Actions row: primary + email + restart */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={primaryHref}
            onClick={onPrimaryClick}
            className="inline-flex items-center gap-2 font-bold px-5 py-3 text-[14.5px] md:text-[15px] transition-colors"
            style={{ background: NAVY, color: 'white' }}
            data-testid="rr-result-primary-action"
            data-action-kind={result.primaryAction.kind}
          >
            {result.primaryAction.label}
            <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setShowEmailForm((v) => !v)}
            className="inline-flex items-center gap-2 font-bold px-4 py-3 text-[13.5px] md:text-[14px] transition-colors"
            style={{
              background: 'white',
              color: NAVY,
              border: `1px solid ${GOLD}`,
              display: EMAIL_DELIVERY_LIVE ? 'inline-flex' : 'none',
            }}
            data-testid="rr-result-email-toggle"
            aria-expanded={showEmailForm}
          >
            <Mail size={14} />
            {showEmailForm ? 'Hide the email preview' : 'Email my recommendation'}
          </button>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={onShareClick}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ color: shareState === 'copied' ? '#0f7a52' : NAVY, ...mono }}
            data-testid="rr-result-share"
            aria-live="polite"
          >
            {shareState === 'copied' ? (
              <>
                <Check size={12} aria-hidden="true" />
                Link copied
              </>
            ) : shareState === 'error' ? (
              <>
                <Share2 size={12} aria-hidden="true" />
                Copy failed, try again
              </>
            ) : (
              <>
                <Share2 size={12} aria-hidden="true" />
                Share this recommendation
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.2em] transition-colors"
            style={{ color: INK_MUTED, ...mono }}
            data-testid="rr-result-restart"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Change my answers
          </button>
        </div>
      </div>
      <p
        className="mt-3 text-[11.5px]"
        style={{ color: INK_MUTED, fontStyle: 'italic' }}
        data-testid="rr-result-share-hint"
      >
        The share link recreates this exact recommendation for whoever opens it. Your answers stay in your browser and are not visible to GigLine unless you continue to a request-a-visit form.
      </p>

      {showEmailForm && EMAIL_DELIVERY_LIVE && <EmailPreviewForm result={result} />}
    </article>
  );
};

export default RecommendationResultCard;
