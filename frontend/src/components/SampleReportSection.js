import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, QrCode, Phone } from 'lucide-react';

/*
  SampleReportSection
  ──────────────────────────────────────────────────────
  GL-WEB-012 — Sample Report Section for /services
  Static, document-style rendering of the actual GigLine
  walkthrough report deliverable. Not interactive.
*/

const DOC_HEADER_BG = '#1C2B2B';
const DOC_BORDER = 'rgba(11,31,51,0.10)';
const TEXT_DARK = '#0B1F33';
const TEXT_MUTED = 'rgba(11,31,51,0.72)';
const TEXT_SUBTLE = 'rgba(11,31,51,0.55)';

const SEVERITY_STYLES = {
  Serious: { bg: '#FEF2F2', color: '#991B1B' },
  'Other-than-Serious': { bg: '#FEF9EC', color: '#92400E' },
  'Documentation Gap': { bg: '#EFF6FF', color: '#1E40AF' },
};

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const heading = { fontFamily: "'Manrope', sans-serif" };

const FINDINGS = [
  {
    n: '01',
    severity: 'Serious',
    cfr: '29 CFR 1904.32',
    standard: 'Recordkeeping — Annual Summary',
    location: 'Main office / posting area',
    observation:
      'OSHA 300 Log not posted during the February 1 – April 30 posting period. No 300A Annual Summary signed by a company executive. Required posting is an OSHA mandate, not a recommendation.',
    correctiveAction:
      'Post the OSHA 300A Annual Summary immediately. Obtain executive signature. Establish a calendar reminder for February 1 posting requirement each year.',
    penalty: '$1,190 – $16,131',
    fixBy: 'Immediate — prior to next business day',
  },
  {
    n: '02',
    severity: 'Serious',
    cfr: '29 CFR 1910.178(l)',
    standard: 'Powered Industrial Trucks — Operator Training',
    location: 'Warehouse floor / shipping dock',
    observation:
      'Two forklift operators with certifications older than three years and no documented refresher training. No daily pre-shift inspection log maintained on either vehicle. OSHA requires refresher training every three years and evaluation documentation.',
    correctiveAction:
      'Schedule refresher training and evaluation for all operators with certifications older than three years. Implement daily pre-shift inspection log on every powered industrial truck.',
    penalty: '$1,190 – $16,131 per operator',
    fixBy: 'Within 30 days',
  },
  {
    n: '03',
    severity: 'Other-than-Serious',
    cfr: '29 CFR 1910.22(a)(1)',
    standard: 'Walking-Working Surfaces — Housekeeping',
    location: 'Production floor — press lines',
    observation:
      'Scrap material accumulated under press lines. Pallets and loose material in marked pedestrian zones. Workers observed stepping around obstructions. Housekeeping is a written OSHA standard, not an aesthetic preference.',
    correctiveAction:
      'Clear all scrap and obstructions from pedestrian zones immediately. Draft a written housekeeping program. Implement end-of-shift sweep routine with supervisor sign-off.',
    penalty: '$0 – $16,131',
    fixBy: 'Within 30 days',
  },
  {
    n: '04',
    severity: 'Serious',
    cfr: '29 CFR 1910.37(a)(3)',
    standard: 'Emergency Egress — Exit Route Obstruction',
    location: 'Rear exit — shipping dock',
    observation:
      'Emergency exit path partially obstructed by stacked boxes and a hand truck parked against the exit door. Exit route must remain unobstructed at all times. Door opened to approximately 60% capacity during walkthrough.',
    correctiveAction:
      'Clear all obstructions from emergency exit paths immediately. Mark a no-storage zone on the floor. Add monthly egress audit to the standing safety checklist.',
    penalty: '$1,190 – $16,131',
    fixBy: 'Immediate — prior to next shift',
  },
];

const todayFormatted = () => {
  const d = new Date();
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const SampleReportSection = () => {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: '#F7F9FC' }}
      data-testid="sample-report-section"
    >
      <div className="container max-w-5xl px-5 md:px-8">
        {/* SECTION HEADER */}
        <div className="mb-10 md:mb-12 max-w-3xl">
          <p
            className="uppercase tracking-[3px] text-[#1F6FEB] mb-4 font-bold"
            style={{ ...mono, fontSize: '12px' }}
            data-testid="sample-report-kicker"
          >
            Sample Deliverable
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight mb-4"
            style={{ ...heading, color: TEXT_DARK }}
            data-testid="sample-report-headline"
          >
            What a GigLine report actually looks like.
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: TEXT_MUTED }}
            data-testid="sample-report-subtext"
          >
            Every engagement delivers a written report your team can act on. Here is a sample from a recent walkthrough &mdash; findings, CFR citations, photos, and corrective actions included.
          </p>
        </div>

        {/* ── DOCUMENT ── */}
        <article
          className="bg-white"
          style={{ border: `1px solid ${DOC_BORDER}` }}
          data-testid="sample-report-document"
          aria-label="Sample GigLine Safety Walkthrough Report"
        >
          {/* REPORT HEADER BAR */}
          <header
            className="px-6 md:px-10 py-7 md:py-8"
            style={{ backgroundColor: DOC_HEADER_BG, color: 'white' }}
            data-testid="sample-report-header"
          >
            <p
              className="uppercase tracking-[3px] mb-3"
              style={{ ...mono, fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}
            >
              Safety Walkthrough Report
            </p>
            <h3
              className="text-xl md:text-2xl font-bold leading-tight mb-5"
              style={heading}
            >
              GigLine Safety Walkthrough Report
            </h3>
            <p
              className="text-[13px] md:text-sm leading-relaxed mb-5"
              style={{ color: 'rgba(255,255,255,0.78)' }}
              data-testid="sample-report-client-line"
            >
              Representative Example &middot; Piedmont Triad, NC &middot; {todayFormatted()}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <MetaField label="Inspector" value="Vince Lawrence" />
              <MetaField label="Operation Type" value="Manufacturing" />
              <MetaField label="Employees" value="~40" />
            </div>
          </header>

          {/* REPORT SUMMARY BAR */}
          <section
            className="px-6 md:px-10 py-6 md:py-7"
            style={{ borderBottom: `1px solid ${DOC_BORDER}`, backgroundColor: '#FBFCFE' }}
            data-testid="sample-report-summary"
          >
            <p
              className="uppercase tracking-[3px] mb-3"
              style={{ ...mono, fontSize: '10px', color: TEXT_SUBTLE }}
            >
              Findings Summary
            </p>
            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-[14px] md:text-[15px]"
              style={{ color: TEXT_DARK, ...heading }}
              data-testid="sample-report-counts"
            >
              <span><strong>3</strong> Serious</span>
              <span style={{ color: TEXT_SUBTLE }}>&middot;</span>
              <span><strong>1</strong> Other-than-Serious</span>
              <span style={{ color: TEXT_SUBTLE }}>&middot;</span>
              <span><strong>0</strong> Documentation Gap</span>
              <span style={{ color: TEXT_SUBTLE }}>&middot;</span>
              <span><strong>4</strong> total findings</span>
            </div>
            <p
              className="text-[14px] md:text-[15px] leading-relaxed"
              style={{ color: TEXT_MUTED }}
              data-testid="sample-report-exec-summary"
            >
              Three Serious citations and one Other-than-Serious finding were identified during this walkthrough. Recordkeeping and egress require immediate attention prior to the next business day. Forklift certification and housekeeping issues should be corrected within 30 days.
            </p>
          </section>

          {/* FINDINGS */}
          <section data-testid="sample-report-findings">
            {FINDINGS.map((f, i) => (
              <FindingBlock key={f.n} f={f} isLast={i === FINDINGS.length - 1} />
            ))}
          </section>

          {/* REPORT FOOTER */}
          <footer
            className="px-6 md:px-10 py-6 md:py-7"
            style={{ borderTop: `1px solid ${DOC_BORDER}`, backgroundColor: '#FBFCFE' }}
            data-testid="sample-report-footer"
          >
            <p
              className="text-[13px] md:text-[14px] mb-3"
              style={{ color: TEXT_DARK, ...heading, fontWeight: 600 }}
            >
              GigLine Safety &amp; Compliance &middot; Vince Lawrence &middot; (336) 329-8899 &middot; giglinecompliance.com &middot; Kernersville, NC
            </p>
            <p
              className="text-[11px] md:text-[12px] leading-relaxed italic"
              style={{ color: TEXT_SUBTLE }}
            >
              Penalty ranges reflect 2024 OSHA maximum penalty amounts and are provided for planning purposes only. GigLine Safety &amp; Compliance does not determine OSHA enforcement outcomes.
            </p>
          </footer>
        </article>

        {/* ── CTA BELOW THE REPORT ── */}
        <div className="mt-10 md:mt-12 text-center" data-testid="sample-report-cta-wrap">
          <Link
            to="/request-walkthrough"
            className="inline-flex items-center justify-center gap-2 bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold py-4 px-8 rounded-lg transition-colors text-[15px] md:text-base"
            style={{ ...heading, boxShadow: '0 6px 18px rgba(31,111,235,0.18)' }}
            data-testid="sample-report-cta"
          >
            Request a Walkthrough
            <ArrowRight size={16} />
          </Link>
          <p
            className="mt-4 text-[13px] md:text-sm leading-relaxed inline-flex flex-wrap items-center justify-center gap-1.5"
            style={{ color: TEXT_MUTED }}
            data-testid="sample-report-cta-subtext"
          >
            <span>Fixed quote before scheduling. No retainer.</span>
            <span style={{ color: TEXT_SUBTLE }}>Or call</span>
            <a
              href="tel:+13363298899"
              className="inline-flex items-center gap-1 font-semibold hover:underline"
              style={{ color: '#1F6FEB' }}
              data-testid="sample-report-cta-phone"
            >
              <Phone size={12} />
              (336) 329-8899
            </a>
            <span style={{ color: TEXT_SUBTLE }}>directly.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

/* ── HELPERS ───────────────────────────────────────── */

const MetaField = ({ label, value }) => (
  <div>
    <p
      className="uppercase tracking-[3px] mb-1"
      style={{ ...mono, fontSize: '9px', color: 'rgba(255,255,255,0.55)' }}
    >
      {label}
    </p>
    <p className="text-[14px] font-semibold" style={{ ...heading, color: 'white' }}>
      {value}
    </p>
  </div>
);

const SeverityBadge = ({ severity }) => {
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES['Documentation Gap'];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: s.bg, color: s.color, ...mono, letterSpacing: '0.08em' }}
      data-testid={`severity-${severity.toLowerCase().replace(/[^a-z]/g, '-')}`}
    >
      {severity}
    </span>
  );
};

const CFRTag = ({ cfr }) => (
  <span
    className="inline-flex items-center px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
    style={{ backgroundColor: '#EBF0FA', color: '#2A52A0', ...mono, letterSpacing: '0.08em' }}
  >
    {cfr}
  </span>
);

const FindingBlock = ({ f, isLast }) => (
  <div
    className="px-6 md:px-10 py-7 md:py-9"
    style={{ borderBottom: isLast ? 'none' : `1px solid ${DOC_BORDER}` }}
    data-testid={`finding-${f.n}`}
  >
    {/* Row 1: number + badges */}
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span
        className="text-[15px] font-bold"
        style={{ ...mono, color: TEXT_SUBTLE, letterSpacing: '0.1em' }}
      >
        FINDING {f.n}
      </span>
      <SeverityBadge severity={f.severity} />
      <CFRTag cfr={f.cfr} />
    </div>

    {/* Standard title */}
    <h4
      className="text-[17px] md:text-[19px] font-bold leading-snug mb-2"
      style={{ ...heading, color: TEXT_DARK }}
    >
      {f.standard}
    </h4>
    <p
      className="text-[13px] md:text-sm mb-5"
      style={{ color: TEXT_SUBTLE }}
    >
      Location: <span style={{ color: TEXT_MUTED, fontWeight: 600 }}>{f.location}</span>
    </p>

    {/* Two-column body: text left, media right */}
    <div className="grid md:grid-cols-12 gap-6 md:gap-8">
      {/* Left: Observation + Corrective Action */}
      <div className="md:col-span-8 space-y-5">
        <Field label="Observation" value={f.observation} />
        <Field label="Corrective Action" value={f.correctiveAction} />

        {/* Penalty + Fix-by row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
          style={{ borderTop: `1px solid ${DOC_BORDER}` }}
        >
          <div>
            <p
              className="uppercase tracking-[3px] mb-1.5"
              style={{ ...mono, fontSize: '10px', color: TEXT_SUBTLE }}
            >
              Penalty Range
            </p>
            <p className="text-[14px] md:text-[15px] font-bold" style={{ ...heading, color: TEXT_DARK }}>
              {f.penalty}
            </p>
          </div>
          <div>
            <p
              className="uppercase tracking-[3px] mb-1.5"
              style={{ ...mono, fontSize: '10px', color: TEXT_SUBTLE }}
            >
              Fix By
            </p>
            <p className="text-[14px] md:text-[15px] font-bold" style={{ ...heading, color: TEXT_DARK }}>
              {f.fixBy}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Photo + Video QR placeholders */}
      <div className="md:col-span-4 space-y-3">
        <PhotoPlaceholder area={f.location.split('/')[0].trim()} />
        <QRPlaceholder />
      </div>
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <p
      className="uppercase tracking-[3px] mb-1.5"
      style={{ ...mono, fontSize: '10px', color: TEXT_SUBTLE }}
    >
      {label}
    </p>
    <p className="text-[14px] md:text-[15px] leading-relaxed" style={{ color: TEXT_DARK }}>
      {value}
    </p>
  </div>
);

const PhotoPlaceholder = ({ area }) => (
  <div
    className="flex flex-col items-center justify-center text-center px-3 py-6"
    style={{
      backgroundColor: '#F1F3F7',
      border: `1px dashed ${DOC_BORDER}`,
      minHeight: '120px',
    }}
    data-testid="photo-placeholder"
  >
    <Camera size={20} style={{ color: TEXT_SUBTLE }} className="mb-2" />
    <p
      className="uppercase tracking-[3px] text-[10px] font-bold mb-0.5"
      style={{ ...mono, color: TEXT_SUBTLE }}
    >
      Field Photo
    </p>
    <p className="text-[11px]" style={{ color: TEXT_SUBTLE }}>
      {area}
    </p>
  </div>
);

const QRPlaceholder = () => (
  <div
    className="flex items-center gap-3 p-3"
    style={{
      backgroundColor: '#F1F3F7',
      border: `1px dashed ${DOC_BORDER}`,
    }}
    data-testid="qr-placeholder"
  >
    <img
      src="/sample-report-qr.svg"
      alt="Sample QR code linking to giglinecompliance.com"
      width="56"
      height="56"
      style={{ display: 'block', flexShrink: 0 }}
    />
    <div className="flex-1 min-w-0">
      <p
        className="uppercase tracking-[3px] text-[10px] font-bold mb-0.5 flex items-center gap-1.5"
        style={{ ...mono, color: TEXT_SUBTLE }}
      >
        <QrCode size={11} />
        Video Reference
      </p>
      <p className="text-[11px] leading-snug" style={{ color: TEXT_SUBTLE }}>
        Scan to view on-site capture.
      </p>
    </div>
  </div>
);

export default SampleReportSection;
