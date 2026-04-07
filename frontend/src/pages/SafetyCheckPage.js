import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const SafetyCheckPage = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    operationType: '',
    employeeCount: '',
    concernedQuestion: '',
    whatPushed: ''
  });

  const questions = [
    {
      id: 1,
      text: "Do you have a written Hazard Communication program — and can your team locate the SDS for every chemical on site without delay?",
      citation: "29 CFR 1910.1200",
      topic: "HazCom & SDS"
    },
    {
      id: 2,
      text: "Are forklift operators currently certified — and are daily pre-shift inspections consistently documented?",
      citation: "29 CFR 1910.178",
      topic: "Forklift Certification"
    },
    {
      id: 3,
      text: "Do you have a written Lockout/Tagout program with documented annual inspections for each energy control procedure?",
      citation: "29 CFR 1910.147",
      topic: "Lockout-Tagout"
    },
    {
      id: 4,
      text: "Are machine guards in place on all equipment — and have none been removed, bypassed, or modified?",
      citation: "29 CFR 1910.212",
      topic: "Machine Guarding"
    },
    {
      id: 5,
      text: "Are damaged ladders removed from service and tagged before they are used again?",
      citation: "29 CFR 1926.1053",
      topic: "Ladder Safety"
    },
    {
      id: 6,
      text: "Are safety training records current, documented, and accessible when requested?",
      citation: "29 CFR 1910.132",
      topic: "Training Records"
    }
  ];

  const operationTypes = [
    { value: '', label: 'Select your operation type' },
    { value: 'Shop', label: 'Shop' },
    { value: 'Warehouse', label: 'Warehouse' },
    { value: 'Fleet', label: 'Fleet' },
    { value: 'Contractor', label: 'Contractor' },
    { value: 'Other', label: 'Other' }
  ];

  const employeeCounts = [
    { value: '', label: 'Select employee count' },
    { value: '1-10', label: '1–10 employees' },
    { value: '11-25', label: '11–25 employees' },
    { value: '26-50', label: '26–50 employees' },
    { value: '51-100', label: '51–100 employees' },
    { value: '101-250', label: '101–250 employees' },
    { value: '250+', label: '250+ employees' }
  ];

  const concernedQuestions = [
    { value: '', label: 'Select the question that concerned you most' },
    { value: 'HazCom & SDS', label: 'HazCom & SDS' },
    { value: 'Forklift Certification', label: 'Forklift Certification' },
    { value: 'Lockout-Tagout', label: 'Lockout-Tagout' },
    { value: 'Machine Guarding', label: 'Machine Guarding' },
    { value: 'Ladder Safety', label: 'Ladder Safety' },
    { value: 'Training Records', label: 'Training Records' }
  ];

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    if (Object.keys(newAnswers).length === 6) {
      setShowResults(true);
    }
  };

  const getNoCount = () => {
    return Object.values(answers).filter(a => a === 'no').length;
  };

  const getYesCount = () => {
    return Object.values(answers).filter(a => a === 'yes').length;
  };

  const getScoreLevel = () => {
    const noCount = getNoCount();
    if (noCount <= 1) return 'low';
    if (noCount <= 3) return 'medium';
    return 'high';
  };

  const getScoreDisplay = () => {
    const noCount = getNoCount();
    return `${noCount} of 6 questions answered No`;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.company.trim()) errors.company = "Company name is required.";
    if (!formData.phone.trim()) errors.phone = "Phone number is required.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "A valid email address is required.";
    }
    if (!formData.operationType) errors.operationType = "Select your operation type.";
    if (!formData.employeeCount) errors.employeeCount = "Select your employee count.";
    if (!formData.concernedQuestion) errors.concernedQuestion = "Select the question that concerned you most.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    const API_URL = process.env.REACT_APP_BACKEND_URL;

    try {
      const response = await fetch(`${API_URL}/api/safety-check/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          operation_type: formData.operationType,
          employee_count: formData.employeeCount,
          score_display: getScoreDisplay(),
          score_gaps: getNoCount(),
          concerned_question: formData.concernedQuestion,
          what_pushed: formData.whatPushed || '',
          answers: answers,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissionId(data.submission_id);
        setFormSubmitted(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      try {
        const formspreeResponse = await fetch('https://formspree.io/f/xpqoyldy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            company: formData.company,
            phone: formData.phone,
            email: formData.email,
            operation_type: formData.operationType,
            employee_count: formData.employeeCount,
            score: getScoreDisplay(),
            score_gaps: getNoCount(),
            concerned_question: formData.concernedQuestion,
            what_pushed: formData.whatPushed || '(not provided)',
            _subject: `GigLine Safety Check — ${formData.operationType} — ${getNoCount()} gaps`
          }),
        });
        if (formspreeResponse.ok) {
          setFormSubmitted(true);
        } else {
          throw new Error('Fallback failed');
        }
      } catch (fallbackError) {
        setFormStatus({
          type: 'error',
          message: 'Submission did not go through. Try again or contact Vince directly:'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-[#1C2B2B]/15 rounded bg-white text-[#1C2B2B] placeholder:text-[#1C2B2B]/40 focus:outline-none focus:ring-2 focus:ring-[#B8972C]/50 focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-[#1C2B2B] mb-1";

  return (
    <main className="bg-white" data-testid="safety-check-page">
      <SEO 
        title="Safety Check"
        description="Six questions mapped to OSHA's most cited violations in small operations. Answer honestly. Get a clear picture of where you stand."
        canonical="/safety-check"
      />

      {/* Header */}
      <section className="bg-[#1C2B2B] text-white py-16 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">
            GigLine Safety Check
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" data-testid="safety-check-headline" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
            The Six Questions OSHA Asks First
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            Built on OSHA's most cited violations in general industry. Takes 90 seconds. Answer honestly — this is for your operation, not for show.
          </p>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">

          {/* Frame text — sets expectation */}
          <p className="text-lg text-[#1C2B2B]/70 mb-10 leading-relaxed italic border-l-2 border-[#B8972C] pl-6" data-testid="safety-check-frame-text">
            Six questions. Honest answers. You'll know where you stand.
          </p>

          {/* What This Is Measuring */}
          <div className="mb-12 pb-8 border-b border-[#1C2B2B]/10">
            <h2 className="text-base font-semibold text-[#1C2B2B] mb-2">What This Is Measuring</h2>
            <p className="text-sm text-[#1C2B2B]/60 leading-relaxed">
              These questions reflect conditions that are cited repeatedly across manufacturing, warehousing, and contractor operations.
            </p>
            <p className="text-sm text-[#1C2B2B]/60 mt-2">
              If you cannot answer "yes" with confidence, that area likely needs attention.
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-10">
            {questions.map((question) => (
              <div 
                key={question.id} 
                className="border-l-2 border-[#B8972C]/30 pl-6 py-1"
                data-testid={`question-${question.id}`}
              >
                <p className="text-[10px] font-medium tracking-widest text-[#1C2B2B]/30 uppercase mb-3">
                  {String(question.id).padStart(2, '0')}
                </p>
                <p className="text-base font-medium text-[#1C2B2B] mb-2 leading-relaxed">
                  {question.text}
                </p>
                <p className="text-xs text-[#1C2B2B]/40 mb-5">
                  {question.citation}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleAnswer(question.id, 'yes')}
                    className={`px-6 py-2.5 rounded font-medium text-sm transition-colors ${
                      answers[question.id] === 'yes'
                        ? 'bg-[#1C2B2B] text-white'
                        : 'bg-[#F5F5F3] text-[#1C2B2B] hover:bg-[#E8E8E5]'
                    }`}
                    data-testid={`question-${question.id}-yes`}
                  >
                    Yes — Confirmed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(question.id, 'no')}
                    className={`px-6 py-2.5 rounded font-medium text-sm transition-colors ${
                      answers[question.id] === 'no'
                        ? 'bg-[#8B2500] text-white'
                        : 'bg-[#F5F5F3] text-[#1C2B2B] hover:bg-[#E8E8E5]'
                    }`}
                    data-testid={`question-${question.id}-no`}
                  >
                    No — Not in Place
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="mt-16 pt-12 border-t border-[#1C2B2B]/10" data-testid="results-section">
              
              <h2 className="text-2xl font-bold text-[#1C2B2B] mb-6" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                What Your Answers Suggest
              </h2>

              {/* Score Badge */}
              <div className={`inline-block px-4 py-2 rounded text-sm font-semibold mb-6 ${
                getScoreLevel() === 'low' ? 'bg-[#1C2B2B]/10 text-[#1C2B2B]' :
                getScoreLevel() === 'medium' ? 'bg-[#B8972C]/15 text-[#8B7222]' :
                'bg-[#8B2500]/10 text-[#8B2500]'
              }`} data-testid="score-badge">
                {getNoCount()} of 6 areas flagged
              </div>

              {/* Result Messages */}
              <div className="text-[#1C2B2B]/70 space-y-4 leading-relaxed mb-8">
                {getScoreLevel() === 'low' && (
                  <div data-testid="result-low">
                    <p>
                      Your operation shows signs of basic control in key areas. That does not mean it will hold under full review — but it is a solid starting point.
                    </p>
                  </div>
                )}
                {getScoreLevel() === 'medium' && (
                  <div data-testid="result-medium">
                    <p>
                      Some areas appear controlled. Others likely need attention. This is where most operations fall — functional, but exposed in specific areas.
                    </p>
                  </div>
                )}
                {getScoreLevel() === 'high' && (
                  <div data-testid="result-high">
                    <p>
                      Your operation is likely exposed in areas that are commonly cited. This does not mean failure — it means the system has gaps that need to be addressed.
                    </p>
                  </div>
                )}
              </div>

              {/* Critical Line */}
              <p className="text-sm text-[#1C2B2B] font-medium border-l-2 border-[#B8972C] pl-4 mb-12">
                This check does not replace a walkthrough or documentation review. It shows where to look first.
              </p>

              {/* CTA Block — conditional on result band */}
              <div className="bg-[#F5F5F3] rounded p-8 mb-12" data-testid="results-cta-block">
                {getScoreLevel() === 'high' && (
                  <>
                    <h3 className="text-xl font-bold text-[#1C2B2B] mb-3" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                      This Needs Eyes on the Floor.
                    </h3>
                    <p className="text-[#1C2B2B]/60 mb-6 leading-relaxed">
                      With this level of exposure, a walkthrough is the right next step. Someone needs to see what is actually happening on-site — not just what the paperwork says.
                    </p>
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center gap-2 bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white font-medium px-6 py-3 rounded transition-colors text-sm"
                      data-testid="results-cta-walkthrough"
                    >
                      Schedule a Walkthrough
                      <ArrowRight size={16} />
                    </Link>
                  </>
                )}
                {getScoreLevel() === 'medium' && (
                  <>
                    <h3 className="text-xl font-bold text-[#1C2B2B] mb-3" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                      The Gaps Are Specific. A Review Will Find Them.
                    </h3>
                    <p className="text-[#1C2B2B]/60 mb-6 leading-relaxed">
                      Your operation has controls in place — but the areas that flagged likely have documentation or program gaps. A focused review will show exactly what is missing and what to fix first.
                    </p>
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center gap-2 bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white font-medium px-6 py-3 rounded transition-colors text-sm"
                      data-testid="results-cta-review"
                    >
                      Request a Documentation Review
                      <ArrowRight size={16} />
                    </Link>
                  </>
                )}
                {getScoreLevel() === 'low' && (
                  <>
                    <h3 className="text-xl font-bold text-[#1C2B2B] mb-3" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                      Solid Start. Worth Confirming.
                    </h3>
                    <p className="text-[#1C2B2B]/60 mb-6 leading-relaxed">
                      Your answers suggest basic controls are in place. If you want to confirm that they hold under review — or catch what a self-assessment cannot — a quick check is worth the time.
                    </p>
                    <Link 
                      to="/contact" 
                      className="inline-flex items-center gap-2 border-2 border-[#1C2B2B]/20 hover:border-[#1C2B2B]/40 text-[#1C2B2B] font-medium px-6 py-3 rounded transition-colors text-sm"
                      data-testid="results-cta-confirm"
                    >
                      Reach Out if You Want a Second Look
                      <ArrowRight size={16} />
                    </Link>
                  </>
                )}
                <p className="text-xs text-[#1C2B2B]/50 mt-3">
                  No pressure. No ongoing contract. Just a clear assessment of what matters first.
                </p>
                <p className="text-xs text-[#1C2B2B]/50 mt-2">
                  <Link to="/services" className="text-[#B8972C] hover:underline">See full service details and pricing →</Link>
                </p>
              </div>

              {/* Submission Form */}
              <div className="pt-12 border-t border-[#1C2B2B]/10">
                {!formSubmitted ? (
                  <>
                    <h2 className="text-xl font-bold text-[#1C2B2B] mb-2" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                      Send Your Results to Vince
                    </h2>
                    <p className="text-sm text-[#1C2B2B]/60 mb-8 leading-relaxed">
                      Name your score and the question that concerned you most. Vince will review and respond with what he would look at first.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5" data-testid="safety-check-form">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className={labelClasses}>Name <span className="text-[#8B2500]">*</span></label>
                          <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className={inputClasses} data-testid="form-name" />
                          {validationErrors.name && <p className="text-xs text-[#8B2500] mt-1">{validationErrors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="company" className={labelClasses}>Company <span className="text-[#8B2500]">*</span></label>
                          <input type="text" id="company" name="company" value={formData.company} onChange={handleFormChange} className={inputClasses} data-testid="form-company" />
                          {validationErrors.company && <p className="text-xs text-[#8B2500] mt-1">{validationErrors.company}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="phone" className={labelClasses}>Phone <span className="text-[#8B2500]">*</span></label>
                          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleFormChange} className={inputClasses} data-testid="form-phone" />
                          {validationErrors.phone && <p className="text-xs text-[#8B2500] mt-1">{validationErrors.phone}</p>}
                        </div>
                        <div>
                          <label htmlFor="email" className={labelClasses}>Email <span className="text-[#8B2500]">*</span></label>
                          <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} className={inputClasses} data-testid="form-email" />
                          {validationErrors.email && <p className="text-xs text-[#8B2500] mt-1">{validationErrors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="operationType" className={labelClasses}>Operation Type <span className="text-[#8B2500]">*</span></label>
                          <select id="operationType" name="operationType" value={formData.operationType} onChange={handleFormChange} className={inputClasses} data-testid="form-operation-type">
                            {operationTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          {validationErrors.operationType && <p className="text-xs text-[#8B2500] mt-1">{validationErrors.operationType}</p>}
                        </div>
                        <div>
                          <label htmlFor="employeeCount" className={labelClasses}>Number of Employees <span className="text-[#8B2500]">*</span></label>
                          <select id="employeeCount" name="employeeCount" value={formData.employeeCount} onChange={handleFormChange} className={inputClasses} data-testid="form-employee-count">
                            {employeeCounts.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                          {validationErrors.employeeCount && <p className="text-xs text-[#8B2500] mt-1">{validationErrors.employeeCount}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="score" className={labelClasses}>Your Score</label>
                        <input type="text" id="score" name="score" value={getScoreDisplay()} readOnly className={`${inputClasses} bg-[#F5F5F3] cursor-not-allowed`} data-testid="form-score" />
                      </div>

                      <div>
                        <label htmlFor="concernedQuestion" className={labelClasses}>Which question concerned you most? <span className="text-[#8B2500]">*</span></label>
                        <select id="concernedQuestion" name="concernedQuestion" value={formData.concernedQuestion} onChange={handleFormChange} className={inputClasses} data-testid="form-concerned-question">
                          {concernedQuestions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        {validationErrors.concernedQuestion && <p className="text-xs text-[#8B2500] mt-1">{validationErrors.concernedQuestion}</p>}
                      </div>

                      <div>
                        <label htmlFor="whatPushed" className={labelClasses}>What pushed you to run this check today?</label>
                        <textarea id="whatPushed" name="whatPushed" value={formData.whatPushed} onChange={handleFormChange} rows={3} className={inputClasses} data-testid="form-what-pushed" />
                      </div>

                      <input type="text" name="_gotcha" style={{ display: 'none' }} />

                      {formStatus.type === 'error' && (
                        <div className="text-[#8B2500] text-sm">
                          <p>{formStatus.message}</p>
                          <p className="mt-1">
                            <a href="mailto:vince@giglinecompliance.com" className="underline">vince@giglinecompliance.com</a>
                            {' · '}
                            <a href="tel:336-329-8899" className="underline">336-329-8899</a>
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#1C2B2B] hover:bg-[#2A3D3D] text-white font-medium py-3.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="form-submit"
                      >
                        {isSubmitting ? 'Sending...' : 'Get My Result'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div data-testid="form-success">
                    <h2 className="text-xl font-bold text-[#1C2B2B] mb-4" style={{fontFamily: "Georgia, 'Times New Roman', serif"}}>
                      Results sent.
                    </h2>
                    <div className="text-[#1C2B2B]/70 space-y-4">
                      <p>
                        Vince will review your submission and respond within one business day with what he would check first in your operation.
                      </p>
                      {submissionId && (
                        <a
                          href={`${process.env.REACT_APP_BACKEND_URL}/api/safety-check/report/${submissionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#1C2B2B] text-white font-medium px-5 py-2.5 rounded hover:bg-[#2A3D3D] transition-colors text-sm"
                          data-testid="download-report"
                        >
                          Download Your Safety Check Report (PDF)
                        </a>
                      )}
                      <p className="pt-4">
                        Questions before then:<br />
                        <a href="mailto:vince@giglinecompliance.com" className="text-[#B8972C] hover:underline">vince@giglinecompliance.com</a>
                        {' · '}
                        <a href="tel:336-329-8899" className="text-[#B8972C] hover:underline">336-329-8899</a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SafetyCheckPage;
