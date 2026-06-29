import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Phone } from 'lucide-react';

/*
  SampleReportSection
  ──────────────────────────────────────────────────────
  GL-WEB-012 — Sample Report Section for /services
  Static, document-style rendering of the actual GigLine
  walkthrough report deliverable. Not interactive.
*/

const DOC_HEADER_BG = '#1C2B2B';
const DOC_BORDER = 'rgba(11,31,51,0.10)';
const TEXT_DARK = '#0d1b2a';
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
    cfr: '29 CFR 1910.110(b)(6)(i)',
    standard: 'Storage and handling of liquefied petroleum gases (LPG)',
    label: 'Unsecured compressed gas cylinder stored adjacent to flammable storage cabinet',
    location: 'Production floor / flammable storage area',
    observation:
      'One propane cylinder observed stored upright without chain, bracket, or restraint system to prevent tipping. Cylinder positioned immediately adjacent to the flammable liquids storage cabinet with no separation distance between the two.',
    correctiveAction:
      'Secure propane cylinder immediately with a chain bracket or cylinder stand rated for compressed gas storage. Relocate cylinder a minimum of 20 feet from the flammable storage cabinet or install a fire-resistant barrier of at least 30-minute rating between them. When not in active use, store propane cylinder outside or in a designated outdoor compressed gas storage area.',
    penalty: '$7,000 – $14,502 (Serious)',
    fixBy: 'Immediate',
    photoUrl: null,
  },
  {
    n: '02',
    severity: 'Serious',
    cfr: '29 CFR 1910.212(a)(1)',
    standard: 'Machine Guarding — General Requirements for All Machines',
    label: 'Unguarded shear point of operation on roll former cut-off mechanism',
    location: 'Production floor / roll former cut-off station',
    observation:
      'Shear blade point of operation on roll former cut-off mechanism observed without point-of-operation guarding. Blade accessible during operation. Perimeter safety rail present on outfeed side does not address the point of operation at the shear head.',
    correctiveAction:
      'Install point-of-operation guarding on the shear blade to prevent operator contact with the cutting hazard. Acceptable methods include barrier guards, two-hand controls, or presence-sensing devices. Post machine-specific LOTO procedure at the shear station before any maintenance or jam-clearing is performed. Complete guarding installation before production employees are assigned to operate this equipment.',
    penalty: '$7,000 – $14,502 (Serious)',
    fixBy: 'Before production employees operate equipment',
    photoUrl: '/floor-findings/machine-guarding.jpg',
  },
  {
    n: '03',
    severity: 'Documentation Gap',
    cfr: '29 CFR 1910.1200(g)(1)',
    standard: 'Hazard Communication — Safety Data Sheets',
    label: 'SDS not on file for chemical in active use',
    location: 'Production floor / hydraulic power unit',
    observation:
      'No SDS present in digital SDS library or physical binder for a hydraulic oil product actively in use on the production floor. Four 5-gallon pails observed stored adjacent to the hydraulic power unit. Product in active use in the machine.',
    correctiveAction:
      'Obtain and maintain Safety Data Sheets for all hazardous chemicals present in the workplace. Ensure SDSs are readily accessible to employees during their work shifts in the area where hazardous chemicals are used or stored.',
    penalty: '$7,000 – $15,621 (Serious)',
    fixBy: 'Before fluid is used in production',
    photoUrl: '/floor-findings/hazcom-sds.jpg',
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
            className="uppercase tracking-[3px] text-[#1a6fc4] mb-4 font-bold"
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
            What a GigLine Combined Safety &amp; Documentation Report looks like.
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: TEXT_MUTED }}
            data-testid="sample-report-subtext"
          >
            Three findings from a real engagement &mdash; sanitized. Same format, same CFR citations, same penalty ranges your inspector would reference.
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
              Combined Safety &amp; Documentation Report
            </p>
            <h3
              className="text-xl md:text-2xl font-bold leading-tight mb-5"
              style={heading}
            >
              GigLine Combined Safety &amp; Documentation Report
            </h3>
            <p
              className="text-[13px] md:text-sm leading-relaxed mb-5"
              style={{ color: 'rgba(255,255,255,0.78)' }}
              data-testid="sample-report-client-line"
            >
              Real engagement &middot; Sanitized for publication &middot; Statesville, NC &middot; June 18, 2026
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <MetaField label="Inspector" value="Vince Lawrence" />
              <MetaField label="Operation" value="Metals Fabrication" />
              <MetaField label="Headcount" value="9 employees" />
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
              <span><strong>2</strong> Serious</span>
              <span style={{ color: TEXT_SUBTLE }}>&middot;</span>
              <span><strong>1</strong> Documentation Gap</span>
              <span style={{ color: TEXT_SUBTLE }}>&middot;</span>
              <span><strong>3</strong> findings shown</span>
            </div>
            <p
              className="text-[14px] md:text-[15px] leading-relaxed"
              style={{ color: TEXT_MUTED }}
              data-testid="sample-report-exec-summary"
            >
              Three sanitized findings from a real engagement. The two Serious citations &mdash; an unsecured propane cylinder adjacent to flammable storage and an unguarded shear point of operation &mdash; required immediate corrective action before the next production shift. The Documentation Gap covers a missing Safety Data Sheet for a hydraulic oil in active use at the production line.
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
              className="text-[11px] md:text-[12px] leading-relaxed italic mb-2"
              style={{ color: TEXT_SUBTLE }}
              data-testid="sample-report-footer-attribution"
            >
              Report ID: 62FC03EB &middot; Visit date: June 18, 2026 &middot; Client name withheld at client&rsquo;s request. Findings and penalty ranges are accurate to the engagement.
            </p>
            <p
              className="text-[11px] md:text-[12px] leading-relaxed italic"
              style={{ color: TEXT_SUBTLE }}
            >
              Penalty ranges reflect 2026 OSHA maximum penalty amounts and are provided for planning purposes only. GigLine Safety &amp; Compliance does not determine OSHA enforcement outcomes.
            </p>
          </footer>
        </article>

        {/* ── CTA BELOW THE REPORT ── */}
        <div className="mt-10 md:mt-12 text-center" data-testid="sample-report-cta-wrap">
          <Link
            to="/intake"
            className="inline-flex items-center justify-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold py-4 px-8 rounded-lg transition-colors text-[15px] md:text-base"
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
              style={{ color: '#1a6fc4' }}
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

      {/* Right: Photo */}
      <div className="md:col-span-4 space-y-3">
        <PhotoPlaceholder area={f.location.split('/')[0].trim()} photoUrl={f.photoUrl} />
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

const PhotoPlaceholder = ({ area, photoUrl }) => {
  if (photoUrl) {
    return (
      <div
        className="relative overflow-hidden"
        style={{
          border: `1px solid ${DOC_BORDER}`,
          aspectRatio: '4 / 3',
        }}
        data-testid="photo-placeholder"
      >
        <img
          src={photoUrl}
          alt={`Field photo — ${area}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* SAMPLE — ANONYMIZED badge */}
        <span
          className="absolute uppercase font-bold"
          style={{
            ...mono,
            fontSize: '9.5px',
            letterSpacing: '0.16em',
            color: '#fff',
            background: 'rgba(13,27,42,0.78)',
            padding: '4px 10px',
            top: '10px',
            left: '10px',
            borderRadius: '2px',
          }}
        >
          Sample &middot; Anonymized
        </span>
        {/* Area caption */}
        <span
          className="absolute uppercase font-bold"
          style={{
            ...mono,
            fontSize: '10px',
            letterSpacing: '0.14em',
            color: '#fff',
            background: 'rgba(13,27,42,0.78)',
            padding: '5px 10px',
            bottom: '10px',
            left: '10px',
            borderRadius: '2px',
          }}
        >
          {area}
        </span>
      </div>
    );
  }
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-4 py-10"
      style={{
        backgroundColor: '#F1F3F7',
        border: `1px dashed ${DOC_BORDER}`,
        minHeight: '280px',
        aspectRatio: '4 / 3',
      }}
      data-testid="photo-placeholder"
    >
      <Camera size={36} style={{ color: TEXT_SUBTLE }} className="mb-3" strokeWidth={1.6} />
      <p
        className="uppercase tracking-[3px] text-[11px] font-bold mb-1"
        style={{ ...mono, color: TEXT_SUBTLE }}
      >
        Field Photo
      </p>
      <p className="text-[13px] leading-snug" style={{ color: TEXT_SUBTLE }}>
        {area}
      </p>
    </div>
  );
};

export default SampleReportSection;
