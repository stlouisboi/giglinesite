import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#091725] text-white" data-testid="footer">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img
                src="/gigline-logo-dark-bg.png?v=4"
                alt="GigLine Safety & Compliance"
                className="h-16 w-auto"
                loading="lazy"
                width="240"
                height="86"
              />
            </div>
            <p className="text-white/60 text-sm mb-4">
              Safety Walkthroughs and Documentation Readiness Reviews for Small Operations
            </p>
            <a
              href="https://share.google/Uw7Uc7YHr7EiiTuAM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-4"
              data-testid="footer-google-reviews"
            >
              <span style={{ color: '#D4A93E' }}>★</span> 5.0 on Google Reviews
            </a>
            <p className="text-white/50 text-sm mb-4">Kernersville, NC</p>
            <div className="space-y-2">
              <a
                href="mailto:vince@giglinecompliance.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#1560ae] transition-colors"
                data-testid="footer-email"
              >
                <Mail size={16} />
                vince@giglinecompliance.com
              </a>
              <a
                href="tel:336-329-8899"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#1560ae] transition-colors"
                data-testid="footer-phone"
              >
                <Phone size={16} />
                336-329-8899
              </a>
              <Link
                to="/intake?service=compliance-readiness-visit"
                className="inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: '#c8922a' }}
                data-testid="footer-request-visit"
              >
                Request a Visit &rarr;
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white/90">Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Services', path: '/services' },
                  { name: 'Field Notes', path: '/field-notes' },
                  { name: 'Service Areas', path: '/service-areas' },
                  { name: 'About', path: '/about' },
                  { name: 'FAQ', path: '/faq' },
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 hover:text-[#1560ae] transition-colors"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white/90">Resources</h4>
            <nav aria-label="Footer resources">
              <ul className="space-y-4">
                {[
                  {
                    name: 'Supervisor Safety Starter System',
                    path: '/supervisor-kit',
                    desc: '11 documents. CFR-cited. $600 digital · $675 physical. Included free with every Compliance Readiness Visit.',
                  },
                  {
                    name: 'Safety Check',
                    path: '/safety-check',
                    desc: 'Free 90-second self-screen. No email required.',
                  },
                  {
                    name: 'Heat Stress Guide',
                    path: '/field-notes/heat-stress',
                    desc: 'OSHA requirements for outdoor and indoor heat exposure.',
                  },
                  {
                    name: 'HazCom Starter Pack',
                    path: '/hazcom',
                    desc: 'Labels, SDS, and written program basics.',
                  },
                  {
                    name: 'Top 5 OSHA Violations',
                    path: '/blog/top-5-osha-violations-small-manufacturing',
                    desc: "The citations most small operations don't see coming.",
                  },
                  {
                    name: 'HazCom Requirements Guide',
                    path: '/blog/hazcom-requirements-small-business',
                    desc: 'Full breakdown of the HazCom standard.',
                  },
                ].map((link) => (
                  <li key={link.path + link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/80 hover:text-[#1560ae] transition-colors font-medium block"
                      data-testid={`footer-resource-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </Link>
                    <p className="text-xs text-white/45 mt-1 leading-snug">{link.desc}</p>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p data-testid="footer-copyright">
              &copy; {currentYear} GigLine Safety & Compliance. All rights reserved.
            </p>
            <nav className="flex items-center gap-4 flex-wrap justify-center" data-testid="footer-legal-links">
              <Link to="/privacy-policy" className="hover:text-white transition-colors" data-testid="footer-privacy-link">
                Privacy Policy
              </Link>
              <span className="text-white/20">&middot;</span>
              <Link to="/terms-of-service" className="hover:text-white transition-colors" data-testid="footer-terms-link">
                Terms of Service
              </Link>
              <span className="text-white/20">&middot;</span>
              <a
                href="https://www.linkedin.com/in/vincenttlawrence/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vince Lawrence on LinkedIn"
                className="text-white/40 hover:text-white transition-colors inline-flex items-center"
                data-testid="footer-linkedin-link"
              >
                <Linkedin size={16} />
              </a>
            </nav>
          </div>
          <p data-testid="footer-tagline" className="text-center md:text-right text-sm text-white/40 mt-4 md:mt-2">
            Serving small operations that need clarity, not complexity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
