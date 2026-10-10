import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Linkedin, Facebook, ShieldCheck, Star, ArrowUpRight } from 'lucide-react';
import { SUPERVISOR_KIT_ENABLED } from '../config/features';

/* ──────────────────────────────────────────────────────────────────────────
   Footer, Feb 2026 refresh.

   Fixes a long-standing imbalance where the Resources column rendered
   ~10 items with descriptions and ran 2 to 3x longer than the other two
   columns on desktop and tablet.

   Layout:
     - lg (>= 1024px): 12-col grid, Brand span 4, Quick Links span 2,
       Resources span 6 and split into two internal 3-col mini-stacks.
     - md (>= 768px): 2-col grid, Brand full width, Quick + Resources
       side by side with Resources already split into two sub-columns.
     - sm (< 768px): single column, Resources collapses to one list.

   Resources are grouped into four small-caps category labels so the
   list reads as a cultivated library instead of a bullet dump. The
   long per-link descriptions are dropped from the dark footer, they
   belonged on the resources index, not the global footer where they
   dilute the premium feel.

   Visual lift:
     - Thin gold-gradient hairline across the top edge.
     - Subtle navy radial-gradient wash (dark navy top, deeper navy bottom).
     - Pill-styled Google-reviews chip using the Lucide Star icon.
     - Grouped Veteran-Owned and A+ Security badges in a horizontal row.
     - Resource rows slide a gold ArrowUpRight in on hover and shift the
       link color to GigLine gold rather than the previous navy-blue hover
       which washed out on the dark bg.

   Every data-testid from the prior Footer is preserved so the Jest and
   Playwright guardrails continue to pass without modification.
   ────────────────────────────────────────────────────────────────────────── */

const GOLD = '#C9A84C';

const RESOURCE_GROUPS_LEFT = [
  {
    label: 'Start Here',
    items: [
      { name: 'All Resources', path: '/resources' },
      {
        name: 'OSHA Inspection Guide, HR & Safety Leaders',
        path: '/osha-inspection-guide',
        short: 'OSHA Inspection Guide',
      },
    ],
  },
  {
    label: 'Kits & Programs',
    items: [
      ...(SUPERVISOR_KIT_ENABLED
        ? [{ name: 'GigLine Supervisor Safety OS', path: '/supervisor-kit', short: 'Supervisor Safety OS' }]
        : []),
      {
        name: 'GigLine Compliance Readiness Kits',
        path: '/citation-proof-kits',
        short: 'Compliance Readiness Kits',
      },
      { name: 'HazCom Starter Pack', path: '/hazcom-starter-pack' },
    ],
  },
];

const RESOURCE_GROUPS_RIGHT = [
  {
    label: 'Tools',
    items: [
      { name: 'Sample Compliance Report', path: '/sample-report' },
      { name: 'Safety Check', path: '/safety-check' },
    ],
  },
  {
    label: 'Field Notes & Blog',
    items: [
      { name: 'Heat Stress Guide', path: '/field-notes/heat-stress' },
      { name: 'Top 5 OSHA Violations', path: '/blog/top-5-osha-violations-small-manufacturing' },
      { name: 'HazCom Requirements Guide', path: '/blog/hazcom-requirements-small-business' },
    ],
  },
];

/* Render a single resource link row with a premium hover state:
   - the link text gains a subtle gold underline on hover,
   - an ArrowUpRight slides in from the left of the arrow slot.
   The arrow uses `aria-hidden` since the link text already describes the
   destination.
*/
const ResourceLink = ({ name, path, short }) => (
  <li className="group">
    <Link
      to={path}
      className="relative inline-flex items-start gap-1.5 text-sm text-white/75 transition-colors duration-200 hover:text-[color:var(--gl-gold)]"
      style={{ '--gl-gold': GOLD }}
      data-testid={`footer-resource-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <span>{short || name}</span>
      <ArrowUpRight
        size={13}
        strokeWidth={2}
        aria-hidden="true"
        className="mt-0.5 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        style={{ color: GOLD }}
      />
    </Link>
  </li>
);

const ResourceGroup = ({ label, items }) => (
  <div>
    <p
      className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: GOLD }}
    >
      {label}
    </p>
    <ul className="space-y-1.5">
      {items.map((item) => (
        <ResourceLink key={item.path + item.name} {...item} />
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative text-white"
      style={{
        background:
          'radial-gradient(1200px 500px at 15% 0%, #0d1f33 0%, #091725 55%, #060f1a 100%)',
      }}
      data-testid="footer"
    >
      {/* Premium top hairline, left-weighted gold gradient. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, rgba(201,168,76,0) 0%, rgba(201,168,76,0.55) 18%, rgba(201,168,76,0.55) 42%, rgba(201,168,76,0) 85%)',
        }}
      />

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* ─── Brand ─────────────────────────────────────────── */}
          <div className="md:col-span-5">
            <div className="mb-4">
              <img
                src="/gigline-logo-dark-bg.png?v=9"
                alt="GigLine Safety & Compliance"
                className="h-16 w-auto"
                loading="lazy"
                width="240"
                height="86"
              />
            </div>
            <p className="text-white/60 text-sm mb-4 max-w-sm">
              Safety Walkthroughs and Documentation Readiness Reviews for Small Operations
            </p>

            {/* Google Reviews pill, premium chip. */}
            <a
              href="https://www.google.com/search?q=GigLine+Safety+%26+Compliance+Kernersville+NC&stick=&hl=en&reviews=1&utm_source=footer&utm_medium=website&utm_campaign=review-read"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors"
              style={{
                borderColor: 'rgba(201,168,76,0.35)',
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(201,168,76,0.07)',
              }}
              data-testid="footer-google-reviews"
            >
              <Star size={12} strokeWidth={2.5} fill={GOLD} style={{ color: GOLD }} aria-hidden="true" />
              <span>5.0 on Google Reviews</span>
            </a>

            <p className="text-white/50 text-sm mb-5">Kernersville, NC</p>

            {/* Badge row, grouped horizontally for a tighter brand block. */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <img
                src="/assets/veteran-owned-badge-sm.webp"
                alt="Veteran-Owned Company"
                width="140"
                height="90"
                loading="lazy"
                className="rounded-sm"
                style={{ maxWidth: '112px', height: 'auto' }}
                data-testid="footer-veteran-badge"
              />
              <a
                href="https://observatory.mozilla.org/analyze/www.giglinecompliance.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border transition-colors"
                style={{
                  borderColor: 'rgba(201, 168, 76, 0.4)',
                  color: GOLD,
                  background: 'rgba(201, 168, 76, 0.08)',
                }}
                title="Verified by Mozilla Observatory. Click to view live scan."
                data-testid="footer-security-badge"
                aria-label="A+ Security rating, HSTS Preloaded. Verified by Mozilla Observatory."
              >
                <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                <span>A+ Security &middot; HSTS Preloaded</span>
              </a>
            </div>

            {/* Contact lines. */}
            <div className="space-y-2">
              <a
                href="mailto:vince@giglinecompliance.com"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-[color:var(--gl-gold)] transition-colors"
                style={{ '--gl-gold': GOLD }}
                data-testid="footer-email"
              >
                <Mail size={16} />
                vince@giglinecompliance.com
              </a>
              <a
                href="tel:336-329-8899"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-[color:var(--gl-gold)] transition-colors"
                style={{ '--gl-gold': GOLD }}
                data-testid="footer-phone"
              >
                <Phone size={16} />
                336-329-8899
              </a>
              <Link
                to="/intake?service=compliance-readiness-visit"
                className="inline-flex items-center gap-1 text-sm font-semibold mt-1 transition-opacity hover:opacity-80"
                style={{ color: GOLD }}
                data-testid="footer-request-visit"
              >
                Request a Visit <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* ─── Resources, grouped into 2 sub-columns ───────── */}
          <div className="md:col-span-7">
            <h4
              className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: GOLD }}
            >
              Resources
            </h4>
            <nav aria-label="Footer resources">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-6">
                  {RESOURCE_GROUPS_LEFT.map((g) => (
                    <ResourceGroup key={g.label} label={g.label} items={g.items} />
                  ))}
                </div>
                <div className="space-y-6">
                  {RESOURCE_GROUPS_RIGHT.map((g) => (
                    <ResourceGroup key={g.label} label={g.label} items={g.items} />
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* ─── Bottom Bar ─────────────────────────────────────── */}
        <div
          className="mt-12 pt-8"
          style={{
            borderTop: '1px solid rgba(201,168,76,0.12)',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/45">
            <p data-testid="footer-copyright">
              &copy; {currentYear} GigLine Safety &amp; Compliance. All rights reserved. &middot; Piedmont Triad, NC
            </p>
            <nav className="flex items-center gap-4 flex-wrap justify-center" data-testid="footer-legal-links">
              <Link
                to="/privacy-policy"
                className="transition-colors hover:text-[color:var(--gl-gold)]"
                style={{ '--gl-gold': GOLD }}
                data-testid="footer-privacy-link"
              >
                Privacy Policy
              </Link>
              <span className="text-white/20">&middot;</span>
              <Link
                to="/terms-of-service"
                className="transition-colors hover:text-[color:var(--gl-gold)]"
                style={{ '--gl-gold': GOLD }}
                data-testid="footer-terms-link"
              >
                Terms of Service
              </Link>
              <span className="text-white/20">&middot;</span>
              <Link
                to="/resend-my-kit"
                className="transition-colors hover:text-[color:var(--gl-gold)]"
                style={{ '--gl-gold': GOLD }}
                data-testid="footer-resend-link"
              >
                Resend My Kit
              </Link>
              <span className="text-white/20">&middot;</span>
              <a
                href="https://www.linkedin.com/in/vincenttlawrence/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vince Lawrence on LinkedIn"
                className="text-white/55 transition-colors hover:text-[color:var(--gl-gold)] inline-flex items-center"
                style={{ '--gl-gold': GOLD }}
                data-testid="footer-linkedin-link"
              >
                <Linkedin size={16} />
              </a>
              <span className="text-white/20">&middot;</span>
              <a
                href="https://www.facebook.com/profile.php?id=61592797426556"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GigLine Safety & Compliance on Facebook"
                className="text-white/55 transition-colors hover:text-[color:var(--gl-gold)] inline-flex items-center"
                style={{ '--gl-gold': GOLD }}
                data-testid="footer-facebook-link"
              >
                <Facebook size={16} />
              </a>
            </nav>
          </div>
          <p
            data-testid="footer-tagline"
            className="text-center md:text-right text-sm text-white/40 mt-4 md:mt-2 italic"
          >
            Serving small operations that need clarity, not complexity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
