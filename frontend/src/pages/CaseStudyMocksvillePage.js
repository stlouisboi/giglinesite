import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Calendar, MapPin, Users, Check } from 'lucide-react';
import SEO from '../components/SEO';

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const BG_WARM = '#FAF7F1';
const BG_SOFT = '#F2EDE3';
const BORDER = '#E5DDCD';
const TEXT_MUTED = 'rgba(10,22,40,0.72)';
const TEXT_SUBTLE = 'rgba(10,22,40,0.55)';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const CaseStudyMocksvillePage = () => {
  return (
    <main
      data-testid="case-study-mocksville"
      style={{ backgroundColor: BG_WARM, color: NAVY }}
    >
      <SEO
        title="OSHA Inspection Case Study: Mocksville Plastics Manufacturer Cleared with Zero Citations | GigLine"
        description="A 60-person plastics manufacturer in Mocksville, NC had a scheduled OSHA inspection six weeks away. After a GigLine walkthrough flagged 4 high-risk findings, all were fixed before inspection day. Outcome: zero citations."
        canonical="/case-studies/mocksville-plastics-osha-inspection"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How a 60-Person Plastics Manufacturer in Mocksville Passed OSHA — With Zero Citations',
            description: "A 60-person plastics manufacturer in Mocksville, NC had a scheduled OSHA inspection six weeks away. After a GigLine walkthrough flagged 4 high-risk findings, all were fixed before inspection day. Outcome: zero citations.",
            author: { '@type': 'Person', name: 'Vince Lawrence', url: 'https://www.giglinecompliance.com/about' },
            publisher: { '@type': 'Organization', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com' },
            datePublished: '2026-06-04',
            mainEntityOfPage: 'https://www.giglinecompliance.com/case-studies/mocksville-plastics-osha-inspection',
            image: 'https://www.giglinecompliance.com/og-image.png',
            articleSection: 'Case Study',
            keywords: 'OSHA inspection, safety walkthrough, plastics manufacturing, Mocksville NC, recordkeeping, forklift certification, housekeeping, egress',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
              { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://www.giglinecompliance.com/case-studies' },
              { '@type': 'ListItem', position: 3, name: 'Mocksville Plastics Manufacturer', item: 'https://www.giglinecompliance.com/case-studies/mocksville-plastics-osha-inspection' },
            ],
          },
        ]}
      />

      {/* ───────────────────────────────────────────
          HERO
      ─────────────────────────────────────────── */}
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
              Outcome: Zero Citations
            </span>
          </p>

          <h1
            className="font-bold leading-[1.1] mb-6 text-[32px] sm:text-[40px] md:text-[52px] tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
            data-testid="case-headline"
          >
            How a 60-Person Plastics Manufacturer in Mocksville Passed OSHA &mdash; With Zero Citations
          </h1>

          <p
            className="text-lg md:text-xl leading-relaxed mb-8 max-w-3xl"
            style={{ color: TEXT_MUTED, ...serif }}
            data-testid="case-subhead"
          >
            What changed in the six weeks between the walkthrough and inspection day.
          </p>

          {/* AT A GLANCE STRIP */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-10"
            style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
            data-testid="case-stats"
          >
            <StatItem icon={<MapPin size={14} />} label="Location" value="Mocksville, NC" />
            <StatItem icon={<Users size={14} />} label="Headcount" value="~60 employees" />
            <StatItem icon={<Calendar size={14} />} label="Engagement" value="Spring 2026" />
            <StatItem icon={<AlertTriangle size={14} />} label="Time to Inspection" value="6 weeks" />
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────
          BODY
      ─────────────────────────────────────────── */}
      <article
        className="px-5 md:px-8 pb-16 md:pb-20"
        data-testid="case-body"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        <div className="max-w-3xl mx-auto" style={{ color: NAVY }}>

          {/* THE SITUATION */}
          <H2>The Situation</H2>
          <P>A plastics manufacturer in Mocksville, NC &mdash; roughly 60 employees, two-shift operation &mdash; had OSHA on the calendar.</P>
          <P>Not a complaint. Not a referral. A <strong>scheduled inspection.</strong></P>
          <P>That kind of advance notice is rare. Most OSHA visits come unannounced. When you do get it, the question isn&rsquo;t whether you&rsquo;ll be inspected &mdash; it&rsquo;s what they&rsquo;ll find when they walk the floor.</P>
          <P>The plant manager called me in Spring 2026, about six weeks out from the inspection date. He had a binder. He had policies. He had a forklift program on paper. What he didn&rsquo;t have was certainty that any of it would survive a real inspector&rsquo;s eyes.</P>
          <P>He hired GigLine for one purpose: walk the floor like an OSHA Compliance Officer would. Find what they&rsquo;d find. Tell him what to fix and in what order. He had six weeks.</P>

          {/* THE WALKTHROUGH */}
          <H2>The Walkthrough</H2>
          <P>I walked the facility for three hours. Production floor, shipping and receiving, maintenance area, employee break room, chemical storage. I took photos of everything I&rsquo;d want documented. I talked to two supervisors, one forklift operator, and the maintenance lead.</P>
          <P>By the end of the visit, I had a clear picture of what was working and what wasn&rsquo;t. The Top 10 Fixes report landed in the plant manager&rsquo;s inbox 36 hours later.</P>
          <P>Four of the findings would have been almost-certain citations on inspection day.</P>

          {/* FINDINGS — formatted as cards */}
          <div className="not-italic my-10 space-y-5" style={{ fontFamily: "'Manrope', sans-serif" }} data-testid="case-findings">
            <Finding
              n="01"
              title="Recordkeeping — OSHA 300 Log not posted, no 300A Summary signed by a company executive"
              cfr="29 CFR 1904.32"
              body="The 300 Log existed. The 300A Annual Summary did not. The prior year's 300A must be posted from February 1 through April 30, signed by a company executive certifying its accuracy. The plant was outside the posting window with no signed copy in the file. Recordkeeping citations stack &mdash; each missing record can be cited separately."
              penalty="$1,190 to $16,131 per violation"
            />
            <Finding
              n="02"
              title="Powered Industrial Trucks — Three forklift operators with expired certifications, no daily inspection log"
              cfr="29 CFR 1910.178(l)"
              body="Three forklift operators had certifications older than three years. Refresher training is required at least every three years &mdash; or sooner if there's an observed unsafe operation. No documented refreshers were on file. Worse, there was no daily pre-shift inspection log. The forklifts were running eight-plus hours per shift with no documented walkaround."
              penalty="$1,190 to $16,131 per operator, per violation"
            />
            <Finding
              n="03"
              title="Walking and Working Surfaces — Housekeeping deficiencies"
              cfr="29 CFR 1910.22(a)(1)"
              body="The production floor was working hard. Scrap accumulated under press lines. Pallets of finished product were partially stacked in pedestrian zones. Material handlers were stepping around obstructions instead of having clean aisles to move through. Housekeeping isn't an aesthetic complaint &mdash; it's a written OSHA standard."
              penalty="$1,190 to $16,131 per citation"
            />
            <Finding
              n="04"
              title="Emergency Egress — Inadequate path to exits"
              cfr="29 CFR 1910.37(a)(3)"
              body="Two of the four emergency exits had partial obstructions in the path of egress. One had a rolling cart parked within four feet. The other had pallets of raw material stacked in the path. The exit doors themselves were functional. But the path to them was compromised &mdash; a citable condition the moment an inspector points to it."
              penalty="$1,190 to $16,131 per citation"
            />
          </div>

          {/* SIX WEEKS */}
          <H2>The Six Weeks Between</H2>
          <P>The plant manager moved fast. Within 48 hours of receiving the report, he had assigned each of the ten findings to someone in the building with a fix-by date.</P>
          <P>I checked in twice during the six-week window &mdash; once at the two-week mark, once at the four-week mark &mdash; to look at corrective action documentation. By the time OSHA&rsquo;s inspection date arrived, all four high-risk items were closed and documented.</P>

          <FixBlock label="Recordkeeping" body="The 300A Annual Summary was completed, signed by the company president, and posted in the break room. The 5-year retention file was reorganized so every prior year's records were filed in date order, easily produced." />
          <FixBlock label="Forklift Program" body="All three operators with expired certifications went through formal refresher training with written evaluation records. A daily pre-shift inspection log was put in place &mdash; laminated checklist mounted on each forklift, signed off at shift change. The shift supervisor reviewed the logs daily." />
          <FixBlock label="Housekeeping" body="A written housekeeping program was drafted. Daily end-of-shift sweep-and-stage routines were implemented. Pedestrian aisles were re-painted with high-visibility yellow lines. Material storage moved out of egress zones permanently." />
          <FixBlock label="Egress" body="All four emergency exit paths were cleared and a 'no storage zone' was marked four feet around each exit door. Monthly egress audits were added to the safety coordinator's standing checklist." />

          <P className="mt-8">None of these fixes required a consultant on retainer. They required a written program, a training record, and a few weeks of focused attention from someone in the building who had authority to enforce them.</P>

          {/* INSPECTION DAY */}
          <H2>Inspection Day</H2>
          <P>The OSHA Compliance Officer arrived on the scheduled date. The opening conference ran roughly twenty minutes. The plant manager pulled up the 300A Summary signed by the president. He produced the forklift training certificates and the daily inspection logs. He had the housekeeping program and the egress audit log ready to hand over.</P>
          <P>The walkthrough portion took about four hours. The Compliance Officer asked questions about the LOTO program, the HazCom binder, machine guarding on the press lines, and PPE training records. The plant manager and his supervisors had the documentation ready for every question.</P>
          <P>At the closing conference, the Compliance Officer noted observations but <strong>did not issue a single citation.</strong> The inspection closed with no formal findings, no fines, and a clean record.</P>

          {/* WHAT THIS BUYS */}
          <H2>What This Buys</H2>
          <P>A clean OSHA inspection isn&rsquo;t just the absence of a fine. It changes how the next inspection runs. OSHA&rsquo;s history-of-violations factor influences both citation severity and penalty multipliers on every future visit. A clean record now means lighter scrutiny later.</P>
          <P>For a 60-person manufacturer, the alternative would have been a real exposure number. Four findings at the higher end of the penalty range &mdash; plus the multiplier for willful or repeated classifications &mdash; could have run past <strong>$75,000.</strong> A safety walkthrough plus six weeks of disciplined corrective action got them to zero.</P>

          {/* WHAT'S REPEATABLE */}
          <H2>What&rsquo;s Repeatable</H2>
          <P>This case isn&rsquo;t unusual. Most manufacturers I walk into have at least three of the same four issues &mdash; recordkeeping gaps, expired forklift certifications, housekeeping drift, egress obstructions. They&rsquo;re not lazy problems. They&rsquo;re the kind of problems that come from running a 60-person operation without a full-time safety manager. Someone has to walk the floor with the right lens. That&rsquo;s all this is.</P>
          <P>If you have OSHA on the calendar &mdash; or if you&rsquo;re worried they&rsquo;re coming and haven&rsquo;t been told yet &mdash; a walkthrough is the cheapest insurance policy available. One visit. A written report. A list of things to fix in priority order. You take it from there.</P>
        </div>
      </article>

      {/* ───────────────────────────────────────────
          CTA BAND  (one dark anchor moment)
      ─────────────────────────────────────────── */}
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
            Find it before OSHA does.
          </p>
          <h2
            className="text-2xl md:text-4xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Have OSHA on the calendar?<br className="hidden md:block" /> Or worried they&rsquo;re coming?
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto text-white/65"
          >
            One visit. A written report within 48 hours. A list of things to fix in priority order. No retainer.
          </p>
          <Link
            to="/walkthrough"
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

const H2 = ({ children }) => (
  <h2
    className="font-bold leading-tight mt-12 mb-4 text-[26px] md:text-[32px]"
    style={{ fontFamily: "'Manrope', sans-serif", color: NAVY }}
  >
    {children}
  </h2>
);

const P = ({ children, className = '' }) => (
  <p
    className={`text-[17px] md:text-[18px] leading-[1.7] mb-4 ${className}`}
    style={{ color: TEXT_MUTED, ...serif }}
  >
    {children}
  </p>
);

const Finding = ({ n, title, cfr, body, penalty }) => (
  <div
    className="p-6 md:p-7"
    style={{
      backgroundColor: 'white',
      border: `1px solid ${BORDER}`,
      boxShadow: '0 1px 2px rgba(10,22,40,0.03)',
    }}
  >
    <div className="flex items-baseline gap-3 mb-3">
      <span
        className="leading-none"
        style={{ color: GOLD, ...serif, fontSize: '36px' }}
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
    <p
      className="text-[13px] md:text-[14px] font-semibold pt-3 inline-flex items-center gap-2"
      style={{ color: NAVY, borderTop: `1px solid ${BORDER}`, width: '100%' }}
    >
      <AlertTriangle size={13} style={{ color: GOLD }} />
      <span style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em' }}>PENALTY:</span>
      <span style={{ color: TEXT_MUTED }}>{penalty}</span>
    </p>
  </div>
);

const FixBlock = ({ label, body }) => (
  <div className="mt-4 mb-2 pl-5 not-italic" style={{ borderLeft: `2px solid ${GOLD}`, fontFamily: "'Manrope', sans-serif" }}>
    <div className="flex items-baseline gap-2 mb-1">
      <Check size={14} style={{ color: GOLD }} />
      <span
        className="uppercase font-bold tracking-[0.18em]"
        style={{ color: NAVY, ...mono, fontSize: '11px' }}
      >
        {label}
      </span>
    </div>
    <p
      className="text-[16px] md:text-[17px] leading-[1.65] ml-6"
      style={{ color: TEXT_MUTED, ...serif }}
    >
      {body}
    </p>
  </div>
);

export default CaseStudyMocksvillePage;
