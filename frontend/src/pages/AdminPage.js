import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';

const API = process.env.REACT_APP_BACKEND_URL;

const AdminPage = () => {
  const [token, setToken] = useState(localStorage.getItem('gl_admin') || '');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState(null);
  const [tab, setTab] = useState('overview');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (token) fetchStats(token);
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem('gl_admin', data.token);
      setToken(data.token);
    } catch {
      setLoginError('Invalid password');
    }
  };

  const fetchStats = async (t) => {
    try {
      const res = await fetch(`${API}/api/admin/stats?token=${t}`);
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setStats(data);
      setLoggedIn(true);
    } catch {
      logout();
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${API}/api/admin/leads?token=${token}&limit=50`);
      if (res.ok) setLeads(await res.json());
    } catch { /* ignore */ }
  };

  const sendSummary = async () => {
    await fetch(`${API}/api/admin/send-summary?token=${token}`, { method: 'POST' });
    alert('Weekly summary email sent to Vince');
  };

  const logout = () => { localStorage.removeItem('gl_admin'); setToken(''); setLoggedIn(false); setStats(null); setLeads(null); };

  const Stat = ({ label, value, sub }) => (
    <div className="bg-white border border-[#1C2B2B]/10 rounded p-5">
      <p className="text-sm text-[#1C2B2B]/50 mb-1">{label}</p>
      <p className="text-3xl font-bold text-[#1C2B2B]">{value}</p>
      {sub && <p className="text-xs text-[#1C2B2B]/40 mt-1">{sub}</p>}
    </div>
  );

  if (!loggedIn) {
    return (
      <main>
        <SEO title="Admin" canonical="/admin" noindex />
        <section className="py-24" style={{ backgroundColor: '#0D1B2A' }}>
          <div className="container max-w-sm">
            <h1 className="text-2xl font-bold text-white mb-6 text-center" data-testid="admin-login-title">Admin Dashboard</h1>
            <form onSubmit={handleLogin} className="space-y-4" data-testid="admin-login-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded focus:outline-none focus:border-[#C9A84C] placeholder:text-white/30"
                placeholder="Enter admin password"
                data-testid="admin-password"
              />
              {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
              <button
                type="submit"
                className="w-full bg-[#C9A84C] hover:bg-[#B8972C] text-white font-semibold py-3 rounded transition-colors"
                data-testid="admin-login-btn"
              >
                Log In
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <SEO title="Admin Dashboard" canonical="/admin" noindex />
      <section className="py-8 border-b" style={{ backgroundColor: '#0D1B2A' }}>
        <div className="container flex items-center justify-between">
          <h1 className="text-xl font-bold text-white" data-testid="admin-title">GigLine Admin</h1>
          <div className="flex items-center gap-4">
            <button onClick={sendSummary} className="text-sm text-[#C9A84C] hover:text-white transition-colors" data-testid="send-summary-btn">
              Send Weekly Summary
            </button>
            <button onClick={logout} className="text-sm text-white/50 hover:text-white transition-colors" data-testid="admin-logout">
              Log Out
            </button>
          </div>
        </div>
      </section>

      <section className="py-8" style={{ backgroundColor: '#F9F8F6' }}>
        <div className="container">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[#1C2B2B]/10 pb-3" data-testid="admin-tabs">
            {['overview', 'leads', 'downloads'].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === 'leads' && !leads) fetchLeads(); }}
                className={`text-sm font-medium px-3 py-1 rounded transition-colors ${tab === t ? 'bg-[#1C2B2B] text-white' : 'text-[#1C2B2B]/50 hover:text-[#1C2B2B]'}`}
                data-testid={`tab-${t}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && stats && (
            <div data-testid="overview-tab">
              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Leads</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Stat label="Safety Checks (Total)" value={stats.safety_checks.total} sub={`${stats.safety_checks.last_7d} last 7 days`} />
                <Stat label="Walkthrough Requests" value={stats.walkthrough_requests.total} sub={`${stats.walkthrough_requests.last_7d} last 7 days`} />
                <Stat label="Heat Guide Leads" value={stats.heat_guide_leads} />
                <Stat label="Safety Checks (30d)" value={stats.safety_checks.last_30d} />
              </div>

              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Risk Breakdown</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white border-l-4 border-[#c0392b] rounded p-5">
                  <p className="text-sm text-[#1C2B2B]/50">HIGH Risk</p>
                  <p className="text-3xl font-bold text-[#c0392b]" data-testid="high-risk-count">{stats.risk_breakdown.high}</p>
                </div>
                <div className="bg-white border-l-4 border-[#e67e22] rounded p-5">
                  <p className="text-sm text-[#1C2B2B]/50">MEDIUM Risk</p>
                  <p className="text-3xl font-bold text-[#e67e22]" data-testid="medium-risk-count">{stats.risk_breakdown.medium}</p>
                </div>
                <div className="bg-white border-l-4 border-[#27ae60] rounded p-5">
                  <p className="text-sm text-[#1C2B2B]/50">LOW Risk</p>
                  <p className="text-3xl font-bold text-[#27ae60]" data-testid="low-risk-count">{stats.risk_breakdown.low}</p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Downloads</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Stat label="Total Downloads" value={stats.downloads.total} sub={`${stats.downloads.last_7d} last 7 days`} />
                <Stat label="Safety Check PDFs" value={stats.downloads.safety_check_pdfs} />
                <Stat label="HazCom Packs" value={stats.downloads.hazcom_pdfs} />
                <Stat label="Heat Guides" value={stats.downloads.heat_guide} />
                <Stat label="All Downloads (7d)" value={stats.downloads.last_7d} />
              </div>
            </div>
          )}

          {/* ── LEADS TAB ── */}
          {tab === 'leads' && leads && (
            <div data-testid="leads-tab">
              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Safety Check Submissions</h2>
              <div className="bg-white rounded border border-[#1C2B2B]/10 overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1C2B2B] text-white">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Company</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Role</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-center">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.safety_checks.map((lead, i) => (
                      <tr key={i} className="border-b border-[#1C2B2B]/5 hover:bg-[#F9F8F6]">
                        <td className="px-4 py-3 text-[#1C2B2B]/50">{lead.timestamp ? new Date(lead.timestamp).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3 font-medium">{lead.name}</td>
                        <td className="px-4 py-3">{lead.company}</td>
                        <td className="px-4 py-3"><a href={`mailto:${lead.email}`} className="text-[#B8972C] hover:underline">{lead.email}</a></td>
                        <td className="px-4 py-3 text-[#1C2B2B]/50">{lead.role || '—'}</td>
                        <td className="px-4 py-3 text-center font-bold">{lead.score_gaps}/6</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white ${
                            lead.score_level === 'HIGH' ? 'bg-[#c0392b]' : lead.score_level === 'MEDIUM' ? 'bg-[#e67e22]' : 'bg-[#27ae60]'
                          }`}>{lead.score_level}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.safety_checks.length === 0 && <p className="p-6 text-center text-[#1C2B2B]/40">No submissions yet</p>}
              </div>

              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Walkthrough Requests</h2>
              <div className="bg-white rounded border border-[#1C2B2B]/10 overflow-x-auto mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1C2B2B] text-white">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Company</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Location</th>
                      <th className="px-4 py-3 text-left">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.walkthrough_requests.map((lead, i) => (
                      <tr key={i} className="border-b border-[#1C2B2B]/5 hover:bg-[#F9F8F6]">
                        <td className="px-4 py-3 text-[#1C2B2B]/50">{lead.timestamp ? new Date(lead.timestamp).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3 font-medium">{lead.name}</td>
                        <td className="px-4 py-3">{lead.company}</td>
                        <td className="px-4 py-3 text-[#1C2B2B]/50">{lead.operation_type}</td>
                        <td className="px-4 py-3">{lead.location}</td>
                        <td className="px-4 py-3 text-xs text-[#1C2B2B]/40">{lead.utm_source ? `${lead.utm_source}/${lead.utm_medium}` : 'Direct'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.walkthrough_requests.length === 0 && <p className="p-6 text-center text-[#1C2B2B]/40">No requests yet</p>}
              </div>

              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Heat Guide Leads</h2>
              <div className="bg-white rounded border border-[#1C2B2B]/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1C2B2B] text-white">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.heat_guide_leads.map((lead, i) => (
                      <tr key={i} className="border-b border-[#1C2B2B]/5 hover:bg-[#F9F8F6]">
                        <td className="px-4 py-3 text-[#1C2B2B]/50">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-3"><a href={`mailto:${lead.email}`} className="text-[#B8972C] hover:underline">{lead.email}</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.heat_guide_leads.length === 0 && <p className="p-6 text-center text-[#1C2B2B]/40">No leads yet</p>}
              </div>
            </div>
          )}

          {/* ── DOWNLOADS TAB ── */}
          {tab === 'downloads' && (
            <div data-testid="downloads-tab">
              <DownloadsTab token={token} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const DownloadsTab = ({ token }) => {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/downloads?token=${token}&limit=100`);
        if (res.ok) setEvents(await res.json());
      } catch { /* ignore */ }
    })();
  }, [token]);

  if (!events) return <p className="text-[#1C2B2B]/40">Loading...</p>;

  const typeLabel = (t) => t === 'safety_check_pdf' ? 'Safety Check PDF' : t === 'hazcom_pdf' ? 'HazCom Pack' : 'Heat Guide';
  const typeBg = (t) => t === 'safety_check_pdf' ? 'bg-[#1C2B2B]/10' : t === 'hazcom_pdf' ? 'bg-[#B8972C]/10 text-[#8B7222]' : 'bg-[#27ae60]/10 text-[#1a8044]';

  return (
    <>
      <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Recent Downloads</h2>
      <div className="bg-white rounded border border-[#1C2B2B]/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#1C2B2B] text-white">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {events.events.map((ev, i) => (
              <tr key={i} className="border-b border-[#1C2B2B]/5 hover:bg-[#F9F8F6]">
                <td className="px-4 py-3 text-[#1C2B2B]/50">{new Date(ev.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeBg(ev.type)}`}>{typeLabel(ev.type)}</span>
                </td>
                <td className="px-4 py-3 text-[#1C2B2B]/50">{ev.email || ev.submission_id || ev.filename || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.events.length === 0 && <p className="p-6 text-center text-[#1C2B2B]/40">No downloads yet</p>}
      </div>
    </>
  );
};

export default AdminPage;
