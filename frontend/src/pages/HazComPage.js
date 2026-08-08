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
      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <p
                className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                data-testid="hazcom-label"
              >
                DIGITAL DOWNLOAD · $29 STARTER PACK
              </p>
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                data-testid="hazcom-headline"
              >
                HazCom Starter Pack
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8">
                Small Shop Edition — <span className="text-[#C9A84C] font-bold">$29</span>
              </p>
              <div className="border-l-2 border-[#C9A84C] pl-6">
                <p className="text-lg text-white/90 font-medium mb-2">
                  #1 OSHA citation in general industry.
                </p>
                <p className="text-white/60">
                  Every shop has chemicals. Most don't have the paperwork.
                </p>
              </div>
            </div>
            <div className="relative" data-testid="hazcom-hero-image-wrap">
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(201,168,76,0.35)',
                  boxShadow: '0 20px 60px -20px rgba(0,0,0,0.55)',
                }}
              >
                <img
                  src="/hazcom-starter-pack-hero.png"
                  alt="GigLine HazCom Starter Pack shown on a stainless-steel workbench: a yellow Hazardous Chemicals SDS Binder next to three printed OSHA-compliant forms — Written HazCom Program, SDS Binder Checklist + Index, and Training Verification Log — with safety glasses and cut-resistant work gloves, in front of a warehouse wall marked with GHS hazard pictograms and a Safety Is Everyone's Job sign"
                  className="w-full h-auto block"
                  loading="eager"
                  fetchPriority="high"
                  width="1200"
                  height="900"
                  data-testid="hazcom-hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-14 md:py-20 border-b border-[#102A43]/10">
        <div className="container max-w-3xl">
          <h2
            className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-6"
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
              <li key={i} className="flex items-start gap-3 text-[#1C2B2B]/70 text-base">
                <span className="text-[#C9A84C] font-bold mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[#1C2B2B]/80 font-medium text-lg">
            One inspection finds all three. This pack fixes them.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-14 md:py-20 bg-[#F9F8F6]" data-testid="hazcom-whats-included">
        <div className="container max-w-4xl">
          <h2
            className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-10"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            What's Included
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                className="bg-white border border-[#102A43]/10 rounded p-6"
                style={{ borderTop: '3px solid #C9A84C' }}
                data-testid={`hazcom-card-${doc.id}`}
              >
                <doc.icon size={28} className="text-[#102A43] mb-4" />
                <p
                  className="text-[10px] font-semibold tracking-widest text-[#1C2B2B]/40 uppercase mb-2"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {doc.id}
                </p>
                <h3 className="text-base font-bold text-[#1C2B2B] mb-1">{doc.title}</h3>
                <p className="text-xs text-[#102A43] font-medium mb-3">{doc.pages}</p>
                <p className="text-sm text-[#1C2B2B]/60 leading-relaxed">{doc.desc}</p>
              </div>
            ))}
          </div>

          <p
            className="text-center text-[#1C2B2B]/70 mt-8 font-medium"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
            data-testid="hazcom-total"
          >
            Total: 11 pages. Fill your company name. Print. Done.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#102A43] text-white" data-testid="hazcom-cta-section">
        <div className="container max-w-2xl text-center">
          <p className="text-white/70 text-lg mb-8">
            Most owners have this running same afternoon.
          </p>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-[#C9A84C] hover:bg-[#B8972C] text-[#102A43] font-bold text-lg px-10 py-4 rounded transition-colors disabled:opacity-50 inline-flex items-center gap-2"
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

      {/* Upgrade to HazCom Pro Kit — lead-magnet → full control system CTA */}
      <section className="py-14 md:py-20 bg-[#102A43] text-white" data-testid="hazcom-upgrade-cta">
        <div className="container max-w-3xl text-center">
          <p
            className="text-xs font-semibold tracking-[0.28em] text-[#C9A84C] uppercase mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Ready for the Full Control System?
          </p>
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            The Starter Pack covers the basics.
            <br className="hidden md:block" />
            The HazCom Pro Kit is the full control system.
          </h2>
          <p
            className="text-[15.5px] md:text-[17px] leading-[1.7] max-w-2xl mx-auto mb-8"
            style={{ color: 'rgba(255,255,255,0.78)', fontFamily: "Georgia, serif" }}
          >
            SDS management, chemical inventory approval workflow, container label audit, training records tied to your actual chemicals, and audit-ready documentation &mdash; all built out.
            Includes the Chemical Control Index&trade; and SDS Gap Severity Grid&trade;.
          </p>
          <Link
            to="/citation-proof-kits/hazcom-pro-kit"
            className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded transition-opacity text-[14px]"
            style={{
              background: '#C9A84C',
              color: '#102A43',
              fontFamily: "'Manrope', sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            data-testid="hazcom-upgrade-cta-button"
          >
            Upgrade to HazCom Pro Kit
            <ArrowRight size={14} />
          </Link>
          <p className="mt-4 text-[12.5px] italic" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "Georgia, serif" }}>
            Starting at $150 &middot; Digital, Control System, or Binder Edition
          </p>
        </div>
      </section>

      {/* Walkthrough Callout */}
      <section className="py-12 bg-[#F9F8F6]">
        <div className="container max-w-2xl">
          <div className="border border-[#102A43]/20 bg-white rounded-lg p-6 md:p-8 text-center" data-testid="hazcom-walkthrough-callout">
            <p className="text-lg font-bold text-[#1C2B2B] mb-2">Not sure if these violations exist in your shop?</p>
            <p className="text-sm text-[#1C2B2B]/60 mb-5">A GigLine Safety Walkthrough will flag them with photos and a prioritized fix list — usually within 48 hours.</p>
            <Link to="/intake" className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">
              Request a Safety Walkthrough <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-10 border-t border-[#102A43]/10">
        <div className="container max-w-2xl text-center">
          <p className="text-sm text-[#1C2B2B]/50">
            Built on OSHA's most cited violations in general industry.<br />
            Reviewed by a 25-year safety professional.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HazComPage;
