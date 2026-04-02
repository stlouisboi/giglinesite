import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-primary text-white" data-testid="footer">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              GigLine <span className="text-accent">Safety & Compliance</span>
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Safety Walkthroughs & Gap Checks for Small Operations
            </p>
            <div className="space-y-2">
              <a
                href="mailto:vince@giglinecompliance.com"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-accent transition-colors"
                data-testid="footer-email"
              >
                <Mail size={16} />
                vince@giglinecompliance.com
              </a>
              <a
                href="tel:336-671-4967"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-accent transition-colors"
                data-testid="footer-phone"
              >
                <Phone size={16} />
                336-671-4967
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/80 hover:text-accent transition-colors"
                      data-testid={`footer-link-${link.name.toLowerCase()}`}
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
            <h4 className="text-lg font-semibold mb-4">For Fleet Operators</h4>
            <p className="text-sm text-white/80 mb-4">
              Get free safety training resources from LaunchPath Transportation EDU.
            </p>
            <a
              href="https://launchpathedu.com/ground-0-briefing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors"
              data-testid="footer-launchpath-link"
            >
              Start with Ground 0 — Free
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p data-testid="footer-copyright">
              © {currentYear} GigLine Safety & Compliance. All rights reserved.
            </p>
            <p data-testid="footer-tagline">
              Verified against OSHA standards · Serving the Triad and surrounding region
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
