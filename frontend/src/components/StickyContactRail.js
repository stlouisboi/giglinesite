import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, X, Plus } from 'lucide-react';
import { trackPhoneClick } from '../utils/analytics';

/**
 * StickyContactRail
 * ─────────────────
 * Floating right-edge contact rail. Three actions: Call, Text, Email.
 * Collapsed by default on mobile (single "+" bubble that expands).
 * Always expanded on desktop.
 * Hidden on /admin/* and /intake to avoid overlap with forms.
 */
const NAVY = '#102A43';
const GOLD = '#C9A84C';
const PHONE = '3363298899';
const PHONE_DISPLAY = '(336) 329-8899';
const EMAIL = 'vince@giglinecompliance.com';

const StickyContactRail = () => {
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide on admin/intake so the rail never overlaps a form field
  useEffect(() => {
    const check = () => {
      const p = window.location.pathname || '';
      setHidden(p.startsWith('/admin') || p.startsWith('/intake') || p.startsWith('/status') || p.startsWith('/report'));
    };
    check();
    window.addEventListener('popstate', check);
    // React Router uses history.pushState; listen for both
    const orig = window.history.pushState;
    window.history.pushState = function () {
      orig.apply(this, arguments);
      check();
    };
    return () => {
      window.removeEventListener('popstate', check);
      window.history.pushState = orig;
    };
  }, []);

  if (hidden) return null;

  const Action = ({ href, label, testId, source, Icon }) => (
    <a
      href={href}
      onClick={() => source && trackPhoneClick && trackPhoneClick(source)}
      className="group flex items-center gap-3 rounded-full shadow-lg transition-transform hover:-translate-x-0.5"
      style={{
        background: NAVY,
        color: 'white',
        padding: '12px',
        border: `2px solid ${GOLD}`,
        textDecoration: 'none',
        minWidth: '48px',
        minHeight: '48px',
      }}
      data-testid={testId}
      aria-label={label}
      title={label}
    >
      <Icon size={20} strokeWidth={2.2} style={{ flexShrink: 0 }} />
      <span
        className="hidden md:block whitespace-nowrap text-sm font-semibold w-0 pr-0 group-hover:w-auto group-hover:pr-2 overflow-hidden transition-all"
        style={{ transitionDuration: '260ms' }}
      >
        {label}
      </span>
    </a>
  );

  return (
    <>
      {/* Desktop + Tablet: always-visible vertical rail on the right edge */}
      <div
        className="hidden md:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
        data-testid="sticky-contact-rail"
        aria-label="Contact GigLine"
      >
        <Action
          href={`tel:${PHONE}`}
          label={`Call ${PHONE_DISPLAY}`}
          testId="rail-call"
          source="rail_call"
          Icon={Phone}
        />
        <Action
          href={`sms:${PHONE}`}
          label="Text Us"
          testId="rail-text"
          source="rail_text"
          Icon={MessageSquare}
        />
        <Action
          href={`mailto:${EMAIL}?subject=GigLine%20Inquiry`}
          label="Email Vince"
          testId="rail-email"
          Icon={Mail}
        />
      </div>

      {/* Mobile: single collapsed FAB in bottom-right that opens the 3 actions upward */}
      <div
        className="md:hidden fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3"
        data-testid="sticky-contact-rail-mobile"
      >
        {expanded && (
          <>
            <a
              href={`tel:${PHONE}`}
              onClick={() => trackPhoneClick && trackPhoneClick('rail_call_mobile')}
              className="flex items-center justify-center rounded-full shadow-lg"
              style={{ background: NAVY, color: 'white', width: '48px', height: '48px', border: `2px solid ${GOLD}` }}
              data-testid="rail-call-mobile"
              aria-label={`Call ${PHONE_DISPLAY}`}
            >
              <Phone size={20} strokeWidth={2.2} />
            </a>
            <a
              href={`sms:${PHONE}`}
              onClick={() => trackPhoneClick && trackPhoneClick('rail_text_mobile')}
              className="flex items-center justify-center rounded-full shadow-lg"
              style={{ background: NAVY, color: 'white', width: '48px', height: '48px', border: `2px solid ${GOLD}` }}
              data-testid="rail-text-mobile"
              aria-label="Text Us"
            >
              <MessageSquare size={20} strokeWidth={2.2} />
            </a>
            <a
              href={`mailto:${EMAIL}?subject=GigLine%20Inquiry`}
              className="flex items-center justify-center rounded-full shadow-lg"
              style={{ background: NAVY, color: 'white', width: '48px', height: '48px', border: `2px solid ${GOLD}` }}
              data-testid="rail-email-mobile"
              aria-label="Email Vince"
            >
              <Mail size={20} strokeWidth={2.2} />
            </a>
          </>
        )}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="flex items-center justify-center rounded-full shadow-xl transition-transform"
          style={{
            background: GOLD,
            color: NAVY,
            width: '56px',
            height: '56px',
            border: 'none',
            transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 220ms',
          }}
          data-testid="rail-toggle-mobile"
          aria-label={expanded ? 'Close contact options' : 'Open contact options'}
          aria-expanded={expanded}
        >
          {expanded ? <X size={24} strokeWidth={2.4} /> : <Plus size={24} strokeWidth={2.4} />}
        </button>
      </div>
    </>
  );
};

export default StickyContactRail;
