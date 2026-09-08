import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutTemplate } from 'lucide-react';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const BLUE = '#2A52A0';
const NAVY = '#102A43';
const GOLD = '#C9A84C';

/**
 * Cross-sell block rendered at the bottom of every Citation-Proof Kit detail page.
 * Routes qualified buyers toward the OSHA-Ready Control System without displacing the kit sale.
 */
const ControlSystemUpsell = ({ className = '' }) => {
  return (
    <section className={`py-14 md:py-20 ${className}`} style={{ background: NAVY }} data-testid="control-system-upsell">
      <div className="container max-w-5xl">
        <div className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6 md:gap-8 p-6 md:p-8" style={{ background: 'rgba(201,168,76,0.08)', border: `1.5px solid ${GOLD}` }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LayoutTemplate size={16} style={{ color: GOLD }} strokeWidth={2} />
              <p className="uppercase font-bold" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}>
                Need this implemented across your operation?
              </p>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold leading-[1.25] mb-3 text-white">
              GigLine can build a complete Digital Safety Control System.
            </h3>
            <p className="text-[14.5px] text-white/70 leading-[1.75] max-w-2xl">
              The Control System connects your programs, training records, inspections, corrective actions, and compliance documentation into one site-specific system inside your company-owned platform. Starting at $4,500.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/services/osha-ready-control-system"
              className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] whitespace-nowrap transition-colors"
              style={{ background: GOLD, color: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              data-testid="control-system-upsell-cta"
            >
              Explore the OSHA-Ready Control System <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControlSystemUpsell;
