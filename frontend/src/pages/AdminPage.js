import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, ChevronRight, Eye, RefreshCw, FileText, Users, Briefcase, DollarSign, Clock, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';
import WalkthroughLeadsCRM from '../components/WalkthroughLeadsCRM';

const API = process.env.REACT_APP_BACKEND_URL;

const STATUS_COLORS = {
  intake_received: 'bg-gray-500', proposal_sent: 'bg-yellow-500', agreement_signed: 'bg-blue-500',
  payment_confirmed: 'bg-green-500', walkthrough_scheduled: 'bg-green-600', report_delivered: 'bg-emerald-500',
};
const STATUS_LABELS = {
  intake_received: 'Intake Received', proposal_sent: 'Proposal Sent', agreement_signed: 'Agreement Signed',
  payment_confirmed: 'Payment Confirmed', walkthrough_scheduled: 'Walkthrough Scheduled', report_delivered: 'Report Delivered',
};
const URGENCY_COLORS = { asap: 'bg-red-500 text-white', '30_days': 'bg-yellow-500 text-black', '60_90': 'bg-gray-400 text-black', info: 'bg-gray-300 text-gray-600' };
const URGENCY_LABELS = { asap: 'ASAP', '30_days': '30 days', '60_90': '60-90 days', info: 'Info' };

const Badge = ({ color, children }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{children}</span>
);

/* ── Attribution summary helper ── */
const summarizeAttribution = (attribution) => {
  if (!attribution || typeof attribution !== 'object') return null;
  const first = attribution.firstTouch || {};
  const src = first.utm_source;
  const med = first.utm_medium;
  const camp = first.utm_campaign;
  if (!src) return null;
  if (med === 'cpc' || first.gclid) return { label: src === 'google' ? 'Google Ads' : `${src} (paid)`, campaign: camp, tone: 'paid' };
  if (med === 'paid_social' || first.fbclid) return { label: `${src} (ads)`, campaign: camp, tone: 'paid' };
  if (med === 'referral') return { label: src, campaign: null, tone: 'referral' };
  if (med === 'email') return { label: `${src} (email)`, campaign: camp, tone: 'email' };
  return { label: src, campaign: camp, tone: 'organic' };
};

const SourceCell = ({ attribution, referralSource }) => {
  const s = summarizeAttribution(attribution);
  if (s) {
    const toneColor = {
      paid: 'bg-purple-100 text-purple-700',
      referral: 'bg-blue-100 text-blue-700',
      email: 'bg-teal-100 text-teal-700',
      organic: 'bg-gray-100 text-gray-700',
    }[s.tone] || 'bg-gray-100 text-gray-700';
    return (
      <div>
        <Badge color={toneColor}>{s.label}</Badge>
        {s.campaign && <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[140px]" title={s.campaign}>{s.campaign}</p>}
      </div>
    );
  }
  if (referralSource) return <span className="text-[11px] text-gray-500">{referralSource}</span>;
  return <span className="text-[10px] text-gray-300">Direct</span>;
};

const AdminPage = () => {
  const [token, setToken] = useState(localStorage.getItem('gl_admin') || '');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('portal');

  // Data
  const [portalStats, setPortalStats] = useState(null);
  const [intakes, setIntakes] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState(null);
  const [sourcesData, setSourcesData] = useState(null);

  // Modals/drawers
  const [viewItem, setViewItem] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [uploadModal, setUploadModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  // Admin tools state
  const [revenueModal, setRevenueModal] = useState(false);
  const [revenueForm, setRevenueForm] = useState({ amount: '', service: '', paymentMethod: 'check', clientToken: '', notes: '' });
  const [revenueSubmitting, setRevenueSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ kind: 'intake', docId: '', hard: false });
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [toolbarMessage, setToolbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Case-insensitive multi-field text match for admin search.
  const matchesSearch = (item, query, fields) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return fields.some(f => {
      const v = item?.[f];
      return v && String(v).toLowerCase().includes(q);
    });
  };

  const submitRevenue = async () => {
    if (!revenueForm.amount || Number(revenueForm.amount) <= 0) {
      setToolbarMessage('Amount must be greater than zero');
      return;
    }
    setRevenueSubmitting(true);
    try {
      const res = await fetch(`${API}/api/admin/revenue/manual?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(revenueForm.amount),
          service: revenueForm.service,
          paymentMethod: revenueForm.paymentMethod,
          clientToken: revenueForm.clientToken || null,
          notes: revenueForm.notes,
        }),
      });
      if (res.ok) {
        setToolbarMessage(`Revenue $${Number(revenueForm.amount).toLocaleString()} added ✓`);
        setRevenueModal(false);
        setRevenueForm({ amount: '', service: '', paymentMethod: 'check', clientToken: '', notes: '' });
        fetchAll(token);
      } else {
        const err = await res.json().catch(() => ({}));
        setToolbarMessage(`Error: ${err.detail || res.status}`);
      }
    } catch (e) {
      setToolbarMessage(`Error: ${e.message}`);
    }
    setRevenueSubmitting(false);
  };

  const submitDelete = async () => {
    if (!deleteForm.docId) { setToolbarMessage('Paste a clientToken or ID first'); return; }
    if (!window.confirm(`${deleteForm.hard ? 'PERMANENTLY DELETE' : 'Archive'} ${deleteForm.kind} '${deleteForm.docId}'?`)) return;
    setDeleteSubmitting(true);
    try {
      const res = await fetch(
        `${API}/api/admin/lead/${deleteForm.kind}/${encodeURIComponent(deleteForm.docId)}?token=${token}${deleteForm.hard ? '&hard=true' : ''}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        const d = await res.json();
        setToolbarMessage(`Deleted ${deleteForm.kind} (${d.archived ? 'archived' : 'permanent'}) ✓`);
        setDeleteModal(false);
        setDeleteForm({ kind: 'intake', docId: '', hard: false });
        fetchAll(token);
      } else {
        const err = await res.json().catch(() => ({}));
        setToolbarMessage(`Error: ${err.detail || res.status}`);
      }
    } catch (e) {
      setToolbarMessage(`Error: ${e.message}`);
    }
    setDeleteSubmitting(false);
  };

  const logout = () => { localStorage.removeItem('gl_admin'); setToken(''); setLoggedIn(false); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem('gl_admin', data.token);
      setToken(data.token);
    } catch { setLoginError('Invalid password'); }
  };

  const fetchAll = useCallback(async (t) => {
    try {
      const [psRes, iRes, bRes, sRes, srcRes] = await Promise.all([
        fetch(`${API}/api/admin/portal-stats?token=${t}`),
        fetch(`${API}/api/admin/intake-submissions?token=${t}`),
        fetch(`${API}/api/admin/bookings?token=${t}`),
        fetch(`${API}/api/admin/stats?token=${t}`),
        fetch(`${API}/api/admin/leads-by-source?token=${t}`),
      ]);
      if (psRes.status === 401) { logout(); return; }
      setPortalStats(await psRes.json());
      setIntakes(await iRes.json());
      setBookings(await bRes.json());
      setStats(await sRes.json());
      setSourcesData(srcRes.ok ? await srcRes.json() : null);
      setLoggedIn(true);
    } catch { logout(); }
  }, []);

  useEffect(() => { if (token) fetchAll(token); }, [token, fetchAll]);

  const fetchLeads = async () => {
    const res = await fetch(`${API}/api/admin/leads?token=${token}&limit=50`);
    if (res.ok) setLeads(await res.json());
  };

  const handleStatusUpdate = async () => {
    if (!statusModal || !newStatus) return;
    await fetch(`${API}/api/admin/intake/${statusModal.clientToken}/status?token=${token}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }),
    });
    setStatusModal(null);
    setNewStatus('');
    fetchAll(token);
  };

  // Inline per-row delete: archives the lead by default (recoverable). Hold Shift while clicking for hard delete.
  const deleteRowInline = async (kind, docId, label, e) => {
    if (!docId) { setToolbarMessage('Cannot delete — missing identifier'); return; }
    const isHard = e?.shiftKey === true;
    const verb = isHard ? 'PERMANENTLY DELETE' : 'Archive';
    if (!window.confirm(`${verb} this lead?\n\n${label}\n\n${isHard ? '⚠ Permanent — cannot be undone.' : 'Recoverable from the archive collection if needed.'}`)) return;
    try {
      const res = await fetch(
        `${API}/api/admin/lead/${kind}/${encodeURIComponent(docId)}?token=${token}${isHard ? '&hard=true' : ''}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        const d = await res.json();
        setToolbarMessage(`Deleted lead (${d.archived ? 'archived' : 'permanent'}) ✓`);
        fetchAll(token);
        if (kind === 'safety_check' || kind === 'walkthrough') fetchLeads();
      } else {
        const d = await res.json().catch(() => ({}));
        setToolbarMessage(`Delete failed: ${d.detail || res.status}`);
      }
    } catch (err) {
      setToolbarMessage(`Delete error: ${err.message}`);
    }
  };

  const handleReportUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadModal) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    await fetch(`${API}/api/admin/intake/${uploadModal.clientToken}/report?token=${token}`, { method: 'POST', body: fd });
    setUploading(false);
    setUploadModal(null);
    fetchAll(token);
  };

  const sendSummary = async () => {
    await fetch(`${API}/api/admin/send-summary?token=${token}`, { method: 'POST' });
    alert('Weekly summary sent');
  };

  const getTier = (emp) => {
    const n = emp || 0;
    if (n <= 75) return 'Small';
    if (n <= 250) return 'Medium';
    return 'Large';
  };

  const getFlags = (item) => {
    const flags = [];
    if ((item.helpNeeded || []).includes('Build or clean up written safety programs')) flags.push('W');
    if (item.additionalLocations === '4+') flags.push('C');
    else if (item.additionalLocations === '2-3') flags.push('M');
    const sched = item.schedule || '';
    const detail = item.scheduleDetail || {};
    if ((sched === '2_shifts' || sched === '3_shifts') && (detail.shiftsToInclude || []).includes('All shifts (may require multiple visits)')) flags.push('M');
    if (sched === '12hr_rotating' && (detail.rotationsToInclude || []).includes('All rotations (multiple visits)')) flags.push('M');
    return [...new Set(flags)];
  };

  /* ── Login Screen ── */
  if (!loggedIn) return (
    <main>
      <SEO title="Admin" canonical="/admin" noindex />
      <section className="min-h-screen flex items-center justify-center" style={{ background: '#2A52A0' }}>
        <div className="w-full max-w-sm px-4">
          <h1 className="text-2xl font-bold text-white mb-6 text-center" data-testid="admin-login-title">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4" data-testid="admin-login-form">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/15 text-white rounded-lg focus:outline-none focus:border-[#C9A84C] placeholder:text-white/30"
              placeholder="Enter admin password" data-testid="admin-password" />
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-[#C9A84C] hover:bg-[#B8972C] text-white font-semibold py-3 rounded-lg transition-colors" data-testid="admin-login-btn">Log In</button>
          </form>
        </div>
      </section>
    </main>
  );

  const TABS = [
    { id: 'portal', label: 'Portal', icon: <Briefcase size={14} /> },
    { id: 'intakes', label: 'Intake Submissions', icon: <FileText size={14} /> },
    { id: 'bookings', label: 'Bookings', icon: <DollarSign size={14} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={14} /> },
    { id: 'downloads', label: 'Downloads', icon: <Clock size={14} /> },
  ];

  /* ── Dashboard ── */
  return (
    <main className="min-h-screen" style={{ background: '#F4F3F1' }}>
      <SEO title="Admin Dashboard" canonical="/admin" noindex />

      {/* Top bar */}
      <div className="sticky top-0 z-40" style={{ background: '#2A52A0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between py-3">
          <h1 className="text-base font-bold text-white flex items-center gap-2" data-testid="admin-title">
            <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ background: '#C9A84C', color: '#111' }}>G</span>
            GigLine Admin
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={sendSummary} className="text-xs text-[#C9A84C] hover:text-white transition-colors hidden md:block" data-testid="send-summary-btn">Send Weekly Summary</button>
            <button onClick={() => fetchAll(token)} className="text-white/40 hover:text-white transition-colors"><RefreshCw size={14} /></button>
            <button onClick={logout} className="text-xs text-white/40 hover:text-white transition-colors" data-testid="admin-logout">Log Out</button>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      {portalStats && (
        <div className="border-b" style={{ background: '#fff', borderColor: '#e5e5e5' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4" data-testid="portal-summary-strip">
              {[
                { label: 'Intakes this month', value: portalStats.intakeThisMonth },
                { label: 'Pending proposals', value: portalStats.pendingProposals },
                { label: 'Confirmed bookings', value: portalStats.confirmedBookings },
                { label: 'Reports delivered', value: portalStats.reportsDelivered },
                { label: 'Revenue this month', value: `$${(portalStats.revenueThisMonth || 0).toLocaleString()}`, gold: true },
              ].map((s, i) => (
                <div key={i} className="text-center md:text-left">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className={`text-xl font-bold ${s.gold ? 'text-[#B8972C]' : 'text-[#1C2B2B]'}`} data-testid={`stat-${i}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Admin Toolbar — Search / Export CSV / Add Revenue / Delete Lead */}
      <div className="border-b bg-white" style={{ borderColor: '#e5e5e5' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3 flex-wrap" data-testid="admin-toolbar">
          {/* Global search */}
          <div className="relative flex-shrink-0" data-testid="admin-search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, name, email..."
              className="pl-7 pr-7 py-1.5 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#2A52A0] w-60"
              data-testid="admin-search-input"
              aria-label="Search leads, intakes, bookings"
            />
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" strokeWidth="2"/><path strokeWidth="2" strokeLinecap="round" d="m21 21-4.3-4.3"/></svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
                data-testid="admin-search-clear"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <div className="border-l border-gray-200 h-5 mx-1" />
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mr-2">Tools</span>
          {/* Export CSV downloads */}
          <a
            href={`${API}/api/admin/export/intake.csv?token=${token}`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
            style={{ background: '#f3f4f6', color: '#1C2B2B', border: '1px solid #e5e7eb' }}
            data-testid="export-intake-csv"
          >
            <FileText size={13} /> Export Intakes (CSV)
          </a>
          <a
            href={`${API}/api/admin/export/walkthrough.csv?token=${token}`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
            style={{ background: '#f3f4f6', color: '#1C2B2B', border: '1px solid #e5e7eb' }}
            data-testid="export-walkthrough-csv"
          >
            <FileText size={13} /> Walkthroughs (CSV)
          </a>
          <a
            href={`${API}/api/admin/export/revenue.csv?token=${token}`}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
            style={{ background: '#fef9e7', color: '#1C2B2B', border: '1px solid #f5e6a8' }}
            data-testid="export-revenue-csv"
          >
            <DollarSign size={13} /> Revenue (CSV)
          </a>
          <div className="border-l border-gray-200 h-5 mx-1" />
          {/* Add Manual Revenue */}
          <button
            onClick={() => setRevenueModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors text-white"
            style={{ background: '#16a34a' }}
            data-testid="add-revenue-btn"
          >
            <DollarSign size={13} /> Add Revenue
          </button>
          {/* Delete Lead */}
          <button
            onClick={() => setDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors text-white"
            style={{ background: '#dc2626' }}
            data-testid="delete-lead-btn"
          >
            <X size={13} /> Delete Lead
          </button>
          {toolbarMessage && (
            <span
              className="text-xs ml-auto"
              style={{ color: toolbarMessage.startsWith('Error') ? '#dc2626' : '#16a34a' }}
              data-testid="toolbar-message"
            >
              {toolbarMessage}
            </span>
          )}
        </div>
      </div>

      {/* ── Add Manual Revenue Modal ── */}
      {revenueModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" data-testid="revenue-modal">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1C2B2B]">Add Manual Revenue</h3>
              <button onClick={() => setRevenueModal(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Amount (USD) *</label>
                <input type="number" min="0" step="0.01" value={revenueForm.amount} onChange={(e) => setRevenueForm({ ...revenueForm, amount: e.target.value })} placeholder="1500" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" data-testid="revenue-amount" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Service</label>
                <input type="text" value={revenueForm.service} onChange={(e) => setRevenueForm({ ...revenueForm, service: e.target.value })} placeholder="e.g. Safety Walkthrough" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" data-testid="revenue-service" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Payment Method</label>
                <select value={revenueForm.paymentMethod} onChange={(e) => setRevenueForm({ ...revenueForm, paymentMethod: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" data-testid="revenue-payment-method">
                  <option value="check">Check</option>
                  <option value="ACH">ACH / Wire</option>
                  <option value="cash">Cash</option>
                  <option value="stripe_offline">Stripe (offline)</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Linked Client Token (optional)</label>
                <input type="text" value={revenueForm.clientToken} onChange={(e) => setRevenueForm({ ...revenueForm, clientToken: e.target.value })} placeholder="cln_abc123" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" data-testid="revenue-client-token" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Notes</label>
                <textarea value={revenueForm.notes} onChange={(e) => setRevenueForm({ ...revenueForm, notes: e.target.value })} rows="2" placeholder="Optional context" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" data-testid="revenue-notes" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <button onClick={submitRevenue} disabled={revenueSubmitting} className="flex-1 px-4 py-2 bg-[#16a34a] text-white font-semibold rounded text-sm disabled:opacity-50" data-testid="revenue-submit">
                {revenueSubmitting ? 'Saving…' : 'Save Revenue'}
              </button>
              <button onClick={() => setRevenueModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Lead Modal ── */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" data-testid="delete-modal">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1C2B2B]">Delete Lead</h3>
              <button onClick={() => setDeleteModal(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Soft-delete copies the record to <code className="bg-gray-100 px-1 rounded">&lt;collection&gt;_archive</code> first (recoverable). Hard-delete removes it permanently.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Collection</label>
                <select value={deleteForm.kind} onChange={(e) => setDeleteForm({ ...deleteForm, kind: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" data-testid="delete-kind">
                  <option value="intake">Intake (gl_intake_submissions)</option>
                  <option value="walkthrough">Walkthrough requests</option>
                  <option value="safety_check">Safety check (90-second)</option>
                  <option value="heat_guide">Heat guide leads</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Client Token or Record ID *</label>
                <input type="text" value={deleteForm.docId} onChange={(e) => setDeleteForm({ ...deleteForm, docId: e.target.value })} placeholder="paste clientToken or id" className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono" data-testid="delete-doc-id" />
              </div>
              <label className="flex items-center gap-2 text-xs text-red-600 font-semibold cursor-pointer">
                <input type="checkbox" checked={deleteForm.hard} onChange={(e) => setDeleteForm({ ...deleteForm, hard: e.target.checked })} data-testid="delete-hard" />
                Permanent delete (skip archive — irreversible)
              </label>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <button onClick={submitDelete} disabled={deleteSubmitting} className="flex-1 px-4 py-2 bg-[#dc2626] text-white font-semibold rounded text-sm disabled:opacity-50" data-testid="delete-submit">
                {deleteSubmitting ? 'Deleting…' : (deleteForm.hard ? 'Permanently Delete' : 'Archive & Delete')}
              </button>
              <button onClick={() => setDeleteModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex gap-1 pt-4 pb-0 overflow-x-auto" data-testid="admin-tabs">
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => { setTab(t.id); if (t.id === 'leads' && !leads) fetchLeads(); }}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-t-lg transition-colors whitespace-nowrap ${tab === t.id ? 'bg-white text-[#1C2B2B] border border-b-0 border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              data-testid={`tab-${t.id}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="bg-white rounded-b-lg rounded-tr-lg border border-gray-200 p-4 md:p-6 min-h-[400px]">

          {/* ── PORTAL OVERVIEW ── */}
          {tab === 'portal' && stats && (
            <div data-testid="portal-tab">
              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Website Leads</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                  { l: 'Safety Checks', v: stats.safety_checks.total, s: `${stats.safety_checks.last_7d} last 7d` },
                  { l: 'Walkthrough Requests', v: stats.walkthrough_requests.total, s: `${stats.walkthrough_requests.last_7d} last 7d` },
                  { l: 'Heat Guide Leads', v: stats.heat_guide_leads },
                  { l: 'Downloads (7d)', v: stats.downloads.last_7d },
                ].map((s, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">{s.l}</p>
                    <p className="text-2xl font-bold text-[#1C2B2B]">{s.v}</p>
                    {s.s && <p className="text-[10px] text-gray-300 mt-0.5">{s.s}</p>}
                  </div>
                ))}
              </div>

              {/* ── Quick Contact micro-form tile (GL-WEB-018) ── */}
              {stats.quick_contacts && (
                <div
                  className="mb-8 border border-[#B8972C]/30 rounded-lg p-5 bg-gradient-to-br from-[#fdfbf5] to-white"
                  data-testid="quick-contact-tile"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h2 className="text-base font-bold text-[#1C2B2B]">Quick-Contact Micro-Form</h2>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                      Low-friction path
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="qc-total">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.quick_contacts.total}</p>
                    </div>
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="qc-7d">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Last 7d</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.quick_contacts.last_7d}</p>
                    </div>
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="qc-30d">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Last 30d</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.quick_contacts.last_30d}</p>
                    </div>
                    <div className="border-l-4 border-green-500 rounded-md p-3 bg-green-50" data-testid="qc-converted">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Converted</p>
                      <p className="text-2xl font-bold text-green-700">{stats.quick_contacts.converted}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">to intake / walkthrough</p>
                    </div>
                    <div className="border-l-4 border-[#B8972C] rounded-md p-3 bg-[#fdf8e7]" data-testid="qc-conversion-rate">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Conv. Rate</p>
                      <p className="text-2xl font-bold text-[#7a5d0a]">{stats.quick_contacts.conversion_rate}%</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">QC → full lead</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-3 leading-snug">
                    Conversion = quick-contact email/phone later matched in a full intake or walkthrough request. Tracks whether the micro-form converts cold prospects or just shifts entry points.
                  </p>
                </div>
              )}

              {/* ── Sample Report download tile (GL-WEB-020) ── */}
              {stats.sample_reports && (
                <div
                  className="mb-8 border border-[#2A52A0]/30 rounded-lg p-5 bg-gradient-to-br from-[#f4f8fc] to-white"
                  data-testid="sample-report-tile"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h2 className="text-base font-bold text-[#1C2B2B]">Sample Compliance Report</h2>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                      Email-gated lead magnet
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="sr-total">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.sample_reports.total}</p>
                    </div>
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="sr-7d">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Last 7d</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.sample_reports.last_7d}</p>
                    </div>
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="sr-30d">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Last 30d</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.sample_reports.last_30d}</p>
                    </div>
                    <div className="border-l-4 border-green-500 rounded-md p-3 bg-green-50" data-testid="sr-converted">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Converted</p>
                      <p className="text-2xl font-bold text-green-700">{stats.sample_reports.converted}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">to intake / walkthrough</p>
                    </div>
                    <div className="border-l-4 border-[#2A52A0] rounded-md p-3 bg-[#f4f8fc]" data-testid="sr-conversion-rate">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Conv. Rate</p>
                      <p className="text-2xl font-bold text-[#1F3F80]">{stats.sample_reports.conversion_rate}%</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">SR → full lead</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-3 leading-snug">
                    Conversion = sample report download email later matched in a full intake or walkthrough request. High-intent leads — expect a higher conversion rate here than other email magnets.
                  </p>
                </div>
              )}

              {/* ── HR OSHA Inspection Guide tile (GL-WEB-021) ── */}
              {stats.hr_osha_guide && (
                <div
                  className="mb-8 border border-emerald-300/40 rounded-lg p-5 bg-gradient-to-br from-emerald-50 to-white"
                  data-testid="hr-osha-guide-tile"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h2 className="text-base font-bold text-[#1C2B2B]">OSHA Inspection Guide — HR &amp; Safety Leaders</h2>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                      HR-targeted lead magnet
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="hr-total">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.hr_osha_guide.total}</p>
                    </div>
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="hr-7d">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Last 7d</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.hr_osha_guide.last_7d}</p>
                    </div>
                    <div className="border border-gray-100 rounded-md p-3 bg-white" data-testid="hr-30d">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Last 30d</p>
                      <p className="text-2xl font-bold text-[#1C2B2B]">{stats.hr_osha_guide.last_30d}</p>
                    </div>
                    <div className="border-l-4 border-green-500 rounded-md p-3 bg-green-50" data-testid="hr-converted">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Converted</p>
                      <p className="text-2xl font-bold text-green-700">{stats.hr_osha_guide.converted}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">to intake / walkthrough</p>
                    </div>
                    <div className="border-l-4 border-emerald-600 rounded-md p-3 bg-emerald-50" data-testid="hr-conversion-rate">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Conv. Rate</p>
                      <p className="text-2xl font-bold text-emerald-700">{stats.hr_osha_guide.conversion_rate}%</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">HR Guide → full lead</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-3 leading-snug">
                    Conversion = HR Inspection Guide download email later matched in a full intake or walkthrough request. The HR / safety-coordinator audience tends to be the early-warning channel into a buying org — watch for converters here moving up the decision chain.
                  </p>
                </div>
              )}

              <h2 className="text-lg font-bold text-[#1C2B2B] mb-3">Risk Breakdown</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: 'HIGH', v: stats.risk_breakdown.high, c: 'border-red-500 text-red-600' },
                  { l: 'MEDIUM', v: stats.risk_breakdown.medium, c: 'border-orange-400 text-orange-500' },
                  { l: 'LOW', v: stats.risk_breakdown.low, c: 'border-green-500 text-green-600' },
                ].map((r, i) => (
                  <div key={i} className={`border-l-4 ${r.c} rounded-lg p-4 bg-gray-50`}>
                    <p className="text-xs text-gray-400">{r.l} Risk</p>
                    <p className={`text-2xl font-bold`}>{r.v}</p>
                  </div>
                ))}
              </div>

              {/* ── Conversions by Source ── */}
              {stats.lead_sources_30d && stats.lead_sources_30d.length > 0 && (
                <div className="mt-10" data-testid="lead-sources-30d">
                  <div className="flex items-baseline justify-between mb-3">
                    <h2 className="text-lg font-bold text-[#1C2B2B]">Sources — Last 30 Days</h2>
                    <p className="text-xs text-gray-400">{stats.lead_sources_30d.reduce((sum, s) => sum + s.count, 0)} leads</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {stats.lead_sources_30d.map((s, i) => {
                      const maxC = Math.max(...stats.lead_sources_30d.map(x => x.count), 1);
                      const barWidth = (s.count / maxC) * 100;
                      const isReviewCTA = ['case-study', 'thankyou-intake', 'footer'].includes(s.source);
                      return (
                        <div
                          key={i}
                          className="border border-gray-100 rounded-lg p-3 bg-white"
                          data-testid={`source-30d-${s.source}`}
                        >
                          <p className={`text-[10px] font-medium uppercase tracking-wider truncate ${isReviewCTA ? 'text-[#B8972C]' : 'text-gray-400'}`}>
                            {s.source}
                          </p>
                          <p className="text-xl font-bold text-[#1C2B2B] mt-0.5">{s.count}</p>
                          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${barWidth}%`, backgroundColor: isReviewCTA ? '#B8972C' : '#9ca3af' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-300 mt-2">First-touch UTM source across full intakes + walkthrough requests. Gold = review-CTA surfaces.</p>
                </div>
              )}

              {/* ── Conversions by Source (all-time) ── */}
              {sourcesData && sourcesData.sources && sourcesData.sources.length > 0 && (
                <div className="mt-10" data-testid="leads-by-source">
                  <div className="flex items-baseline justify-between mb-3">
                    <h2 className="text-lg font-bold text-[#1C2B2B]">Conversions by Source — All Time</h2>
                    <p className="text-xs text-gray-400">
                      {sourcesData.totals.total_leads} leads · {sourcesData.totals.total_reports_delivered} converted · ${(sourcesData.totals.total_revenue || 0).toLocaleString()} revenue
                    </p>
                  </div>
                  <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-2.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider">Source</th>
                          <th className="px-4 py-2.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider text-right">Leads</th>
                          <th className="px-4 py-2.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider text-right">Converted</th>
                          <th className="px-4 py-2.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider text-right">Conv. Rate</th>
                          <th className="px-4 py-2.5 text-[11px] font-medium text-gray-500 uppercase tracking-wider text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sourcesData.sources.map((s, i) => {
                          const toneColor = {
                            paid: 'bg-purple-100 text-purple-700',
                            referral: 'bg-blue-100 text-blue-700',
                            email: 'bg-teal-100 text-teal-700',
                            organic: 'bg-gray-100 text-gray-700',
                            direct: 'bg-gray-100 text-gray-500',
                          }[s.tone] || 'bg-gray-100 text-gray-700';
                          const convRate = s.leads > 0 ? ((s.reports_delivered / s.leads) * 100).toFixed(0) : '0';
                          const barMax = Math.max(...sourcesData.sources.map(x => x.leads), 1);
                          const barWidth = (s.leads / barMax) * 100;
                          return (
                            <tr key={i} className="border-t border-gray-100" data-testid={`source-row-${i}`}>
                              <td className="px-4 py-3">
                                <Badge color={toneColor}>{s.source}</Badge>
                                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[200px]">
                                  <div
                                    className="h-full rounded-full"
                                    style={{ width: `${barWidth}%`, backgroundColor: s.tone === 'paid' ? '#a855f7' : s.tone === 'referral' ? '#3b82f6' : s.tone === 'email' ? '#14b8a6' : '#9ca3af' }}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-[#1C2B2B]">{s.leads}</td>
                              <td className="px-4 py-3 text-right font-medium text-gray-600">{s.reports_delivered}</td>
                              <td className="px-4 py-3 text-right text-gray-500">{convRate}%</td>
                              <td className="px-4 py-3 text-right font-bold text-[#B8972C]">${(s.revenue || 0).toLocaleString()}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-2">Revenue counted from paid bookings linked via clientToken. Conversion = report delivered.</p>
                </div>
              )}
            </div>
          )}

          {/* ── INTAKE SUBMISSIONS ── */}
          {tab === 'intakes' && (
            <div data-testid="intakes-tab">
              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Intake Submissions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="intakes-table">
                  <thead>
                    <tr className="bg-[#2A52A0] text-white text-left">
                      <th className="px-3 py-2.5 text-xs font-medium">Submitted</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Company</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Contact</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Source</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Tier</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Status</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Urgency</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Flags</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(intakes || []).map((item, i) => {
                      const flags = getFlags(item);
                      return (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`intake-row-${i}`}>
                          <td className="px-3 py-3 text-xs text-gray-400">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : '—'}</td>
                          <td className="px-3 py-3 font-medium text-[#1C2B2B]">{item.company || '—'}</td>
                          <td className="px-3 py-3 text-gray-500">{item.contactName || '—'}</td>
                          <td className="px-3 py-3 text-xs">
                            <SourceCell attribution={item.attribution} referralSource={item.referralSource} />
                          </td>
                          <td className="px-3 py-3 text-xs">{getTier(item.totalEmployees)}</td>
                          <td className="px-3 py-3">
                            <Badge color={`${STATUS_COLORS[item.status] || 'bg-gray-400'} text-white`}>
                              {STATUS_LABELS[item.status] || item.status || 'Unknown'}
                            </Badge>
                          </td>
                          <td className="px-3 py-3">
                            {item.urgency && <Badge color={URGENCY_COLORS[item.urgency] || 'bg-gray-300 text-gray-600'}>{URGENCY_LABELS[item.urgency] || item.urgency}</Badge>}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1">
                              {flags.includes('W') && <Badge color="bg-purple-100 text-purple-700">W</Badge>}
                              {flags.includes('M') && <Badge color="bg-blue-100 text-blue-700">M</Badge>}
                              {flags.includes('C') && <Badge color="bg-red-100 text-red-700">C</Badge>}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => setViewItem(item)} className="text-[10px] font-medium px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1" data-testid={`view-intake-${i}`}>
                                <Eye size={10} /> View
                              </button>
                              <button onClick={() => { setStatusModal(item); setNewStatus(item.status || 'intake_received'); }} className="text-[10px] font-medium px-2 py-1 rounded border border-[#C9A84C] text-[#B8972C] hover:bg-[#C9A84C]/10 transition-colors" data-testid={`update-status-${i}`}>
                                Status
                              </button>
                              {item.clientToken && !item.reportUrl && (
                                <button onClick={() => setUploadModal(item)} className="text-[10px] font-medium px-2 py-1 rounded border border-green-400 text-green-600 hover:bg-green-50 transition-colors flex items-center gap-1" data-testid={`upload-report-${i}`}>
                                  <Upload size={10} /> Report
                                </button>
                              )}
                              {item.reportUrl && <Badge color="bg-emerald-100 text-emerald-700">Delivered</Badge>}
                              {(item.clientToken || item.id) && (
                                <button
                                  onClick={(e) => deleteRowInline('intake', item.clientToken || item.id, `${item.company || 'Unknown'} — ${item.contactName || item.email || item.clientToken || item.id}`, e)}
                                  className="text-[10px] font-medium px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors flex items-center gap-1"
                                  title="Click to archive · Shift+Click to permanently delete"
                                  data-testid={`delete-intake-${i}`}
                                >
                                  <Trash2 size={10} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {(!intakes || intakes.length === 0) && <p className="py-8 text-center text-gray-300">No intake submissions yet</p>}
              </div>
              <p className="text-[10px] text-gray-300 mt-3">Flags: W = Written programs requested · M = Multi-visit likely · C = Custom quote required</p>
            </div>
          )}

          {/* ── BOOKINGS ── */}
          {tab === 'bookings' && (
            <div data-testid="bookings-tab">
              <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="bookings-table">
                  <thead>
                    <tr className="bg-[#2A52A0] text-white text-left">
                      <th className="px-3 py-2.5 text-xs font-medium">Date</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Company</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Tier</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Amount</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Payment</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Preferred Date</th>
                      <th className="px-3 py-2.5 text-xs font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bookings || []).map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`booking-row-${i}`}>
                        <td className="px-3 py-3 text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-3 py-3 font-medium text-[#1C2B2B]">{item.company || '—'}</td>
                        <td className="px-3 py-3 text-xs">{(item.tier || '').charAt(0).toUpperCase() + (item.tier || '').slice(1)}{item.addRetainer ? ' + Retainer' : ''}</td>
                        <td className="px-3 py-3 font-bold text-[#B8972C]">${item.totalCharged || 0}</td>
                        <td className="px-3 py-3">
                          <Badge color={item.paymentStatus === 'paid' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}>
                            {item.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-500">{item.preferredDate || '—'}</td>
                        <td className="px-3 py-3">
                          <button onClick={() => setViewItem(item)} className="text-[10px] font-medium px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1" data-testid={`view-booking-${i}`}>
                            <Eye size={10} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!bookings || bookings.length === 0) && <p className="py-8 text-center text-gray-300">No bookings yet</p>}
              </div>
            </div>
          )}

          {/* ── LEADS (existing) ── */}
          {tab === 'leads' && (
            <div data-testid="leads-tab">
              {!leads ? <p className="text-gray-400">Loading...</p> : (
                <>
                  <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Safety Check Submissions</h2>
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-[#2A52A0] text-white text-left">
                        <th className="px-3 py-2.5 text-xs">Date</th><th className="px-3 py-2.5 text-xs">Name</th><th className="px-3 py-2.5 text-xs">Company</th><th className="px-3 py-2.5 text-xs">Email</th><th className="px-3 py-2.5 text-xs text-center">Score</th><th className="px-3 py-2.5 text-xs text-center">Risk</th><th className="px-3 py-2.5 text-xs text-center">Actions</th>
                      </tr></thead>
                      <tbody>
                        {leads.safety_checks.map((l, i) => (
                          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-3 py-3 text-xs text-gray-400">{l.timestamp ? new Date(l.timestamp).toLocaleDateString() : '—'}</td>
                            <td className="px-3 py-3 font-medium">{l.name}</td>
                            <td className="px-3 py-3">{l.company}</td>
                            <td className="px-3 py-3"><a href={`mailto:${l.email}`} className="text-[#B8972C] hover:underline">{l.email}</a></td>
                            <td className="px-3 py-3 text-center font-bold">{l.score_gaps}/6</td>
                            <td className="px-3 py-3 text-center"><Badge color={l.score_level === 'HIGH' ? 'bg-red-500 text-white' : l.score_level === 'MEDIUM' ? 'bg-orange-400 text-white' : 'bg-green-500 text-white'}>{l.score_level}</Badge></td>
                            <td className="px-3 py-3 text-center">
                              {l.id && (
                                <button
                                  onClick={(e) => deleteRowInline('safety_check', l.id, `${l.name || 'Unknown'} — ${l.email || l.id}`, e)}
                                  className="text-[10px] font-medium px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors inline-flex items-center gap-1"
                                  title="Click to archive · Shift+Click to permanently delete"
                                  data-testid={`delete-safety-check-${i}`}
                                >
                                  <Trash2 size={10} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {leads.safety_checks.length === 0 && <p className="py-6 text-center text-gray-300">No submissions</p>}
                  </div>
                  <WalkthroughLeadsCRM token={token} />
                </>
              )}
            </div>
          )}

          {/* ── DOWNLOADS ── */}
          {tab === 'downloads' && <DownloadsTab token={token} />}
        </div>
      </div>

      {/* ── View Drawer ── */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setViewItem(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()} data-testid="view-drawer">
            <div className="sticky top-0 bg-[#2A52A0] px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-white">{viewItem.company || 'Details'}</h3>
              <button onClick={() => setViewItem(null)} className="text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              {(() => {
                const s = summarizeAttribution(viewItem.attribution);
                const first = viewItem.attribution?.firstTouch;
                if (!s && !first) return null;
                return (
                  <div className="rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/5 p-4" data-testid="attribution-summary">
                    <p className="text-[10px] uppercase tracking-wider text-[#B8972C] font-bold mb-2">Lead Source</p>
                    {s && (
                      <p className="text-sm font-bold text-[#1C2B2B] mb-1">
                        {s.label}
                        {s.campaign && <span className="text-xs text-gray-500 font-normal"> · {s.campaign}</span>}
                      </p>
                    )}
                    {first && (
                      <div className="text-[11px] text-gray-500 space-y-0.5 mt-2">
                        {first.utm_medium && <p>Medium: <span className="text-gray-700">{first.utm_medium}</span></p>}
                        {first.first_landing_path && <p>Landing page: <span className="text-gray-700">{first.first_landing_path}</span></p>}
                        {first.gclid && <p>Google Click ID: <span className="text-gray-700 font-mono">{first.gclid.slice(0, 20)}...</span></p>}
                        {first.fbclid && <p>Facebook Click ID: <span className="text-gray-700 font-mono">{first.fbclid.slice(0, 20)}...</span></p>}
                      </div>
                    )}
                  </div>
                );
              })()}
              {Object.entries(viewItem).filter(([k]) => !['_id', 'consentGiven', 'attribution'].includes(k)).map(([k, v]) => {
                if (v === null || v === undefined || v === '') return null;
                const val = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
                return (
                  <div key={k}>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{k}</p>
                    {typeof v === 'object' ? (
                      <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">{val}</pre>
                    ) : (
                      <p className="text-gray-700">{val}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Status Update Modal ── */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setStatusModal(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()} data-testid="status-modal">
            <h3 className="text-base font-bold text-[#1C2B2B] mb-1">Update Status</h3>
            <p className="text-xs text-gray-400 mb-4">{statusModal.company}</p>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm mb-4 focus:outline-none focus:border-[#C9A84C]"
              data-testid="status-select"
            >
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={() => setStatusModal(null)} className="flex-1 text-sm py-2 rounded-lg border border-gray-200 text-gray-500">Cancel</button>
              <button onClick={handleStatusUpdate} className="flex-1 text-sm py-2 rounded-lg bg-[#C9A84C] text-white font-bold hover:bg-[#B8972C] transition-colors" data-testid="status-save-btn">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Report Upload Modal ── */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setUploadModal(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()} data-testid="upload-modal">
            <h3 className="text-base font-bold text-[#1C2B2B] mb-1">Upload Report</h3>
            <p className="text-xs text-gray-400 mb-4">{uploadModal.company} — {uploadModal.clientToken}</p>
            <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-200 p-6 text-center hover:border-[#C9A84C] transition-colors">
              <Upload size={24} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to select PDF (max 20MB)'}</p>
              <input type="file" accept=".pdf" className="hidden" onChange={handleReportUpload} disabled={uploading} data-testid="report-file-input" />
            </label>
            <button onClick={() => setUploadModal(null)} className="w-full text-sm py-2 rounded-lg border border-gray-200 text-gray-500 mt-3">Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
};

/* ── Downloads sub-tab (kept separate) ── */
const DownloadsTab = ({ token }) => {
  const [events, setEvents] = useState(null);
  useEffect(() => {
    (async () => {
      try { const res = await fetch(`${API}/api/admin/downloads?token=${token}&limit=100`); if (res.ok) setEvents(await res.json()); } catch {}
    })();
  }, [token]);
  if (!events) return <p className="text-gray-400">Loading...</p>;
  const typeLabel = t => t === 'safety_check_pdf' ? 'Safety Check' : t === 'hazcom_pdf' ? 'HazCom' : 'Heat Guide';
  return (
    <div data-testid="downloads-tab">
      <h2 className="text-lg font-bold text-[#1C2B2B] mb-4">Recent Downloads</h2>
      <table className="w-full text-sm">
        <thead><tr className="bg-[#2A52A0] text-white text-left">
          <th className="px-3 py-2.5 text-xs">Date</th><th className="px-3 py-2.5 text-xs">Type</th><th className="px-3 py-2.5 text-xs">Details</th>
        </tr></thead>
        <tbody>
          {events.events.map((ev, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-3 text-xs text-gray-400">{new Date(ev.timestamp).toLocaleString()}</td>
              <td className="px-3 py-3"><Badge color="bg-gray-100 text-gray-600">{typeLabel(ev.type)}</Badge></td>
              <td className="px-3 py-3 text-gray-500 text-xs">{ev.email || ev.submission_id || ev.filename || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {events.events.length === 0 && <p className="py-8 text-center text-gray-300">No downloads yet</p>}
    </div>
  );
};

export default AdminPage;
