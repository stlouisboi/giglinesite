import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Search } from 'lucide-react';
import { trackPhoneClick } from '../utils/analytics';
import SiteSearch from './SiteSearch';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Global keyboard shortcut: '/' or Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e) => {
      const target = e.target;
      const isInInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (!isInInput && e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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
          {/* LEFT cell (mobile/tablet): phone icon + search. Desktop: nothing here, logo lives in LEFT of flex */}
          <div className="flex items-center justify-start gap-2 lg:hidden" data-testid="mobile-left-cell">
            <a
              href="tel:3363298899"
              onClick={() => trackPhoneClick('navbar_mobile_icon')}
              className="flex items-center justify-center w-11 h-11 rounded-full"
              style={{ background: 'rgba(31,111,235,0.08)', color: '#2A52A0' }}
              aria-label="Call GigLine"
              data-testid="mobile-phone-btn"
            >
              <Phone size={20} />
            </a>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-11 h-11 rounded-full"
              style={{ background: 'rgba(28,43,43,0.05)', color: '#1C2B2B' }}
              aria-label="Search"
              data-testid="mobile-search-btn"
            >
              <Search size={18} />
            </button>
          </div>

          {/* CENTER cell (mobile/tablet): logo centered. Desktop: logo + Carolina-Built credentials block, left-aligned */}
          <div className="flex items-center justify-center lg:justify-start gap-4 xl:gap-5">
            <Link
              to="/"
              className="flex items-center"
              data-testid="navbar-logo"
            >
              <img src="/gigline-logo-3d.png?v=6"
                alt="GigLine Safety & Compliance"
                className="h-[120px] md:h-48 lg:h-[168px] xl:h-[216px] 2xl:h-60 w-auto"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(28,43,43,0.10))' }}
                loading="eager"
                fetchPriority="high"
                width="209"
                height="100" />
            </Link>
            {/* Carolina-Built credentials — Full 3-line stack at xl+ (1280px+) only. Below xl there's no room without crowding the nav. */}
            <div
              className="hidden xl:flex flex-col leading-tight pl-4"
              style={{ borderLeft: '1px solid #dde3ea' }}
              data-testid="navbar-credentials"
            >
              <span
                className="uppercase whitespace-nowrap"
                style={{ fontSize: '10px', fontWeight: 600, color: '#2A52A0', letterSpacing: '0.14em' }}
              >
                Veteran-Owned
              </span>
              <span
                className="uppercase whitespace-nowrap mt-0.5"
                style={{ fontSize: '10px', fontWeight: 600, color: '#1C2B2B', letterSpacing: '0.14em' }}
              >
                Carolina-Built
              </span>
              <span
                className="whitespace-nowrap mt-1"
                style={{ fontSize: '11px', color: '#5a6878', fontWeight: 400 }}
              >
                Kernersville, NC
              </span>
            </div>
          </div>

          {/* Desktop Navigation — appears at lg (1024px+); tablet portrait gets the hamburger menu */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-7 pl-6 xl:pl-10" data-testid="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium transition-colors whitespace-nowrap"
                style={{ color: isActive(link.path) ? '#2A52A0' : '#1C2B2B' }}
                onMouseEnter={e => { if (!isActive(link.path)) e.target.style.color = '#2A52A0'; }}
                onMouseLeave={e => { if (!isActive(link.path)) e.target.style.color = isActive(link.path) ? '#2A52A0' : '#1C2B2B'; }}
                data-testid={`nav-link-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap pl-2 pr-1.5 py-1 rounded hover:bg-gray-100 group"
              style={{ color: '#1C2B2B' }}
              aria-label="Search the site"
              title="Search (press / or Ctrl+K)"
              data-testid="nav-search-btn"
            >
              <Search size={16} />
              <kbd
                className="hidden xl:inline-flex items-center justify-center text-[10px] font-mono font-semibold border rounded px-1.5 py-0.5 group-hover:border-gray-400 transition-colors"
                style={{ borderColor: '#D9E2EC', color: '#5B6B7A', minWidth: '20px', height: '18px', lineHeight: 1 }}
                data-testid="nav-search-hint"
              >
                /
              </kbd>
            </button>
            <a
              href="tel:3363298899"
              onClick={() => trackPhoneClick('navbar_desktop')}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap"
              style={{ color: '#1C2B2B' }}
              data-testid="nav-phone"
            >
              <Phone size={14} />
              (336) 329-8899
            </a>
            <Link
              to="/intake?service=compliance-readiness-visit"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              style={{ background: '#2A52A0', color: '#FFFFFF' }}
              onMouseEnter={e => e.target.style.background = '#1F3F80'}
              onMouseLeave={e => e.target.style.background = '#2A52A0'}
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
              style={{ color: '#1C2B2B' }}
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
                    color: isActive(link.path) ? '#2A52A0' : '#1C2B2B',
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
                style={{ color: '#1C2B2B', minHeight: '52px' }}
                data-testid="mobile-nav-phone"
              >
                <Phone size={20} /> (336) 329-8899
              </a>
              <Link
                to="/intake?service=compliance-readiness-visit"
                className="flex items-center justify-center w-full text-center font-semibold rounded-lg mt-4"
                style={{ background: '#2A52A0', color: '#FFFFFF', minHeight: '56px', fontSize: '16px' }}
                onClick={() => setIsOpen(false)}
                data-testid="mobile-nav-cta-button"
              >
                Schedule a Visit
              </Link>
            </div>
          </div>
        )}
      </nav>
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
