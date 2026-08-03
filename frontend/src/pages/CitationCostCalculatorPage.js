import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

/*
  /citation-cost-calculator — interactive lead-magnet.
  Visitor selects the OSHA standards they have open gaps in, sets severity + count,
  and sees estimated 2026 maximum penalty exposure in real time. Each row that
  matches a GigLine kit gets a cross-sell CTA.

  2026 OSHA penalty schedule (verified against DOL Federal Register annual update):
    Serious / Other-than-serious:  $16,550 per violation
    Willful / Repeat:              $165,514 per violation
    Failure-to-abate:              $16,550 per day (not modeled — asks user for lump)
*/

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const INK = '#1C2B2B';
const CREAM = '#F9F8F6';

const PENALTIES = {
  serious: { label: 'Serious', max: 16550 },
  willful: { label: 'Willful / Repeat', max: 165514 },
};

const STANDARDS = [
  {
    id: 'hazcom',
    cfr: '29 CFR 1910.1200',
    name: 'Hazard Communication (HazCom)',
    hook: 'Written program, SDS binder, container labels, employee training',
    kit: { slug: 'hazcom-pro-kit', name: 'HazCom Pro Kit', href: '/citation-proof-kits', ready: false, starter: '/hazcom-starter-pack', starterPrice: 29 },
  },
  {
    id: 'loto',
    cfr: '29 CFR 1910.147',
    name: 'Lockout / Tagout',
    hook: 'Written energy-control program, machine-specific procedures, periodic inspection',
    kit: { slug: 'loto-readiness-kit', name: 'LOTO Readiness Kit', href: '/citation-proof-kits/loto-readiness-kit', ready: true },
  },
  {
    id: 'pit',
    cfr: '29 CFR 1910.178',
    name: 'Powered Industrial Trucks (Forklifts)',
    hook: 'Written PIT program, operator evaluations, daily inspection records',
    kit: { slug: 'forklift-pit-readiness-kit', name: 'Forklift / PIT Readiness Kit', href: '/citation-proof-kits/forklift-pit-readiness-kit', ready: true },
  },
  {
    id: 'machine-guarding',
    cfr: '29 CFR 1910.212',
    name: 'Machine Guarding',
    hook: 'General requirements for all machines — points of operation, ingoing nip points',
    kit: null,
  },
  {
    id: 'fall-protection',
    cfr: '29 CFR 1926.501 / 1910.28',
    name: 'Fall Protection',
    hook: 'Duty to have fall protection above 4-6 feet, guardrails, PFAS',
    kit: null,
  },
  {
    id: 'recordkeeping',
    cfr: '29 CFR 1904',
    name: 'Recordkeeping (OSHA 300 / 300A / 301)',
    hook: 'Injury/illness logs, annual summary, incident reports',
    kit: { slug: 'incident-to-correction-kit', name: 'Incident-to-Correction Kit', href: '/citation-proof-kits', ready: false },
  },
];

const fmt = (n) => `$${n.toLocaleString('en-US')}`;

const CitationCostCalculatorPage = () => {
  // { [id]: { severity: 'serious'|'willful', count: number } }
  const [selections, setSelections] = useState({});

  const toggle = (id) => {
    setSelections((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { severity: 'serious', count: 1 };
      return next;
    });
  };

  const setSeverity = (id, severity) => setSelections((p) => ({ ...p, [id]: { ...p[id], severity } }));
  const setCount = (id, count) => setSelections((p) => ({ ...p, [id]: { ...p[id], count: Math.max(1, Math.min(50, count || 1)) } }));

  const rows = useMemo(() => {
    return STANDARDS.filter((s) => selections[s.id]).map((s) => {
      const sel = selections[s.id];
      const perViolation = PENALTIES[sel.severity].max;
      const subtotal = perViolation * sel.count;
      return { ...s, ...sel, perViolation, subtotal };
    });
  }, [selections]);

  const total = rows.reduce((sum, r) => sum + r.subtotal, 0);
  const kitSavings = rows.filter((r) => r.kit && r.kit.ready).length * 150;

  return (
    <div className="bg-[#F9F8F6] min-h-screen" data-testid="citation-cost-calculator-page">
      <Helmet>
        <title>OSHA Citation Cost Calculator — 2026 Penalty Estimator | GigLine</title>
        <meta name="description" content="Estimate your 2026 OSHA penalty exposure. Interactive calculator using current DOL maximum fines — up to $16,550 per serious violation and $165,514 per willful/repeat. Free, no signup." />
        <link rel="canonical" href="https://www.giglinecompliance.com/citation-cost-calculator" />
        <meta property="og:title" content="OSHA Citation Cost Calculator — 2026 Penalty Estimator" />
        <meta property="og:description" content="Enter your open compliance gaps. See real-dollar OSHA exposure at 2026 penalty rates. Free tool from GigLine Safety & Compliance." />
      </Helmet>

      {/* ═══ HERO ═══ */}
      <section className="bg-[#102A43] text-white pt-14 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A84C] hover:text-white transition-colors mb-6" data-testid="calc-back-home">
            <ArrowLeft size={12} /> Back to home
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] mb-4">Free Tool · No Signup</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] mb-4 tracking-tight">
            OSHA Citation Cost Calculator
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl leading-relaxed">
            Pick the standards you know you have open gaps in. See your estimated OSHA exposure at
            <strong className="text-white"> 2026 penalty rates</strong> &mdash; up to <strong className="text-white">$16,550 per serious violation</strong> and{' '}
            <strong className="text-white">$165,514 per willful or repeat</strong>. Not legal advice; just the DOL math.
          </p>
        </div>
      </section>

      {/* ═══ CALCULATOR ═══ */}
      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 md:p-8" data-testid="calc-form">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1C2B2B] mb-4">Step 1 &mdash; Check the standards you have gaps in</p>

            <div className="grid grid-cols-1 gap-3" data-testid="calc-standard-list">
              {STANDARDS.map((s) => {
                const sel = selections[s.id];
                const active = !!sel;
                return (
                  <div
                    key={s.id}
                    className={`rounded-lg border transition-all ${active ? 'border-[#C9A84C] bg-[#F3ECDB]/50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    data-testid={`calc-row-${s.id}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(s.id)}
                      className="w-full flex items-start gap-3 p-4 text-left"
                      data-testid={`calc-toggle-${s.id}`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center ${active ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-gray-300 bg-white'}`}>
                        {active && <ShieldCheck size={12} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-mono text-[#C9A84C] font-bold tracking-wider">{s.cfr}</p>
                        <p className="font-bold text-[#1C2B2B] text-[15px] mt-0.5">{s.name}</p>
                        <p className="text-[12.5px] text-gray-500 mt-0.5 leading-snug">{s.hook}</p>
                      </div>
                    </button>

                    {active && (
                      <div className="border-t border-[#C9A84C]/30 p-4 pt-3.5 bg-white/60" data-testid={`calc-row-detail-${s.id}`}>
                        <div className="flex flex-wrap items-center gap-3 md:gap-5">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Severity</p>
                            <div className="inline-flex rounded overflow-hidden border border-gray-300">
                              {Object.entries(PENALTIES).map(([key, p]) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => setSeverity(s.id, key)}
                                  className={`text-[12px] font-semibold px-3 py-1.5 transition-colors ${sel.severity === key ? 'bg-[#102A43] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                  data-testid={`calc-severity-${s.id}-${key}`}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">Instances</p>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={sel.count}
                              onChange={(e) => setCount(s.id, parseInt(e.target.value, 10))}
                              className="w-20 px-3 py-1.5 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:border-[#C9A84C]"
                              data-testid={`calc-count-${s.id}`}
                            />
                          </div>
                          <div className="ml-auto text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Subtotal</p>
                            <p className="text-lg font-bold text-[#102A43] font-mono">{fmt(PENALTIES[sel.severity].max * sel.count)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="mt-6 pt-5 border-t-2 border-[#102A43]" data-testid="calc-total-block">
              {rows.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-3">Check the standards you have open gaps in above to see your estimated exposure.</p>
              ) : (
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">Estimated Maximum Exposure</p>
                    <p className="text-[10.5px] text-gray-400 mt-0.5">{rows.length} standard{rows.length === 1 ? '' : 's'} · 2026 DOL penalty schedule</p>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-[#102A43] font-mono" data-testid="calc-total-amount">{fmt(total)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations block */}
          {rows.length > 0 && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-5 md:p-8" data-testid="calc-recommendations">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F3ECDB] flex items-center justify-center">
                  <AlertTriangle size={16} className="text-[#C9A84C]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1C2B2B] leading-tight">Your {fmt(total)} exposure vs. the kits that close these gaps</h2>
                  <p className="text-[13.5px] text-gray-500 mt-1">The Citation-Proof Kit Series delivers the exact paperwork OSHA asks about first.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {rows.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0" data-testid={`calc-rec-${r.id}`}>
                    <DollarSign size={14} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1C2B2B]">{r.name}</p>
                      {r.kit ? (
                        r.kit.ready ? (
                          <Link to={r.kit.href} className="text-[11.5px] text-[#C9A84C] font-bold hover:underline" data-testid={`calc-rec-link-${r.id}`}>
                            Close with the {r.kit.name} &rarr; from $150
                          </Link>
                        ) : r.kit.starter ? (
                          <span className="text-[11.5px] text-gray-500">
                            <Link to={r.kit.starter} className="text-[#C9A84C] font-bold hover:underline">Start with the ${r.kit.starterPrice} HazCom Starter Pack</Link>
                            {' '} · full Pro Kit coming soon
                          </span>
                        ) : (
                          <span className="text-[11.5px] text-gray-500">
                            <Link to={r.kit.href} className="text-[#C9A84C] font-bold hover:underline">{r.kit.name}</Link> — coming soon
                          </span>
                        )
                      ) : (
                        <Link to="/walkthrough" className="text-[11.5px] text-[#C9A84C] font-bold hover:underline">
                          Not a kit — request a Safety Walkthrough &rarr;
                        </Link>
                      )}
                    </div>
                    <p className="text-[13px] font-mono font-bold text-[#102A43] whitespace-nowrap">{fmt(r.subtotal)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/citation-proof-kits"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#B8972C] text-[#102A43] font-bold py-3 px-5 rounded-lg transition-colors"
                  data-testid="calc-cta-primary"
                >
                  See the Kit Series <ArrowRight size={14} />
                </Link>
                <Link
                  to="/walkthrough"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[#102A43] font-bold py-3 px-5 rounded-lg border-2 border-[#102A43] transition-colors"
                  data-testid="calc-cta-walkthrough"
                >
                  Request a Safety Walkthrough
                </Link>
              </div>
            </div>
          )}

          {/* Method + disclaimer */}
          <div className="mt-8 text-[12.5px] text-gray-500 leading-relaxed max-w-3xl" data-testid="calc-disclaimer">
            <p className="mb-2">
              <strong>How this is calculated.</strong> Each violation multiplies by the DOL&rsquo;s 2026
              maximum: <strong>$16,550</strong> for serious / other-than-serious,{' '}
              <strong>$165,514</strong> for willful or repeat. Actual assessed penalties vary by employer
              size, history, good-faith factors, and negotiation &mdash; this tool shows the ceiling, not
              the floor.
            </p>
            <p>
              <em>Compliance tools and estimates, not legal advice.</em> For a written, site-specific
              gap analysis with photographed findings and CFR citations, <Link to="/walkthrough" className="text-[#102A43] font-semibold underline hover:text-[#C9A84C]">request a Safety Walkthrough</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CitationCostCalculatorPage;
