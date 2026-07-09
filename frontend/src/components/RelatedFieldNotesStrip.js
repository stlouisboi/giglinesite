import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * RelatedFieldNotesStrip — reusable footer band for service pages that surfaces 3-4
 * hand-picked Field Notes. Purpose: pass link equity from service pages (which
 * receive the strongest inbound links from the homepage/nav) down to the Field
 * Notes cluster so Google indexes and ranks those long-tail pages faster.
 *
 * Usage:
 *   <RelatedFieldNotesStrip
 *     kicker="Recommended Reading"
 *     heading="Field Notes that pair with this service"
 *     notes={[
 *       { slug: 'recordkeeping-300-log', title: 'OSHA 300 Log — the mistakes I see', blurb: '…' },
 *     ]}
 *   />
 *
 * All colors default to the standard GigLine navy/gold palette so the strip
 * drops into any service page without theme overrides.
 */
const RelatedFieldNotesStrip = ({
  kicker = 'Recommended Reading',
  heading = 'Field Notes that pair with this service',
  intro = 'Notes from the floor — plain language, no fluff, no fear-mongering.',
  notes = [],
  navy = '#102A43',
  gold = '#C9A84C',
  bg = '#FBFBF9',
  border = '#e8e5dd',
}) => {
  if (!notes.length) return null;
  return (
    <section
      className="py-16 md:py-20"
      style={{ background: bg, borderTop: `1px solid ${border}` }}
      data-testid="related-field-notes"
    >
      <div className="container max-w-5xl mx-auto px-5 md:px-8">
        <div className="mb-10">
          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: gold, fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
          >
            {kicker}
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight mb-3"
            style={{ color: navy, fontFamily: "'Manrope', sans-serif" }}
          >
            {heading}
          </h2>
          <p
            className="text-base md:text-[17px] leading-relaxed max-w-2xl"
            style={{ color: 'rgba(10,22,40,0.65)', fontFamily: "Georgia, serif" }}
          >
            {intro}
          </p>
        </div>
        <div className={`grid gap-4 md:gap-5 ${notes.length >= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          {notes.map((n) => (
            <Link
              key={n.slug}
              to={`/field-notes/${n.slug}`}
              className="group block rounded-md p-5 md:p-6 transition-shadow"
              style={{
                background: 'white',
                border: `1px solid ${border}`,
                boxShadow: '0 4px 12px rgba(16,42,67,0.04)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 10px 28px rgba(16,42,67,0.10)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,42,67,0.04)')}
              data-testid={`related-field-note-${n.slug}`}
            >
              <p
                className="uppercase font-bold tracking-[0.18em] mb-3"
                style={{ color: 'rgba(10,22,40,0.5)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px' }}
              >
                Field Note
              </p>
              <h3
                className="font-bold text-[17px] md:text-[18px] leading-snug mb-2.5"
                style={{ color: navy, fontFamily: "'Manrope', sans-serif" }}
              >
                {n.title}
              </h3>
              <p
                className="text-[14px] md:text-[14.5px] leading-[1.6] mb-4"
                style={{ color: 'rgba(10,22,40,0.65)', fontFamily: "Georgia, serif" }}
              >
                {n.blurb}
              </p>
              <span
                className="inline-flex items-center gap-1.5 font-bold text-[13px] transition-colors"
                style={{ color: navy }}
              >
                Read the note
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/field-notes"
            className="inline-flex items-center gap-2 font-bold text-[14px] md:text-[15px] underline hover:no-underline"
            style={{ color: navy }}
            data-testid="related-field-notes-view-all"
          >
            Browse all Field Notes
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedFieldNotesStrip;
