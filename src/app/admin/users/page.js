'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API = '/api/admin/users';

const ROLES = { 1: { label: 'Admin', color: '#DC2626', bg: '#FEF2F2' }, 2: { label: 'Agent', color: '#D97706', bg: '#FFFBEB' }, 3: { label: 'Customer', color: '#059669', bg: '#ECFDF5' }, 4: { label: 'Employee', color: '#2563EB', bg: '#EFF6FF' } };
const STATUS_CFG = { 1: { label: 'Active', color: '#059669', bg: '#ECFDF5' }, 0: { label: 'Inactive', color: '#DC2626', bg: '#FEF2F2' } };

// New users created here are Employees (role 4) — staff who log in and generate invoices.
const emptyForm = { fname: '', lname: '', email: '', phone: '', address: '', role: 4, status: 1, password: '' };

function Badge({ cfg, value }) {
  const s = cfg[value] || { label: '—', color: '#6B7280', bg: '#F3F4F6' };
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
}

export default function AdminUsersPage() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [modal, setModal]         = useState(null);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [showPass, setShowPass]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 20 });
      if (search) p.set('search', search);
      if (roleFilter) p.set('role', roleFilter);
      const r = await fetch(`${API}?${p}`);
      const d = await r.json();
      if (d.success) { setItems(d.data || []); setPagination(d.pagination || { total: 0, pages: 1 }); }
    } catch { /**/ }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(emptyForm); setEditItem(null); setShowPass(false); setModal('create'); };
  const openEdit = (item) => {
    setForm({ fname: item.fname || '', lname: item.lname || '', email: item.email || '', phone: item.phone || '', address: item.address || '', role: item.role ?? 4, status: item.status ?? 1, password: '' });
    setEditItem(item);
    setShowPass(false);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditItem(null); setForm(emptyForm); setShowPass(false); };

  const handleSave = async () => {
    if (!form.fname.trim() || !form.email.trim()) { toast.error('Name and email are required'); return; }
    if (modal === 'create' && !form.password.trim()) { toast.error('Password is required for new users'); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (modal === 'edit' && !payload.password) delete payload.password;
      const url = modal === 'edit' ? `${API}/${editItem._id}` : API;
      const method = modal === 'edit' ? 'PUT' : 'POST';
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (d.success) { toast.success(modal === 'edit' ? 'User updated' : 'User created'); closeModal(); load(); }
      else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setConfirmId(null);
    const tid = toast.loading('Deleting...');
    try {
      const r = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Deleted', { id: tid }); load(); }
      else toast.error(d.error || 'Failed', { id: tid });
    } catch (e) { toast.error(e.message, { id: tid }); }
  };

  const iS = { width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
  const lS = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' };

  const roleCounts = { all: items.length };
  items.forEach(u => { roleCounts[u.role] = (roleCounts[u.role] || 0) + 1; });

  return (
    <>
      {/* Confirm Delete */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 36px', maxWidth: 380, width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Delete User</h5>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: '10px 22px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} style={{ padding: '10px 22px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0D1B2E, #1a3356)', padding: '18px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0 }}>
              <h5 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>{modal === 'edit' ? 'Edit User' : 'Add New User'}</h5>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '5px 11px', color: '#fff', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div><label style={lS}>First Name *</label><input style={iS} value={form.fname} onChange={e => setForm(f => ({ ...f, fname: e.target.value }))} placeholder="First name" /></div>
                <div><label style={lS}>Last Name</label><input style={iS} value={form.lname} onChange={e => setForm(f => ({ ...f, lname: e.target.value }))} placeholder="Last name" /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={lS}>Email *</label><input style={iS} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="employee@example.com" autoComplete="off" /></div>
              <div style={{ marginBottom: 14 }}>
                <label style={lS}>{modal === 'create' ? 'Password *' : 'New Password (leave blank to keep current)'}</label>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...iS, paddingRight: 70 }} type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder={modal === 'create' ? 'Set password' : 'Leave blank to keep'} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 0, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontFamily: 'inherit', fontWeight: 600 }}>
                    {showPass
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div><label style={lS}>Phone</label><input style={iS} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+966 5X XXX XXXX" /></div>
                <div>
                  <label style={lS}>Role</label>
                  <select style={iS} value={form.role} onChange={e => setForm(f => ({ ...f, role: Number(e.target.value) }))}>
                    <option value={4}>Employee</option>
                    <option value={1}>Admin</option>
                    {modal === 'edit' && ![1, 4].includes(Number(form.role)) && (
                      <option value={form.role}>{ROLES[form.role]?.label || 'Other'}</option>
                    )}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lS}>Status</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[1, 0].map(v => (
                    <button key={v} type="button" onClick={() => setForm(f => ({ ...f, status: v }))}
                      style={{ flex: 1, padding: '10px', border: `2px solid ${form.status === v ? (v === 1 ? '#059669' : '#DC2626') : '#E5E7EB'}`, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, background: form.status === v ? (v === 1 ? '#ECFDF5' : '#FEF2F2') : '#fff', color: form.status === v ? (v === 1 ? '#059669' : '#DC2626') : '#6B7280', fontFamily: 'inherit' }}>
                      {v === 1 ? '✓ Active' : '✗ Inactive'}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}><label style={lS}>Address</label><textarea style={{ ...iS, height: 72, resize: 'vertical' }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="User address" /></div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={closeModal} style={{ padding: '10px 22px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ padding: '10px 26px', background: '#B1723C', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
                  {saving ? 'Saving...' : modal === 'edit' ? 'Update User' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>Users</h4>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0' }}>{pagination.total} total users</p>
        </div>
        <button onClick={openCreate} className="admin-btn admin-btn-primary">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', marginBottom: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Search users..." style={{ width: '100%', padding: '9px 12px 9px 38px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={{ padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}>
            <option value="">All Roles</option>
            <option value="4">Employee</option>
            <option value="1">Admin</option>
            <option value="2">Agent</option>
            <option value="3">Customer</option>
          </select>
          <button onClick={() => { setPage(1); load(); }} className="admin-btn admin-btn-primary admin-btn-sm">Search</button>
          {(search || roleFilter) && <button onClick={() => { setSearch(''); setRoleFilter(''); setPage(1); }} className="admin-btn admin-btn-sm" style={{ background: '#F3F4F6', color: '#374151' }}>Clear</button>}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9CA3AF' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
            Loading users...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 14px', color: '#D1D5DB' }}><circle cx="8" cy="7" r="4" stroke="currentColor" strokeWidth="1.4"/><circle cx="17" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M1 20v-1a6 6 0 0112 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M15 16a5 5 0 017 4.58V21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <h5 style={{ color: '#6B7280', fontWeight: 700 }}>No users found</h5>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th style={{ width: 110 }}>Actions</th></tr></thead>
              <tbody>
                {items.map(item => {
                  const initials = `${item.fname?.charAt(0) || ''}${item.lname?.charAt(0) || ''}`.toUpperCase() || 'U';
                  const rc = ROLES[item.role] || ROLES[3];
                  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'];
                  const bg = colors[item._id?.toString().charCodeAt(0) % colors.length] || '#6B7280';
                  return (
                    <tr key={item._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${bg}, ${bg}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{item.fname} {item.lname}</div>
                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>ID: {item._id?.toString().slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>{item.email}</td>
                      <td style={{ fontSize: 13, color: '#6B7280' }}>{item.phone || '—'}</td>
                      <td><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: rc.bg, color: rc.color }}>{rc.label}</span></td>
                      <td><Badge cfg={STATUS_CFG} value={item.status} /></td>
                      <td style={{ fontSize: 12, color: '#9CA3AF' }}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEdit(item)} style={{ padding: '6px 10px', background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          </button>
                          <button onClick={() => setConfirmId(item._id)} style={{ padding: '6px 10px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit' }}>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {pagination.pages > 1 && (
          <div className="admin-pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>)}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
