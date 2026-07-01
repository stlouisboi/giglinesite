import React, { useState } from 'react';
import { Send } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * GL-WEB-024 — Simple Contact Form.
 * Fields: name (req), email (req), phone (opt), message (req) + honeypot.
 * Style: matches the intake form's field treatment adapted for a light section.
 * On submit: Resend confirmation to prospect + notification to Vince.
 */
const ContactMessageForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/contact-message/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          website: form.website, // honeypot
        }),
      });
      const data = await res.json();
      setStatus(data && data.success ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const fieldStyle = {
    background: 'white',
    border: '1px solid rgba(28,43,43,0.20)',
  };

  const label = "block text-xs font-semibold tracking-wider uppercase text-[#1C2B2B]/70 mb-1.5";
  const input = "w-full px-4 py-3 rounded-md text-sm text-[#1C2B2B] placeholder:text-[#1C2B2B]/35 focus:outline-none focus:border-[#2A52A0] transition-colors";

  if (status === 'sent') {
    return (
      <div
        className="rounded-lg p-6 md:p-8"
        style={{ background: '#F9F8F6', border: '1px solid rgba(28,43,43,0.10)' }}
        data-testid="contact-message-success"
      >
        <h3
          className="text-xl font-bold text-[#1C2B2B] mb-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Your message has been received.
        </h3>
        <p className="text-[#1C2B2B]/75 leading-relaxed">
          Vince will respond within one business day. For faster response, call or text{' '}
          <a href="tel:3363298899" className="font-semibold text-[#2A52A0] underline underline-offset-4">
            (336) 329-8899
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-6 md:p-8"
      style={{ background: '#F9F8F6', border: '1px solid rgba(28,43,43,0.10)' }}
      data-testid="contact-message-form"
    >
      <p
        className="text-base md:text-[17px] leading-[1.65] text-[#1C2B2B] mb-6"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        Have a question before you&rsquo;re ready for a full intake? Send a message below. Vince responds within one business day.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Honeypot — hidden from users, visible to bots */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
        >
          <label htmlFor="cf-website">Website (leave blank)</label>
          <input
            id="cf-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set('website')}
          />
        </div>

        <div>
          <label className={label} htmlFor="cf-name">Name <span className="text-[#C9A84C]">*</span></label>
          <input
            id="cf-name"
            type="text"
            required
            value={form.name}
            onChange={set('name')}
            placeholder="Your full name"
            className={input}
            style={fieldStyle}
            autoComplete="name"
            data-testid="contact-form-name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="cf-email">Email <span className="text-[#C9A84C]">*</span></label>
            <input
              id="cf-email"
              type="email"
              required
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              className={input}
              style={fieldStyle}
              autoComplete="email"
              data-testid="contact-form-email"
            />
          </div>
          <div>
            <label className={label} htmlFor="cf-phone">Phone <span className="text-[#1C2B2B]/40 font-normal normal-case text-[10px]">(optional)</span></label>
            <input
              id="cf-phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="(336) 555-1234"
              className={input}
              style={fieldStyle}
              autoComplete="tel"
              data-testid="contact-form-phone"
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="cf-message">Message <span className="text-[#C9A84C]">*</span></label>
          <textarea
            id="cf-message"
            required
            rows={5}
            value={form.message}
            onChange={set('message')}
            placeholder="Tell Vince what you're dealing with — a question, a concern, an upcoming audit, an incident, whatever it is."
            className={`${input} resize-none`}
            style={fieldStyle}
            data-testid="contact-form-message"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex items-center justify-center gap-2 bg-[#102A43] hover:bg-[#2A52A0] text-white font-semibold px-6 py-3 rounded transition-colors text-sm disabled:opacity-50"
            style={{ border: '1px solid #C9A84C' }}
            data-testid="contact-form-submit"
          >
            {status === 'sending' ? 'Sending…' : (<>Send Message <Send size={15} /></>)}
          </button>
          {status === 'error' && (
            <p className="text-xs text-red-600" data-testid="contact-form-error">
              Something went wrong. Call (336) 329-8899 or email vince@giglinecompliance.com directly.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactMessageForm;
