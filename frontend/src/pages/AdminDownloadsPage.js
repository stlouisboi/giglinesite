import React, { useEffect, useState } from 'react';
import { Lock, Download, FileText, Package, ShieldCheck, AlertTriangle, Loader2, FileCode2 } from 'lucide-react';
import SEO from '../components/SEO';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const BLUE = '#2A52A0';
const CREAM = '#F5F4F0';
const INK = '#1C2B2B';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const STORAGE_KEY = 'gigline_admin_token';
const ADMIN_PASSWORD = 'gigline2026';       // client-side deterrent, files are static
const BUCKET = 'ongoing-support';
const BASE_PATH = `/private/${BUCKET}`;

const AdminDownloadsPage = () => {
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState('');
  const [state, setState] = useState({ loading: false, error: null, data: null });

  useEffect(() => {
    const t = window.sessionStorage.getItem(STORAGE_KEY) || '';
    if (t) {
      setSavedToken(t);
      setToken(t);
    }
  }, []);

  useEffect(() => {
    if (!savedToken) return;
    let cancel = false;
    (async () => {
      setState({ loading: true, error: null, data: null });
      try {
        const resp = await fetch(`${BASE_PATH}/manifest.json`, { cache: 'no-cache' });
        if (cancel) return;
        if (!resp.ok) {
          setState({ loading: false, error: `Manifest error ${resp.status}`, data: null });
          return;
        }
        const data = await resp.json();
        setState({ loading: false, error: null, data });
      } catch {
        if (!cancel) setState({ loading: false, error: 'Network error loading manifest.', data: null });
      }
    })();
    return () => { cancel = true; };
  }, [savedToken]);

  const onUnlock = (e) => {
    e.preventDefault();
    const t = token.trim();
    if (!t) return;
    if (t !== ADMIN_PASSWORD) {
      setState({ loading: false, error: 'Invalid password.', data: null });
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, t);
    setSavedToken(t);
  };

  const onSignOut = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setSavedToken('');
    setToken('');
    setState({ loading: false, error: null, data: null });
  };

  const downloadHref = (filename) => `${BASE_PATH}/${encodeURIComponent(filename)}`;

  const iconFor = (kind) => {
    if (kind === 'zip') return Package;
    if (kind === 'md') return FileCode2;
    return FileText;
  };

  return (
    <main className="min-h-screen py-16 md:py-20" style={{ background: CREAM }} data-testid="admin-downloads-page">
      <SEO title="Internal Downloads | GigLine" description="Internal access. Not indexed." canonical="/admin/downloads" />

      <div className="container max-w-4xl px-4">
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} style={{ color: GOLD }} strokeWidth={2.4} />
            <div>
              <p className="uppercase font-bold" style={{ ...mono, fontSize: '10px', letterSpacing: '0.22em', color: GOLD }}>GigLine Internal</p>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none mt-1" style={{ color: NAVY }}>Downloads</h1>
            </div>
          </div>
          {savedToken && (
            <button
              type="button"
              onClick={onSignOut}
              className="text-[13px] font-bold px-3 py-1.5 rounded transition-colors"
              style={{ color: '#6b7280', border: '1px solid #cfd6df', background: '#ffffff' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f4f0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              data-testid="admin-sign-out"
            >
              Sign out
            </button>
          )}
        </header>

        {/* Password gate */}
        {!savedToken && (
          <form
            onSubmit={onUnlock}
            className="rounded-2xl p-7 md:p-9 bg-white max-w-md mx-auto"
            style={{ border: '1px solid #dde3ea', boxShadow: '0 12px 30px -18px rgba(16,42,67,0.2)' }}
            data-testid="admin-gate"
          >
            <div className="flex items-center gap-3 mb-5">
              <Lock size={18} style={{ color: BLUE }} />
              <p className="font-bold text-[15px]" style={{ color: NAVY }}>Restricted access</p>
            </div>
            <label htmlFor="admin-token" className="block text-[13px] font-bold mb-2" style={{ color: NAVY }}>Password</label>
            <input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-md text-[15px] bg-white mb-4"
              style={{ border: '1px solid #cfd6df', color: INK, outlineColor: BLUE }}
              data-testid="admin-password-input"
              autoFocus
            />
            <button
              type="submit"
              className="w-full font-bold px-5 py-3 rounded-lg text-[14.5px] transition-colors"
              style={{ background: NAVY, color: '#ffffff' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1c2e44')}
              onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
              data-testid="admin-unlock"
            >
              Unlock
            </button>
            {state.error && (
              <p className="mt-4 text-[13px] flex items-start gap-2" style={{ color: '#991B1B' }} data-testid="admin-gate-error">
                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" /> {state.error}
              </p>
            )}
          </form>
        )}

        {/* Files list */}
        {savedToken && (
          <>
            {state.loading && (
              <div className="text-center py-16" data-testid="admin-loading">
                <Loader2 size={22} className="animate-spin mx-auto" style={{ color: BLUE }} />
                <p className="mt-3 text-[13.5px]" style={{ color: '#6b7280', ...mono }}>Loading files…</p>
              </div>
            )}
            {state.error && !state.loading && (
              <div className="rounded-lg p-5 flex items-start gap-3" style={{ background: '#FEF2F2', border: '1px solid #dc262633' }} data-testid="admin-error">
                <AlertTriangle size={18} style={{ color: '#dc2626' }} className="flex-shrink-0 mt-0.5" />
                <p className="text-[14px]" style={{ color: '#991B1B' }}>{state.error}</p>
              </div>
            )}
            {state.data && (
              <>
                <div className="rounded-2xl bg-white p-6 md:p-8 mb-8" style={{ border: '1px solid #dde3ea', boxShadow: '0 6px 22px -14px rgba(16,42,67,0.14)' }} data-testid="admin-bucket-card">
                  <p className="uppercase font-bold mb-2" style={{ ...mono, fontSize: '10px', letterSpacing: '0.20em', color: GOLD }}>
                    Bucket · {state.data.bucket}
                  </p>
                  <h2 className="text-xl md:text-2xl font-extrabold mb-2 tracking-tight" style={{ color: NAVY }}>{state.data.title}</h2>
                  <p className="text-[13.5px] leading-[1.65]" style={{ color: '#6b7280' }}>{state.data.description}</p>
                  <p className="mt-3 text-[13px]" style={{ ...mono, color: '#6b7280' }}>Generated {state.data.generated_at} · {state.data.items.length} file(s)</p>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="admin-file-list">
                  {state.data.items.map((f) => {
                    const Icon = iconFor(f.kind);
                    const highlight = f.featured;
                    return (
                      <li
                        key={f.filename}
                        className={`rounded-xl p-4 md:p-5 flex items-start gap-3 transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(16,42,67,0.18)] ${highlight ? 'sm:col-span-2' : ''}`}
                        style={{ border: highlight ? `1.5px solid ${GOLD}` : '1px solid #dde3ea', background: highlight ? 'rgba(201,168,76,0.06)' : '#ffffff' }}
                        data-testid={`admin-file-${f.filename}`}
                      >
                        <div
                          className="flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ width: 38, height: 38, background: highlight ? GOLD : '#EDF2F7', color: highlight ? NAVY : BLUE }}
                        >
                          <Icon size={18} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[14.5px] leading-snug break-words" style={{ color: NAVY }}>{f.label}</p>
                          <p className="text-[11.5px] mt-1 truncate" style={{ ...mono, color: '#6b7280' }}>{f.filename} · {f.size_kb} KB · {f.kind.toUpperCase()}</p>
                          <a
                            href={downloadHref(f.filename)}
                            download={f.filename}
                            className="inline-flex items-center gap-1.5 font-bold text-[13px] mt-2 transition-colors"
                            style={{ color: BLUE }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1F3F80')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = BLUE)}
                            data-testid={`admin-download-${f.filename}`}
                          >
                            <Download size={13} /> Download
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </>
        )}

        <p className="mt-10 text-[12px] text-center" style={{ ...mono, color: '#8896a5' }}>
          Blocked from search indexes via robots.txt. Never shared publicly.
        </p>
      </div>
    </main>
  );
};

export default AdminDownloadsPage;
