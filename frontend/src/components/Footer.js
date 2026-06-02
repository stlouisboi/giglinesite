import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#091725] text-white" data-testid="footer">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img
                src="/gigline-logo-2026-white.png"
                alt="GigLine Safety & Compliance"
                className="h-14 w-auto"
                loading="lazy"
                width="232"
                height="90"
              />
            </div>
            <p className="text-white/60 text-sm mb-4">
              Safety Walkthroughs and Gap Checks for Small Operations
            </p>
            <p className="text-white/50 text-sm mb-4">Kernersville, NC</p>
            <div className="space-y-2">
              <a
                href="mailto:vince@giglinecompliance.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#1558C0] transition-colors"
                data-testid="footer-email"
              >
                <Mail size={16} />
                vince@giglinecompliance.com
              </a>
              <a
                href="tel:336-329-8899"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#1558C0] transition-colors"
                data-testid="footer-phone"
              >
                <Phone size={16} />
                336-329-8899
              </a>
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
                  { name: 'Service Areas', path: '/service-areas' },
                  { name: 'About', path: '/about' },
                  { name: 'FAQ', path: '/faq' },
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 hover:text-[#1558C0] transition-colors"
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
              <ul className="space-y-2">
                {[
                  { name: 'Field Notes', path: '/field-notes' },
                  { name: 'Safety Check', path: '/safety-check' },
                  { name: 'Heat Stress Guide', path: '/field-notes/heat-stress' },
                  { name: 'HazCom Starter Pack', path: '/hazcom' },
                  { name: 'Top 5 OSHA Violations', path: '/blog/top-5-osha-violations-small-manufacturing' },
                  { name: 'HazCom Requirements Guide', path: '/blog/hazcom-requirements-small-business' },
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.path + link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 hover:text-[#1558C0] transition-colors"
                      data-testid={`footer-resource-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* LaunchPath Reference */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white/90">For Motor Carriers</h4>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              GigLine handles on-site safety for local operations. If you're a new motor carrier building FMCSA compliance, visit LaunchPath Transportation EDU.
            </p>
            <img
              src="/launchpath-logo-white.png"
              alt="LaunchPath"
              className="h-8 mb-3"
            />
            <div className="space-y-2">
              <a
                href="https://launchpathedu.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#1558C0] transition-colors"
                data-testid="footer-launchpath-site-link"
              >
                launchpathedu.com
                <ExternalLink size={14} />
              </a>
              <br />
              <a
                href="https://launchpathedu.com/ground-0-briefing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#1558C0] hover:text-[#1558C0]/80 transition-colors"
                data-testid="footer-launchpath-link"
              >
                Start with Ground 0 — Free
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p data-testid="footer-copyright">
              &copy; {currentYear} GigLine Safety & Compliance. All rights reserved.
            </p>
            <p data-testid="footer-tagline">
              Serving small operations that need clarity, not complexity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
