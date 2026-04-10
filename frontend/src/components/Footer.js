import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C2B2B] text-white" data-testid="footer">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 160 180" className="w-8 h-10">
                <path d="M80,38 L136,57 L136,120 Q136,153 80,172 Q24,153 24,120 L24,57 Z"
                  fill="#FFFFFF" stroke="#1C2B2B" strokeWidth="2.2"/>
                <path d="M80,47 L127,64 L127,120 Q127,147 80,163 Q33,147 33,120 L33,64 Z"
                  fill="none" stroke="#B8972C" strokeWidth="0.9"/>
                <line x1="80" y1="57" x2="80" y2="96"
                  stroke="#1C2B2B" strokeWidth="3" strokeLinecap="butt"/>
                <rect x="72" y="96" width="16" height="8" rx="1.5" fill="#1C2B2B"/>
                <rect x="76" y="97.5" width="8" height="5" rx="0.5" fill="#B8972C"/>
                <line x1="80" y1="104" x2="80" y2="148"
                  stroke="#1C2B2B" strokeWidth="3" strokeLinecap="butt"/>
                <line x1="72" y1="65" x2="88" y2="65"
                  stroke="#B8972C" strokeWidth="1" strokeDasharray="2,2" strokeLinecap="round"/>
                <line x1="72" y1="140" x2="88" y2="140"
                  stroke="#B8972C" strokeWidth="1" strokeDasharray="2,2" strokeLinecap="round"/>
              </svg>
              <div>
                <span className="text-lg font-bold text-white leading-tight tracking-tight block" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>GigLine</span>
                <span className="block w-full h-px bg-[#B8972C] my-0.5"></span>
                <span className="text-[9px] font-normal text-white/80 tracking-[0.2em]" style={{fontFamily: "Arial, Helvetica, sans-serif"}}>SAFETY & COMPLIANCE</span>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Safety Walkthroughs and Gap Checks for Small Operations
            </p>
            <p className="text-white/50 text-sm mb-4">Kernersville, NC</p>
            <div className="space-y-2">
              <a
                href="mailto:vince@giglinecompliance.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#B8972C] transition-colors"
                data-testid="footer-email"
              >
                <Mail size={16} />
                vince@giglinecompliance.com
              </a>
              <a
                href="tel:336-329-8899"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#B8972C] transition-colors"
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
                  { name: 'About', path: '/about' },
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 hover:text-[#B8972C] transition-colors"
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
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <li key={link.path + link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-white/60 hover:text-[#B8972C] transition-colors"
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
            <h4 className="text-base font-semibold mb-4 text-white/90">For Fleet Operators</h4>
            <p className="text-sm text-white/60 mb-4">
              For new or early-stage carriers, structured system installation is available through LaunchPath.
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
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#B8972C] transition-colors"
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
                className="inline-flex items-center gap-2 text-sm text-[#B8972C] hover:text-[#B8972C]/80 transition-colors"
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
