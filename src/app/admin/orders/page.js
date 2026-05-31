'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/* ─── Status configs ─── */
const ORDER_STATUS   = { 1: { label: 'Pending',    bg: '#fff8e1', color: '#f57f17' }, 2: { label: 'Processing', bg: '#e3f2fd', color: '#1565c0' }, 3: { label: 'Approved',   bg: '#e8f5e9', color: '#2e7d32' }, 4: { label: 'Cancelled',  bg: '#ffebee', color: '#c62828' } };
const PAYMENT_STATUS = { 1: { label: 'Paid',   bg: '#e8f5e9', color: '#2e7d32' }, 2: { label: 'Unpaid', bg: '#fff8e1', color: '#f57f17' } };
const INQ_STATUS     = { new: { label: 'New', bg: '#fff8e1', color: '#f57f17' }, contacted: { label: 'Contacted', bg: '#e3f2fd', color: '#1565c0' }, confirmed: { label: 'Confirmed', bg: '#e8f5e9', color: '#2e7d32' }, cancelled: { label: 'Cancelled', bg: '#ffebee', color: '#c62828' } };
const APP_STATUS     = { pending: { label: 'Pending', bg: '#fff8e1', color: '#f57f17' }, processing: { label: 'Processing', bg: '#e3f2fd', color: '#1565c0' }, approved: { label: 'Approved', bg: '#e8f5e9', color: '#2e7d32' }, rejected: { label: 'Rejected', bg: '#ffebee', color: '#c62828' } };

function Badge({ cfg, value }) {
  const s = cfg[value] || { label: value || '—', bg: '#f5f5f5', color: '#888' };
  return <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>{s.label}</span>;
}

/* ─── Detail Modal ─── */
function DetailModal({ item, type, onClose, onStatusChange }) {
  if (!item) return null;
  const isOrder = type === 'orders';
  const isInquiry = type === 'inquiries';
  const isApp = type === 'applications';

  const statusCfg   = isOrder ? ORDER_STATUS : isInquiry ? INQ_STATUS : APP_STATUS;
  const statusField = isOrder ? 'status' : 'status';
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
    ['Order #', item.order_number],
    ['Type', item.product_type],
    ['Customer', `${item.first_name || ''} ${item.last_name || ''}`.trim()],
    ['Email', item.email],
    ['Phone', item.phone],
    ['Start Date', item.start_date],
    ['End Date', item.end_date],
    ['Adults', item.adult_qty],
    ['Children', item.child_qty],
    ['Total', item.total_with_tax || item.total_amount ? `SAR ${item.total_with_tax || item.total_amount}` : null],
    ['Payment', PAYMENT_STATUS[item.payment_status]?.label],
    ['Notes', item.notes],
  ] : isInquiry ? [
    ['Transport', item.transport_title],
    ['Vehicle Type', item.vehicle_type],
    ['Name', item.name],
    ['Email', item.email],
    ['Phone', item.phone],
    ['Passengers', item.passengers],
    ['Travel Date', item.travel_date],
    ['Message', item.message],
  ] : [
    ['Visa', item.visa_title],
    ['Name', item.name],
    ['Email', item.email],
    ['Phone', item.phone],
    ['Nationality', item.nationality],
    ['Passport #', item.passport_number],
    ['Travel Date', item.travel_date],
    ['Message', item.message],
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', padding: '18px 24px', borderRadius: '14px 14px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5 style={{ color: '#fff', fontWeight: 700, margin: 0, fontSize: 16 }}>
            {isOrder ? `Order: ${item.order_number}` : isInquiry ? 'Transport Inquiry' : 'Visa Application'}
          </h5>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fff', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {fields.filter(([, v]) => v || v === 0).map(([label, value]) => (
              <div key={label} style={{ padding: '10px 14px', background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{String(value)}</div>
              </div>
            ))}
          </div>

          {/* Status updater */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 10 }}>Update Status</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {statusOptions.map(([val, lbl]) => {
                const sc = statusCfg[isOrder ? Number(val) : val] || {};
                const active = String(item.status) === String(isOrder ? Number(val) : val);
                return (
                  <button key={val} onClick={() => handleStatus(val)}
                    style={{ padding: '8px 16px', border: `2px solid ${sc.color || '#ccc'}`, borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, background: active ? sc.color : sc.bg, color: active ? '#fff' : sc.color, fontFamily: 'inherit', transition: 'all 0.15s' }}>
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          {isOrder && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 10 }}>Payment Status</div>
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
                      style={{ padding: '8px 16px', border: `2px solid ${sc.color}`, borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13, background: active ? sc.color : sc.bg, color: active ? '#fff' : sc.color, fontFamily: 'inherit' }}>
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, fontSize: 12, color: '#aaa' }}>
            Submitted: {new Date(item.created_at).toLocaleString()}
          </div>

          {isOrder && (
            <div style={{ marginTop: 12 }}>
              <Link href={`/admin/orders/${item._id}`} style={{ fontSize: 13, color: '#B1723C', fontWeight: 600, textDecoration: 'none' }}>
                View Full Order Page →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared table shell ─── */
function TableShell({ loading, empty, children }) {
  if (loading) return <div style={{ textAlign: 'center', padding: 48, color: '#888' }}><i className="bi bi-arrow-repeat" style={{ fontSize: 28, display: 'block', marginBottom: 8, animation: 'spin 1s linear infinite' }}></i>Loading...</div>;
  if (empty) return <div style={{ textAlign: 'center', padding: 64, color: '#888' }}><i className="bi bi-inbox" style={{ fontSize: 40, display: 'block', marginBottom: 12 }}></i><h5 style={{ color: '#555' }}>No records found</h5></div>;
  return <div style={{ overflowX: 'auto' }}>{children}</div>;
}

/* ─── Tab: Orders ─── */
function OrdersTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [filters, setFilters] = useState({ status: '', payment_status: '', product_type: '', search: '' });
  const [detail, setDetail] = useState(null);

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

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <input type="text" placeholder="Search order #..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, width: 180 }} />
        {[
          ['status', [['','All Status'],['1','Pending'],['2','Processing'],['3','Approved'],['4','Cancelled']]],
          ['payment_status', [['','All Payments'],['1','Paid'],['2','Unpaid']]],
          ['product_type', [['','All Types'],['tour','Tour'],['hotel','Hotel'],['transport','Transport'],['activity','Activity'],['visa','Visa']]],
        ].map(([key, opts]) => (
          <select key={key} value={filters[key]} onChange={e => { setFilters(p => ({ ...p, [key]: e.target.value })); setPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}>
            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <button onClick={() => { setFilters({ status: '', payment_status: '', product_type: '', search: '' }); setPage(1); }}
          className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>Clear</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <TableShell loading={loading} empty={items.length === 0}>
          <table className="admin-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Type</th><th>Dates</th><th>Amount</th><th>Payment</th><th>Status</th><th style={{ width: 80 }}>Actions</th></tr></thead>
            <tbody>
              {items.map(o => (
                <tr key={o._id}>
                  <td><span style={{ fontWeight: 600, fontSize: 13 }}>{o.order_number}</span></td>
                  <td><div style={{ fontWeight: 500 }}>{o.first_name} {o.last_name}</div><div style={{ fontSize: 12, color: '#888' }}>{o.email}</div></td>
                  <td><span style={{ textTransform: 'capitalize', fontSize: 13 }}>{o.product_type}</span></td>
                  <td style={{ fontSize: 12, color: '#666' }}>{o.start_date || '—'}{o.end_date ? ` → ${o.end_date}` : ''}</td>
                  <td style={{ fontWeight: 600 }}>SAR {(o.total_with_tax || o.total_amount || 0).toLocaleString()}</td>
                  <td><Badge cfg={PAYMENT_STATUS} value={o.payment_status} /></td>
                  <td><Badge cfg={ORDER_STATUS} value={o.status} /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => setDetail(o)} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}><i className="bi bi-eye"></i></button>
                      <Link href={`/admin/orders/${o._id}`} className="admin-btn admin-btn-sm" style={{ background: '#f3e5f5', color: '#6a1b9a' }}><i className="bi bi-box-arrow-up-right"></i></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ padding: '14px 0' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>
            ))}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Tab: Transport Inquiries ─── */
function InquiriesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);

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
        <input type="text" placeholder="Search by name, email, transport..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, flex: 1, maxWidth: 360 }} />
        <button onClick={() => { setPage(1); load(); }} className="admin-btn admin-btn-primary admin-btn-sm"><i className="bi bi-search"></i> Search</button>
        {search && <button onClick={() => setSearch('')} className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>Clear</button>}
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <TableShell loading={loading} empty={items.length === 0}>
          <table className="admin-table">
            <thead><tr><th>Inquirer</th><th>Transport</th><th>Vehicle / Pax</th><th>Travel Date</th><th>Submitted</th><th>Status</th><th style={{ width: 70 }}>View</th></tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i._id}>
                  <td><div style={{ fontWeight: 600 }}>{i.name}</div><div style={{ fontSize: 12, color: '#888' }}>{i.email}</div>{i.phone && <div style={{ fontSize: 12, color: '#888' }}>{i.phone}</div>}</td>
                  <td style={{ fontSize: 13, maxWidth: 160 }}>{i.transport_title}</td>
                  <td style={{ fontSize: 13, color: '#555' }}>{i.vehicle_type && <div>{i.vehicle_type}</div>}{i.passengers && <div>{i.passengers} pax</div>}</td>
                  <td style={{ fontSize: 13, color: '#666' }}>{i.travel_date || '—'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{new Date(i.created_at).toLocaleDateString()}</td>
                  <td><Badge cfg={INQ_STATUS} value={i.status} /></td>
                  <td><button onClick={() => setDetail(i)} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}><i className="bi bi-eye"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ padding: '14px 0' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>)}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Tab: Visa Applications ─── */
function VisaAppsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);

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
        <input type="text" placeholder="Search by name, email, visa..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, flex: 1, maxWidth: 360 }} />
        <button onClick={() => { setPage(1); load(); }} className="admin-btn admin-btn-primary admin-btn-sm"><i className="bi bi-search"></i> Search</button>
        {search && <button onClick={() => setSearch('')} className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>Clear</button>}
      </div>
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <TableShell loading={loading} empty={items.length === 0}>
          <table className="admin-table">
            <thead><tr><th>Applicant</th><th>Visa</th><th>Nationality</th><th>Travel Date</th><th>Submitted</th><th>Status</th><th style={{ width: 70 }}>View</th></tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i._id}>
                  <td><div style={{ fontWeight: 600 }}>{i.name}</div><div style={{ fontSize: 12, color: '#888' }}>{i.email}</div>{i.phone && <div style={{ fontSize: 12, color: '#888' }}>{i.phone}</div>}</td>
                  <td style={{ fontSize: 13, maxWidth: 160 }}>{i.visa_title}</td>
                  <td style={{ fontSize: 13, color: '#555' }}>{i.nationality || '—'}</td>
                  <td style={{ fontSize: 13, color: '#666' }}>{i.travel_date || '—'}</td>
                  <td style={{ fontSize: 12, color: '#888' }}>{new Date(i.created_at).toLocaleDateString()}</td>
                  <td><Badge cfg={APP_STATUS} value={i.status} /></td>
                  <td><button onClick={() => setDetail(i)} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}><i className="bi bi-eye"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ padding: '14px 0' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>)}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Page ─── */
const TABS = [
  { key: 'orders',       label: 'Orders',                 icon: 'bi-receipt-cutoff', color: '#0d6efd' },
  { key: 'inquiries',    label: 'Transport Inquiries',     icon: 'bi-car-front',      color: '#B1723C' },
  { key: 'applications', label: 'Visa Applications',       icon: 'bi-passport',       color: '#6f42c1' },
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Orders & Inquiries</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>Manage all bookings, transport inquiries and visa applications</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f5f5f5', padding: 5, borderRadius: 10, width: 'fit-content' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '9px 20px',
              border: 'none',
              borderRadius: 7,
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: 14,
              fontFamily: 'inherit',
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? tab.color : '#666',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              display: 'flex', alignItems: 'center', gap: 7,
              transition: 'all 0.15s',
            }}
          >
            <i className={`bi ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'orders'       && <OrdersTab />}
      {activeTab === 'inquiries'    && <InquiriesTab />}
      {activeTab === 'applications' && <VisaAppsTab />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
