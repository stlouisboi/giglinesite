import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

// GL-WEB-024 Addition 2 — Calendly Scope Call CTA block.
// Placeholder URL until Vince completes GL-WEB-022 Calendly Stage 1 setup.
// Once live, swap CALENDLY_SCOPE_CALL_URL to the Stage 1 event-type link.
const CALENDLY_SCOPE_CALL_URL = 'https://calendly.com/vincelaw336/15min-scope-call';

const ScopeCallCTA = () => {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: '#102A43', border: '1px solid #C9A84C' }}
      data-testid="scope-call-cta"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-3 mb-3">
          <Calendar size={22} style={{ color: '#C9A84C' }} className="flex-shrink-0 mt-1" />
          <h3
            className="text-2xl md:text-[26px] font-bold leading-tight"
            style={{ color: '#C9A84C', fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="scope-call-headline"
          >
            Prefer a scheduled call?
          </h3>
        </div>
        <p className="text-white/85 text-[15px] md:text-base leading-[1.65] mb-6 max-w-2xl">
          Book a free 15-minute scope call. Vince will confirm your situation, answer questions, and give you a fixed quote in writing. No obligation.
        </p>
        <a
          href={CALENDLY_SCOPE_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 font-bold text-[#102A43] px-6 py-3 rounded transition-colors text-sm w-full sm:w-auto"
          style={{ background: '#C9A84C', border: '1px solid #C9A84C' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#bf962f')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#C9A84C')}
          data-testid="scope-call-button"
        >
          Book a Scope Call <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
};

export default ScopeCallCTA;
