import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Mail, Shield, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const INSIDE_CARDS = [
  {
    title: 'Before the Inspection',
    body:
      'Written programs, OSHA logs, training records, and physical readiness — with CFR citations for each.',
  },
  {
    title: 'During the Inspection',
    body:
      'The five phases: opening conference, walkaround, employee interviews, closing conference, citation issuance. What to do and what not to do.',
  },
  {
    title: 'After the Inspection',
    body:
      'The 24-hour action window and the 15-day citation response period — step by step.',
  },
  {
    title: 'Most Common HR-Facing Citations',
    body:
      'OSHA 300 Log, training records, written programs, HazCom — the documentation gaps inspectors find most often, with estimated penalty exposure based on OSHA published maximums.',
  },
];

const OshaInspectionGuidePage = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/osha-inspection-guide/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          first_name: firstName.trim(),
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
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main data-testid="osha-inspection-guide-page">
      <SEO
        title="OSHA Inspection Guide for HR & Safety Leaders | GigLine Safety & Compliance"
        description="What OSHA looks for when they walk in — and what your documentation needs to show. Free guide for HR managers and safety coordinators in the NC Piedmont Triad."
        canonical="/osha-inspection-guide"
      />

      {/* Hero */}
      <section className="bg-[#102A43] text-white py-16 md:py-24" data-testid="oig-hero">
        <div className="container max-w-3xl">
          <p
            className="uppercase font-bold mb-4"
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.2em', color: '#c8922a' }}
            data-testid="oig-eyebrow"
          >
            Free Employer Resource  ·  OSHA General Industry
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="oig-headline"
          >
            What OSHA Looks For When They Walk In.
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6">
            A practical guide for HR managers, safety coordinators, and plant managers &mdash; covering what to have ready before the inspection, what happens during it, and what to do in the 15-day window after.
          </p>
          <p
            className="text-xs md:text-[13px] text-white/50 leading-snug"
            style={{ ...mono, letterSpacing: '0.06em' }}
            data-testid="oig-credentials"
          >
            Vince Lawrence  ·  GigLine Safety &amp; Compliance  ·  OSHA 30-Hour Certified  ·  25+ Years in Manufacturing
          </p>
        </div>
      </section>

      {/* Email gate */}
      <section className="py-14 md:py-20 bg-white" data-testid="oig-gate">
        <div className="container max-w-xl">
          <div
            className="rounded-lg p-8 md:p-10"
            style={{ background: '#F9F8F6', border: '1px solid rgba(28,43,43,0.10)' }}
          >
            <Mail size={32} className="text-[#2A52A0] mb-4" />

            {status === 'sent' ? (
              <div data-testid="oig-success">
                <h2
                  className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-3"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Your guide just opened in a new tab.
                </h2>
                <p className="text-sm text-[#1C2B2B]/65 mb-4">
                  We also sent a copy to <strong className="text-[#1C2B2B]">{email}</strong> for safekeeping. If the new tab didn&rsquo;t open (popup blocker), use the button below to open it directly.
                </p>
                <a
                  href={`${API_URL}/api/osha-inspection-guide/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-semibold px-5 py-3 rounded transition-colors text-sm mb-6"
                  data-testid="oig-fallback-download"
                >
                  <BookOpen size={14} />
                  Open the OSHA Inspection Guide
                </a>
                <div className="pt-6 border-t border-[#2A52A0]/10">
                  <p className="text-sm text-[#1C2B2B]/60 mb-3">
                    Want to know exactly where your own operation stands? Take the 90-second self-screen.
                  </p>
                  <Link
                    to="/safety-check"
                    className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-semibold px-5 py-3 rounded transition-colors text-sm"
                    data-testid="oig-safety-check-cta"
                  >
                    Take the Safety Check
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2
                  className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-3"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  Get the Guide
                </h2>
                <p className="text-sm text-[#1C2B2B]/65 mb-6 leading-relaxed">
                  Built for HR and safety leaders in NC manufacturing and warehousing. CFR-cited. Free. One email with your download link.
                </p>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Email address (required)"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#2A52A0]/20 rounded text-sm focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                    data-testid="oig-email-input"
                    autoComplete="email"
                  />
                  <input
                    type="text"
                    placeholder="First name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-[#2A52A0]/20 rounded text-sm focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                    data-testid="oig-firstname-input"
                    autoComplete="given-name"
                  />
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 border border-[#2A52A0]/20 rounded text-sm focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                    data-testid="oig-company-input"
                    autoComplete="organization"
                  />
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-[#102A43] hover:bg-[#1F3F80] text-white font-semibold py-3 rounded transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid="oig-submit"
                  >
                    {status === 'sending' ? (
                      'Sending…'
                    ) : (
                      <>
                        <BookOpen size={16} />
                        Send Me the Guide
                      </>
                    )}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="text-sm text-red-600 mt-3" data-testid="oig-error">
                    Something went wrong. Try again, or email{' '}
                    <a href="mailto:vince@giglinecompliance.com" className="underline">
                      vince@giglinecompliance.com
                    </a>{' '}
                    directly.
                  </p>
                )}
                <p className="text-xs text-[#1C2B2B]/45 mt-4 flex items-center gap-1.5">
                  <Shield size={12} />
                  No spam. One email with your download link.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section
        className="py-14 md:py-20 border-t border-[#2A52A0]/10"
        data-testid="oig-whats-inside"
      >
        <div className="container max-w-4xl">
          <p
            className="uppercase font-bold mb-3 text-[#2A52A0]"
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.22em' }}
          >
            What&rsquo;s Inside
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-10 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Built for the moment OSHA walks through the door.
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {INSIDE_CARDS.map((card) => (
              <li
                key={card.title}
                className="rounded-lg p-6 md:p-7"
                style={{ background: '#F9F8F6', border: '1px solid rgba(28,43,43,0.10)' }}
                data-testid={`oig-card-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle2 size={20} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-[#1C2B2B] leading-tight">
                    {card.title}
                  </h3>
                </div>
                <p className="text-[14.5px] text-[#1C2B2B]/65 leading-[1.65] pl-8">
                  {card.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default OshaInspectionGuidePage;
