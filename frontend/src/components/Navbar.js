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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3"
            data-testid="navbar-logo"
          >
            {/* Shield Icon - Premium GigLine mark */}
            <svg viewBox="0 0 200 240" className="w-11 h-14 md:w-14 md:h-16">
              <path d="M100 8 L188 52 L188 140 Q188 195 100 232 Q12 195 12 140 L12 52 Z" fill="#FFFFFF"/>
              <path d="M100 20 L178 60 L178 138 Q178 188 100 222 Q22 188 22 138 L22 60 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
              <line x1="100" y1="48" x2="100" y2="205" stroke="#B8975A" strokeWidth="3.5" strokeLinecap="round"/>
              <rect x="88" y="118" width="24" height="16" rx="2" fill="#B8975A"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-white leading-tight tracking-tight">GigLine</span>
              <span className="text-[10px] md:text-xs font-medium text-[#B8975A] tracking-[0.2em]">SAFETY & COMPLIANCE</span>
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
