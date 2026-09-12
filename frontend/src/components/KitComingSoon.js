import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import SEO from './SEO';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const BG_WARM = '#FAF7F1';
const BORDER = '#e8e5dd';

const mono = { fontFamily: "'JetBrains Mono', monospace" };
const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * KitComingSoon — controlled unavailable state for a hidden-from-catalog kit.
 * Renders a noindex page with a compact "notify me" waitlist form. The form
 * POSTs to /api/kit-waitlist which validates the slug against the same
 * UNAVAILABLE_KIT_SLUGS set used to reject checkout, so this cannot be used
 * to enumerate released kits.
 */
const KitComingSoon = ({ slug, kit }) => {
  const [form, setForm] = useState({ email: '', contact_name: '', company_name: '', website: '' });
  const [state, setState] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setState('submitting');
    setError('');
    try {
      const res = await fetch(`${API}/api/kit-waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kit_slug: slug, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Something went wrong. Please try again.');
      }
      setState('success');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setState('error');
    }
  };

  return (
    <main
      data-testid={`kit-detail-coming-soon-${slug}`}
      style={{ backgroundColor: BG_WARM, color: NAVY, minHeight: '70vh' }}
    >
      <SEO
        title={`${kit.name} | Coming Soon | GigLine Safety & Compliance`}
        description={`${kit.name} is in build. Join the waitlist to be notified when it is released.`}
        canonical={`/citation-proof-kits/${slug}`}
        noindex
      />

      <section className="px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/citation-proof-kits"
            className="inline-flex items-center gap-2 text-[13px] font-bold mb-8 hover:underline"
            style={{ color: 'rgba(10,22,40,0.62)', ...mono }}
            data-testid="kit-detail-coming-soon-back"
          >
            <ArrowLeft size={13} />
            Back to Citation-Proof Kits
          </Link>

          <p
            className="uppercase font-bold tracking-[0.28em] mb-3"
            style={{ color: GOLD, ...mono, fontSize: '11px' }}
          >
            In Build
          </p>
          <h1
            className="text-[36px] sm:text-4xl md:text-5xl leading-[1.05] mb-6 italic"
            style={{ ...serif, color: NAVY, letterSpacing: '-0.015em' }}
            data-testid="kit-detail-coming-soon-heading"
          >
            {kit.name} is not yet released.
          </h1>
          <p
            className="text-[15px] md:text-[17px] leading-[1.75] max-w-2xl mb-6"
            style={{ color: 'rgba(10,22,40,0.72)' }}
          >
            We do not collect payment for a kit until its deliverables are complete and the automated fulfillment path has been tested end to end. Once this kit is validated, it will appear back on the main Citation-Proof Kit page with live pricing and checkout.
          </p>
          <p
            className="text-[14px] italic leading-[1.75] max-w-2xl mb-10"
            style={{ ...serif, color: 'rgba(10,22,40,0.60)' }}
          >
            In the meantime, the three shipping kits, LOTO, Forklift/PIT, and HazCom Pro, use the same four-step Proof Gap Engine method.
          </p>

          {/* ─── Waitlist form / success card ─── */}
          {state === 'success' ? (
            <div
              className="p-6 md:p-8 mb-8"
              style={{ background: 'white', border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}` }}
              data-testid="kit-waitlist-success"
            >
              <div className="flex items-start gap-3">
                <Check size={22} strokeWidth={2.5} style={{ color: GOLD, marginTop: 2 }} />
                <div>
                  <p className="uppercase font-bold mb-1" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: GOLD }}>
                    You&rsquo;re on the list
                  </p>
                  <p className="text-[16px] font-bold mb-2 italic" style={{ ...serif, color: NAVY }}>
                    Vince will email you first when {kit.name} ships.
                  </p>
                  <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(10,22,40,0.70)' }}>
                    We just sent you a confirmation. If it doesn&rsquo;t arrive within a few minutes, check spam or reply to any GigLine email so we can flag your address as trusted.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="p-6 md:p-8 mb-8"
              style={{ background: 'white', border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GOLD}` }}
              data-testid="kit-waitlist-form"
            >
              <p className="uppercase font-bold mb-1" style={{ ...mono, fontSize: '10.5px', letterSpacing: '0.20em', color: GOLD }}>
                Waitlist
              </p>
              <p className="text-[18px] md:text-[20px] font-bold mb-4 italic" style={{ ...serif, color: NAVY }}>
                Notify me when this kit ships.
              </p>
              <p className="text-[13.5px] leading-[1.7] mb-5" style={{ color: 'rgba(10,22,40,0.70)' }}>
                One email when the kit is released. No newsletter. Reply anytime to ask a question.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  name="contact_name"
                  placeholder="Your name (optional)"
                  autoComplete="name"
                  value={form.contact_name}
                  onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                  className="w-full px-4 py-3 text-[14.5px] rounded"
                  style={{ border: `1px solid ${BORDER}` }}
                  data-testid="kit-waitlist-name"
                />
                <input
                  type="text"
                  name="company_name"
                  placeholder="Company (optional)"
                  autoComplete="organization"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="w-full px-4 py-3 text-[14.5px] rounded"
                  style={{ border: `1px solid ${BORDER}` }}
                  data-testid="kit-waitlist-company"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 text-[14.5px] rounded mb-4"
                style={{ border: `1px solid ${BORDER}` }}
                data-testid="kit-waitlist-email"
              />
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
                aria-hidden="true"
              />

              {state === 'error' && (
                <p className="text-[13px] mb-3" style={{ color: '#B91C1C' }} data-testid="kit-waitlist-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg text-[14.5px] transition-colors disabled:opacity-50"
                style={{ background: NAVY, color: 'white' }}
                data-testid="kit-waitlist-submit"
              >
                {state === 'submitting' ? 'Adding you…' : 'Add me to the waitlist'}
                {state !== 'submitting' && <ArrowRight size={16} />}
              </button>
              <p className="text-[11.5px] mt-3" style={{ color: 'rgba(10,22,40,0.55)' }}>
                By joining the waitlist, you agree to receive one release email. We don&rsquo;t sell or share your address.
              </p>
            </form>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/citation-proof-kits"
              className="inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-lg text-[15px] transition-colors"
              style={{ background: GOLD, color: NAVY }}
              data-testid="kit-detail-coming-soon-cta-browse"
            >
              Browse the released kits <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default KitComingSoon;
