import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Sun, ClipboardList, AlertTriangle, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const defined = {
  headline: "Mid-Year 2026 OSHA Update for NC Manufacturers",
  description: "Six things that changed — or moved on the enforcement radar — in the first half of 2026 for North Carolina manufacturing, packaging, and metals fabrication. Heat NEP renewed, PSM enforcement priorities, penalty tier adjustments, and what NC OSH is quietly flagging in inspections.",
  canonical: "/blog/mid-year-2026-osha-update-nc-manufacturers",
  datePublished: "2026-07-09",
  dateModified: "2026-07-09",
};

const articleSchema = {
  "@context": "https://schema.org", "@type": "Article",
  "headline": defined.headline, "description": defined.description,
  "author": { "@type": "Person", "name": "Vince Lawrence", "jobTitle": "Safety Consultant",
    "affiliation": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" } },
  "publisher": { "@type": "Organization", "name": "GigLine Safety & Compliance", "url": "https://giglinecompliance.com" },
  "datePublished": defined.datePublished, "dateModified": defined.dateModified,
  "mainEntityOfPage": { "@type": "WebPage", "@id": `https://giglinecompliance.com${defined.canonical}` }
};

const updates = [
  {
    icon: Sun, num: 1,
    title: "Heat Illness NEP renewed through summer 2026",
    body: "The Heat National Emphasis Program (CPL 03-00-024) is active for a third summer with the same trigger threshold — 80°F heat index. In NC's Piedmont, that's basically every day from mid-May through mid-September. If you don't have a written heat illness prevention plan, water/rest/shade schedule, and acclimatization protocol for new employees, you're one complaint away from a programmed inspection. The NEP explicitly directs Compliance Officers to open programmed inspections at random qualifying employers, not just complaint-driven ones."
  },
  {
    icon: TrendingUp, num: 2,
    title: "2026 penalty schedule — up 2.7% from 2025",
    body: "Adjusted per 29 CFR 1903.15 for inflation. Serious violations now cap at $16,550 (was $16,131). Willful and repeat violations cap at $165,514 (was $161,323). The math matters most on multi-instance citations — one machine-guarding case across 6 identical machines is 6 separate citations, not 1."
  },
  {
    icon: ClipboardList, num: 3,
    title: "300A posting compliance is being spot-checked",
    body: "NC OSH has been asking for the 300A during unrelated inspections through May and June — even at facilities that were originally opened for a different reason (electrical, machine guarding, complaint). The 300A must be posted February 1 through April 30. If yours came down May 1 like clockwork but wasn't in fact posted for the full window, you're still exposed on the retention side. Keep a dated photo of the posted 300A on file — it's the single easiest recordkeeping-defense document."
  },
  {
    icon: AlertTriangle, num: 4,
    title: "Amputation reporting is the fastest-moving citation",
    body: "Any amputation must be reported to OSHA within 24 hours per 29 CFR 1904.39(a)(2). NC OSH has cited multiple employers in 2026 for late reporting where the amputation happened Friday afternoon and the report went in Monday morning. 24 hours means 24 hours — including weekends. If it's minor (fingertip, no bone), still report. Better to over-report than miss the window."
  },
  {
    icon: MapPin, num: 5,
    title: "NC-specific: retail vs manufacturing NAICS reclassifications",
    body: "Several facilities we've reviewed this year had NAICS codes filed as retail or wholesale when the actual operations are light manufacturing (custom assembly, packaging, small-batch food production). NC OSH has been reclassifying at inspection and applying manufacturing recordkeeping requirements retroactively — including the 300 log if not previously maintained under the retail exemption. Worth pulling your OSHA-Cited NAICS from your SUI account and cross-checking against what you actually do."
  },
  {
    icon: TrendingUp, num: 6,
    title: "Silica and Combustible Dust — still on the emphasis list",
    body: "The Respirable Crystalline Silica NEP (CPL 03-00-023) and the Combustible Dust NEP (CPL 03-00-018) both remain active. If you're in metals fabrication, woodworking, plastics, or food processing, and you don't have written housekeeping and exposure-control programs, these are the two Compliance Officers cite most quickly during a walk-through."
  },
];

const BlogMidYear2026OshaUpdate = () => (
  <main data-testid="blog-mid-year-2026-update">
    <SEO title={defined.headline} description={defined.description} canonical={defined.canonical} schema={articleSchema} />

    <section className="bg-[#102A43] text-white py-16 md:py-24">
      <div className="container max-w-3xl">
        <p className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          MID-YEAR UPDATE · JULY 2026
        </p>
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          data-testid="blog-mid-year-headline"
        >
          {defined.headline}
        </h1>
        <p className="text-white/70 text-base leading-relaxed mb-6">
          Six months into 2026. Here&rsquo;s what I&rsquo;m seeing on the ground during walkthroughs across the Piedmont Triad, what NC OSH is actively enforcing, and what changed federally that hasn&rsquo;t made the trade-press yet. If you run a small manufacturing, packaging, or metals fabrication operation in North Carolina, these are the six things to know before Q3 inspections pick up.
        </p>
        <div className="flex items-center gap-4 text-sm text-white/50">
          <span>By Vince Lawrence</span>
          <span>·</span>
          <span>July 9, 2026</span>
          <span>·</span>
          <span>7 min read</span>
        </div>
      </div>
    </section>

    <article className="container max-w-3xl py-16">
      <div className="prose prose-lg max-w-none">
        {updates.map((u) => {
          const Icon = u.icon;
          return (
            <div
              key={u.num}
              className="mb-10 pb-10 border-b border-gray-200 last:border-b-0"
              data-testid={`blog-mid-year-item-${u.num}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-md flex items-center justify-center"
                  style={{ background: '#102A43', color: '#C9A84C' }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: '#C9A84C', fontFamily: "'JetBrains Mono', monospace" }}>
                    Update {u.num} of 6
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: '#102A43', fontFamily: "Georgia, serif" }}>
                    {u.title}
                  </h2>
                </div>
              </div>
              <p className="text-[16px] md:text-[17px] leading-[1.75] text-[#1C2B2B]/80" style={{ fontFamily: "Georgia, serif" }}>
                {u.body}
              </p>
            </div>
          );
        })}
      </div>

      {/* Related reading */}
      <div className="mt-16 p-8 rounded-lg" style={{ background: '#FBFBF9', border: '1px solid #e8e5dd' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#C9A84C' }}>Recommended Reading</p>
        <h3 className="text-xl font-bold mb-4" style={{ color: '#102A43' }}>Field Notes on the topics above</h3>
        <ul className="space-y-2 text-[15px]">
          <li><Link to="/field-notes/heat-stress" className="text-[#2A52A0] hover:underline font-bold">Heat Stress — the field-note walkthrough &rarr;</Link></li>
          <li><Link to="/field-notes/recordkeeping-300-log" className="text-[#2A52A0] hover:underline font-bold">OSHA 300 Log — mistakes I see most often &rarr;</Link></li>
          <li><Link to="/field-notes/silica-respirable-crystalline" className="text-[#2A52A0] hover:underline font-bold">Silica (Respirable Crystalline) — written program essentials &rarr;</Link></li>
          <li><Link to="/field-notes/nc-osha-vs-federal" className="text-[#2A52A0] hover:underline font-bold">NC OSH vs Federal OSHA — the differences that matter &rarr;</Link></li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 p-8 rounded-lg" style={{ background: '#102A43', color: 'white' }}>
        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Want a second set of eyes before Q3?
        </h3>
        <p className="text-white/75 mb-6 leading-relaxed">
          A Compliance Readiness Visit walks your floor, reviews your binder, and scores your documentation against the exact CFR sections OSHA is enforcing right now.
        </p>
        <Link
          to="/services/compliance-readiness-visit"
          className="inline-flex items-center gap-2 font-bold py-3 px-6 rounded"
          style={{ background: '#C9A84C', color: '#102A43' }}
          data-testid="blog-mid-year-cta-crv"
        >
          Schedule a Compliance Readiness Visit
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  </main>
);

export default BlogMidYear2026OshaUpdate;
