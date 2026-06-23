import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Phone, Shield } from 'lucide-react';
import { trackWalkthroughRequest, trackEvent } from '../utils/analytics';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;

const SERVICES = [
  { value: 'Safety Walkthrough', label: 'Safety Walkthrough — on-site visit and written report (from $1,200)' },
  { value: 'Compliance Readiness Visit', label: 'Compliance Readiness Visit — floor walkthrough + documentation review (from $2,000)' },
  { value: 'Documentation Review', label: 'Documentation Review — review of written programs and records (from $1,300)' },
  { value: 'Incident Review', label: 'Incident Review — post-injury or near-miss response (from $1,500)' },
  { value: 'Not sure', label: "Not sure — I want to talk through my situation first" },
];

// Map services page tier keys → human-readable service values
const TIER_TO_SERVICE = {
  walkthrough_standard: 'Safety Walkthrough',
  'compliance-readiness-visit': 'Compliance Readiness Visit',
  documentation_remote: 'Documentation Review',
  incident_standard: 'Incident Review',
};

const IntakePage = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = TIER_TO_SERVICE[searchParams.get('service')] || '';

  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    service: preselectedService,
  });
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

  // If user lands with ?service= and it's valid, honour it
  useEffect(() => {
    if (preselectedService && !form.service) {
      setForm((f) => ({ ...f, service: preselectedService }));
    }
  }, [preselectedService, form.service]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/walkthrough/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...utmParams }),
      });
      if (!res.ok) throw new Error('Submission failed');
      trackWalkthroughRequest(form.service);
      trackEvent('intake_submit_success', {
        service_requested: form.service || 'safety-walkthrough',
        source_form: 'request-walkthrough',
        page_path: typeof window !== 'undefined' ? window.location.pathname : '/request-walkthrough',
      });
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
        description="Request an on-site safety walkthrough. One visit. Clear findings. Written report within 24–48 hours. Serving the Kernersville / Triad area."
        canonical="/request-walkthrough"
      />

      <section className="py-20 md:py-28" style={{ backgroundColor: '#0B1F33' }} data-testid="intake-page">
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
              <p className="text-lg text-white/75 mb-3 leading-relaxed">
                Schedule an on-site safety walkthrough with GigLine Safety & Compliance. One visit. Clear findings. Written report within 24–48 hours.
              </p>
              <p className="text-base text-white/60 mb-6 leading-relaxed">
                Serving small manufacturers, warehouses, contractors, and fleets in the Kernersville / Triad, NC area.
              </p>

              {/* Credential chips — visible trust signal near form */}
              <div className="flex flex-wrap gap-2 mb-10" data-testid="intake-credentials">
                {['OSHA 30-Hour Certified', '25+ Years Experience', 'U.S. Navy Veteran'].map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center px-3 py-1 rounded text-[#1F6FEB] border border-[#1F6FEB]/30 font-mono text-[11px]"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="intake-form">
                <div>
                  <label className="block text-sm text-white/70 mb-1.5 font-mono tracking-wide uppercase" htmlFor="name">
                    Your name *
                  </label>
                  <input
                    id="name" name="name" type="text" required autoComplete="name"
                    value={form.name} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="First and last"
                    data-testid="intake-name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5 font-mono tracking-wide uppercase" htmlFor="company">
                    Business name *
                  </label>
                  <input
                    id="company" name="company" type="text" required autoComplete="organization"
                    value={form.company} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="Company or DBA"
                    data-testid="intake-company"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5 font-mono tracking-wide uppercase" htmlFor="phone">
                    Phone *
                  </label>
                  <input
                    id="phone" name="phone" type="tel" required autoComplete="tel"
                    value={form.phone} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="(336) 555-1234"
                    inputMode="tel"
                    data-testid="intake-phone"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5 font-mono tracking-wide uppercase" htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email" name="email" type="email" required autoComplete="email"
                    value={form.email} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="you@yourcompany.com"
                    data-testid="intake-email"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5 font-mono tracking-wide uppercase" htmlFor="city">
                    City *
                  </label>
                  <input
                    id="city" name="city" type="text" required autoComplete="address-level2"
                    value={form.city} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors placeholder:text-white/30"
                    placeholder="Kernersville, NC"
                    data-testid="intake-city"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5 font-mono tracking-wide uppercase" htmlFor="service">
                    What do you need help with? *
                  </label>
                  <select
                    id="service" name="service" required
                    value={form.service} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3.5 rounded focus:outline-none focus:border-[#1F6FEB] transition-colors appearance-none"
                    data-testid="intake-service"
                  >
                    <option value="" disabled className="bg-[#0B1F33]">Select one</option>
                    {SERVICES.map((s) => (
                      <option key={s.value} value={s.value} className="bg-[#0B1F33]">{s.label}</option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-red-400 text-sm" data-testid="intake-error">{error}</p>}

                {/* Trust line ABOVE submit — addresses "will this be reported" objection before click */}
                <div
                  className="flex items-start gap-3 rounded-lg p-4"
                  style={{ background: 'rgba(31,111,235,0.06)', border: '1px solid rgba(31,111,235,0.18)' }}
                  data-testid="intake-trust-line"
                >
                  <Shield size={16} className="flex-shrink-0 mt-0.5 text-[#1F6FEB]" />
                  <p className="text-sm text-white/80 leading-relaxed">
                    This is a private engagement. Nothing you share here is reported to OSHA or any regulatory agency.
                  </p>
                </div>

                <button
                  type="submit" disabled={submitting}
                  className="w-full bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold uppercase tracking-wider text-base px-8 py-4 rounded-lg transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ minHeight: '56px' }}
                  data-testid="intake-submit"
                >
                  {submitting ? 'Submitting...' : 'Request a Safety Walkthrough'}
                  {!submitting && <ArrowRight size={18} />}
                </button>
              </form>

              {/* Fallback contact */}
              <p className="text-center text-sm text-white/60 mt-6" data-testid="intake-fallback">
                Prefer to call? Reach Vince directly at{' '}
                <a href="tel:3363298899" className="text-[#1F6FEB] hover:text-white font-semibold transition-colors">
                  (336) 329-8899
                </a>
                .
              </p>
            </>
          ) : (
            /* ── POST-SUBMIT: Inline confirmation (no redirect) ── */
            <div className="text-center" data-testid="intake-success">
              <div className="w-16 h-16 rounded-full bg-[#1F6FEB]/20 flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-[#1F6FEB]" />
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-5">
                Got it.
              </h2>
              <p className="text-lg text-white/80 mb-3 leading-relaxed max-w-lg mx-auto">
                Vince will be in touch within one business day to talk through your situation and schedule a time.
              </p>
              <p className="text-base text-white/60 mb-10 max-w-lg mx-auto">
                In the meantime, you can reach him directly at{' '}
                <a href="tel:3363298899" className="text-[#1F6FEB] hover:text-white font-semibold transition-colors">
                  (336) 329-8899
                </a>
                .
              </p>

              <a
                href="tel:3363298899"
                className="inline-flex items-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded-lg transition-colors"
                style={{ minHeight: '56px' }}
                data-testid="success-call-cta"
              >
                <Phone size={18} />
                Call (336) 329-8899
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default IntakePage;
