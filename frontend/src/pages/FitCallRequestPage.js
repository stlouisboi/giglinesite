import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;
const mono = { fontFamily: "'JetBrains Mono', monospace" };
const BLUE = '#2A52A0';
const NAVY = '#102A43';
const GOLD = '#C9A84C';
const CREAM = '#f5f4f0';

const BOUNDARY_LANGUAGE =
  'GigLine provides documentation, system-design, and implementation support based on client-supplied and observed information. The employer remains responsible for workplace conditions, employee training, hazard correction, program implementation, regulatory compliance, and maintaining accurate and current records. GigLine services are not OSHA approval and do not guarantee that citations will not occur.';

/* Vocabularies mirrored to the backend FitCallRequest model. */
const EMPLOYEE_BUCKETS = [
  { v: 'under_25', l: 'Under 25' },
  { v: '25_50', l: '25 to 50' },
  { v: '51_100', l: '51 to 100' },
  { v: '101_250', l: '101 to 250' },
  { v: '250_plus', l: '250+' },
];
const FACILITY_BUCKETS = [
  { v: '1', l: '1 location' },
  { v: '2_3', l: '2 to 3 locations' },
  { v: '4_plus', l: '4+ locations' },
];
const STORAGE_PLATFORMS = [
  { v: 'google_drive', l: 'Google Drive / Workspace' },
  { v: 'sharepoint', l: 'SharePoint / Microsoft 365' },
  { v: 'onedrive', l: 'OneDrive' },
  { v: 'dropbox', l: 'Dropbox' },
  { v: 'other', l: 'Other cloud platform' },
  { v: 'none', l: 'No digital platform yet' },
];
const PROGRAM_OPTIONS = [
  { v: 'loto', l: 'Lockout / Tagout' },
  { v: 'hazcom', l: 'HazCom' },
  { v: 'ppe', l: 'PPE' },
  { v: 'emergency', l: 'Emergency Action Plan' },
  { v: 'confined_space', l: 'Confined Space' },
  { v: 'respiratory', l: 'Respiratory Protection' },
  { v: 'other', l: 'Other written program' },
  { v: 'none', l: 'None yet' },
];
const SDS_BUCKETS = [
  { v: 'under_25', l: 'Under 25' },
  { v: '25_100', l: '25 to 100' },
  { v: '100_500', l: '100 to 500' },
  { v: '500_plus', l: '500+' },
  { v: 'not_sure', l: 'Not sure' },
];
const ONSITE_OPTIONS = [
  { v: 'yes', l: 'Yes, an on-site review is needed' },
  { v: 'no', l: 'No, remote work is fine' },
  { v: 'not_sure', l: 'Not sure yet' },
];

const REQUIRED = ['contactName', 'email', 'companyName', 'locationCityState', 'employeeCount', 'primaryProblem'];

const emptyForm = {
  contactName: '',
  email: '',
  companyName: '',
  industry: '',
  locationCityState: '',
  employeeCount: '',
  facilityCount: '',
  storagePlatform: '',
  existingPrograms: [],
  sdsCount: '',
  primaryProblem: '',
  desiredCompletion: '',
  onsiteReviewNeeded: '',
  website: '', // honeypot
};

const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="block text-[13.5px] font-bold mb-2" style={{ color: NAVY }}>
    {children}{required && <span aria-hidden="true" style={{ color: '#c53030' }}> *</span>}
  </label>
);

const inputBase =
  'w-full px-4 py-3 rounded-lg text-[15px] bg-white transition-colors focus:outline-none';
const inputStyle = { border: '1.5px solid #d8d4c8', color: NAVY };
const inputFocus = (e) => (e.currentTarget.style.border = `1.5px solid ${BLUE}`);
const inputBlur = (e) => (e.currentTarget.style.border = '1.5px solid #d8d4c8');

const FitCallRequestPage = () => {
  const [form, setForm] = useState(emptyForm);
  const [state, setState] = useState({ submitting: false, error: null, success: false, id: null });
  const location = useLocation();

  const attribution = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });
    return Object.keys(utm).length ? utm : null;
  }, [location.search]);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleProgram = (v) => {
    setForm(prev => {
      const list = prev.existingPrograms || [];
      if (v === 'none') {
        // "None yet" is exclusive
        return { ...prev, existingPrograms: list.includes('none') ? [] : ['none'] };
      }
      const without_none = list.filter(x => x !== 'none');
      return {
        ...prev,
        existingPrograms: without_none.includes(v)
          ? without_none.filter(x => x !== v)
          : [...without_none, v],
      };
    });
  };

  const validate = () => {
    for (const key of REQUIRED) {
      const val = form[key];
      if (!val || (typeof val === 'string' && !val.trim())) {
        return `Please complete: ${key === 'locationCityState' ? 'Location (City, State)' : key === 'primaryProblem' ? 'Primary documentation problem' : key === 'companyName' ? 'Company name' : key === 'contactName' ? 'Contact name' : key === 'employeeCount' ? 'Employee count' : 'Email'}`;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address';
    if (form.primaryProblem.length > 1000) return 'Primary problem must be under 1000 characters';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (state.submitting || state.success) return;
    const err = validate();
    if (err) { setState(s => ({ ...s, error: err })); return; }
    setState({ submitting: true, error: null, success: false, id: null });
    try {
      const payload = { ...form, attribution };
      const res = await fetch(`${API}/api/fit-call-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || `Server error (${res.status})`);
      setState({ submitting: false, error: null, success: true, id: data.id || null });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setState({ submitting: false, error: err.message || 'Something went wrong. Please try again or call (336) 329-8899.', success: false, id: null });
    }
  };

  const SEOBlock = (
    <SEO
      title="Request a Fit Call, Safety Control System Buildout | GigLine"
      description="Short qualifying questions to determine whether the Safety Control System Buildout is the right fit for your operation. Vince responds within one business day."
      canonical="/services/safety-control-system-buildout/request"
      noindex={true}
    />
  );

  if (state.success) {
    return (
      <main data-testid="fit-call-request-page">
        {SEOBlock}
        <section className="pt-24 pb-20" style={{ background: NAVY }} data-testid="fit-call-success">
          <div className="container max-w-2xl text-center">
            <div className="inline-flex items-center justify-center mb-6 rounded-full" style={{ width: 64, height: 64, background: 'rgba(201,168,76,0.15)' }}>
              <CheckCircle2 size={32} style={{ color: GOLD }} strokeWidth={2} />
            </div>
            <p className="uppercase font-bold mb-4" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}>
              Request Received
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 text-white">
              Thanks. Vince will reach out within one business day.
            </h1>
            <p className="text-white/75 text-[15.5px] leading-[1.8] mb-8">
              You will also receive a confirmation email at <span className="font-bold text-white">{form.email}</span> shortly. The Fit Call is a short conversation that determines whether the Control System is the right shape for your operation, and what the fixed scope and price look like once the work is defined.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/services/safety-control-system-buildout" className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors" style={{ background: GOLD, color: NAVY }} data-testid="fit-call-success-back-service">
                <ArrowLeft size={16} /> Back to the Control System page
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] border border-white/40 text-white/85 hover:text-white hover:border-white transition-colors" data-testid="fit-call-success-home">
                Home
              </Link>
            </div>
            <p className="text-[12.5px] text-white/50 leading-[1.7] mt-10 border-t border-white/10 pt-6 max-w-xl mx-auto">
              {BOUNDARY_LANGUAGE}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main data-testid="fit-call-request-page">
      {SEOBlock}
      <section className="pt-20 md:pt-24 pb-8" style={{ background: NAVY }}>
        <div className="container max-w-3xl">
          <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}>Fit Call Request</p>
          <h1 className="text-3xl md:text-4xl lg:text-[46px] font-extrabold leading-[1.1] mb-6 tracking-tight text-white">
            Tell us about the operation.
          </h1>
          <p className="text-base text-white/75 leading-[1.8] mb-2">
            A short set of questions so Vince can prepare for the Fit Call. Fifteen to twenty minutes on the phone determines fit, scope, and fixed price. No obligation.
          </p>
          <Link to="/services/safety-control-system-buildout" className="inline-flex items-center gap-1.5 mt-4 text-[13.5px] text-white/60 hover:text-white transition-colors" data-testid="fit-call-back-link">
            <ArrowLeft size={14} /> Back to the service page
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ background: CREAM }} data-testid="fit-call-form-section">
        <form onSubmit={onSubmit} className="container max-w-3xl" noValidate>
          {/* Honeypot: real users never see this. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
            <label htmlFor="website">Website</label>
            <input
              id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
              value={form.website} onChange={(e) => update('website', e.target.value)}
            />
          </div>

          {/* Contact */}
          <fieldset className="mb-8">
            <legend className="text-lg font-extrabold mb-4" style={{ color: NAVY }}>Contact</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fc-contactName" required>Contact name</Label>
                <input id="fc-contactName" type="text" autoComplete="name" required
                  className={inputBase} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                  value={form.contactName} onChange={(e) => update('contactName', e.target.value)}
                  data-testid="fc-contactName" />
              </div>
              <div>
                <Label htmlFor="fc-email" required>Email</Label>
                <input id="fc-email" type="email" autoComplete="email" required
                  className={inputBase} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                  value={form.email} onChange={(e) => update('email', e.target.value)}
                  data-testid="fc-email" />
              </div>
            </div>
          </fieldset>

          {/* Company */}
          <fieldset className="mb-8">
            <legend className="text-lg font-extrabold mb-4" style={{ color: NAVY }}>Company</legend>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="fc-companyName" required>Company name</Label>
                <input id="fc-companyName" type="text" autoComplete="organization" required
                  className={inputBase} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                  value={form.companyName} onChange={(e) => update('companyName', e.target.value)}
                  data-testid="fc-companyName" />
              </div>
              <div>
                <Label htmlFor="fc-industry">Industry</Label>
                <input id="fc-industry" type="text" placeholder="Metals fabrication, warehousing, contractor..."
                  className={inputBase} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                  value={form.industry} onChange={(e) => update('industry', e.target.value)}
                  data-testid="fc-industry" />
              </div>
              <div>
                <Label htmlFor="fc-location" required>Location (city, state)</Label>
                <input id="fc-location" type="text" placeholder="Kernersville, NC" required
                  className={inputBase} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                  value={form.locationCityState} onChange={(e) => update('locationCityState', e.target.value)}
                  data-testid="fc-location" />
              </div>
            </div>
          </fieldset>

          {/* Scale */}
          <fieldset className="mb-8">
            <legend className="text-lg font-extrabold mb-4" style={{ color: NAVY }}>Scale</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fc-employeeCount" required>Number of employees</Label>
                <select id="fc-employeeCount" required className={inputBase} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                  value={form.employeeCount} onChange={(e) => update('employeeCount', e.target.value)}
                  data-testid="fc-employeeCount">
                  <option value="">Select,</option>
                  {EMPLOYEE_BUCKETS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="fc-facilityCount">Number of facilities</Label>
                <select id="fc-facilityCount" className={inputBase} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                  value={form.facilityCount} onChange={(e) => update('facilityCount', e.target.value)}
                  data-testid="fc-facilityCount">
                  <option value="">Select,</option>
                  {FACILITY_BUCKETS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Current systems */}
          <fieldset className="mb-8">
            <legend className="text-lg font-extrabold mb-4" style={{ color: NAVY }}>Current systems</legend>
            <div className="mb-4">
              <Label htmlFor="fc-storagePlatform">Current storage platform</Label>
              <select id="fc-storagePlatform" className={inputBase} style={inputStyle}
                onFocus={inputFocus} onBlur={inputBlur}
                value={form.storagePlatform} onChange={(e) => update('storagePlatform', e.target.value)}
                data-testid="fc-storagePlatform">
                <option value="">Select,</option>
                {STORAGE_PLATFORMS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <p className="text-[13.5px] font-bold mb-2" style={{ color: NAVY }}>Existing written programs (check all that apply)</p>
              <div role="group" aria-labelledby="fc-programs-group" className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-testid="fc-existingPrograms">
                {PROGRAM_OPTIONS.map(o => {
                  const checked = form.existingPrograms.includes(o.v);
                  return (
                    <label key={o.v} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-[14px] transition-colors"
                      style={{ background: checked ? 'rgba(42,82,160,0.08)' : '#fff', border: `1.5px solid ${checked ? BLUE : '#d8d4c8'}`, color: NAVY }}>
                      <input type="checkbox" checked={checked} onChange={() => toggleProgram(o.v)}
                        className="w-4 h-4" style={{ accentColor: BLUE }} data-testid={`fc-program-${o.v}`} />
                      <span>{o.l}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="fc-sdsCount">Approximate number of chemicals / SDSs</Label>
              <select id="fc-sdsCount" className={inputBase} style={inputStyle}
                onFocus={inputFocus} onBlur={inputBlur}
                value={form.sdsCount} onChange={(e) => update('sdsCount', e.target.value)}
                data-testid="fc-sdsCount">
                <option value="">Select,</option>
                {SDS_BUCKETS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          </fieldset>

          {/* Problem + timing */}
          <fieldset className="mb-8">
            <legend className="text-lg font-extrabold mb-4" style={{ color: NAVY }}>Problem and timing</legend>
            <div className="mb-4">
              <Label htmlFor="fc-primaryProblem" required>Primary documentation problem</Label>
              <textarea id="fc-primaryProblem" rows={5} required maxLength={1000}
                placeholder="What is not working today? Where does the current setup break down?"
                className={inputBase} style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                onFocus={inputFocus} onBlur={inputBlur}
                value={form.primaryProblem} onChange={(e) => update('primaryProblem', e.target.value)}
                data-testid="fc-primaryProblem" />
              <p className="text-[11.5px] text-[#1C2B2B]/55 mt-1" aria-live="polite">
                {form.primaryProblem.length}/1000
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fc-desiredCompletion">Desired completion date</Label>
                <input id="fc-desiredCompletion" type="text" placeholder="March 2026, or flexible"
                  className={inputBase} style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}
                  value={form.desiredCompletion} onChange={(e) => update('desiredCompletion', e.target.value)}
                  data-testid="fc-desiredCompletion" />
              </div>
              <div>
                <Label htmlFor="fc-onsiteReviewNeeded">On-site review needed?</Label>
                <select id="fc-onsiteReviewNeeded" className={inputBase} style={inputStyle}
                  onFocus={inputFocus} onBlur={inputBlur}
                  value={form.onsiteReviewNeeded} onChange={(e) => update('onsiteReviewNeeded', e.target.value)}
                  data-testid="fc-onsiteReviewNeeded">
                  <option value="">Select,</option>
                  {ONSITE_OPTIONS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Error state */}
          {state.error && (
            <div className="mb-6 rounded-lg p-4 flex items-start gap-3" role="alert" data-testid="fc-error"
              style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#991b1b' }}>
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div className="text-[13.5px] leading-[1.6]">{state.error}</div>
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <button type="submit" disabled={state.submitting}
              className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ background: state.submitting ? '#8a7333' : GOLD, color: NAVY, cursor: state.submitting ? 'wait' : 'pointer' }}
              onMouseEnter={(e) => { if (!state.submitting) e.currentTarget.style.background = '#c8922a'; }}
              onMouseLeave={(e) => { if (!state.submitting) e.currentTarget.style.background = GOLD; }}
              data-testid="fc-submit">
              {state.submitting
                ? (<><Loader2 size={17} className="animate-spin" /> Submitting,</>)
                : (<>Request the Fit Call <ArrowRight size={17} /></>)}
            </button>
            <p className="text-[12.5px] text-[#1C2B2B]/60 leading-[1.6]">
              Vince responds within one business day. No obligation.
            </p>
          </div>

          {/* Acknowledgment / boundary */}
          <p className="text-[12px] text-[#1C2B2B]/55 leading-[1.75] border-t border-[#e5dfd0] pt-6" data-testid="fc-boundary">
            <span className="font-bold" style={{ color: NAVY }}>Acknowledgment.</span>{' '}
            {BOUNDARY_LANGUAGE}
          </p>
        </form>
      </section>
    </main>
  );
};

export default FitCallRequestPage;
