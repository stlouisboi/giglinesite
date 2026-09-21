/**
 * Machine Guarding printable-checklist lead-magnet form.
 *
 * Mirrors the First-Pull accessible-form shape with LIVE Resend delivery
 * wired through the /api/machine-guarding-checklist/submit endpoint:
 *   - accessible labels with for/id, autocomplete, aria-describedby
 *   - honeypot input absolutely off-screen AND aria-hidden AND tabIndex=-1
 *   - unchecked marketing consent by default
 *   - POSTs to backend which stores the lead, sends the branded PDF via
 *     Resend, alerts Vince, and (when consent is on) enrols in MailerLite
 *
 * Gated behind `MG_LEAD_MAGNET_ENABLED` in features.js. When the flag is off,
 * the component renders null so nothing appears in production.
 *
 * The "Download PDF" button on the confirmation state hits the same backend
 * PDF endpoint so visitors can grab the checklist immediately even if the
 * email takes a minute (or their inbox filters it).
 */
import React, { useRef, useState } from 'react';
import { CheckCircle2, Mail, FileDown, Loader2 } from 'lucide-react';
import { MG_LEAD_MAGNET_ENABLED } from '../config/features';

const API = process.env.REACT_APP_BACKEND_URL;
const SUBMIT_ENDPOINT = `${API}/api/machine-guarding-checklist/submit`;
const PDF_ENDPOINT = `${API}/api/machine-guarding-checklist/pdf`;

const MachineGuardingLeadMagnet = () => {
  const [form, setForm] = useState({ firstName: '', email: '', company: '', consent: false, website: '' });
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const firstNameRef = useRef(null);
  const emailRef = useRef(null);

  if (!MG_LEAD_MAGNET_ENABLED) return null;

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim()) { firstNameRef.current && firstNameRef.current.focus(); return; }
    if (!form.email.trim())     { emailRef.current && emailRef.current.focus(); return; }
    if (form.website) return; // honeypot triggered, silently drop
    setPending(true);
    setError(null);
    try {
      const resp = await fetch(SUBMIT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.firstName.trim(),
          email: form.email.trim(),
          company: (form.company || '').trim(),
          marketing_consent: !!form.consent,
          website: form.website || '',
        }),
      });
      if (!resp.ok) throw new Error(`status ${resp.status}`);
      setSubmitted(true);
    } catch (err) {
      setError('We had trouble sending. Please try again in a moment, or grab the PDF directly.');
    } finally {
      setPending(false);
    }
  };

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.open(PDF_ENDPOINT, '_blank', 'noopener');
    }
  };

  return (
    <section
      className="py-12 md:py-16 border-b border-[#2A52A0]/10 no-print"
      data-testid="mg-lead-magnet"
    >
      <div className="container max-w-3xl">
        {!submitted ? (
          <div className="p-6 md:p-8 bg-white border border-[#2A52A0]/15 rounded-lg">
            <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              OPTIONAL, EMAIL ME THE PRINTABLE PDF
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-3" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Send the printable version to my inbox
            </h2>
            <p id="mg-lead-magnet-help" className="text-sm text-[#1C2B2B]/60 leading-relaxed mb-6">
              You can print or save this page as a PDF right now with the Print button above. If you would like a copy emailed for a supervisor or a binder, share your work email below. Draft state, form is not wired to live delivery.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-testid="mg-lead-magnet-form"
              aria-describedby="mg-lead-magnet-help"
              noValidate
            >
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={set('website')}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mg-first-name" className="block text-[11px] uppercase tracking-widest font-bold text-[#102A43] mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    First name
                  </label>
                  <input
                    id="mg-first-name"
                    ref={firstNameRef}
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    onChange={set('firstName')}
                    className="w-full px-3 py-2.5 text-sm bg-[#F9F8F6] border border-[#2A52A0]/15 rounded focus:outline-none focus:border-[#2A52A0]"
                    data-testid="mg-lead-magnet-firstname"
                  />
                </div>
                <div>
                  <label htmlFor="mg-email" className="block text-[11px] uppercase tracking-widest font-bold text-[#102A43] mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Work email
                  </label>
                  <input
                    id="mg-email"
                    ref={emailRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    className="w-full px-3 py-2.5 text-sm bg-[#F9F8F6] border border-[#2A52A0]/15 rounded focus:outline-none focus:border-[#2A52A0]"
                    data-testid="mg-lead-magnet-email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mg-company" className="block text-[11px] uppercase tracking-widest font-bold text-[#102A43] mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Company (optional)
                </label>
                <input
                  id="mg-company"
                  type="text"
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={set('company')}
                  className="w-full px-3 py-2.5 text-sm bg-[#F9F8F6] border border-[#2A52A0]/15 rounded focus:outline-none focus:border-[#2A52A0]"
                  data-testid="mg-lead-magnet-company"
                />
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  id="mg-consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={set('consent')}
                  className="mt-1 h-4 w-4 flex-shrink-0 accent-[#2A52A0] cursor-pointer"
                  data-testid="mg-lead-magnet-consent"
                />
                <label htmlFor="mg-consent" className="text-[13px] leading-snug text-[#1C2B2B]/70 cursor-pointer">
                  Also send occasional practical safety guidance from GigLine. Unchecked by default. Unsubscribe any time.
                </label>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="mg-lead-magnet-submit"
              >
                {pending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                {pending ? 'Sending...' : 'Email me this checklist'}
              </button>
              {error && (
                <p role="alert" className="text-sm text-[#8A1F1F] mt-2" data-testid="mg-lead-magnet-error">
                  {error}
                </p>
              )}
            </form>
          </div>
        ) : (
          <div
            className="p-6 md:p-8 bg-white border-2 border-[#C9A84C] rounded-lg"
            data-testid="mg-lead-magnet-confirmation"
            aria-live="polite"
          >
            <CheckCircle2 size={28} className="text-[#C9A84C]" aria-hidden="true" />
            <p className="text-xs font-semibold tracking-widest text-[#102A43] uppercase mt-3 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              CHECK YOUR INBOX
            </p>
            <p className="text-sm leading-relaxed text-[#1C2B2B]/70 mb-5">
              We just emailed the Machine Guarding printable checklist to <strong className="text-[#1C2B2B]">{form.email}</strong>. It should arrive within a few minutes. If you do not see it, check your spam or promotions tab. {form.consent
                ? 'You also opted into occasional practical safety guidance from GigLine.'
                : 'You requested this resource. You are not subscribed to ongoing marketing emails.'}
            </p>
            <p className="text-sm text-[#1C2B2B]/60 mb-4">Or grab the PDF right now:</p>
            <button
              type="button"
              onClick={handleDownload}
              data-testid="mg-lead-magnet-download"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972C] text-[#102A43] font-bold px-6 py-3 rounded transition-colors"
            >
              <FileDown size={16} /> Download PDF now
            </button>
            <p className="text-[11.5px] italic text-[#1C2B2B]/40 mt-3">
              Opens the branded GigLine checklist PDF in a new tab.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MachineGuardingLeadMagnet;
