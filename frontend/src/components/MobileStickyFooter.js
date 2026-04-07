import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileStickyFooter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approximately 500px)
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show on contact or safety-check pages
  if (location.pathname === '/contact' || location.pathname === '/safety-check') return null;

  if (!isVisible) return null;

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border z-40 shadow-lg"
      data-testid="mobile-sticky-cta"
    >
      <Link 
        to="/safety-check" 
        className="block w-full bg-accent text-white text-center py-3 px-6 rounded-md font-medium"
      >
        Take the Free Safety Check
      </Link>
    </div>
  );
};

export default MobileStickyFooter;
