import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Users, ClipboardCheck, Plus, Minus } from 'lucide-react';
import SEO from '../components/SEO';

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const BG_WARM = '#FAF7F1';
const BORDER = '#E5DDCD';
const TEXT_MUTED = 'rgba(10,22,40,0.72)';
const TEXT_SUBTLE = 'rgba(10,22,40,0.55)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

// GL-WEB-020, 13 corrective actions from an anonymized GigLine engagement (small NC metal fab, mid-2026).
// 12 of 13 closed within 4 days of the walkthrough. 1 open at reporting point (guarding upgrade, scheduled post-relocation).
// All chemical brands, internal system names, and machine identifiers generalized.
const CORRECTIVE_ACTIONS = [
  { id: 'CA-001', issue: 'Written Safety & Health Program required an update to reflect the operation\u2019s current facility location and address.', action: 'Updated all safety and training documents so the location and address were consistent across the program.', status: 'Closed, Day 4', open: false },
  { id: 'CA-002', issue: 'Chemical inventory gap: two hazardous chemical products used on the floor were not in either the digital library or the physical binder.', action: 'Added safety data sheets for both products to the physical binder and the digital library.', status: 'Closed, Day 4', open: false },
  { id: 'CA-003', issue: 'Two portable spray bottles containing a hazardous cleaner were observed unlabeled. Workplace containers require labeling that provides general information regarding the hazards.', action: 'Labeled both portable containers with the product identifier and hazard information consistent with 29 CFR 1910.1200(f)(6).', status: 'Closed, Day 4', open: false },
  { id: 'CA-004', issue: 'Machine guarding documentation was present but had gaps for one machine class.', action: 'Documented the guarding evaluation for the affected machine class and added machine guarding to new-hire training.', status: 'Closed, Day 4', open: false },
  { id: 'CA-005', issue: 'Fire prevention controls existed informally but were not captured in a written Fire Prevention Plan cross-referenced to the Emergency Action Plan.', action: 'Wrote a Fire Prevention Plan with job-specific tasks and cross-referenced it to the operation\u2019s Emergency Action Plan.', status: 'Closed, Day 4', open: false },
  { id: 'CA-006', issue: 'Heat stress controls existed informally. NC OSH guidance recommends a written heat illness prevention plan for outdoor and hot indoor work.', action: 'Wrote a heat stress prevention plan and added it to new-hire training.', status: 'Closed, Day 4', open: false },
  { id: 'CA-007', issue: 'No corrective action log was in use.', action: 'Created a corrective action log and established an employee training protocol for its use.', status: 'Closed, Day 4', open: false },
  { id: 'CA-008', issue: 'Near-miss / close-call reporting was informal, and no log was in use for identifying hazardous conditions before injury.', action: 'Created a near-miss log and reporting document; training scheduled.', status: 'Closed, Day 4', open: false },
  { id: 'CA-009', issue: 'Bulk hydraulic oil was stored on the production floor adjacent to production equipment without an SDS present at the point of use.', action: 'SDS added to the physical binder and the digital library.', status: 'Closed, Day 4', open: false },
  { id: 'CA-010', issue: 'A compressed-gas cylinder was stored upright without chain, bracket, or restraint, and was positioned adjacent to a flammables cabinet without adequate separation.', action: 'Relocated the cylinder to a storage area away from the flammables cabinet; a permanent restraint solution planned.', status: 'Closed, Day 4', open: false },
  { id: 'CA-011', issue: 'A Bloodborne Pathogen Exposure Control Plan was not present. The standard at 29 CFR 1910.1030 applies where employees have occupational exposure to blood or other potentially infectious materials.', action: 'Wrote a Bloodborne Pathogen Exposure Control Plan and added it to new-hire training.', status: 'Closed, Day 4', open: false },
  { id: 'CA-012', issue: 'A point-of-operation on one machine was accessible during operation. Point-of-operation guarding is required for equipment covered by 29 CFR 1910.212(a)(3).', action: 'A permanent guarding solution planned. The machine will be set in its final position at the operation\u2019s planned new facility before the guarding solution is installed.', status: 'Open at reporting point, scheduled post-relocation', open: true },
  { id: 'CA-013', issue: 'The Employee Safety Handbook required a material revision.', action: 'Updated the handbook and implemented a revision-number system for version tracking.', status: 'Closed, Day 4', open: false },
];

const CASE_FAQS = [
  {
    q: 'What if my walkthrough turns up more than 13 findings?',
    a: "That depends on the facility. A newer operation with a plant manager actively building programs, like the one in this engagement, is going to look different from a 20-year-old facility that hasn't had a third-party review in a decade. More findings isn't a failure. It's information. The report prioritizes every finding by citation risk so you know what to fix first and what can wait. You leave with a ranked corrective action plan, not a list of problems with no direction attached.",
  },
  {
    q: 'Does an 80.3 compliance score mean the facility was OSHA-ready?',
    a: "Not exactly. The compliance score measures written-program coverage, how complete your documentation is relative to what OSHA expects to see. An 80.3 means solid coverage on paper with targeted gaps underneath. The physical findings (the propane cylinder, the unguarded shear blade) are captured separately in the priority ratings. A facility can score well on documentation and still have serious physical hazards. That's exactly why the walkthrough covers both.",
  },
  {
    q: 'What does the written report actually contain?',
    a: "Every finding documented against the applicable CFR standard, with the specific regulation cited. Photo documentation of physical hazards. A penalty exposure estimate per finding based on OSHA published maximums. A corrective action for each finding with a recommended timeline. A compliance score and document coverage summary. A corrective action log pre-populated with every finding, ready to assign owners and track close-out. The report in this engagement ran 18 pages and was delivered four days after the walkthrough.",
  },
  {
    q: "What if I can't fix everything before an OSHA inspection arrives?",
    a: "Fix the P2 findings first, those are the serious citation risks with dollar exposure attached. A documented corrective action plan with assigned owners and target dates is evidence of good-faith effort. OSHA distinguishes between a facility that knew about a hazard and ignored it and one that identified it, documented it, and was actively working through remediation. The written report gives you that documentation. It doesn't guarantee anything, but it puts you in a materially better position than having no record at all.",
  },
  {
    q: 'Will GigLine share my findings with anyone?',
    a: "No. Findings are not shared, published, or referenced without written permission. Not with OSHA, not with your insurer, not with anyone. The report belongs to you. The engagement in this case study is referenced publicly only because the client permitted it, and the client name is withheld at their request. Every engagement operates the same way by default.",
  },
];

const CaseStudyMetalsFabricationPage = () => {
  return (
    <main
      data-testid="case-study-metals-fabrication"
      style={{ backgroundColor: BG_WARM, color: NAVY }}
    >
      <SEO
        title="What a Safety Walkthrough Actually Finds | GigLine Case Study"
        description="Anonymized case study of a small North Carolina metal fabrication operation. Combined walkthrough plus documentation review. 13 findings identified, 12 corrected within four days, one open at reporting."
        canonical="/case-study/metal-fabrication-readiness"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'What a Safety Walkthrough Actually Finds, Small NC Metal Fabrication Case Study',
            description:
              "Anonymized case study, small NC metal fabrication operation, walkthrough plus doc review. 13 findings identified. 80.3 compliance score. 12 of 13 corrective actions closed within four days. One finding remained open at the reporting point.",
            author: { '@type': 'Person', name: 'Vince Lawrence', url: 'https://www.giglinecompliance.com/about' },
            publisher: { '@type': 'Organization', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com' },
            datePublished: '2026-06-22',
            mainEntityOfPage: 'https://www.giglinecompliance.com/case-study/metal-fabrication-readiness',
            image: 'https://www.giglinecompliance.com/og-image.png',
            articleSection: 'Case Study',
            keywords: 'safety walkthrough, documentation review, metals fabrication, North Carolina, compliance readiness visit, LOTO, SDS, HazCom, machine guarding, propane storage',
            about: 'Anonymized illustrative example based on a real GigLine engagement. Client name and location withheld.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
              { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://www.giglinecompliance.com/case-studies' },
              { '@type': 'ListItem', position: 3, name: 'NC Metal Fabrication Case Study', item: 'https://www.giglinecompliance.com/case-study/metal-fabrication-readiness' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What if my walkthrough turns up more than 13 findings?',
                acceptedAnswer: { '@type': 'Answer', text: "That depends on the facility. A newer operation with a plant manager actively building programs, like the one in this engagement, is going to look different from a 20-year-old facility that hasn't had a third-party review in a decade. More findings isn't a failure. It's information. The report prioritizes every finding by citation risk so you know what to fix first and what can wait. You leave with a ranked corrective action plan, not a list of problems with no direction attached." },
              },
              {
                '@type': 'Question',
                name: 'Does an 80.3 compliance score mean the facility was OSHA-ready?',
                acceptedAnswer: { '@type': 'Answer', text: "Not exactly. The compliance score measures written-program coverage, how complete your documentation is relative to what OSHA expects to see. An 80.3 means solid coverage on paper with targeted gaps underneath. The physical findings (the propane cylinder, the unguarded shear blade) are captured separately in the priority ratings. A facility can score well on documentation and still have serious physical hazards. That's exactly why the walkthrough covers both." },
              },
              {
                '@type': 'Question',
                name: 'What does the written report actually contain?',
                acceptedAnswer: { '@type': 'Answer', text: "Every finding documented against the applicable CFR standard, with the specific regulation cited. Photo documentation of physical hazards. A penalty exposure estimate per finding based on OSHA published maximums. A corrective action for each finding with a recommended timeline. A compliance score and document coverage summary. A corrective action log pre-populated with every finding, ready to assign owners and track close-out. The report in this engagement ran 18 pages and was delivered four days after the walkthrough." },
              },
              {
                '@type': 'Question',
                name: "What if I can't fix everything before an OSHA inspection arrives?",
                acceptedAnswer: { '@type': 'Answer', text: "Fix the P2 findings first, those are the serious citation risks with dollar exposure attached. A documented corrective action plan with assigned owners and target dates is evidence of good-faith effort. OSHA distinguishes between a facility that knew about a hazard and ignored it and one that identified it, documented it, and was actively working through remediation. The written report gives you that documentation. It doesn't guarantee anything, but it puts you in a materially better position than having no record at all." },
              },
              {
                '@type': 'Question',
                name: 'Will GigLine share my findings with anyone?',
                acceptedAnswer: { '@type': 'Answer', text: "No. Findings are not shared, published, or referenced without written permission. Not with OSHA, not with your insurer, not with anyone. The report belongs to you. The engagement in this case study is referenced publicly only because the client permitted it, and the client name is withheld at their request. Every engagement operates the same way by default." },
              },
            ],
          },
        ]}
      />

      {/* ─────────── HERO ─────────── */}
      <section className="px-5 md:px-8 pt-16 pb-10 md:pt-24 md:pb-14" data-testid="case-hero">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Link
              to="/"
              className="uppercase font-bold tracking-[0.18em] hover:text-[#0A1628]"
              style={{ color: TEXT_SUBTLE, ...mono, fontSize: '11px' }}
            >
              Home
            </Link>
            <span style={{ color: TEXT_SUBTLE, fontSize: '11px' }}>/</span>
            <span
              className="uppercase font-bold tracking-[0.18em]"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              Case Study
            </span>
          </div>

          <p
            className="uppercase font-bold tracking-[0.28em] mb-5"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            <span style={{ borderBottom: `1px solid ${GOLD}`, paddingBottom: '4px' }}>
              Anonymized Engagement Example
            </span>
          </p>

          <h1
            className="font-bold leading-[1.1] mb-6 text-[32px] sm:text-[40px] md:text-[52px] tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
            data-testid="case-headline"
          >
            What a Safety Walkthrough Actually Finds
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed mb-6 max-w-3xl"
            style={{ color: TEXT_MUTED, ...serif }}
            data-testid="case-subhead"
          >
            A small North Carolina metal fabrication operation brought GigLine in for a combined Safety Walkthrough and Documentation Review. Thirteen findings identified. Twelve corrected within four days. One remained open at the reporting point. No inspection ever happened , and that is the point.
          </p>

          <p
            className="italic text-[13px] md:text-[14px] leading-relaxed mb-6 max-w-3xl"
            style={{ color: TEXT_SUBTLE, ...serif }}
            data-testid="case-client-note"
          >
            Anonymized example based on a real GigLine engagement. Client name, location, employee names, addresses, and identifying photographs withheld. Findings, priority ratings, and corrective-action tracking accurately reflect the engagement. Presented for illustration of GigLine's assessment and correction-tracking process. Not a guaranteed or typical customer outcome.
          </p>

          {/* ENGAGEMENT SNAPSHOT */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-10"
            style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
            data-testid="case-stats"
          >
            <StatItem icon={<MapPin size={14} />} label="Location" value="North Carolina" />
            <StatItem icon={<Users size={14} />} label="Headcount" value="Under 15 employees" />
            <StatItem icon={<ClipboardCheck size={14} />} label="Scope" value="Walkthrough + Docs" />
            <StatItem icon={<Calendar size={14} />} label="Report Turnaround" value="4 days" />
          </div>

          {/* HEADLINE NUMBERS STRIP */}
          <div
            className="grid grid-cols-3 gap-0 mt-0"
            style={{ borderBottom: `1px solid ${BORDER}` }}
            data-testid="case-headline-numbers"
          >
            <NumberItem stat="13" label="Findings Identified" sub="7 serious · 6 documentation" />
            <NumberItem stat="12 of 13" label="Corrected in 4 Days" sub="1 open at reporting point" />
            <NumberItem stat="80.3" label="Compliance Score" sub="of 100" />
          </div>

          {/* GL-WEB-022: Inline CTA, keeps the conversion ask visible above the long body */}
          <div className="mt-8 mb-2 flex flex-wrap items-center gap-4" data-testid="case-top-cta">
            <Link
              to="/intake?service=safety-walkthrough-report&utm_source=case-study&utm_medium=website&utm_campaign=case-top-cta"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded transition-colors text-white"
              style={{ background: '#102A43', fontFamily: "'Manrope', sans-serif", fontSize: '15px' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1F3F80')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2A52A0')}
            >
              Request a Walkthrough Like This <ArrowRight size={16} />
            </Link>
            <span className="text-sm" style={{ color: TEXT_SUBTLE, ...mono }}>
              From $1,300 · Findings in 48 hours
            </span>
          </div>
        </div>
      </section>

      {/* ─────────── BODY ─────────── */}
      <article
        className="px-5 md:px-8 pb-16 md:pb-20"
        data-testid="case-body"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        <div className="max-w-3xl mx-auto" style={{ color: NAVY }}>

          {/* THE SITUATION */}
          <H2>The Situation</H2>
          <P>A small North Carolina metal fabrication operation. Steel forming, cutting, and finishing. A growing crew. Leadership wanted an outside review before production scaled.</P>
          <P>The operation brought GigLine in to confirm the safety program held up to a structured floor and documentation review before scaling further.</P>

          {/* THE ENGAGEMENT */}
          <H2>The Engagement</H2>
          <P>Scope: a Compliance Readiness Visit, GigLine\u2019s combined Safety Walkthrough and Documentation Readiness Review, delivered as a single engagement.</P>
          <P>Written report delivered four days after the walkthrough. Historical turnaround; the current standard commitment for a Compliance Readiness Visit is a written report within 48 hours of the on-site visit.</P>

          {/* WHAT THE WALKTHROUGH FOUND */}
          <H2>What the Walkthrough Found</H2>
          <P>13 findings. 7 serious citation risk (P2). 6 documentation gaps (P3). 0 critical.</P>
          <P>Compliance score: 80.3 out of 100. Solid written-program coverage on paper. Targeted gaps underneath it that required immediate attention before full production ramp-up.</P>

          <H3>The two findings that required action before the next production shift:</H3>

          <div className="not-italic mt-6 mb-12 space-y-5" style={{ fontFamily: "'Manrope', sans-serif" }} data-testid="case-physical-findings">
            <Finding
              priority="P2, Serious"
              n="Finding 10"
              cfr="29 CFR 1910.110(b)(6)(i)"
              penalty="Up to $16,550 per violation (2026 Serious max)"
              title="Unsecured propane cylinder adjacent to flammable storage cabinet"
              body="One propane cylinder stored upright with no chain, bracket, or restraint, positioned immediately adjacent to the flammable liquids storage cabinet with no separation distance. In a fire event, that arrangement is accelerant against fuel."
              corrective="Secure immediately. Relocate minimum 20 feet from the cabinet or install a 30-minute fire-rated barrier. Assigned due date, two days out from the walkthrough."
            />
            <Finding
              priority="P2, Serious"
              n="Finding 12"
              cfr="29 CFR 1910.212(a)(1)"
              penalty="Up to $16,550 per violation (2026 Serious max)"
              title="Point-of-operation on one machine class accessible during operation"
              body="A point of operation was accessible during operation. A perimeter guard was present but did not address the point-of-operation exposure at the specific work zone."
              corrective="Install point-of-operation guarding before production employees operate the equipment. Due date: before next production run."
            />
          </div>

          <p
            className="not-italic text-[12px] md:text-[13px] leading-[1.55] italic mb-10"
            style={{ color: TEXT_MUTED, fontFamily: "'Manrope', sans-serif" }}
            data-testid="case-penalty-disclaimer"
          >
            Note: Penalty figures are educational estimates based on OSHA published maximum penalty schedules (29 CFR 1903.15 / 2026 adjusted rates). Actual penalties assessed by OSHA vary by employer size, history, good-faith effort, and gravity of the violation.
          </p>

          <H3>The documentation picture:</H3>

          <P>The Injury and Illness Prevention Program was present but had gaps: incorrect facility address, and missing or thin content in management leadership, hazard identification, and program evaluation sections. The document had not been reviewed against actual operations.</P>

          <P>The SDS library had one confirmed gap: a hazardous hydraulic-oil product actively in use at a production machine had no safety data sheet on file. That gap alone carries potential serious-citation exposure of <strong>up to $16,550 per violation</strong> under 29 CFR 1910.1200(g)(1), per the 2026 OSHA maximum penalty schedule.</P>

          <P>Three documents recommended for the operation were missing entirely: a Heat Stress Prevention Plan, a Bloodborne Pathogen Exposure Control Plan (applicable at 29 CFR 1910.1030 where employees have occupational exposure), and a Corrective Action Log (a GigLine readiness practice).</P>

          <P>The Fire Prevention Plan, workplace container labeling system, and machine guarding documentation were present but each had discrete gaps against current standards.</P>

          {/* WHAT THE ENGAGEMENT DELIVERED */}
          <H2>What the Engagement Delivered</H2>
          <P>A written report documenting all 13 findings against applicable CFR standards, with photo documentation of the two highest-priority physical hazards and a corrective action summary pre-populated with every finding, priority rating, assigned due date where applicable, and recommended corrective action.</P>
          <P>The engagement documented specifically where the safety program and floor conditions needed work , before an OSHA inspector, a customer audit, or an incident did.</P>

          {/* AFTER THE REPORT */}
          <H2>After the Report</H2>
          <P>Twelve of 13 findings were closed within four days of the walkthrough , before the formal due date and without pausing production. One finding remained open at the reporting point , a point-of-operation guarding upgrade on one machine class , with a documented remediation plan: a permanent guarding solution to be installed after the machine is set in its final position at the operation&rsquo;s planned facility move.</P>
          <P>That&rsquo;s how a corrective action log is supposed to work. Findings documented. Owners assigned. Plans recorded. Progress trackable. Open items visible.</P>

          {/* GL-WEB-017, Standalone Corrective Action Log download (ungated) */}
          <div
            className="not-italic my-10"
            style={{ fontFamily: "'Manrope', sans-serif" }}
            data-testid="corrective-action-log-download-block"
          >
            <a
              href="/sample-corrective-action-log"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              style={{
                background: '#ffffff',
                color: NAVY,
                border: `2px solid ${GOLD}`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FBF6E7')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              data-testid="corrective-action-log-download-btn"
            >
              Download Sample Corrective Action Log (PDF)
            </a>
            <p
              className="text-[13px] mt-2.5"
              style={{ color: TEXT_SUBTLE }}
              data-testid="corrective-action-log-download-note"
            >
              No email required. Opens as PDF.
            </p>
          </div>

          {/* ─── GL-WEB-020: 4-stat outcomes bar (navy / gold accents) ─── */}
          <div
            className="not-italic my-12 grid grid-cols-2 md:grid-cols-4 gap-0 rounded-md overflow-hidden"
            style={{ background: NAVY, fontFamily: "'Manrope', sans-serif" }}
            data-testid="case-outcomes-bar"
          >
            {[
              { stat: '13', label: 'Findings Identified' },
              { stat: '12 of 13', label: 'Closed Within 4 Days' },
              { stat: '1', label: 'Open at Reporting Point' },
              { stat: '4 Days', label: 'Report Turnaround' },
            ].map((s, i) => (
              <div
                key={i}
                className="px-6 py-7 md:py-8 text-center"
                style={{
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                }}
                data-testid={`outcome-stat-${i}`}
              >
                <p
                  className="font-bold leading-none mb-2"
                  style={{ color: GOLD, fontSize: 'clamp(28px, 3.4vw, 38px)' }}
                >
                  {s.stat}
                </p>
                <p
                  className="uppercase tracking-[0.18em] font-bold"
                  style={{ color: 'rgba(255,255,255,0.72)', ...mono, fontSize: '10px' }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* ─── GL-WEB-020: Findings + Corrective Actions Table ─── */}
          <div className="not-italic mt-14" data-testid="case-corrective-actions">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              Findings &amp; Corrective Actions
            </p>
            <h2
              className="font-bold leading-tight mb-5 text-[26px] md:text-[32px]"
              style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
            >
              What We Found. What They Did.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.7] mb-8 max-w-3xl" style={{ color: TEXT_MUTED, ...serif }}>
              Every finding below was identified during the walkthrough. Corrective actions were assigned to the operation&rsquo;s plant manager. Twelve of 13 findings were closed within four days. One finding remained open at the reporting point pending the operation&rsquo;s planned facility move.
            </p>

            <div className="overflow-x-auto" style={{ border: `1px solid ${BORDER}`, borderRadius: '4px' }}>
              <table
                className="w-full text-left"
                style={{ fontFamily: "'Manrope', sans-serif", borderCollapse: 'collapse', minWidth: '720px' }}
                data-testid="corrective-actions-table"
              >
                <thead>
                  <tr style={{ background: NAVY, color: 'white' }}>
                    <th className="px-4 py-3 uppercase tracking-[0.16em]" style={{ ...mono, fontSize: '10.5px', width: '76px' }}>#</th>
                    <th className="px-4 py-3 uppercase tracking-[0.16em]" style={{ ...mono, fontSize: '10.5px' }}>Issue</th>
                    <th className="px-4 py-3 uppercase tracking-[0.16em]" style={{ ...mono, fontSize: '10.5px' }}>Action Taken</th>
                    <th className="px-4 py-3 uppercase tracking-[0.16em]" style={{ ...mono, fontSize: '10.5px', width: '152px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CORRECTIVE_ACTIONS.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{
                        background: i % 2 === 0 ? 'white' : '#FBFBF9',
                        borderTop: `1px solid ${BORDER}`,
                      }}
                      data-testid={`ca-row-${row.id}`}
                    >
                      <td className="px-4 py-4 align-top font-bold" style={{ color: NAVY, ...mono, fontSize: '12px' }}>{row.id}</td>
                      <td className="px-4 py-4 align-top text-[14px] leading-[1.55]" style={{ color: NAVY }}>{row.issue}</td>
                      <td className="px-4 py-4 align-top text-[14px] leading-[1.55]" style={{ color: TEXT_MUTED }}>{row.action}</td>
                      <td className="px-4 py-4 align-top">
                        <span
                          className="inline-block px-2.5 py-1 font-bold uppercase tracking-[0.12em]"
                          style={{
                            ...mono,
                            fontSize: '10px',
                            background: row.open ? 'rgba(197,160,89,0.18)' : 'rgba(34,128,84,0.12)',
                            color: row.open ? '#8a6a18' : '#1f6b48',
                            border: row.open ? `1px solid ${GOLD}` : '1px solid rgba(34,128,84,0.30)',
                            borderRadius: '2px',
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── GL-WEB-020: Outcome Block ─── */}
          <div className="not-italic mt-14" data-testid="case-outcome-block">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              Outcome
            </p>
            <h2
              className="font-bold leading-tight mb-5 text-[26px] md:text-[32px]"
              style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
            >
              From Inspection to Corrective Action in 4 Days.
            </h2>
            <div className="space-y-5 max-w-3xl" style={{ ...serif }}>
              <p className="text-[16px] md:text-[17px] leading-[1.72]" style={{ color: TEXT_MUTED }}>
                The operation closed 12 of 13 corrective actions within four days of the GigLine walkthrough , before the formal due date and without pausing production. One item, a shear blade point-of-operation guard, remained open at the reporting point, scheduled for installation after the operation completes its planned facility relocation.
              </p>
              <p className="text-[16px] md:text-[17px] leading-[1.72]" style={{ color: TEXT_MUTED }}>
                Twelve of 13 findings closed. Compliance score began at 80.3. The remaining gap is tied to a planned capital improvement rather than a documentation failure. Anonymized engagement, illustrative example. Not a guaranteed or typical outcome.
              </p>
            </div>
          </div>

          {/* Pull quote intentionally removed pending owner-verified verbatim quotation and written client permission. */}


          {/* SAMPLE REPORT CALLOUT */}
          <div
            className="not-italic my-12 p-7 md:p-8 rounded-md"
            style={{ background: 'white', border: `1px solid ${BORDER}`, fontFamily: "'Manrope', sans-serif" }}
            data-testid="case-sample-report-callout"
          >
            <p
              className="uppercase font-bold tracking-[0.28em] mb-3"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
            >
              See the Report Itself
            </p>
            <h3
              className="font-bold leading-tight mb-3 text-[20px] md:text-[24px]"
              style={{ color: NAVY }}
            >
              Want to see what an actual GigLine report looks like?
            </h3>
            <p className="text-[15px] md:text-base leading-[1.65] mb-5" style={{ color: TEXT_MUTED, ...serif }}>
              A redacted version of a real compliance report , facility name removed, every finding, CFR citation, penalty exposure, and corrective action intact. The format you&rsquo;d receive within 48 hours of your own walkthrough.
            </p>
            <Link
              to="/sample-report"
              className="inline-flex items-center gap-2 font-bold py-3 px-6 transition-all text-[14px] md:text-[15px]"
              style={{ background: NAVY, color: 'white' }}
              data-testid="case-sample-report-cta"
            >
              Download a Sample Report &rarr;
            </Link>
          </div>

          {/* WHAT THIS ENGAGEMENT IS NOT */}
          <H2>What This Engagement Is Not</H2>
          <P>No OSHA inspection followed this walkthrough. There is no citation outcome to report.</P>
          <P>The value is the written record , a documented baseline of what existed, what was missing, and what needed to change, in the plant manager&rsquo;s hands, before anyone outside the facility looked.</P>
          <P><strong>A written record of good-faith corrective action is defensible. A belief that things are in order is not.</strong></P>

          {/* THE PATTERN */}
          <H2>The Pattern</H2>
          <P>The findings at this operation are not unusual. Written programs that don&rsquo;t match actual operations, missing machine-specific procedures, chemical hazards without complete SDS coverage, and physical hazards the team has stopped seeing , these are among the most frequently cited violations in general industry OSHA enforcement.</P>
          <P>They show up across facilities of every size. They are also fixable. Most of them don&rsquo;t require a consultant to fix. They require knowing they exist.</P>

        </div>
      </article>

      {/* ─────────── FAQ BLOCK (case-study-anchored) ─────────── */}
      <section
        className="px-5 md:px-8 pb-16 md:pb-20"
        data-testid="case-faq-section"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div className="max-w-3xl mx-auto pt-14 md:pt-16">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-4"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            After You Read This
          </p>
          <h2
            className="font-bold leading-tight mb-10 text-[26px] md:text-[32px]"
            style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
          >
            What people ask after reading this engagement.
          </h2>

          <div className="space-y-3" data-testid="case-faq-list">
            {CASE_FAQS.map((item, i) => (
              <FAQItem key={i} idx={i + 1} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA BAND ─────────── */}
      <section
        className="px-5 md:px-8 py-16 md:py-20"
        style={{ backgroundColor: NAVY, color: 'white' }}
        data-testid="case-cta-section"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-5"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            Ready to see what&rsquo;s on your floor?
          </p>
          <h2
            className="text-2xl md:text-4xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            The equivalent scope today is a Compliance Readiness Visit, starting at $2,500.
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto text-white/65">
            The Compliance Readiness Visit combines the Safety Walkthrough and the Documentation Readiness Review into a single engagement, and it saves $500 compared with purchasing the two standard scopes separately. Written report within 48 hours of the on-site visit. Fixed quote before scheduling. Everything stays private.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/intake?service=compliance-readiness-visit"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 transition-all text-base md:text-lg"
              style={{
                backgroundColor: GOLD,
                color: NAVY,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 6px 18px rgba(197,160,89,0.28)',
              }}
              data-testid="case-cta-primary"
            >
              Request a Compliance Readiness Visit
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/intake?service=safety-walkthrough-report"
              className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 transition-all text-base md:text-lg"
              style={{
                border: '1px solid rgba(255,255,255,0.35)',
                color: 'white',
                fontFamily: "'Manrope', sans-serif",
              }}
              data-testid="case-cta-secondary"
            >
              Start with a Safety Walkthrough ($1,300, floor only)
            </Link>
          </div>
          <p className="text-xs md:text-sm text-white/50 mt-4 italic max-w-2xl mx-auto leading-relaxed">
            The Safety Walkthrough is a narrower floor-only engagement; it does not review your written programs or training records. If both the floor and the paper need review, the Compliance Readiness Visit is the closer match to the engagement in this case study.
          </p>
          <p className="text-sm text-white/45 mt-4 italic">
            Vince calls back within one business day.
          </p>
        </div>
      </section>

      {/* ─────────── ASSESSOR BYLINE (veteran badge) ─────────── */}
      <section
        className="px-5 md:px-8 py-12 md:py-14"
        style={{ backgroundColor: '#FBFBF9', borderTop: `1px solid ${BORDER}` }}
        data-testid="case-assessor-byline"
      >
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
          <img
            src="/assets/veteran-owned-badge.webp"
            alt="Veteran-Owned Company"
            width="180"
            height="115"
            loading="lazy"
            className="flex-shrink-0 rounded-sm"
            style={{ maxWidth: '180px', height: 'auto' }}
            data-testid="case-veteran-badge"
          />
          <div>
            <p
              className="uppercase font-bold tracking-[0.24em] mb-2"
              style={{ color: GOLD, ...mono, fontSize: '10.5px' }}
            >
              About the Assessor
            </p>
            <p
              className="text-lg md:text-xl font-bold mb-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
            >
              Vince Lawrence, U.S. Navy Veteran, OSHA 30-Hour Outreach Trained
            </p>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(11,31,51,0.66)' }}>
              Founder of GigLine Safety &amp; Compliance. Twenty-plus years across manufacturing, construction, and utility environments. Every walkthrough, report, and corrective-action call on this page was made by Vince personally.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── REVIEW STRIP ─────────── */}
      <section
        className="px-5 md:px-8 py-10 md:py-12 border-t"
        style={{ backgroundColor: '#0F1A26', borderColor: 'rgba(255,255,255,0.06)' }}
        data-testid="case-review-strip"
      >
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
          <div>
            <p
              className="uppercase font-bold tracking-[0.22em] mb-2"
              style={{ color: GOLD, ...mono, fontSize: '10px' }}
            >
              Worked with GigLine?
            </p>
            <p className="text-sm md:text-base text-white/70 leading-relaxed">
              A short note on Google helps other plant managers in the Triad find this work.
            </p>
          </div>
          <a
            href="https://g.page/r/CdlAYUu_I3xpEAI/review?utm_source=case-study&utm_medium=website&utm_campaign=review-request"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold py-2.5 px-5 rounded transition-all text-sm whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(201,168,76,0.12)',
              color: GOLD,
              border: `1px solid ${GOLD}`,
              fontFamily: "'Manrope', sans-serif",
            }}
            data-testid="case-google-review-cta"
          >
            <span>★</span> Leave a Google review
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </main>
  );
};

// ── Components ────────────────────────────────────
const StatItem = ({ icon, label, value }) => (
  <div className="py-4 md:py-5 px-1 md:px-3">
    <div className="flex items-center gap-1.5 mb-2" style={{ color: GOLD }}>
      {icon}
      <span
        className="uppercase font-bold tracking-[0.18em]"
        style={{ ...mono, fontSize: '10px' }}
      >
        {label}
      </span>
    </div>
    <p className="text-[15px] md:text-base font-bold" style={{ color: NAVY }}>
      {value}
    </p>
  </div>
);

const NumberItem = ({ stat, label, sub }) => (
  <div className="py-5 md:py-6 px-1 md:px-3 text-center">
    <p
      className="font-extrabold leading-none mb-2"
      style={{ color: NAVY, ...mono, fontSize: '32px' }}
    >
      {stat}
    </p>
    <p
      className="uppercase font-bold tracking-[0.18em] mb-1"
      style={{ color: GOLD, ...mono, fontSize: '10px' }}
    >
      {label}
    </p>
    <p
      className="text-[11px] md:text-[12px]"
      style={{ color: TEXT_SUBTLE, ...mono }}
    >
      {sub}
    </p>
  </div>
);

const H2 = ({ children }) => (
  <h2
    className="font-bold leading-tight mt-12 mb-4 text-[26px] md:text-[32px]"
    style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
  >
    {children}
  </h2>
);

const H3 = ({ children }) => (
  <h3
    className="font-bold leading-tight mt-8 mb-3 text-[18px] md:text-[20px]"
    style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
  >
    {children}
  </h3>
);

const P = ({ children, className = '' }) => (
  <p
    className={`text-[17px] md:text-[18px] leading-[1.7] mb-4 ${className}`}
    style={{ color: TEXT_MUTED, ...serif }}
  >
    {children}
  </p>
);

export default CaseStudyMetalsFabricationPage;

const FAQItem = ({ idx, q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="overflow-hidden transition-colors"
      style={{
        backgroundColor: 'white',
        border: `1px solid ${open ? GOLD : BORDER}`,
        boxShadow: '0 1px 2px rgba(10,22,40,0.03)',
      }}
      data-testid={`case-faq-item-${idx}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 text-left px-5 md:px-6 py-5 md:py-6 hover:bg-[#FAF7F1] transition-colors"
        aria-expanded={open}
        data-testid={`case-faq-trigger-${idx}`}
      >
        <span
          className="font-bold text-[16px] md:text-[18px] leading-snug pr-2"
          style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
        >
          {q}
        </span>
        <span
          className="flex-shrink-0 mt-1"
          style={{ color: GOLD }}
          aria-hidden="true"
        >
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      {open && (
        <div
          className="px-5 md:px-6 pb-6 pt-1"
          data-testid={`case-faq-answer-${idx}`}
        >
          <div
            className="w-10 h-px mb-4"
            style={{ background: GOLD }}
          />
          <p
            className="text-[15px] md:text-[16px] leading-[1.7]"
            style={{ color: TEXT_MUTED, ...serif }}
          >
            {a}
          </p>
        </div>
      )}
    </div>
  );
};

const Finding = ({ priority, n, cfr, penalty, title, body, corrective }) => (
  <div
    className="p-6 md:p-7"
    style={{
      backgroundColor: 'white',
      border: `1px solid ${BORDER}`,
      boxShadow: '0 1px 2px rgba(10,22,40,0.03)',
    }}
  >
    <div className="flex items-center gap-3 mb-3 flex-wrap">
      <span
        className="uppercase font-bold tracking-[0.18em] px-2 py-1"
        style={{
          color: NAVY,
          backgroundColor: 'rgba(197,160,89,0.18)',
          border: `1px solid ${GOLD}`,
          ...mono,
          fontSize: '10px',
        }}
      >
        {priority}
      </span>
      <span
        className="uppercase font-bold tracking-[0.18em]"
        style={{ color: TEXT_SUBTLE, ...mono, fontSize: '10px' }}
      >
        {n}
      </span>
      <span
        className="uppercase font-bold tracking-[0.18em]"
        style={{ color: GOLD, ...mono, fontSize: '10px' }}
      >
        {cfr}
      </span>
    </div>
    <h3
      className="font-bold mb-3 text-[18px] md:text-[20px] leading-snug"
      style={{ color: NAVY, fontFamily: "'Manrope', sans-serif" }}
    >
      {title}
    </h3>
    <p
      className="text-[15px] md:text-[16px] leading-[1.65] mb-4"
      style={{ color: TEXT_MUTED, ...serif }}
    >
      {body}
    </p>
    <div
      className="pt-3 mt-2"
      style={{ borderTop: `1px solid ${BORDER}` }}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="uppercase font-bold tracking-[0.18em]"
          style={{ color: GOLD, ...mono, fontSize: '10px' }}
        >
          Estimated Penalty Exposure
        </span>
        <span
          className="text-[13px] font-semibold"
          style={{ color: NAVY, ...mono }}
        >
          {penalty}
        </span>
      </div>
      <p
        className="uppercase font-bold tracking-[0.18em] mb-1.5 mt-3"
        style={{ color: GOLD, ...mono, fontSize: '10px' }}
      >
        Corrective Action
      </p>
      <p
        className="text-[14px] md:text-[15px] leading-[1.65]"
        style={{ color: TEXT_MUTED, ...serif }}
      >
        {corrective}
      </p>
    </div>
  </div>
);
