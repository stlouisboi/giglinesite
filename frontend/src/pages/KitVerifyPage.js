import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';

const NAVY = '#102A43';
const GOLD = '#C9A84C';
const BLUE = '#2A52A0';
const CREAM = '#f5f4f0';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const API = process.env.REACT_APP_BACKEND_URL;

const TIER_LABELS = {
  digital: 'Digital Compliance Kit',
  'control-system': 'Compliance Control System',
  binder: 'Compliance Binder Edition',
};

const KitVerifyPage = () => {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch(`${API}/api/verify/${encodeURIComponent(token)}`);
        if (cancelled) return;
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          setState({
            loading: false,
            error: body.detail || 'No matching kit record for this token.',
            data: null,
          });
          return;
        }
        const data = await resp.json();
        setState({ loading: false, error: null, data });
      } catch {
        if (!cancelled) setState({ loading: false, error: 'Network error. Please retry.', data: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const mintedDate = useMemo(() => {
    if (!state.data?.minted_at) return null;
    try {
      const d = new Date(state.data.minted_at);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return state.data.minted_at;
    }
  }, [state.data]);

  const tierLabel =
    state.data && (state.data.tier_name || TIER_LABELS[state.data.tier] || state.data.tier);

  return (
    <main className="min-h-screen flex items-center justify-center py-16 md:py-24" style={{ background: CREAM }} data-testid="verify-page">
      <SEO
        title="Kit Authenticity Verification | GigLine"
        description="Scan or paste your GigLine kit token to confirm it is an authenticated Citation-Proof Kit purchase."
        canonical={`/verify/${token || ''}`}
      />

      <div className="container max-w-2xl px-4">
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #dde3ea', boxShadow: '0 20px 60px -25px rgba(16,42,67,0.25)' }} data-testid="verify-card">

          {/* Header strip */}
          <div className="px-7 md:px-10 py-7" style={{ background: NAVY }}>
            <div className="flex items-center gap-3">
              <ShieldCheck size={22} style={{ color: GOLD }} strokeWidth={2.5} />
              <p className="uppercase font-bold text-white" style={{ ...mono, fontSize: '11px', letterSpacing: '0.20em' }}>
                GigLine Citation-Proof Kit
              </p>
            </div>
            <h1 className="text-white text-2xl md:text-3xl font-extrabold leading-tight mt-3 tracking-tight">
              Kit Authenticity Verification
            </h1>
          </div>

          <div className="px-7 md:px-10 py-8 md:py-10">
            {/* Loading */}
            {state.loading && (
              <div className="flex flex-col items-center py-10 text-center" data-testid="verify-loading">
                <Loader2 size={26} className="animate-spin" style={{ color: BLUE }} />
                <p className="mt-3 text-[14px]" style={{ color: '#6b7280', ...mono }}>Verifying token…</p>
              </div>
            )}

            {/* Error */}
            {!state.loading && state.error && (
              <div data-testid="verify-error">
                <div className="flex items-start gap-3 rounded-lg p-4" style={{ background: '#FEF2F2', border: '1px solid #dc262633' }}>
                  <AlertTriangle size={20} style={{ color: '#dc2626' }} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[15px]" style={{ color: '#991B1B' }}>Token not recognized</p>
                    <p className="text-[14px] mt-1 leading-[1.65]" style={{ color: '#7f1d1d' }}>{state.error}</p>
                  </div>
                </div>
                <p className="mt-6 text-[14px] leading-[1.75] text-[#1C2B2B]/75">
                  If you received a QR code with a GigLine kit and the token is not verifying, please email a photo of the QR code to{' '}
                  <a href="mailto:vince@giglinecompliance.com" className="font-bold underline" style={{ color: BLUE }}>vince@giglinecompliance.com</a>{' '}
                  or call <a href="tel:3363298899" className="font-bold underline" style={{ color: BLUE }}>(336) 329-8899</a>.
                </p>
              </div>
            )}

            {/* Verified */}
            {!state.loading && state.data && (
              <div data-testid="verify-success">
                <div className="flex items-start gap-3 rounded-lg p-4 mb-7" style={{ background: '#EEF7F1', border: '1px solid #34a06344' }}>
                  <CheckCircle2 size={22} style={{ color: '#166534' }} className="flex-shrink-0 mt-0.5" strokeWidth={2.4} />
                  <div>
                    <p className="font-bold text-[15px]" style={{ color: '#166534' }}>Authenticated GigLine kit</p>
                    <p className="text-[13.5px] mt-1 leading-[1.6]" style={{ color: '#166534' }}>
                      This token matches a paid Citation-Proof Kit order on record.
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-y-4" data-testid="verify-details">
                  <div className="grid grid-cols-[110px_1fr] items-baseline gap-x-4">
                    <dt className="uppercase font-bold" style={{ ...mono, fontSize: '11px', color: '#6b7280', letterSpacing: '0.14em' }}>Kit</dt>
                    <dd className="text-[16px] font-bold" style={{ color: NAVY }} data-testid="verify-kit-name">{state.data.kit_name || 'GigLine Kit'}</dd>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] items-baseline gap-x-4">
                    <dt className="uppercase font-bold" style={{ ...mono, fontSize: '11px', color: '#6b7280', letterSpacing: '0.14em' }}>Tier</dt>
                    <dd className="text-[15px]" style={{ color: '#1C2B2B' }} data-testid="verify-tier">{tierLabel}</dd>
                  </div>
                  {mintedDate && (
                    <div className="grid grid-cols-[110px_1fr] items-baseline gap-x-4">
                      <dt className="uppercase font-bold" style={{ ...mono, fontSize: '11px', color: '#6b7280', letterSpacing: '0.14em' }}>Purchased</dt>
                      <dd className="text-[15px]" style={{ color: '#1C2B2B' }} data-testid="verify-date">{mintedDate}</dd>
                    </div>
                  )}
                  <div className="grid grid-cols-[110px_1fr] items-baseline gap-x-4">
                    <dt className="uppercase font-bold" style={{ ...mono, fontSize: '11px', color: '#6b7280', letterSpacing: '0.14em' }}>Token</dt>
                    <dd className="text-[13px] break-all" style={{ ...mono, color: '#4A5568' }} data-testid="verify-token">{token}</dd>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] items-baseline gap-x-4">
                    <dt className="uppercase font-bold" style={{ ...mono, fontSize: '11px', color: '#6b7280', letterSpacing: '0.14em' }}>Scans</dt>
                    <dd className="text-[15px]" style={{ color: '#1C2B2B' }} data-testid="verify-scan-count">{state.data.verified_count}</dd>
                  </div>
                </dl>

                <div className="mt-8 pt-7 border-t border-[#eef0f3]">
                  <p className="text-[13.5px] leading-[1.7] text-[#1C2B2B]/70 mb-4 max-w-md">
                    This verification page only confirms that the kit token matches a paid GigLine order. It does not certify OSHA compliance and does not constitute a legal audit.
                  </p>
                  {state.data.kit_slug && (
                    <Link
                      to={`/citation-proof-kits/${state.data.kit_slug}`}
                      className="inline-flex items-center gap-2 font-bold px-5 py-3 rounded-lg text-[14px] transition-colors"
                      style={{ background: NAVY, color: '#fff' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#1c2e44')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
                      data-testid="verify-view-kit-cta"
                    >
                      View kit page
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer strip */}
          <div className="px-7 md:px-10 py-4 border-t border-[#eef0f3] flex items-center justify-between flex-wrap gap-2">
            <p className="text-[12.5px]" style={{ color: '#6b7280', ...mono }}>GigLine Safety &amp; Compliance</p>
            <Link to="/" className="text-[12.5px] font-bold hover:underline" style={{ color: BLUE }}>giglinecompliance.com →</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KitVerifyPage;
