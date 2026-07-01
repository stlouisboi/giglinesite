import React from 'react';
import { Download } from 'lucide-react';

/*
  FieldManualBand
  ──────────────────────────────────────────────────────
  Reusable lead-magnet band for the 2026 Triad OSHA Field Manual.
  Used on Homepage (after case study teaser) and About (after credentials).
  Renders the actual PDF cover as a clickable thumbnail.
*/

const NAVY = '#0A1628';
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
          {/* Left — actual PDF cover thumbnail */}
          <div className="md:col-span-4 flex justify-center md:justify-start">
            <a
              href="/assets/gl-fm-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block group transition-transform hover:-translate-y-1"
              style={{ width: '100%', maxWidth: '220px' }}
              data-testid="field-manual-cover-link"
              aria-label="Open the 2026 Triad OSHA Field Manual"
            >
              <img src="/assets/gl-fm-2026-cover.webp" height="1000" width="772"
                alt="The 2026 Triad OSHA Field Manual — cover"
                className="w-full h-auto block"
                style={{
                  aspectRatio: '772 / 1000',
                  objectFit: 'cover',
                  boxShadow: '0 14px 36px rgba(11,31,51,0.22)',
                }}
                loading="lazy"
                data-testid="field-manual-cover" />
            </a>
          </div>

          {/* Right — copy + CTA */}
          <div className="md:col-span-8">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-4"
              style={{ color: '#2A52A0', ...mono, fontSize: '11px' }}
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
