import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  Lock,
  Clock,
  Footprints,
  Camera,
  FileText,
  ChevronRight,
} from 'lucide-react';
import SEO from '../components/SEO';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SLUG = 'safety-walkthrough';
const INTAKE_HREF = `/intake?service=${SLUG}`;
const CRV_HREF = '/services/compliance-readiness-visit';

const BLUE = '#2A52A0';
const NAVY = '#1C2B2B';
const GOLD = '#C9A84C';
const CREAM = '#f5f4f0';

const DELIVERABLES = [
  { icon: Footprints, title: 'On-Site Floor Walkthrough', body: 'I walk every accessible area of your operation — production floor, storage, loading dock, maintenance areas. Every hazard documented on the spot.' },
  { icon: Camera, title: 'Photo-Documented Findings', body: 'Every finding photographed, CFR-cited, and rated by severity. Priority 1 findings are called out verbally before I leave the facility.' },
  { icon: FileText, title: 'Top 10 Priority Findings — 48 Hours', body: 'The 10 highest-exposure findings from the walkthrough, each with RED / AMBER / GREEN severity, CFR citation, and recommended corrective action. Ordered by what to fix first.' },
];

const VIOLATIONS = [
  { title: 'Blocked or obstructed egress routes', cfr: '29 CFR 1910.37' },
  { title: 'Electrical panel clearance violations', cfr: '29 CFR 1910.303' },
  { title: 'Machine guarding gaps — exposed nip points, shear points', cfr: '29 CFR 1910.212' },
  { title: 'Fire extinguisher access and inspection gaps', cfr: '29 CFR 1910.157' },
  { title: 'Unsecured compressed gas cylinders', cfr: '29 CFR 1910.101' },
  { title: 'Forklift pedestrian separation failures', cfr: '29 CFR 1910.178' },
  { title: 'Improper chemical storage and labeling', cfr: '29 CFR 1910.1200' },
  { title: 'Missing or inadequate PPE for observed tasks', cfr: '29 CFR 1910.132' },
];

const WHEN_CARDS = [
  { title: "You've had a near-miss or incident", body: 'Before you file anything or talk to anyone, know what else is on the floor.' },
  { title: 'A new manager is taking over safety', body: 'Get a baseline picture of where the operation stands before you inherit the liability.' },
  { title: "You're preparing for a customer audit", body: 'Many customer safety audits look for the same physical hazards OSHA does. Get ahead of both.' },
  { title: 'You want a second set of eyes', body: "You've been walking this floor for years. Fresh eyes find what familiarity hides." },
];

const Eyebrow = ({ children, color = BLUE, className = '' }) => (
  <p className={`uppercase font-bold mb-3 ${className}`} style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}>
    {children}
  </p>
);

const SafetyWalkthroughPage = () => {
  return (
    <main data-testid="safety-walkthrough-page">
      <SEO
        title="Safety Walkthrough — From $1,200 | GigLine"
        description="On-site safety walkthrough focused purely on physical hazards. Photo-documented findings with CFR citations and prioritized Top 10 fix list delivered within 48 hours. From $1,200."
        canonical={`/services/${SLUG}`}
        schema={[
          { '@context': 'https://schema.org', '@type': 'Service', name: 'Safety Walkthrough', provider: { '@type': 'LocalBusiness', name: 'GigLine Safety & Compliance', url: 'https://www.giglinecompliance.com', telephone: '+13363298899' }, areaServed: { '@type': 'State', name: 'North Carolina' }, offers: { '@type': 'Offer', price: '1200', priceCurrency: 'USD', description: 'Safety Walkthrough from $1,200 — on-site physical hazard inspection.' }, description: 'On-site walkthrough focused on physical hazards with photo-documented CFR-cited findings delivered as a Top 10 priority report within 48 hours.' },
          { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' }, { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.giglinecompliance.com/services' }, { '@type': 'ListItem', position: 3, name: 'Safety Walkthrough', item: `https://www.giglinecompliance.com/services/${SLUG}` } ] },
        ]}
      />

      {/* Hero + 2-col Fixed Price block */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20" style={{ background: NAVY }} data-testid="sw-hero">
        <div className="container max-w-6xl">
          <Eyebrow color={GOLD}>Safety Walkthrough</Eyebrow>
          <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-5xl">
            <span className="block">Find what&apos;s exposed.</span>
            <span className="block" style={{ color: GOLD }}>Before OSHA does.</span>
          </h1>
          <p className="text-base md:text-lg text-white/75 leading-[1.8] mb-9 max-w-3xl">
            An on-site walkthrough focused purely on physical hazards. Photo-documented findings with CFR citations and a prioritized fix list — delivered within 48 hours. The fastest way to know where your operation stands.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mb-12">
            <Link to={INTAKE_HREF} className="inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors text-white" style={{ background: BLUE }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1F3F80')} onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)} data-testid="sw-cta-hero">
              Request a Safety Walkthrough <ArrowRight size={17} />
            </Link>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}><Clock size={14} />Report in 48 hours</span>
            <span className="inline-flex items-center gap-2 text-white/55 text-sm" style={mono}><Lock size={14} />Private engagement</span>
          </div>
          <div className="rounded-xl p-7 md:p-8 grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr] gap-7 md:gap-10 items-start" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }} data-testid="sw-price-block">
            <div>
              <Eyebrow color={GOLD}>Fixed Price</Eyebrow>
              <p className="text-3xl md:text-[34px] font-extrabold text-white leading-none mb-3 tracking-tight" style={mono}>From $1,200</p>
              <p className="text-[13px] text-white/55 leading-[1.6]">Varies by facility size and employee count.</p>
            </div>
            <div>
              <p className="text-[14.5px] text-white/80 leading-[1.75]">
                Need the floor and the files reviewed together? The <Link to={CRV_HREF} className="font-bold underline" style={{ color: GOLD }} data-testid="sw-crv-link">Compliance Readiness Visit</Link> covers both in a single visit from <span className="font-bold text-white" style={mono}>$2,000</span> — saving up to <span className="font-bold text-white" style={mono}>$500</span> vs. booking separately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-24 bg-white" data-testid="sw-included">
        <div className="container max-w-6xl">
          <Eyebrow>What&apos;s Included</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight max-w-3xl" style={{ color: NAVY }}>Three deliverables. One visit.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DELIVERABLES.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="rounded-xl p-7" style={{ background: CREAM, border: '1px solid #e8e5dd' }} data-testid={`sw-deliverable-${i + 1}`}>
                  <div className="flex items-center justify-center mb-5" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(42,82,160,0.10)', color: BLUE }}>
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h3 className="text-[17px] font-bold mb-2.5 leading-snug" style={{ color: NAVY }}>{d.title}</h3>
                  <p className="text-[14px] text-[#1C2B2B]/70 leading-[1.7]">{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Find — 8 numbered CFR-cited violations */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="sw-violations">
        <div className="container max-w-4xl">
          <Eyebrow>What We Find</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight" style={{ color: NAVY }}>The eight most common physical violations.</h2>
          <p className="text-base text-[#1C2B2B]/70 leading-[1.75] mb-10 max-w-3xl">
            These are the findings that appear most frequently across manufacturing and warehouse operations in the Piedmont Triad. Most operations have at least three. Some have all eight.
          </p>
          <ol className="space-y-1">
            {VIOLATIONS.map((v, i) => (
              <li key={i} className="grid grid-cols-[44px_1fr_auto] gap-3 md:gap-5 py-4 items-baseline" style={{ borderBottom: i === VIOLATIONS.length - 1 ? 'none' : '1px solid #e0dfd9' }} data-testid={`sw-violation-${i + 1}`}>
                <span className="font-extrabold" style={{ ...mono, fontSize: '18px', color: BLUE }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[15.5px] md:text-base font-semibold leading-snug" style={{ color: NAVY }}>{v.title}</span>
                <span className="text-right uppercase font-bold whitespace-nowrap" style={{ ...mono, fontSize: '11px', letterSpacing: '0.10em', color: '#5a6878' }}>{v.cfr}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* When to Book This — 4-card grid on dark navy */}
      <section className="py-20 md:py-24" style={{ background: NAVY }} data-testid="sw-when">
        <div className="container max-w-6xl">
          <p className="uppercase font-bold mb-3 text-center" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}>When to Book This</p>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-12 tracking-tight text-white text-center max-w-3xl mx-auto">Start here when you need a fast read.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHEN_CARDS.map((card, i) => (
              <div key={i} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} data-testid={`sw-when-card-${i + 1}`}>
                <div className="flex items-center justify-center mb-5" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', color: GOLD }}>
                  <ChevronRight size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-[15.5px] font-bold mb-3 leading-snug text-white">{card.title}</h3>
                <p className="text-[13.5px] text-white/65 leading-[1.7]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="sw-closing">
        <div className="container max-w-3xl text-center">
          <Eyebrow>Ready to Start?</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 tracking-tight" style={{ color: NAVY }}>Request a Safety Walkthrough.</h2>
          <p className="text-base md:text-lg text-[#1C2B2B]/75 leading-[1.85] mb-10 max-w-3xl mx-auto">
            Fixed price. Private engagement. Report in 48 hours. Or upgrade to the Compliance Readiness Visit and get the documentation review included in the same visit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={INTAKE_HREF} className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-lg text-base transition-colors" style={{ background: NAVY }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1c2e44')} onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)} data-testid="sw-bottom-cta-walkthrough">
              Request a Safety Walkthrough <ArrowRight size={18} />
            </Link>
            <Link to={CRV_HREF} className="inline-flex items-center gap-2 bg-white font-bold px-7 py-4 rounded-lg text-base transition-colors" style={{ color: NAVY, border: `1.5px solid ${NAVY}` }} onMouseEnter={(e) => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#ffffff'; }} onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = NAVY; }} data-testid="sw-bottom-cta-crv">
              Upgrade to a Compliance Readiness Visit
            </Link>
          </div>
          <a href="tel:3363298899" className="inline-flex items-center gap-2 text-[#1C2B2B]/60 hover:text-[#1C2B2B] text-sm mt-8 transition-colors" data-testid="sw-cta-phone">
            <Phone size={14} />Questions? Call or text Vince directly — (336) 329-8899
          </a>
        </div>
      </section>
    </main>
  );
};

export default SafetyWalkthroughPage;
