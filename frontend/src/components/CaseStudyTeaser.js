import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, AlertTriangle, Users } from 'lucide-react';

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

/*
  CaseStudyTeaser
  ──────────────────────────────────────────────────────
  Reusable engagement anchor used on Homepage and Services page
  to surface the Statesville metals fabrication case study. Mirrors
  the navy + gold aesthetic of the case study page's own CTA band so
  visitors get visual continuity when they click through.
*/
const CaseStudyTeaser = ({ source = 'homepage' }) => {
  return (
    <section
      className="py-20 md:py-28"
      style={{ backgroundColor: NAVY, color: 'white' }}
      data-testid={`case-study-teaser-${source}`}
    >
      <div className="container max-w-6xl px-5 md:px-8">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Left — label + headline + summary */}
          <div className="md:col-span-7">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-5"
              style={{ color: GOLD, ...mono, fontSize: '11px' }}
              data-testid="case-teaser-kicker"
            >
              Recent Engagement &middot; Case Study
            </p>
            <h2
              className="font-bold leading-[1.15] text-[26px] md:text-[34px] tracking-tight mb-5"
              style={{ fontFamily: "'Manrope', sans-serif" }}
              data-testid="case-teaser-headline"
            >
              What a Safety Walkthrough{' '}
              <span style={{ color: GOLD }}>Actually Finds.</span>
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed text-white/70 max-w-xl"
              data-testid="case-teaser-summary"
            >
              A metals fabrication facility in Statesville, NC. Combined walkthrough and documentation review. Thirteen findings against applicable CFR standards. 12 of 13 corrective actions closed within four days of the walkthrough.
            </p>
          </div>

          {/* Right — stat chips + CTA */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-7" data-testid="case-teaser-stats">
              <Stat icon={<Users size={14} />} label="Headcount" value="9 employees" />
              <Stat icon={<AlertTriangle size={14} />} label="Findings" value="13 total" />
              <Stat icon={<ShieldCheck size={14} />} label="Compliance" value="80.3 / 100" />
            </div>
            <Link
              to="/case-study/metals-fabrication-statesville"
              className="group inline-flex items-center justify-center gap-2 font-bold py-4 px-7 transition-all text-[15px] md:text-base w-full md:w-auto"
              style={{
                backgroundColor: GOLD,
                color: NAVY,
                fontFamily: "'Manrope', sans-serif",
                boxShadow: '0 6px 18px rgba(197,160,89,0.22)',
              }}
              data-testid={`case-teaser-cta-${source}`}
            >
              Read the full case study
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ icon, label, value }) => (
  <div
    className="px-3 py-3 md:px-4 md:py-4 rounded-lg"
    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(197,160,89,0.18)' }}
  >
    <div className="flex items-center gap-1.5 mb-1.5" style={{ color: GOLD }}>
      {icon}
      <span
        className="uppercase font-bold tracking-[0.18em]"
        style={{ ...mono, fontSize: '9px' }}
      >
        {label}
      </span>
    </div>
    <p
      className="font-bold leading-tight text-[13px] md:text-[15px]"
      style={{ color: 'white', fontFamily: "'Manrope', sans-serif" }}
    >
      {value}
    </p>
  </div>
);

export default CaseStudyTeaser;
