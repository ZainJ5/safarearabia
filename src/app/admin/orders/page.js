'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ORDER_STATUS   = { 1: { label: 'Pending', bg: '#FFFBEB', color: '#D97706' }, 2: { label: 'Processing', bg: '#EFF6FF', color: '#2563EB' }, 3: { label: 'Approved', bg: '#ECFDF5', color: '#059669' }, 4: { label: 'Cancelled', bg: '#FEF2F2', color: '#DC2626' } };
const PAYMENT_STATUS = { 1: { label: 'Paid', bg: '#ECFDF5', color: '#059669' }, 2: { label: 'Unpaid', bg: '#FFFBEB', color: '#D97706' } };
const INQ_STATUS     = { new: { label: 'New', bg: '#FFFBEB', color: '#D97706' }, contacted: { label: 'Contacted', bg: '#EFF6FF', color: '#2563EB' }, confirmed: { label: 'Confirmed', bg: '#ECFDF5', color: '#059669' }, cancelled: { label: 'Cancelled', bg: '#FEF2F2', color: '#DC2626' } };
const APP_STATUS     = { pending: { label: 'Pending', bg: '#FFFBEB', color: '#D97706' }, processing: { label: 'Processing', bg: '#EFF6FF', color: '#2563EB' }, approved: { label: 'Approved', bg: '#ECFDF5', color: '#059669' }, rejected: { label: 'Rejected', bg: '#FEF2F2', color: '#DC2626' } };

/* ── SVG Icons ── */
const IcoSearch  = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IcoEye     = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>;
const IcoExtLink = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoX       = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IcoReceipt = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/><path d="M9 12h6m-6 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoCar     = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M6 18v2m12-2v2M2 12h20M7 8V5a1 1 0 011-1h8a1 1 0 011 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoVisa    = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="8" cy="15" r="1.5" fill="currentColor"/><path d="M12 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcoInbox   = () => <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M22 12h-6l-2 3h-4l-2-3H2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>;

function Badge({ cfg, value }) {
  const s = cfg[value] || { label: value || '—', bg: '#F3F4F6', color: '#6B7280' };
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap', border: `1px solid ${s.color}20` }}>{s.label}</span>;
}

function DetailModal({ item, type, onClose, onStatusChange }) {
  if (!item) return null;
  const isOrder   = type === 'orders';
  const isInquiry = type === 'inquiries';

  const statusCfg   = isOrder ? ORDER_STATUS : isInquiry ? INQ_STATUS : APP_STATUS;
  const statusOptions = isOrder
    ? [['1','Pending'],['2','Processing'],['3','Approved'],['4','Cancelled']]
    : isInquiry
    ? [['new','New'],['contacted','Contacted'],['confirmed','Confirmed'],['cancelled','Cancelled']]
    : [['pending','Pending'],['processing','Processing'],['approved','Approved'],['rejected','Rejected']];

  const apiBase = isOrder ? '/api/admin/orders' : isInquiry ? '/api/admin/transport-inquiries' : '/api/admin/visa-applications';

  const handleStatus = async (val) => {
    const value = isOrder ? Number(val) : val;
    try {
      const r = await fetch(`${apiBase}/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: value }) });
      const d = await r.json();
      if (d.success) { toast.success('Status updated'); onStatusChange(item._id, value); }
      else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
  };

  const fields = isOrder ? [
    ['Order #', item.order_number], ['Type', item.product_type],
    ['Customer', `${item.first_name || ''} ${item.last_name || ''}`.trim()], ['Email', item.email],
    ['Phone', item.phone], ['Start Date', item.start_date], ['End Date', item.end_date],
    ['Adults', item.adult_qty], ['Children', item.child_qty],
    ['Total', item.total_with_tax || item.total_amount ? `SAR ${item.total_with_tax || item.total_amount}` : null],
    ['Payment', PAYMENT_STATUS[item.payment_status]?.label], ['Notes', item.notes],
  ] : isInquiry ? [
    ['Transport', item.transport_title], ['Vehicle Type', item.vehicle_type],
    ['Name', item.name], ['Email', item.email], ['Phone', item.phone],
    ['Passengers', item.passengers], ['Travel Date', item.travel_date], ['Message', item.message],
  ] : [
    ['Visa', item.visa_title], ['Name', item.name], ['Email', item.email], ['Phone', item.phone],
    ['Nationality', item.nationality], ['Passport #', item.passport_number],
    ['Travel Date', item.travel_date], ['Message', item.message],
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(2px)' }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1a3356 100%)', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, marginBottom: 3, fontWeight: 500 }}>
              {isOrder ? 'Order Details' : isInquiry ? 'Transport Inquiry' : 'Visa Application'}
            </div>
            <h5 style={{ color: '#F9FAFB', fontWeight: 700, margin: 0, fontSize: 16 }}>
              {isOrder ? item.order_number : isInquiry ? item.name : item.name}
            </h5>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <IcoX />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {fields.filter(([, v]) => v || v === 0).map(([label, value]) => (
              <div key={label} style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 9, border: '1px solid #ECEEF2' }}>
                <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3, letterSpacing: 0.5 }}>{label}</div>
                <div style={{ fontSize: 13.5, color: '#111827', fontWeight: 500 }}>{String(value)}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Update Status</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {statusOptions.map(([val, lbl]) => {
                const sc = statusCfg[isOrder ? Number(val) : val] || {};
                const active = String(item.status) === String(isOrder ? Number(val) : val);
                return (
                  <button key={val} onClick={() => handleStatus(val)}
                    style={{ padding: '8px 16px', border: `1.5px solid ${sc.color || '#ddd'}`, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12.5, background: active ? sc.color : '#fff', color: active ? '#fff' : sc.color, fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          {isOrder && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#374151', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Payment Status</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['1','Paid'],['2','Unpaid']].map(([val, lbl]) => {
                  const sc = PAYMENT_STATUS[Number(val)];
                  const active = item.payment_status === Number(val);
                  return (
                    <button key={val} onClick={async () => {
                      try {
                        const r = await fetch(`/api/admin/orders/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payment_status: Number(val) }) });
                        const d = await r.json();
                        if (d.success) { toast.success('Payment status updated'); onStatusChange(item._id, item.status, Number(val)); }
                      } catch (e) { toast.error(e.message); }
                    }}
                      style={{ padding: '8px 18px', border: `1.5px solid ${sc.color}`, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12.5, background: active ? sc.color : '#fff', color: active ? '#fff' : sc.color, fontFamily: 'inherit', transition: 'all 0.15s' }}>
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ fontSize: 11.5, color: '#9CA3AF', paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
            Submitted: {new Date(item.created_at).toLocaleString()}
          </div>

          {isOrder && (
            <div style={{ marginTop: 12 }}>
              <Link href={`/admin/orders/${item._id}`} style={{ fontSize: 13, color: '#B1723C', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                View Full Order Page <IcoExtLink />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TableShell({ loading, empty, emptyLabel = 'No records found', children }) {
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ margin: 0, fontSize: 13 }}>Loading...</p>
    </div>
  );
  if (empty) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
      <div style={{ color: '#D1D5DB', marginBottom: 12, display: 'flex', justifyContent: 'center' }}><IcoInbox /></div>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#6B7280' }}>{emptyLabel}</p>
    </div>
  );
  return <div style={{ overflowX: 'auto' }}>{children}</div>;
}

function OrdersTab() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [filters, setFilters]   = useState({ status: '', payment_status: '', product_type: '', search: '' });
  const [detail, setDetail]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, v); });
    try {
      const r = await fetch(`/api/admin/orders?${p}`);
      const d = await r.json();
      if (d.success) { setItems(d.data); setPagination(d.pagination || { total: d.data.length, pages: 1 }); }
    } catch { /**/ }
    setLoading(false);
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id, status, payment_status) => {
    setItems(prev => prev.map(i => i._id === id ? { ...i, status: status ?? i.status, payment_status: payment_status ?? i.payment_status } : i));
    setDetail(prev => prev?._id === id ? { ...prev, status: status ?? prev.status, payment_status: payment_status ?? prev.payment_status } : prev);
  };

  return (
    <>
      <DetailModal item={detail} type="orders" onClose={() => setDetail(null)} onStatusChange={handleStatusChange} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><IcoSearch /></div>
          <input type="text" placeholder="Search order #..." value={filters.search}
            onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
            style={{ padding: '8px 12px 8px 32px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', width: 200, background: '#FAFAFA' }} />
        </div>
        {[
          ['status',       [['','All Status'],  ['1','Pending'],['2','Processing'],['3','Approved'],['4','Cancelled']]],
          ['payment_status',[['','All Payments'],['1','Paid'],['2','Unpaid']]],
          ['product_type', [['','All Types'],   ['tour','Tour'],['hotel','Hotel'],['transport','Transport'],['activity','Activity'],['visa','Visa']]],
        ].map(([key, opts]) => (
          <select key={key} value={filters[key]} onChange={e => { setFilters(p => ({ ...p, [key]: e.target.value })); setPage(1); }}
            style={{ padding: '8px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#374151' }}>
            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <button onClick={() => { setFilters({ status: '', payment_status: '', product_type: '', search: '' }); setPage(1); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: '#6B7280', fontFamily: 'inherit' }}>
          <IcoX /> Clear
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <TableShell loading={loading} empty={items.length === 0} emptyLabel="No orders found">
          <table className="admin-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Type</th><th>Dates</th><th>Amount</th><th>Payment</th><th>Status</th><th style={{ width: 96, textAlign: 'right', paddingRight: 20 }}>Actions</th></tr></thead>
            <tbody>
              {items.map(o => (
                <tr key={o._id}>
                  <td><span style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{o.order_number}</span></td>
                  <td><div style={{ fontWeight: 600, fontSize: 13 }}>{o.first_name} {o.last_name}</div><div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{o.email}</div></td>
                  <td><span style={{ textTransform: 'capitalize', fontSize: 11.5, background: '#F3F4F6', color: '#374151', padding: '3px 9px', borderRadius: 6, fontWeight: 600, border: '1px solid #ECEEF2' }}>{o.product_type}</span></td>
                  <td style={{ fontSize: 12, color: '#6B7280' }}>{o.start_date || '—'}{o.end_date ? ` → ${o.end_date}` : ''}</td>
                  <td style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>SAR {(o.total_with_tax || o.total_amount || 0).toLocaleString()}</td>
                  <td><Badge cfg={PAYMENT_STATUS} value={o.payment_status} /></td>
                  <td><Badge cfg={ORDER_STATUS} value={o.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end', paddingRight: 6 }}>
                      <button onClick={() => setDetail(o)} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 7, cursor: 'pointer' }}>
                        <IcoEye />
                      </button>
                      <Link href={`/admin/orders/${o._id}`} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', borderRadius: 7, textDecoration: 'none' }}>
                        <IcoExtLink />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ borderTop: '1px solid #F3F4F6' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i+1} onClick={() => setPage(i+1)} className={page === i+1 ? 'active' : ''}>{i+1}</button>
            ))}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p+1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

function InquiriesTab() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch]     = useState('');
  const [detail, setDetail]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (search) p.set('search', search);
    try {
      const r = await fetch(`/api/admin/transport-inquiries?${p}`);
      const d = await r.json();
      if (d.success) { setItems(d.data); setPagination(d.pagination || { total: d.data.length, pages: 1 }); }
    } catch { /**/ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id, status) => {
    setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    setDetail(prev => prev?._id === id ? { ...prev, status } : prev);
  };

  return (
    <>
      <DetailModal item={detail} type="inquiries" onClose={() => setDetail(null)} onStatusChange={handleStatusChange} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><IcoSearch /></div>
          <input type="text" placeholder="Search by name, email, transport..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA' }} />
        </div>
        <button onClick={() => { setPage(1); load(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#B1723C', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <IcoSearch /> Search
        </button>
        {search && <button onClick={() => setSearch('')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 12.5, cursor: 'pointer', color: '#6B7280', fontFamily: 'inherit', fontWeight: 600 }}><IcoX /> Clear</button>}
      </div>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <TableShell loading={loading} empty={items.length === 0} emptyLabel="No transport inquiries found">
          <table className="admin-table">
            <thead><tr><th>Inquirer</th><th>Transport</th><th>Vehicle / Pax</th><th>Travel Date</th><th>Submitted</th><th>Status</th><th style={{ width: 70, textAlign: 'right', paddingRight: 20 }}>View</th></tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i._id}>
                  <td><div style={{ fontWeight: 600, fontSize: 13 }}>{i.name}</div><div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{i.email}</div>{i.phone && <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{i.phone}</div>}</td>
                  <td style={{ fontSize: 13, maxWidth: 160 }}>{i.transport_title}</td>
                  <td style={{ fontSize: 13, color: '#6B7280' }}>{i.vehicle_type && <div>{i.vehicle_type}</div>}{i.passengers && <div>{i.passengers} pax</div>}</td>
                  <td style={{ fontSize: 13, color: '#6B7280' }}>{i.travel_date || '—'}</td>
                  <td style={{ fontSize: 12, color: '#9CA3AF' }}>{new Date(i.created_at).toLocaleDateString()}</td>
                  <td><Badge cfg={INQ_STATUS} value={i.status} /></td>
                  <td style={{ textAlign: 'right', paddingRight: 20 }}>
                    <button onClick={() => setDetail(i)} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 7, cursor: 'pointer' }}>
                      <IcoEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ borderTop: '1px solid #F3F4F6' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => <button key={i+1} onClick={() => setPage(i+1)} className={page === i+1 ? 'active' : ''}>{i+1}</button>)}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p+1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

function VisaAppsTab() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch]     = useState('');
  const [detail, setDetail]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page, limit: 20 });
    if (search) p.set('search', search);
    try {
      const r = await fetch(`/api/admin/visa-applications?${p}`);
      const d = await r.json();
      if (d.success) { setItems(d.data); setPagination(d.pagination || { total: d.data.length, pages: 1 }); }
    } catch { /**/ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id, status) => {
    setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    setDetail(prev => prev?._id === id ? { ...prev, status } : prev);
  };

  return (
    <>
      <DetailModal item={detail} type="applications" onClose={() => setDetail(null)} onStatusChange={handleStatusChange} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><IcoSearch /></div>
          <input type="text" placeholder="Search by name, email, visa..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA' }} />
        </div>
        <button onClick={() => { setPage(1); load(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#B1723C', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <IcoSearch /> Search
        </button>
        {search && <button onClick={() => setSearch('')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', fontSize: 12.5, cursor: 'pointer', color: '#6B7280', fontFamily: 'inherit', fontWeight: 600 }}><IcoX /> Clear</button>}
      </div>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <TableShell loading={loading} empty={items.length === 0} emptyLabel="No visa applications found">
          <table className="admin-table">
            <thead><tr><th>Applicant</th><th>Visa</th><th>Nationality</th><th>Travel Date</th><th>Submitted</th><th>Status</th><th style={{ width: 70, textAlign: 'right', paddingRight: 20 }}>View</th></tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i._id}>
                  <td><div style={{ fontWeight: 600, fontSize: 13 }}>{i.name}</div><div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{i.email}</div>{i.phone && <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{i.phone}</div>}</td>
                  <td style={{ fontSize: 13, maxWidth: 160 }}>{i.visa_title}</td>
                  <td style={{ fontSize: 13, color: '#6B7280' }}>{i.nationality || '—'}</td>
                  <td style={{ fontSize: 13, color: '#6B7280' }}>{i.travel_date || '—'}</td>
                  <td style={{ fontSize: 12, color: '#9CA3AF' }}>{new Date(i.created_at).toLocaleDateString()}</td>
                  <td><Badge cfg={APP_STATUS} value={i.status} /></td>
                  <td style={{ textAlign: 'right', paddingRight: 20 }}>
                    <button onClick={() => setDetail(i)} style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 7, cursor: 'pointer' }}>
                      <IcoEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ borderTop: '1px solid #F3F4F6' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => <button key={i+1} onClick={() => setPage(i+1)} className={page === i+1 ? 'active' : ''}>{i+1}</button>)}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p+1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

const TABS = [
  { key: 'orders',       label: 'Orders',              icon: <IcoReceipt /> },
  { key: 'inquiries',    label: 'Transport Inquiries',  icon: <IcoCar /> },
  { key: 'applications', label: 'Visa Applications',    icon: <IcoVisa /> },
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Orders & Inquiries</h2>
        <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Manage all bookings, transport inquiries and visa applications</p>
      </div>

      <div style={{ display: 'flex', gap: 3, marginBottom: 20, background: '#F1F4F9', padding: 5, borderRadius: 11, width: 'fit-content', border: '1px solid #ECEEF2' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ padding: '8px 18px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: activeTab === tab.key ? 700 : 500, fontSize: 13.5, fontFamily: 'inherit', background: activeTab === tab.key ? '#fff' : 'transparent', color: activeTab === tab.key ? '#B1723C' : '#6B7280', boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'orders'       && <OrdersTab />}
      {activeTab === 'inquiries'    && <InquiriesTab />}
      {activeTab === 'applications' && <VisaAppsTab />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
