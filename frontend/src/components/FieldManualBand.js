import React from 'react';
import { Download, FileText } from 'lucide-react';

/*
  FieldManualBand
  ──────────────────────────────────────────────────────
  Reusable lead-magnet band for the 2026 Triad OSHA Field Manual.
  Used on Homepage (after case study teaser) and About (after credentials).
  Navy + gold palette to match site brand and case study visual continuity.
*/

const NAVY = '#0A1628';
const GOLD = '#C5A059';
const mono = { fontFamily: "'JetBrains Mono', monospace" };
const heading = { fontFamily: "'Manrope', sans-serif" };

const FieldManualBand = ({ source = 'homepage' }) => {
  return (
    <section
      className="py-20 md:py-24"
      style={{ backgroundColor: '#F7F9FC' }}
      data-testid={`field-manual-band-${source}`}
    >
      <div className="container max-w-5xl px-5 md:px-8">
        <div
          className="grid md:grid-cols-12 gap-8 md:gap-12 items-center p-7 md:p-10"
          style={{
            backgroundColor: 'white',
            border: '1px solid rgba(11,31,51,0.10)',
            boxShadow: '0 2px 12px rgba(11,31,51,0.04)',
          }}
        >
          {/* Left — cover thumbnail / icon */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <div
              className="relative flex flex-col items-center justify-center text-center w-full max-w-[200px] aspect-[3/4]"
              style={{
                backgroundColor: NAVY,
                color: 'white',
                boxShadow: '0 12px 30px rgba(11,31,51,0.18)',
              }}
              data-testid="field-manual-cover"
            >
              <FileText size={28} style={{ color: GOLD }} className="mb-3" />
              <p
                className="uppercase tracking-[0.18em] mb-2"
                style={{ ...mono, fontSize: '9px', color: 'rgba(255,255,255,0.55)' }}
              >
                2026 Edition
              </p>
              <p
                className="font-bold text-[15px] leading-tight px-3 mb-3"
                style={heading}
              >
                The Triad OSHA Field Manual
              </p>
              <span
                className="block w-10 h-px"
                style={{ backgroundColor: GOLD }}
              />
              <p
                className="text-[10px] mt-3 px-3"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                GigLine Safety &amp; Compliance
              </p>
            </div>
          </div>

          {/* Right — copy + CTA */}
          <div className="md:col-span-8">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-4"
              style={{ color: '#1F6FEB', ...mono, fontSize: '11px' }}
              data-testid="field-manual-kicker"
            >
              Free &middot; 12-Page Reference
            </p>
            <h2
              className="text-2xl md:text-[28px] font-bold leading-tight mb-4"
              style={{ ...heading, color: NAVY }}
              data-testid="field-manual-headline"
            >
              The 2026 Triad OSHA Field Manual
            </h2>
            <p
              className="text-base md:text-[17px] leading-relaxed mb-6"
              style={{ color: 'rgba(11,31,51,0.72)' }}
              data-testid="field-manual-summary"
            >
              The 7 violations OSHA cites Piedmont Triad manufacturers for most often &mdash; with CFR citations, real penalty ranges, what they look like on the floor, and the fix for each one. The same reference I hand to clients.
            </p>

            <a
              href="/assets/gl-fm-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 transition-all text-[15px]"
              style={{
                backgroundColor: NAVY,
                color: 'white',
                ...heading,
                boxShadow: '0 6px 18px rgba(11,31,51,0.18)',
              }}
              data-testid={`field-manual-cta-${source}`}
            >
              <Download size={16} />
              Download the PDF
            </a>
            <p
              className="text-[12px] mt-3"
              style={{ color: 'rgba(11,31,51,0.55)' }}
              data-testid="field-manual-disclaimer"
            >
              No opt-in required. Yours to keep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldManualBand;
