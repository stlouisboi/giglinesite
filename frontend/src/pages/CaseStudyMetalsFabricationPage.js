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

const CASE_FAQS = [
  {
    q: 'What if my walkthrough turns up more than 13 findings?',
    a: "That depends on the facility. A newer operation with a plant manager actively building programs — like the one in this engagement — is going to look different from a 20-year-old facility that hasn't had a third-party review in a decade. More findings isn't a failure. It's information. The report prioritizes every finding by citation risk so you know what to fix first and what can wait. You leave with a ranked corrective action plan, not a list of problems with no direction attached.",
  },
  {
    q: 'Does an 80.3 compliance score mean the facility was OSHA-ready?',
    a: "Not exactly. The compliance score measures written-program coverage — how complete your documentation is relative to what OSHA expects to see. An 80.3 means solid coverage on paper with targeted gaps underneath. The physical findings (the propane cylinder, the unguarded shear blade) are captured separately in the priority ratings. A facility can score well on documentation and still have serious physical hazards. That's exactly why the walkthrough covers both.",
  },
  {
    q: 'What does the written report actually contain?',
    a: "Every finding documented against the applicable CFR standard, with the specific regulation cited. Photo documentation of physical hazards. A penalty exposure estimate per finding based on current OSHA rates. A corrective action for each finding with a recommended timeline. A compliance score and document coverage summary. A corrective action log pre-populated with every finding, ready to assign owners and track close-out. The report in this engagement ran 18 pages and was delivered four days after the walkthrough.",
  },
  {
    q: "What if I can't fix everything before an OSHA inspection arrives?",
    a: "Fix the P2 findings first — those are the serious citation risks with dollar exposure attached. A documented corrective action plan with assigned owners and target dates is evidence of good-faith effort. OSHA distinguishes between a facility that knew about a hazard and ignored it and one that identified it, documented it, and was actively working through remediation. The written report gives you that documentation. It doesn't guarantee anything, but it puts you in a materially better position than having no record at all.",
  },
  {
    q: 'Will GigLine share my findings with anyone?',
    a: "No. Findings are not shared, published, or referenced without written permission. Not with OSHA, not with your insurer, not with anyone. The report belongs to you. The engagement in this case study is referenced publicly only because the client permitted it — and the client name is withheld at their request. Every engagement operates the same way by default.",
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
        description="A metals fabrication facility in Statesville, NC brought GigLine in for a combined walkthrough and documentation review. 13 findings. 80.3 compliance score. Here's what the engagement delivered."
        canonical="/case-study/metals-fabrication-statesville"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'What a Safety Walkthrough Actually Finds — Statesville Metals Fabrication Case Study',
            description:
              "A 9-person metals fabrication facility in Statesville, NC brought GigLine in for a combined Safety Walkthrough and Documentation Review on June 18, 2026. 13 findings. 80.3 compliance score. Written report delivered in four days.",
            author: { '@type': 'Person', name: 'Vince Lawrence', url: 'https://www.giglinecompliance.com/about' },
            publisher: { '@type': 'Organization', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com' },
            datePublished: '2026-06-22',
            mainEntityOfPage: 'https://www.giglinecompliance.com/case-study/metals-fabrication-statesville',
            image: 'https://www.giglinecompliance.com/og-image.png',
            articleSection: 'Case Study',
            keywords: 'safety walkthrough, documentation review, metals fabrication, Statesville NC, IIPP, LOTO, SDS, HazCom, machine guarding, propane storage',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
              { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://www.giglinecompliance.com/case-studies' },
              { '@type': 'ListItem', position: 3, name: 'Statesville Metals Fabrication', item: 'https://www.giglinecompliance.com/case-study/metals-fabrication-statesville' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What if my walkthrough turns up more than 13 findings?',
                acceptedAnswer: { '@type': 'Answer', text: "That depends on the facility. A newer operation with a plant manager actively building programs — like the one in this engagement — is going to look different from a 20-year-old facility that hasn't had a third-party review in a decade. More findings isn't a failure. It's information. The report prioritizes every finding by citation risk so you know what to fix first and what can wait. You leave with a ranked corrective action plan, not a list of problems with no direction attached." },
              },
              {
                '@type': 'Question',
                name: 'Does an 80.3 compliance score mean the facility was OSHA-ready?',
                acceptedAnswer: { '@type': 'Answer', text: "Not exactly. The compliance score measures written-program coverage — how complete your documentation is relative to what OSHA expects to see. An 80.3 means solid coverage on paper with targeted gaps underneath. The physical findings (the propane cylinder, the unguarded shear blade) are captured separately in the priority ratings. A facility can score well on documentation and still have serious physical hazards. That's exactly why the walkthrough covers both." },
              },
              {
                '@type': 'Question',
                name: 'What does the written report actually contain?',
                acceptedAnswer: { '@type': 'Answer', text: "Every finding documented against the applicable CFR standard, with the specific regulation cited. Photo documentation of physical hazards. A penalty exposure estimate per finding based on current OSHA rates. A corrective action for each finding with a recommended timeline. A compliance score and document coverage summary. A corrective action log pre-populated with every finding, ready to assign owners and track close-out. The report in this engagement ran 18 pages and was delivered four days after the walkthrough." },
              },
              {
                '@type': 'Question',
                name: "What if I can't fix everything before an OSHA inspection arrives?",
                acceptedAnswer: { '@type': 'Answer', text: "Fix the P2 findings first — those are the serious citation risks with dollar exposure attached. A documented corrective action plan with assigned owners and target dates is evidence of good-faith effort. OSHA distinguishes between a facility that knew about a hazard and ignored it and one that identified it, documented it, and was actively working through remediation. The written report gives you that documentation. It doesn't guarantee anything, but it puts you in a materially better position than having no record at all." },
              },
              {
                '@type': 'Question',
                name: 'Will GigLine share my findings with anyone?',
                acceptedAnswer: { '@type': 'Answer', text: "No. Findings are not shared, published, or referenced without written permission. Not with OSHA, not with your insurer, not with anyone. The report belongs to you. The engagement in this case study is referenced publicly only because the client permitted it — and the client name is withheld at their request. Every engagement operates the same way by default." },
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
              GL-CA-ASS-2026-06 · Report ID 62FC03EB
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
            A metals fabrication facility in Statesville, NC brought GigLine in for a combined Safety Walkthrough and Documentation Review. Thirteen findings. One written report. No inspection ever happened &mdash; and that is the point.
          </p>

          <p
            className="italic text-[13px] md:text-[14px] leading-relaxed mb-6 max-w-3xl"
            style={{ color: TEXT_SUBTLE, ...serif }}
            data-testid="case-client-note"
          >
            Client name withheld at the client&rsquo;s request. All findings, citations, and outcomes are accurate to the engagement. Report ID: 62FC03EB. Visit date: June 18, 2026.
          </p>

          {/* ENGAGEMENT SNAPSHOT */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-10"
            style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
            data-testid="case-stats"
          >
            <StatItem icon={<MapPin size={14} />} label="Location" value="Statesville, NC" />
            <StatItem icon={<Users size={14} />} label="Headcount" value="9 employees" />
            <StatItem icon={<ClipboardCheck size={14} />} label="Scope" value="Walkthrough + Docs" />
            <StatItem icon={<Calendar size={14} />} label="Visit" value="Jun 18, 2026" />
          </div>

          {/* HEADLINE NUMBERS STRIP */}
          <div
            className="grid grid-cols-3 gap-0 mt-0"
            style={{ borderBottom: `1px solid ${BORDER}` }}
            data-testid="case-headline-numbers"
          >
            <NumberItem stat="13" label="Findings" sub="7 serious · 6 documentation" />
            <NumberItem stat="80.3" label="Compliance" sub="of 100" />
            <NumberItem stat="4" label="Days" sub="walkthrough → report" />
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
          <P>A 9-person metals fabrication operation in Statesville, NC. Two roll formers, two forklifts, an active flammables cabinet, a growing crew.</P>
          <P>The plant manager held an OSHA 30-Hour General Industry certification and had built out most of his safety documentation &mdash; some of it using AI-generated templates. He believed his programs were largely in order.</P>
          <P>He brought GigLine in to confirm that before production scaled.</P>

          {/* THE ENGAGEMENT */}
          <H2>The Engagement</H2>
          <P>Scope: Combined Safety Walkthrough and Documentation Review &mdash; one visit covering both the physical floor and the written programs.</P>
          <P>Visit date: June 18, 2026. Written report delivered June 22, 2026 &mdash; four days after the walkthrough.</P>

          {/* WHAT THE WALKTHROUGH FOUND */}
          <H2>What the Walkthrough Found</H2>
          <P>13 findings. 7 serious citation risk (P2). 6 documentation gaps (P3). 0 critical.</P>
          <P>Compliance score: 80.3 out of 100. Solid written-program coverage on paper. Targeted gaps underneath it that required immediate attention before full production ramp-up.</P>

          <H3>The two findings that required action before the next production shift:</H3>

          <div className="not-italic mt-6 mb-12 space-y-5" style={{ fontFamily: "'Manrope', sans-serif" }} data-testid="case-physical-findings">
            <Finding
              priority="P2 — Serious"
              n="Finding 10"
              cfr="29 CFR 1910.110(b)(6)(i)"
              penalty="$7,000 – $14,502 (Serious)"
              title="Unsecured propane cylinder adjacent to flammable storage cabinet"
              body="One propane cylinder stored upright with no chain, bracket, or restraint — positioned immediately adjacent to the flammable liquids storage cabinet with no separation distance. In a fire event, that arrangement is accelerant against fuel."
              corrective="Secure immediately. Relocate minimum 20 feet from the cabinet or install a 30-minute fire-rated barrier. Due date assigned: June 20, 2026 — two days out."
            />
            <Finding
              priority="P2 — Serious"
              n="Finding 12"
              cfr="29 CFR 1910.212(a)(1)"
              penalty="$7,000 – $14,502 (Serious)"
              title="Unguarded shear point of operation on roll former cut-off mechanism"
              body="The shear blade on the roll former cut-off mechanism was accessible during operation. A yellow perimeter rail was present on the outfeed side — it did not address the point of operation at the shear head."
              corrective="Install point-of-operation guarding before production employees operate the equipment. Due date: before next production run."
            />
          </div>

          <H3>The documentation picture:</H3>

          <P>The IIPP existed but was built from an AI-generated template. It listed the wrong facility address. It lacked required elements for management leadership, hazard identification, and program evaluation. It had not been reviewed against actual operations.</P>

          <P>The SDS library had one confirmed gap: Star Fire AW46 Hydraulic Oil &mdash; a product actively in use at the D-coiler hydraulic power unit, four five-gallon pails on the floor, no SDS on file. That gap alone carries a penalty exposure of <strong>$7,000 &ndash; $15,621</strong> under 29 CFR 1910.1200(g)(1).</P>

          <P>Three required documents were missing entirely: Heat Stress Prevention Plan, Bloodborne Pathogen Exposure Control Plan, and a Corrective Action Log.</P>

          <P>The Fire Prevention Plan, Container Label System, and Machine Guarding Documentation were present but each had discrete gaps against current standards.</P>

          {/* WHAT THE ENGAGEMENT DELIVERED */}
          <H2>What the Engagement Delivered</H2>
          <P>A written report documenting all 13 findings against applicable CFR standards, with photo documentation of the two highest-priority physical hazards and a corrective action summary pre-populated with every finding, priority rating, assigned due date where applicable, and recommended corrective action.</P>
          <P>The plant manager came into the engagement believing his programs were close to ready. The report showed him specifically where they weren&rsquo;t &mdash; before an OSHA inspector, a customer audit, or an incident did.</P>

          {/* WHAT THIS ENGAGEMENT IS NOT */}
          <H2>What This Engagement Is Not</H2>
          <P>No OSHA inspection followed this walkthrough. There is no citation outcome to report.</P>
          <P>The value is the written record &mdash; a documented baseline of what existed, what was missing, and what needed to change, in the plant manager&rsquo;s hands, before anyone outside the facility looked.</P>
          <P><strong>A written record of good-faith corrective action is defensible. A belief that things are in order is not.</strong></P>

          {/* THE PATTERN */}
          <H2>The Pattern</H2>
          <P>The findings at this facility are not unusual. AI-generated documents that don&rsquo;t match actual operations, missing machine-specific procedures, chemical hazards without complete SDS coverage, and physical hazards the team has stopped seeing &mdash; these are among the most frequently cited violations in general industry OSHA enforcement.</P>
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
            A Safety Walkthrough starts at $1,200.
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto text-white/65">
            Written report within 48 hours. Fixed quote before scheduling. Everything stays private.
          </p>
          <Link
            to="/intake?service=safety-walkthrough-report"
            className="inline-flex items-center justify-center gap-2 font-bold py-4 px-8 transition-all text-base md:text-lg"
            style={{
              backgroundColor: GOLD,
              color: NAVY,
              fontFamily: "'Manrope', sans-serif",
              boxShadow: '0 6px 18px rgba(197,160,89,0.28)',
            }}
            data-testid="case-cta-primary"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-white/45 mt-4 italic">
            Vince calls back within one business day.
          </p>
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
          Penalty Exposure
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
