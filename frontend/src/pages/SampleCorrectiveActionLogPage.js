import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, FileText, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const PDF_URL = '/assets/GigLine_Sample_Corrective_Action_Log.pdf';

// GL-FIX desc-missing: /sample-corrective-action-log previously resolved to
// the PDF asset via a vercel.json rewrite (no HTML, no meta tags). It is now
// a real page; the PDF stays as a direct download at PDF_URL.
const SampleCorrectiveActionLogPage = () => {
  return (
    <main data-testid="sample-corrective-action-log-page">
      <SEO
        title="Sample Corrective Action Log — Free PDF Download | GigLine Safety & Compliance"
        description="A real corrective action log from a North Carolina metals fabrication facility, redacted. Findings, CFR citations, priorities, target dates. Free PDF, no form required."
        canonical="/sample-corrective-action-log"
      />

      {/* Hero */}
      <section className="bg-[#102A43] text-white py-16 md:py-24" data-testid="sample-log-hero">
        <div className="container max-w-3xl">
          <p
            className="uppercase font-bold mb-4"
            style={{ ...mono, fontSize: '11px', letterSpacing: '0.2em', color: '#c8922a' }}
          >
            Free Download, Sample Corrective Action Log
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="sample-log-headline"
          >
            Sample Corrective Action Log
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            The corrective-action section of a real GigLine engagement report — client name and facility identifiers redacted.
          </p>
        </div>
      </section>

      {/* Download */}
      <section className="py-14 md:py-20 bg-white" data-testid="sample-log-download">
        <div className="container max-w-xl">
          <div
            className="rounded-lg p-8 md:p-10"
            style={{ background: '#F9F8F6', border: '1px solid rgba(28,43,43,0.10)' }}
          >
            <FileText size={32} className="text-[#2A52A0] mb-4" />
            <h2
              className="text-xl font-bold text-[#1C2B2B] mb-3"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Download the log
            </h2>
            <p className="text-sm text-[#1C2B2B]/65 mb-5 leading-relaxed">
              The findings, CFR citations, priority ratings, and timelines are accurate to the engagement. Nothing else has been altered.
            </p>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-semibold px-5 py-3 rounded transition-colors text-sm"
              data-testid="sample-log-pdf-link"
            >
              <Download size={14} />
              Open the PDF (no form, no email required)
            </a>

            <div className="mt-8 pt-6 border-t border-[#2A52A0]/10">
              <h3 className="text-base font-semibold text-[#1C2B2B] mb-3">What&rsquo;s inside the log</h3>
              <ul className="space-y-3">
                {[
                  'Each finding photographed on the floor and documented against the CFR standard OSHA cites for it',
                  'Priority ratings — RED for urgent, AMBER for near-term, GREEN for what the team is doing well',
                  'A corrective action for every finding, with an owner and a target date',
                  'A 30 / 60 / 90-day remediation schedule with owners, not a wish list',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#2A52A0] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#1C2B2B]/70 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#2A52A0]/10">
              <p className="text-sm text-[#1C2B2B]/60 mb-3">
                Most safety consultants hide the deliverable until after you sign. I don&rsquo;t. This log is part of the written report your team receives within 48 hours of the walkthrough.
              </p>
              <Link
                to="/intake?service=compliance-readiness-visit&utm_source=sample-corrective-action-log&utm_medium=website&utm_campaign=sample-log-followup"
                className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-semibold px-5 py-3 rounded transition-colors text-sm"
                data-testid="sample-log-intake-cta"
              >
                Request a Compliance Readiness Visit
                <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-[#1C2B2B]/50 mt-3">
                Starts at $2,500. Or call (336) 329-8899.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 md:py-16 border-t border-[#2A52A0]/10 bg-white">
        <div className="container max-w-3xl text-sm text-[#1C2B2B]/65">
          <p>
            Prefer to start with the full deliverable? See the{' '}
            <Link to="/sample-report" className="font-semibold text-[#2A52A0] underline underline-offset-4">
              Sample Compliance Report
            </Link>{' '}
            or the rest of the{' '}
            <Link to="/resources" className="font-semibold text-[#2A52A0] underline underline-offset-4">
              resources page
            </Link>.
          </p>
          <p className="mt-3 text-[#1C2B2B]/45">
            GigLine Safety &amp; Compliance &middot; Veteran-owned &middot; Kernersville, NC &middot; (336) 329-8899
          </p>
        </div>
      </section>
    </main>
  );
};

export default SampleCorrectiveActionLogPage;
