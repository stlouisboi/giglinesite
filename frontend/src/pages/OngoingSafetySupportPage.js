import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  Clock,
  Lock,
  CalendarClock,
  ClipboardCheck,
  Users,
  FileBarChart2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import SEO from '../components/SEO';
import { trackEvent, trackServiceBooking } from '../utils/analytics';

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const GOLD = '#C9A84C';
const NAVY = '#102A43';
const BLUE = '#2A52A0';
const CREAM = '#f5f4f0';
const RED = '#dc2626';

const API = process.env.REACT_APP_BACKEND_URL;

// ── Copy content, v2.1 (all wording verbatim from the approved spec) ───
const PROBLEM_POINTS = [
  'Inspection findings stay open',
  'Training records go missing',
  'Written programs stop matching the operation',
  'The same hazards return',
  'Nobody can show what was corrected',
  'Management finds out too late that the system was not being maintained',
];

const WHAT_INCLUDED = [
  'One scheduled on-site visit each month, up to 2.5 hours on-site',
  'Monthly facility safety walkthrough',
  'Corrective-action tracker review and updates',
  'Review of selected training, inspection, and program records',
  'One toolbox talk or short safety-meeting resource',
  'Monthly management review',
  'Concise leadership summary showing what changed, what closed, and what needs a decision',
  'Up to 45 minutes per month of non-emergency remote support by email or scheduled phone/video consultation. Limited incident next-step guidance, when provided, uses this same allowance and excludes investigation, on-site response, regulator contact, and after-hours availability.',
];

const HOW_IT_WORKS = [
  {
    title: 'Find the gaps',
    body: 'Every recurring engagement begins with a GigLine Compliance Readiness Visit or approved onboarding assessment. We review the floor and the files so the monthly scope is based on actual conditions.',
  },
  {
    title: 'Set the priorities',
    body: 'We identify the first 90 days of work, assign owners, establish target dates, and separate ongoing support from larger corrective-action projects.',
  },
  {
    title: 'Keep the work moving',
    body: 'Each month, GigLine reviews conditions, updates open actions, supports the agreed safety priorities, and shows management what requires attention.',
  },
  {
    title: 'Verify and report',
    body: 'Completed actions are verified when included in scope. Management receives a clear record of progress, overdue risks, and next decisions.',
  },
];

const BEST_FIT = [
  'Small manufacturers and fabrication shops',
  'Warehouses and distribution operations',
  'Contractors and maintenance operations',
  'Fleet and transportation operations',
  'Generally 10 to 50 employees at one primary location',
  'Leadership teams willing to assign, fund, and complete corrective actions',
];

const FAQS = [
  {
    q: 'Is this the same as hiring a full-time safety manager?',
    a: 'No. It provides defined, recurring professional support at a lower commitment than a full-time employee. The client continues to manage daily operations, supervise employees, approve spending, and complete corrective actions.',
  },
  {
    q: 'Why is an initial Compliance Readiness Visit required?',
    a: 'GigLine should not agree to support a program it has not evaluated. The initial visit establishes the condition of the floor, documents, and open risks so the recurring scope and price are responsible.',
  },
  {
    q: 'Is every company under 50 employees charged $1,650?',
    a: 'No. That is the starting price. Hazard level, locations, shifts, incident history, program condition, travel, and requested access affect the final scope.',
  },
  {
    q: 'Does the monthly fee include every safety project?',
    a: 'No. The agreement defines the monthly capacity and deliverables. Large corrective-action projects, full investigations, new written programs, specialized training, engineering, industrial hygiene, equipment, and other out-of-scope work are quoted separately.',
  },
  {
    q: 'What does corrective-action tracking include?',
    a: 'GigLine records the agreed status, client owner, target date, evidence, and verification status of tracked findings. The monthly service does not include performing physical corrections, directing client labor, purchasing controls, engineering solutions, or completing corrective-action projects unless separately authorized.',
  },
  {
    q: 'What happens when the monthly capacity is used?',
    a: 'GigLine will identify the remaining work and either move an agreed priority to the next service period, reduce another included activity, or issue a separate written scope. Additional work does not begin without authorization.',
  },
  {
    q: 'Will GigLine come on-site after an incident or represent us during an OSHA inspection?',
    a: 'Not under the standard monthly service. The base plan provides limited, non-emergency next-step guidance within the monthly remote-support allowance. On-site incident response, investigation, regulator contact, final recordability or reportability determinations, and OSHA inspection assistance require a separate written scope and may require legal or other specialized support.',
  },
  {
    q: 'Can GigLine guarantee OSHA compliance?',
    a: 'No responsible consultant can guarantee that every hazard will be identified, that every incident will be prevented, or that an employer will never receive a citation. GigLine helps identify gaps, organize action, verify agreed corrections, and improve the evidence behind the client\u2019s safety program.',
  },
  {
    q: 'Can you review safety material created with AI?',
    a: 'Yes, as a separately scoped service or an explicitly selected monthly review priority. AI-generated programs and procedures are treated as drafts until their regulatory applicability, facility details, training requirements, and field implementation are evaluated.',
  },
  {
    q: 'How long is the commitment?',
    a: 'The proposed structure begins with a 90-day initial term so there is enough time to establish a working rhythm and measure progress. Final terms appear in the client agreement.',
  },
];

// ── Small UI helpers ───────────────────────────────────────────────────
const Eyebrow = ({ children, color = BLUE, className = '' }) => (
  <p
    className={`uppercase font-bold mb-3 ${className}`}
    style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color }}
  >
    {children}
  </p>
);

// ── Qualification form ────────────────────────────────────────────────
const initialForm = {
  company: '',
  contactName: '',
  email: '',
  phone: '',
  location: '',
  industry: '',
  employeeCount: '',
  shifts: '',
  locationsCount: '',
  majorOperations: '',
  recentIncidents: '',
  currentSafetyOwner: '',
  supportNeeded: '',
  preferredContactMethod: 'phone',
  consentContact: false,
  consentPrivacy: false,
  website: '', // honeypot
};

function FitCallForm() {
  const [data, setData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // null | { ok, message }
  const [errors, setErrors] = useState({});
  const startedAt = useRef(new Date().toISOString());
  const startFired = useRef(false);

  const setField = (name) => (e) => {
    const val = e && e.target && e.target.type === 'checkbox' ? e.target.checked : (e && e.target ? e.target.value : e);
    setData((d) => ({ ...d, [name]: val }));
    if (!startFired.current) {
      startFired.current = true;
      trackEvent('ongoing_support_form_start', { page_path: '/ongoing-safety-support' });
    }
  };

  const validate = () => {
    const e = {};
    if (!data.company.trim()) e.company = 'Company is required.';
    if (!data.contactName.trim()) e.contactName = 'Your name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'A valid email is required.';
    if ((data.phone.match(/\d/g) || []).length < 7) e.phone = 'A valid phone is required.';
    if (!data.location.trim()) e.location = 'City, State is required.';
    if (!data.industry.trim()) e.industry = 'Industry is required.';
    if (!data.employeeCount) e.employeeCount = 'Employee count is required.';
    if (!data.shifts) e.shifts = 'Number of shifts is required.';
    if (!data.locationsCount) e.locationsCount = 'Number of locations is required.';
    if (!data.supportNeeded.trim() || data.supportNeeded.trim().length < 5) e.supportNeeded = 'A brief description of the support you need is required.';
    if (!data.consentContact) e.consentContact = 'Contact acknowledgment is required.';
    if (!data.consentPrivacy) e.consentPrivacy = 'Privacy acknowledgment is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (submitting) return;
    if (!validate()) {
      setResult({ ok: false, message: 'Please correct the highlighted fields.' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const resp = await fetch(`${API}/api/ongoing-support/fit-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, formStartedAt: startedAt.current }),
      });
      const body = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = body && body.detail ? String(body.detail) : 'Something went wrong. Please try again or call (336) 329-8899.';
        setResult({ ok: false, message: msg });
        trackEvent('ongoing_support_form_error', { status: resp.status });
      } else {
        setResult({
          ok: true,
          message: 'Thanks. Vince will review your submission and follow up within 1 business day. This request does not create a consulting relationship.',
        });
        trackEvent('ongoing_support_form_success', { page_path: '/ongoing-safety-support' });
        trackServiceBooking && trackServiceBooking('Ongoing Safety Support Fit Call');
        setData(initialForm);
      }
    } catch (err) {
      setResult({ ok: false, message: 'Network error. Please try again or call (336) 329-8899.' });
      trackEvent('ongoing_support_form_error', { status: 'network' });
    } finally {
      setSubmitting(false);
    }
  };

  const input = (name, label, opts = {}) => {
    const { type = 'text', required = true, placeholder = '', textarea = false, autoComplete } = opts;
    const err = errors[name];
    const common = {
      id: `fit-${name}`,
      name,
      value: data[name],
      onChange: setField(name),
      placeholder,
      autoComplete,
      required,
      'aria-invalid': err ? 'true' : 'false',
      'aria-describedby': err ? `fit-${name}-err` : undefined,
      'data-testid': `fit-input-${name}`,
      className: `w-full px-3.5 py-2.5 rounded-md text-[14.5px] bg-white transition-colors ${err ? 'border-red-500' : ''}`,
      style: {
        border: err ? '1px solid #dc2626' : '1px solid #cfd6df',
        color: '#1C2B2B',
        outlineColor: BLUE,
      },
    };
    return (
      <div>
        <label htmlFor={`fit-${name}`} className="block text-[13px] font-bold mb-1.5" style={{ color: NAVY }}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
        {textarea ? <textarea rows={3} {...common} /> : <input type={type} {...common} />}
        {err && (
          <p id={`fit-${name}-err`} className="text-[12px] mt-1" style={{ color: '#b91c1c' }} data-testid={`fit-err-${name}`}>
            {err}
          </p>
        )}
      </div>
    );
  };

  const select = (name, label, options) => {
    const err = errors[name];
    return (
      <div>
        <label htmlFor={`fit-${name}`} className="block text-[13px] font-bold mb-1.5" style={{ color: NAVY }}>
          {label} <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <select
          id={`fit-${name}`}
          name={name}
          value={data[name]}
          onChange={setField(name)}
          required
          data-testid={`fit-input-${name}`}
          className="w-full px-3.5 py-2.5 rounded-md text-[14.5px] bg-white"
          style={{
            border: err ? '1px solid #dc2626' : '1px solid #cfd6df',
            color: data[name] ? '#1C2B2B' : '#8896a5',
            outlineColor: BLUE,
          }}
        >
          <option value="" disabled>Choose one</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {err && <p className="text-[12px] mt-1" style={{ color: '#b91c1c' }}>{err}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate data-testid="fit-call-form" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Honeypot, hidden from real users */}
      <div style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="fit-website">Website (leave blank)</label>
        <input id="fit-website" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={setField('website')} />
      </div>

      {input('company', 'Company', { autoComplete: 'organization' })}
      {input('contactName', 'Your name', { autoComplete: 'name' })}
      {input('email', 'Email', { type: 'email', autoComplete: 'email' })}
      {input('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
      {input('location', 'Facility city, state', { placeholder: 'e.g., Kernersville, NC', autoComplete: 'address-level2' })}
      {input('industry', 'Industry', { placeholder: 'e.g., metals fabrication, food warehouse' })}
      {select('employeeCount', 'Employee count', [
        { value: 'under_10', label: 'Under 10' },
        { value: '10_25', label: '10 to 25' },
        { value: '26_50', label: '26 to 50' },
        { value: '51_100', label: '51 to 100' },
        { value: '100_plus', label: '100+' },
      ])}
      {select('shifts', 'Number of shifts', [
        { value: '1', label: '1 shift' },
        { value: '2', label: '2 shifts' },
        { value: '3', label: '3 shifts' },
        { value: '12hr', label: '12-hour rotations' },
        { value: 'other', label: 'Other / seasonal' },
      ])}
      {select('locationsCount', 'Number of locations', [
        { value: '1', label: '1 location' },
        { value: '2-3', label: '2 to 3' },
        { value: '4+', label: '4 or more' },
      ])}
      <div className="md:col-span-2">
        {input('majorOperations', 'Major operations or equipment', {
          textarea: true,
          required: false,
          placeholder: 'e.g., press brakes, MIG welding, 3 forklifts, HazCom for solvents and paints',
        })}
      </div>
      <div className="md:col-span-2">
        {input('recentIncidents', 'Recent incidents, citations, or customer / insurance audits', {
          textarea: true,
          required: false,
          placeholder: 'Optional. Anything relevant in the last 12 months.',
        })}
      </div>
      {input('currentSafetyOwner', 'Current person responsible for safety', {
        required: false,
        placeholder: 'e.g., Plant manager, HR, owner, no one specific',
      })}
      {select('preferredContactMethod', 'Preferred contact method', [
        { value: 'phone', label: 'Phone call' },
        { value: 'text', label: 'Text message' },
        { value: 'email', label: 'Email' },
      ])}
      <div className="md:col-span-2">
        {input('supportNeeded', 'Support needed', {
          textarea: true,
          placeholder: 'What would monthly support cover? What is the biggest pain point right now?',
        })}
      </div>

      {/* Consents */}
      <div className="md:col-span-2 space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer" data-testid="fit-consent-contact-wrap">
          <input
            type="checkbox"
            checked={data.consentContact}
            onChange={setField('consentContact')}
            className="mt-0.5 h-4 w-4 flex-shrink-0"
            data-testid="fit-input-consentContact"
          />
          <span className="text-[13.5px] leading-[1.65] text-[#1C2B2B]">
            I consent to GigLine contacting me using the information provided to schedule a fit call.
          </span>
        </label>
        {errors.consentContact && <p className="text-[12px]" style={{ color: '#b91c1c' }}>{errors.consentContact}</p>}
        <label className="flex items-start gap-3 cursor-pointer" data-testid="fit-consent-privacy-wrap">
          <input
            type="checkbox"
            checked={data.consentPrivacy}
            onChange={setField('consentPrivacy')}
            className="mt-0.5 h-4 w-4 flex-shrink-0"
            data-testid="fit-input-consentPrivacy"
          />
          <span className="text-[13.5px] leading-[1.65] text-[#1C2B2B]">
            I have reviewed the <Link to="/privacy-policy" className="underline font-semibold" style={{ color: BLUE }}>Privacy Policy</Link> and understand this request does not create a consulting relationship.
          </span>
        </label>
        {errors.consentPrivacy && <p className="text-[12px]" style={{ color: '#b91c1c' }}>{errors.consentPrivacy}</p>}
      </div>

      {/* Submit */}
      <div className="md:col-span-2 flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: NAVY, color: '#ffffff' }}
          onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#1c2e44'; }}
          onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = NAVY; }}
          data-testid="fit-submit"
        >
          {submitting ? 'Sending...' : 'Request a Fit Call'}
          {!submitting && <ArrowRight size={16} />}
        </button>
        <p className="text-[12.5px] italic text-[#1C2B2B]/60">Response within 1 business day.</p>
      </div>

      {/* Result banner (announced to screen readers) */}
      {result && (
        <div
          className="md:col-span-2 rounded-lg p-4 text-[14px] leading-[1.65]"
          role="status"
          aria-live="polite"
          style={
            result.ok
              ? { background: '#EEF7F1', border: '1px solid #34a06355', color: '#166534' }
              : { background: '#FEF2F2', border: '1px solid #dc262655', color: '#991B1B' }
          }
          data-testid={result.ok ? 'fit-form-success' : 'fit-form-error'}
        >
          {result.message}
        </div>
      )}
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
const OngoingSafetySupportPage = () => {
  const [scopeOpen, setScopeOpen] = useState(false);

  useEffect(() => {
    trackEvent('ongoing_support_page_view', { page_path: '/ongoing-safety-support' });
  }, []);

  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
    []
  );

  const serviceSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Ongoing Safety Support',
      provider: {
        '@type': 'LocalBusiness',
        name: 'GigLine Safety & Compliance',
        url: 'https://www.giglinecompliance.com',
        telephone: '+13363298899',
      },
      areaServed: { '@type': 'State', name: 'North Carolina' },
      offers: {
        '@type': 'Offer',
        price: '1650',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '1650',
          priceCurrency: 'USD',
          unitCode: 'MON',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
        description: 'Ongoing Safety Support, starting at $1,650 per month following an initial Compliance Readiness Visit.',
      },
      description:
        'Monthly safety support for small employers that need consistent follow-through but are not ready for a full-time safety manager. On-site visit, corrective-action tracking, records review, management reporting.',
    }),
    []
  );

  const breadcrumbSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.giglinecompliance.com/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.giglinecompliance.com/services' },
        { '@type': 'ListItem', position: 3, name: 'Ongoing Support', item: 'https://www.giglinecompliance.com/ongoing-safety-support' },
      ],
    }),
    []
  );

  const scrollToForm = () => {
    const el = document.getElementById('fit-call');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      trackEvent('ongoing_support_primary_cta_click', { location: 'hero' });
    }
  };

  return (
    <main data-testid="ongoing-safety-support-page">
      <SEO
        title="Ongoing Safety Support for Small Employers | GigLine"
        description="Keep inspections, corrective actions, training records, and safety documentation moving with ongoing support from GigLine. Serving small manufacturers, warehouses, contractors, and fleets in the Piedmont Triad. Plans start at $1,650 per month after an initial readiness assessment."
        canonical="/ongoing-safety-support"
        schema={[serviceSchema, faqSchema, breadcrumbSchema]}
      />

      {/* ═══ Hero ═══ */}
      <section className="pt-20 md:pt-24 pb-16 md:pb-20" style={{ background: NAVY }} data-testid="ongoing-hero">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <Eyebrow color={GOLD}>Ongoing Safety Support · MAINTAIN</Eyebrow>
              <h1 className="text-3xl md:text-4xl lg:text-[52px] font-extrabold leading-[1.08] mb-7 tracking-tight text-white max-w-4xl">
                <span className="block">Findings stay open.</span>
                <span className="block">Records go missing.</span>
                <span className="block italic" style={{ color: GOLD }}>The same hazards return.</span>
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-[1.85] mb-4 max-w-3xl">
                Ongoing safety support for small employers that need consistent follow-through but are not ready for a full-time safety manager.
              </p>
              <p className="text-base md:text-lg text-white/70 leading-[1.85] mb-8 max-w-3xl">
                GigLine helps keep inspections, corrective actions, selected safety records, and management follow-up moving month after month.
              </p>
              <p className="text-[15px] md:text-base text-white/90 font-semibold mb-9 max-w-3xl" style={mono}>
                Plans start at $1,650 per month following an initial Compliance Readiness Visit.
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
                  style={{ background: GOLD, color: NAVY }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#c8922a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
                  data-testid="ongoing-hero-primary-cta"
                >
                  Request a Fit Call
                  <ArrowRight size={17} />
                </button>
                <Link
                  to="/intake?service=compliance-readiness-visit"
                  onClick={() => trackEvent('ongoing_support_secondary_cta_click', { location: 'hero' })}
                  className="inline-flex items-center gap-2 font-bold px-5 py-3.5 rounded-lg text-[15px] transition-colors"
                  style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  data-testid="ongoing-hero-secondary-cta"
                >
                  Start With a Readiness Visit
                </Link>
              </div>

              <p className="mt-8 text-[13px] text-white/55 leading-[1.75]">
                Piedmont Triad-based · OSHA 30-Hour Certified · Manufacturing and operations experience · U.S. Navy veteran-owned
              </p>
            </div>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid rgba(201,168,76,0.30)', boxShadow: '0 20px 60px -20px rgba(0,0,0,0.55)' }}
              data-testid="ongoing-hero-image-wrap"
            >
              <img
                src="/ongoing-support-hero.jpg"
                alt="Plant manager reviewing an OSHA corrective-action tracker on a rugged tablet on a small manufacturing shop floor, with press brakes and orderly steel racking softly visible behind them, illustrating GigLine ongoing safety support."
                width="1600"
                height="900"
                loading="eager"
                fetchPriority="high"
                className="w-full h-auto block"
                data-testid="ongoing-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ The problem ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ongoing-problem">
        <div className="container max-w-5xl">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-6 tracking-tight max-w-4xl" style={{ color: NAVY }}>
            Safety usually gets handed to somebody who already has a full-time job.
          </h2>
          <p className="text-base md:text-lg text-[#1C2B2B]/75 leading-[1.85] mb-8 max-w-3xl">
            In a small operation, safety often lands on the owner, plant manager, HR manager, maintenance lead, or warehouse supervisor. They care about the work, but production, staffing, quality, customer demands, and daily fires keep pushing it down the list.
          </p>
          <p className="text-[15.5px] font-bold mb-4" style={{ color: NAVY }}>The result is familiar:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-8 max-w-4xl">
            {PROBLEM_POINTS.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-[#1C2B2B]/80 leading-[1.7]" data-testid={`ongoing-problem-${i + 1}`}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2.5" style={{ background: RED }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="text-base md:text-lg font-semibold leading-[1.75] max-w-3xl" style={{ color: NAVY }}>
            GigLine provides the structure and follow-up to keep that work visible.
          </p>
        </div>
      </section>

      {/* ═══ What the service does ═══ */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="ongoing-what">
        <div className="container max-w-5xl">
          <Eyebrow>What the service does</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-6 tracking-tight max-w-4xl" style={{ color: NAVY }}>
            A monthly safety rhythm your operation can actually maintain.
          </h2>
          <p className="text-base text-[#1C2B2B]/70 leading-[1.75] mb-10 max-w-3xl">The starting service includes:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {WHAT_INCLUDED.map((line, i) => (
              <li
                key={i}
                className={`rounded-xl p-5 md:p-6 flex gap-4 bg-white ${i === WHAT_INCLUDED.length - 1 ? 'md:col-span-2' : ''}`}
                style={{ border: '1px solid #e8e5dd' }}
                data-testid={`ongoing-included-${i + 1}`}
              >
                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" style={{ color: BLUE }} strokeWidth={2} />
                <span className="text-[14.5px] leading-[1.75] text-[#1C2B2B]/85">{line}</span>
              </li>
            ))}
          </ul>
          <p className="text-[14.5px] italic text-[#1C2B2B]/65 mt-8 max-w-3xl leading-[1.75]">
            Each engagement is scoped around the facility&apos;s hazards, shifts, locations, current program condition, and management needs.
          </p>
        </div>
      </section>

      {/* ═══ How it works ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ongoing-how">
        <div className="container max-w-5xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-10 tracking-tight max-w-4xl" style={{ color: NAVY }}>
            Four steps. A monthly rhythm.
          </h2>
          <ol className="space-y-1">
            {HOW_IT_WORKS.map((step, i) => (
              <li
                key={i}
                className="grid grid-cols-[56px_1fr] md:grid-cols-[80px_1fr] gap-4 py-6"
                style={{ borderBottom: i === HOW_IT_WORKS.length - 1 ? 'none' : '1px solid #eef0f3' }}
                data-testid={`ongoing-step-${i + 1}`}
              >
                <span className="font-extrabold leading-none" style={{ ...mono, fontSize: '38px', color: '#dde3ea' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 pt-1">
                  <h3 className="text-[17px] font-bold mb-2 leading-snug" style={{ color: NAVY }}>{step.title}</h3>
                  <p className="text-[14.5px] text-[#1C2B2B]/70 leading-[1.75]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ Best fit ═══ */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="ongoing-best-fit">
        <div className="container max-w-5xl">
          <Eyebrow>Best fit</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-6 tracking-tight max-w-4xl" style={{ color: NAVY }}>
            Built for small operations without dedicated safety staff.
          </h2>
          <p className="text-base text-[#1C2B2B]/70 leading-[1.75] mb-8 max-w-3xl">This service may fit:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mb-8 max-w-4xl">
            {BEST_FIT.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-[#1C2B2B]/85 leading-[1.7]" data-testid={`ongoing-best-fit-${i + 1}`}>
                <ChevronRight size={16} className="flex-shrink-0 mt-1.5" style={{ color: GOLD }} strokeWidth={2.5} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="text-[14.5px] italic text-[#1C2B2B]/65 max-w-3xl leading-[1.75]">
            Employee count alone does not determine the price. Operations with multiple shifts, locations, or higher-risk processes require a custom scope.
          </p>
        </div>
      </section>

      {/* ═══ Starting investment ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ongoing-investment">
        <div className="container max-w-5xl">
          <Eyebrow>Starting investment</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.1] mb-2 tracking-tight" style={{ color: NAVY }}>
            Ongoing Safety Support
          </h2>
          <p className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight" style={{ color: BLUE, ...mono }}>
            Starting at $1,650 per month
          </p>

          <div
            className="rounded-xl p-6 md:p-8 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ background: CREAM, border: '1px solid #e8e5dd' }}
            data-testid="ongoing-price-grid"
          >
            <div>
              <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: '#5B6B7A' }}>
                Compliance Readiness Visit
              </p>
              <p className="text-2xl font-extrabold mb-1" style={{ color: NAVY, ...mono }}>$2,500</p>
              <p className="text-[13px] text-[#1C2B2B]/65 leading-[1.6]">Required initial assessment</p>
            </div>
            <div>
              <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: '#5B6B7A' }}>
                Ongoing Support · 3 Months
              </p>
              <p className="text-2xl font-extrabold mb-1" style={{ color: NAVY, ...mono }}>$4,950</p>
              <p className="text-[13px] text-[#1C2B2B]/65 leading-[1.6]">$1,650 × 3 (90-day initial term)</p>
            </div>
            <div style={{ background: 'rgba(201,168,76,0.10)', border: '1px solid rgba(201,168,76,0.35)', borderRadius: '8px', padding: '20px', margin: '-4px' }}>
              <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', letterSpacing: '0.18em', color: '#8B6F1F' }}>
                Combined Initial Investment
              </p>
              <p className="text-3xl font-extrabold mb-1" style={{ color: NAVY, ...mono }}>$7,450</p>
              <p className="text-[13px] text-[#1C2B2B]/70 leading-[1.6]">Assessment + 3 monthly payments</p>
            </div>
          </div>

          <p className="text-[14.5px] text-[#1C2B2B]/75 leading-[1.8] mb-4 max-w-4xl">
            The starting plan is designed for one location, one primary shift, and up to eight total hours of monthly service. Base pricing normally applies to facilities within 45 minutes of Kernersville under normal driving conditions. Higher-hazard operations, longer travel, additional shifts, multiple locations, major incidents, new program development, and specialized services are quoted separately.
          </p>
          <p className="text-[14.5px] text-[#1C2B2B]/75 leading-[1.8] mb-4 max-w-4xl">
            New recurring clients begin with a paid Compliance Readiness Visit so GigLine can see the actual operation before agreeing to maintain the work. A recent equivalent assessment may be accepted only when GigLine determines that it provides a reliable baseline.
          </p>

          <button
            type="button"
            onClick={scrollToForm}
            className="mt-4 inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
            style={{ background: NAVY, color: '#ffffff' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1c2e44')}
            onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
            data-testid="ongoing-investment-cta"
          >
            Request a Fit Call
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ═══ Scope boundaries (accessible expandable) ═══ */}
      <section className="py-16 md:py-20" style={{ background: CREAM }} data-testid="ongoing-scope">
        <div className="container max-w-5xl">
          <Eyebrow>What this is and what it is not</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-6 tracking-tight max-w-4xl" style={{ color: NAVY }}>
            Consistent support without pretending a consultant replaces management.
          </h2>
          <p className="text-base text-[#1C2B2B]/80 leading-[1.85] mb-5 max-w-4xl">
            GigLine provides safety assessment, documentation review, corrective-action tracking, coordination, and management reporting within the agreed scope.
          </p>
          <p className="text-base font-semibold text-[#1C2B2B] leading-[1.85] mb-6 max-w-4xl">
            The employer retains authority and responsibility for its workplace, employees, equipment, supervision, corrective actions, and compliance obligations. GigLine does not guarantee that every hazard will be identified, that every incident will be prevented, or that a client will avoid citations.
          </p>

          <button
            type="button"
            onClick={() => {
              setScopeOpen((o) => {
                trackEvent('ongoing_support_scope_toggle', { open: !o });
                return !o;
              });
            }}
            aria-expanded={scopeOpen}
            aria-controls="ongoing-scope-details"
            className="inline-flex items-center gap-2 font-bold px-4 py-2.5 rounded-md text-[14px] transition-colors"
            style={{ background: '#ffffff', color: NAVY, border: '1px solid #cfd6df' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f7f6f2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
            data-testid="ongoing-scope-toggle"
          >
            <span>Review full scope boundaries</span>
            <ChevronDown
              size={16}
              style={{ transform: scopeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>

          {scopeOpen && (
            <div
              id="ongoing-scope-details"
              className="mt-5 rounded-lg p-5 md:p-6 max-w-4xl"
              style={{ background: '#ffffff', border: '1px solid #e8e5dd' }}
              data-testid="ongoing-scope-details"
            >
              <p className="text-[14.5px] text-[#1C2B2B]/80 leading-[1.85]">
                Major incident investigations, OSHA inspection representation, environmental compliance, engineering, industrial hygiene, equipment corrections, complete program development, historical record reconstruction, contractor prequalification portals, and specialized training are separate services or require an appropriate specialist.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ Why GigLine · FLOOR → FINDINGS → FIXES → PROOF ═══ */}
      <section className="py-20 md:py-24" style={{ background: NAVY }} data-testid="ongoing-why">
        <div className="container max-w-5xl">
          <p className="uppercase font-bold mb-3" style={{ ...mono, fontSize: '10.4px', letterSpacing: '0.20em', color: GOLD }}>
            Why GigLine
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-6 tracking-tight text-white max-w-4xl">
            The value is not another binder. It is keeping the system alive.
          </h2>
          <p className="text-base md:text-lg text-white/75 leading-[1.85] mb-10 max-w-4xl">
            AI can generate a policy. A template can produce a checklist. Neither can walk your floor, compare the document with the work, ask why the same finding came back, or verify that management closed it.
          </p>
          <p className="text-white/70 text-[14.5px] mb-6" style={mono}>GigLine connects four things:</p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:gap-4 mb-8" data-testid="ongoing-ffp">
            {[
              { label: 'FLOOR', icon: Users },
              { label: 'FINDINGS', icon: ClipboardCheck },
              { label: 'FIXES', icon: CalendarClock },
              { label: 'PROOF', icon: FileBarChart2 },
            ].map((s, i, arr) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="relative flex items-center justify-center">
                  <div
                    className="w-full rounded-xl px-5 py-6 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(201,168,76,0.30)',
                    }}
                    data-testid={`ongoing-ffp-${s.label.toLowerCase()}`}
                  >
                    <Icon size={22} strokeWidth={2} style={{ color: GOLD }} className="mx-auto mb-3" />
                    <p className="uppercase font-extrabold text-white" style={{ ...mono, fontSize: '13.5px', letterSpacing: '0.16em' }}>
                      {s.label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight size={16} className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2" style={{ color: GOLD }} />
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[15px] text-white/75 leading-[1.85] max-w-4xl">
            That means observing what is happening, documenting what needs attention, helping management keep the correction moving, and preserving evidence of the work.
          </p>
        </div>
      </section>

      {/* ═══ Fit Call Form ═══ */}
      <section id="fit-call" className="py-20 md:py-24 scroll-mt-32" style={{ background: '#F7F9FC' }} data-testid="ongoing-form-section">
        <div className="container max-w-4xl">
          <Eyebrow>Fit call request</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight" style={{ color: NAVY }}>
            Tell us about the operation.
          </h2>
          <p className="text-base text-[#1C2B2B]/75 leading-[1.75] mb-10 max-w-3xl">
            A short conversation to determine whether ongoing support fits your operation, or whether a different GigLine service makes more sense. Submitting this form does not create a consulting relationship.
          </p>

          <div className="rounded-2xl bg-white p-6 md:p-9" style={{ border: '1px solid #dde3ea', boxShadow: '0 10px 30px -18px rgba(16,42,67,0.18)' }}>
            <FitCallForm />
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 md:py-24 bg-white" data-testid="ongoing-faq">
        <div className="container max-w-4xl">
          <Eyebrow>Frequently asked questions</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-10 tracking-tight" style={{ color: NAVY }}>
            Common questions about ongoing support.
          </h2>
          <div className="space-y-2">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group rounded-lg p-5 md:p-6"
                style={{ background: CREAM, border: '1px solid #e8e5dd' }}
                data-testid={`ongoing-faq-${i + 1}`}
              >
                <summary className="cursor-pointer flex items-start justify-between gap-4 list-none">
                  <span className="text-[15.5px] md:text-base font-bold leading-snug flex-1" style={{ color: NAVY }}>
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className="flex-shrink-0 mt-1 transition-transform group-open:rotate-180"
                    style={{ color: BLUE }}
                  />
                </summary>
                <p className="mt-4 text-[14.5px] text-[#1C2B2B]/80 leading-[1.85]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Final CTA ═══ */}
      <section className="py-20 md:py-24" style={{ background: CREAM }} data-testid="ongoing-final-cta">
        <div className="container max-w-4xl text-center">
          <Eyebrow>Final step</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-[1.15] mb-5 tracking-tight" style={{ color: NAVY }}>
            Stop restarting your safety program every time something happens.
          </h2>
          <p className="text-base md:text-lg text-[#1C2B2B]/75 leading-[1.85] mb-10 max-w-3xl mx-auto">
            If your operation needs consistent safety follow-through but is not ready for a full-time safety manager, start with a short fit call. We will determine whether ongoing support fits your facility or whether a different GigLine service makes more sense.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ background: NAVY }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1c2e44')}
              onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
              data-testid="ongoing-final-cta-primary"
            >
              Request a Fit Call
              <ArrowRight size={18} />
            </button>
            <Link
              to="/intake?service=compliance-readiness-visit"
              onClick={() => trackEvent('ongoing_support_secondary_cta_click', { location: 'final' })}
              className="inline-flex items-center gap-2 bg-white font-bold px-7 py-4 rounded-lg text-base transition-colors"
              style={{ color: NAVY, border: `1.5px solid ${NAVY}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = NAVY;
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = NAVY;
              }}
              data-testid="ongoing-final-cta-secondary"
            >
              Request a Compliance Readiness Visit
            </Link>
          </div>
          <a
            href="tel:3363298899"
            className="inline-flex items-center gap-2 text-[#1C2B2B]/60 hover:text-[#1C2B2B] text-sm mt-8 transition-colors"
            data-testid="ongoing-cta-phone"
          >
            <Phone size={14} />
            Vince Lawrence · (336) 329-8899 · vince@giglinecompliance.com
          </a>
        </div>
      </section>
    </main>
  );
};

export default OngoingSafetySupportPage;
