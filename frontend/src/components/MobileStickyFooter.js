import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { trackPhoneClick } from '../utils/analytics';

const MobileStickyFooter = () => {
  const location = useLocation();

  // Don't show on contact page (dedicated contact info) or admin
  const hiddenPaths = ['/contact', '/admin'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(11,31,51,0.98)',
        borderTop: '1px solid rgba(31,111,235,0.35)',
        boxShadow: '0 -6px 20px rgba(0,0,0,0.18)',
      }}
      data-testid="mobile-sticky-cta"
    >
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        {/* Primary — Call */}
        <a
          href="tel:3363298899"
          onClick={() => trackPhoneClick('mobile_sticky_bar')}
          className="flex-grow flex items-center justify-center gap-2 rounded-lg font-bold text-white"
          style={{
            background: '#1a6fc4',
            minHeight: '52px',
            fontSize: '16px',
            letterSpacing: '0.2px',
          }}
          data-testid="sticky-call-btn"
        >
          <Phone size={18} strokeWidth={2.5} />
          Call (336) 329-8899
        </a>

        {/* Secondary — Request a Walkthrough */}
        <Link
          to="/services"
          className="flex-shrink-0 flex items-center justify-center rounded-lg font-semibold"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#F8FAFC',
            minHeight: '52px',
            fontSize: '14px',
            padding: '0 14px',
          }}
          data-testid="sticky-walkthrough-btn"
        >
          Walkthrough
        </Link>
      </div>
    </div>
  );
};

export default MobileStickyFooter;
