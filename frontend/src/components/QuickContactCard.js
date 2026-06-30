import React, { useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Low-friction 2-field micro-form — name + contact (email OR phone) + optional note.
 * Designed as a "Just want to talk first?" alternative to the full 7-section intake.
 */
const QuickContactCard = ({ variant = 'light' }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const isDark = variant === 'dark';
  const bg = isDark ? 'rgba(255,255,255,0.04)' : '#F9F8F6';
  const border = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(28,43,43,0.10)';
  const textPrimary = isDark ? 'white' : '#1C2B2B';
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(28,43,43,0.65)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(28,43,43,0.20)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'white';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/quick-contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (data && data.success) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      className="rounded-lg p-6 md:p-7"
      style={{ background: bg, border: `1px solid ${border}` }}
      data-testid="quick-contact-card"
    >
      <div className="flex items-start gap-3 mb-3">
        <MessageCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#2A52A0' }} />
        <div>
          <h3 className="text-lg font-bold leading-tight" style={{ color: textPrimary, fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Just want to talk first?
          </h3>
          <p className="text-sm mt-1" style={{ color: textMuted }}>
            Skip the full intake. Drop your name and how to reach you &mdash; Vince will respond within 24 hours.
          </p>
        </div>
      </div>

      {status === 'sent' ? (
        <p className="text-sm mt-4" style={{ color: textMuted }} data-testid="quick-contact-success">
          Got it. Vince will reach out within 24 hours.
        </p>
      ) : (
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2A52A0]"
            style={{ background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}` }}
            data-testid="quick-contact-name"
            autoComplete="name"
          />
          <input
            type="text"
            placeholder="Email or phone — whichever you prefer"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-3 py-2.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2A52A0]"
            style={{ background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}` }}
            data-testid="quick-contact-contact"
            autoComplete="email"
          />
          <input
            type="text"
            placeholder="One line about what you're dealing with (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2A52A0]"
            style={{ background: inputBg, color: textPrimary, border: `1px solid ${inputBorder}` }}
            data-testid="quick-contact-message"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center justify-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm disabled:opacity-50"
            data-testid="quick-contact-submit"
          >
            {status === 'sending' ? 'Sending…' : (<>Send <ArrowRight size={14} /></>)}
          </button>
          {status === 'error' && (
            <p className="text-xs text-red-500 mt-1" data-testid="quick-contact-error">
              Something went wrong. Call (336) 329-8899 or email vince@giglinecompliance.com directly.
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default QuickContactCard;
