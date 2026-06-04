'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const COUNTRIES = [
  { code: 'PK', name: 'Pakistan' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IN', name: 'India' },    { code: 'BD', name: 'Bangladesh' },
  { code: 'EG', name: 'Egypt' },    { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' }, { code: 'TR', name: 'Turkey' },
  { code: 'AE', name: 'UAE' },      { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'PH', name: 'Philippines' },
];

const flagEmoji = (code) => {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => c.codePointAt(0) + 127397));
};

const genMerchantId = (existing) => {
  let max = 300;
  existing.forEach(a => {
    const id = a.custom_id || '';
    const num = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return `MC${String(max + 1).padStart(4, '0')}`;
};

const INIT = { fname: '', lname: '', email: '', password: '', phone: '', zip_code: 'PK', address: '', role: 2, status: 1 };

export default function AgentsPage() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [pagination, setPag]  = useState({ total: 0, pages: 1 });
  const [modal, setModal]     = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm]       = useState(INIT);
  const [saving, setSaving]   = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 20, role: 2 });
      if (search) p.set('search', search);
      const r = await fetch(`/api/admin/users?${p}`);
      const d = await r.json();
      if (d.success) { setItems(d.data || []); setPag(d.pagination || { total: 0, pages: 1 }); }
    } catch { /**/ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    const newId = genMerchantId(items);
    setForm({ ...INIT, custom_id: newId });
    setEditItem(null);
    setModal('create');
  };

  const openEdit = (item) => {
    setForm({
      fname: item.fname || '', lname: item.lname || '', email: item.email || '',
      password: '', phone: item.phone || '', zip_code: item.zip_code || 'PK',
      address: item.address || '', role: 2, status: item.status ?? 1,
      custom_id: item.custom_id || '',
    });
    setEditItem(item);
    setModal('edit');
  };

  const closeModal = () => { setModal(null); setEditItem(null); setForm(INIT); };

  const handleSave = async () => {
    if (!form.fname.trim()) { toast.error('Agent name is required'); return; }
    if (!form.email.trim())  { toast.error('Email is required'); return; }
    if (modal === 'create' && !form.password.trim()) { toast.error('Password is required for new agents'); return; }
    setSaving(true);
    try {
      const url    = modal === 'edit' ? `/api/admin/users/${editItem._id}` : '/api/admin/users';
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const body   = { ...form, role: 2 };
      if (modal === 'edit' && !body.password) delete body.password;
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (d.success) { toast.success(modal === 'edit' ? 'Agent updated' : 'Agent created'); closeModal(); load(); }
      else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setConfirmId(null);
    try {
      const r = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Agent deleted'); load(); }
      else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
  };

  const handleToggle = async (item) => {
    if (toggling) return;
    setToggling(item._id);
    const newStatus = item.status === 1 ? 2 : 1;
    try {
      const r = await fetch(`/api/admin/users/${item._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const d = await r.json();
      if (d.success) {
        setItems(prev => prev.map(a => a._id === item._id ? { ...a, status: newStatus } : a));
        toast.success(newStatus === 1 ? 'Agent activated' : 'Agent deactivated');
      } else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
    setToggling(null);
  };

  /* ── Shared input style ── */
  const inp = { width: '100%', padding: '10px 13px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box' };
  const lbl = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block' };

  return (
    <>
      {/* ── Confirm Delete ── */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 36px', maxWidth: 360, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Agent?</h5>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: '9px 22px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} style={{ padding: '9px 22px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.22)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0D1B2E, #1a3356)', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
              <h5 style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: 16 }}>{modal === 'edit' ? 'Edit Agent' : 'Add New Agent'}</h5>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '5px 12px', color: '#fff', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              {/* Merchant ID row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Merchant ID</label>
                  <input style={{ ...inp, background: '#F9FAFB', color: '#6B7280', fontWeight: 700 }} value={form.custom_id || ''} readOnly />
                </div>
                <div>
                  <label style={lbl}>Country</label>
                  <select style={inp} value={form.zip_code} onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))}>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Agent / Company Name *</label>
                <input style={inp} value={form.fname} onChange={e => setForm(f => ({ ...f, fname: e.target.value }))} placeholder="e.g. MAHIR TRAVEL" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Email Address *</label>
                  <input style={inp} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="agent@company.com" />
                </div>
                <div>
                  <label style={lbl}>Password {modal === 'edit' ? '(leave blank to keep)' : '*'}</label>
                  <input style={inp} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={modal === 'edit' ? 'New password' : 'Set password'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>Phone</label>
                  <input style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+92 300 0000000" />
                </div>
                <div>
                  <label style={lbl}>Status</label>
                  <select style={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: Number(e.target.value) }))}>
                    <option value={1}>Active</option>
                    <option value={2}>Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>Address</label>
                <textarea style={{ ...inp, height: 70, resize: 'vertical' }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Agent's business address" />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={closeModal} style={{ padding: '10px 22px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  style={{ padding: '10px 28px', background: '#B1723C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : modal === 'edit' ? 'Update Agent' : 'Create Agent'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Withdraw Amount', value: 'Sar0',       grad: 'linear-gradient(135deg, #10B981, #059669)' },
          { label: 'Total Received Amount', value: 'Sar0',       grad: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
          { label: 'Total Pending Amount',  value: 'Sar0',       grad: 'linear-gradient(135deg, #EC4899, #BE185D)' },
          { label: 'Total Agent',           value: pagination.total, grad: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.grad, borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden', minHeight: 110 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 10, lineHeight: 1.3 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{s.value}</div>
            {/* Decorative circle */}
            <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 7v1m0 8v1m-4-5h1m6 0h1M9.5 9.5l.7.7m3.6 3.6.7.7M9.5 14.5l.7-.7m3.6-3.6.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ── Agent List Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h4 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>Agent List</h4>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ display: 'flex', border: '1.5px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load()}
              placeholder="Search your agent..."
              style={{ padding: '9px 14px', border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', width: 220 }}
            />
            <button onClick={load} style={{ padding: '9px 14px', background: '#B1723C', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          {/* Add New */}
          <Link href="/admin/agents/create"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#B1723C', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Add New
          </Link>
        </div>
      </div>

      {/* ── Agent Cards Grid ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#9CA3AF' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Loading agents...
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9CA3AF', background: '#fff', borderRadius: 14 }}>
          <svg width="52" height="52" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 16px', color: '#D1D5DB' }}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <h5 style={{ color: '#6B7280', fontWeight: 700, marginBottom: 8 }}>No agents found</h5>
          <button onClick={openCreate} className="admin-btn admin-btn-primary" style={{ marginTop: 12 }}>Add First Agent</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {items.map(agent => {
              const isActive = agent.status === 1;
              const countryCode = agent.zip_code || 'PK';
              const flag = flagEmoji(countryCode);
              const name = `${agent.fname || ''} ${agent.lname || ''}`.trim().toUpperCase();
              const mcId = agent.custom_id || 'MC????';

              return (
                <div key={agent._id} style={{ background: '#fff', borderRadius: 14, padding: '18px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s' }}>
                  {/* Top row: flag + active badge */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 18 }} title={countryCode}>{flag}</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: isActive ? '#ECFDF5' : '#FEF2F2', color: isActive ? '#059669' : '#DC2626' }}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, overflow: 'hidden' }}>
                    {agent.image ? (
                      <img src={agent.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="46" height="46" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#9CA3AF"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#9CA3AF"/></svg>
                    )}
                  </div>

                  {/* Name */}
                  <div style={{ fontWeight: 800, fontSize: 13, color: '#111827', textAlign: 'center', lineHeight: 1.3, marginBottom: 4, letterSpacing: 0.3 }}>{name || agent.email?.split('@')[0]?.toUpperCase() || 'UNNAMED AGENT'}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, marginBottom: 16, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{agent.email || mcId}</div>

                  {/* Actions */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {/* Edit */}
                      <button onClick={() => openEdit(agent)}
                        style={{ width: 32, height: 32, borderRadius: 7, background: '#EFF6FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </button>
                      {/* Delete */}
                      <button onClick={() => setConfirmId(agent._id)}
                        style={{ width: 32, height: 32, borderRadius: 7, background: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      {/* Profile */}
                      <Link href={`/admin/agents/${agent._id}`}
                        style={{ width: 32, height: 32, borderRadius: 7, background: '#F0FDF4', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', textDecoration: 'none' }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </Link>
                    </div>
                    {/* Toggle Switch */}
                    <button onClick={() => handleToggle(agent)} disabled={toggling === agent._id}
                      style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: isActive ? '#2563EB' : '#D1D5DB', transition: 'background 0.2s', opacity: toggling === agent._id ? 0.6 : 1, padding: 0 }}>
                      <span style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', left: isActive ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="admin-pagination" style={{ marginTop: 24 }}>
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
              {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
                <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>
              ))}
              <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next ›</button>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
