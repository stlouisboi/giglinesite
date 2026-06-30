import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage = () => {
  return (
    <main data-testid="not-found-page">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to GigLine Safety & Compliance."
        canonical="/404"
        noindex
      />

      <section className="py-24 md:py-32 bg-[#102A43] text-white min-h-[60vh] flex items-center">
        <div className="container max-w-2xl text-center">
          <p
            className="text-[120px] md:text-[180px] font-extrabold leading-none mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(201, 168, 76, 0.15)' }}
          >
            404
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4" data-testid="not-found-headline">
            Page Not Found
          </h1>
          <p className="text-white/60 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="bg-[#C9A84C] hover:bg-[#B8972C] text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
              data-testid="not-found-home-cta"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/safety-check"
              className="border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
              data-testid="not-found-safety-cta"
            >
              Take the Free Safety Check
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
