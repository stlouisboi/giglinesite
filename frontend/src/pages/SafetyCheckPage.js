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
  const scoreLevel = noCount <= 1 ? 'low' : noCount <= 3 ? 'medium' : 'high';

  /* ── Handlers ── */
  const handleAnswer = (questionId, answer) => {
    const updated = { ...answers, [questionId]: answer };
    setAnswers(updated);
    // All 6 answered → show email gate
    if (Object.keys(updated).length === 6) {
      setTimeout(() => setPhase('gate'), 300);
    }
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

  const inputCls = "w-full px-4 py-3 border border-[#102133]/15 rounded bg-white text-[#102133] placeholder:text-[#102133]/40 focus:outline-none focus:ring-2 focus:ring-[#1558C0]/50 focus:border-transparent";

  return (
    <main className="bg-white" data-testid="safety-check-page">
      <SEO
        title="Safety Check"
        description="Six questions mapped to OSHA's most cited violations in small operations. Answer honestly. Get a clear picture of where you stand."
        canonical="/safety-check"
      />

      {/* Header */}
      <section className="bg-[#102133] text-white py-16 md:py-20">
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
            <p className="text-lg text-[#102133]/70 mb-10 leading-relaxed italic border-l-2 border-[#1558C0] pl-6" data-testid="safety-check-frame-text">
              Six questions. Honest answers. You'll know where you stand.
            </p>

            <div className="mb-12 pb-8 border-b border-[#102133]/10">
              <h2 className="text-base font-semibold text-[#102133] mb-2">What This Is Measuring</h2>
              <p className="text-sm text-[#102133]/60 leading-relaxed">
                These questions reflect conditions that are cited repeatedly across manufacturing, warehousing, and contractor operations.
              </p>
              <p className="text-sm text-[#102133]/60 mt-2">
                If you cannot answer "yes" with confidence, that area likely needs attention.
              </p>
            </div>

            <div className="space-y-10">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="border-l-2 border-[#1558C0]/30 pl-6 py-1" data-testid={`question-${q.id}`}>
                  <p className="text-[10px] font-medium tracking-widest text-[#102133]/30 uppercase mb-3">{String(q.id).padStart(2, '0')}</p>
                  <p className="text-base font-medium text-[#102133] mb-2 leading-relaxed">{q.text}</p>
                  <p className="text-xs text-[#102133]/40 mb-5">{q.citation}</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAnswer(q.id, 'yes')}
                      className={`px-6 py-2.5 rounded font-medium text-sm transition-colors ${answers[q.id] === 'yes' ? 'bg-[#102133] text-white' : 'bg-[#F5F5F3] text-[#102133] hover:bg-[#E8E8E5]'}`}
                      data-testid={`question-${q.id}-yes`}
                    >
                      Yes — Confirmed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAnswer(q.id, 'no')}
                      className={`px-6 py-2.5 rounded font-medium text-sm transition-colors ${answers[q.id] === 'no' ? 'bg-[#8B2500] text-white' : 'bg-[#F5F5F3] text-[#102133] hover:bg-[#E8E8E5]'}`}
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
            <p className="text-base text-[#102133]/60 mb-8 leading-relaxed" data-testid="gate-message">
              Enter your email to see your results and get a short summary you can keep on file.
            </p>

            <form onSubmit={handleGateSubmit} className="space-y-4" data-testid="gate-form">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#102133] mb-1">First Name <span className="text-[#8B2500]">*</span></label>
                <input id="name" name="name" value={gateData.name} onChange={handleGateChange} className={inputCls} placeholder="Your first name" data-testid="gate-name" />
                {gateErrors.name && <p className="text-xs text-[#8B2500] mt-1">{gateErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-[#102133] mb-1">Company Name <span className="text-[#8B2500]">*</span></label>
                <input id="company" name="company" value={gateData.company} onChange={handleGateChange} className={inputCls} placeholder="Company or operation name" data-testid="gate-company" />
                {gateErrors.company && <p className="text-xs text-[#8B2500] mt-1">{gateErrors.company}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#102133] mb-1">Email <span className="text-[#8B2500]">*</span></label>
                <input id="email" name="email" type="email" value={gateData.email} onChange={handleGateChange} className={inputCls} placeholder="you@company.com" data-testid="gate-email" />
                {gateErrors.email && <p className="text-xs text-[#8B2500] mt-1">{gateErrors.email}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#102133] mb-1">Phone <span className="text-[#102133]/40">(optional)</span></label>
                  <input id="phone" name="phone" type="tel" value={gateData.phone} onChange={handleGateChange} className={inputCls} placeholder="(555) 000-0000" data-testid="gate-phone" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-[#102133] mb-1">Role <span className="text-[#102133]/40">(optional)</span></label>
                  <select id="role" name="role" value={gateData.role} onChange={handleGateChange} className={inputCls} data-testid="gate-role">
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              {submitError && <p className="text-sm text-[#8B2500]" data-testid="gate-error">{submitError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold py-4 rounded transition-colors disabled:opacity-50 text-base"
                data-testid="gate-submit"
              >
                {isSubmitting ? 'Loading your results...' : 'See My Results'}
              </button>
            </form>

            <p className="text-xs text-[#102133]/40 mt-4 text-center">
              No spam. Just your results and a follow-up if it's useful.
            </p>
          </div>
        </section>
      )}

      {/* ━━━ PHASE 3: RESULTS ━━━ */}
      {phase === 'results' && (
        <section className="py-12 md:py-16" data-testid="results-section">
          <div className="container max-w-3xl">

            {/* Score Badge */}
            <div className={`inline-block px-4 py-2 rounded text-sm font-semibold mb-8 ${
              scoreLevel === 'low' ? 'bg-[#102133]/10 text-[#102133]' :
              scoreLevel === 'medium' ? 'bg-[#1558C0]/15 text-[#8B7222]' :
              'bg-[#8B2500]/10 text-[#8B2500]'
            }`} data-testid="score-badge">
              {noCount} of 6 areas flagged — {scoreLevel === 'low' ? 'Low' : scoreLevel === 'medium' ? 'Moderate' : 'High'} Risk
            </div>

            {/* ── Section A: Summary ── */}
            <div className="mb-10" data-testid="results-summary">
              <p className="text-base text-[#102133]/70 mb-4 leading-relaxed">
                Based on your responses, your operation {noCount === 0 ? 'appears controlled in the areas we checked.' : 'may have exposure in:'}
              </p>
              {flaggedTopics.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {flaggedTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-3" data-testid={`flagged-${topic.replace(/\s+/g, '-').toLowerCase()}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B2500] mt-2 flex-shrink-0" />
                      <span className="text-base text-[#102133] font-medium">{topic}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Section B: Short Explanations ── */}
            {flaggedTopics.length > 0 && (
              <div className="mb-12 space-y-4" data-testid="results-explanations">
                {flaggedTopics.map((topic) => (
                  <div key={topic} className="border-l-2 border-[#1558C0]/30 pl-5 py-2" data-testid={`explanation-${topic.replace(/\s+/g, '-').toLowerCase()}`}>
                    <p className="text-sm font-semibold text-[#102133] mb-1">{topic}</p>
                    <p className="text-sm text-[#102133]/60 leading-relaxed">{EXPLANATIONS[topic]}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Section C: Conversion CTA ── */}
            <div className="bg-[#102133] rounded p-8 md:p-10 mb-10" data-testid="results-cta-block">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {scoreLevel === 'high' ? 'This needs eyes on the floor.' :
                 scoreLevel === 'medium' ? 'The gaps are specific. A walkthrough will find them.' :
                 'Solid start. Worth confirming.'}
              </h3>
              <p className="text-base text-white/60 leading-relaxed mb-6">
                {scoreLevel === 'high'
                  ? "With this level of exposure, a walkthrough is the right next step. Someone needs to see what is actually happening on-site."
                  : scoreLevel === 'medium'
                  ? "Your operation has some controls in place — but the flagged areas likely have gaps that only show up during a real walkthrough."
                  : "Your answers suggest basic controls are in place. A quick walkthrough confirms what holds and catches what a self-assessment can't."}
              </p>

              <Link
                to="/request-walkthrough"
                className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white font-bold px-8 py-4 rounded transition-colors inline-flex items-center gap-2 text-base mb-4"
                data-testid="results-cta-walkthrough"
              >
                Have me walk the floor and confirm this
                <ArrowRight size={18} />
              </Link>

              <p className="text-sm text-white/40 mt-2">
                One visit. Clear findings. No retainer.
              </p>
              <p className="text-sm text-white/40 mt-1">
                Most walkthroughs start at $950 depending on size. You'll know your price before we schedule.
              </p>
            </div>

            {/* ── Section D: Reinforcement ── */}
            <div className="mb-10" data-testid="results-reinforcement">
              <div className="w-16 h-px bg-[#1558C0]/30 mb-6" />
              <p className="text-base text-[#102133]/50 italic">
                Most issues aren't new. They've just gone unchecked.
              </p>
            </div>

            {/* ── Download PDF ── */}
            {submissionId && (
              <div className="border-t border-[#102133]/10 pt-8" data-testid="results-download">
                <p className="text-sm text-[#102133]/60 mb-3">
                  A summary has been sent to your email. You can also download it here:
                </p>
                <a
                  href={`${API}/api/safety-check/report/${submissionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#102133]/20 hover:border-[#102133]/40 text-[#102133] font-medium px-5 py-2.5 rounded transition-colors text-sm"
                  data-testid="download-report"
                >
                  Download Safety Check Report (PDF)
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default SafetyCheckPage;
