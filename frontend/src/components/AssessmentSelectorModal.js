/**
 * Accessible modal wrapper for AssessmentSelector.
 * Focus trap: focuses the close button on open, Esc closes, body scroll locks.
 * Reuses the shared selector, so every service page and the homepage open the
 * same experience.
 */
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import AssessmentSelector from './AssessmentSelector';

const NAVY = '#102A43';
const CREAM = '#FAF7F1';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const AssessmentSelectorModal = ({ open, onClose, source }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Find the right GigLine assessment"
      data-testid="assessment-selector-modal"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,22,40,0.62)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto', padding: '32px 12px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: CREAM, width: '100%', maxWidth: 900,
          borderRadius: 4, position: 'relative',
          boxShadow: '0 24px 48px rgba(10,22,40,0.28)',
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close assessment selector"
          data-testid="assessment-selector-modal-close"
          className="inline-flex items-center gap-2 absolute focus:outline-none"
          style={{
            top: 12, right: 12, ...mono, fontSize: '11.5px',
            color: NAVY, letterSpacing: '0.14em',
            padding: '6px 10px', background: 'white', border: `1px solid rgba(10,22,40,0.12)`,
          }}
        >
          CLOSE <X size={13} />
        </button>
        <div style={{ padding: '48px 20px 32px' }}>
          <AssessmentSelector source={source} embedded />
        </div>
      </div>
    </div>
  );
};

export default AssessmentSelectorModal;
