import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { getAttribution, trackEvent } from '../utils/analytics';

const API = process.env.REACT_APP_BACKEND_URL;

/*
  GL-INTAKE-002 — Master Service Intake Form
  Single-scroll layout. Conditional branching by service lane.
  Hybrid pricing display for Doc Creation lane.
*/

/* ── Brand tokens ── */
const C = {
  bg: '#1A1A1A', surface: '#222222', deep: '#111111', deeper: '#0B0B0B',
  blue: '#1F6FEB', blueDim: 'rgba(31,111,235,0.08)', blueBorder: 'rgba(31,111,235,0.32)',
  white: '#FFFFFF', sec: 'rgba(255,255,255,0.72)', muted: 'rgba(255,255,255,0.42)',
  subtle: 'rgba(255,255,255,0.26)',
  border: 'rgba(255,255,255,0.08)', red: '#EF4444',
};
const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* ─── Doc Creation pricing config ─── */
const DOC_CREATION_FIXED_ITEMS = {
  'Hazard Communication (HazCom) Program': 149,
  'Emergency Action Plan': 149,
  'Lockout / Tagout (LOTO) Program': 199,
  'PPE Hazard Assessment & Program': 129,
  'Forklift / Powered Industrial Truck Program': 149,
  'Respiratory Protection Program': 179,
  'Bloodborne Pathogens Program': 129,
};
const DOC_CREATION_CUSTOM_ITEMS = [
  'Confined Space Program',
  'Hot Work Permit Program',
  'Hearing Conservation Program',
  'Full Multi-Program Safety Manual',
  'Other (custom)',
];

/* ─────────────────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────────────────── */
const SectionHeader = ({ number, title, subtitle }) => (
  <div className="mb-7">
    <p className="font-bold tracking-[3px] mb-2" style={{ color: C.blue, ...mono, fontSize: '11px' }}>
      {number} &middot; SECTION {parseInt(number, 10)}
    </p>
    <h2 className="text-[22px] md:text-[26px] font-bold leading-tight text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>{title}</h2>
    {subtitle && <p className="text-sm mt-2 leading-relaxed max-w-2xl" style={{ color: C.muted }}>{subtitle}</p>}
  </div>
);

const Field = ({ label, required, hint, children, error }) => (
  <div className="mb-5">
    <label className="block text-sm mb-1.5 font-medium" style={{ color: C.sec }}>
      {label}{required && <span style={{ color: C.blue, marginLeft: '4px' }}>*</span>}
    </label>
    {children}
    {hint && <p className="text-xs mt-1.5 leading-relaxed" style={{ color: C.muted }}>{hint}</p>}
    {error && <p className="text-xs mt-1.5 font-medium" style={{ color: C.red }}>{error}</p>}
  </div>
);

const TextInput = (p) => (
  <input
    {...p}
    className="w-full px-4 py-3 rounded-md text-sm text-white placeholder:text-white/22 focus:outline-none transition-colors"
    style={{ background: C.deep, border: `1px solid ${C.border}` }}
    onFocus={(e) => { e.target.style.borderColor = C.blue; }}
    onBlur={(e) => { e.target.style.borderColor = C.border; }}
  />
);

const TextArea = ({ rows = 3, ...p }) => (
  <textarea
    rows={rows} {...p}
    className="w-full px-4 py-3 rounded-md text-sm text-white placeholder:text-white/22 focus:outline-none resize-none transition-colors"
    style={{ background: C.deep, border: `1px solid ${C.border}` }}
    onFocus={(e) => { e.target.style.borderColor = C.blue; }}
    onBlur={(e) => { e.target.style.borderColor = C.border; }}
  />
);

const SelectInput = ({ options, placeholder = 'Select...', ...p }) => (
  <select
    {...p}
    className="w-full px-4 py-3 rounded-md text-sm text-white focus:outline-none appearance-none transition-colors"
    style={{
      background: C.deep, border: `1px solid ${C.border}`,
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5l3 3 3-3' fill='none' stroke='%23ffffff' stroke-opacity='0.55' stroke-width='1.5'/></svg>\")",
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
    }}
    onFocus={(e) => { e.target.style.borderColor = C.blue; }}
    onBlur={(e) => { e.target.style.borderColor = C.border; }}
  >
    <option value="" disabled className="bg-[#111]">{placeholder}</option>
    {options.map((o) => <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>)}
  </select>
);

const PillToggle = ({ value, onChange, options }) => (
  <div className="inline-flex p-0.5 rounded-md" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-[5px]"
          style={{ background: active ? C.blue : 'transparent', color: active ? C.white : C.muted, ...mono, letterSpacing: '0.08em' }}>
          {opt.label}
        </button>
      );
    })}
  </div>
);

const RadioList = ({ value, onChange, options, columns = 1 }) => (
  <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
          className="flex items-start gap-3 px-4 py-3 rounded-md text-left transition-all"
          style={{ background: active ? C.blueDim : C.deep, border: `1px solid ${active ? C.blueBorder : C.border}` }}>
          <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ border: `2px solid ${active ? C.blue : 'rgba(255,255,255,0.22)'}` }}>
            {active && <span className="w-2 h-2 rounded-full" style={{ background: C.blue }} />}
          </span>
          <span className="text-sm text-white leading-snug">{opt.label}</span>
        </button>
      );
    })}
  </div>
);

const CheckboxCard = ({ option, checked, onToggle, price = null, compact = false }) => (
  <button type="button" onClick={onToggle}
    className={`text-left rounded-md transition-all ${compact ? 'px-4 py-2.5' : 'px-4 py-3.5'}`}
    style={{ background: checked ? C.blueDim : C.deep, border: `1px solid ${checked ? C.blueBorder : C.border}` }}>
    <div className="flex items-start gap-3">
      <span className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: checked ? C.blue : 'transparent', border: `2px solid ${checked ? C.blue : 'rgba(255,255,255,0.22)'}` }}>
        {checked && <Check size={11} color="#FFF" strokeWidth={3} />}
      </span>
      <span className="text-sm text-white leading-snug flex-1">
        {option}
        {price !== null && (
          <span className="ml-2 inline-block px-2 py-0.5 rounded text-xs font-bold" style={{ ...mono, color: C.blue, background: 'rgba(31,111,235,0.1)' }}>${price}</span>
        )}
      </span>
    </div>
  </button>
);

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
const ClientIntakePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [f, setF] = useState({
    // S1
    companyName: '', facilityCityState: '', contactName: '', contactTitle: '',
    phone: '', email: '',
    operationType: '', operationTypeOther: '',
    employeeCountBucket: '',
    referralSource: '', referralSourceOther: '',
    // S2
    serviceSelected: '',
    // S3
    promptingReason: '', promptingReasonOther: '',
    hasDeadline: '', deadlineDate: '', deadlineDriver: '',
    hadInjuryOrClaim: '', injuryClaimDescription: '',
    // S4 core
    q_safety_program: '', q_osha_logs: '', q_osha_inspection_ever: '',
    oshaInspectionYear: '', oshaInspectionCitations: '',
    // S4 doc_review
    docReviewConcerns: [], docReviewApproach: '',
    // S4 incident
    incidentDescription: '', incidentOshaNotified: '', incidentWcFiled: '',
    incidentInternalReportStarted: '', incidentNeededOutcomes: [],
    // S4 doc_creation
    docCreationItems: [], docCreationApproach: '', docCreationFacilities: '',
    docCreationScopeType: '', docCreationHasDeadline: '', docCreationDeadlineDetails: '',
    // S5
    hazardsPresent: [], safetyBoardPosted: '', facilityAdditionalNotes: '',
    // S6
    contactMethod: '', bestTime: '', preferredDays: [], preferredStartDate: '', blockers: '',
    // S7
    engagementAcknowledged: false, privacyAccepted: false,
  });

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleArr = (k, v) => setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  /* ─── URL param pre-selection (?service=compliance-readiness-visit) ─── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    const map = {
      'compliance-readiness-visit': 'compliance_readiness_visit',
    };
    const mapped = serviceParam && map[serviceParam];
    if (mapped) {
      setF((p) => (p.serviceSelected ? p : { ...p, serviceSelected: mapped }));
    }
    // Only run on mount / when query string changes
  }, [location.search]);

  /* ─── Hybrid pricing computation for Doc Creation lane ─── */
  const docCreationPricing = useMemo(() => {
    const fixedSelected = f.docCreationItems.filter((i) => i in DOC_CREATION_FIXED_ITEMS);
    const customSelected = f.docCreationItems.filter((i) => !(i in DOC_CREATION_FIXED_ITEMS));
    const multiFacility = f.docCreationFacilities === 'multiple';
    const hasCustom = customSelected.length > 0;

    if (multiFacility || hasCustom) {
      return { mode: 'phone_quote', reason: multiFacility ? 'multi-facility' : 'custom items selected' };
    }
    if (fixedSelected.length >= 3) {
      return { mode: 'bundle_399', amount: 399, items: fixedSelected };
    }
    if (fixedSelected.length > 0) {
      const sum = fixedSelected.reduce((acc, i) => acc + DOC_CREATION_FIXED_ITEMS[i], 0);
      return { mode: 'individual_sum', amount: sum, items: fixedSelected };
    }
    return { mode: 'none' };
  }, [f.docCreationItems, f.docCreationFacilities]);

  /* ─── Validation ─── */
  const validate = () => {
    const e = {};
    // S1
    if (!f.companyName.trim()) e.companyName = 'Required';
    if (!f.facilityCityState.trim()) e.facilityCityState = 'Required';
    if (!f.contactName.trim()) e.contactName = 'Required';
    if (!f.contactTitle.trim()) e.contactTitle = 'Required';
    if (!f.phone.trim()) e.phone = 'Required';
    if (!f.email.trim()) e.email = 'Required';
    if (!f.operationType) e.operationType = 'Required';
    if (!f.employeeCountBucket) e.employeeCountBucket = 'Required';
    if (!f.referralSource) e.referralSource = 'Required';
    // S2
    if (!f.serviceSelected) e.serviceSelected = 'Required';
    // S3
    if (!f.promptingReason) e.promptingReason = 'Required';
    if (!f.hasDeadline) e.hasDeadline = 'Required';
    if (f.hasDeadline === 'yes' && !f.deadlineDate) e.deadlineDate = 'Date required';
    if (!f.hadInjuryOrClaim) e.hadInjuryOrClaim = 'Required';
    // S4 core (3 questions)
    if (!f.q_safety_program) e.q_safety_program = 'Required';
    if (!f.q_osha_logs) e.q_osha_logs = 'Required';
    if (!f.q_osha_inspection_ever) e.q_osha_inspection_ever = 'Required';
    // S4 lane-specific
    if (f.serviceSelected === 'doc_review') {
      if (!f.docReviewConcerns.length) e.docReviewConcerns = 'Select at least one';
      if (!f.docReviewApproach) e.docReviewApproach = 'Required';
    }
    if (f.serviceSelected === 'incident_review') {
      if (!f.incidentDescription.trim()) e.incidentDescription = 'Required';
      if (!f.incidentOshaNotified) e.incidentOshaNotified = 'Required';
      if (!f.incidentWcFiled) e.incidentWcFiled = 'Required';
      if (!f.incidentInternalReportStarted) e.incidentInternalReportStarted = 'Required';
      if (!f.incidentNeededOutcomes.length) e.incidentNeededOutcomes = 'Select at least one';
    }
    if (f.serviceSelected === 'doc_creation') {
      if (!f.docCreationItems.length) e.docCreationItems = 'Select at least one';
      if (!f.docCreationApproach) e.docCreationApproach = 'Required';
      if (!f.docCreationFacilities) e.docCreationFacilities = 'Required';
      if (!f.docCreationScopeType) e.docCreationScopeType = 'Required';
      if (!f.docCreationHasDeadline) e.docCreationHasDeadline = 'Required';
    }
    // S5 only required for walkthrough or doc_creation
    if (f.serviceSelected === 'walkthrough' || f.serviceSelected === 'doc_creation') {
      if (!f.hazardsPresent.length) e.hazardsPresent = 'Select at least one';
      if (!f.safetyBoardPosted) e.safetyBoardPosted = 'Required';
    }
    // S6
    if (!f.contactMethod) e.contactMethod = 'Required';
    if (!f.bestTime) e.bestTime = 'Required';
    // S7
    if (!f.engagementAcknowledged) e.engagementAcknowledged = 'Please confirm to submit';
    if (!f.privacyAccepted) e.privacyAccepted = 'Please confirm to submit';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setTimeout(() => {
        const firstErr = document.querySelector('[data-error="true"]');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...f,
        docCreationPricingDisplayed: docCreationPricing.mode,
        attribution: getAttribution(),
      };
      const res = await fetch(`${API}/api/intake/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        trackEvent('intake_submit_success', {
          service_requested: f.serviceSelected || 'unknown',
          source_form: 'client-intake',
          page_path: typeof window !== 'undefined' ? window.location.pathname : '/intake',
        });
        navigate(`/thank-you-intake?token=${encodeURIComponent(d.clientToken)}`);
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  /* ─── Helpers ─── */
  const setField = (k) => ({ value: f[k], onChange: (e) => set(k, e.target.value) });
  const wrap = (errKey) => ({ 'data-error': !!errors[errKey] });

  const yesNoNotSure = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'not_sure', label: 'Not sure' }];

  /* ═════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <SEO title="Client Safety Intake | GigLine Safety & Compliance" description="Master service intake — tell GigLine about your operation." canonical="/intake" />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50" style={{ background: C.deeper, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-6 py-3 max-w-3xl mx-auto">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" data-testid="intake-logo">
            <img src="/gigline-logo-full-horizontal-white.svg" alt="GigLine Safety & Compliance" className="h-10 md:h-12 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-2 text-right">
            <span className="text-xs font-bold uppercase tracking-[2px]" style={{ color: C.blue, ...mono }}>Master Intake</span>
            <span style={{ color: C.subtle }}>|</span>
            <span className="text-xs" style={{ color: C.muted }}>Secure</span>
          </div>
        </div>
      </nav>

      {/* ── Header ── */}
      <header className="max-w-3xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-8">
        <p className="font-bold tracking-[3px] mb-3" style={{ color: C.blue, ...mono, fontSize: '11px' }}>
          GL-INTAKE-002 &middot; 7 SECTIONS &middot; ≈ 5–7 MIN
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
          Tell GigLine about your operation.
        </h1>
        <p className="text-base md:text-[17px] leading-relaxed max-w-2xl" style={{ color: C.sec }}>
          One form. Four service lanes. Vince reviews every intake personally and follows up within 1 business day with a fixed quote. Nothing here goes to OSHA, your insurer, or anyone outside GigLine.
        </p>
      </header>

      <div className="h-px max-w-3xl mx-auto" style={{ background: C.border }} />

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 space-y-16 md:space-y-20">

        {/* ═══ S1 — Company & Contact ═══ */}
        <section data-testid="intake-section-01">
          <SectionHeader number="01" title="Company & Contact" subtitle="Who you are and where you operate." />
          <Field label="Company / facility name" required error={errors.companyName}>
            <span {...wrap('companyName')}><TextInput {...setField('companyName')} placeholder="Acme Manufacturing, Inc." data-testid="intake-companyName" /></span>
          </Field>
          <Field label="Facility city, state" required hint="Just the city and state — full address gets confirmed on the call." error={errors.facilityCityState}>
            <span {...wrap('facilityCityState')}><TextInput {...setField('facilityCityState')} placeholder="Kernersville, NC" data-testid="intake-facilityCityState" /></span>
          </Field>
          <div className="grid md:grid-cols-2 gap-x-5">
            <Field label="Your name" required error={errors.contactName}>
              <span {...wrap('contactName')}><TextInput {...setField('contactName')} placeholder="John Smith" data-testid="intake-contactName" /></span>
            </Field>
            <Field label="Your title / role" required error={errors.contactTitle}>
              <span {...wrap('contactTitle')}><TextInput {...setField('contactTitle')} placeholder="Plant Manager, Owner, EHS Lead" data-testid="intake-contactTitle" /></span>
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-x-5">
            <Field label="Phone" required error={errors.phone}>
              <span {...wrap('phone')}><TextInput type="tel" {...setField('phone')} placeholder="(336) 555-1234" data-testid="intake-phone" /></span>
            </Field>
            <Field label="Email" required error={errors.email}>
              <span {...wrap('email')}><TextInput type="email" {...setField('email')} placeholder="you@company.com" data-testid="intake-email" /></span>
            </Field>
          </div>
          <Field label="Type of operation" required error={errors.operationType}>
            <span {...wrap('operationType')}>
              <SelectInput {...setField('operationType')} data-testid="intake-operationType" options={[
                { value: 'steel_supply', label: 'Steel supply / fabrication' },
                { value: 'manufacturing', label: 'Manufacturing' },
                { value: 'warehouse', label: 'Warehouse / distribution' },
                { value: 'contractor', label: 'Contractor / construction' },
                { value: 'fleet', label: 'Fleet operations' },
                { value: 'mixed', label: 'Mixed use' },
                { value: 'other', label: 'Other' },
              ]} />
            </span>
          </Field>
          {(f.operationType === 'mixed' || f.operationType === 'other') && (
            <Field label="Describe your operation"><TextInput {...setField('operationTypeOther')} placeholder="Brief description" /></Field>
          )}
          <Field label="Employee count at this site" required error={errors.employeeCountBucket}>
            <span {...wrap('employeeCountBucket')}>
              <SelectInput {...setField('employeeCountBucket')} data-testid="intake-employeeCount" options={[
                { value: 'under_10', label: 'Under 10' }, { value: '10_25', label: '10–25' },
                { value: '26_50', label: '26–50' }, { value: '51_100', label: '51–100' },
                { value: '100_plus', label: '100+' },
              ]} />
            </span>
          </Field>
          <Field label="How did you hear about GigLine?" required error={errors.referralSource}>
            <span {...wrap('referralSource')}>
              <SelectInput {...setField('referralSource')} options={[
                { value: 'search', label: 'Google / web search' },
                { value: 'referral', label: 'Referral from someone I know' },
                { value: 'linkedin', label: 'LinkedIn / social media' },
                { value: 'repeat', label: 'I\'ve worked with Vince before' },
                { value: 'other', label: 'Other' },
              ]} />
            </span>
          </Field>
          {f.referralSource === 'other' && (
            <Field label="Tell us more"><TextInput {...setField('referralSourceOther')} placeholder="e.g. Industry magazine, trade show" /></Field>
          )}
        </section>

        {/* ═══ S2 — Service Selection ═══ */}
        <section data-testid="intake-section-02">
          <SectionHeader number="02" title="What service are you requesting?" subtitle="Pick the closest match. We'll talk through any nuances on the call." />
          <Field label="Service" required error={errors.serviceSelected}>
            <span {...wrap('serviceSelected')}>
              <RadioList value={f.serviceSelected} onChange={(v) => set('serviceSelected', v)} options={[
                { value: 'walkthrough', label: 'Safety Walkthrough & Top 10 Fixes Report — On-site visit + written report (from $1,200)' },
                { value: 'compliance_readiness_visit', label: 'Compliance Readiness Visit — Floor walkthrough + documentation review in one visit (from $2,000)' },
                { value: 'doc_review', label: 'OSHA Documentation Readiness Review — Review of written programs, training records, logs (from $1,300)' },
                { value: 'incident_review', label: 'Incident Review & Corrective Action Support — Post-injury / near-miss response (from $1,500)' },
                { value: 'doc_creation', label: 'Safety Documents / Program Creation — New programs, manuals, training packs' },
                { value: 'not_sure', label: "I need guidance — let Vince recommend" },
              ]} />
            </span>
          </Field>
        </section>

        {/* ═══ S3 — Urgency & Context ═══ */}
        <section data-testid="intake-section-03">
          <SectionHeader number="03" title="Urgency & Context" subtitle="What's behind this and when you need it done." />
          <Field label="What's prompting you to reach out?" required error={errors.promptingReason}>
            <span {...wrap('promptingReason')}>
              <SelectInput {...setField('promptingReason')} options={[
                { value: 'upcoming_osha_inspection', label: 'Upcoming OSHA inspection' },
                { value: 'upcoming_osha_visit', label: 'Upcoming OSHA visit (informal)' },
                { value: 'recent_incident', label: 'Recent incident or injury' },
                { value: 'insurance_request', label: 'Insurance carrier request' },
                { value: 'customer_request', label: 'Customer / client requested it' },
                { value: 'internal_concern', label: 'Internal concern or near-miss' },
                { value: 'growth_expansion', label: 'Growth / expansion / new facility' },
                { value: 'general_review', label: 'General safety check / due diligence' },
                { value: 'other', label: 'Other' },
              ]} />
            </span>
          </Field>
          {f.promptingReason === 'other' && (
            <Field label="Tell us more"><TextInput {...setField('promptingReasonOther')} /></Field>
          )}
          <Field label="Do you have a hard deadline?" required error={errors.hasDeadline}>
            <span {...wrap('hasDeadline')}>
              <PillToggle value={f.hasDeadline} onChange={(v) => set('hasDeadline', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
            </span>
          </Field>
          {f.hasDeadline === 'yes' && (
            <>
              <Field label="Deadline date" required error={errors.deadlineDate}>
                <span {...wrap('deadlineDate')}><TextInput type="date" {...setField('deadlineDate')} /></span>
              </Field>
              <Field label="What's driving the deadline?" hint="Optional but useful for triage">
                <SelectInput {...setField('deadlineDriver')} options={[
                  { value: 'osha', label: 'OSHA inspection / visit' },
                  { value: 'insurance', label: 'Insurance carrier' },
                  { value: 'customer', label: 'Customer / client requirement' },
                  { value: 'internal', label: 'Internal target' },
                  { value: 'other', label: 'Other' },
                ]} />
              </Field>
            </>
          )}
          <Field label="Has there been a recent injury, near-miss, or workers' comp claim?" required error={errors.hadInjuryOrClaim}>
            <span {...wrap('hadInjuryOrClaim')}>
              <PillToggle value={f.hadInjuryOrClaim} onChange={(v) => set('hadInjuryOrClaim', v)} options={yesNoNotSure} />
            </span>
          </Field>
          {f.hadInjuryOrClaim === 'yes' && (
            <Field label="Brief description" hint="No need for names or sensitive specifics.">
              <TextArea rows={2} {...setField('injuryClaimDescription')} placeholder="What happened and when." />
            </Field>
          )}
        </section>

        {/* ═══ S4 — Core Safety Setup + Lane Expansions ═══ */}
        <section data-testid="intake-section-04">
          <SectionHeader number="04" title="Current Safety Setup" subtitle="Quick read on what's in place. No judgment — Vince uses this to scope, not score." />
          <div className="rounded-lg overflow-hidden" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
            {[
              { key: 'q_safety_program', label: 'We have a written safety program or safety policies in place.' },
              { key: 'q_osha_logs', label: 'We keep an OSHA 300 / 300A injury and illness log for this site.' },
              { key: 'q_osha_inspection_ever', label: 'We have had an OSHA inspection at this facility before.' },
            ].map((q, i) => (
              <div key={q.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4"
                style={{ borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }} {...wrap(q.key)}>
                <p className="text-sm flex-1 leading-snug" style={{ color: C.sec }}>{q.label}</p>
                <PillToggle value={f[q.key]} onChange={(v) => set(q.key, v)} options={yesNoNotSure} />
              </div>
            ))}
          </div>
          {f.q_osha_inspection_ever === 'yes' && (
            <div className="mt-5 grid md:grid-cols-2 gap-x-5">
              <Field label="Year of last inspection"><TextInput {...setField('oshaInspectionYear')} placeholder="2024" /></Field>
              <Field label="Citations issued?"><TextInput {...setField('oshaInspectionCitations')} placeholder="None / 2 serious / etc." /></Field>
            </div>
          )}

          {/* Lane expansion: doc_review */}
          {f.serviceSelected === 'doc_review' && (
            <div className="mt-8 rounded-lg p-5 md:p-6" style={{ background: C.deeper, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-[2px] mb-4" style={{ ...mono, color: C.blue }}>Doc Review Lane</p>
              <Field label="Which areas of documentation concern you most?" required hint="Select all that apply." error={errors.docReviewConcerns}>
                <span {...wrap('docReviewConcerns')}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {['Written safety programs', 'HazCom + SDS access', 'LOTO procedures',
                      'OSHA 300 / 300A logs', 'Training records', 'Forklift / PIT certifications',
                      'Inspection records', 'Emergency Action Plan',
                      'Recent OSHA correspondence', 'Other'].map((opt) => (
                        <CheckboxCard key={opt} option={opt} compact checked={f.docReviewConcerns.includes(opt)} onToggle={() => toggleArr('docReviewConcerns', opt)} />
                      ))}
                  </div>
                </span>
              </Field>
              <Field label="Approach" required error={errors.docReviewApproach}>
                <span {...wrap('docReviewApproach')}>
                  <RadioList value={f.docReviewApproach} onChange={(v) => set('docReviewApproach', v)} options={[
                    { value: 'review_existing', label: 'Review what we already have' },
                    { value: 'start_scratch', label: "Start from scratch — we don't have much" },
                    { value: 'not_sure', label: 'Not sure — let Vince advise' },
                  ]} />
                </span>
              </Field>
            </div>
          )}

          {/* Lane expansion: incident_review */}
          {f.serviceSelected === 'incident_review' && (
            <div className="mt-8 rounded-lg p-5 md:p-6" style={{ background: C.deeper, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-[2px] mb-4" style={{ ...mono, color: C.blue }}>Incident Review Lane</p>
              <Field label="Describe the incident" required hint="No names or sensitive specifics needed. Just enough to triage." error={errors.incidentDescription}>
                <span {...wrap('incidentDescription')}><TextArea rows={4} {...setField('incidentDescription')} placeholder="What happened, when, and severity." /></span>
              </Field>
              <Field label="Has OSHA been notified?" required error={errors.incidentOshaNotified}>
                <span {...wrap('incidentOshaNotified')}><PillToggle value={f.incidentOshaNotified} onChange={(v) => set('incidentOshaNotified', v)} options={yesNoNotSure} /></span>
              </Field>
              <Field label="Workers' comp claim filed?" required error={errors.incidentWcFiled}>
                <span {...wrap('incidentWcFiled')}>
                  <PillToggle value={f.incidentWcFiled} onChange={(v) => set('incidentWcFiled', v)} options={[
                    { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'in_process', label: 'In process' },
                  ]} />
                </span>
              </Field>
              <Field label="Internal incident report started?" required error={errors.incidentInternalReportStarted}>
                <span {...wrap('incidentInternalReportStarted')}><PillToggle value={f.incidentInternalReportStarted} onChange={(v) => set('incidentInternalReportStarted', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} /></span>
              </Field>
              <Field label="What outcomes do you need?" required error={errors.incidentNeededOutcomes}>
                <span {...wrap('incidentNeededOutcomes')}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {['Root cause documentation', 'Written corrective action plan', 'OSHA recordkeeping guidance',
                      'Insurance follow-up support', 'Training plan for the affected team', 'All of the above'].map((o) => (
                        <CheckboxCard key={o} option={o} compact checked={f.incidentNeededOutcomes.includes(o)} onToggle={() => toggleArr('incidentNeededOutcomes', o)} />
                      ))}
                  </div>
                </span>
              </Field>
            </div>
          )}

          {/* Lane expansion: doc_creation */}
          {f.serviceSelected === 'doc_creation' && (
            <div className="mt-8 rounded-lg p-5 md:p-6" style={{ background: C.deeper, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-[2px] mb-4" style={{ ...mono, color: C.blue }}>Document / Program Creation Lane</p>
              <Field label="Which programs or documents do you need?" required hint="Select all that apply. Fixed-price programs show their price. Custom items route to a quote call." error={errors.docCreationItems}>
                <span {...wrap('docCreationItems')}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(DOC_CREATION_FIXED_ITEMS).map(([item, price]) => (
                      <CheckboxCard key={item} option={item} price={docCreationPricing.mode === 'bundle_399' || docCreationPricing.mode === 'phone_quote' ? null : price}
                        checked={f.docCreationItems.includes(item)} onToggle={() => toggleArr('docCreationItems', item)} />
                    ))}
                    {DOC_CREATION_CUSTOM_ITEMS.map((item) => (
                      <CheckboxCard key={item} option={item} checked={f.docCreationItems.includes(item)} onToggle={() => toggleArr('docCreationItems', item)} />
                    ))}
                  </div>
                </span>
              </Field>

              {/* Hybrid pricing display */}
              {docCreationPricing.mode === 'bundle_399' && (
                <div className="rounded-md p-4 mb-5" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.30)' }} data-testid="pricing-bundle">
                  <p className="text-xs font-bold uppercase tracking-[2px] mb-1.5" style={{ ...mono, color: '#22C55E' }}>Bundle Pricing Active</p>
                  <p className="text-sm leading-relaxed" style={{ color: C.white }}>
                    With 3+ fixed-price programs, you qualify for the <strong>$399 bundle</strong> — all selected programs included.
                  </p>
                </div>
              )}
              {docCreationPricing.mode === 'individual_sum' && (
                <div className="rounded-md p-4 mb-5" style={{ background: C.deep, border: `1px solid ${C.border}` }} data-testid="pricing-individual">
                  <p className="text-xs font-bold uppercase tracking-[2px] mb-1.5" style={{ ...mono, color: C.blue }}>Estimated Total</p>
                  <p className="text-sm leading-relaxed" style={{ color: C.white }}>
                    Selected programs: <strong>${docCreationPricing.amount}</strong> total. Final scope confirmed on the follow-up call.
                  </p>
                </div>
              )}
              {docCreationPricing.mode === 'phone_quote' && (
                <div className="rounded-md p-4 mb-5" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.32)' }} data-testid="pricing-phone-quote">
                  <p className="text-xs font-bold uppercase tracking-[2px] mb-1.5" style={{ ...mono, color: '#F59E0B' }}>Custom Quote Required</p>
                  <p className="text-sm leading-relaxed" style={{ color: C.white }}>
                    Vince will review your selections and call you within 1 business day with a quote.
                  </p>
                </div>
              )}

              <Field label="Where are you starting from?" required error={errors.docCreationApproach}>
                <span {...wrap('docCreationApproach')}>
                  <RadioList value={f.docCreationApproach} onChange={(v) => set('docCreationApproach', v)} options={[
                    { value: 'scratch', label: 'Starting from scratch — nothing in place yet' },
                    { value: 'revising', label: 'Revising / updating what we have' },
                    { value: 'mix', label: 'Mix of both' },
                  ]} />
                </span>
              </Field>
              <Field label="How many facilities will these programs cover?" required error={errors.docCreationFacilities}>
                <span {...wrap('docCreationFacilities')}>
                  <PillToggle value={f.docCreationFacilities} onChange={(v) => set('docCreationFacilities', v)} options={[
                    { value: 'one', label: 'One' }, { value: 'multiple', label: 'Multiple' },
                  ]} />
                </span>
              </Field>
              <Field label="Scope type" required error={errors.docCreationScopeType}>
                <span {...wrap('docCreationScopeType')}>
                  <RadioList value={f.docCreationScopeType} onChange={(v) => set('docCreationScopeType', v)} options={[
                    { value: 'review', label: 'Review only — existing materials check' },
                    { value: 'updates', label: 'Updates to existing programs' },
                    { value: 'full_creation', label: 'Full creation of new programs' },
                  ]} />
                </span>
              </Field>
              <Field label="Is there a deadline for completion?" required error={errors.docCreationHasDeadline}>
                <span {...wrap('docCreationHasDeadline')}>
                  <PillToggle value={f.docCreationHasDeadline} onChange={(v) => set('docCreationHasDeadline', v)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                </span>
              </Field>
              {f.docCreationHasDeadline === 'yes' && (
                <Field label="Deadline details"><TextInput {...setField('docCreationDeadlineDetails')} placeholder="e.g. Before customer audit on Sept 15" /></Field>
              )}
            </div>
          )}
        </section>

        {/* ═══ S5 — Hazards & Facility (conditional) ═══ */}
        {(f.serviceSelected === 'walkthrough' || f.serviceSelected === 'doc_creation') && (
          <section data-testid="intake-section-05">
            <SectionHeader number="05" title="Hazards & Facility Profile" subtitle="Helps Vince come prepared for the visit." />
            <Field label="Hazards present at this facility" required error={errors.hazardsPresent}>
              <span {...wrap('hazardsPresent')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {['Forklifts / powered industrial trucks', 'Overhead cranes or hoists',
                    'Hot work / welding / cutting', 'Machine tools (lathes, mills, presses, saws)',
                    'Hydraulic die press', 'Pneumatic (air) die press',
                    'Chemical use (solvents, coatings, fuels)', 'Confined spaces',
                    'Working at heights (ladders, roofs, lifts)', 'Electrical panel work',
                    'Company trucks / trailers from site', 'None of the above'].map((opt) => (
                      <CheckboxCard key={opt} option={opt} compact checked={f.hazardsPresent.includes(opt)} onToggle={() => toggleArr('hazardsPresent', opt)} />
                    ))}
                </div>
              </span>
            </Field>
            <Field label="Is an OSHA safety poster currently posted at the facility?" required error={errors.safetyBoardPosted}>
              <span {...wrap('safetyBoardPosted')}><PillToggle value={f.safetyBoardPosted} onChange={(v) => set('safetyBoardPosted', v)} options={yesNoNotSure} /></span>
            </Field>
            <Field label="Anything else we should know about the facility?" hint="Optional"><TextArea rows={2} {...setField('facilityAdditionalNotes')} placeholder="Access notes, security requirements, PPE for visitors, etc." /></Field>
          </section>
        )}

        {/* ═══ S6 — Scheduling & Logistics ═══ */}
        <section data-testid="intake-section-06">
          <SectionHeader number="06" title="Scheduling & Logistics" subtitle="So Vince can reach you and plan the visit." />
          <Field label="Preferred contact method" required error={errors.contactMethod}>
            <span {...wrap('contactMethod')}>
              <RadioList value={f.contactMethod} onChange={(v) => set('contactMethod', v)} options={[
                { value: 'phone', label: 'Phone call' }, { value: 'text', label: 'Text message' }, { value: 'email', label: 'Email' },
              ]} />
            </span>
          </Field>
          <Field label="Best time to reach you" required error={errors.bestTime}>
            <span {...wrap('bestTime')}>
              <RadioList value={f.bestTime} onChange={(v) => set('bestTime', v)} columns={2} options={[
                { value: 'morning', label: 'Morning (before noon)' },
                { value: 'midday', label: 'Midday (12–2)' },
                { value: 'afternoon', label: 'Afternoon (2–4)' },
                { value: 'after_4pm', label: 'After 4 PM' },
              ]} />
            </span>
          </Field>
          <Field label="Preferred days for a walkthrough or call" hint="Optional">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Flexible'].map((d) => {
                const checked = f.preferredDays.includes(d);
                return (
                  <button key={d} type="button" onClick={() => toggleArr('preferredDays', d)}
                    className="px-3 py-2.5 rounded-md text-sm font-medium transition-all"
                    style={{ background: checked ? C.blueDim : C.deep, border: `1px solid ${checked ? C.blueBorder : C.border}`, color: checked ? C.white : C.sec }}>
                    {d}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Approximate preferred start date" hint="Optional"><TextInput type="date" {...setField('preferredStartDate')} /></Field>
          <Field label="Anything preventing moving forward we should know about?" hint="Optional"><TextArea rows={2} {...setField('blockers')} placeholder="Budget approval, scheduling, etc." /></Field>
        </section>

        {/* ═══ S7 — Acknowledgments ═══ */}
        <section data-testid="intake-section-07">
          <SectionHeader number="07" title="Acknowledgment" />
          <div className="rounded-lg p-6 md:p-7 space-y-5" style={{ background: C.deeper, border: `1px solid ${C.border}` }}>
            <label className="flex items-start gap-4 cursor-pointer" {...wrap('engagementAcknowledged')} data-testid="intake-engagement-ack">
              <span className="mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: f.engagementAcknowledged ? C.blue : 'transparent', border: `2px solid ${f.engagementAcknowledged ? C.blue : 'rgba(255,255,255,0.32)'}` }}
                onClick={() => set('engagementAcknowledged', !f.engagementAcknowledged)}>
                {f.engagementAcknowledged && <Check size={12} color="#FFF" strokeWidth={3} />}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: C.sec }} onClick={() => set('engagementAcknowledged', !f.engagementAcknowledged)}>
                I understand this request begins a consulting engagement and that any agreed scope, fees, and deliverables will be confirmed in writing before work starts.
              </span>
            </label>
            {errors.engagementAcknowledged && <p className="text-xs font-medium" style={{ color: C.red }}>{errors.engagementAcknowledged}</p>}

            <label className="flex items-start gap-4 cursor-pointer" {...wrap('privacyAccepted')} data-testid="intake-privacy-ack">
              <span className="mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: f.privacyAccepted ? C.blue : 'transparent', border: `2px solid ${f.privacyAccepted ? C.blue : 'rgba(255,255,255,0.32)'}` }}
                onClick={() => set('privacyAccepted', !f.privacyAccepted)}>
                {f.privacyAccepted && <Check size={12} color="#FFF" strokeWidth={3} />}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: C.sec }}>
                I have read and agree to the{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-bold underline" style={{ color: C.blue }} data-testid="intake-privacy-link">
                  GigLine Privacy Policy
                </a>.
              </span>
            </label>
            {errors.privacyAccepted && <p className="text-xs font-medium" style={{ color: C.red }}>{errors.privacyAccepted}</p>}
          </div>

          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="mt-8 w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-bold transition-all text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: C.blue, color: C.white, fontFamily: "'Manrope', sans-serif" }} data-testid="intake-submit">
            {submitting ? 'Submitting...' : 'Send My Request to GigLine'}<ArrowRight size={16} />
          </button>
          <p className="text-xs mt-4 leading-relaxed" style={{ color: C.muted }}>
            After you submit, you&rsquo;ll receive an instant confirmation email and Vince will be in touch within 1 business day.
          </p>
        </section>
      </main>

      <footer className="border-t" style={{ borderColor: C.border }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 text-center">
          <p className="text-xs" style={{ color: C.muted }}>
            GigLine Safety &amp; Compliance &middot; (336) 329-8899 &middot;{' '}
            <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">vince@giglinecompliance.com</a>
            {' · '}<a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientIntakePage;
