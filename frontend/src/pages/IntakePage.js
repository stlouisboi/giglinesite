import React, { useState } from 'react';
import { ArrowRight, Check, Calendar } from 'lucide-react';
import { trackWalkthroughRequest } from '../utils/analytics';
import SEO from '../components/SEO';

const CALENDLY_URL = 'https://calendly.com/vincelaw336/safety-consultation';
const API = process.env.REACT_APP_BACKEND_URL;

const IntakePage = () => {
  const [form, setForm] = useState({ name: '', company: '', operation_type: '', location: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [utmParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || '',
    };
  });

  const operationTypes = [
    'Small Manufacturing / Fabrication',
    'Warehouse / Distribution',
    'Contractor / Maintenance',
    'Fleet / Transportation',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/walkthrough/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      trackWalkthroughRequest(form.operation_type);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call (336) 329-8899.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <main>
      <SEO
        title="Request a Safety Walkthrough | GigLine Safety & Compliance"
        description="Request an on-site safety walkthrough for your operation. One visit. Clear findings. No retainer. Written report within 24-48 hours."
        canonical="/request-walkthrough"
      />

      <section className="py-20 md:py-32" style={{ backgroundColor: '#0B1F33' }} data-testid="intake-page">
        <div className="max-w-2xl mx-auto px-6">

          {!submitted ? (
            <>
              {/* Header */}
              <p className="font-mono text-xs tracking-[3px] uppercase text-[#1F6FEB] mb-4" data-testid="intake-label">
                Get Started
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-4" data-testid="intake-headline">
                Request a Safety Walkthrough
              </h1>
              <p className="text-lg text-white/70 mb-3">
                One visit. Clear findings. No retainer.
              </p>
              <p className="text-base text-white/50 mb-10">
                You'll receive a clear report within 24-48 hours after the walkthrough.
              </p>

              {/* Qualifier */}
              <div className="border-l-2 border-[#1F6FEB]/40 pl-4 mb-10">
                <p className="text-sm text-white/40 italic">
                  Walkthroughs are best suited for active operations with 5+ employees or ongoing production.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="intake-form">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5 font-mono tracking-wide uppercase" htmlFor="name">Name</label>
                  <input
                    id="name" name="name" required value={form.name} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="Your name"
                    data-testid="intake-name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5 font-mono tracking-wide uppercase" htmlFor="company">Company</label>
                  <input
                    id="company" name="company" required value={form.company} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="Company or operation name"
                    data-testid="intake-company"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5 font-mono tracking-wide uppercase" htmlFor="operation_type">Type of Operation</label>
                  <select
                    id="operation_type" name="operation_type" required value={form.operation_type} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors appearance-none"
                    data-testid="intake-operation-type"
                  >
                    <option value="" disabled className="bg-[#0B1F33]">Select operation type</option>
                    {operationTypes.map((t) => (
                      <option key={t} value={t} className="bg-[#0B1F33]">{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5 font-mono tracking-wide uppercase" htmlFor="location">Location</label>
                  <input
                    id="location" name="location" required value={form.location} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="City, State"
                    data-testid="intake-location"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-1.5 font-mono tracking-wide uppercase" htmlFor="description">
                    What concerns or areas would you like reviewed?
                  </label>
                  <textarea
                    id="description" name="description" rows={4} value={form.description} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30 resize-none"
                    placeholder="Optional — share anything that would help us prepare."
                    data-testid="intake-description"
                  />
                </div>

                {error && <p className="text-red-400 text-sm" data-testid="intake-error">{error}</p>}

                <button
                  type="submit" disabled={submitting}
                  className="w-full bg-[#1F6FEB] text-[#0B1F33] font-mono font-bold uppercase tracking-wider text-sm px-8 py-4 hover:bg-[#1558C0] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  data-testid="intake-submit"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                  {!submitting && <ArrowRight size={16} />}
                </button>
              </form>

              {/* Contact fallback */}
              <p className="text-center text-sm text-white/30 mt-6">
                Prefer to talk? Call{' '}
                <a href="tel:3363298899" className="text-[#1F6FEB] hover:text-white transition-colors">(336) 329-8899</a>
              </p>
            </>
          ) : (
            /* ── POST-SUBMIT: Thank You + Calendly ── */
            <div className="text-center" data-testid="intake-success">
              <div className="w-16 h-16 rounded-full bg-[#1F6FEB]/20 flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-[#1F6FEB]" />
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
                Request Received
              </h2>
              <p className="text-lg text-white/70 mb-2">
                Thanks, {form.name} — based on your request, you can schedule a quick call to confirm details.
              </p>
              <p className="text-base text-white/50 mb-10">
                You'll receive a clear report within 24-48 hours after the walkthrough.
              </p>

              {/* Calendly embed */}
              <div className="border border-white/10 rounded overflow-hidden mb-8" data-testid="calendly-embed">
                <iframe
                  src={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=0d1b2a&text_color=ffffff&primary_color=c9a84c`}
                  width="100%"
                  height="630"
                  frameBorder="0"
                  title="Schedule a consultation with Vince Lawrence"
                  style={{ minWidth: '280px' }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1F6FEB] text-[#0B1F33] font-mono font-bold uppercase tracking-wider text-sm px-8 py-4 hover:bg-[#1558C0] transition-colors inline-flex items-center gap-2"
                  data-testid="calendly-cta"
                >
                  <Calendar size={16} />
                  Open Full Scheduler
                </a>
                <a
                  href="tel:3363298899"
                  className="border border-white/20 text-white font-mono text-sm px-8 py-4 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
                  data-testid="call-cta"
                >
                  Or Call (336) 329-8899
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default IntakePage;
