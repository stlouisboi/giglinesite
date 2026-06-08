import React, { useState } from 'react';
import { Check, ChevronRight, Upload, X } from 'lucide-react';
import SEO from '../components/SEO';
import { getAttribution } from '../utils/analytics';

const API = process.env.REACT_APP_BACKEND_URL;

/* ── Brand tokens ── */
const C = {
  bg: '#1A1A1A', surface: '#222222', deep: '#111111',
  gold: '#1F6FEB', white: '#FFFFFF',
  sec: 'rgba(255,255,255,0.65)', muted: 'rgba(255,255,255,0.38)',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.20)',
};

/* ── Section defs ── */
const SECTIONS = [
  { id: 1, label: 'Company' },
  { id: 2, label: 'Operation' },
  { id: 3, label: 'Needs' },
];

/* ── Reusable components ── */
const Input = ({ label, required, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1.5" style={{ color: C.sec }}>
      {label}{required && <span style={{ color: C.gold }}> *</span>}
    </label>
    <input
      {...props}
      required={required}
      className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors"
      style={{ background: C.deep, border: `1px solid ${C.border}` }}
      onFocus={e => e.target.style.borderColor = C.gold}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  </div>
);

const Textarea = ({ label, required, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1.5" style={{ color: C.sec }}>{label}{required && <span style={{ color: C.gold }}> *</span>}</label>
    <textarea
      {...props} required={required} rows={3}
      className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none resize-none transition-colors"
      style={{ background: C.deep, border: `1px solid ${C.border}` }}
      onFocus={e => e.target.style.borderColor = C.gold}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  </div>
);

const RadioGroup = ({ label, name, options, value, onChange, required, columns = 1 }) => (
  <div className="mb-4">
    <label className="block text-sm mb-2" style={{ color: C.sec }}>{label}{required && <span style={{ color: C.gold }}> *</span>}</label>
    <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all"
          style={{
            background: value === opt.value ? 'rgba(31,111,235,0.07)' : C.deep,
            border: `1px solid ${value === opt.value ? 'rgba(31,111,235,0.4)' : C.border}`,
          }}
          onClick={() => onChange(opt.value)}
        >
          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            style={{ borderColor: value === opt.value ? C.gold : 'rgba(255,255,255,0.2)' }}>
            {value === opt.value && <div className="w-2 h-2 rounded-full" style={{ background: C.gold }} />}
          </div>
          <span className="text-sm text-white">{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const CheckboxGroup = ({ label, options, values, onChange, columns = 1 }) => (
  <div className="mb-4">
    <label className="block text-sm mb-2" style={{ color: C.sec }}>{label}</label>
    <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
      {options.map(opt => {
        const optVal = typeof opt === 'string' ? opt : opt.value;
        const optLabel = typeof opt === 'string' ? opt : opt.label;
        const checked = values.includes(optVal);
        return (
          <label key={optVal} className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all"
            style={{
              background: checked ? 'rgba(31,111,235,0.07)' : C.deep,
              border: `1px solid ${checked ? 'rgba(31,111,235,0.4)' : C.border}`,
            }}
            onClick={() => onChange(optVal)}
          >
            <div className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
              style={{ borderColor: checked ? C.gold : 'rgba(255,255,255,0.2)', background: checked ? C.gold : 'transparent' }}>
              {checked && <Check size={10} color="#111" />}
            </div>
            <span className="text-sm text-white">{optLabel}</span>
          </label>
        );
      })}
    </div>
  </div>
);

const MatrixRow = ({ label, value, onChange }) => {
  const opts = [
    { v: 'yes', color: '#22C55E' },
    { v: 'no', color: '#EF4444' },
    { v: 'na', color: 'rgba(255,255,255,0.55)' },
    { v: 'not_sure', color: '#F59E0B' },
  ];
  return (
    <div className="grid grid-cols-12 gap-3 items-center py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="col-span-6 sm:col-span-5 text-sm pr-2" style={{ color: C.sec }}>{label}</div>
      <div className="col-span-6 sm:col-span-7 grid grid-cols-4 gap-1">
        {opts.map(({ v, color }) => {
          const active = value === v;
          return (
            <button key={v} type="button" onClick={() => onChange(v)}
              aria-pressed={active}
              className="flex items-center justify-center py-2 transition-all focus:outline-none"
              style={{ background: 'transparent' }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all"
                style={{
                  border: `2px solid ${active ? color : 'rgba(255,255,255,0.18)'}`,
                  background: 'transparent',
                }}
              >
                {active && (
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const MatrixGrid = ({ label, rows, values, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm mb-3" style={{ color: C.sec }}>{label}</label>
    <div className="rounded-lg p-4 sm:p-5" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
      {/* Column headers */}
      <div className="grid grid-cols-12 gap-3 items-center pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="col-span-6 sm:col-span-5" />
        <div className="col-span-6 sm:col-span-7 grid grid-cols-4 gap-1 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#22C55E' }}>Yes</span>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#EF4444' }}>No</span>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.55)' }}>N/A</span>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#F59E0B' }}>Not Sure</span>
        </div>
      </div>
      {rows.map(r => (
        <MatrixRow key={r.key} label={r.label} value={values[r.key] || ''} onChange={v => onChange(r.key, v)} />
      ))}
    </div>
  </div>
);


/* ═══════════════════════════════════════════ */
/*  MAIN COMPONENT                            */
/* ═══════════════════════════════════════════ */

const ClientIntakePage = () => {
  const [section, setSection] = useState(1);
  const [completed, setCompleted] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);

  /* Form state — pricing-driver + service-needs + qualitative scoping fields */
  const [f, setF] = useState({
    company: '', address: '', additionalLocations: '',
    contactName: '', email: '', phone: '',
    totalEmployees: '', siteEmployees: '', schedule: '',
    industry: '', industryOther: '', dayToDay: '', operations: [], topHazards: '',
    safetyProgram: '',
    existingDocs: {}, uploadedFileUrls: [],
    helpNeeded: [], helpOther: '',
    urgency: '',
    preferredDays: [], preferredTime: '',
    referralSource: '',
    consentGiven: false,
  });

  const set = (key, val) => setF(prev => ({ ...prev, [key]: val }));
  const setNested = (parent, key, val) => setF(prev => ({ ...prev, [parent]: { ...prev[parent], [key]: val } }));
  const toggleArr = (key, val) => setF(prev => ({
    ...prev, [key]: prev[key].includes(val) ? prev[key].filter(v => v !== val) : [...prev[key], val],
  }));

  const progress = Math.round((completed.size / SECTIONS.length) * 100);

  const goNext = () => {
    setCompleted(prev => new Set([...prev, section]));
    setSection(Math.min(section + 1, SECTIONS.length));
  };
  const goBack = () => setSection(Math.max(section - 1, 1));

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 5 - files.length);
    setFiles(prev => [...prev, ...newFiles]);
  };
  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${API}/api/intake/upload`, { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push({ filename: data.filename, uploadId: data.uploadId });
        }
      }

      const payload = {
        ...f,
        totalEmployees: parseInt(f.totalEmployees) || 0,
        siteEmployees: parseInt(f.siteEmployees) || 0,
        uploadedFileUrls: uploadedUrls,
        attribution: getAttribution(),
      };

      const res = await fetch(`${API}/api/intake/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  /* ── Confirmation Screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: C.bg }}>
        <SEO title="Form Received | GigLine Safety & Compliance" description="Your intake form has been received." canonical="/intake" />
        <img
          src="/gigline-logo-full-horizontal-white.svg"
          alt="GigLine Safety & Compliance"
          className="h-12 w-auto mb-10"
        />
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: C.gold }}>
            <Check size={32} color="#111" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Form received</h1>
          <p className="text-sm mb-8" style={{ color: C.sec }}>Vince has what he needs to scope your engagement.</p>
          <div className="rounded-lg p-6 mb-6 text-left" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span style={{ color: C.muted }}>Company</span><span className="text-white font-medium">{f.company}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Contact</span><span className="text-white font-medium">{f.contactName}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Email</span><span className="text-white font-medium">{f.email}</span></div>
            </div>
          </div>
          <div className="rounded-lg p-5 text-left text-sm" style={{ background: 'rgba(31,111,235,0.06)', border: '1px solid rgba(31,111,235,0.15)' }}>
            <p style={{ color: C.sec }}>Vince will review your intake and send a proposed scope and price within <strong className="text-white">1 business day</strong>.</p>
          </div>
          <p className="mt-8 text-xs" style={{ color: C.muted }}>
            <a href="tel:3363298899" className="hover:text-white transition-colors">(336) 329-8899</a> · <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">vince@giglinecompliance.com</a>
          </p>
        </div>
      </div>
    );
  }

  /* ── Section renderers ── */
  const renderSection = () => {
    switch (section) {
      case 1: return (
        <div data-testid="intake-section-1">
          <h2 className="text-xl font-bold text-white mb-1">Company &amp; Contact</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>The essentials. Takes about 1 minute.</p>

          <Input label="Company legal name" required value={f.company} onChange={e => set('company', e.target.value)} data-testid="intake-company" />
          <Input label="Primary site address" required value={f.address} onChange={e => set('address', e.target.value)} data-testid="intake-address" />
          <RadioGroup label="Additional locations" name="locations" value={f.additionalLocations}
            onChange={v => set('additionalLocations', v)}
            options={[{ value: 'no', label: 'No, just this site' }, { value: '2-3', label: 'Yes, 2–3 locations' }, { value: '4+', label: 'Yes, 4+ locations' }]}
          />

          <div className="h-px my-6" style={{ background: C.border }} />

          <Input label="Primary contact name" required value={f.contactName} onChange={e => set('contactName', e.target.value)} data-testid="intake-contact" />
          <Input label="Email address" required type="email" value={f.email} onChange={e => set('email', e.target.value)} data-testid="intake-email" />
          <Input label="Phone number" required type="tel" value={f.phone} onChange={e => set('phone', e.target.value)} data-testid="intake-phone" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Total employees (all locations)" required type="number" value={f.totalEmployees} onChange={e => set('totalEmployees', e.target.value)} />
            <Input label="Employees at this site" required type="number" value={f.siteEmployees} onChange={e => set('siteEmployees', e.target.value)} />
          </div>

          <RadioGroup label="Primary work schedule" name="schedule" required value={f.schedule}
            onChange={v => set('schedule', v)}
            options={[
              { value: '1_shift', label: '1 shift (days only)' },
              { value: '2_shifts', label: '2 shifts (days/evenings)' },
              { value: '3_shifts', label: '3 shifts (24/7 continuous)' },
              { value: '12hr_rotating', label: '12-hour rotating shifts' },
              { value: 'other', label: 'Other / varies' },
            ]}
          />
        </div>
      );

      case 2: return (
        <div data-testid="intake-section-2">
          <h2 className="text-xl font-bold text-white mb-1">Operation &amp; Current State</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>What you do, and where things stand.</p>

          <div className="mb-4">
            <label className="block text-sm mb-1.5" style={{ color: C.sec }}>Industry / type of work</label>
            <select value={f.industry} onChange={e => set('industry', e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none appearance-none"
              style={{ background: C.deep, border: `1px solid ${C.border}` }}>
              <option value="">Select...</option>
              <option value="machine_shop">Machine shop / metal fabrication</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="construction">Construction / field service</option>
              <option value="warehouse">Warehouse / distribution</option>
              <option value="auto_truck">Auto / truck repair</option>
              <option value="other">Other</option>
            </select>
          </div>
          {f.industry === 'other' && <Input label="Describe your industry" value={f.industryOther} onChange={e => set('industryOther', e.target.value)} />}

          <Textarea label="Briefly describe what you do day-to-day" value={f.dayToDay} onChange={e => set('dayToDay', e.target.value)} placeholder="Example: CNC machining, welding, assembly, material handling." />

          <CheckboxGroup label="Which of these are in your operation?" columns={2} options={[
            'Forklifts or powered industrial trucks', 'Overhead cranes/hoists', 'Welding/cutting/hot work',
            'Machine tools (lathes, mills, presses, saws)',
            'Hydraulic die press', 'Pneumatic (air) die press',
            'Chemicals/paints/solvents', 'Confined spaces',
            'Working at heights (ladders, roofs, platforms)', 'None of the above',
          ]} values={f.operations} onChange={v => toggleArr('operations', v)} />

          <Textarea label="Top 1–2 things that could seriously hurt someone at your company" value={f.topHazards} onChange={e => set('topHazards', e.target.value)} />

          <RadioGroup label="Do you have a written safety program?" name="safetyProgram" value={f.safetyProgram}
            onChange={v => set('safetyProgram', v)}
            options={[{ value: 'current', label: 'Yes, current and used' }, { value: 'outdated', label: 'Yes, but outdated' }, { value: 'partial', label: 'We have bits and pieces' }, { value: 'no', label: 'No' }, { value: 'not_sure', label: 'Not sure' }]}
          />

          <MatrixGrid label="Existing documents" values={f.existingDocs} onChange={(k, v) => setNested('existingDocs', k, v)}
            rows={[
              { key: 'safety_manual', label: 'Written safety manual' },
              { key: 'hazcom_program', label: 'Written HazCom program' },
              { key: 'loto_procedures', label: 'Written LOTO procedures' },
              { key: 'forklift_training', label: 'Forklift training docs' },
              { key: 'new_hire_checklist', label: 'New-hire safety orientation' },
              { key: 'toolbox_talks', label: 'Toolbox talk / training records' },
              { key: 'osha_logs', label: 'OSHA 300/300A logs' },
            ]}
          />

          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: C.sec }}>Upload existing safety documents <span style={{ color: C.muted }}>(optional)</span></label>
            <div className="rounded-lg p-6 text-center cursor-pointer transition-all hover:border-white/20"
              style={{ background: C.deep, border: `2px dashed ${C.border}` }}
              onClick={() => document.getElementById('file-input').click()}
              data-testid="intake-file-upload"
            >
              <Upload size={24} className="mx-auto mb-2" style={{ color: C.muted }} />
              <p className="text-sm" style={{ color: C.sec }}>Click to upload PDF, Word, or Excel</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Up to 10MB each &middot; Max 5 files</p>
              <input id="file-input" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={handleFileSelect} />
            </div>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2 rounded-lg" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
                    <span className="text-sm text-white truncate">{file.name}</span>
                    <button onClick={() => removeFile(i)} className="ml-2 text-white/30 hover:text-red-400 transition-colors"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );

      case 3: return (
        <div data-testid="intake-section-3">
          <h2 className="text-xl font-bold text-white mb-1">What You Need &amp; When</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>How Vince can help and what timing looks like.</p>

          <CheckboxGroup label="What do you want help with?" options={[
            'Safety Walkthrough — on-site visit and Top 10 Fixes report',
            'Documentation Review — review of written programs and records',
            'Incident Review — post-injury or near-miss response',
            'Get ready for an OSHA visit (compliance audit)',
            'Ongoing support / retainer option',
            'Other (please describe)',
          ]} values={f.helpNeeded} onChange={v => toggleArr('helpNeeded', v)} />
          {f.helpNeeded.includes('Other (please describe)') && <Input label="Describe" value={f.helpOther} onChange={e => set('helpOther', e.target.value)} />}

          <RadioGroup label="How urgent is this?" name="urgency" value={f.urgency}
            onChange={v => set('urgency', v)}
            options={[
              { value: 'asap', label: "We've had an incident/inspection — need help ASAP" },
              { value: '30_days', label: 'Want this done in the next 30 days' },
              { value: '60_90', label: 'Within 60–90 days is fine' },
              { value: 'info', label: 'Just gathering information' },
            ]}
          />

          <CheckboxGroup label="Preferred days for on-site visit" columns={2}
            options={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Remote (no on-site visit required)']}
            values={f.preferredDays} onChange={v => toggleArr('preferredDays', v)}
          />

          <RadioGroup label="Best time window" name="preferredTime" value={f.preferredTime}
            onChange={v => set('preferredTime', v)}
            options={[
              { value: 'early_morning', label: 'Early morning' },
              { value: 'late_morning', label: 'Late morning' },
              { value: 'early_afternoon', label: 'Early afternoon' },
              { value: 'late_afternoon', label: 'Late afternoon' },
              { value: 'na', label: 'N/A (no preference / remote engagement)' },
            ]}
          />

          <div className="h-px my-6" style={{ background: C.border }} />

          <RadioGroup label="How did you hear about GigLine?" name="referralSource" value={f.referralSource}
            onChange={v => set('referralSource', v)}
            options={[
              { value: 'referral', label: 'Referral' },
              { value: 'web', label: 'Web search' },
              { value: 'social', label: 'Social media' },
              { value: 'employer', label: 'Previous employer' },
              { value: 'other', label: 'Other' },
            ]}
          />

          <label className="flex items-start gap-3 mt-6 cursor-pointer" data-testid="intake-consent">
            <div className="mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all"
              style={{ borderColor: f.consentGiven ? C.gold : 'rgba(255,255,255,0.2)', background: f.consentGiven ? C.gold : 'transparent' }}
              onClick={() => set('consentGiven', !f.consentGiven)}>
              {f.consentGiven && <Check size={12} color="#111" />}
            </div>
            <span className="text-sm" style={{ color: C.sec }}>
              I understand this form is for an initial safety consultation and does not create a client relationship until we both sign a written agreement.
            </span>
          </label>

          <div className="rounded-lg p-5 mt-6" style={{ background: 'rgba(31,111,235,0.06)', border: '1px solid rgba(31,111,235,0.15)' }}>
            <p className="text-sm" style={{ color: C.sec }}>
              After you submit, Vince will review your information and follow up within <strong className="text-white">1 business day</strong> with a proposed scope and price.
            </p>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <SEO title="Client Safety Intake | GigLine Safety & Compliance" description="Complete the GigLine safety intake form to start your engagement." canonical="/intake" />

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50" style={{ background: C.deep, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" data-testid="intake-logo">
            <img
              src="/gigline-logo-full-horizontal-white.svg"
              alt="GigLine Safety & Compliance"
              className="h-10 md:h-12 w-auto"
            />
            <div className="hidden sm:block" style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: '12px' }}>
              <span className="text-xs block" style={{ color: C.muted }}>Client Safety Intake</span>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-3 text-right">
            <span className="text-xs font-medium" style={{ color: C.gold }}>{SECTIONS.find(s => s.id === section)?.label}</span>
            <span className="text-xs" style={{ color: C.muted }}>Secure portal</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full" style={{ height: '3px', background: C.border }}>
          <div style={{ width: `${progress}%`, height: '3px', background: C.gold, transition: 'width 0.4s ease' }} />
        </div>
      </nav>

      {/* ── Layout: sidebar + main ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Sidebar */}
        <div className="md:w-44 flex-shrink-0">
          <div className="md:sticky md:top-24 space-y-1">
            {SECTIONS.map(s => {
              const isActive = s.id === section;
              const isDone = completed.has(s.id);
              const isLocked = s.id > section && !isDone;
              return (
                <button key={s.id}
                  onClick={() => { if (isDone || isActive) setSection(s.id); }}
                  disabled={isLocked}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
                  style={{
                    background: isActive ? C.gold : 'transparent',
                    opacity: isLocked ? 0.22 : 1,
                    cursor: isLocked ? 'default' : 'pointer',
                  }}
                  data-testid={`intake-sidebar-${s.id}`}
                >
                  {isDone && !isActive ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(31,111,235,0.2)' }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: C.gold }} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: isActive ? '#111' : 'rgba(255,255,255,0.06)', color: isActive ? C.gold : C.muted }}>
                      {s.id}
                    </div>
                  )}
                  <span className="text-sm font-medium" style={{ color: isActive ? '#111' : C.muted }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main card */}
        <div className="flex-grow max-w-[740px]">
          <div className="rounded-xl p-6 md:p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            {renderSection()}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
              {section > 1 ? (
                <button onClick={goBack} className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                  style={{ color: C.sec, border: `1px solid ${C.border}` }}>
                  Back
                </button>
              ) : <div />}

              {section < SECTIONS.length ? (
                <button onClick={goNext} className="text-sm font-bold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 hover:brightness-110"
                  style={{ background: C.gold, color: '#111' }}
                  data-testid="intake-next-btn"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={handleSubmit}
                  disabled={!f.consentGiven || submitting}
                  className="text-sm font-bold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-40"
                  style={{ background: C.gold, color: '#111' }}
                  data-testid="intake-submit-btn"
                >
                  {submitting ? 'Submitting...' : 'Submit Intake Form'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientIntakePage;
