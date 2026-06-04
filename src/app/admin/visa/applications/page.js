'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API = '/api/admin/visa-applications';

const STATUS_CFG = {
  pending:    { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'Pending' },
  processing: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', label: 'Processing' },
  approved:   { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0', label: 'Approved' },
  rejected:   { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'Rejected' },
};

const IcoSearch = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IcoEye   = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>;
const IcoTrash = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoX     = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IcoArrow = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoInbox = () => <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M22 12h-6l-2 3h-4l-2-3H2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;

export default function VisaApplicationsPage() {
  const [items, setItems]          = useState([]);
  const [loading, setLoading]      = useState(true);
  const [search, setSearch]        = useState('');
  const [page, setPage]            = useState(1);
  const [pagination, setPagination]= useState({ total: 0, pages: 1 });
  const [detailItem, setDetailItem]= useState(null);
  const [confirmId, setConfirmId]  = useState(null);
  const [updatingId, setUpdatingId]= useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const r = await fetch(`${API}?${params}`);
      const d = await r.json();
      if (d.success) { setItems(d.data); setPagination(d.pagination || { total: d.data.length, pages: 1 }); }
    } catch { /**/ } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const r = await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const d = await r.json();
      if (d.success) {
        toast.success('Status updated');
        setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
        if (detailItem?._id === id) setDetailItem(prev => ({ ...prev, status }));
      } else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); } finally { setUpdatingId(null); }
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

  return (
    <>
      {/* Delete Confirm */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '36px 40px', maxWidth: 400, width: '90%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#EF4444' }}>
              <IcoTrash />
            </div>
            <h5 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#111827' }}>Delete Application</h5>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 28 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
                <IcoTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(2px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1a3356 100%)', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginBottom: 3 }}>Visa Application</div>
                <h5 style={{ color: '#F9FAFB', fontWeight: 700, margin: 0, fontSize: 16 }}>{detailItem.name}</h5>
              </div>
              <button onClick={() => setDetailItem(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                <IcoX />
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '14px 16px', marginBottom: 20, borderLeft: '4px solid #3B82F6' }}>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Visa Applied For</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{detailItem.visa_title}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  ['Full Name', detailItem.name],
                  ['Email', detailItem.email],
                  ['Phone / WhatsApp', detailItem.phone],
                  ['Nationality', detailItem.nationality],
                  ['Passport Number', detailItem.passport_number],
                  ['Travel Date', detailItem.travel_date],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 9, border: '1px solid #ECEEF2' }}>
                    <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13.5, color: '#111827', fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>

              {detailItem.message && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Message</div>
                  <div style={{ padding: '12px 16px', background: '#F8FAFC', borderRadius: 9, border: '1px solid #ECEEF2', fontSize: 13.5, color: '#374151', lineHeight: 1.6 }}>
                    {detailItem.message}
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Update Status</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(STATUS_CFG).map(([key, { bg, color, border, label }]) => (
                    <button key={key} onClick={() => updateStatus(detailItem._id, key)} disabled={updatingId === detailItem._id}
                      style={{ padding: '8px 18px', border: `1.5px solid ${detailItem.status === key ? color : border}`, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12.5, background: detailItem.status === key ? color : bg, color: detailItem.status === key ? '#fff' : color, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 11.5, color: '#9CA3AF', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                Submitted: {new Date(detailItem.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Visa Applications</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>{pagination.total} total applications</p>
        </div>
        <Link href="/admin/visa" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
          <IcoArrow /> Visa
        </Link>
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 16, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        <form onSubmit={e => { e.preventDefault(); setPage(1); load(); }} style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><IcoSearch /></div>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or visa..."
              style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#111827' }}
              onFocus={e => { e.target.style.borderColor = '#B1723C'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
            />
          </div>
          <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: 'none', borderRadius: 8, background: '#B1723C', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <IcoSearch /> Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setPage(1); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '9px 13px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 12.5, cursor: 'pointer', color: '#6B7280', fontFamily: 'inherit', fontWeight: 600 }}>
              <IcoX /> Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: 13 }}>Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ color: '#D1D5DB', marginBottom: 12, display: 'flex', justifyContent: 'center' }}><IcoInbox /></div>
            <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#6B7280' }}>No applications yet</p>
            <p style={{ margin: 0, fontSize: 13 }}>Applications submitted from the website will appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant</th><th>Visa</th><th>Nationality</th><th>Travel Date</th><th>Submitted</th><th>Status</th>
                  <th style={{ width: 100, textAlign: 'right', paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const sc = STATUS_CFG[item.status] || STATUS_CFG.pending;
                  return (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                        <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{item.email}</div>
                        {item.phone && <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{item.phone}</div>}
                      </td>
                      <td style={{ fontWeight: 500, fontSize: 13 }}>{item.visa_title}</td>
                      <td style={{ fontSize: 13, color: '#6B7280' }}>{item.nationality || '—'}</td>
                      <td style={{ fontSize: 13, color: '#6B7280' }}>{item.travel_date || '—'}</td>
                      <td style={{ fontSize: 12, color: '#9CA3AF' }}>
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {sc.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end', paddingRight: 6 }}>
                          <button onClick={() => setDetailItem(item)} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 7, cursor: 'pointer' }} title="View">
                            <IcoEye />
                          </button>
                          <button onClick={() => setConfirmId(item._id)} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 7, cursor: 'pointer' }} title="Delete">
                            <IcoTrash />
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
          <div className="admin-pagination" style={{ borderTop: '1px solid #F3F4F6' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i+1} onClick={() => setPage(i+1)} className={page === i+1 ? 'active' : ''}>{i+1}</button>
            ))}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p+1)}>Next →</button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
