import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight } from 'lucide-react';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#F9F8F6';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const RULES = [
  { tier: 'Tier I Digital Kit', price: '$150', credit: 'Up to $150 credit' },
  { tier: 'Tier II Control System', price: '$300', credit: 'Up to $300 credit' },
  { tier: 'Tier III Binder Edition', price: '$600', credit: 'Up to $300 credit' },
];

const KitCreditRule = ({ variant = 'buyer' }) => {
  const isBuyer = variant === 'buyer';
  const heading = isBuyer
    ? 'Kit-to-Visit Credit'
    : 'Applying a Kit Credit to This Visit';
  const lead = isBuyer
    ? 'Buying a kit today and planning a Compliance Readiness Visit within 30 days? Your kit purchase earns credit toward that visit.'
    : 'If you purchased a GigLine kit within the past 30 days, its purchase price applies as credit toward your Compliance Readiness Visit.';

  return (
    <section
      className="py-14 md:py-16"
      style={{ background: CREAM, borderTop: '1px solid #e5dfd0' }}
      data-testid="kit-credit-rule"
    >
      <div className="container max-w-4xl">
        <div className="flex items-start gap-4 mb-6">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(201,168,76,0.15)', color: GOLD }}
            aria-hidden="true"
          >
            <Ticket size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="uppercase font-bold mb-1" style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: GOLD }}>
              Ladder Credit
            </p>
            <h2 className="text-xl md:text-2xl font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>
              {heading}
            </h2>
          </div>
        </div>

        <p className="text-[15px] leading-[1.75] mb-6" style={{ color: 'rgba(28,43,43,0.78)' }}>
          {lead}
        </p>

        <div className="rounded-xl overflow-hidden mb-6" style={{ background: '#ffffff', border: '1px solid #e0dfd9' }}>
          <table className="w-full text-left text-[14px]" data-testid="kit-credit-rules-table">
            <thead>
              <tr style={{ background: 'rgba(16,42,67,0.03)' }}>
                <th className="p-3 md:p-4 uppercase font-bold" style={{ ...mono, fontSize: '10px', letterSpacing: '0.14em', color: '#5B6B7A' }}>
                  Kit Purchased
                </th>
                <th className="p-3 md:p-4 uppercase font-bold" style={{ ...mono, fontSize: '10px', letterSpacing: '0.14em', color: '#5B6B7A' }}>
                  Price
                </th>
                <th className="p-3 md:p-4 uppercase font-bold" style={{ ...mono, fontSize: '10px', letterSpacing: '0.14em', color: '#5B6B7A' }}>
                  CRV Credit Earned
                </th>
              </tr>
            </thead>
            <tbody>
              {RULES.map((r, i) => (
                <tr key={r.tier} style={{ borderTop: '1px solid #f0eee7' }}>
                  <td className="p-3 md:p-4 font-semibold" style={{ color: NAVY }}>{r.tier}</td>
                  <td className="p-3 md:p-4" style={{ ...mono, color: NAVY }}>{r.price}</td>
                  <td className="p-3 md:p-4 font-semibold" style={{ color: '#3E7E3E' }}>{r.credit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg p-4 md:p-5 mb-6" style={{ background: '#ffffff', border: '1px solid #e0dfd9' }}>
          <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: '#5B6B7A' }}>
            Rules
          </p>
          <ul className="space-y-2 text-[13.5px] leading-[1.7]" style={{ color: 'rgba(28,43,43,0.78)' }}>
            <li>Book the Compliance Readiness Visit within 30 days of your kit purchase.</li>
            <li>Physical printing and fulfillment costs on the $600 binder tier are not credited.</li>
            <li>One credit per facility. Not combinable with another promotion.</li>
            <li>Credit applies to the Compliance Readiness Visit only, not to a Safety Walkthrough, Documentation Readiness Review, or Ongoing Safety Support.</li>
            <li>Reference your kit purchase order number when requesting a CRV quote.</li>
          </ul>
        </div>

        {isBuyer && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              to="/services/compliance-readiness-visit"
              className="inline-flex items-center gap-2 font-bold px-5 py-3 rounded-lg text-[13.5px] transition-colors"
              style={{ background: NAVY, color: '#ffffff' }}
              data-testid="kit-credit-crv-cta"
            >
              See the Compliance Readiness Visit
              <ArrowRight size={16} />
            </Link>
            <p className="text-[12.5px]" style={{ color: 'rgba(28,43,43,0.60)' }}>
              Or call Vince directly to scope the visit: (336) 329-8899
            </p>
          </div>
        )}

        {!isBuyer && (
          <p className="text-[13px]" style={{ color: 'rgba(28,43,43,0.65)' }}>
            When requesting your quote, mention your kit purchase order number. Credit is applied at the fixed-quote stage before scheduling.
          </p>
        )}
      </div>
    </section>
  );
};

export default KitCreditRule;
