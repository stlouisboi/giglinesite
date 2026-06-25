import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { trackPhoneClick } from '../utils/analytics';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Field Notes', path: '/field-notes' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} data-testid="navbar">
      <nav className="container" aria-label="Main navigation">
        {/* Mobile + Tablet: 3-column grid (icons | logo | icons) so logo stays centered. Desktop: flex justify-between. */}
        <div className="grid grid-cols-3 items-center h-20 md:h-24 lg:flex lg:justify-between lg:h-24 xl:h-28 2xl:h-32">
          {/* LEFT cell (mobile/tablet): phone icon. Desktop: nothing here, logo lives in LEFT of flex */}
          <div className="flex items-center justify-start lg:hidden" data-testid="mobile-left-cell">
            <a
              href="tel:3363298899"
              onClick={() => trackPhoneClick('navbar_mobile_icon')}
              className="flex items-center justify-center w-11 h-11 rounded-full"
              style={{ background: 'rgba(31,111,235,0.08)', color: '#1a6fc4' }}
              aria-label="Call GigLine"
              data-testid="mobile-phone-btn"
            >
              <Phone size={20} />
            </a>
          </div>

          {/* CENTER cell (mobile/tablet): logo centered. Desktop: logo lives at left of flex via lg:justify-start */}
          <Link
            to="/"
            className="flex items-center justify-center lg:justify-start"
            data-testid="navbar-logo"
          >
            <img
              src="/gigline-logo-3d.png?v=3"
              alt="GigLine Safety & Compliance"
              className="h-14 md:h-20 lg:h-20 xl:h-24 2xl:h-28 w-auto"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(13,27,42,0.10))' }}
              loading="eager"
              fetchPriority="high"
              width="209"
              height="100"
            />
          </Link>

          {/* Desktop Navigation — appears at lg (1024px+); tablet portrait gets the hamburger menu */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-7 pl-6 xl:pl-10" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium transition-colors whitespace-nowrap"
                style={{ color: isActive(link.path) ? '#1a6fc4' : '#0d1b2a' }}
                onMouseEnter={e => { if (!isActive(link.path)) e.target.style.color = '#1a6fc4'; }}
                onMouseLeave={e => { if (!isActive(link.path)) e.target.style.color = isActive(link.path) ? '#1a6fc4' : '#0d1b2a'; }}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:3363298899"
              onClick={() => trackPhoneClick('navbar_desktop')}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap"
              style={{ color: '#0d1b2a' }}
              data-testid="nav-phone"
            >
              <Phone size={14} />
              (336) 329-8899
            </a>
            <Link
              to="/intake?service=compliance-readiness-visit"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              style={{ background: '#1a6fc4', color: '#FFFFFF' }}
              onMouseEnter={e => e.target.style.background = '#1560ae'}
              onMouseLeave={e => e.target.style.background = '#1a6fc4'}
              data-testid="nav-cta-button"
            >
              Schedule a Visit
            </Link>
          </div>

          {/* RIGHT cell (mobile/tablet): hamburger menu button */}
          <div className="flex items-center justify-end lg:hidden" data-testid="mobile-right-cell">
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 rounded-md"
              style={{ color: '#0d1b2a' }}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              data-testid="mobile-menu-button"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div id="mobile-menu" className="lg:hidden bg-white" style={{ borderTop: '1px solid #D9E2EC' }} data-testid="mobile-menu">
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center text-lg font-medium px-2 rounded-md"
                  style={{
                    color: isActive(link.path) ? '#1a6fc4' : '#0d1b2a',
                    minHeight: '52px',
                  }}
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="tel:3363298899"
                onClick={() => trackPhoneClick('navbar_mobile_drawer')}
                className="flex items-center gap-2 text-lg font-medium px-2 rounded-md"
                style={{ color: '#0d1b2a', minHeight: '52px' }}
                data-testid="mobile-nav-phone"
              >
                <Phone size={20} /> (336) 329-8899
              </a>
              <Link
                to="/intake?service=compliance-readiness-visit"
                className="flex items-center justify-center w-full text-center font-semibold rounded-lg mt-4"
                style={{ background: '#1a6fc4', color: '#FFFFFF', minHeight: '56px', fontSize: '16px' }}
                onClick={() => setIsOpen(false)}
                data-testid="mobile-nav-cta-button"
              >
                Schedule a Visit
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
