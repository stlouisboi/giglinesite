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
            {/* Shield Icon */}
            <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-12 md:h-12">
              <path d="M50 5 L92 14 L92 55 C92 78 50 95 50 95 C50 95 8 78 8 55 L8 14 Z" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="5"/>
              <rect x="45" y="20" width="10" height="60" fill="#2E6B5E" rx="2"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-white leading-tight">GigLine</span>
              <span className="text-[10px] md:text-xs font-semibold text-white/80 tracking-wider">SAFETY & COMPLIANCE</span>
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
