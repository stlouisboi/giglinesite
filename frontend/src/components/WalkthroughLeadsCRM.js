import React, { useState, useEffect, useCallback } from 'react';
import { Phone, Mail, Pencil, Trash2, Plus, MessageSquare, ChevronDown, X, Save, Search } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const STATUSES = [
  { id: 'new',        label: 'New',        color: 'bg-gray-500',   textColor: 'text-white' },
  { id: 'contacted',  label: 'Contacted',  color: 'bg-blue-500',   textColor: 'text-white' },
  { id: 'qualified',  label: 'Qualified',  color: 'bg-indigo-500', textColor: 'text-white' },
  { id: 'booked',     label: 'Booked',     color: 'bg-green-600',  textColor: 'text-white' },
  { id: 'won',        label: 'Won',        color: 'bg-emerald-600',textColor: 'text-white' },
  { id: 'lost',       label: 'Lost',       color: 'bg-rose-500',   textColor: 'text-white' },
];
const statusMeta = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—');
const fmtDateTime = (iso) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—');

const StatusPill = ({ status, onChange }) => {
  const [open, setOpen] = useState(false);
  const meta = statusMeta(status);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold ${meta.color} ${meta.textColor} hover:opacity-90`}
        data-testid={`lead-status-pill-${status}`}
      >
        {meta.label}
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 z-40 bg-white border border-gray-200 rounded shadow-lg w-36 py-1">
            {STATUSES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(s.id); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2 ${status === s.id ? 'font-bold' : ''}`}
                data-testid={`status-option-${s.id}`}
              >
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const WalkthroughLeadsCRM = ({ token }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // status filter
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(null); // selected lead for detail drawer
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/walkthrough-leads?token=${token}&limit=300`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Actions ───────────────────────────────────────────
  const updateStatus = async (id, newStatus) => {
    await fetch(`${API}/api/admin/walkthrough-leads/${id}/status?token=${token}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setLeads((curr) => curr.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    if (drawer?.id === id) setDrawer((d) => ({ ...d, status: newStatus }));
  };

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead permanently? This cannot be undone.')) return;
    await fetch(`${API}/api/admin/walkthrough-leads/${id}?token=${token}`, { method: 'DELETE' });
    setLeads((curr) => curr.filter((l) => l.id !== id));
    if (drawer?.id === id) setDrawer(null);
  };

  const saveEdit = async () => {
    const id = drawer.id;
    const res = await fetch(`${API}/api/admin/walkthrough-leads/${id}?token=${token}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setLeads((curr) => curr.map((l) => (l.id === id ? updated : l)));
      setDrawer(updated);
      setEditOpen(false);
    }
  };

  const addNote = async () => {
    if (!noteText.trim() || !drawer) return;
    setSavingNote(true);
    const res = await fetch(`${API}/api/admin/walkthrough-leads/${drawer.id}/notes?token=${token}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: noteText.trim() }),
    });
    if (res.ok) {
      const note = await res.json();
      const updated = { ...drawer, notes: [...(drawer.notes || []), note] };
      setDrawer(updated);
      setLeads((curr) => curr.map((l) => (l.id === drawer.id ? updated : l)));
      setNoteText('');
    }
    setSavingNote(false);
  };

  const deleteNote = async (noteId) => {
    await fetch(`${API}/api/admin/walkthrough-leads/${drawer.id}/notes/${noteId}?token=${token}`, { method: 'DELETE' });
    const updated = { ...drawer, notes: drawer.notes.filter((n) => n.id !== noteId) };
    setDrawer(updated);
    setLeads((curr) => curr.map((l) => (l.id === drawer.id ? updated : l)));
  };

  const createLead = async (payload) => {
    const res = await fetch(`${API}/api/admin/walkthrough-leads?token=${token}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const lead = await res.json();
      setLeads((curr) => [lead, ...curr]);
      setAddOpen(false);
    }
  };

  // ── Filter / Search ───────────────────────────────────
  const filtered = leads.filter((l) => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [l.name, l.company, l.email, l.phone].some((v) => (v || '').toLowerCase().includes(q));
    }
    return true;
  });

  // Status counts for filter chips
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s.id]: leads.filter((l) => l.status === s.id).length }), {});

  return (
    <div data-testid="walkthrough-leads-crm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[#1C2B2B]">Walkthrough Leads ({leads.length})</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, email…"
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1F6FEB] w-56"
              data-testid="lead-search-input"
            />
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1 bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors"
            data-testid="add-manual-lead-btn"
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex gap-1.5 mb-4 flex-wrap" data-testid="status-filter-chips">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`text-xs px-3 py-1 rounded border ${filter === 'all' ? 'bg-[#1C2B2B] text-white border-[#1C2B2B]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
          data-testid="filter-all"
        >
          All <span className="opacity-60">{leads.length}</span>
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setFilter(s.id)}
            className={`text-xs px-3 py-1 rounded border flex items-center gap-1.5 ${filter === s.id ? 'bg-[#1C2B2B] text-white border-[#1C2B2B]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}
            data-testid={`filter-${s.id}`}
          >
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            {s.label} <span className="opacity-60">{counts[s.id]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded border border-gray-200">
        {loading ? (
          <p className="py-10 text-center text-gray-400">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-gray-400">No leads match these filters.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1C2B2B] text-white text-left">
                <th className="px-3 py-2.5 text-xs">Date</th>
                <th className="px-3 py-2.5 text-xs">Name</th>
                <th className="px-3 py-2.5 text-xs">Business</th>
                <th className="px-3 py-2.5 text-xs">Phone / Email</th>
                <th className="px-3 py-2.5 text-xs">Status</th>
                <th className="px-3 py-2.5 text-xs text-center">Notes</th>
                <th className="px-3 py-2.5 text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => { setDrawer(lead); setEditForm({}); setEditOpen(false); }} data-testid={`lead-row-${lead.id}`}>
                  <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(lead.timestamp)}</td>
                  <td className="px-3 py-3 font-medium text-[#1C2B2B]">{lead.name || '—'}</td>
                  <td className="px-3 py-3 text-gray-600">{lead.company || lead.business || '—'}</td>
                  <td className="px-3 py-3">
                    {lead.phone && <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="block text-xs text-gray-600 hover:text-[#1F6FEB]"><Phone size={11} className="inline mr-1" />{lead.phone}</a>}
                    {lead.email && <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="block text-xs text-gray-500 hover:text-[#1F6FEB] mt-0.5"><Mail size={11} className="inline mr-1" />{lead.email.toLowerCase()}</a>}
                  </td>
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <StatusPill status={lead.status || 'new'} onChange={(s) => updateStatus(lead.id, s)} />
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-gray-500">
                    {(lead.notes || []).length > 0 && (
                      <span className="inline-flex items-center gap-1"><MessageSquare size={11} />{lead.notes.length}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setDrawer(lead); setEditOpen(true); setEditForm({ name: lead.name, company: lead.company || '', phone: lead.phone || '', email: lead.email || '', service: lead.service || '' }); }}
                      className="text-gray-400 hover:text-[#1F6FEB] p-1.5 inline-block"
                      title="Edit lead"
                      data-testid={`edit-lead-${lead.id}`}
                    ><Pencil size={14} /></button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 inline-block"
                      title="Delete lead"
                      data-testid={`delete-lead-${lead.id}`}
                    ><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── DRAWER ── */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => { setDrawer(null); setEditOpen(false); }} data-testid="lead-drawer">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0D1B2A] text-white px-5 py-4 flex items-center justify-between z-10">
              <div className="min-w-0">
                <h3 className="font-bold text-base truncate" data-testid="drawer-name">{drawer.name || '(no name)'}</h3>
                <p className="text-xs text-white/55 truncate">{drawer.company || drawer.business || 'No business listed'}</p>
              </div>
              <button onClick={() => { setDrawer(null); setEditOpen(false); }} className="text-white/60 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status + actions row */}
              <div className="flex items-center justify-between gap-2">
                <StatusPill status={drawer.status || 'new'} onChange={(s) => updateStatus(drawer.id, s)} />
                <div className="flex items-center gap-1">
                  {drawer.phone && <a href={`tel:${drawer.phone}`} className="text-xs text-[#1F6FEB] hover:underline inline-flex items-center gap-1"><Phone size={12} /> Call</a>}
                  {drawer.email && <a href={`mailto:${drawer.email}`} className="text-xs text-[#1F6FEB] hover:underline inline-flex items-center gap-1 ml-3"><Mail size={12} /> Email</a>}
                </div>
              </div>

              {/* Lead fields — view or edit mode */}
              {editOpen ? (
                <div className="space-y-3 border border-[#1F6FEB]/30 rounded-lg p-4 bg-blue-50/30">
                  <p className="text-xs uppercase tracking-wide text-[#1F6FEB] font-bold mb-1">Editing</p>
                  {['name', 'company', 'phone', 'email', 'service'].map((f) => (
                    <div key={f}>
                      <label className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{f}</label>
                      <input
                        type="text"
                        value={editForm[f] ?? ''}
                        onChange={(e) => setEditForm({ ...editForm, [f]: e.target.value })}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1F6FEB]"
                        data-testid={`edit-field-${f}`}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEdit} className="bg-[#1F6FEB] hover:bg-[#1558C0] text-white text-sm font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1" data-testid="save-edit-btn">
                      <Save size={13} /> Save
                    </button>
                    <button onClick={() => setEditOpen(false)} className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1.5">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-400 text-xs uppercase tracking-wide mr-2">Service:</span>{drawer.service || '—'}</p>
                  <p><span className="text-gray-400 text-xs uppercase tracking-wide mr-2">Phone:</span>{drawer.phone || '—'}</p>
                  <p className="break-all"><span className="text-gray-400 text-xs uppercase tracking-wide mr-2">Email:</span>{drawer.email || '—'}</p>
                  <p><span className="text-gray-400 text-xs uppercase tracking-wide mr-2">Submitted:</span>{fmtDateTime(drawer.timestamp)}</p>
                  {drawer.utm_source && <p><span className="text-gray-400 text-xs uppercase tracking-wide mr-2">Source:</span>{drawer.utm_source}{drawer.utm_medium ? ` / ${drawer.utm_medium}` : ''}</p>}
                  <button onClick={() => { setEditOpen(true); setEditForm({ name: drawer.name, company: drawer.company || '', phone: drawer.phone || '', email: drawer.email || '', service: drawer.service || '' }); }} className="text-xs text-[#1F6FEB] hover:underline inline-flex items-center gap-1 mt-2"><Pencil size={11} /> Edit fields</button>
                </div>
              )}

              {/* Notes */}
              <div>
                <h4 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Notes ({(drawer.notes || []).length})</h4>
                <div className="space-y-2 mb-3" data-testid="notes-list">
                  {(drawer.notes || []).length === 0 && <p className="text-xs text-gray-400 italic">No notes yet. Add one below.</p>}
                  {(drawer.notes || []).slice().reverse().map((n) => (
                    <div key={n.id} className="bg-gray-50 border border-gray-200 rounded p-3 group">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-[10px] uppercase tracking-wide text-gray-400">{fmtDateTime(n.created_at)}</p>
                        <button onClick={() => deleteNote(n.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete note">
                          <X size={11} />
                        </button>
                      </div>
                      <p className="text-sm text-[#1C2B2B] whitespace-pre-wrap">{n.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Call notes, follow-up actions, anything worth remembering…"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1F6FEB] resize-none"
                    data-testid="note-input"
                  />
                  <button
                    onClick={addNote}
                    disabled={savingNote || !noteText.trim()}
                    className="bg-[#1F6FEB] hover:bg-[#1558C0] disabled:opacity-40 text-white text-xs font-semibold px-3 rounded self-stretch"
                    data-testid="add-note-btn"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Delete */}
              <div className="pt-3 border-t border-gray-100">
                <button onClick={() => deleteLead(drawer.id)} className="text-xs text-red-500 hover:text-red-600 inline-flex items-center gap-1" data-testid="delete-from-drawer">
                  <Trash2 size={12} /> Delete this lead permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD LEAD MODAL ── */}
      {addOpen && <AddLeadModal onClose={() => setAddOpen(false)} onCreate={createLead} />}
    </div>
  );
};

const AddLeadModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', service: 'Safety Walkthrough', status: 'new' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await onCreate(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose} data-testid="add-lead-modal">
      <div className="absolute inset-0 bg-black/50" />
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-lg shadow-2xl w-full max-w-md p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#1C2B2B]">Add Manual Lead</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <p className="text-xs text-gray-500">For phone-in calls, in-person referrals, or anything not captured by the website form.</p>

        {['name', 'company', 'phone', 'email'].map((f) => (
          <div key={f}>
            <label className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{f}{f === 'name' && ' *'}</label>
            <input
              type={f === 'email' ? 'email' : 'text'}
              required={f === 'name'}
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1F6FEB]"
              data-testid={`add-field-${f}`}
            />
          </div>
        ))}
        <div>
          <label className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Service Needed</label>
          <select
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1F6FEB] bg-white"
            data-testid="add-field-service"
          >
            <option>Safety Walkthrough</option>
            <option>Documentation Review</option>
            <option>Incident Review</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Initial Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#1F6FEB] bg-white"
            data-testid="add-field-status"
          >
            {STATUSES.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="text-sm text-gray-500 px-3 py-2 hover:text-gray-700">Cancel</button>
          <button type="submit" disabled={saving || !form.name.trim()} className="bg-[#1F6FEB] hover:bg-[#1558C0] disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded" data-testid="submit-add-lead">
            {saving ? 'Saving…' : 'Add Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WalkthroughLeadsCRM;
