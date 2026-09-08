import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ListChecks, LayoutTemplate, RefreshCcw } from 'lucide-react';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const BLUE = '#2A52A0';
const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#f5f4f0';

const STAGES = [
  {
    code: 'FIND',
    icon: Search,
    service: 'Compliance Readiness Visit',
    outcome: 'Identify field and documentation gaps.',
    href: '/services/compliance-readiness-visit',
  },
  {
    code: 'PRIORITIZE',
    icon: ListChecks,
    service: 'Corrective Action Implementation',
    outcome: 'Establish owners, deadlines, and priorities.',
    href: '/services/corrective-action-implementation',
  },
  {
    code: 'BUILD',
    icon: LayoutTemplate,
    service: 'OSHA-Ready Control System',
    outcome: "Build the company's digital safety system.",
    href: '/services/osha-ready-control-system',
    highlight: true,
  },
  {
    code: 'MAINTAIN',
    icon: RefreshCcw,
    service: 'Ongoing Safety Support',
    outcome: 'Keep programs, records, and actions current.',
    href: '/ongoing-safety-support',
  },
];

/**
 * Find → Prioritize → Build → Maintain journey.
 * Rendered on the homepage and the services page. Kit pages route to /services when they use it.
 */
const FindBuildMaintainJourney = ({ variant = 'light', showTitle = true, className = '' }) => {
  const isDark = variant === 'dark';
  const bg = isDark ? NAVY : CREAM;
  const titleColor = isDark ? '#ffffff' : NAVY;
  const bodyColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(28,43,43,0.72)';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid #e8e5dd';

  return (
    <section className={`py-16 md:py-24 ${className}`} style={{ background: bg }} data-testid="find-build-maintain-journey">
      <div className="container max-w-6xl">
        {showTitle && (
          <>
            <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: isDark ? GOLD : BLUE }}>
              How GigLine Works
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight max-w-3xl" style={{ color: titleColor }}>
              Find the gaps. Build the controls. Maintain the proof.
            </h2>
            <p className="text-[15px] md:text-base leading-[1.85] mb-12 max-w-3xl" style={{ color: bodyColor }}>
              Four stages. Four services. One clean journey from a first walk-through to a maintained compliance system.
            </p>
          </>
        )}

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" aria-label="Find, Prioritize, Build, Maintain service journey">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const isHighlight = !!s.highlight;
            return (
              <li key={s.code} data-testid={`journey-stage-${s.code.toLowerCase()}`}>
                <Link
                  to={s.href}
                  className="group block h-full rounded-xl p-5 md:p-6 transition-colors"
                  style={{
                    background: isHighlight ? 'rgba(201,168,76,0.10)' : cardBg,
                    border: isHighlight ? `1.5px solid ${GOLD}` : cardBorder,
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-extrabold" style={{ ...mono, fontSize: '11px', letterSpacing: '0.16em', color: isDark ? GOLD : BLUE }} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')} · {s.code}
                    </span>
                  </div>
                  <div className="flex items-center justify-center mb-4" style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: isHighlight ? 'rgba(201,168,76,0.20)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(42,82,160,0.08)'),
                    color: isHighlight ? GOLD : (isDark ? '#ffffff' : BLUE),
                  }}>
                    <Icon size={17} strokeWidth={2} />
                  </div>
                  <h3 className="text-[15.5px] md:text-[16px] font-bold mb-2 leading-snug" style={{ color: isDark ? '#ffffff' : NAVY }}>
                    {s.service}
                  </h3>
                  <p className="text-[13px] md:text-[13.5px] leading-[1.7] mb-4" style={{ color: bodyColor }}>
                    {s.outcome}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[13px] font-bold group-hover:gap-2 transition-all" style={{ color: isHighlight ? GOLD : (isDark ? '#ffffff' : BLUE) }}>
                    Learn more <ArrowRight size={13} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default FindBuildMaintainJourney;
