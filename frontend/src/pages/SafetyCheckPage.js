import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const SafetyCheckPage = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
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
      text: "Do you have a written Hazard Communication program and can your people find the SDS for every chemical on site right now?",
      citation: "29 CFR 1910.1200",
      topic: "HazCom & SDS"
    },
    {
      id: 2,
      text: "Are your forklift operators certified in the last three years and are daily pre-shift inspections documented?",
      citation: "29 CFR 1910.178",
      topic: "Forklift Certification"
    },
    {
      id: 3,
      text: "Do you have a written Lockout/Tagout program with documented annual inspections of each energy control procedure?",
      citation: "29 CFR 1910.147",
      topic: "Lockout-Tagout"
    },
    {
      id: 4,
      text: "Are machine guards in place on every piece of equipment — and have none of them been removed or bypassed?",
      citation: "29 CFR 1910.212",
      topic: "Machine Guarding"
    },
    {
      id: 5,
      text: "Are damaged ladders removed from service and tagged before anyone uses them again?",
      citation: "29 CFR 1926.1053",
      topic: "Ladder Safety"
    },
    {
      id: 6,
      text: "Can you produce training records and toolbox talk documentation for the last 12 months?",
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
    
    // Check if all questions answered
    if (Object.keys(newAnswers).length === 6) {
      setShowResults(true);
    }
  };

  const getNoCount = () => {
    return Object.values(answers).filter(a => a === 'no').length;
  };

  const getScoreLevel = () => {
    const noCount = getNoCount();
    if (noCount <= 1) return 'low';
    if (noCount >= 2 && noCount <= 3) return 'medium';
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

    try {
      // Formspree endpoint for Safety Check
      const response = await fetch('https://formspree.io/f/xpqoyldy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
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

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Submission did not go through. Try again or contact Vince directly:'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-border rounded-md bg-white text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-primary mb-1";

  return (
    <main className="bg-white" data-testid="safety-check-page">
      <SEO 
        title="Safety Check"
        description="Six questions mapped to OSHA's most cited violations in small operations. Answer honestly. Get your score. Send your results to Vince Lawrence, GigLine Safety & Compliance."
        canonical="/safety-check"
      />
      {/* Page Header */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-widest text-white/60 uppercase mb-4">
            GigLine Safety Check
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" data-testid="safety-check-headline">
            The Six Questions OSHA Asks First
          </h1>
          <p className="text-lg text-white/90 mb-4">
            Built on OSHA's most cited violations in general industry. Takes 90 seconds. Answer honestly — this is for your operation, not for show.
          </p>
          <p className="text-sm text-white/70">
            Built on OSHA's most cited violations in general industry. Reviewed by a 25-year safety professional.
          </p>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="space-y-8">
            {questions.map((question) => (
              <div 
                key={question.id} 
                className="border-l-4 border-accent/30 pl-6 py-2"
                data-testid={`question-${question.id}`}
              >
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">
                  {String(question.id).padStart(2, '0')}
                </p>
                <p className="text-lg text-primary mb-2">
                  {question.text}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {question.citation}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleAnswer(question.id, 'yes')}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      answers[question.id] === 'yes'
                        ? 'bg-accent text-white'
                        : 'bg-secondary text-primary hover:bg-secondary/80'
                    }`}
                    data-testid={`question-${question.id}-yes`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(question.id, 'no')}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      answers[question.id] === 'no'
                        ? 'bg-red-600 text-white'
                        : 'bg-secondary text-primary hover:bg-secondary/80'
                    }`}
                    data-testid={`question-${question.id}-no`}
                  >
                    NO
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="mt-12 pt-12 border-t border-border" data-testid="results-section">
              {/* Low Score Result */}
              {getScoreLevel() === 'low' && (
                <div data-testid="result-low">
                  <p className="text-lg font-bold text-green-600 mb-4">
                    YOUR SCORE: 0–1 GAP
                  </p>
                  <div className="text-primary space-y-4">
                    <p>
                      Your documentation is ahead of most operations this size. A walkthrough would confirm what you have — and find what you cannot see from the inside.
                    </p>
                    <p>
                      Even operations with strong written programs have gaps in the field. What is documented and what is practiced are not always the same thing.
                    </p>
                  </div>
                </div>
              )}

              {/* Medium Score Result */}
              {getScoreLevel() === 'medium' && (
                <div data-testid="result-medium">
                  <p className="text-lg font-bold text-amber-600 mb-4">
                    YOUR SCORE: 2–3 GAPS
                  </p>
                  <div className="text-primary space-y-4">
                    <p>
                      You have gaps an OSHA inspector would find in the first hour. These are not paperwork problems — they are the citations that come with penalties averaging $4,500 per instance for small employers.
                    </p>
                    <p>
                      If you answered No to 2 or more of these, you also need to decide what you would hand an OSHA officer in the first 10 minutes. Most small operations do not know the answer to that. That is part of the exposure.
                    </p>
                  </div>
                </div>
              )}

              {/* High Score Result */}
              {getScoreLevel() === 'high' && (
                <div data-testid="result-high">
                  <p className="text-lg font-bold text-red-600 mb-4">
                    YOUR SCORE: 4–6 GAPS
                  </p>
                  <div className="text-primary space-y-4">
                    <p>
                      Your operation has significant exposure across multiple areas. This is the profile OSHA finds most often in general industry inspections of operations under 50 employees.
                    </p>
                    <p>
                      Beyond the violations themselves — do you know what to hand an OSHA officer in the first 10 minutes? Most operations at this exposure level do not have that answer ready either. That is a second layer of risk on top of the gaps above.
                    </p>
                  </div>
                </div>
              )}

              {/* Submission Form */}
              <div className="mt-12 pt-12 border-t border-border">
                {!formSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold text-primary mb-2">
                      Send Your Results to Vince
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Name your score and the question that concerned you most. He will tell you what he would look at first if he walked your floor tomorrow.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5" data-testid="safety-check-form">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className={labelClasses}>
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          className={inputClasses}
                          data-testid="form-name"
                        />
                        {validationErrors.name && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.name}</p>
                        )}
                      </div>

                      {/* Company */}
                      <div>
                        <label htmlFor="company" className={labelClasses}>
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleFormChange}
                          className={inputClasses}
                          data-testid="form-company"
                        />
                        {validationErrors.company && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.company}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className={labelClasses}>
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className={inputClasses}
                          data-testid="form-phone"
                        />
                        {validationErrors.phone && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className={labelClasses}>
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className={inputClasses}
                          data-testid="form-email"
                        />
                        {validationErrors.email && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
                        )}
                      </div>

                      {/* Operation Type */}
                      <div>
                        <label htmlFor="operationType" className={labelClasses}>
                          Operation Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="operationType"
                          name="operationType"
                          value={formData.operationType}
                          onChange={handleFormChange}
                          className={inputClasses}
                          data-testid="form-operation-type"
                        >
                          {operationTypes.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {validationErrors.operationType && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.operationType}</p>
                        )}
                      </div>

                      {/* Number of Employees */}
                      <div>
                        <label htmlFor="employeeCount" className={labelClasses}>
                          Number of employees <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="employeeCount"
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleFormChange}
                          className={inputClasses}
                          data-testid="form-employee-count"
                        >
                          {employeeCounts.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {validationErrors.employeeCount && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.employeeCount}</p>
                        )}
                      </div>

                      {/* Your Score (auto-populated, read-only) */}
                      <div>
                        <label htmlFor="score" className={labelClasses}>
                          Your score
                        </label>
                        <input
                          type="text"
                          id="score"
                          name="score"
                          value={getScoreDisplay()}
                          readOnly
                          className={`${inputClasses} bg-secondary cursor-not-allowed`}
                          data-testid="form-score"
                        />
                      </div>

                      {/* Which question concerned you most */}
                      <div>
                        <label htmlFor="concernedQuestion" className={labelClasses}>
                          Which question concerned you most? <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="concernedQuestion"
                          name="concernedQuestion"
                          value={formData.concernedQuestion}
                          onChange={handleFormChange}
                          className={inputClasses}
                          data-testid="form-concerned-question"
                        >
                          {concernedQuestions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {validationErrors.concernedQuestion && (
                          <p className="text-sm text-red-600 mt-1">{validationErrors.concernedQuestion}</p>
                        )}
                      </div>

                      {/* What pushed you to run this check today */}
                      <div>
                        <label htmlFor="whatPushed" className={labelClasses}>
                          What pushed you to run this check today?
                        </label>
                        <textarea
                          id="whatPushed"
                          name="whatPushed"
                          value={formData.whatPushed}
                          onChange={handleFormChange}
                          rows={3}
                          className={inputClasses}
                          data-testid="form-what-pushed"
                        />
                      </div>

                      {/* Honeypot field for spam protection */}
                      <input type="text" name="_gotcha" style={{ display: 'none' }} />

                      {/* Error message */}
                      {formStatus.type === 'error' && (
                        <div className="text-red-600 text-sm">
                          <p>{formStatus.message}</p>
                          <p className="mt-1">
                            <a href="mailto:vince@giglinecompliance.com" className="underline">vince@giglinecompliance.com</a>
                            {' · '}
                            <a href="tel:336-671-4967" className="underline">336-671-4967</a>
                          </p>
                        </div>
                      )}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="form-submit"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Results'}
                      </button>

                      {/* Expectation line */}
                      <p className="text-sm text-muted-foreground text-center">
                        This is not a sales call. Vince will review your results and respond within one business day with what he would look at first in your operation.
                      </p>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div data-testid="form-success">
                    <h2 className="text-2xl font-bold text-primary mb-4">
                      Results sent.
                    </h2>
                    <div className="text-primary space-y-4">
                      <p>
                        Vince will review what you submitted and respond within one business day.
                      </p>
                      <p>
                        If OSHA walked in tomorrow, here is what they would ask for first — and whether what you told him suggests you have it ready. That is what his response will cover.
                      </p>
                      <p className="pt-4">
                        Questions before then:<br />
                        <a href="mailto:vince@giglinecompliance.com" className="text-accent hover:underline">vince@giglinecompliance.com</a>
                        {' · '}
                        <a href="tel:336-671-4967" className="text-accent hover:underline">336-671-4967</a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Block */}
      <section className="py-12 border-t border-border">
        <div className="container max-w-3xl">
          <div className="text-muted-foreground space-y-1">
            <p className="font-semibold text-primary">GigLine Safety & Compliance</p>
            <p>Vince Lawrence</p>
            <p>
              <a href="mailto:vince@giglinecompliance.com" className="hover:text-accent">vince@giglinecompliance.com</a>
            </p>
            <p>
              <a href="tel:336-671-4967" className="hover:text-accent">336-671-4967</a>
            </p>
            <p>
              <a href="https://www.giglinecompliance.com" className="hover:text-accent">www.giglinecompliance.com</a>
            </p>
            <p className="pt-4 text-sm">
              Available for limited on-site days each month in the Triad and surrounding region. Remote reviews available nationwide.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SafetyCheckPage;
