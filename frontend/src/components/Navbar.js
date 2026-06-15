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
    { name: 'Safety Check', path: '/safety-check' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }} data-testid="navbar">
      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-28 md:h-32 lg:h-36">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="navbar-logo">
            <img
              src="/gigline-logo-2026.png"
              alt="GigLine Safety & Compliance"
              className="h-24 md:h-28 lg:h-28 xl:h-32 w-auto"
              loading="eager"
              fetchPriority="high"
              width="252"
              height="100"
            />
          </Link>

          {/* Desktop Navigation — appears at lg (1024px+); tablet portrait gets the hamburger menu */}
          <div className="hidden lg:flex items-center space-x-7 xl:space-x-8 pl-8 xl:pl-12" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium transition-colors"
                style={{ color: isActive(link.path) ? '#1F6FEB' : '#102133' }}
                onMouseEnter={e => { if (!isActive(link.path)) e.target.style.color = '#1F6FEB'; }}
                onMouseLeave={e => { if (!isActive(link.path)) e.target.style.color = isActive(link.path) ? '#1F6FEB' : '#102133'; }}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:3363298899"
              onClick={() => trackPhoneClick('navbar_desktop')}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: '#102133' }}
              data-testid="nav-phone"
            >
              <Phone size={14} />
              (336) 329-8899
            </a>
            <Link
              to="/request-walkthrough"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              style={{ background: '#1F6FEB', color: '#FFFFFF' }}
              onMouseEnter={e => e.target.style.background = '#1558C0'}
              onMouseLeave={e => e.target.style.background = '#1F6FEB'}
              data-testid="nav-cta-button"
            >
              Request a Walkthrough
            </Link>
          </div>

          {/* Mobile + Tablet: Phone + Menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="tel:3363298899"
              onClick={() => trackPhoneClick('navbar_mobile_icon')}
              className="flex items-center justify-center w-12 h-12 rounded-full"
              style={{ background: 'rgba(31,111,235,0.08)', color: '#1F6FEB' }}
              aria-label="Call GigLine"
              data-testid="mobile-phone-btn"
            >
              <Phone size={20} />
            </a>
            <button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-md"
              style={{ color: '#102133' }}
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
                    color: isActive(link.path) ? '#1F6FEB' : '#102133',
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
                style={{ color: '#102133', minHeight: '52px' }}
                data-testid="mobile-nav-phone"
              >
                <Phone size={20} /> (336) 329-8899
              </a>
              <Link
                to="/request-walkthrough"
                className="flex items-center justify-center w-full text-center font-semibold rounded-lg mt-4"
                style={{ background: '#1F6FEB', color: '#FFFFFF', minHeight: '56px', fontSize: '16px' }}
                onClick={() => setIsOpen(false)}
                data-testid="mobile-nav-cta-button"
              >
                Request a Walkthrough
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
