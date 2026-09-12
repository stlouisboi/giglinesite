import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import AssessmentSelectorModal from './AssessmentSelectorModal';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

/**
 * StickySelectorBar. Slim bottom bar that surfaces on long service pages
 * after the buyer scrolls past the initial hero, gives them one last hook to
 * open the diagnostic selector. Hides itself while the #intake block is in
 * view (buyer is already at destination) and can be dismissed for the session.
 */
const StickySelectorBar = ({ source = 'sticky-bar', threshold = 500 }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [intakeInView, setIntakeInView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const obsRef = useRef(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('gl_sticky_selector_dismissed') === '1') {
        setDismissed(true);
      }
    } catch (_) { /* private mode etc. */ }

    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const intakeEl = document.getElementById('intake');
    if (intakeEl && 'IntersectionObserver' in window) {
      obsRef.current = new IntersectionObserver(
        (entries) => setIntakeInView(entries[0].isIntersecting),
        // threshold 0 fires on ANY overlap, works even when the intake
        // section is taller than the viewport (a fractional ratio would
        // never reach 15% in that case).
        { threshold: 0, rootMargin: '0px 0px -80px 0px' }
      );
      obsRef.current.observe(intakeEl);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (obsRef.current) obsRef.current.disconnect();
    };
  }, [threshold]);

  const show = visible && !dismissed && !intakeInView && !modalOpen;

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem('gl_sticky_selector_dismissed', '1'); } catch (_) {}
  };

  return (
    <>
      <div
        aria-hidden={!show}
        data-testid="sticky-selector-bar"
        data-visible={show ? 'true' : 'false'}
        className="fixed left-0 right-0 bottom-0 z-40"
        style={{
          transform: show ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)',
          background: NAVY,
          borderTop: `1px solid ${GOLD}`,
          boxShadow: '0 -8px 24px rgba(10,22,40,0.28)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 pr-14 sm:pr-6">
          <div className="flex-1 min-w-0">
            <p
              className="uppercase font-bold mb-0.5 truncate hidden sm:block"
              style={{ ...mono, fontSize: '9.5px', letterSpacing: '0.22em', color: GOLD }}
            >
              Not sure this is the right assessment?
            </p>
            <p className="text-[12px] sm:text-[13.5px] text-white leading-[1.3] font-semibold sm:font-normal sm:text-white/85 truncate">
              <span className="hidden sm:inline">Find your starting point with three floor-level questions.</span>
              <span className="sm:hidden">Not sure? Find your starting point.</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 sm:gap-2 font-bold py-2 px-3 sm:py-2.5 sm:px-4 whitespace-nowrap"
            style={{ background: GOLD, color: NAVY, fontFamily: "'Manrope', sans-serif", fontSize: '12px' }}
            data-testid="sticky-selector-cta"
          >
            <span className="hidden sm:inline">Find My Assessment</span>
            <span className="sm:hidden">Diagnose</span>
            <ArrowRight size={12} />
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss selector bar"
            className="flex-shrink-0 p-1.5 text-white/55 hover:text-white transition-colors"
            data-testid="sticky-selector-dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>
      <AssessmentSelectorModal open={modalOpen} onClose={() => setModalOpen(false)} source={source} />
    </>
  );
};

export default StickySelectorBar;
