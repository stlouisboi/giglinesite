import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NAVY = '#0A1628';
const CREAM = '#F5F4F0';
const GOLD = '#C9A84C';
const MONO = { fontFamily: "'JetBrains Mono', monospace" };
const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };

const STAGES = [
  { num: '01', stage: 'FIND', name: 'Compliance Readiness Visit', body: 'Identify field and documentation gaps in a single half-day visit.', to: '/services/compliance-readiness-visit' },
  { num: '02', stage: 'PRIORITIZE', name: 'Corrective Action Implementation', body: 'Named owners, closure evidence, and target dates against selected findings.', to: '/services/corrective-action-implementation' },
  { num: '03', stage: 'BUILD', name: 'Safety Control System Buildout', body: 'A site-specific digital control system inside your own storage platform.', to: '/services/safety-control-system-buildout', featured: true },
  { num: '04', stage: 'MAINTAIN', name: 'Ongoing Safety Support', body: 'A defined monthly cadence so programs, records, and actions stay current.', to: '/services/ongoing-safety-support' },
];

const FindBuildMaintainJourney = ({ variant = 'light' }) => {
  const isDark = variant === 'dark';
  const bg = isDark ? NAVY : CREAM;
  const ink = isDark ? 'white' : NAVY;
  const inkMuted = isDark ? 'rgba(255,255,255,0.60)' : 'rgba(10,22,40,0.60)';
  const inkSoft = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(10,22,40,0.85)';
  const rule = isDark ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.45)';
  const stroke = isDark ? 'rgba(201,168,76,0.55)' : 'rgba(10,22,40,0.35)';

  return (
    <section className="py-20 md:py-28" style={{ background: bg }} data-testid="find-build-maintain-journey">
      <div className="container">
        <div className="max-w-4xl mb-14 md:mb-20">
          <p className="uppercase font-bold mb-3" style={{ ...MONO, fontSize: '10.5px', letterSpacing: '0.22em', color: GOLD }}>
            The GigLine Journey
          </p>
          <h2 className="text-3xl md:text-5xl leading-[1.05] mb-4 italic" style={{ ...SERIF, color: ink, letterSpacing: '-0.015em' }}>
            Find. Prioritize. Build. Maintain.
          </h2>
          <p className="text-base md:text-lg leading-[1.65] max-w-2xl" style={{ color: inkMuted }}>
            One path from what is happening on the floor to organized, retrievable evidence the next inspection can read.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute left-0 right-0 h-px"
            style={{ top: '56px', background: 'linear-gradient(90deg, transparent 0%, ' + rule + ' 6%, ' + rule + ' 94%, transparent 100%)' }}
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-14">
            {STAGES.map((s, i) => (
              <article key={s.num} className="relative" data-testid={'journey-stage-' + s.stage.toLowerCase()}>
                <div
                  aria-hidden="true"
                  className="select-none leading-none mb-3"
                  style={{
                    ...SERIF,
                    fontSize: '108px',
                    fontWeight: 700,
                    color: s.featured ? GOLD : 'transparent',
                    WebkitTextStroke: s.featured ? '0' : '1.5px ' + stroke,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {s.num}
                </div>
                <span
                  aria-hidden="true"
                  className="hidden lg:block absolute"
                  style={{ top: '50px', left: '-2px', width: '14px', height: '14px', borderRadius: '50%', background: bg, border: '2px solid ' + GOLD, boxShadow: s.featured ? '0 0 0 4px ' + bg + ', 0 0 0 5px ' + GOLD : 'none' }}
                />
                <p className="uppercase font-bold mb-2" style={{ ...MONO, fontSize: '10px', letterSpacing: '0.20em', color: GOLD }}>
                  {s.stage}
                </p>
                <h3 className="text-[26px] md:text-[30px] leading-[1.08] mb-2 italic" style={{ ...SERIF, color: ink, letterSpacing: '-0.005em' }}>
                  {s.name}.
                </h3>
                <p className="text-[14px] leading-[1.75] mb-4 max-w-[28ch]" style={{ color: inkSoft }}>
                  {s.body}
                </p>
                <Link
                  to={s.to}
                  className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase pb-1 transition-colors"
                  style={{ ...MONO, color: GOLD, letterSpacing: '0.18em', borderBottom: '1px solid ' + rule }}
                  data-testid={'journey-stage-' + s.stage.toLowerCase() + '-cta'}
                >
                  Learn more <ArrowRight size={12} />
                </Link>
              </article>
            ))}
          </div>
        </div>

        <p className="text-[13px] md:text-sm italic mt-14 max-w-3xl leading-[1.7]" style={{ ...SERIF, color: inkMuted }}>
          Each stage is a separate engagement. The order is Find, Prioritize, Build, Maintain.
        </p>
      </div>
    </section>
  );
};

export default FindBuildMaintainJourney;
