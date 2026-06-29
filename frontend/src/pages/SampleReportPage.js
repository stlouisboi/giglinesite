import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, Shield, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SampleReportPage = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/sample-report/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
          company: company.trim(),
        }),
      });
      const data = await res.json();
      if (data && data.success) {
        // Open PDF in a new tab immediately (GL-WEB-020) — email/MailerLite still delivers as backup
        if (data.download_url) {
          window.open(`${API_URL}${data.download_url}`, '_blank', 'noopener,noreferrer');
        }
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main data-testid="sample-report-page">
      <SEO
        title="Sample Compliance Report | GigLine Safety & Compliance"
        description="See exactly what you get. A real GigLine compliance report — facility name redacted. Findings, CFR citations, penalty exposure, and the prioritized fix list. Download free."
        canonical="/sample-report"
      />

      {/* Hero */}
      <section className="bg-[#1C2B2B] text-white py-16 md:py-24" data-testid="sample-report-hero">
        <div className="container max-w-3xl">
          <p
            className="uppercase font-bold mb-4"
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.2em', color: '#c8922a' }}
          >
            Free Download — Sample Report
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="sample-report-headline"
          >
            See exactly what you get.
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            A real compliance report &mdash; facility name redacted. This is what your team receives within 48 hours of the walkthrough.
          </p>
        </div>
      </section>

      {/* Email gate */}
      <section className="py-14 md:py-20 bg-white" data-testid="sample-report-gate">
        <div className="container max-w-xl">
          <div
            className="rounded-lg p-8 md:p-10"
            style={{ background: '#F9F8F6', border: '1px solid rgba(28,43,43,0.10)' }}
          >
            <FileText size={32} className="text-[#2A52A0] mb-4" />

            {status === 'sent' ? (
              <div data-testid="sample-report-success">
                <h2
                  className="text-xl font-bold text-[#1C2B2B] mb-3"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Your guide just opened in a new tab.
                </h2>
                <p className="text-sm text-[#1C2B2B]/70 mb-4">
                  We also sent a copy to <strong className="text-[#1C2B2B]">{email}</strong> for safekeeping. If the new tab didn&rsquo;t open (popup blocker), use the button below to download it directly.
                </p>
                <a
                  href={`${API_URL}/api/sample-report/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1C2B2B] hover:bg-[#1c2e44] text-white font-semibold px-5 py-3 rounded transition-colors text-sm mb-6"
                  data-testid="sample-report-fallback-download"
                >
                  <Download size={14} />
                  Open the Sample Report
                </a>
                <div className="mt-6 pt-6 border-t border-[#1C2B2B]/10">
                  <p className="text-sm text-[#1C2B2B]/60 mb-3">Ready to schedule a walkthrough that produces a report like this for your operation?</p>
                  <Link
                    to="/intake?service=safety-walkthrough-report&utm_source=sample-report&utm_medium=website&utm_campaign=sample-report-followup"
                    className="inline-flex items-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-semibold px-5 py-3 rounded transition-colors text-sm"
                    data-testid="sample-report-intake-cta"
                  >
                    Request a Walkthrough
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2
                  className="text-xl font-bold text-[#1C2B2B] mb-3"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Get the Sample Report
                </h2>
                <p className="text-sm text-[#1C2B2B]/65 mb-6 leading-relaxed">
                  Enter your name and email and we&rsquo;ll send the redacted compliance report directly to your inbox. Free. No spam. One email.
                </p>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="First name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#1C2B2B]/20 rounded text-sm focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                    data-testid="sample-report-firstname-input"
                    autoComplete="given-name"
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#1C2B2B]/20 rounded text-sm focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                    data-testid="sample-report-email-input"
                    autoComplete="email"
                  />
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 border border-[#1C2B2B]/20 rounded text-sm focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                    data-testid="sample-report-company-input"
                    autoComplete="organization"
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-semibold py-3 rounded transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid="sample-report-submit"
                  >
                    {status === 'sending' ? (
                      'Sending...'
                    ) : (
                      <>
                        <Download size={16} />
                        Send Me the Sample Report
                      </>
                    )}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="text-sm text-red-600 mt-3" data-testid="sample-report-error">
                    Something went wrong. Try again, or email <a href="mailto:vince@giglinecompliance.com" className="underline">vince@giglinecompliance.com</a> directly.
                  </p>
                )}
                <p className="text-xs text-[#1C2B2B]/45 mt-4 flex items-center gap-1.5">
                  <Shield size={12} />
                  Private. We never share your email. One delivery, no follow-up spam.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What the report contains */}
      <section
        className="py-12 md:py-20 border-t border-[#1C2B2B]/10"
        data-testid="sample-report-contents"
      >
        <div className="container max-w-3xl">
          <p
            className="uppercase font-bold mb-3 text-[#2A52A0]"
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.2em' }}
          >
            What&rsquo;s in the Report
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-8 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Every finding, photographed and cited.
          </h2>
          <ul className="space-y-4">
            {[
              {
                t: 'Photo-documented findings',
                d: 'Every observation captured on the floor — the angle, the equipment, the condition.',
              },
              {
                t: 'CFR citation per finding',
                d: 'Specific regulation referenced — 1910.147, 1910.178, 1910.1200, etc. — not generic "safety concern" language.',
              },
              {
                t: '2026 penalty exposure',
                d: 'Dollar exposure per finding using current OSHA penalty tables — $16,550 serious / $165,514 willful.',
              },
              {
                t: 'RED / AMBER / GREEN priority',
                d: 'Findings sorted by severity so supervisors know what to fix first.',
              },
              {
                t: '30 / 60 / 90-day corrective action plan',
                d: 'A realistic remediation schedule with owners and target dates — not a wish list.',
              },
            ].map((item) => (
              <li key={item.t} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1C2B2B] text-base mb-1">{item.t}</p>
                  <p className="text-sm text-[#1C2B2B]/65 leading-relaxed">{item.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-[#1C2B2B] text-white" data-testid="sample-report-cta">
        <div className="container max-w-2xl text-center">
          <p className="text-base md:text-lg text-white/65 mb-2">Reading a sample is useful.</p>
          <p className="text-lg md:text-xl text-white font-medium mb-7">
            Getting one for your own operation is better.
          </p>
          <Link
            to="/intake?service=safety-walkthrough-report&utm_source=sample-report&utm_medium=website&utm_campaign=sample-report-cta"
            className="inline-flex items-center gap-2 bg-[#2A52A0] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded transition-colors"
            data-testid="sample-report-bottom-cta"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-white/40 mt-5">
            Starting at $1,200. Written report within 48 hours.
          </p>
        </div>
      </section>
    </main>
  );
};

export default SampleReportPage;
