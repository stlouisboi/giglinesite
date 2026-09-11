import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, FileCheck, FolderOpen, ClipboardList, ListChecks, Check, X, FileSearch, AlertCircle, GitCompare, FileWarning, TrendingUp, ArrowRightCircle } from 'lucide-react';
import SEO from '../components/SEO';
import DiagnosticComparisonCard from '../components/DiagnosticComparisonCard';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#F9F8F6';
const BLUE = '#2A52A0';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const meta = {
  title: 'Documentation Readiness Review, $1,700 Fixed Price | GigLine',
  description: 'Documentation-only diagnostic. Written programs, records, training documentation, and inspection-readiness organization reviewed against OSHA. No floor inspection, no rewriting, no implementation. Fixed $1,700.',
  canonical: '/services/documentation-readiness-review',
};

const schema = [{
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Documentation Readiness Review',
  provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com', telephone: '+13363298899' },
  areaServed: { '@type': 'State', name: 'North Carolina' },
  serviceType: 'Safety Documentation Diagnostic',
  description: 'Documentation-only safety diagnostic. Reviews agreed written programs, required records, training documentation, and inspection-readiness organization. Does not include floor inspection, custom writing, implementation, or training.',
  offers: { '@type': 'Offer', price: '1700', priceCurrency: 'USD', description: 'Documentation Readiness Review, fixed price $1,700.' },
}];

const INCLUDED = [
  { Icon: FileCheck, title: 'Written program review', body: 'Review of the agreed written safety programs against OSHA content and completeness requirements.' },
  { Icon: FolderOpen, title: 'Required records review', body: 'Assessment of training rosters, inspection logs, corrective-action tracking, and OSHA recordkeeping files.' },
  { Icon: ClipboardList, title: 'Training documentation review', body: 'Verification that training assignments, sign-offs, refresher cadence, and role coverage are documented and retrievable.' },
  { Icon: ListChecks, title: 'Inspection-readiness organization', body: 'Structural review of how documents are named, stored, permissioned, and retrieved during an OSHA inspection.' },
];

const NOT_INCLUDED = [
  'Physical floor inspection or hazard walk',
  'Custom writing of new programs or rewriting existing ones',
  'Implementation of any findings',
  'Employee training delivery',
  'Legal advice or regulatory representation',
  'A compliance certification or guarantee',
];

const REVIEW_PRODUCES = [
  { Icon: FileSearch, title: 'Documents reviewed', body: 'A named list of every written program, record type, and supporting document assessed during the review, with source and version noted where available.' },
  { Icon: AlertCircle, title: 'Missing or incomplete required elements', body: 'Each program measured against OSHA content and completeness requirements. Missing sections, unnamed responsibilities, or incomplete elements are documented against the specific citation.' },
  { Icon: GitCompare, title: 'Conflicting dates, responsibilities, or procedures', body: 'Where written programs contradict each other, contradict posted procedures, or name responsibilities that do not match the current organizational chart, the conflict is flagged with both sources.' },
  { Icon: FileWarning, title: 'Records that cannot be readily produced', body: 'Records that are missing, misfiled, unlabeled, unsigned, or cannot be retrieved within an inspection-response timeframe are documented as retrieval failures, not paperwork failures.' },
  { Icon: TrendingUp, title: 'Priority level for each finding', body: 'Every finding is assigned a priority using a fixed three-tier scale so leadership can decide what to close first without re-reading the whole report.' },
  { Icon: ArrowRightCircle, title: 'Recommended next action', body: 'Each finding carries a specific recommended next action, written as something a named owner at the facility could execute. GigLine does not implement.' },
];

const DocumentationReadinessReviewPage = () => (
  <main data-testid="doc-review-page">
    <SEO title={meta.title} description={meta.description} canonical={meta.canonical} schema={schema} />

    <section className="py-20 md:py-28" style={{ background: NAVY }} data-testid="drr-hero">
      <div className="container max-w-5xl">
        <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '11px', letterSpacing: '0.22em', color: GOLD }}>
          FIND &middot; Documentation Readiness Review
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Your paperwork, reviewed against what OSHA actually asks for.
        </h1>
        <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
          A documentation-only diagnostic. GigLine reviews the agreed written programs, required records, and training documentation, then reports where the paperwork will hold up and where it will not.
        </p>

        <div className="rounded-xl p-7 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr] gap-7 md:gap-10 items-start mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }} data-testid="drr-price-block">
          <div>
            <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: GOLD }}>Fixed Price</p>
            <p className="text-3xl md:text-[34px] font-extrabold text-white leading-none mb-3 tracking-tight" style={mono}>$1,700</p>
            <p className="text-[13px] text-white/55 leading-[1.6]">Written report delivered within 5 business days.</p>
          </div>
          <div>
            <p className="text-[14.5px] text-white/80 leading-[1.75]">
              Need the floor reviewed too? The <Link to="/services/compliance-readiness-visit" className="font-bold underline" style={{ color: GOLD }} data-testid="drr-crv-link">Compliance Readiness Visit</Link> covers both physical conditions and documentation in a single visit from <span className="font-bold text-white" style={mono}>$2,500</span>, saving <span className="font-bold text-white" style={mono}>$500</span> versus booking separately.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link to="/intake?service=documentation-readiness-review" className="inline-flex items-center gap-2 bg-white hover:bg-white/95 font-bold px-7 py-4 rounded-lg transition-colors" style={{ color: NAVY }} data-testid="drr-hero-cta">
            Request a Fixed Quote
            <ArrowRight size={18} />
          </Link>
          <a href="tel:3363298899" className="inline-flex items-center gap-2 text-white/85 hover:text-white font-semibold text-base underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors" data-testid="drr-hero-phone">
            <Phone size={16} />(336) 329-8899
          </a>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-24 bg-white" data-testid="drr-included">
      <div className="container max-w-5xl">
        <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: '#5B6B7A' }}>What&apos;s Included</p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-10 tracking-tight" style={{ color: NAVY }}>Four documentation deliverables.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INCLUDED.map((d, i) => {
            const Icon = d.icon || d.Icon;
            return (
              <div key={i} className="rounded-xl p-6" style={{ background: CREAM, border: '1px solid #e8e5dd' }} data-testid={`drr-included-${i}`}>
                <div className="flex items-center justify-center mb-4" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(42,82,160,0.10)', color: BLUE }}>
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: NAVY }}>{d.title}</h3>
                <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.7]">{d.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="py-20 md:py-24" style={{ background: '#FBFAF7' }} data-testid="drr-produces">
      <div className="container max-w-5xl">
        <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: '#5B6B7A' }}>What Your Review Produces</p>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight" style={{ color: NAVY }}>
          What lands in your inbox at the end.
        </h2>
        <p className="text-[15px] leading-[1.75] mb-10 max-w-2xl" style={{ color: 'rgba(28,43,43,0.72)' }}>
          The written report structures every finding the same way, so leadership can act on it Monday morning without re-reading the whole document.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {REVIEW_PRODUCES.map((d, i) => {
            const Icon = d.Icon;
            return (
              <div key={i} className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e8e5dd' }} data-testid={`drr-produces-${i}`}>
                <div className="flex items-center justify-center mb-4" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(42,82,160,0.10)', color: BLUE }}>
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: NAVY }}>{d.title}</h3>
                <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.7]">{d.body}</p>
              </div>
            );
          })}
        </div>

        {/* Illustrative sample finding (NOT a client quote or testimonial) */}
        <div
          className="rounded-xl p-6 md:p-7 mb-10"
          style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.35)' }}
          data-testid="drr-produces-example"
        >
          <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10px', letterSpacing: '0.20em', color: '#8B6F1F' }}>
            Illustrative Sample Finding
          </p>
          <p className="text-[13px] italic mb-3" style={{ color: 'rgba(28,43,43,0.55)' }}>
            The paragraph below is a written example of how a typical finding is documented. It is not a client engagement, testimonial, or case study.
          </p>
          <p className="text-[15px] leading-[1.8]" style={{ color: NAVY }}>
            <span className="font-bold">Example:</span> The written HazCom program named a paper SDS binder as the employee access method, but the binder location had changed and second-shift employees could not identify the backup-access process. The review would document the conflict, assign its priority, and identify the corrective action needed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            to="/intake?service=documentation-readiness-review"
            className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg text-[14px] transition-colors"
            style={{ background: NAVY, color: '#ffffff' }}
            data-testid="drr-produces-cta"
          >
            Request a Documentation Readiness Review
            <ArrowRight size={16} />
          </Link>
          <a href="tel:3363298899" className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: NAVY }} data-testid="drr-produces-phone">
            <Phone size={14} />(336) 329-8899
          </a>
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20" style={{ background: CREAM }} data-testid="drr-not-included">
      <div className="container max-w-4xl">
        <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: '#5B6B7A' }}>Not Included</p>
        <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.15] mb-3 tracking-tight" style={{ color: NAVY }}>What this diagnostic does not do.</h2>
        <p className="text-[15px] leading-[1.75] mb-8" style={{ color: 'rgba(28,43,43,0.72)' }}>
          Documentation Readiness Review is a paperwork diagnostic. It does not attempt to substitute for physical inspection, program writing, training delivery, implementation, legal counsel, or a compliance conclusion.
        </p>
        <ul className="space-y-3">
          {NOT_INCLUDED.map((item, i) => (
            <li key={i} className="flex items-start gap-3" data-testid={`drr-not-included-${i}`}>
              <X size={16} className="mt-1 flex-shrink-0" style={{ color: '#B3ADA0' }} strokeWidth={2.4} />
              <span className="text-[14.5px]" style={{ color: NAVY }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <DiagnosticComparisonCard highlightSlug="doc" showCombinedSavings={true} showCta={true} />

    <section className="py-16 md:py-20 bg-white" data-testid="drr-closing">
      <div className="container max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4 tracking-tight" style={{ color: NAVY }}>Ready to see where your paperwork stands?</h2>
        <p className="text-[15px] leading-[1.7] mb-8 max-w-xl mx-auto" style={{ color: 'rgba(28,43,43,0.72)' }}>Fixed $1,700. Report within 5 business days. Private engagement.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/intake?service=documentation-readiness-review" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg text-[14px] transition-colors" style={{ background: NAVY, color: '#ffffff' }} data-testid="drr-closing-cta">Request a Fixed Quote<ArrowRight size={16} /></Link>
          <a href="tel:3363298899" className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: NAVY }} data-testid="drr-closing-phone"><Phone size={14} />(336) 329-8899</a>
        </div>
      </div>
    </section>
  </main>
);

export default DocumentationReadinessReviewPage;
