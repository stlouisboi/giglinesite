import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Shield, ClipboardCheck } from 'lucide-react';
import SEO from '../components/SEO';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const HazComPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/hazcom/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin_url: window.location.origin }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main data-testid="hazcom-page">
      <SEO
        title="HazCom Starter Pack"
        description="HazCom Starter Pack — $29. Written HazCom program, SDS binder checklist, and training log. 11 pages. Fill your company name. Print. Done. Fixes OSHA's #1 citation in general industry."
        canonical="/hazcom"
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "HazCom Starter Pack — Small Shop Edition",
          "description": "Written HazCom program, SDS binder checklist + index, and training verification log. 11 pages total. 29 CFR 1910.1200(e) compliant.",
          "brand": { "@type": "Brand", "name": "GigLine Safety & Compliance" },
          "offers": {
            "@type": "Offer",
            "price": "29.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://www.giglinecompliance.com/hazcom"
          }
        }}
      />

      {/* Hero */}
      <section className="bg-[#0d1b2a] text-white py-16 md:py-24">
        <div className="container max-w-3xl">
          <p
            className="text-xs font-semibold tracking-widest text-[#1a6fc4] uppercase mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            data-testid="hazcom-label"
          >
            DIGITAL DOWNLOAD
          </p>
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            data-testid="hazcom-headline"
          >
            HazCom Starter Pack
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Small Shop Edition — <span className="text-[#1a6fc4] font-bold">$29</span>
          </p>
          <div className="border-l-2 border-[#1a6fc4] pl-6">
            <p className="text-lg text-white/90 font-medium mb-2">
              #1 OSHA citation in general industry.
            </p>
            <p className="text-white/60">
              Every shop has chemicals. Most don't have the paperwork.
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-14 md:py-20 border-b border-[#0d1b2a]/10">
        <div className="container max-w-3xl">
          <h2
            className="text-xl md:text-2xl font-bold text-[#0d1b2a] mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Most small operations are missing:
          </h2>
          <ul className="space-y-4 mb-8">
            {[
              'The written program OSHA asks for',
              'An SDS binder that\'s actually complete',
              'Training records that prove it happened',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[#0d1b2a]/70 text-base">
                <span className="text-[#1a6fc4] font-bold mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[#0d1b2a]/80 font-medium text-lg">
            One inspection finds all three. This pack fixes them.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-14 md:py-20 bg-[#F9F8F6]" data-testid="hazcom-whats-included">
        <div className="container max-w-4xl">
          <h2
            className="text-xl md:text-2xl font-bold text-[#0d1b2a] mb-10"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            What's Included
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 'GL-HAZCOM-001',
                icon: FileText,
                title: 'Written HazCom Program',
                pages: '5 pages',
                desc: '29 CFR 1910.1200(e) compliant. Covers purpose, responsibilities, chemical inventory, SDS management, labeling, training, non-routine tasks, contractors, and annual review. Includes GHS pictogram reference, chemical storage compatibility chart, and emergency quick reference.',
              },
              {
                id: 'GL-HAZCOM-002',
                icon: ClipboardCheck,
                title: 'SDS Binder Checklist + Index',
                pages: '4 pages',
                desc: 'Quarterly verification checklist, A-Z alphabetical index template, and missing SDS log.',
              },
              {
                id: 'GL-HAZCOM-003',
                icon: Shield,
                title: 'Training Verification Log',
                pages: '2 pages',
                desc: 'Employee training record with 14 rows, training topics checklist, and trainer certification block.',
              },
            ].map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#0d1b2a]/10 rounded p-6"
                style={{ borderTop: '3px solid #1a6fc4' }}
                data-testid={`hazcom-card-${doc.id}`}
              >
                <doc.icon size={28} className="text-[#1a6fc4] mb-4" />
                <p
                  className="text-[10px] font-semibold tracking-widest text-[#0d1b2a]/40 uppercase mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {doc.id}
                </p>
                <h3 className="text-base font-bold text-[#0d1b2a] mb-1">{doc.title}</h3>
                <p className="text-xs text-[#1a6fc4] font-medium mb-3">{doc.pages}</p>
                <p className="text-sm text-[#0d1b2a]/60 leading-relaxed">{doc.desc}</p>
              </div>
            ))}
          </div>

          <p
            className="text-center text-[#0d1b2a]/70 mt-8 font-medium"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            data-testid="hazcom-total"
          >
            Total: 11 pages. Fill your company name. Print. Done.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#0d1b2a] text-white" data-testid="hazcom-cta-section">
        <div className="container max-w-2xl text-center">
          <p className="text-white/70 text-lg mb-8">
            Most owners have this running same afternoon.
          </p>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-[#1a6fc4] hover:bg-[#1560ae] text-[#0d1b2a] font-bold text-lg px-10 py-4 rounded transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            data-testid="hazcom-buy-button"
          >
            {isLoading ? 'Redirecting...' : 'Buy Now — $29'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
          <p className="text-white/50 text-sm mt-4">
            Instant download. No support calls. No customization.<br />
            Just the paperwork you need.
          </p>
        </div>
      </section>

      {/* Walkthrough Callout */}
      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-2xl">
          <div className="border border-[#1a6fc4]/20 bg-white rounded-lg p-6 md:p-8 text-center" data-testid="hazcom-walkthrough-callout">
            <p className="text-lg font-bold text-[#0d1b2a] mb-2">Not sure if these violations exist in your shop?</p>
            <p className="text-sm text-[#0d1b2a]/60 mb-5">A GigLine Safety Walkthrough will flag them with photos and a prioritized fix list — usually within 48 hours.</p>
            <Link to="/request-walkthrough" className="inline-flex items-center gap-2 bg-[#1a6fc4] hover:bg-[#1560ae] text-white font-bold px-6 py-3 rounded transition-colors">
              Request a Safety Walkthrough <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-10 border-t border-[#0d1b2a]/10">
        <div className="container max-w-2xl text-center">
          <p className="text-sm text-[#0d1b2a]/50">
            Built on OSHA's most cited violations in general industry.<br />
            Reviewed by a 25-year safety professional.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HazComPage;
