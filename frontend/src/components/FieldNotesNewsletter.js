import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * Field Notes — Monthly newsletter capture.
 * Soft list-builder (doesn't compete with /walkthrough or /request-walkthrough).
 * One promise: one topic a month, no spam, reply anytime.
 */
const FieldNotesNewsletter = ({ source = 'field-notes' }) => {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source, website }),
      });
      if (!res.ok) throw new Error('Subscribe failed');
      const data = await res.json();
      if (data.status === 'already_subscribed') {
        setAlreadySubscribed(true);
      }
      setSuccess(true);
    } catch (err) {
      setError("Couldn't subscribe right now. Please try again, or email vince@giglinecompliance.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="my-12 md:my-16"
      data-testid="field-notes-newsletter"
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: '#2A52A0',
          border: '1px solid rgba(31,111,235,0.25)',
        }}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* LEFT — copy */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <p
              className="uppercase tracking-[3px] text-[#2A52A0] mb-3 font-bold"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              Field Notes Monthly
            </p>
            <h3 className="text-2xl md:text-[28px] font-bold text-white leading-tight mb-3">
              One topic a month.<br className="hidden md:block" /> No spam.
            </h3>
            <p className="text-white/65 text-base md:text-[15px] leading-relaxed">
              Real safety topics from real walkthroughs &mdash; the CFR, the citation, the fix. Written by Vince. Reply anytime.
            </p>
          </div>

          {/* RIGHT — form */}
          <div
            className="p-8 md:p-10 flex flex-col justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderLeft: '1px solid rgba(31,111,235,0.15)' }}
          >
            {success ? (
              <div className="text-center" data-testid="newsletter-success">
                <span
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
                  style={{ backgroundColor: '#2A52A0' }}
                >
                  <Check size={22} color="#fff" strokeWidth={3} />
                </span>
                <p className="text-white font-bold text-lg mb-1">
                  {alreadySubscribed ? "You're already on the list." : 'You\u2019re in.'}
                </p>
                <p className="text-white/55 text-sm">
                  {alreadySubscribed
                    ? 'Next Field Note will land in your inbox.'
                    : 'First Field Note will land in your inbox at the start of next month.'}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate data-testid="newsletter-form" className="w-full">
                <label
                  className="block uppercase tracking-[0.18em] font-bold text-white/55 mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}
                  htmlFor="newsletter-email"
                >
                  Your work email
                </label>
                <div className="relative mb-3">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
                  />
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3.5 bg-white/[0.05] border border-white/15 rounded focus:outline-none focus:border-[#2A52A0] focus:bg-white/[0.08] text-white placeholder-white/30 text-[15px] transition-colors"
                    data-testid="newsletter-email-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !email.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] disabled:opacity-50 text-white font-bold px-5 py-3.5 rounded transition-colors whitespace-nowrap shadow-lg shadow-[#2A52A0]/20"
                  data-testid="newsletter-submit"
                >
                  {submitting ? 'Sending\u2026' : 'Subscribe'}
                  {!submitting && <ArrowRight size={16} />}
                </button>

                {/* Honeypot — off-screen */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label>
                    Website
                    <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </label>
                </div>

                {error && (
                  <p className="text-rose-400 text-sm mt-3" data-testid="newsletter-error">{error}</p>
                )}
                <p className="text-white/40 text-xs mt-3 italic">
                  Unsubscribe with one click. Your email isn&rsquo;t shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldNotesNewsletter;
