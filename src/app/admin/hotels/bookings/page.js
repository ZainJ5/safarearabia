'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUS = {
  1: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE', label: 'Processing' },
  2: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0', label: 'Completed'  },
  3: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', label: 'Cancelled'  },
};

const IcoSearch = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IcoEye   = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>;
const IcoEdit  = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoTrash = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoPlus  = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>;

export default function HotelBookingsPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [pagination, setPag]    = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 15, ...(search ? { search } : {}) });
      const r = await fetch(`/api/admin/hotel-invoices?${p}`);
      const d = await r.json();
      if (d.success) { setInvoices(d.data); setPag(d.pagination); }
    } catch { /**/ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    try {
      const r = await fetch(`/api/admin/hotel-invoices/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (d.success) {
        toast.success('Status updated');
        setInvoices(prev => prev.map(i => i._id === id ? { ...i, status } : i));
      } else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id, num) => {
    if (!confirm(`Delete invoice #${num}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const r = await fetch(`/api/admin/hotel-invoices/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Deleted'); load(); }
      else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
    setDeleting(null);
  };

  const total = pagination?.total ?? invoices.length;

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Hotel Booking</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>{total} total invoices</p>
        </div>
        <Link href="/admin/hotels/invoice/create"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: '#B1723C', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(177,114,60,0.2)' }}>
          <IcoPlus /> Generate Invoice
        </Link>
      </div>

      {/* Search */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 16, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><IcoSearch /></div>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search invoices…"
            style={{ width: '100%', padding: '9px 14px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#111827', boxSizing: 'border-box' }}
            onFocus={e => { e.target.style.borderColor = '#B1723C'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: 13 }}>Loading…</p>
          </div>
        ) : invoices.length === 0 ? (
          <div style={{ padding: '64px 20px', textAlign: 'center', color: '#9CA3AF' }}>
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 14px', color: '#D1D5DB' }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.3"/><polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.3"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <h4 style={{ color: '#6B7280', fontWeight: 700, marginBottom: 8, fontSize: 16 }}>No hotel invoices yet</h4>
            <p style={{ fontSize: 13, margin: '0 0 20px' }}>Generate your first invoice to get started.</p>
            <Link href="/admin/hotels/invoice/create"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 24px', background: '#B1723C', color: '#fff', borderRadius: 9, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>
              <IcoPlus /> Create Invoice
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['#', 'Invoice No.', 'Reservation No', 'Agent', 'Nationality', 'Amount', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '11px 14px', color: '#6B7280', fontSize: 10.5, fontWeight: 700, textAlign: i <= 1 ? 'center' : 'left', whiteSpace: 'nowrap', borderBottom: '1px solid #ECEEF2', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => {
                  const sc = STATUS[inv.status] || STATUS[1];
                  return (
                    <tr key={inv._id} style={{ borderBottom: '1px solid #F3F5F8', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFBFD'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '12px 14px', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>{(page - 1) * 15 + idx + 1}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', background: '#FEF3EA', color: '#B1723C', border: '1px solid #F3D9C0', borderRadius: 6, fontSize: 12.5, fontWeight: 700 }}>
                          H-{inv.invoice_no || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{inv.reserve_no || '—'}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{inv.agent_name || '—'}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7280' }}>{inv.nationality || '—'}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, fontSize: 13.5, color: '#10B981' }}>SAR {Number(inv.total_amount || 0).toFixed(2)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <select value={inv.status || 1} onChange={e => changeStatus(inv._id, Number(e.target.value))}
                          style={{ padding: '5px 10px', borderRadius: 7, border: `1.5px solid ${sc.border}`, background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <Link href={`/admin/hotels/invoice/${inv._id}`}
                            style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 7, textDecoration: 'none' }} title="View">
                            <IcoEye />
                          </Link>
                          <Link href={`/admin/hotels/invoice/${inv._id}/edit`}
                            style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#F0FDF4', color: '#059669', border: '1px solid #A7F3D0', borderRadius: 7, textDecoration: 'none' }} title="Edit">
                            <IcoEdit />
                          </Link>
                          <button onClick={() => handleDelete(inv._id, inv.reserve_no)} disabled={deleting === inv._id}
                            style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 7, cursor: 'pointer' }} title="Delete">
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

        {pagination?.pages > 1 && (
          <div className="admin-pagination" style={{ borderTop: '1px solid #F3F4F6' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>
            ))}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
