import React, { useEffect, useState } from 'react';
import { X, Download, CheckCircle2 } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;
const STORAGE_KEY = 'gl_lead_magnet_bar_dismissed';

/**
 * StickyLeadMagnetBar — persistent bottom bar on Field Note pages offering the
 * 10-Minute Pre-Inspection Checklist PDF in exchange for an email. Appears after
 * ~30% page scroll, dismissible (persists via localStorage for 30 days),
 * uses the same MailerLite endpoint as FieldNotesNewsletter so no new API needed.
 */
const StickyLeadMagnetBar = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Date.now() - parseInt(stored, 10) < 30 * 24 * 60 * 60 * 1000) {
      setDismissed(true);
      return;
    }
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && scrolled / total > 0.30) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setDismissed(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`${API}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'field-notes-lead-magnet-bar', lead_magnet: 'lm-001' }),
      });
      if (res.ok) {
        setStatus('success');
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
        setTimeout(() => setDismissed(true), 4000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setBusy(false);
  };

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 shadow-2xl"
      style={{ background: '#102A43', color: 'white', borderTop: '3px solid #C9A84C' }}
      data-testid="sticky-lead-magnet-bar"
    >
      <div className="container max-w-5xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex flex-col md:flex-row items-center gap-3 md:gap-5">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Download size={20} style={{ color: '#C9A84C' }} className="flex-shrink-0" aria-hidden />
          <div className="min-w-0">
            <p className="font-bold text-[14.5px] md:text-[15.5px] leading-tight">
              Get the 10-Minute Pre-Inspection Checklist
            </p>
            <p className="text-[12.5px] md:text-[13px] text-white/65 leading-tight mt-0.5">
              What OSHA looks at first — free PDF, one-time email required.
            </p>
          </div>
        </div>
        {status === 'success' ? (
          <p className="flex items-center gap-2 text-[14px] font-bold" style={{ color: '#C9A84C' }} data-testid="sticky-lm-success">
            <CheckCircle2 size={16} />
            Check your inbox — PDF is on the way.
          </p>
        ) : (
          <form onSubmit={submit} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 md:w-64 px-3 py-2 text-[14px] rounded"
              style={{ background: 'white', color: '#102A43' }}
              data-testid="sticky-lm-email"
            />
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 font-bold text-[13.5px] rounded whitespace-nowrap disabled:opacity-60"
              style={{ background: '#C9A84C', color: '#102A43' }}
              data-testid="sticky-lm-submit"
            >
              {busy ? '…' : 'Send it'}
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="p-1.5 rounded text-white/50 hover:text-white transition-colors"
          aria-label="Dismiss"
          data-testid="sticky-lm-dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default StickyLeadMagnetBar;
