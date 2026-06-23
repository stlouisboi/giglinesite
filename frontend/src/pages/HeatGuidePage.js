import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const HeatGuidePage = () => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('idle'); // idle, sending, sent

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/heat-guide/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('sent');
      }
    } catch {
      setStatus('sent');
    }
  };
  return (
    <main data-testid="heat-guide-page">
      <SEO
        title="2026 Heat Stress Action Template"
        description="Free 2026 Heat Stress Action Template for NC manufacturing and warehouse operations. Daily heat check, trigger levels, written plan checklist, and enforcement reference. Download the PDF."
        canonical="/heat-guide"
      />

      {/* Hero */}
      <section className="bg-[#0B1F33] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-[#1F6FEB] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            FREE DOWNLOAD
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="heat-guide-headline">
            2026 Heat Stress Action Template
          </h1>
          <p className="text-lg text-white/70 mb-2">
            NC Manufacturing & Warehouse — OSHA General Duty Clause Active Now
          </p>
          <p className="text-white/50 text-sm">
            Daily heat check, trigger levels, written plan checklist, and enforcement reference. One page. Print and post.
          </p>
        </div>
      </section>

      {/* Email Gate — placeholder for GL-WEB-008 MailerLite integration */}
      <section className="py-14 md:py-20" data-testid="heat-guide-gate">
        <div className="container max-w-xl text-center">
          <div className="bg-[#F9F8F6] border border-[#102133]/10 rounded-lg p-8">
            <Download size={32} className="text-[#1F6FEB] mx-auto mb-4" />
            {status === 'sent' ? (
              <div data-testid="heat-guide-success">
                <h2 className="text-xl font-bold text-[#102133] mb-3" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Check Your Inbox
                </h2>
                <p className="text-sm text-[#102133]/60 mb-4">
                  The 2026 Heat Stress Action Template has been sent to <strong className="text-[#102133]">{email}</strong>. Print it and post it.
                </p>
                <Link to="/safety-check" className="inline-flex items-center gap-2 text-sm text-[#1558C0] font-medium hover:underline">
                  Run the Free Safety Check while you're here <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#102133] mb-3" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Get the Template
                </h2>
                <p className="text-sm text-[#102133]/60 mb-6">
                  Enter your email and we'll send the 2026 Heat Stress Action Template directly to your inbox. Free. No spam. One email.
                </p>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Your work email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#102133]/20 rounded text-sm focus:outline-none focus:border-[#1F6FEB]"
                    data-testid="heat-guide-email-input"
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-semibold py-3 rounded transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid="heat-guide-submit"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Me the Template'}
                    {status !== 'sending' && <ArrowRight size={16} />}
                  </button>
                </form>
                <p className="text-xs text-[#102133]/40 mt-4">
                  Free. No spam. One email.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What's in the template */}
      <section className="py-12 md:py-16 border-t border-[#102133]/10">
        <div className="container max-w-3xl">
          <h2 className="text-lg font-bold text-[#102133] mb-6" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            What's in the Template
          </h2>
          <ul className="space-y-3">
            {[
              'Daily Heat Check — three trigger levels (Under 80°F, 80°F Initial, 90°F High)',
              'Required Controls by Trigger Level — water, rest/shade, acclimatization, emergency response',
              'Written Plan Checklist — HIIPP, training, logs, emergency, acclimatization records',
              'Enforcement Reference — NC DOL General Duty Clause, penalty amounts, inspector expectations',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#102133]/70">
                <span className="text-[#1F6FEB] font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-[#F9F8F6]">
        <div className="container max-w-2xl text-center">
          <p className="text-[#102133]/60 text-sm mb-4">Need more than a template?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[#102133] hover:bg-[#2A3D3D] text-white font-medium px-6 py-3 rounded transition-colors text-sm">
              Book a Walkthrough — Starting at $950
              <ArrowRight size={16} />
            </Link>
            <Link to="/safety-check" className="inline-flex items-center gap-2 border-2 border-[#102133]/20 hover:border-[#102133]/40 text-[#102133] font-medium px-6 py-3 rounded transition-colors text-sm">
              Run the Safety Check — Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HeatGuidePage;
