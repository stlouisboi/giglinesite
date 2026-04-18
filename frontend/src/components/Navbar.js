import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white border-b" style={{ borderColor: '#D9E2EC' }} data-testid="navbar">
      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="navbar-logo">
            <svg viewBox="0 0 160 180" className="w-12 h-[54px] md:w-14 md:h-[63px]">
              <path d="M80,38 L136,57 L136,120 Q136,153 80,172 Q24,153 24,120 L24,57 Z"
                fill="#0B1F33" stroke="#0B1F33" strokeWidth="2.2"/>
              <path d="M80,47 L127,64 L127,120 Q127,147 80,163 Q33,147 33,120 L33,64 Z"
                fill="none" stroke="#2A9D8F" strokeWidth="0.9"/>
              <line x1="80" y1="57" x2="80" y2="96" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="butt"/>
              <rect x="72" y="96" width="16" height="8" rx="1.5" fill="#FFFFFF"/>
              <rect x="76" y="97.5" width="8" height="5" rx="0.5" fill="#2A9D8F"/>
              <line x1="80" y1="104" x2="80" y2="148" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="butt"/>
              <line x1="72" y1="65" x2="88" y2="65" stroke="#2A9D8F" strokeWidth="1" strokeDasharray="2,2" strokeLinecap="round"/>
              <line x1="72" y1="140" x2="88" y2="140" stroke="#2A9D8F" strokeWidth="1" strokeDasharray="2,2" strokeLinecap="round"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold leading-tight tracking-tight" style={{ fontFamily: "'Manrope', sans-serif", color: '#0B1F33' }}>GigLine</span>
              <span className="w-full h-px my-0.5" style={{ background: '#2A9D8F' }} />
              <span className="text-[10px] md:text-xs font-medium tracking-[0.2em]" style={{ color: '#5B6B7A' }}>SAFETY & COMPLIANCE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium transition-colors"
                style={{ color: isActive(link.path) ? '#1F6FEB' : '#5B6B7A' }}
                onMouseEnter={e => { if (!isActive(link.path)) e.target.style.color = '#102133'; }}
                onMouseLeave={e => { if (!isActive(link.path)) e.target.style.color = '#5B6B7A'; }}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:3363298899"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: '#0B1F33' }}
              data-testid="nav-phone"
            >
              <Phone size={14} />
              (336) 329-8899
            </a>
            <Link
              to="/request-walkthrough"
              className="btn-primary text-sm"
              data-testid="nav-cta-button"
            >
              Request a Walkthrough
            </Link>
          </div>

          {/* Mobile: Phone + Menu */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="tel:3363298899"
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{ background: 'rgba(31,111,235,0.08)', color: '#1F6FEB' }}
              aria-label="Call GigLine"
              data-testid="mobile-phone-btn"
            >
              <Phone size={18} />
            </a>
            <button
              type="button"
              className="p-2 transition-colors"
              style={{ color: '#0B1F33' }}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              data-testid="mobile-menu-button"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div id="mobile-menu" className="md:hidden border-t" style={{ borderColor: '#D9E2EC', background: '#FFFFFF' }} data-testid="mobile-menu">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-lg font-medium transition-colors"
                  style={{ color: isActive(link.path) ? '#1F6FEB' : '#102133' }}
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                </Link>
              ))}
              <a href="tel:3363298899" className="flex items-center gap-2 text-lg font-medium" style={{ color: '#0B1F33' }} data-testid="mobile-nav-phone">
                <Phone size={18} /> (336) 329-8899
              </a>
              <Link to="/request-walkthrough" className="btn-primary w-full text-center mt-4 block" onClick={() => setIsOpen(false)} data-testid="mobile-nav-cta-button">
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
