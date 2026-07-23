import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const API = process.env.REACT_APP_BACKEND_URL;

/*
  /resend-my-kit — public self-serve page for buyers whose kit-delivery emails
  hit spam. Backend endpoint: POST /api/kit-orders/resend. Rate-limited to
  3 attempts / hour / email. Always returns a generic success message so email
  enumeration is impossible.
*/
const ResendMyKitPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | rate_limited
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`${API}/api/kit-orders/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setStatus('rate_limited');
        setMessage(body.detail || 'Too many resend attempts. Please try again later.');
        return;
      }
      if (res.status === 400 || res.status === 422) {
        setStatus('error');
        setMessage('Please enter a valid email address.');
        return;
      }
      if (!res.ok) {
        setStatus('error');
        setMessage('Something went wrong on our end. Please email Vince@giglinecompliance.com for direct help.');
        return;
      }
      setStatus('success');
      setMessage(body.message || 'Sent. Check your inbox in the next 2–3 minutes.');
    } catch (err) {
      setStatus('error');
      setMessage('Could not reach the server. Check your connection and try again.');
    }
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen" data-testid="resend-my-kit-page">
      <Helmet>
        <title>Resend My Kit — GigLine Safety &amp; Compliance</title>
        <meta name="description" content="Buy a GigLine kit but the email hit your spam folder? Enter your email and we'll re-send your paid kit PDFs instantly." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.giglinecompliance.com/resend-my-kit" />
      </Helmet>

      {/* Header strip */}
      <section className="bg-[#102A43] text-white pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A84C] hover:text-white transition-colors mb-6"
            data-testid="resend-back-home"
          >
            <ArrowLeft size={12} /> Back to home
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] mb-4">Kit Delivery Recovery</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Didn&rsquo;t get your kit email?
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Enter the email you used at checkout. If we find a paid order on file, we&rsquo;ll re-send your kit PDFs to that inbox in the next 2–3 minutes.
          </p>
        </div>
      </section>

      {/* Form + status states */}
      <section className="py-12 md:py-16">
        <div className="max-w-xl mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm"
            data-testid="resend-form"
          >
            <label htmlFor="resend-email" className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#1C2B2B] mb-2">
              Email used at checkout
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                id="resend-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={status === 'loading' || status === 'success'}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-[15px] text-[#1C2B2B] placeholder-gray-400 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] disabled:bg-gray-50 disabled:text-gray-500"
                data-testid="resend-email-input"
              />
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <div className="mt-5 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4" data-testid="resend-success">
                <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-900 leading-relaxed">{message}</p>
              </div>
            )}
            {status === 'rate_limited' && (
              <div className="mt-5 flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4" data-testid="resend-rate-limited">
                <Clock size={18} className="text-yellow-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900 leading-relaxed">{message}</p>
              </div>
            )}
            {status === 'error' && (
              <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4" data-testid="resend-error">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900 leading-relaxed">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !email.trim()}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#B8972C] text-[#102A43] font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="resend-submit"
            >
              {status === 'loading' ? 'Sending…' : status === 'success' ? 'Sent' : (
                <>Resend My Kit <ArrowRight size={16} /></>
              )}
            </button>

            <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
              Rate limited to 3 attempts per email per hour. If it still hasn&rsquo;t arrived, email{' '}
              <a href="mailto:Vince@giglinecompliance.com" className="text-[#102A43] font-semibold underline hover:text-[#C9A84C]">
                Vince@giglinecompliance.com
              </a>{' '}
              with your order details and we&rsquo;ll send it directly.
            </p>
          </form>

          {/* Secondary help block */}
          <div className="mt-8 bg-[#F3ECDB]/60 border-l-4 border-[#C9A84C] rounded p-5 text-sm text-[#1C2B2B] leading-relaxed" data-testid="resend-help">
            <p className="font-bold mb-2">Not sure which email you used?</p>
            <ul className="list-disc list-inside space-y-1.5 text-[#1C2B2B]/85">
              <li>Check your Stripe receipt — it will show the email attached to the purchase.</li>
              <li>Search your inbox for &ldquo;GigLine&rdquo; or &ldquo;giglinecompliance.com&rdquo;.</li>
              <li>Still stuck? Email us the last 4 digits of the card used and we&rsquo;ll look it up manually.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResendMyKitPage;
