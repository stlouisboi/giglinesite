import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Download, Check } from 'lucide-react';
import { trackPDFDownload } from '../utils/analytics';
import SEO from '../components/SEO';
import { SUPERVISOR_KIT_ENABLED } from '../config/features';
import FieldNotesNewsletter from '../components/FieldNotesNewsletter';
/* GL-WEB-026 — Field Note content is a shared database, imported once here
   and re-used by /app/frontend/scripts/generate-seo-pages.js for SSR. */
import { NOTES } from '../data/fieldNoteContent';

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * Map each Field Note slug to the 1–2 most relevant service pages.
 * Drives the "Service that handles this on the floor" callout near the bottom of each article.
 * Adding a new article? Add an entry here so the cross-link block renders.
 */
const SERVICE_LINKS_BY_SLUG = {
  'heat-stress': [
    { title: 'Safety Walkthrough', body: 'On-site review of heat-exposure tasks, controls, and your HIIPP in action.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Written HIIPP, daily heat check, and training records that match your operation.', to: '/services/document-development' },
  ],
  'forklift-safety': [
    { title: 'Safety Walkthrough', body: 'On-floor review of forklift traffic, pedestrian separation, and pre-shift inspection practice.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Operator certifications, evaluation records, and pre-shift checklists that satisfy 1910.178(l).', to: '/services/document-development' },
  ],
  'electrical-safety': [
    { title: 'Safety Walkthrough', body: 'Panel access, GFCI coverage, cord management, and Subpart S compliance checked on the floor.', to: '/services/safety-walkthrough' },
    { title: 'Incident Review', body: 'For shock events, near-miss arc flash, or any electrical incident: documented root cause and corrective action.', to: '/services/incident-review' },
  ],
  'hazcom': [
    { title: 'Document Development', body: 'Written HazCom program, container labels, SDS index, and training records for the most-cited OSHA standard.', to: '/services/document-development' },
    { title: 'Compliance Readiness Visit', body: 'Floor + files in a single visit — confirms your HazCom system actually matches the chemicals on site.', to: '/services/compliance-readiness-visit' },
  ],
  'machine-guarding': [
    { title: 'Safety Walkthrough', body: 'Every guarded point of operation checked against 1910.212 and the equipment-specific standards.', to: '/services/safety-walkthrough' },
  ],
  'walking-surfaces': [
    { title: 'Safety Walkthrough', body: 'Floor condition, housekeeping, slip/trip hazards, and Subpart D compliance documented with photos.', to: '/services/safety-walkthrough' },
  ],
  'lockout-tagout': [
    { title: 'Document Development', body: 'Written LOTO program, machine-specific procedures, periodic inspection records, and training documentation.', to: '/services/document-development' },
    { title: 'Safety Walkthrough', body: 'On-the-floor verification that LOTO devices are present, accessible, and being used.', to: '/services/safety-walkthrough' },
  ],
  'emergency-action-plans': [
    { title: 'Document Development', body: 'Written EAP, evacuation diagrams, alarm-system documentation, and drill records to satisfy 1910.38.', to: '/services/document-development' },
  ],
  'ppe-assessment': [
    { title: 'Document Development', body: 'Written PPE hazard assessment certification — the first citation under 1910.132 when missing.', to: '/services/document-development' },
  ],
  'fall-protection': [
    { title: 'Safety Walkthrough', body: 'Every 4-foot+ exposure, anchor point, and elevated walking surface checked against Subpart D.', to: '/services/safety-walkthrough' },
  ],
  'confined-space': [
    { title: 'Document Development', body: 'Written permit-required program, entry permits, and rescue plan that satisfies 1910.146.', to: '/services/document-development' },
    { title: 'Safety Walkthrough', body: 'Every confined space on site identified, classified, and signed per the standard.', to: '/services/safety-walkthrough' },
  ],
  'scaffolding-safety': [
    { title: 'Safety Walkthrough', body: 'Erection, inspection, and use practices reviewed against 1926.451 — competent person verification on site.', to: '/services/safety-walkthrough' },
  ],
  'hearing-conservation': [
    { title: 'Document Development', body: 'Written hearing conservation program, audiogram records, and noise exposure assessments per 1910.95.', to: '/services/document-development' },
  ],
  'bloodborne-pathogens': [
    { title: 'Document Development', body: 'Written exposure control plan, hepatitis B vaccination records, and training documentation per 1910.1030.', to: '/services/document-development' },
  ],
  'ai-generated-safety-programs': [
    { title: 'Document Development', body: 'Written programs built around your equipment and chemicals — not AI templates that name a different operation.', to: '/services/document-development' },
  ],
  'recordkeeping-300-log': [
    { title: 'Compliance Readiness Visit', body: '300 Log, 300A summary, and severe-injury reporting practice all reviewed in a single visit.', to: '/services/compliance-readiness-visit' },
    { title: 'Document Development', body: 'Recordable-injury decision tree and 300/300A maintenance procedure built for your operation.', to: '/services/document-development' },
  ],
  'respiratory-protection': [
    { title: 'Document Development', body: 'Written respiratory protection program, medical evaluation, fit testing, and training records per 1910.134.', to: '/services/document-development' },
  ],
  'silica-respirable-crystalline': [
    { title: 'Compliance Readiness Visit', body: 'Exposure assessment, written exposure control plan, and medical surveillance review for stone/concrete operations.', to: '/services/compliance-readiness-visit' },
    { title: 'Document Development', body: 'Written silica exposure control plan tailored to the tasks and materials on your floor.', to: '/services/document-development' },
  ],
  'hot-work-welding': [
    { title: 'Safety Walkthrough', body: 'Hot-work area designation, fire watch practice, cylinder storage, and Subpart Q compliance checked on site.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Written hot work permit program (NFPA 51B-based) that insurance carriers and customers accept.', to: '/services/document-development' },
  ],
  'abrasive-wheels': [
    { title: 'Safety Walkthrough', body: 'Every grinder in the shop checked against the 1/8" work rest and 1/4" tongue-guard standards under 1910.215.', to: '/services/safety-walkthrough' },
  ],
  'ladder-safety': [
    { title: 'Safety Walkthrough', body: 'Every portable ladder on site inspected against 1910.23 — damaged ladders tagged out before OSHA does it for you.', to: '/services/safety-walkthrough' },
  ],
  'eye-face-protection': [
    { title: 'Document Development', body: 'Written PPE hazard assessment certification per 1910.132 — the first citation when missing.', to: '/services/document-development' },
  ],
  'trenching-excavation': [
    { title: 'Safety Walkthrough', body: 'Protective systems, competent-person inspection, soil classification, and egress reviewed against Subpart P.', to: '/services/safety-walkthrough' },
  ],
  'cranes-rigging': [
    { title: 'Safety Walkthrough', body: 'Daily/annual inspection practice, sling condition, capacity marking, and operator authorization checked on site.', to: '/services/safety-walkthrough' },
    { title: 'Document Development', body: 'Annual inspection logs, operator training records, and rigging gear inspection procedures.', to: '/services/document-development' },
  ],
  'nc-osha-vs-federal': [
    { title: 'Compliance Readiness Visit', body: 'Practitioner walkthrough framed against NC State Plan enforcement reality — not federal-OSHA-only theory.', to: '/services/compliance-readiness-visit' },
  ],
};


/* ── Field Note content database (shared with generate-seo-pages.js — GL-WEB-026) ── */
const FieldNoteDetailPage = () => {
  const { slug } = useParams();
  // Alias map — additional slugs that resolve to existing notes (kept narrow on purpose).
  const SLUG_ALIASES = {
    'confined-space-entry-permits': 'confined-space',
  };
  const resolvedSlug = SLUG_ALIASES[slug] || slug;
  const note = NOTES[resolvedSlug];
  const [dlEmail, setDlEmail] = useState('');
  const [dlStatus, setDlStatus] = useState('idle'); // idle | sending | sent | error

  if (!note) return <Navigate to="/field-notes" replace />;

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!dlEmail.trim()) return;
    setDlStatus('sending');
    try {
      const res = await fetch(`${API}${note.download.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: dlEmail.trim() }),
      });
      if (res.ok) {
        trackPDFDownload(note.download.title);
        setDlStatus('sent');
      } else {
        setDlStatus('error');
      }
    } catch {
      setDlStatus('error');
    }
  };

  return (
    <main>
      <SEO
        title={note.seoTitle || `${note.title} — Field Notes | GigLine Safety & Compliance`}
        description={note.seo}
        canonical={`/field-notes/${resolvedSlug}`}
        ogType="article"
        ogImage={note.heroImage}
      />

      {/* JSON-LD Article + FAQPage schemas live in the pre-rendered static
          HTML via /scripts/generate-seo-pages.js. We do NOT inject them at
          runtime to avoid Google "Duplicate field" warnings. */}

      {/* Header */}
      <section className="bg-[#102A43] py-16 md:py-24" data-testid="note-header">
        <div className="container max-w-3xl">
          <Link to="/field-notes" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#2A52A0] transition-colors mb-6" data-testid="back-to-notes">
            <ArrowLeft size={14} /> Field Notes
          </Link>
          <p
            className="uppercase tracking-[3px] text-[#2A52A0] mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
          >
            Field Note
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3" data-testid="note-title">
            {note.title}
          </h1>
          <p className="text-lg text-white/50">{note.subtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-white" data-testid="note-content">
        <div className="container max-w-3xl">
          {/* Hero promo image (when present) */}
          {note.heroImage && (
            <div className="mb-10 md:mb-12 -mt-2" data-testid="note-hero-image">
              <img src={note.heroImage}
                alt={note.heroImageAlt || note.title}
                className="w-full h-auto rounded-xl shadow-lg"
                style={{ boxShadow: '0 18px 36px -16px rgba(11,31,51,0.35), 0 0 0 1px rgba(11,31,51,0.06)' }}
                loading="eager" />
            </div>
          )}

          {/* What It Is — supports multi-paragraph via blank line splits */}
          <div className="mb-12" data-testid="note-what-it-is">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What It Is</h2>
            <div className="text-base text-[#1C2B2B]/70 leading-relaxed space-y-4 whitespace-pre-line">
              {note.sections.whatItIs.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* What OSHA Checks (if available) */}
          {note.oshaChecks && (
            <div className="mb-12" data-testid="note-osha-checks">
              <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What OSHA Checks</h2>
              <div className="space-y-3">
                {note.oshaChecks.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[#1F3F80] mt-1 flex-shrink-0">
                      <Check size={16} />
                    </span>
                    <p className="text-base text-[#1C2B2B]/70">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Gets Missed */}
          <div className="mb-12" data-testid="note-what-gets-missed">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What Most Operations Get Wrong</h2>
            <div className="space-y-3">
              {note.sections.whatGetsMissed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[#2A52A0] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>//</span>
                  <p className="text-base text-[#1C2B2B]/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What I See */}
          <div className="mb-12 bg-[#F9F8F6] border-l-2 border-[#2A52A0] p-6 rounded-r" data-testid="note-what-i-see">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">What GigLine Looks For</h2>
            <p className="text-base text-[#1C2B2B]/70 leading-relaxed italic">{note.sections.whatISee}</p>
          </div>

          {/* Checklist */}
          <div className="mb-12" data-testid="note-checklist">
            <h2 className="text-xl font-bold text-[#1C2B2B] mb-4">Quick Checklist</h2>
            <div className="space-y-3">
              {note.sections.checklist.map((item, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-[#2A52A0]/20 text-[#2A52A0] focus:ring-[#2A52A0] accent-[#2A52A0]" />
                  <span className="text-base text-[#1C2B2B]/70 group-hover:text-[#1C2B2B] transition-colors">{item}</span>
                </label>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#1C2B2B]/40">
              Print this page or use the browser print function (Ctrl+P / Cmd+P) to save a copy.
            </p>
          </div>

          {/* CFR Citation */}
          {note.cfrCitation && (
            <div className="mb-12 py-4 border-t border-[#2A52A0]/10" data-testid="note-cfr-citation">
              <p className="text-xs text-[#1C2B2B]/40 uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Regulation Reference
              </p>
              <p className="text-sm text-[#1C2B2B]/60 font-medium mt-1">{note.cfrCitation}</p>
            </div>
          )}

          {/* Newsletter capture — soft list-builder per article */}
          <FieldNotesNewsletter source={`field-note-${slug}`} />

          {/* Service that handles this on the floor (GL-WEB-018) */}
          {SERVICE_LINKS_BY_SLUG[slug] && (
            <div className="mb-10" data-testid="note-related-services">
              <p
                className="text-xs uppercase tracking-wider mb-3"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2A52A0' }}
              >
                Where this gets handled
              </p>
              <h3
                className="text-lg md:text-xl font-bold text-[#1C2B2B] mb-5 leading-snug"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Want this audited on your floor?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICE_LINKS_BY_SLUG[slug].map((svc) => (
                  <Link
                    key={svc.to}
                    to={svc.to}
                    className="block p-5 rounded-lg transition-colors group"
                    style={{ background: '#F9F8F6', border: '1px solid rgba(28,43,43,0.10)' }}
                    data-testid={`note-service-link-${svc.to.split('/').pop()}`}
                  >
                    <p className="font-bold text-[15px] text-[#1C2B2B] mb-1 group-hover:text-[#1F3F80] transition-colors flex items-center gap-1.5">
                      {svc.title}
                      <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-[13.5px] text-[#1C2B2B]/65 leading-[1.55]">{svc.body}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Field Notes */}
          {note.relatedNotes && (
            <div className="mb-8" data-testid="note-related">
              <p className="text-xs text-[#1C2B2B]/40 uppercase tracking-wider mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Related Field Notes
              </p>
              <div className="flex flex-wrap gap-3">
                {note.relatedNotes.map(rSlug => {
                  const related = NOTES[rSlug];
                  if (!related) return null;
                  return (
                    <Link
                      key={rSlug}
                      to={`/field-notes/${rSlug}`}
                      className="text-sm text-[#1C2B2B]/60 hover:text-[#1F3F80] transition-colors flex items-center gap-1"
                      data-testid={`related-note-${rSlug}`}
                    >
                      <ArrowRight size={12} />
                      {related.title}
                    </Link>
                  );
                })}
                <Link
                  to="/services"
                  className="text-sm text-[#2A52A0] hover:text-[#1F3F80] transition-colors flex items-center gap-1"
                  data-testid="related-services-link"
                >
                  <ArrowRight size={12} />
                  Safety Walkthrough Services
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Download Resource (if available) */}
      {note.download && (
        <section className="py-12 md:py-20" style={{ backgroundColor: '#F9F8F6' }} data-testid="note-download">
          <div className="container max-w-3xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {/* Mockup image */}
              <div className="w-full md:w-2/5 flex-shrink-0">
                <img loading="lazy" src={note.download.image}
                  alt={note.download.title}
                  className="w-full max-w-[260px] mx-auto md:mx-0 rounded shadow-lg"
                  data-testid="download-mockup" />
              </div>

              {/* Download form */}
              <div className="flex-grow">
                <p
                  className="uppercase tracking-[3px] text-[#2A52A0] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
                >
                  Free Download
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-[#1C2B2B] mb-2" data-testid="download-title">
                  {note.download.title}
                </h3>
                <p className="text-sm text-[#1C2B2B]/55 mb-6">{note.download.description}</p>

                {dlStatus === 'sent' ? (
                  <div className="flex items-center gap-3 text-[#1C2B2B]/70" data-testid="download-success">
                    <Check size={20} className="text-[#2A52A0]" />
                    <p className="text-sm font-medium">Sent to your inbox. Check your email.</p>
                  </div>
                ) : (
                  <form onSubmit={handleDownload} className="flex flex-col sm:flex-row gap-3" data-testid="download-form">
                    <input
                      type="email"
                      required
                      value={dlEmail}
                      onChange={(e) => setDlEmail(e.target.value)}
                      placeholder="Your work email"
                      className="flex-grow px-4 py-3 rounded border border-[#2A52A0]/15 bg-white text-sm text-[#1C2B2B] placeholder:text-[#1C2B2B]/30 focus:outline-none focus:border-[#2A52A0] focus:ring-1 focus:ring-[#2A52A0]/30"
                      data-testid="download-email-input"
                    />
                    <button
                      type="submit"
                      disabled={dlStatus === 'sending'}
                      className="bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-6 py-3 rounded transition-colors inline-flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                      data-testid="download-submit-btn"
                    >
                      <Download size={16} />
                      {dlStatus === 'sending' ? 'Sending...' : 'Send Me the PDF'}
                    </button>
                  </form>
                )}
                {dlStatus === 'error' && (
                  <p className="text-sm text-red-500 mt-2">Something went wrong. Try again.</p>
                )}
                <p className="text-xs text-[#1C2B2B]/30 mt-3">No spam. Just the PDF.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Documents CTA — for articles that specify a kitCrossSell card set (gated by kit feature flag) */}
      {SUPERVISOR_KIT_ENABLED && note.kitCrossSell && Array.isArray(note.kitCrossSell.cards) && (
        <section
          className="py-16 md:py-20"
          style={{ background: '#FAF7F1', borderTop: '1px solid #E5DDCD' }}
          data-testid="kit-cross-sell"
        >
          <div className="container max-w-5xl">
            <p
              className="uppercase font-bold tracking-[0.28em] mb-4"
              style={{ color: '#C5A059', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
            >
              Related Documents
            </p>
            <h2
              className="font-bold leading-tight mb-3 text-[24px] md:text-[30px]"
              style={{ fontFamily: "'Manrope', sans-serif", color: '#0A1628' }}
            >
              {note.kitCrossSell.headline || 'The forms that handle this on the floor.'}
            </h2>
            <p
              className="text-[15.5px] md:text-base leading-[1.7] mb-10 max-w-2xl"
              style={{ color: 'rgba(10,22,40,0.72)', fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {note.kitCrossSell.intro || `Documents from the GigLine GigLine Supervisor Safety OS map directly to the requirements in this article. CFR-cited. Print-ready. $600 for the digital kit, included free with every Compliance Readiness Visit.`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
              {note.kitCrossSell.cards.map((card) => (
                <div
                  key={card.num}
                  className="rounded-md p-6"
                  style={{ background: 'white', border: '1px solid #E5DDCD' }}
                  data-testid={`kit-cross-sell-card-${card.num}`}
                >
                  <p
                    className="font-bold mb-3"
                    style={{ color: '#C5A059', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
                  >
                    SS-{card.num}
                  </p>
                  <h3
                    className="font-bold text-[15.5px] leading-snug mb-2"
                    style={{ fontFamily: "'Manrope', sans-serif", color: '#0A1628' }}
                  >
                    {card.label}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.65]"
                    style={{ color: 'rgba(10,22,40,0.65)', fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Link
                to="/supervisor-kit"
                className="inline-flex items-center justify-center gap-2 font-bold py-3.5 px-7 transition-all text-[15px]"
                style={{ background: '#0A1628', color: 'white', fontFamily: "'Manrope', sans-serif" }}
                data-testid="kit-cross-sell-cta"
              >
                See the Full Kit ($600 digital)
                <ArrowRight size={16} />
              </Link>
              <p
                className="text-[13.5px] italic"
                style={{ color: 'rgba(10,22,40,0.55)', fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Or call <a href="tel:+13363298899" className="font-bold hover:underline" style={{ color: '#0A1628' }}>(336) 329-8899</a> to scope a Compliance Readiness Visit &mdash; the kit ships included.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#102A43]" data-testid="note-cta">
        <div className="container max-w-3xl text-center">
          <p className="text-lg text-white/60 mb-2">
            If you're not sure how this looks in your operation —
          </p>
          <p className="text-lg text-white font-medium mb-8">
            start with a walkthrough.
          </p>
          <Link
            to="/intake"
            className="bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2"
            data-testid="note-walkthrough-cta"
          >
            Request a Walkthrough
            <ArrowRight size={18} />
          </Link>
          <p className="text-sm text-white/30 mt-4">
            One visit. Clear findings. No retainer.
          </p>
        </div>
      </section>
    </main>
  );
};

export default FieldNoteDetailPage;
