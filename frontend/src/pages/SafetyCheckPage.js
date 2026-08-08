import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { trackSafetyCheckComplete } from '../utils/analytics';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;

/* ── Question data ── */
const QUESTIONS = [
  { id: 1, text: "Do you have a written Hazard Communication program — and can your team locate the SDS for every chemical on site without delay?", citation: "29 CFR 1910.1200", topic: "HazCom & SDS" },
  { id: 2, text: "Are forklift operators currently certified — and are daily pre-shift inspections consistently documented?", citation: "29 CFR 1910.178", topic: "Forklift Certification" },
  { id: 3, text: "Do you have a written Lockout/Tagout program with documented annual inspections for each energy control procedure?", citation: "29 CFR 1910.147", topic: "Lockout-Tagout" },
  { id: 4, text: "Are machine guards in place on all equipment — and have none been removed, bypassed, or modified?", citation: "29 CFR 1910.212", topic: "Machine Guarding" },
  { id: 5, text: "Are damaged ladders removed from service and tagged before they are used again?", citation: "29 CFR 1926.1053", topic: "Ladder Safety" },
  { id: 6, text: "Are safety training records current, documented, and accessible when requested?", citation: "29 CFR 1910.132", topic: "Training Records" },
];

/* ── Explanations per topic ── */
const EXPLANATIONS = {
  "HazCom & SDS": "Missing or incomplete hazard communication programs are OSHA's #1 cited violation. Every chemical on site needs a label and an accessible SDS.",
  "Forklift Certification": "Uncertified operators and undocumented inspections put people and product at risk. OSHA requires both — and checks for them.",
  "Lockout-Tagout": "Without documented LOTO procedures and annual inspections, unexpected energy release is a leading cause of serious injury.",
  "Machine Guarding": "Missing, removed, or modified guards on equipment is one of the most common and preventable citations in general industry.",
  "Ladder Safety": "Damaged ladders left in service are a citation waiting to happen. Simple to fix, often overlooked.",
  "Training Records": "Having training doesn't count if it's not documented. OSHA requires accessible, current records for every employee.",
};

const ROLES = [
  { value: '', label: 'Select (optional)' },
  { value: 'Owner', label: 'Owner' },
  { value: 'Plant Manager', label: 'Plant Manager' },
  { value: 'Ops Manager', label: 'Operations Manager' },
  { value: 'Safety Coordinator', label: 'Safety Coordinator' },
  { value: 'Supervisor', label: 'Supervisor' },
  { value: 'Other', label: 'Other' },
];

const SafetyCheckPage = () => {
  // Phase: 'questions' → 'gate' → 'results'
  const [phase, setPhase] = useState('questions');
  const [answers, setAnswers] = useState({});
  const [gateData, setGateData] = useState({ name: '', company: '', email: '', phone: '', role: '' });
  const [gateErrors, setGateErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionId, setSubmissionId] = useState(null);

  /* ── Scoring ── */
  const noCount = Object.values(answers).filter(a => a === 'no').length;
  const flaggedTopics = QUESTIONS.filter(q => answers[q.id] === 'no').map(q => q.topic);
  const scoreLevel = noCount === 0 ? 'low' : noCount <= 3 ? 'medium' : 'high';

  // ─── Topic-aware routing (Aug 2026): map flagged topics → matching offer ──
  // Medium tier: single-topic dominance → matching kit or walkthrough
  // High tier: multi-control situation → CRV (combined engagement)
  const routeFromTopics = (topics) => {
    if (!topics || topics.length === 0) return null;
    // HazCom-heavy — 1910.1200
    if (topics.length === 1 && topics[0] === 'HazCom & SDS') {
      return {
        primary: { label: 'Explore the HazCom Pro Kit', to: '/citation-proof-kits/hazcom-pro-kit', testid: 'route-hazcom-kit' },
        secondary: { label: 'Or request a Documentation Readiness Review →', to: '/intake?service=documentation-readiness-review', testid: 'route-doc-review' },
      };
    }
    // Forklift/PIT-heavy — 1910.178
    if (topics.length === 1 && topics[0] === 'Forklift Certification') {
      return {
        primary: { label: 'Explore the Forklift/PIT Readiness Kit', to: '/citation-proof-kits/forklift-pit-readiness-kit', testid: 'route-pit-kit' },
        secondary: { label: 'Or request a Safety Walkthrough →', to: '/intake?service=safety-walkthrough-report', testid: 'route-walkthrough' },
      };
    }
    // LOTO or Machine Guarding-heavy — 1910.147 / 1910.212
    if (topics.length <= 2 && topics.every(t => t === 'Lockout-Tagout' || t === 'Machine Guarding')) {
      const isLoto = topics.includes('Lockout-Tagout');
      return {
        primary: { label: 'Request a Safety Walkthrough', to: '/intake?service=safety-walkthrough-report', testid: 'route-walkthrough' },
        secondary: isLoto
          ? { label: 'Or explore the LOTO Readiness Kit →', to: '/citation-proof-kits/loto-readiness-kit', testid: 'route-loto-kit' }
          : { label: 'Or request a Compliance Readiness Visit →', to: '/intake?service=compliance-readiness-visit', testid: 'route-crv' },
      };
    }
    // Multi-control situation (3+ gaps or mixed categories) → CRV
    return {
      primary: { label: 'Request a Compliance Readiness Visit', to: '/intake?service=compliance-readiness-visit', testid: 'route-crv' },
      secondary: { label: 'Or start with a Safety Walkthrough →', to: '/intake?service=safety-walkthrough-report', testid: 'route-walkthrough' },
    };
  };
  const topicRoute = routeFromTopics(flaggedTopics);

  /* ── Handlers ── */
  const handleAnswer = (questionId, answer) => {
    const updated = { ...answers, [questionId]: answer };
    setAnswers(updated);
    // All 6 answered → reveal results directly (no email gate)
    if (Object.keys(updated).length === 6) {
      setTimeout(() => {
        setPhase('results');
        // Smooth scroll to results once they mount
        setTimeout(() => {
          const el = document.querySelector('[data-testid="results-section"]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
      }, 250);
    }
  };

  const handleStartOver = () => {
    setAnswers({});
    setPhase('questions');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleGateChange = (e) => setGateData({ ...gateData, [e.target.name]: e.target.value });

  const validateGate = () => {
    const errors = {};
    if (!gateData.name.trim()) errors.name = 'Required';
    if (!gateData.company.trim()) errors.company = 'Required';
    if (!gateData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gateData.email)) errors.email = 'Valid email required';
    setGateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGateSubmit = async (e) => {
    e.preventDefault();
    if (!validateGate()) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch(`${API}/api/safety-check/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: gateData.name,
          company: gateData.company,
          phone: gateData.phone || '',
          email: gateData.email,
          role: gateData.role || '',
          operation_type: '',
          employee_count: '',
          score_display: `${noCount} of 6 questions answered No`,
          score_gaps: noCount,
          concerned_question: flaggedTopics[0] || '',
          what_pushed: '',
          answers,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissionId(data.submission_id);
        trackSafetyCheckComplete(noCount, data.score_level);
        setPhase('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setSubmitError('Something went wrong. Try again or call (336) 329-8899.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-[#2A52A0]/15 rounded bg-white text-[#1C2B2B] placeholder:text-[#1C2B2B]/40 focus:outline-none focus:ring-2 focus:ring-[#1F3F80]/50 focus:border-transparent";

  return (
    <main className="bg-white" data-testid="safety-check-page">
      <SEO
        title="Safety Check"
        description="Six questions mapped to OSHA's most cited violations in small operations. Answer honestly. Get a clear picture of where you stand."
        canonical="/safety-check"
      />

      {/* Header */}
      <section className="bg-[#102A43] text-white py-16 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            GigLine Safety Check
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" data-testid="safety-check-headline" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            {phase === 'results' ? "Here's Where Your Exposure Probably Is" : 'The Six Questions OSHA Asks First'}
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            {phase === 'results'
              ? `Based on your responses, ${noCount} of 6 areas need attention.`
              : 'Built on OSHA\'s most cited violations in general industry. Takes 90 seconds. Answer honestly — this is for your operation, not for show.'}
          </p>
        </div>
      </section>

      {/* ━━━ PHASE 1: QUESTIONS ━━━ */}
      {phase === 'questions' && (
        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            <p className="text-lg text-[#1C2B2B]/70 mb-10 leading-relaxed italic border-l-2 border-[#1F3F80] pl-6" data-testid="safety-check-frame-text">
              Six questions. Honest answers. You'll know where you stand.
            </p>

            <div className="mb-12 pb-8 border-b border-[#2A52A0]/10">
              <h2 className="text-base font-semibold text-[#1C2B2B] mb-2">What This Is Measuring</h2>
              <p className="text-sm text-[#1C2B2B]/60 leading-relaxed">
                These questions reflect conditions that are cited repeatedly across manufacturing, warehousing, and contractor operations.
              </p>
              <p className="text-sm text-[#1C2B2B]/60 mt-2">
                If you cannot answer "yes" with confidence, that area likely needs attention.
              </p>
            </div>

            <div className="space-y-10">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="border-l-2 border-[#1F3F80]/30 pl-6 py-1" data-testid={`question-${q.id}`}>
                  <p className="text-[10px] font-medium tracking-widest text-[#1C2B2B]/30 uppercase mb-3">{String(q.id).padStart(2, '0')}</p>
                  <p className="text-base font-medium text-[#1C2B2B] mb-2 leading-relaxed">{q.text}</p>
                  <p className="text-xs text-[#1C2B2B]/40 mb-5">{q.citation}</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAnswer(q.id, 'yes')}
                      className={`px-6 py-2.5 rounded font-medium text-sm transition-colors ${answers[q.id] === 'yes' ? 'bg-[#102A43] text-white' : 'bg-[#F5F5F3] text-[#1C2B2B] hover:bg-[#E8E8E5]'}`}
                      data-testid={`question-${q.id}-yes`}
                    >
                      Yes — Confirmed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswer(q.id, 'no')}
                      className={`px-6 py-2.5 rounded font-medium text-sm transition-colors ${answers[q.id] === 'no' ? 'bg-[#8B2500] text-white' : 'bg-[#F5F5F3] text-[#1C2B2B] hover:bg-[#E8E8E5]'}`}
                      data-testid={`question-${q.id}-no`}
                    >
                      No — Not in Place
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━ PHASE 2: EMAIL GATE ━━━ */}
      {phase === 'gate' && (
        <section className="py-12 md:py-16">
          <div className="container max-w-lg">
            <p className="text-base text-[#1C2B2B]/60 mb-8 leading-relaxed" data-testid="gate-message">
              Enter your email to see your results and get a short summary you can keep on file.
            </p>

            <form onSubmit={handleGateSubmit} className="space-y-4" data-testid="gate-form">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#1C2B2B] mb-1">First Name <span className="text-[#8B2500]">*</span></label>
                <input id="name" name="name" value={gateData.name} onChange={handleGateChange} className={inputCls} placeholder="Your first name" data-testid="gate-name" />
                {gateErrors.name && <p className="text-xs text-[#8B2500] mt-1">{gateErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-[#1C2B2B] mb-1">Company Name <span className="text-[#8B2500]">*</span></label>
                <input id="company" name="company" value={gateData.company} onChange={handleGateChange} className={inputCls} placeholder="Company or operation name" data-testid="gate-company" />
                {gateErrors.company && <p className="text-xs text-[#8B2500] mt-1">{gateErrors.company}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1C2B2B] mb-1">Email <span className="text-[#8B2500]">*</span></label>
                <input id="email" name="email" type="email" value={gateData.email} onChange={handleGateChange} className={inputCls} placeholder="you@company.com" data-testid="gate-email" />
                {gateErrors.email && <p className="text-xs text-[#8B2500] mt-1">{gateErrors.email}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#1C2B2B] mb-1">Phone <span className="text-[#1C2B2B]/40">(optional)</span></label>
                  <input id="phone" name="phone" type="tel" value={gateData.phone} onChange={handleGateChange} className={inputCls} placeholder="(555) 000-0000" data-testid="gate-phone" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-[#1C2B2B] mb-1">Role <span className="text-[#1C2B2B]/40">(optional)</span></label>
                  <select id="role" name="role" value={gateData.role} onChange={handleGateChange} className={inputCls} data-testid="gate-role">
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {submitError && <p className="text-sm text-[#8B2500]" data-testid="gate-error">{submitError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold py-4 rounded transition-colors disabled:opacity-50 text-base"
                data-testid="gate-submit"
              >
                {isSubmitting ? 'Loading your results...' : 'See My Results'}
              </button>
            </form>

            <p className="text-xs text-[#1C2B2B]/40 mt-4 text-center">
              No spam. Just your results and a follow-up if it's useful.
            </p>
          </div>
        </section>
      )}

      {/* ━━━ PHASE 3: RESULTS (tier-based) ━━━ */}
      {phase === 'results' && (() => {
        const confirmed = 6 - noCount; // Number of "Yes — Confirmed"
        // Single-flag routing (Feb 2026): 1 flagged topic now unlocks the
        // medium-tier kit route instead of falling into the low-tier guide.
        //   low    = 0 flags  (all 6 confirmed)
        //   medium = 1–3 flags (topic-routed to kit / walkthrough)
        //   high   = 4+ flags (CRV / multi-control)
        const tier = confirmed >= 6 ? 'low' : confirmed >= 3 ? 'medium' : 'high';

        const TIER = {
          low: {
            label: 'LOW EXPOSURE',
            labelClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
            scoreClass: 'text-white',
            headline: 'Your documented controls are in place.',
            body: "You're ahead of most operations this size. Save this result and recheck quarterly — gaps open faster than most managers expect.",
          },
          medium: {
            label: 'GAPS IDENTIFIED',
            labelClass: 'bg-amber-400/15 text-amber-300 border-amber-300/30',
            scoreClass: 'text-amber-200',
            headline: noCount === 1
              ? 'You have a documented gap in one cited area.'
              : 'You have documented gaps in at least one cited area.',
            body: noCount === 1
              ? "Even one unconfirmed area is exactly what an OSHA inspector looks for first. The good news: it's fixable — and there's usually a matching kit or walkthrough that closes it fast."
              : "These gaps are fixable — but they're also exactly what an OSHA inspector looks for. A walkthrough puts a written record in your hands before anyone else sees the floor.",
          },
          high: {
            label: 'HIGH EXPOSURE',
            labelClass: 'bg-red-500/15 text-red-300 border-red-400/30',
            scoreClass: 'text-red-300',
            headline: 'Multiple high-citation-risk areas are unconfirmed.',
            body: "One of these gaps is enough to draw a serious citation. Don't wait for a complaint or a referral to find out which one.",
          },
        }[tier];

        return (
          <>
            <hr className="border-[#2A52A0]/10" />
            <section className="bg-[#102A43] text-white py-16 md:py-20" data-testid="results-section">
              <div className="container max-w-3xl">

                {/* Score numerals */}
                <p
                  className={`text-7xl md:text-8xl font-extrabold tracking-tight mb-4 ${TIER.scoreClass}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  data-testid="results-score"
                >
                  {confirmed} / 6
                </p>

                {/* Risk label badge */}
                <span
                  className={`inline-block text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded border mb-8 ${TIER.labelClass}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em' }}
                  data-testid="results-risk-label"
                >
                  {TIER.label}
                </span>

                {/* Headline */}
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-5 leading-[1.2] tracking-tight"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  data-testid="results-headline"
                >
                  {TIER.headline}
                </h2>

                {/* Body copy */}
                <p
                  className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-2xl"
                  data-testid="results-body"
                >
                  {TIER.body}
                </p>

                {/* Flagged topics (only if medium/high — gives substance to the result) */}
                {flaggedTopics.length > 0 && (
                  <div className="mb-8 pb-8 border-b border-white/10" data-testid="results-flagged-list">
                    <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      Areas flagged for review
                    </p>
                    <ul className="space-y-3">
                      {flaggedTopics.map((topic) => (
                        <li key={topic} className="flex items-start gap-3" data-testid={`flagged-${topic.replace(/\s+/g, '-').toLowerCase()}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${tier === 'high' ? 'bg-red-400' : 'bg-amber-300'}`} />
                          <div>
                            <p className="text-sm font-semibold text-white">{topic}</p>
                            <p className="text-sm text-white/55 leading-relaxed">{EXPLANATIONS[topic]}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tier-specific CTAs */}
                {tier === 'low' && (
                  <div className="mt-4" data-testid="results-cta-block">
                    <Link
                      to="/osha-inspection-guide"
                      className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded transition-colors text-base"
                      data-testid="results-cta-primary"
                    >
                      Download the OSHA Inspection Guide
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                )}

                {tier === 'medium' && topicRoute && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start" data-testid="results-cta-block">
                    <Link
                      to={topicRoute.primary.to}
                      className="inline-flex items-center gap-2 bg-[#102A43] hover:bg-[#1F3F80] text-white font-bold px-7 py-3.5 rounded transition-colors text-base"
                      data-testid={`results-cta-primary-${topicRoute.primary.testid}`}
                    >
                      {topicRoute.primary.label}
                      <ArrowRight size={18} />
                    </Link>
                    {topicRoute.secondary && (
                      <Link
                        to={topicRoute.secondary.to}
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white underline underline-offset-4 px-2 py-3.5 text-sm"
                        data-testid={`results-cta-secondary-${topicRoute.secondary.testid}`}
                      >
                        {topicRoute.secondary.label}
                      </Link>
                    )}
                  </div>
                )}

                {tier === 'high' && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start" data-testid="results-cta-block">
                    <a
                      href="tel:3363298899"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded transition-colors text-base"
                      data-testid="results-cta-primary"
                    >
                      Call or Text Vince Now — (336) 329-8899
                    </a>
                    <Link
                      to="/intake?service=compliance-readiness-visit"
                      className="inline-flex items-center gap-2 text-white/70 hover:text-white underline underline-offset-4 px-2 py-3.5 text-sm"
                      data-testid="results-cta-secondary-route-crv"
                    >
                      Or request a Compliance Readiness Visit →
                    </Link>
                  </div>
                )}

                {/* GL-WEB-021: Optional "Have Vince review your score" offer (all tiers) */}
                <p
                  className="mt-7 text-sm text-white/60 leading-relaxed"
                  data-testid="results-vince-review-offer"
                >
                  Want Vince to review your score? Reply directly —{' '}
                  <a
                    href="mailto:vince@giglinecompliance.com?subject=Safety%20Check%20Review"
                    className="text-[#C9A84C] hover:text-white underline underline-offset-4 transition-colors"
                  >
                    vince@giglinecompliance.com
                  </a>
                </p>

                {/* Disclaimer */}
                <p
                  className="mt-8 text-xs text-white/35 leading-relaxed max-w-xl"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  data-testid="results-disclaimer"
                >
                  This self-screen does not constitute a compliance audit. Results reflect self-reported conditions only.
                </p>

                {/* Start Over */}
                <div className="mt-10 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="text-sm text-white/50 hover:text-white underline underline-offset-4 transition-colors"
                    data-testid="results-start-over"
                  >
                    ← Start over
                  </button>
                </div>
              </div>
            </section>
          </>
        );
      })()}
    </main>
  );
};

export default SafetyCheckPage;
