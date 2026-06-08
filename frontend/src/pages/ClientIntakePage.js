import React, { useState, useRef } from 'react';
import { Check, Upload, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getAttribution } from '../utils/analytics';

const API = process.env.REACT_APP_BACKEND_URL;

/*
  GL-WEB-013 — Client Intake Form
  Single-scroll 6-section layout. Premium dark palette.
  Per spec — restrained, serious, polished. No AI-slop patterns.
*/

/* ── Brand tokens ── */
const C = {
  bg: '#1A1A1A', surface: '#222222', deep: '#111111', deeper: '#0B0B0B',
  blue: '#1F6FEB', blueDim: 'rgba(31,111,235,0.08)', blueBorder: 'rgba(31,111,235,0.32)',
  white: '#FFFFFF', sec: 'rgba(255,255,255,0.72)', muted: 'rgba(255,255,255,0.42)',
  subtle: 'rgba(255,255,255,0.26)',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.20)',
  red: '#EF4444', green: '#22C55E', amber: '#F59E0B',
};

const mono = { fontFamily: "'JetBrains Mono', monospace" };

/* ─────────────────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────────────────── */

const SectionHeader = ({ number, title, subtitle }) => (
  <div className="mb-7">
    <p
      className="font-bold tracking-[3px] mb-2"
      style={{ color: C.blue, ...mono, fontSize: '11px' }}
    >
      {number} &middot; SECTION {parseInt(number, 10)}
    </p>
    <h2 className="text-[22px] md:text-[26px] font-bold leading-tight text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm mt-2 leading-relaxed max-w-2xl" style={{ color: C.muted }}>
        {subtitle}
      </p>
    )}
  </div>
);

const Field = ({ label, required, hint, children, error }) => (
  <div className="mb-5">
    <label className="block text-sm mb-1.5 font-medium" style={{ color: C.sec }}>
      {label}{required && <span style={{ color: C.blue, marginLeft: '4px' }}>*</span>}
    </label>
    {children}
    {hint && (
      <p className="text-xs mt-1.5 leading-relaxed" style={{ color: C.muted }}>
        {hint}
      </p>
    )}
    {error && (
      <p className="text-xs mt-1.5 font-medium" style={{ color: C.red }}>
        {error}
      </p>
    )}
  </div>
);

const TextInput = ({ ...p }) => (
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

const SelectInput = ({ options, ...p }) => (
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
    <option value="" disabled className="bg-[#111]">Select...</option>
    {options.map((o) => (
      <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>
    ))}
  </select>
);

const PillToggle = ({ value, onChange, options }) => (
  <div className="inline-flex p-0.5 rounded-md" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <button
          key={opt.value} type="button"
          onClick={() => onChange(opt.value)}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-[5px]"
          style={{
            background: active ? C.blue : 'transparent',
            color: active ? C.white : C.muted,
            ...mono,
            letterSpacing: '0.08em',
          }}
        >
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
        <button
          key={opt.value} type="button"
          onClick={() => onChange(opt.value)}
          className="flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all"
          style={{
            background: active ? C.blueDim : C.deep,
            border: `1px solid ${active ? C.blueBorder : C.border}`,
          }}
        >
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ border: `2px solid ${active ? C.blue : 'rgba(255,255,255,0.22)'}` }}
          >
            {active && <span className="w-2 h-2 rounded-full" style={{ background: C.blue }} />}
          </span>
          <span className="text-sm text-white">{opt.label}</span>
        </button>
      );
    })}
  </div>
);

const EquipmentCard = ({ option, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="text-left px-4 py-3.5 rounded-md transition-all"
    style={{
      background: checked ? C.blueDim : C.deep,
      border: `1px solid ${checked ? C.blueBorder : C.border}`,
    }}
  >
    <div className="flex items-start gap-3">
      <span
        className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: checked ? C.blue : 'transparent',
          border: `2px solid ${checked ? C.blue : 'rgba(255,255,255,0.22)'}`,
        }}
      >
        {checked && <Check size={11} color="#FFF" strokeWidth={3} />}
      </span>
      <span className="text-sm text-white leading-snug">{option}</span>
    </div>
  </button>
);

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */

const yns = (val) => val || '';

const ClientIntakePage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [confirmation, setConfirmation] = useState({ email: '', clientToken: '' });

  const [f, setF] = useState({
    // Section 1
    companyName: '', facilityAddress: '', contactName: '', contactTitle: '',
    phone: '', email: '',
    operationType: '', operationTypeOther: '',
    employeeCountBucket: '', shiftPattern: '',
    // Section 2
    reasonForContact: '', upcomingAudit: '', auditDetails: '',
    urgencyTimeline: '', serviceRequested: '', remoteOrOnsite: '',
    // Section 3
    q_safety_program: '', q_osha_logs: '', q_new_hire: '', q_training: '',
    q_eap: '', q_hazcom: '', q_inspections: '',
    q_prior_osha: '', q_known_gaps: '',
    // Section 4
    equipment: [], otherHazards: '',
    // Section 5
    docPrepReadiness: '', preferredDays: [], preferredTime: '',
    contactMethod: '', accessNotes: '',
    // Section 6
    acknowledgmentChecked: false,
  });

  const set = (key, val) => setF((p) => ({ ...p, [key]: val }));
  const toggleArr = (key, val) => setF((p) => ({
    ...p, [key]: p[key].includes(val) ? p[key].filter((v) => v !== val) : [...p[key], val],
  }));

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 5 - files.length);
    setFiles((p) => [...p, ...newFiles]);
  };
  const removeFile = (idx) => setFiles((p) => p.filter((_, i) => i !== idx));

  const errorRef = useRef(null);
  const validate = () => {
    const e = {};
    if (!f.companyName.trim()) e.companyName = 'Required';
    if (!f.facilityAddress.trim()) e.facilityAddress = 'Required';
    if (!f.contactName.trim()) e.contactName = 'Required';
    if (!f.phone.trim()) e.phone = 'Required';
    if (!f.email.trim()) e.email = 'Required';
    if (!f.operationType) e.operationType = 'Required';
    if (!f.employeeCountBucket) e.employeeCountBucket = 'Required';
    if (!f.shiftPattern) e.shiftPattern = 'Required';
    if (!f.reasonForContact.trim()) e.reasonForContact = 'Required';
    if (!f.upcomingAudit) e.upcomingAudit = 'Required';
    if (!f.urgencyTimeline) e.urgencyTimeline = 'Required';
    if (!f.serviceRequested) e.serviceRequested = 'Required';
    if (!f.remoteOrOnsite) e.remoteOrOnsite = 'Required';
    const sec3 = ['q_safety_program', 'q_osha_logs', 'q_new_hire', 'q_training', 'q_eap', 'q_hazcom', 'q_inspections', 'q_prior_osha'];
    sec3.forEach((k) => { if (!f[k]) e[k] = 'Required'; });
    if (!f.equipment.length) e.equipment = 'Select at least one (or "None of the above")';
    if (!f.docPrepReadiness) e.docPrepReadiness = 'Required';
    if (!f.contactMethod) e.contactMethod = 'Required';
    if (!f.acknowledgmentChecked) e.acknowledgmentChecked = 'Please confirm to submit';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setSubmitting(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${API}/api/intake/upload`, { method: 'POST', body: fd });
        if (res.ok) {
          const d = await res.json();
          uploadedUrls.push({ filename: d.filename, uploadId: d.uploadId });
        }
      }

      const payload = { ...f, uploadedFileUrls: uploadedUrls, attribution: getAttribution() };
      const res = await fetch(`${API}/api/intake/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        setConfirmation({ email: f.email, clientToken: d.clientToken });
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  /* ─── Confirmation Screen ─── */
  if (submitted) {
    const statusUrl = `/status/${confirmation.clientToken}`;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: C.bg }}>
        <SEO title="Form Received | GigLine Safety & Compliance" description="Your intake form has been received." canonical="/intake" />
        <img
          src="/gigline-logo-full-horizontal-white.svg"
          alt="GigLine Safety & Compliance"
          className="h-12 w-auto mb-10"
        />
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: C.blue }}>
            <Check size={32} color="#FFF" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" data-testid="intake-confirmation-heading">Form received</h1>
          <p className="text-sm mb-8" style={{ color: C.sec }}>Vince has what he needs to scope your engagement.</p>

          <div
            className="rounded-lg p-5 mb-4 text-left"
            style={{ background: C.blueDim, border: `1px solid ${C.blueBorder}` }}
          >
            <p className="text-sm leading-relaxed" style={{ color: C.sec }}>
              Vince will review your intake and send a proposed scope and price within <strong className="text-white">1 business day</strong>.
            </p>
          </div>

          {/* GL-WEB-013 Enhancement 1 — check your inbox */}
          <div
            className="rounded-lg p-5 mb-4 text-left"
            style={{ background: C.deep, border: `1px solid ${C.border}` }}
            data-testid="intake-inbox-line"
          >
            <p className="text-sm leading-relaxed" style={{ color: C.sec }}>
              Check your inbox &mdash; a confirmation has been sent to{' '}
              <strong className="text-white">{confirmation.email}</strong>. It includes the 2026 Triad OSHA Field Manual and a link to your engagement status page.
            </p>
          </div>

          {/* GL-WEB-013 Enhancement 2 — status page button */}
          <Link
            to={statusUrl}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-md font-bold transition-all text-sm hover:brightness-110"
            style={{ background: C.blue, color: C.white, fontFamily: "'Manrope', sans-serif" }}
            data-testid="intake-status-button"
          >
            View your engagement status
            <ArrowRight size={16} />
          </Link>

          <p className="mt-8 text-xs" style={{ color: C.muted }}>
            <a href="tel:3363298899" className="hover:text-white transition-colors">(336) 329-8899</a>{' '}
            &middot;{' '}
            <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">vince@giglinecompliance.com</a>
          </p>
        </div>
      </div>
    );
  }

  /* ─── Form ─── */
  const setField = (k) => ({ value: f[k], onChange: (e) => set(k, e.target.value) });
  const sec3Questions = [
    { key: 'q_safety_program', label: 'We have a written safety program or safety policies.' },
    { key: 'q_osha_logs', label: 'We keep OSHA 300 / 300A injury and illness logs for this site.' },
    { key: 'q_new_hire', label: 'We provide new-hire safety orientation for all employees.' },
    { key: 'q_training', label: 'We conduct and document regular safety training (toolbox talks, annual topics, etc.).' },
    { key: 'q_eap', label: 'We have written procedures for emergency evacuation.' },
    { key: 'q_hazcom', label: 'We have a written Hazard Communication program and SDS access for chemicals.' },
    { key: 'q_inspections', label: 'We perform and document regular safety inspections or walkthroughs.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <SEO title="Client Safety Intake | GigLine Safety & Compliance" description="Complete the GigLine safety intake form to start your engagement." canonical="/intake" />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50" style={{ background: C.deeper, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-6 py-3 max-w-3xl mx-auto">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" data-testid="intake-logo">
            <img src="/gigline-logo-full-horizontal-white.svg" alt="GigLine Safety & Compliance" className="h-10 md:h-12 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-2 text-right">
            <span className="text-xs font-bold uppercase tracking-[2px]" style={{ color: C.blue, ...mono }}>Client Intake</span>
            <span style={{ color: C.subtle }}>|</span>
            <span className="text-xs" style={{ color: C.muted }}>Secure portal</span>
          </div>
        </div>
      </nav>

      {/* ── Header ── */}
      <header className="max-w-3xl mx-auto px-5 md:px-8 pt-12 md:pt-20 pb-8">
        <p
          className="font-bold tracking-[3px] mb-3"
          style={{ color: C.blue, ...mono, fontSize: '11px' }}
        >
          GL-INTAKE-001 &middot; 6 SECTIONS &middot; ≈ 5 MIN
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
          Tell us about your operation.
        </h1>
        <p className="text-base md:text-[17px] leading-relaxed max-w-2xl" style={{ color: C.sec }}>
          This takes about 5 minutes. Vince will review your answers and confirm a fixed quote within 1 business day. Nothing here goes to OSHA, your insurer, or anyone outside GigLine.
        </p>
      </header>

      <div className="h-px max-w-3xl mx-auto" style={{ background: C.border }} />

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 space-y-16 md:space-y-20">

        {/* ═══════════════════════════════════════════════
            SECTION 01 — Company & Contact Info
        ═══════════════════════════════════════════════ */}
        <section data-testid="intake-section-01">
          <SectionHeader number="01" title="Company & Contact Info" subtitle="Where you are and how Vince reaches you." />

          <Field label="Company / facility name" required error={errors.companyName}>
            <span data-error={!!errors.companyName}>
              <TextInput {...setField('companyName')} placeholder="Acme Manufacturing, Inc." data-testid="intake-companyName" />
            </span>
          </Field>

          <Field label="Facility address" required hint="Street address, city, state — used to confirm service area and travel time." error={errors.facilityAddress}>
            <span data-error={!!errors.facilityAddress}>
              <TextInput {...setField('facilityAddress')} placeholder="1234 Industrial Park Dr, Kernersville, NC" data-testid="intake-facilityAddress" />
            </span>
          </Field>

          <div className="grid md:grid-cols-2 gap-x-5">
            <Field label="Primary contact name" required error={errors.contactName}>
              <span data-error={!!errors.contactName}>
                <TextInput {...setField('contactName')} placeholder="John Smith" data-testid="intake-contactName" />
              </span>
            </Field>
            <Field label="Title / role" hint="Plant Manager, Operations Manager, Owner">
              <TextInput {...setField('contactTitle')} placeholder="Plant Manager" data-testid="intake-contactTitle" />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-x-5">
            <Field label="Phone" required hint="Best number to reach you — call or text" error={errors.phone}>
              <span data-error={!!errors.phone}>
                <TextInput type="tel" {...setField('phone')} placeholder="(336) 555-1234" data-testid="intake-phone" />
              </span>
            </Field>
            <Field label="Email" required error={errors.email}>
              <span data-error={!!errors.email}>
                <TextInput type="email" {...setField('email')} placeholder="you@company.com" data-testid="intake-email" />
              </span>
            </Field>
          </div>

          <Field label="Type of operation" required error={errors.operationType}>
            <span data-error={!!errors.operationType}>
              <SelectInput
                {...setField('operationType')}
                data-testid="intake-operationType"
                options={[
                  { value: 'steel_supply', label: 'Steel supply / fabrication' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                  { value: 'warehouse', label: 'Warehouse / distribution' },
                  { value: 'contractor', label: 'Contractor / construction' },
                  { value: 'fleet', label: 'Fleet operations' },
                  { value: 'mixed', label: 'Mixed use' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </span>
          </Field>
          {(f.operationType === 'mixed' || f.operationType === 'other') && (
            <Field label="Describe your operation type">
              <TextInput {...setField('operationTypeOther')} placeholder="Brief description" />
            </Field>
          )}

          <div className="grid md:grid-cols-2 gap-x-5">
            <Field label="Approximate employee count at this site" required error={errors.employeeCountBucket}>
              <span data-error={!!errors.employeeCountBucket}>
                <SelectInput
                  {...setField('employeeCountBucket')}
                  data-testid="intake-employeeCount"
                  options={[
                    { value: 'under_10', label: 'Under 10' },
                    { value: '10_24', label: '10–24' },
                    { value: '25_74', label: '25–74' },
                    { value: '75_149', label: '75–149' },
                    { value: '150_plus', label: '150+' },
                  ]}
                />
              </span>
            </Field>
            <Field label="Typical shift pattern" required error={errors.shiftPattern}>
              <span data-error={!!errors.shiftPattern}>
                <SelectInput
                  {...setField('shiftPattern')}
                  data-testid="intake-shiftPattern"
                  options={[
                    { value: 'days_only', label: 'Days only' },
                    { value: 'days_nights', label: 'Days + nights' },
                    { value: '24_7', label: '24/7 operation' },
                    { value: 'variable', label: 'Variable' },
                  ]}
                />
              </span>
            </Field>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 02 — Why You Called & Urgency
        ═══════════════════════════════════════════════ */}
        <section data-testid="intake-section-02">
          <SectionHeader number="02" title="Why You Called & Urgency" subtitle="What's behind this request and when you need it done." />

          <Field
            label="What prompted you to reach out right now?"
            required
            hint="e.g. upcoming OSHA visit, insurance requirement, recent incident, internal concern, just getting organized"
            error={errors.reasonForContact}
          >
            <span data-error={!!errors.reasonForContact}>
              <TextArea rows={3} {...setField('reasonForContact')} placeholder="Brief — 2 to 3 sentences." data-testid="intake-reason" />
            </span>
          </Field>

          <Field label="Do you have any upcoming audits, inspections, or compliance deadlines?" required error={errors.upcomingAudit}>
            <span data-error={!!errors.upcomingAudit}>
              <PillToggle
                value={f.upcomingAudit}
                onChange={(v) => set('upcomingAudit', v)}
                options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'not_sure', label: 'Not sure' }]}
              />
            </span>
          </Field>

          {f.upcomingAudit === 'yes' && (
            <Field label="If yes — date or details" hint="e.g. OSHA inspection scheduled for August 15, insurance renewal in 90 days">
              <TextInput {...setField('auditDetails')} placeholder="Date and what's coming" />
            </Field>
          )}

          <Field label="How soon do you want the walkthrough or review completed?" required error={errors.urgencyTimeline}>
            <span data-error={!!errors.urgencyTimeline}>
              <RadioList
                value={f.urgencyTimeline}
                onChange={(v) => set('urgencyTimeline', v)}
                options={[
                  { value: 'asap', label: 'As soon as possible' },
                  { value: '2_4_weeks', label: 'Next 2–4 weeks' },
                  { value: 'flexible', label: 'Flexible — no specific deadline' },
                ]}
              />
            </span>
          </Field>

          <Field label="Which service are you requesting?" required error={errors.serviceRequested}>
            <span data-error={!!errors.serviceRequested}>
              <RadioList
                value={f.serviceRequested}
                onChange={(v) => set('serviceRequested', v)}
                options={[
                  { value: 'walkthrough', label: 'Safety Walkthrough & Top 10 Fixes Report' },
                  { value: 'doc_review', label: 'Documentation & Gap Check' },
                  { value: 'incident_review', label: 'Incident Review & Corrective Action Support' },
                  { value: 'not_sure', label: 'Not sure — let Vince recommend' },
                ]}
              />
            </span>
          </Field>

          <Field label="Do you prefer the review to be remote or on-site?" required error={errors.remoteOrOnsite}>
            <span data-error={!!errors.remoteOrOnsite}>
              <RadioList
                value={f.remoteOrOnsite}
                onChange={(v) => set('remoteOrOnsite', v)}
                options={[
                  { value: 'onsite', label: 'On-site (Vince comes to the facility)' },
                  { value: 'remote', label: 'Remote (you send documents, Vince returns a report)' },
                  { value: 'no_preference', label: 'No preference' },
                ]}
              />
            </span>
          </Field>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 03 — Current Safety Setup
        ═══════════════════════════════════════════════ */}
        <section data-testid="intake-section-03">
          <SectionHeader number="03" title="Current Safety Setup" subtitle="Quick read on what's already in place. No judgment — Vince uses this to scope, not score." />

          <div className="rounded-lg overflow-hidden" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
            {sec3Questions.map((q, i) => (
              <div
                key={q.key}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4"
                style={{ borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}
                data-error={!!errors[q.key]}
              >
                <p className="text-sm flex-1 leading-snug" style={{ color: C.sec }}>{q.label}</p>
                <div className="flex-shrink-0">
                  <PillToggle
                    value={f[q.key]}
                    onChange={(v) => set(q.key, v)}
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                      { value: 'not_sure', label: 'Not sure' },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
          {sec3Questions.some((q) => errors[q.key]) && (
            <p className="text-xs mt-2 font-medium" style={{ color: C.red }}>Please answer all 7 questions above.</p>
          )}

          <div className="mt-6">
            <Field
              label="Have you received an OSHA citation or been inspected in the last 3 years?"
              required
              hint="Helps Vince identify any repeat violation exposure before the walkthrough."
              error={errors.q_prior_osha}
            >
              <span data-error={!!errors.q_prior_osha}>
                <RadioList
                  value={f.q_prior_osha}
                  onChange={(v) => set('q_prior_osha', v)}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
                  ]}
                />
              </span>
            </Field>
          </div>

          <Field
            label="Anything you already know is missing or worrying you?"
            hint="No wrong answers — the more specific you are, the better prepared Vince will be."
          >
            <TextArea rows={3} {...setField('q_known_gaps')} placeholder="Optional — what's on your mind?" />
          </Field>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 04 — Equipment, Vehicles & Special Hazards
        ═══════════════════════════════════════════════ */}
        <section data-testid="intake-section-04">
          <SectionHeader number="04" title="Equipment, Vehicles & Special Hazards" subtitle="Check everything that applies at this facility." />

          <Field label="Equipment and hazards present at this facility" required error={errors.equipment}>
            <span data-error={!!errors.equipment}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" data-testid="intake-equipment">
                {[
                  'Forklifts or powered industrial trucks',
                  'Overhead cranes or hoists',
                  'Cutting, grinding, or fixed machinery',
                  'Company trucks or trailers operating from this site',
                  'Significant chemical use (solvents, coatings, fuels, lubricants)',
                  'Hot work / welding',
                  'Electrical work or panel servicing performed on-site',
                  'Hydraulic die press',
                  'Pneumatic (air) die press',
                  'None of the above',
                ].map((opt) => (
                  <EquipmentCard
                    key={opt}
                    option={opt}
                    checked={f.equipment.includes(opt)}
                    onToggle={() => toggleArr('equipment', opt)}
                  />
                ))}
              </div>
            </span>
          </Field>

          <Field label="Other notable hazards or processes not listed above" hint="Optional">
            <TextInput {...setField('otherHazards')} placeholder="e.g. spray paint booth, autoclave, on-site generators" />
          </Field>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 05 — Documentation & Logistics
        ═══════════════════════════════════════════════ */}
        <section data-testid="intake-section-05">
          <SectionHeader number="05" title="Documentation & Logistics" subtitle="A few practical questions to plan the visit or review." />

          <Field
            label="Can you gather the documents on the prep checklist before the visit?"
            required
            hint="GigLine will send the prep checklist after this form is submitted."
            error={errors.docPrepReadiness}
          >
            <span data-error={!!errors.docPrepReadiness}>
              <RadioList
                value={f.docPrepReadiness}
                onChange={(v) => set('docPrepReadiness', v)}
                options={[
                  { value: 'yes', label: 'Yes — I can pull most of it together' },
                  { value: 'mostly', label: 'Mostly — some items may be missing' },
                  { value: 'need_help', label: 'I need help knowing where to start' },
                ]}
              />
            </span>
          </Field>

          <Field label="Preferred days for a walkthrough or review" hint="Optional">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Flexible'].map((d) => {
                const checked = f.preferredDays.includes(d);
                return (
                  <button
                    key={d} type="button"
                    onClick={() => toggleArr('preferredDays', d)}
                    className="px-3 py-2.5 rounded-md text-sm font-medium transition-all"
                    style={{
                      background: checked ? C.blueDim : C.deep,
                      border: `1px solid ${checked ? C.blueBorder : C.border}`,
                      color: checked ? C.white : C.sec,
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Preferred time of day" hint="Optional">
            <RadioList
              value={f.preferredTime}
              onChange={(v) => set('preferredTime', v)}
              options={[
                { value: 'morning', label: 'Morning (before noon)' },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'either', label: 'Either' },
              ]}
            />
          </Field>

          <Field label="Preferred contact method for scheduling" required error={errors.contactMethod}>
            <span data-error={!!errors.contactMethod}>
              <RadioList
                value={f.contactMethod}
                onChange={(v) => set('contactMethod', v)}
                options={[
                  { value: 'phone', label: 'Phone call' },
                  { value: 'text', label: 'Text message' },
                  { value: 'email', label: 'Email' },
                ]}
              />
            </span>
          </Field>

          <Field
            label="Anything we should know about access, PPE requirements, or security when we arrive?"
            hint="e.g. check in at front office, hard hat required, gate code needed"
          >
            <TextArea rows={3} {...setField('accessNotes')} placeholder="Optional" />
          </Field>

          <div className="mt-8">
            <p className="text-sm mb-2 font-medium" style={{ color: C.sec }}>
              Upload existing safety documents <span className="font-normal" style={{ color: C.muted }}>(optional)</span>
            </p>
            <div
              className="rounded-md p-6 text-center cursor-pointer transition-all hover:border-white/20"
              style={{ background: C.deep, border: `2px dashed ${C.border}` }}
              onClick={() => document.getElementById('intake-file-input').click()}
              data-testid="intake-file-upload"
            >
              <Upload size={22} className="mx-auto mb-2" style={{ color: C.muted }} />
              <p className="text-sm" style={{ color: C.sec }}>Click to upload PDF, Word, or Excel</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Up to 10MB each &middot; Max 5 files</p>
              <input id="intake-file-input" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFileSelect} />
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2 rounded-md" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
                    <span className="text-sm text-white truncate">{file.name}</span>
                    <button onClick={() => removeFile(i)} className="ml-2 text-white/30 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 06 — Engagement Acknowledgment
        ═══════════════════════════════════════════════ */}
        <section data-testid="intake-section-06">
          <SectionHeader number="06" title="Engagement Acknowledgment" />

          <div
            className="rounded-lg p-6 md:p-7"
            style={{ background: C.deeper, border: `1px solid ${C.border}` }}
          >
            <label
              className="flex items-start gap-4 cursor-pointer"
              data-error={!!errors.acknowledgmentChecked}
              data-testid="intake-acknowledgment"
            >
              <span
                className="mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: f.acknowledgmentChecked ? C.blue : 'transparent',
                  border: `2px solid ${f.acknowledgmentChecked ? C.blue : 'rgba(255,255,255,0.32)'}`,
                }}
                onClick={() => set('acknowledgmentChecked', !f.acknowledgmentChecked)}
              >
                {f.acknowledgmentChecked && <Check size={12} color="#FFF" strokeWidth={3} />}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: C.sec }} onClick={() => set('acknowledgmentChecked', !f.acknowledgmentChecked)}>
                I understand this visit is a documentation and gap assessment with written recommendations. Any new or rewritten safety programs can be scoped separately if requested. This engagement is private &mdash; nothing goes to OSHA, my insurer, or any outside party.
              </span>
            </label>
            {errors.acknowledgmentChecked && (
              <p className="text-xs mt-3 font-medium" style={{ color: C.red }}>{errors.acknowledgmentChecked}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-8 w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md font-bold transition-all text-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: C.blue, color: C.white, fontFamily: "'Manrope', sans-serif" }}
            data-testid="intake-submit"
          >
            {submitting ? 'Submitting...' : 'Submit intake'}
            <ArrowRight size={16} />
          </button>

          <p className="text-xs mt-4 leading-relaxed" style={{ color: C.muted }}>
            After you submit, you&rsquo;ll receive an instant confirmation email and Vince will be in touch within 1 business day.
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: C.border }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 text-center">
          <p className="text-xs" style={{ color: C.muted }}>
            GigLine Safety &amp; Compliance &middot; (336) 329-8899 &middot;{' '}
            <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">
              vince@giglinecompliance.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientIntakePage;
