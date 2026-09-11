import React, { useEffect, useState, useCallback } from 'react';
import { Lock, ShieldCheck, CheckCircle2, XCircle, TrendingDown, TrendingUp, Minus, AlertTriangle, Plus, RefreshCw } from 'lucide-react';
import SEO from '../components/SEO';
import { authFetch } from '../lib/adminApi';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const BLUE = '#2A52A0';
const CREAM = '#F5F4F0';
const INK = '#1C2B2B';
const GREEN = '#166534';
const RED = '#991B1B';
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const API = process.env.REACT_APP_BACKEND_URL;
const STORAGE_KEY = 'gigline_admin_token';
const ADMIN_PASSWORD = 'gigline2026';

const emptyClient = { code: '', name: '', location: '', industry: '', start_date: '', crv_completed: false, agreement_signed: false, first_cycle_completed: false, notes: '' };
const emptyMonth = { client_code: '', month: '', hours_onsite: 0, hours_prep: 0, hours_remote: 0, hours_meeting: 0, hours_admin: 0, findings_opened: 0, findings_closed: 0, findings_open_at_month_end: 0, satisfaction_score: '', summary_delivered_on_time: true, scope_creep_absorption: 0, overage_change_order: false, notes: '' };

const th = { padding: '8px 10px', textAlign: 'left', background: NAVY, color: '#fff', fontSize: 10.5, letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 700, ...mono };
const td = { padding: '8px 10px', borderBottom: '1px solid #eef0f3', fontSize: 13, verticalAlign: 'top' };

const Pill = ({ ok, warn, children }) => (
  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, ...mono,
    background: ok ? '#EEF7F1' : warn ? '#FFF7E6' : '#FEF2F2',
    color: ok ? GREEN : warn ? '#8B6F1F' : RED }}>
    {children}
  </span>
);

const TrendIcon = ({ trend }) => {
  if (trend === 'declining') return <TrendingDown size={14} style={{ color: GREEN, display: 'inline' }} />;
  if (trend === 'growing') return <TrendingUp size={14} style={{ color: RED, display: 'inline' }} />;
  if (trend === 'flat') return <Minus size={14} style={{ color: '#8B6F1F', display: 'inline' }} />;
  return <span style={{ color: '#94a3b8' }}>-</span>;
};

const AdminPilotPage = () => {
  const [savedToken, setSavedToken] = useState('');
  const [pw, setPw] = useState('');
  const [gateError, setGateError] = useState('');
  const [scorecard, setScorecard] = useState(null);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClient, setShowClient] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [clientForm, setClientForm] = useState(emptyClient);
  const [monthForm, setMonthForm] = useState(emptyMonth);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const t = window.sessionStorage.getItem(STORAGE_KEY) || '';
    if (t) setSavedToken(t);
  }, []);

  const refresh = useCallback(async () => {
    if (!savedToken) return;
    setLoading(true);
    try {
      const [sc, ms] = await Promise.all([
        authFetch(savedToken, `/api/admin/pilot/scorecard`).then((r) => r.json()),
        authFetch(savedToken, `/api/admin/pilot/months`).then((r) => r.json()),
      ]);
      setScorecard(sc);
      setMonths(ms.items || []);
    } catch (e) {
      setSaveMsg('Failed to load. ' + e.message);
    }
    setLoading(false);
  }, [savedToken]);

  useEffect(() => { refresh(); }, [refresh]);

  const onUnlock = (e) => {
    e.preventDefault();
    if (pw !== ADMIN_PASSWORD) { setGateError('Invalid password.'); return; }
    window.sessionStorage.setItem(STORAGE_KEY, pw);
    setSavedToken(pw);
  };

  const saveClient = async () => {
    setSaveMsg('');
    const resp = await fetch(`${API}/api/admin/pilot/client`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: savedToken, ...clientForm, code: clientForm.code.toUpperCase() }),
    });
    if (resp.ok) { setSaveMsg('Saved.'); setShowClient(false); setClientForm(emptyClient); refresh(); }
    else { const body = await resp.json().catch(() => ({})); setSaveMsg('Error: ' + (body.detail || resp.status)); }
  };

  const saveMonth = async () => {
    setSaveMsg('');
    const payload = { token: savedToken, ...monthForm };
    ['hours_onsite','hours_prep','hours_remote','hours_meeting','hours_admin','findings_opened','findings_closed','findings_open_at_month_end','scope_creep_absorption'].forEach(k => { payload[k] = Number(payload[k] || 0); });
    payload.satisfaction_score = monthForm.satisfaction_score === '' ? null : Number(monthForm.satisfaction_score);
    const resp = await fetch(`${API}/api/admin/pilot/month`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (resp.ok) { setSaveMsg('Saved.'); setShowMonth(false); setMonthForm(emptyMonth); refresh(); }
    else { const body = await resp.json().catch(() => ({})); setSaveMsg('Error: ' + (body.detail || resp.status)); }
  };

  if (!savedToken) {
    return (
      <main className="min-h-screen py-16" style={{ background: CREAM }} data-testid="admin-pilot-page">
        <SEO title="Pilot Control Room | GigLine" description="Internal." canonical="/admin/pilot" />
        <div className="container max-w-md px-4">
          <form onSubmit={onUnlock} className="rounded-2xl p-7 bg-white" style={{ border: '1px solid #dde3ea', boxShadow: '0 12px 30px -18px rgba(16,42,67,0.2)' }} data-testid="pilot-gate">
            <div className="flex items-center gap-3 mb-4"><Lock size={18} style={{ color: BLUE }} /><p className="font-bold text-[15px]" style={{ color: NAVY }}>Pilot Control Room</p></div>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-md text-[15px] mb-3" style={{ border: '1px solid #cfd6df' }} data-testid="pilot-password" autoFocus />
            <button type="submit" className="w-full font-bold px-5 py-3 rounded-lg text-[14.5px]" style={{ background: NAVY, color: '#fff' }} data-testid="pilot-unlock">Unlock</button>
            {gateError && <p className="mt-3 text-[13px]" style={{ color: RED }}>{gateError}</p>}
          </form>
        </div>
      </main>
    );
  }

  const agg = scorecard?.aggregate;
  const clients = scorecard?.clients || [];

  return (
    <main className="min-h-screen py-10 md:py-14" style={{ background: CREAM }} data-testid="admin-pilot-page">
      <SEO title="Pilot Control Room | GigLine" description="Internal." canonical="/admin/pilot" />
      <div className="container max-w-6xl px-4">

        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} style={{ color: GOLD }} strokeWidth={2.4} />
            <div>
              <p className="uppercase font-bold" style={{ ...mono, fontSize: 10, letterSpacing: '0.22em', color: GOLD }}>Ongoing Safety Support</p>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none mt-1" style={{ color: NAVY }}>3-Client Pilot</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} disabled={loading} className="text-[13px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5" style={{ color: '#6b7280', border: '1px solid #cfd6df', background: '#fff' }} data-testid="pilot-refresh"><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh</button>
            <button onClick={() => { setClientForm(emptyClient); setShowClient(true); }} className="text-[13px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5" style={{ color: NAVY, background: GOLD }} data-testid="pilot-add-client"><Plus size={13} /> Add client</button>
            <button onClick={() => { setMonthForm({ ...emptyMonth, client_code: clients[0]?.code || '' }); setShowMonth(true); }} className="text-[13px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5" style={{ color: '#fff', background: NAVY }} data-testid="pilot-log-month">Log month</button>
          </div>
        </header>

        {/* Aggregate KPIs */}
        {agg && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" data-testid="pilot-agg-kpis">
            {[
              { label: 'Clients', value: scorecard.clients_count },
              { label: 'Client-months', value: agg.months_logged },
              { label: 'Within 8-hr budget', value: agg.within_budget_pct === null ? '-' : `${agg.within_budget_pct}%`, target: '80% / 60% floor' },
              { label: 'Hours ratio', value: agg.hours_ratio === null ? '-' : `${agg.hours_ratio}x`, target: 'Target ≤ 1.0' },
            ].map((k) => (
              <div key={k.label} className="rounded-xl bg-white p-4" style={{ border: '1px solid #dde3ea' }} data-testid={`kpi-${k.label.replace(/\s/g,'-').toLowerCase()}`}>
                <p className="uppercase font-bold" style={{ ...mono, fontSize: 9.5, letterSpacing: '0.16em', color: '#8B6F1F' }}>{k.label}</p>
                <p className="text-2xl font-extrabold mt-1" style={{ color: NAVY, ...mono }}>{k.value}</p>
                {k.target && <p className="text-[11px] mt-1" style={{ color: '#6b7280' }}>{k.target}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Per-client scorecard */}
        <div className="rounded-2xl bg-white mb-8 overflow-hidden" style={{ border: '1px solid #dde3ea' }} data-testid="pilot-scorecard">
          <div className="px-5 py-4 border-b border-[#eef0f3]">
            <h2 className="text-lg font-extrabold" style={{ color: NAVY }}>Per-client scorecard, 8 metrics</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={th}>Code</th>
                  <th style={th}>Client</th>
                  <th style={th}>Months</th>
                  <th style={th}>1. Within 8 hr</th>
                  <th style={th}>2. Scope creep</th>
                  <th style={th}>3. Satisfaction</th>
                  <th style={th}>4. Findings trend</th>
                  <th style={th}>5. On-time</th>
                  <th style={th}>6. Prereqs</th>
                  <th style={th}>7. CO logged</th>
                  <th style={th}>8. Hours ratio</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 && (
                  <tr><td colSpan={11} style={{ ...td, textAlign: 'center', padding: 30, color: '#6b7280' }}>No clients yet. Click Add client to start.</td></tr>
                )}
                {clients.map((c) => (
                  <tr key={c.code} data-testid={`row-${c.code}`}>
                    <td style={{ ...td, fontWeight: 700, color: NAVY, ...mono }}>{c.code}</td>
                    <td style={td}>{c.name}</td>
                    <td style={{ ...td, ...mono }}>{c.month_count}</td>
                    <td style={td}>{c.within_budget_pct === null ? '-' : <Pill ok={c.within_budget_pct >= 80} warn={c.within_budget_pct >= 60}>{c.within_budget_pct}%</Pill>}</td>
                    <td style={td}>{<Pill ok={c.scope_creep_absorptions <= 1} warn={c.scope_creep_absorptions <= 2}>{c.scope_creep_absorptions}</Pill>}</td>
                    <td style={td}>{c.latest_satisfaction === null ? <span style={{ color: '#94a3b8' }}>-</span> : <Pill ok={c.latest_satisfaction >= 4}>{c.latest_satisfaction}/5</Pill>}</td>
                    <td style={td}><TrendIcon trend={c.findings_trend} /> <span style={{ color: '#6b7280', fontSize: 11 }}>{c.findings_trend || 'need 2+ months'}</span></td>
                    <td style={td}>{c.on_time_pct === null ? '-' : <Pill ok={c.on_time_pct >= 100} warn={c.on_time_pct >= 80}>{c.on_time_pct}%</Pill>}</td>
                    <td style={td}>{c.prerequisites_complete ? <CheckCircle2 size={16} style={{ color: GREEN }} /> : <XCircle size={16} style={{ color: RED }} />}</td>
                    <td style={td}>{c.any_overage_change_order ? <CheckCircle2 size={16} style={{ color: GREEN }} /> : <span style={{ color: '#94a3b8' }}>-</span>}</td>
                    <td style={td}><Pill ok={(c.hours_ratio || 0) <= 1.0} warn={(c.hours_ratio || 0) <= 1.1}>{c.hours_ratio === null ? '-' : `${c.hours_ratio}x`}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Month log */}
        {months.length > 0 && (
          <div className="rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #dde3ea' }} data-testid="pilot-monthlog">
            <div className="px-5 py-4 border-b border-[#eef0f3]"><h2 className="text-lg font-extrabold" style={{ color: NAVY }}>Recent months logged</h2></div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                <thead><tr>
                  <th style={th}>Client</th><th style={th}>Month</th><th style={th}>Hours</th><th style={th}>Findings +/-</th><th style={th}>On-time</th><th style={th}>Overage CO</th><th style={th}>Satis.</th>
                </tr></thead>
                <tbody>
                  {months.slice().reverse().slice(0, 30).map((m, i) => (
                    <tr key={i}>
                      <td style={{ ...td, fontWeight: 700, ...mono }}>{m.client_code}</td>
                      <td style={{ ...td, ...mono }}>{m.month}</td>
                      <td style={td}><Pill ok={!m.over_budget}>{m.total_hours}h</Pill></td>
                      <td style={{ ...td, ...mono }}>+{m.findings_opened} / -{m.findings_closed} (open: {m.findings_open_at_month_end})</td>
                      <td style={td}>{m.summary_delivered_on_time ? '✓' : '✗'}</td>
                      <td style={td}>{m.overage_change_order ? '✓' : '-'}</td>
                      <td style={td}>{m.satisfaction_score ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {saveMsg && <p className="mt-6 text-[13px] px-3 py-2 rounded" style={{ background: saveMsg.startsWith('Error') ? '#FEF2F2' : '#EEF7F1', color: saveMsg.startsWith('Error') ? RED : GREEN }} data-testid="pilot-save-msg">{saveMsg}</p>}

        {/* Add client modal */}
        {showClient && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)', zIndex: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }} onClick={() => setShowClient(false)} data-testid="client-modal">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-lg w-full" style={{ boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5)' }}>
              <h3 className="text-lg font-extrabold mb-4" style={{ color: NAVY }}>Add or update pilot client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[['code','Code (2-8 uppercase)'],['name','Legal name'],['location','City, State'],['industry','Industry'],['start_date','Start date (YYYY-MM-DD)']].map(([k,l]) => (
                  <label key={k} className="text-[12.5px] font-bold" style={{ color: NAVY }}>{l}
                    <input value={clientForm[k]} onChange={(e) => setClientForm({ ...clientForm, [k]: e.target.value })} className="w-full mt-1 px-3 py-2 rounded border border-[#cfd6df] text-[14px] font-normal" data-testid={`client-${k}`} />
                  </label>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[['crv_completed','CRV completed'],['agreement_signed','Agreement signed'],['first_cycle_completed','First-cycle completed']].map(([k,l]) => (
                  <label key={k} className="flex items-center gap-2 text-[13px]" style={{ color: INK }}>
                    <input type="checkbox" checked={clientForm[k]} onChange={(e) => setClientForm({ ...clientForm, [k]: e.target.checked })} data-testid={`client-${k}`} /> {l}
                  </label>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setShowClient(false)} className="px-4 py-2 rounded text-[13px] font-bold" style={{ color: '#6b7280', border: '1px solid #cfd6df' }} data-testid="client-cancel">Cancel</button>
                <button onClick={saveClient} className="px-4 py-2 rounded text-[13px] font-bold" style={{ background: NAVY, color: '#fff' }} data-testid="client-save">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Log month modal */}
        {showMonth && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.6)', zIndex: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }} onClick={() => setShowMonth(false)} data-testid="month-modal">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-2xl w-full" style={{ boxShadow: '0 30px 60px -20px rgba(0,0,0,0.5)' }}>
              <h3 className="text-lg font-extrabold mb-4" style={{ color: NAVY }}>Log service month</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-[12.5px] font-bold" style={{ color: NAVY }}>Client
                  <select value={monthForm.client_code} onChange={(e) => setMonthForm({ ...monthForm, client_code: e.target.value })} className="w-full mt-1 px-3 py-2 rounded border border-[#cfd6df] text-[14px] font-normal" data-testid="month-client">
                    <option value="">Choose</option>
                    {clients.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.name}</option>)}
                  </select>
                </label>
                <label className="text-[12.5px] font-bold" style={{ color: NAVY }}>Month (YYYY-MM)
                  <input value={monthForm.month} onChange={(e) => setMonthForm({ ...monthForm, month: e.target.value })} className="w-full mt-1 px-3 py-2 rounded border border-[#cfd6df] text-[14px] font-normal" placeholder="2026-10" data-testid="month-month" />
                </label>
                {[['hours_onsite','On-site (hr)'],['hours_prep','Prep (hr)'],['hours_remote','Remote (hr)'],['hours_meeting','Mgmt review (hr)'],['hours_admin','Admin (hr)']].map(([k,l]) => (
                  <label key={k} className="text-[12.5px] font-bold" style={{ color: NAVY }}>{l}
                    <input type="number" step="0.25" value={monthForm[k]} onChange={(e) => setMonthForm({ ...monthForm, [k]: e.target.value })} className="w-full mt-1 px-3 py-2 rounded border border-[#cfd6df] text-[14px] font-normal" data-testid={`month-${k}`} />
                  </label>
                ))}
                {[['findings_opened','Findings opened'],['findings_closed','Findings closed'],['findings_open_at_month_end','Open at month-end'],['scope_creep_absorption','Scope-creep absorbed']].map(([k,l]) => (
                  <label key={k} className="text-[12.5px] font-bold" style={{ color: NAVY }}>{l}
                    <input type="number" value={monthForm[k]} onChange={(e) => setMonthForm({ ...monthForm, [k]: e.target.value })} className="w-full mt-1 px-3 py-2 rounded border border-[#cfd6df] text-[14px] font-normal" data-testid={`month-${k}`} />
                  </label>
                ))}
                <label className="text-[12.5px] font-bold" style={{ color: NAVY }}>Satisfaction (1-5, blank if not surveyed)
                  <input type="number" min="1" max="5" value={monthForm.satisfaction_score} onChange={(e) => setMonthForm({ ...monthForm, satisfaction_score: e.target.value })} className="w-full mt-1 px-3 py-2 rounded border border-[#cfd6df] text-[14px] font-normal" data-testid="month-satisfaction" />
                </label>
              </div>
              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={monthForm.summary_delivered_on_time} onChange={(e) => setMonthForm({ ...monthForm, summary_delivered_on_time: e.target.checked })} data-testid="month-ontime" /> Summary delivered on time</label>
                <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={monthForm.overage_change_order} onChange={(e) => setMonthForm({ ...monthForm, overage_change_order: e.target.checked })} data-testid="month-co" /> A written overage/change order was executed this month</label>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setShowMonth(false)} className="px-4 py-2 rounded text-[13px] font-bold" style={{ color: '#6b7280', border: '1px solid #cfd6df' }} data-testid="month-cancel">Cancel</button>
                <button onClick={saveMonth} className="px-4 py-2 rounded text-[13px] font-bold" style={{ background: NAVY, color: '#fff' }} data-testid="month-save">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPilotPage;
