import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, ChevronRight, AlertTriangle, Folder,
} from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };
const SLUG = 'osha-ready-control-system';
const FIT_CALL_HREF = `/services/${SLUG}/request`;
const KITS_HREF = '/citation-proof-kits';
const ONGOING_HREF = '/ongoing-safety-support';
const BLUE = '#2A52A0';
const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#f5f4f0';

/* ── Content ── */

const PROBLEM_CARDS = [
  { title: 'Programs copied from generic templates', body: "They read like someone else's operation because they are. Auditors and inspectors spot it immediately." },
  { title: 'SDSs stored in multiple locations', body: 'A binder near the mixing room. A folder on a shared drive. A PDF someone emailed. None of them current.' },
  { title: 'Training records that cannot be located', body: 'You know it happened. You cannot prove when, who conducted it, or which topics were covered.' },
  { title: 'Inspections without corrective-action follow-up', body: 'The forklift pre-shift log has entries. Nobody can point to what was done with the last three findings.' },
  { title: 'Documents with no owner or review date', body: 'Written five years ago by a plant manager who left. Nobody has touched it. Nobody knows if it is current.' },
  { title: 'Management unable to show what was implemented', body: 'When a customer, insurer, or OSHA officer asks for evidence, the answer is a search across desks and drives.' },
];

const COMPONENTS = [
  { title: 'Written Program Control', body: 'Site-specific programs with assigned owners, effective dates, review dates, and revision history.' },
  { title: 'SDS and Chemical Control', body: 'Chemical inventory, SDS library, employee-access instructions, and a process for adding or removing chemicals.' },
  { title: 'Training Proof', body: 'Training matrix, attendance records, required topics, renewal dates, and responsibility assignments.' },
  { title: 'Inspections and Corrections', body: 'Inspection forms, findings tracker, responsible owners, due dates, closure evidence, and verification.' },
  { title: 'Incident Management', body: 'Incident reporting, investigation documentation, corrective actions, and OSHA recordkeeping organization.' },
  { title: 'Document Governance', body: 'Master index, document-control log, permissions, archive procedures, and annual review calendar.' },
];

/* Folder structure rendered as a proper semantic tree so screen readers see it as a list.
   Kept as data so the layout can adapt on mobile. */
const FOLDER_TREE = [
  { code: '00', name: 'Start Here', note: 'Site index + admin quick-start' },
  { code: '01', name: 'Written Programs', note: 'LOTO, HazCom, PPE, EAP, and site-specific programs' },
  { code: '02', name: 'SDS and Chemical Inventory', note: 'Live library + master inventory' },
  { code: '03', name: 'Training Records', note: 'Matrix, attendance, renewal calendar' },
  { code: '04', name: 'Inspections and Corrective Actions', note: 'Findings tracker + closure evidence' },
  { code: '05', name: 'Incidents and Investigations', note: 'OSHA 300 / 301, RCA workups' },
  { code: '06', name: 'Emergency Preparedness', note: 'EAP, drills, contact rosters' },
  { code: '07', name: 'Equipment and Department Procedures', note: 'Machine-specific and departmental SOPs' },
  { code: '08', name: 'OSHA Recordkeeping', note: 'Postings, logs, retention calendar' },
  { code: '09', name: 'Contractor and Visitor Safety', note: 'Prequal, orientation, sign-in records' },
  { code: '10', name: 'Archived Documents', note: 'Retention-controlled archive' },
];

const PROCESS_STEPS = [
  { title: 'Discovery and scope', body: 'Review locations, operations, equipment, chemicals, workforce, existing documents, and known exposures.' },
  { title: 'Applicability and gap review', body: 'Determine which programs and supporting records appear applicable and identify what is missing or unusable.' },
  { title: 'System design', body: 'Build the folder structure, document index, trackers, responsibilities, permissions, and review schedule.' },
  { title: 'Program customization', body: 'Configure the included documents using verified client information.' },
  { title: 'Management review', body: 'Company leadership verifies responsibilities, contacts, procedures, and site-specific information.' },
  { title: 'Handoff and training', body: 'Train the designated administrator and show management how to operate and maintain the system.' },
  { title: 'Optional ongoing support', body: "Continue through GigLine's monthly Ongoing Safety Support if the program benefits from external maintenance." },
];

const SCOPE_INCLUDED = [
  'One location',
  'Up to 50 employees',
  'One client-owned digital platform',
  'Existing-document review',
  'Master document index',
  'Core folder architecture',
  'Defined written-program package',
  'Training matrix',
  'Corrective-action tracker',
  'Document-control log',
  'Review calendar',
  'Administrator handoff meeting',
];

const SCOPE_QUOTED_SEPARATELY = [
  'Multiple locations',
  'Large SDS-library migration',
  'Extensive program rewriting',
  'Employee training delivery',
  'Spanish or other translations',
  'Equipment-specific LOTO procedures',
  'Respiratory-protection implementation',
  'Industrial hygiene testing',
  'Engineering studies',
  'Historical record reconstruction',
];

const COMPARE_ROWS = [
  ['Ownership of the work', 'Client-led', 'GigLine-led'],
  ['Scope', 'Topic-specific', 'Company-wide'],
  ['Content', 'Templates and tools', 'Site-specific implementation'],
  ['Customization', 'Limited', 'Discovery and configuration'],
  ['Investment', '$150 to $600', 'Starting at $4,500'],
];

const BOUNDARY_LANGUAGE =
  'GigLine provides documentation, system-design, and implementation support based on client-supplied and observed information. The employer remains responsible for workplace conditions, employee training, hazard correction, program implementation, regulatory compliance, and maintaining accurate and current records. GigLine services are not OSHA approval and do not guarantee that citations will not occur.';

const Eyebrow = ({ children, color = BLUE, className = '' }) => (
  <p className={`uppercase font-bold mb-3 ${className}`} style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}>{children}</p>
);

const OshaReadyControlSystemPage = () => {
  return (
    <main data-testid="osha-ready-control-system-page">
      <SEO
        title="Safety Control System Buildout, Starting at $4,500 | GigLine"
        description="GigLine builds a site-specific Digital Safety Control System that connects written programs, SDS access, training records, inspections, corrective actions, and compliance documentation in one organized location. Starting at $4,500."
        canonical={`/services/${SLUG}`}
        schema={[
          { '@context': 'https://schema.org', '@type': 'Service', name: 'Safety Control System Buildout', provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com', telephone: '+13363298899' }, areaServed: { '@type': 'State', name: 'North Carolina' }, offers: { '@type': 'Offer', price: '4500', priceCurrency: 'USD', description: 'Safety Control System Buildout starting at $4,500. Site-specific Digital Safety Control System.' }, description: 'GigLine builds a site-specific Digital Safety Control System that connects written programs, SDS access, training records, inspections, corrective actions, and compliance documentation.' },
          { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' }, { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.giglinecompliance.com/services' }, { '@type': 'ListItem', position: 3, name: 'Safety Control System Buildout', item: `https://www.giglinecompliance.com/services/${SLUG}` }] },
        ]}
      />

      {/* ═══════ Hero ═══════ */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20" style={{ background: NAVY }} data-testid="ocs-hero">
        <div className="container max-w-6xl">
          <Eyebrow color={GOLD}>Safety Control System Buildout</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-5xl">
            <span className="block">Your safety documents</span>
            <span className="block" style={{ color: GOLD }}>should work together.</span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-6 max-w-3xl">
            GigLine builds a site-specific Digital Safety Control System that connects written programs, SDS access, training records, inspections, corrective actions, and compliance documentation in one organized location.
          </p>
          <p className="text-[15px] mb-9 max-w-3xl" style={{ color: GOLD }}>
            Custom implementation starting at $4,500.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Link
              to={FIT_CALL_HREF}
              className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              style={{ background: GOLD, color: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              data-testid="ocs-cta-hero"
            >
              Request a Fit Call <ArrowRight size={17} />
            </Link>
            <a
              href="#whats-built"
              className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors border border-white/40 hover:border-white text-white/85 hover:text-white"
              data-testid="ocs-cta-see-included"
            >
              See What&apos;s Included
            </a>
          </div>

          <p className="text-[13.5px] text-white/60 italic max-w-3xl leading-[1.7]">
            Designed for businesses that have safety documents but lack a reliable system for controlling, updating, and proving them.
          </p>
        </div>
      </section>

      {/* ═══════ Problem section ═══════ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ocs-problem">
        <div className="container max-w-6xl">
          <Eyebrow>The Gap</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: NAVY }}>
            Scattered documents are not a safety system.
          </h2>
          <p className="text-[15px] md:text-base text-[#1C2B2B]/70 leading-[1.85] mb-12 max-w-3xl">
            A folder full of policies does not prove that employees were trained, inspections were completed, hazards were corrected, or programs were reviewed. GigLine connects the documents to the people, responsibilities, records, and follow-through required to make them usable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
            {PROBLEM_CARDS.map((c, i) => (
              <div
                key={i}
                role="listitem"
                className="rounded-xl p-6 flex gap-3.5"
                style={{ background: CREAM, border: '1px solid #e8e5dd' }}
                data-testid={`ocs-problem-${i + 1}`}
              >
                <AlertTriangle size={18} strokeWidth={2} className="flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                <div className="min-w-0">
                  <h3 className="text-[15.5px] font-bold mb-1.5 leading-snug" style={{ color: NAVY }}>{c.title}</h3>
                  <p className="text-[13.5px] text-[#1C2B2B]/70 leading-[1.7]">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ What gets built (editorial 6-stage grid) ═══════ */}
      <section id="whats-built" className="py-16 md:py-24 lg:py-28" style={{ background: CREAM }} data-testid="ocs-components">
        <div className="container max-w-6xl">
          <div className="max-w-3xl mb-12 md:mb-16 lg:mb-20">
            <Eyebrow>Your Digital Safety Control System</Eyebrow>
            <h2 className="text-[32px] sm:text-4xl md:text-5xl leading-[1.05] mb-4 italic" style={{ ...serif, color: NAVY, letterSpacing: '-0.015em' }}>
              Six connected components. One usable system.
            </h2>
            <p className="text-[15px] md:text-lg leading-[1.65]" style={{ color: 'rgba(10,22,40,0.60)' }}>
              The Control System is built inside your company-owned Google Drive, SharePoint, OneDrive, or other approved platform. Your company retains ownership and access at every step.
            </p>
          </div>

          <div className="relative">
            <div
              className="hidden lg:block absolute left-0 right-0 h-px"
              style={{ top: '56px', background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.45) 6%, rgba(201,168,76,0.45) 94%, transparent 100%)' }}
              aria-hidden="true"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-12 sm:gap-y-14" role="list">
              {COMPONENTS.map((c, i) => {
                const num = String(i + 1).padStart(2, '0');
                return (
                  <article
                    key={i}
                    role="listitem"
                    className="relative"
                    data-testid={`ocs-component-${i + 1}`}
                  >
                    <div
                      aria-hidden="true"
                      className="select-none leading-none mb-3"
                      style={{
                        ...serif,
                        fontSize: 'clamp(72px, 11vw, 108px)',
                        fontWeight: 700,
                        color: 'transparent',
                        WebkitTextStroke: '1.5px rgba(10,22,40,0.35)',
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {num}
                    </div>
                    <span
                      aria-hidden="true"
                      className="hidden lg:block absolute"
                      style={{ top: '50px', left: '-2px', width: '14px', height: '14px', borderRadius: '50%', background: CREAM, border: `2px solid ${GOLD}` }}
                    />
                    <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', letterSpacing: '0.20em', color: GOLD }}>
                      Component {num}
                    </p>
                    <h3 className="text-[24px] sm:text-[26px] md:text-[28px] lg:text-[26px] xl:text-[28px] leading-[1.08] mb-3 italic" style={{ ...serif, color: NAVY, letterSpacing: '-0.005em' }}>
                      {c.title}.
                    </h3>
                    <p className="text-[14px] leading-[1.75] max-w-[32ch] sm:max-w-[30ch]" style={{ color: 'rgba(10,22,40,0.70)' }}>
                      {c.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Folder structure — responsive semantic tree ═══════ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ocs-folder-structure">
        <div className="container max-w-6xl">
          <Eyebrow>Folder Architecture</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: NAVY }}>
            One structure everyone can navigate.
          </h2>
          <p className="text-[15px] text-[#1C2B2B]/70 leading-[1.85] mb-10 max-w-3xl">
            A numbered folder architecture that supervisors, administrators, and inspectors can all use without training. Rendered here as the top-level index; sub-folders and index files are configured during buildout.
          </p>

          <div className="rounded-xl overflow-hidden" style={{ background: NAVY, border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Folder size={16} className="text-white/60" />
              <p className="text-white text-[14px] font-semibold" style={mono}>Safety &amp; Compliance</p>
            </div>
            <ol className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }} aria-label="Digital Safety Control System folder index">
              {FOLDER_TREE.map((f, i) => (
                <li
                  key={f.code}
                  className="flex items-start gap-4 md:gap-6 px-5 md:px-7 py-4"
                  style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
                  data-testid={`ocs-folder-item-${f.code}`}
                >
                  <span className="flex-shrink-0 w-9 md:w-10 text-[13px] font-bold" style={{ ...mono, color: GOLD }} aria-hidden="true">
                    {f.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold text-[14.5px] md:text-[15px] leading-snug">{f.name}</p>
                    <p className="text-white/55 text-[12.5px] md:text-[13px] mt-1 leading-[1.6]">{f.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-[13px] text-[#1C2B2B]/65 leading-[1.75] mt-6 max-w-3xl">
            The system is built inside your company-owned Google Drive, SharePoint, OneDrive, or other approved platform. Your company retains ownership and access. GigLine configures the structure inside your tenant, never in a GigLine-controlled account.
          </p>
        </div>
      </section>

      {/* ═══════ Optional Physical Access Binder ═══════ */}
      <section className="py-16 md:py-20" style={{ background: CREAM }} data-testid="ocs-optional-binder">
        <div className="container max-w-4xl">
          <Eyebrow>Optional Add-On</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-extrabold leading-[1.2] mb-4 tracking-tight" style={{ color: NAVY }}>
            Optional Physical Access Binder
          </h2>
          <p className="text-[15px] text-[#1C2B2B]/75 leading-[1.85] mb-3">
            A controlled printed mirror of selected emergency, employee-access, or floor-use documents can be added when the facility needs reliable access away from computers.
          </p>
          <p className="text-[13.5px] text-[#1C2B2B]/60 leading-[1.7]">
            The physical component is quoted separately based on the number of binders, programs, locations, and printing requirements. The digital Control System remains the source of truth; the binder is a controlled printed subset, not a duplicate of every record.
          </p>
        </div>
      </section>

      {/* ═══════ How implementation works (7 steps) ═══════ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ocs-process">
        <div className="container max-w-6xl">
          <Eyebrow>How Implementation Works</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight max-w-4xl" style={{ color: NAVY }}>
            Seven steps. Fixed scope. One clean handoff.
          </h2>
          <ol className="space-y-4" aria-label="Implementation process">
            {PROCESS_STEPS.map((s, i) => (
              <li
                key={i}
                className="rounded-xl p-6 flex gap-5"
                style={{ background: CREAM, border: '1px solid #e8e5dd' }}
                data-testid={`ocs-step-${i + 1}`}
              >
                <p className="flex-shrink-0 font-extrabold leading-none" style={{ ...mono, fontSize: '30px', color: GOLD }} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className="min-w-0">
                  <h3 className="text-[16.5px] font-bold mb-2 leading-snug" style={{ color: NAVY }}>{s.title}</h3>
                  <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.75]">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════ Starting scope ═══════ */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="ocs-scope">
        <div className="container max-w-6xl">
          <Eyebrow>Starting Scope</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: NAVY }}>
            What &ldquo;starting at $4,500&rdquo; actually means.
          </h2>
          <p className="text-[15px] text-[#1C2B2B]/70 leading-[1.85] mb-12 max-w-3xl">
            $4,500 is the entry price. Final scope and fixed price are determined after the Fit Call. This section makes both sides of the line clear before we ever get on that call.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl p-6 md:p-8 bg-white" style={{ border: '1px solid #e8e5dd' }} data-testid="ocs-scope-included">
              <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.18em', color: BLUE }}>Starting Implementation Includes</p>
              <ul className="space-y-2.5">
                {SCOPE_INCLUDED.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#1C2B2B]/85 leading-[1.65]" data-testid={`ocs-scope-included-${i + 1}`}>
                    <ChevronRight size={15} className="flex-shrink-0 mt-1" style={{ color: BLUE }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-6 md:p-8 bg-white" style={{ border: '1px solid #e8e5dd' }} data-testid="ocs-scope-separate">
              <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.18em', color: '#a56b18' }}>Quoted Separately</p>
              <ul className="space-y-2.5">
                {SCOPE_QUOTED_SEPARATELY.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#1C2B2B]/75 leading-[1.65]" data-testid={`ocs-scope-separate-${i + 1}`}>
                    <ChevronRight size={15} className="flex-shrink-0 mt-1" style={{ color: '#a56b18' }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Kits vs Control System comparison ═══════ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ocs-compare">
        <div className="container max-w-6xl">
          <Eyebrow>Readiness Kits vs Control System</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: NAVY }}>
            Two shapes of help. One clear line between them.
          </h2>
          <p className="text-[15px] text-[#1C2B2B]/70 leading-[1.85] mb-10 max-w-3xl">
            The Citation-Proof Kits ($150 to $600) are self-serve, topic-specific templates for teams that will do the work themselves. The Control System is a company-wide, GigLine-led implementation. Both are valid entry points.
          </p>

          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e8e5dd' }}>
            <table className="w-full text-left" data-testid="ocs-compare-table">
              <thead>
                <tr style={{ background: CREAM }}>
                  <th className="px-5 py-4 text-[13px] font-bold uppercase" style={{ ...mono, letterSpacing: '0.12em', color: '#5a6878' }}>&nbsp;</th>
                  <th className="px-5 py-4 text-[13.5px] font-bold" style={{ color: NAVY }}>Readiness Kits</th>
                  <th className="px-5 py-4 text-[13.5px] font-bold" style={{ color: BLUE }}>Control System</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #eeeae0' }} data-testid={`ocs-compare-row-${i + 1}`}>
                    <td className="px-5 py-4 text-[13.5px] font-semibold" style={{ color: '#5a6878' }}>{row[0]}</td>
                    <td className="px-5 py-4 text-[14px] text-[#1C2B2B]/85">{row[1]}</td>
                    <td className="px-5 py-4 text-[14px] font-semibold" style={{ color: NAVY }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={KITS_HREF} className="inline-flex items-center gap-1.5 text-[14px] font-bold" style={{ color: BLUE }} data-testid="ocs-compare-kits-link">
              Browse the Citation-Proof Kits <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ Boundary language ═══════ */}
      <section className="py-14 md:py-16" style={{ background: CREAM }} data-testid="ocs-boundary">
        <div className="container max-w-4xl">
          <Eyebrow>Scope Boundary</Eyebrow>
          <p className="text-[13.5px] text-[#1C2B2B]/70 leading-[1.85]">
            {BOUNDARY_LANGUAGE}
          </p>
        </div>
      </section>

      {/* ═══════ Closing CTA ═══════ */}
      <section className="py-20 md:py-24" style={{ background: NAVY }} data-testid="ocs-closing">
        <div className="container max-w-3xl text-center">
          <Eyebrow color={GOLD}>Ready to Build?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 tracking-tight text-white">
            Start with a Fit Call.
          </h2>
          <p className="text-base md:text-lg text-white/70 leading-[1.85] mb-10 max-w-3xl mx-auto">
            The Fit Call is a short conversation to determine whether the Control System is the right shape for your operation, and what the fixed scope and price look like once the work is defined. No obligation. Private engagement.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={FIT_CALL_HREF}
              className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ background: GOLD, color: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              data-testid="ocs-cta-closing-request"
            >
              Request a Fit Call <ArrowRight size={18} />
            </Link>
            <Link
              to={ONGOING_HREF}
              className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded-lg text-base transition-colors border border-white/40 hover:border-white text-white/85 hover:text-white"
              data-testid="ocs-cta-closing-ongoing"
            >
              See Ongoing Safety Support
            </Link>
          </div>
          <a href="tel:3363298899" className="inline-flex items-center gap-2 text-white/55 hover:text-white text-sm mt-8 transition-colors" data-testid="ocs-cta-phone">
            <Phone size={14} />Questions? Call or text Vince directly, (336) 329-8899
          </a>
        </div>
      </section>
    </main>
  );
};

export default OshaReadyControlSystemPage;
