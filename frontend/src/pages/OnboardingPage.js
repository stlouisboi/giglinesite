import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Check, ChevronRight, Shield, FileText, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;

const C = {
  bg: '#1A1A1A', surface: '#222222', deep: '#111111',
  gold: '#E8B84B', white: '#FFFFFF',
  sec: 'rgba(255,255,255,0.65)', muted: 'rgba(255,255,255,0.38)',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.20)',
};
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const TIERS = {
  small:  { label: 'Small',  headcount: '1–75',   price: 650, retainerLow: 650,  retainerHigh: 750,  freq: 'Every 6 months', remote: 'Up to 2 hrs/mo', micro: '1 per quarter' },
  medium: { label: 'Medium', headcount: '75–250',  price: 750, retainerLow: 900,  retainerHigh: 1100, freq: 'Every 4 months', remote: '~2 hrs/month',   micro: '1 per quarter' },
  large:  { label: 'Large',  headcount: '250+',    price: 900, retainerLow: 1300, retainerHigh: 1500, freq: 'Every quarter',  remote: '~3 hrs/month',   micro: '1 per quarter' },
};

const STEPS = [
  { id: 1, label: 'Overview' },
  { id: 2, label: 'Facility' },
  { id: 3, label: 'Service Tier' },
  { id: 4, label: 'Agreement' },
  { id: 5, label: 'Retainer' },
  { id: 6, label: 'Payment' },
];

const Input = ({ label, required, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1.5" style={{ color: C.sec }}>
      {label}{required && <span style={{ color: C.gold }}> *</span>}
    </label>
    <input {...props} required={required}
      className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors"
      style={{ background: C.deep, border: `1px solid ${C.border}` }}
      onFocus={e => e.target.style.borderColor = C.gold}
      onBlur={e => e.target.style.borderColor = C.border}
    />
  </div>
);


/* ═══════════════════════════ */
/*  CONFIRMED PAGE             */
/* ═══════════════════════════ */
const ConfirmedView = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`${API}/api/onboarding/confirm?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => { if (data.confirmed) setBooking(data.booking); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
      <p style={{ color: C.muted }}>Confirming payment...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.bg }}>
      <SEO title="Booking Confirmed | GigLine" description="Your GigLine walkthrough booking is confirmed." canonical="/onboarding/confirmed" />
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: C.gold }}>
          <Check size={32} color="#111" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Request received</h1>
        <p className="text-sm mb-8" style={{ color: C.sec }}>Your booking has been confirmed and payment processed.</p>

        {booking && (
          <div className="rounded-lg p-6 mb-6 text-left" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span style={{ color: C.muted }}>Company</span><span className="text-white font-medium">{booking.company}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Service</span><span className="text-white font-medium">{TIERS[booking.tier]?.label} {booking.addRetainer ? 'Retainer' : 'Walkthrough'}</span></div>
              <div className="flex justify-between"><span style={{ color: C.muted }}>Amount</span><span className="font-bold" style={{ color: C.gold }}>${booking.totalCharged}</span></div>
              {booking.preferredDate && <div className="flex justify-between"><span style={{ color: C.muted }}>Preferred date</span><span className="text-white font-medium">{booking.preferredDate}</span></div>}
              <div className="h-px" style={{ background: C.border }} />
              <p className="text-xs" style={{ color: C.muted }}>Report delivery: 48–72 hrs after walkthrough</p>
            </div>
          </div>
        )}

        <p className="text-xs" style={{ color: C.muted }}>
          <a href="tel:3363298899" className="hover:text-white transition-colors">(336) 329-8899</a> · <a href="mailto:vince@giglinecompliance.com" className="hover:text-white transition-colors">vince@giglinecompliance.com</a>
        </p>
        <a href="/" className="inline-block mt-6 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors" style={{ color: C.gold, border: `1px solid rgba(232,184,75,0.3)` }}>
          Return home
        </a>
      </div>
    </div>
  );
};


/* ═══════════════════════════ */
/*  MAIN ONBOARDING            */
/* ═══════════════════════════ */
const OnboardingPage = () => {
  const location = useLocation();
  const isConfirmed = location.pathname.includes('/confirmed');

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [signingName, setSigningName] = useState('');
  const [signing, setSigning] = useState(false);
  const [clientToken, setClientToken] = useState('');

  const [f, setF] = useState({
    company: '', contactName: '', email: '', phone: '',
    industry: '', employeeCount: '',
    tier: '', addRetainer: false,
    preferredDate: '', notes: '',
  });

  const set = (key, val) => setF(prev => ({ ...prev, [key]: val }));

  // Auto-select tier based on employee count
  useEffect(() => {
    const count = parseInt(f.employeeCount) || 0;
    if (count > 0 && count <= 75) set('tier', 'small');
    else if (count > 75 && count <= 250) set('tier', 'medium');
    else if (count > 250) set('tier', 'large');
  }, [f.employeeCount]);

  // If on /onboarding/confirmed, show confirmation
  if (isConfirmed) return <ConfirmedView />;

  const selectedTier = TIERS[f.tier];
  const totalDue = f.addRetainer ? (selectedTier?.retainerLow || 0) : (selectedTier?.price || 0);

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/onboarding/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          employeeCount: parseInt(f.employeeCount) || 0,
          originUrl: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleSignAgreement = async () => {
    if (!signingName.trim()) return;
    setSigning(true);
    try {
      // Use existing clientToken or generate via intake lookup
      let token = clientToken;
      if (!token) {
        // Create a pseudo-token for bookings that don't go through intake
        const intakeRes = await fetch(`${API}/api/intake/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: f.company, address: 'Via onboarding portal', contactName: f.contactName,
            email: f.email, phone: f.phone, totalEmployees: parseInt(f.employeeCount) || 0,
            siteEmployees: parseInt(f.employeeCount) || 0, consentGiven: true,
          }),
        });
        const intakeData = await intakeRes.json();
        token = intakeData.clientToken || '';
        setClientToken(token);
      }

      const res = await fetch(`${API}/api/onboarding/sign-agreement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientToken: token,
          typedName: signingName.trim(),
          company: f.company,
          tier: f.tier,
          addRetainer: f.addRetainer,
        }),
      });
      const data = await res.json();
      if (data.signed) setAgreementSigned(true);
    } catch (e) {
      console.error(e);
    }
    setSigning(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return f.company && f.contactName && f.email;
      case 3: return !!f.tier;
      case 4: return agreementSigned;
      case 5: return true;
      case 6: return agreementSigned && !!f.preferredDate;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div data-testid="onboarding-step-1">
          <h2 className="text-xl font-bold text-white mb-1">Safety Walkthrough</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>Here's what to expect from a GigLine engagement.</p>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Shield size={20} />, label: 'On-site', desc: 'Facility walkthrough' },
              { icon: <FileText size={20} />, label: 'Written', desc: 'Safety Check report' },
              { icon: <Clock size={20} />, label: '24–48 hrs', desc: 'Report delivery' },
            ].map((t, i) => (
              <div key={i} className="rounded-lg p-4 text-center" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
                <div className="mx-auto mb-2" style={{ color: C.gold }}>{t.icon}</div>
                <p className="text-sm font-bold text-white">{t.label}</p>
                <p className="text-xs" style={{ color: C.muted }}>{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Info rows */}
          <div className="space-y-4 mb-8">
            <div className="rounded-lg p-4" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.gold }}>Included</p>
              <p className="text-sm" style={{ color: C.sec }}>Full facility walkthrough, written Safety Check report with findings, photos, and prioritized fix list.</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.muted }}>Not included</p>
              <p className="text-sm" style={{ color: C.sec }}>Full OSHA audit, program rewrites, or ongoing monitoring. Those are available as add-ons or retainer services.</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.15)' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: C.gold }}>Retainer option</p>
              <p className="text-sm" style={{ color: C.sec }}>Scheduled walkthroughs, remote support, and micro-projects on a monthly retainer. Selected in Step 5.</p>
            </div>
          </div>
        </div>
      );

      case 2: return (
        <div data-testid="onboarding-step-2">
          <h2 className="text-xl font-bold text-white mb-1">Facility Information</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>Tell us about your operation.</p>
          <Input label="Company name" required value={f.company} onChange={e => set('company', e.target.value)} data-testid="onboarding-company" />
          <Input label="Contact name" required value={f.contactName} onChange={e => set('contactName', e.target.value)} data-testid="onboarding-contact" />
          <Input label="Email" required type="email" value={f.email} onChange={e => set('email', e.target.value)} data-testid="onboarding-email" />
          <Input label="Phone" required type="tel" value={f.phone} onChange={e => set('phone', e.target.value)} />
          <div className="mb-4">
            <label className="block text-sm mb-1.5" style={{ color: C.sec }}>Industry type</label>
            <select value={f.industry} onChange={e => set('industry', e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none appearance-none"
              style={{ background: C.deep, border: `1px solid ${C.border}` }}>
              <option value="">Select...</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Warehouse/Distribution">Warehouse / Distribution</option>
              <option value="Construction/Contractor">Construction / Contractor</option>
              <option value="Trucking/Fleet">Trucking / Fleet</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input label="Total employees" required type="number" value={f.employeeCount} onChange={e => set('employeeCount', e.target.value)} data-testid="onboarding-employees" />
          {f.tier && (
            <p className="text-xs mt-1" style={{ color: C.gold }}>
              Auto-selected: {TIERS[f.tier].label} tier ({TIERS[f.tier].headcount} employees)
            </p>
          )}
        </div>
      );

      case 3: return (
        <div data-testid="onboarding-step-3">
          <h2 className="text-xl font-bold text-white mb-1">Service Tier</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>Select the tier that matches your operation. Auto-selected based on headcount — you can override.</p>
          <div className="space-y-4">
            {Object.entries(TIERS).map(([key, tier]) => (
              <button key={key} onClick={() => set('tier', key)}
                className="w-full text-left rounded-lg p-5 transition-all"
                style={{
                  background: f.tier === key ? 'rgba(232,184,75,0.07)' : C.deep,
                  border: `1.5px solid ${f.tier === key ? C.gold : C.border}`,
                }}
                data-testid={`tier-${key}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-base font-bold text-white">{tier.label}</span>
                    <span className="text-xs ml-2" style={{ color: C.muted }}>{tier.headcount} employees</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: C.gold }}>${tier.price}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs" style={{ color: C.sec }}>
                  <div><span style={{ color: C.muted }}>Retainer</span><br/>${tier.retainerLow}–${tier.retainerHigh}/mo</div>
                  <div><span style={{ color: C.muted }}>Walkthrough</span><br/>{tier.freq}</div>
                  <div><span style={{ color: C.muted }}>Remote</span><br/>{tier.remote}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      );

      case 4: return (
        <div data-testid="onboarding-step-4">
          <h2 className="text-xl font-bold text-white mb-1">Review and Sign Your Service Agreement</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>This takes about 60 seconds. Your payment step unlocks after signing.</p>

          {/* Agreement content */}
          <div className="rounded-lg p-5 md:p-6 mb-6 space-y-4" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.gold }}>Scope</p>
              <p className="text-sm" style={{ color: C.sec }}>One on-site safety walkthrough at the address provided. Visual assessment of workplace safety conditions, compliance gaps, and hazard exposures.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.gold }}>Deliverable</p>
              <p className="text-sm" style={{ color: C.sec }}>Written Safety Check PDF report delivered within 48-72 hours. Includes findings, photographs, and prioritized corrective action list.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Exclusions</p>
              <p className="text-sm" style={{ color: C.sec }}>Program rewrites, incident investigation, new safety program development, engineering assessments, or industrial hygiene sampling. Available as separate engagements.</p>
            </div>
            {f.addRetainer && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.gold }}>Retainer Terms</p>
                <p className="text-sm" style={{ color: C.sec }}>Month-to-month after 6-month minimum. 30-day written notice to cancel. Includes scheduled walkthroughs, remote support, and micro-project capacity per tier. Full program builds quoted separately.</p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Payment</p>
              <p className="text-sm" style={{ color: C.sec }}>Collected via Stripe at time of booking. Non-refundable after walkthrough is conducted. Cancellation 48+ hours before scheduled date: full refund.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Relationship</p>
              <p className="text-sm" style={{ color: C.sec }}>Independent contractor. Not an employee or agent of the Client.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Governing Law</p>
              <p className="text-sm" style={{ color: C.sec }}>North Carolina.</p>
            </div>
          </div>

          {/* Signing area */}
          {agreementSigned ? (
            <div className="rounded-lg p-5 flex items-center gap-3" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }} data-testid="agreement-signed">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#4ade80' }}><Check size={16} color="#111" /></div>
              <div>
                <p className="text-sm font-bold text-white">Agreement signed</p>
                <p className="text-xs" style={{ color: C.muted }}>Signed as {signingName}. PDF stored securely.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg p-5" style={{ background: 'rgba(232,184,75,0.06)', border: '1px solid rgba(232,184,75,0.15)' }}>
              <p className="text-sm font-bold text-white mb-3">Type your full name to sign</p>
              <input
                type="text" value={signingName} onChange={e => setSigningName(e.target.value)}
                placeholder="Your full legal name"
                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none mb-3"
                style={{ background: C.deep, border: `1px solid ${C.border}` }}
                data-testid="agreement-name-input"
              />
              <button onClick={handleSignAgreement} disabled={!signingName.trim() || signing}
                className="text-sm font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-40 hover:brightness-110"
                style={{ background: C.gold, color: '#111' }}
                data-testid="agreement-sign-btn"
              >
                {signing ? 'Signing...' : 'Sign Agreement'}
              </button>
            </div>
          )}
        </div>
      );

      case 5: return (
        <div data-testid="onboarding-step-5">
          <h2 className="text-xl font-bold text-white mb-1">Service Option</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>Choose one-time or ongoing support.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Walkthrough only */}
            <button onClick={() => set('addRetainer', false)}
              className="text-left rounded-lg p-5 transition-all"
              style={{
                background: !f.addRetainer ? 'rgba(232,184,75,0.07)' : C.deep,
                border: `1.5px solid ${!f.addRetainer ? C.gold : C.border}`,
              }}
              data-testid="option-walkthrough"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">Walkthrough Only</span>
                <span className="text-lg font-bold" style={{ color: C.gold }}>${selectedTier?.price || '—'}</span>
              </div>
              <p className="text-xs mb-2 font-medium" style={{ color: C.muted }}>One-time</p>
              <p className="text-sm" style={{ color: C.sec }}>On-site walkthrough + written Safety Check report. No recurring commitment.</p>
            </button>

            {/* Retainer */}
            <button onClick={() => set('addRetainer', true)}
              className="text-left rounded-lg p-5 transition-all relative"
              style={{
                background: f.addRetainer ? 'rgba(232,184,75,0.07)' : C.deep,
                border: `1.5px solid ${f.addRetainer ? C.gold : C.border}`,
              }}
              data-testid="option-retainer"
            >
              <span className="absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: C.gold, color: '#111' }}>Recommended</span>
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">Compliance Retainer</span>
                <span className="text-lg font-bold" style={{ color: C.gold }}>${selectedTier?.retainerLow || '—'}/mo</span>
              </div>
              <p className="text-xs mb-2 font-medium" style={{ color: C.muted }}>6-month minimum</p>
              {selectedTier && (
                <ul className="text-sm space-y-1.5" style={{ color: C.sec }}>
                  <li>Walkthrough: {selectedTier.freq}</li>
                  <li>Remote support: {selectedTier.remote}</li>
                  <li>Micro-projects: {selectedTier.micro}</li>
                  <li style={{ color: C.muted }}>Full program rewrites quoted separately</li>
                </ul>
              )}
            </button>
          </div>
          <p className="text-xs mt-6" style={{ color: C.muted }}>
            Because safety risk scales with headcount, retainer rates are sized to your operation. You pre-buy your scheduled walkthroughs and get an expert on call — bigger projects are quoted separately.
          </p>
        </div>
      );

      case 6: return (
        <div data-testid="onboarding-step-6">
          <h2 className="text-xl font-bold text-white mb-1">Schedule & Payment</h2>
          <p className="text-sm mb-8" style={{ color: C.muted }}>Review your order and proceed to payment.</p>

          {!agreementSigned && (
            <div className="rounded-lg p-4 mb-6" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
              <p className="text-sm" style={{ color: '#f87171' }}>Complete your service agreement in Step 4 to unlock payment.</p>
            </div>
          )}

          {/* Order summary */}
          <div className="rounded-lg p-5 mb-6" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: C.sec }}>{selectedTier?.label} Safety Walkthrough</span>
                <span className="font-bold text-white">${selectedTier?.price || 0}</span>
              </div>
              {f.addRetainer && (
                <div className="flex justify-between">
                  <span style={{ color: C.sec }}>Compliance Retainer</span>
                  <span className="font-bold text-white">${selectedTier?.retainerLow}/mo</span>
                </div>
              )}
              <div className="h-px" style={{ background: C.border }} />
              <div className="flex justify-between">
                <span className="font-bold text-white">Due at booking</span>
                <span className="text-lg font-bold" style={{ color: C.gold }}>${totalDue}</span>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: C.muted }}>Payment collected via Stripe. Invoice sent by email after confirmation.</p>
          </div>

          <Input label="Preferred date range" required value={f.preferredDate} onChange={e => set('preferredDate', e.target.value)} placeholder="e.g. Anytime after May 5, prefer mornings" data-testid="onboarding-date" />
          <div className="mb-4">
            <label className="block text-sm mb-1.5" style={{ color: C.sec }}>Anything we should know before arriving?</label>
            <textarea value={f.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-white/25 focus:outline-none resize-none"
              style={{ background: C.deep, border: `1px solid ${C.border}` }}
              placeholder="Optional"
            />
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <SEO title="Walkthrough Booking | GigLine Safety & Compliance" description="Book your GigLine safety walkthrough. Select your tier, choose a retainer option, and pay securely via Stripe." canonical="/onboarding" />

      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: C.deep, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between px-6 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: C.gold }}>
              <Check size={14} color="#111" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">GigLine Safety & Compliance</span>
              <span className="text-xs block" style={{ color: C.muted }}>Walkthrough Booking</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 text-right">
            <span className="text-xs font-medium" style={{ color: C.gold }}>{STEPS.find(s => s.id === step)?.label}</span>
            <span className="text-xs" style={{ color: C.muted }}>Secure portal</span>
          </div>
        </div>
        <div className="w-full" style={{ height: '3px', background: C.border }}>
          <div style={{ width: `${((step - 1) / 5) * 100}%`, height: '3px', background: C.gold, transition: 'width 0.4s ease' }} />
        </div>
      </nav>

      {/* Step indicators + main */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Step pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map(s => (
            <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: step === s.id ? C.gold : step > s.id ? 'rgba(232,184,75,0.15)' : 'rgba(255,255,255,0.04)',
                  color: step === s.id ? '#111' : step > s.id ? C.gold : C.muted,
                }}>
                {step > s.id ? <Check size={12} /> : <span>{s.id}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {s.id < 6 && <ChevronRight size={12} style={{ color: C.muted }} />}
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="rounded-xl p-6 md:p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {renderStep()}

          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                style={{ color: C.sec, border: `1px solid ${C.border}` }}>
                Back
              </button>
            ) : <div />}

            {step < 6 ? (
              <button onClick={() => setStep(step + 1)} disabled={!canProceed()}
                className="text-sm font-bold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-40 hover:brightness-110"
                style={{ background: C.gold, color: '#111' }}
                data-testid="onboarding-next-btn"
              >
                {step === 1 ? 'Start — tell us about your facility' : 'Continue'} <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleCheckout} disabled={submitting || !agreementSigned || !f.preferredDate}
                className="text-sm font-bold px-6 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-40 hover:brightness-110"
                style={{ background: C.gold, color: '#111' }}
                data-testid="onboarding-pay-btn"
              >
                {submitting ? 'Processing...' : 'Proceed to payment'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar summary on tier/retainer steps */}
        {step >= 3 && selectedTier && (
          <div className="mt-6 rounded-lg p-5" style={{ background: C.deep, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: C.muted }}>{selectedTier.label} tier</span>
              <span className="font-bold" style={{ color: C.gold }}>
                {f.addRetainer ? `$${selectedTier.retainerLow}/mo` : `$${selectedTier.price}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
