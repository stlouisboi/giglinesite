import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-primary shadow-md" data-testid="navbar">
      <nav className="container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3"
            data-testid="navbar-logo"
          >
            {/* Inspector Mark Shield - GL-LOGO-V2 */}
            <svg viewBox="0 0 160 180" className="w-16 h-[72px] md:w-20 md:h-[90px]">
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
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>GigLine</span>
              <span className="w-full h-px bg-[#B8972C] my-0.5"></span>
              <span className="text-xs md:text-sm font-normal text-white tracking-[0.2em]" style={{fontFamily: "Arial, Helvetica, sans-serif"}}>SAFETY & COMPLIANCE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-white hover:text-accent'
                }`}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="btn-primary text-sm"
              data-testid="nav-cta-button"
            >
              Request a Review
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-white hover:text-accent"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            data-testid="mobile-menu-button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div 
            id="mobile-menu" 
            className="md:hidden bg-primary border-t border-white/10"
            data-testid="mobile-menu"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-lg font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-accent'
                      : 'text-white hover:text-accent'
                  }`}
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="btn-primary w-full text-center mt-4"
                onClick={() => setIsOpen(false)}
                data-testid="mobile-nav-cta-button"
              >
                Request a Review
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
