import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Minus, ArrowRight } from 'lucide-react';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#F9F8F6';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const OFFERS = [
  {
    slug: 'walkthrough',
    name: 'Safety Walkthrough',
    price: 'From $1,300',
    href: '/safety-walkthrough',
    tagline: 'Field-only diagnostic',
    bestFor: 'Visible workplace hazards',
    rows: {
      floor: 'yes',
      docs: 'limited',
      priority: 'yes',
      combined: 'no',
      review: 'no',
    },
  },
  {
    slug: 'doc',
    name: 'Documentation Readiness Review',
    price: '$1,700',
    href: '/services/documentation-readiness-review',
    tagline: 'Premium document diagnostic',
    bestFor: 'Paperwork and record weaknesses',
    rows: {
      floor: 'no',
      docs: 'yes',
      priority: 'yes',
      combined: 'no',
      review: 'no',
    },
  },
  {
    slug: 'crv',
    name: 'Compliance Readiness Visit',
    price: 'From $2,500',
    href: '/services/compliance-readiness-visit',
    tagline: 'Best value',
    bestFor: 'Most facilities',
    rows: {
      floor: 'yes',
      docs: 'yes',
      priority: 'yes',
      combined: 'yes',
      review: 'yes',
    },
  },
];

const ROWS = [
  { key: 'floor', label: 'Floor conditions reviewed' },
  { key: 'docs', label: 'Documents reviewed' },
  { key: 'priority', label: 'Prioritized findings' },
  { key: 'combined', label: 'Combined readiness picture' },
  { key: 'review', label: '30-day findings review' },
];

const Cell = ({ value }) => {
  if (value === 'yes') return <Check size={16} className="mx-auto" style={{ color: '#3E7E3E' }} strokeWidth={2.4} aria-label="Yes" />;
  if (value === 'no') return <Minus size={16} className="mx-auto" style={{ color: '#B3ADA0' }} strokeWidth={2.2} aria-label="No" />;
  return <span className="text-[12px] font-semibold" style={{ color: '#8B6F1F' }}>Limited</span>;
};

const DiagnosticComparisonCard = ({ highlightSlug = 'crv', showCombinedSavings = true, showCta = true }) => {
  return (
    <section className="py-16 md:py-20" style={{ background: CREAM, borderTop: '1px solid #e5dfd0' }} data-testid="diagnostic-comparison-card">
      <div className="container max-w-5xl">
        <p className="uppercase font-bold mb-3 text-center" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: '#5B6B7A' }}>
          Diagnostic Comparison
        </p>
        <h2 className="text-2xl md:text-4xl font-extrabold text-center leading-[1.15] mb-3 tracking-tight" style={{ color: NAVY }}>
          Three diagnostics. One recommended entry point.
        </h2>
        <p className="text-[15px] md:text-base text-center leading-[1.7] max-w-2xl mx-auto mb-10" style={{ color: 'rgba(28,43,43,0.72)' }}>
          Choose the diagnostic that matches where you think the weakness lives, or start with the combined visit and save $500.
        </p>

        <div className="overflow-x-auto rounded-xl" style={{ background: '#ffffff', border: '1px solid #e0dfd9' }}>
          <table className="w-full text-left" data-testid="dcc-table">
            <thead>
              <tr style={{ background: 'rgba(16,42,67,0.03)' }}>
                <th className="p-4 text-[11px] uppercase font-bold" style={{ ...mono, letterSpacing: '0.14em', color: '#5B6B7A', minWidth: '180px' }}>
                  &nbsp;
                </th>
                {OFFERS.map((o) => (
                  <th
                    key={o.slug}
                    className="p-4 text-center align-top"
                    style={o.slug === highlightSlug ? { background: 'rgba(201,168,76,0.10)', borderLeft: '1px solid rgba(201,168,76,0.35)', borderRight: '1px solid rgba(201,168,76,0.35)' } : {}}
                    data-testid={`dcc-header-${o.slug}`}
                  >
                    <p className="text-[13px] font-extrabold mb-1 leading-tight" style={{ color: NAVY }}>{o.name}</p>
                    <p className="text-[15px] font-extrabold mb-2" style={{ ...mono, color: NAVY }}>{o.price}</p>
                    <p className="uppercase font-bold" style={{ ...mono, fontSize: '9px', letterSpacing: '0.14em', color: o.slug === 'crv' ? '#8B6F1F' : '#5B6B7A' }}>
                      {o.tagline}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.key} data-testid={`dcc-row-${r.key === 'floor' ? 'walkthrough' : r.key === 'docs' ? 'doc' : r.key === 'combined' ? 'crv' : r.key}`} style={{ borderTop: '1px solid #f0eee7' }}>
                  <td className="p-3 md:p-4 text-[13.5px] font-semibold" style={{ color: NAVY }}>{r.label}</td>
                  {OFFERS.map((o) => (
                    <td
                      key={o.slug}
                      className="p-3 md:p-4 text-center"
                      style={o.slug === highlightSlug ? { background: 'rgba(201,168,76,0.05)', borderLeft: '1px solid rgba(201,168,76,0.15)', borderRight: '1px solid rgba(201,168,76,0.15)' } : {}}
                    >
                      <Cell value={o.rows[r.key]} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #f0eee7' }}>
                <td className="p-3 md:p-4 text-[13.5px] font-semibold" style={{ color: NAVY }}>Best for</td>
                {OFFERS.map((o) => (
                  <td
                    key={o.slug}
                    className="p-3 md:p-4 text-center text-[12px] leading-[1.5]"
                    style={o.slug === highlightSlug ? { background: 'rgba(201,168,76,0.05)', borderLeft: '1px solid rgba(201,168,76,0.15)', borderRight: '1px solid rgba(201,168,76,0.15)', color: NAVY } : { color: 'rgba(28,43,43,0.72)' }}
                  >
                    {o.bestFor}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {showCombinedSavings && (
          <div
            className="mt-8 rounded-xl p-6 md:p-7 text-center"
            style={{ background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.35)' }}
            data-testid="dcc-savings-block"
          >
            <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', letterSpacing: '0.20em', color: '#8B6F1F' }}>
              Combined Value
            </p>
            <p className="text-[15px] leading-[1.7] max-w-xl mx-auto" style={{ color: NAVY }}>
              <span className="line-through" style={{ color: '#8B7A54' }}>Purchased separately: $3,000</span>
              &nbsp; &middot; &nbsp;
              <strong>Compliance Readiness Visit: From $2,500</strong>
              &nbsp; &middot; &nbsp;
              <span style={{ color: '#3E7E3E' }} className="font-bold">Save $500</span>
            </p>
          </div>
        )}

        {showCta && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/services/compliance-readiness-visit"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg text-[14px] transition-colors"
              style={{ background: NAVY, color: '#ffffff' }}
              data-testid="dcc-cta-crv"
            >
              Book the Compliance Readiness Visit
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        <p className="mt-6 text-[12px] text-center" style={{ color: 'rgba(28,43,43,0.55)' }}>
          Prices vary by facility size and employee count. Final quote issued before scheduling.
        </p>
      </div>
    </section>
  );
};

export default DiagnosticComparisonCard;
