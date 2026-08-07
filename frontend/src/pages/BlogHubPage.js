import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Calendar, Clock } from 'lucide-react';
import SEO from '../components/SEO';

/*
  /blog — Pillar-Content Hub
  ---------------------------
  Central index of all long-form OSHA compliance guides. Sorted newest-first
  so the freshest content leads. Each post carries: badge (topic area),
  read time, published date, keyword-focused title, and one-line summary.
  The featured (top-most) post gets a full-width hero card; the rest render
  in a two-column grid.
*/

const defined = {
  title: "OSHA Compliance Guides & Field Reports | GigLine Blog",
  description: "Long-form OSHA compliance guides for small manufacturers, warehouses, and contractors — machine guarding, LOTO, forklift, HazCom, recordkeeping. Written by an OSHA-30 consultant walking Piedmont Triad shops weekly.",
  canonical: "/blog",
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": defined.title,
  "description": defined.description,
  "url": `https://giglinecompliance.com${defined.canonical}`,
  "isPartOf": { "@type": "WebSite", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" },
  "publisher": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" },
  "inLanguage": "en-US"
};

// Newest-first. Featured is first item.
const posts = [
  { slug: "osha-penalty-north-carolina-2026", title: "How Much Is an OSHA Violation in North Carolina in 2026?", excerpt: "The 2026 OSHA penalty schedule for NC small manufacturers — Serious, Willful, Repeat, Failure-to-Abate — plus per-instance multipliers and gravity adjustments OSHA actually applies. Free citation cost calculator.", topic: "OSHA ENFORCEMENT", published: "Aug 2026", readTime: "8 min", featured: true },
  { slug: "mid-year-2026-osha-update-nc-manufacturers", title: "Mid-Year 2026 OSHA Update for NC Manufacturers", excerpt: "Six things that changed — or moved on the enforcement radar — in the first half of 2026 for NC manufacturing, packaging, and metals fabrication.", topic: "NC ENFORCEMENT", published: "Jul 2026", readTime: "7 min" },
  { slug: "osha-300-log-common-mistakes-citations", title: "OSHA 300 Log: Common Mistakes That Trigger Citations", excerpt: "The recordkeeping mistakes OSHA cites most on the 300 log — misclassification, missing 300A postings, incomplete 301 forms. With 2026 penalty exposure.", topic: "RECORDKEEPING", published: "Dec 2025", readTime: "11 min" },
  { slug: "written-hazcom-program-before-osha-inspection", title: "Written HazCom Program: What You Need Before an OSHA Inspection", excerpt: "The written Hazard Communication program checklist OSHA works through — chemical inventory, SDS binder, GHS labels, training records.", topic: "HAZCOM", published: "Nov 2025", readTime: "11 min" },
  { slug: "osha-forklift-compliance-inspector-checklist", title: "OSHA Forklift Compliance: What Inspectors Actually Check", excerpt: "The forklift items OSHA inspectors ask for first — operator certifications, daily inspection logs, traffic controls — with CFR sections and 2026 penalty exposures.", topic: "FORKLIFT", published: "Nov 2025", readTime: "10 min" },
  { slug: "loto-program-requirements-small-facilities", title: "LOTO Program Requirements for Small Facilities", excerpt: "OSHA 1910.147 Control of Hazardous Energy — written program elements, machine-specific procedures, training, and the citations that catch small facilities.", topic: "LOTO", published: "Oct 2025", readTime: "12 min" },
  { slug: "osha-machine-guarding-checklist-small-manufacturers", title: "OSHA Machine Guarding Checklist for Small Manufacturers", excerpt: "Machine guarding requirements OSHA cites most often in small manufacturing — with a practical checklist, CFR citations, and 2026 penalty exposures.", topic: "MACHINE GUARDING", published: "Oct 2025", readTime: "11 min" },
  { slug: "hazcom-requirements-small-business", title: "HazCom Requirements Every Small Business Needs to Know", excerpt: "Complete guide to OSHA Hazard Communication requirements for small businesses. Written programs, SDS, labeling, training, penalties under 29 CFR 1910.1200.", topic: "HAZCOM", published: "Apr 2026", readTime: "10 min" },
  { slug: "top-5-osha-violations-small-manufacturing", title: "Top 5 OSHA Violations in Small Manufacturing", excerpt: "The five citations that dominate OSHA enforcement in small manufacturing — with what each one costs, how it's found, and how to close it in a weekend.", topic: "TOP CITATIONS", published: "Mar 2026", readTime: "9 min" },
];

const featured = posts[0];
const rest = posts.slice(1);

const BlogHubPage = () => {
  return (
    <main data-testid="blog-hub-page">
      <SEO title={defined.title} description={defined.description} canonical={defined.canonical} schema={collectionSchema} />

      {/* Hero */}
      <section className="bg-[#102A43] text-white py-16 md:py-24">
        <div className="container max-w-5xl">
          <p className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>THE GIGLINE BLOG</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }} data-testid="blog-hub-headline">Long-form OSHA compliance guides — from a consultant who walks the floor.</h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">Every guide below is written by Vince Lawrence — OSHA 30-Hour certified — after seeing the same citations trip up the same small operations every month. CFR-cited, 2026 penalty amounts current, and specific enough to hand to your plant manager on Monday.</p>
        </div>
      </section>

      {/* Featured post */}
      <section className="py-14 md:py-20 border-b border-[#2A52A0]/10" data-testid="blog-hub-featured">
        <div className="container max-w-5xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>LATEST GUIDE</p>
          <Link to={`/blog/${featured.slug}`} className="group block" data-testid={`blog-featured-${featured.slug}`}>
            <article className="bg-white border border-[#2A52A0]/15 rounded-lg overflow-hidden hover:border-[#2A52A0]/40 transition-colors">
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-2 bg-[#102A43] text-white p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{featured.topic}</p>
                    <FileText size={40} className="text-white/20 mb-6" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1.5"><Calendar size={13} />{featured.published}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} />{featured.readTime}</span>
                  </div>
                </div>
                <div className="md:col-span-3 p-8 md:p-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4 group-hover:text-[#1F3F80] transition-colors" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{featured.title}</h2>
                  <p className="text-[#1C2B2B]/70 leading-relaxed mb-6">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#2A52A0] group-hover:gap-3 transition-all">Read the guide <ArrowRight size={16} /></span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* Rest of the posts */}
      <section className="py-14 md:py-20 bg-[#F9F8F6]">
        <div className="container max-w-5xl">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ALL GUIDES</p>
          <div className="grid md:grid-cols-2 gap-6" data-testid="blog-hub-grid">
            {rest.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group block" data-testid={`blog-card-${p.slug}`}>
                <article className="bg-white border border-[#2A52A0]/10 rounded-lg p-6 md:p-7 h-full flex flex-col hover:border-[#2A52A0]/40 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-semibold tracking-widest text-[#2A52A0] uppercase px-2.5 py-1 bg-[#2A52A0]/8 rounded" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.topic}</span>
                    <span className="text-xs text-[#1C2B2B]/40 flex items-center gap-1.5"><Calendar size={12} />{p.published}</span>
                    <span className="text-xs text-[#1C2B2B]/40 flex items-center gap-1.5"><Clock size={12} />{p.readTime}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-[#1C2B2B] mb-3 leading-snug group-hover:text-[#1F3F80] transition-colors" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{p.title}</h3>
                  <p className="text-sm text-[#1C2B2B]/70 leading-relaxed mb-5 flex-grow">{p.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#2A52A0] group-hover:gap-3 transition-all mt-auto">Read the guide <ArrowRight size={16} /></span>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Field Notes bridge */}
      <section className="py-14 md:py-20 border-b border-[#2A52A0]/10">
        <div className="container max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-widest text-[#2A52A0] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>ALSO WORTH READING</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2B2B] mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Field Notes — 25 short posts from the floor</h2>
          <p className="text-[#1C2B2B]/70 leading-relaxed mb-6">Quick, 3–5-minute reads on specific hazards Vince has documented during real walkthroughs — forklift daily inspection, HazCom binder gaps, machine guarding traps, heat stress, and more.</p>
          <Link to="/field-notes" className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors">Browse the 25 Field Notes <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-[#102A43] text-white">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Ready to see how your operation compares?</h2>
          <p className="text-white/70 leading-relaxed mb-8">A GigLine Safety Walkthrough puts everything in these guides against your actual floor. Fixed quote from $1,300. Written report in 48 hours. Private engagement.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/intake" className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8972C] text-[#102A43] font-bold px-8 py-4 rounded transition-colors">Request a Walkthrough <ArrowRight size={16} /></Link>
            <Link to="/safety-check" className="inline-flex items-center gap-2 border border-white/30 hover:border-[#C9A84C] text-white font-bold px-8 py-4 rounded transition-colors">Run the Free Safety Check <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogHubPage;
