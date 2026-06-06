'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUS_MAP = { 1: 'Processing', 2: 'Completed', 3: 'Cancelled' };
const STATUS_COLOR = {
  1: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  2: { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
  3: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
};

/* ── Icons ── */
const IcoSearch = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" /><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
const IcoPlus = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>;
const IcoEye = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /></svg>;
const IcoPencil = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const IcoTrash = () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const IcoX = () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>;
const IcoSort = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const IcoEmpty = () => <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M6 18v2m12-2v2M2 12h20M7 8V5a1 1 0 011-1h8a1 1 0 011 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>;

const sel = {
  padding: '8px 12px', border: '1.5px solid #E5E7EB', borderRadius: 8,
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
  background: '#FAFAFA', color: '#374151', cursor: 'pointer',
  appearance: 'none', WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  paddingRight: 30,
};

const amtOf = inv => Number(inv.net_total_with_tax || inv.total || 0);

export default function TransportInvoiceListPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  /* filters */
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: 1, limit: 200 });
      if (search) p.set('search', search);
      const r = await fetch(`/api/admin/transport-invoices?${p}`);
      const d = await r.json();
      if (d.success) setInvoices(d.data);
    } catch { /**/ }
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const displayed = useMemo(() => {
    let r = [...invoices];
    if (statusFilter) r = r.filter(i => String(i.status || 1) === statusFilter);
    if (dateFrom) r = r.filter(i => i.created_at && i.created_at.slice(0, 10) >= dateFrom);
    if (dateTo) r = r.filter(i => i.created_at && i.created_at.slice(0, 10) <= dateTo);
    if (sortBy === 'oldest') r.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else if (sortBy === 'newest') r.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    else if (sortBy === 'hi') r.sort((a, b) => amtOf(b) - amtOf(a));
    else if (sortBy === 'lo') r.sort((a, b) => amtOf(a) - amtOf(b));
    return r;
  }, [invoices, statusFilter, dateFrom, dateTo, sortBy]);

  const stats = useMemo(() => ({
    total: invoices.length,
    processing: invoices.filter(i => (i.status || 1) === 1).length,
    completed: invoices.filter(i => i.status === 2).length,
    cancelled: invoices.filter(i => i.status === 3).length,
    revenue: invoices.reduce((s, i) => s + amtOf(i), 0),
  }), [invoices]);

  const hasFilters = statusFilter || dateFrom || dateTo || sortBy !== 'newest';
  const clearFilters = () => { setStatusFilter(''); setDateFrom(''); setDateTo(''); setSortBy('newest'); };

  const handleStatusChange = async (id, status) => {
    try {
      const r = await fetch(`/api/admin/transport-invoices/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const d = await r.json();
      if (d.success) { setInvoices(prev => prev.map(i => i._id === id ? { ...i, status } : i)); toast.success('Status updated'); }
      else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id, no) => {
    if (!confirm(`Delete invoice T-${no}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const r = await fetch(`/api/admin/transport-invoices/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Deleted'); load(); } else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
    setDeleting(null);
  };

  return (
    <>
      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Transport Bookings</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0' }}>
            {displayed.length} of {stats.total} invoices
            {hasFilters && <span style={{ marginLeft: 6, color: '#B1723C', fontWeight: 600 }}>· filtered</span>}
          </p>
        </div>
        <Link href="/admin/transport/invoice/create"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: '#B1723C', color: '#fff', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 600, boxShadow: '0 2px 8px rgba(177,114,60,0.22)', whiteSpace: 'nowrap' }}>
          <IcoPlus /> Generate Invoice
        </Link>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total', value: stats.total, accent: '#374151', bg: '#F8FAFC' },
          { label: 'Processing', value: stats.processing, accent: '#2563EB', bg: '#EFF6FF' },
          { label: 'Completed', value: stats.completed, accent: '#059669', bg: '#ECFDF5' },
          { label: 'Cancelled', value: stats.cancelled, accent: '#DC2626', bg: '#FEF2F2' },
          { label: 'Revenue', value: `SAR ${stats.revenue.toLocaleString('en', { minimumFractionDigits: 2 })}`, accent: '#059669', bg: '#F0FDF4' },
        ].map(s => (
          <div key={s.label}
            style={{ background: s.bg, borderRadius: 10, padding: '12px 14px', border: `1px solid ${s.accent}22`, cursor: ['Processing', 'Completed', 'Cancelled'].includes(s.label) ? 'pointer' : 'default' }}
            onClick={() => {
              if (!['Processing', 'Completed', 'Cancelled'].includes(s.label)) return;
              const code = { Processing: '1', Completed: '2', Cancelled: '3' }[s.label];
              setStatusFilter(prev => prev === code ? '' : code);
            }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: s.label === 'Revenue' ? 15 : 22, fontWeight: 700, color: s.accent, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filter toolbar ── */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 16, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ flex: '1 1 220px', position: 'relative', minWidth: 180 }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}><IcoSearch /></span>
            <input
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by invoice no., agent, vehicle type…"
              style={{ width: '100%', padding: '8px 12px 8px 34px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#FAFAFA', color: '#111827', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#B1723C'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
            />
          </div>

          <div style={{ width: 1, height: 28, background: '#E5E7EB', flexShrink: 0 }} />

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>Status</span>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={sel}>
              <option value="">All</option>
              <option value="1">Processing</option>
              <option value="2">Completed</option>
              <option value="3">Cancelled</option>
            </select>
          </div>

          {/* Date from */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>From</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              style={{ ...sel, paddingRight: 10, backgroundImage: 'none', color: dateFrom ? '#111827' : '#9CA3AF', minWidth: 136 }} />
          </div>

          {/* Date to */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>To</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              style={{ ...sel, paddingRight: 10, backgroundImage: 'none', color: dateTo ? '#111827' : '#9CA3AF', minWidth: 136 }} />
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#9CA3AF', flexShrink: 0 }}><IcoSort /></span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={sel}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="hi">Amount ↓</option>
              <option value="lo">Amount ↑</option>
            </select>
          </div>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 12px', border: '1.5px solid #FECACA', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              <IcoX /> Clear filters
            </button>
          )}
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {statusFilter && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: STATUS_COLOR[Number(statusFilter)]?.bg, color: STATUS_COLOR[Number(statusFilter)]?.color, border: `1px solid ${STATUS_COLOR[Number(statusFilter)]?.border}`, fontSize: 12, fontWeight: 600 }}>
                {STATUS_MAP[Number(statusFilter)]}
                <button onClick={() => setStatusFilter('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, display: 'flex' }}><IcoX /></button>
              </span>
            )}
            {dateFrom && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', fontSize: 12, fontWeight: 600 }}>
                From: {dateFrom}
                <button onClick={() => setDateFrom('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, display: 'flex' }}><IcoX /></button>
              </span>
            )}
            {dateTo && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', fontSize: 12, fontWeight: 600 }}>
                To: {dateTo}
                <button onClick={() => setDateTo('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, display: 'flex' }}><IcoX /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: 13 }}>Loading invoices…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ padding: '64px 20px', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ color: '#D1D5DB', marginBottom: 16, display: 'flex', justifyContent: 'center' }}><IcoEmpty /></div>
            <h4 style={{ color: '#6B7280', fontWeight: 700, marginBottom: 16, fontSize: 16 }}>
              {hasFilters ? 'No invoices match your filters' : 'No transport invoices yet'}
            </h4>
            {hasFilters
              ? <button onClick={clearFilters} style={{ padding: '9px 20px', background: '#F3F4F6', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151', fontFamily: 'inherit' }}>Clear filters</button>
              : <Link href="/admin/transport/invoice/create" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 24px', background: '#B1723C', color: '#fff', borderRadius: 9, fontWeight: 600, textDecoration: 'none', fontSize: 13 }}><IcoPlus /> Create Invoice</Link>
            }
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['#', 'Invoice No.', 'Reservation No', 'Agent', 'Vehicle Type', 'Amount', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '11px 14px', color: '#6B7280', fontSize: 10.5, fontWeight: 700, textAlign: i <= 1 ? 'center' : 'left', whiteSpace: 'nowrap', borderBottom: '1px solid #ECEEF2', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.slice((page - 1) * 15, page * 15).map((inv, idx) => {
                  const sc = STATUS_COLOR[inv.status || 1];
                  return (
                    <tr key={inv._id} style={{ borderBottom: '1px solid #F3F5F8', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFBFD'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '13px 14px', textAlign: 'center', fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{(page - 1) * 15 + idx + 1}</td>
                      <td style={{ padding: '13px 14px', textAlign: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#B1723C', background: '#FDF4EC', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(177,114,60,0.15)' }}>T-{inv.invoice_no}</span>
                      </td>
                      <td style={{ padding: '13px 14px', fontSize: 13, color: '#374151' }}>{inv.reservation_no || '—'}</td>
                      <td style={{ padding: '13px 14px', fontSize: 13, color: '#374151', fontWeight: 500 }}>{inv.agent_name || '—'}</td>
                      <td style={{ padding: '13px 14px', fontSize: 13, color: '#6B7280' }}>{inv.vehicle_type || inv.transport_title || '—'}</td>
                      <td style={{ padding: '13px 14px', fontSize: 13, fontWeight: 700, color: '#059669', fontVariantNumeric: 'tabular-nums' }}>
                        SAR {amtOf(inv).toFixed(2)}
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <select value={inv.status || 1} onChange={e => handleStatusChange(inv._id, Number(e.target.value))}
                          style={{ padding: '5px 10px', border: `1.5px solid ${sc.border}`, borderRadius: 7, fontSize: 11.5, fontWeight: 600, color: sc.color, background: sc.bg, cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}>
                          {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '13px 14px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <Link href={`/admin/transport/invoice/${inv._id}`} title="View"
                            style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#ECFDF5', color: '#059669', borderRadius: 7, textDecoration: 'none', border: '1px solid #A7F3D0' }}>
                            <IcoEye />
                          </Link>
                          <Link href={`/admin/transport/invoice/${inv._id}/edit`} title="Edit"
                            style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#EFF6FF', color: '#2563EB', borderRadius: 7, textDecoration: 'none', border: '1px solid #BFDBFE' }}>
                            <IcoPencil />
                          </Link>
                          <button onClick={() => handleDelete(inv._id, inv.invoice_no)} disabled={deleting === inv._id} title="Delete"
                            style={{ width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 7, cursor: 'pointer', opacity: deleting === inv._id ? 0.5 : 1 }}>
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

        {/* Pagination */}
        {displayed.length > 15 && (() => {
          const pages = Math.ceil(displayed.length / 15);
          if (pages <= 1) return null;
          return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, padding: '14px 0', borderTop: '1px solid #F3F4F6' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ padding: '7px 13px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13, color: '#374151', fontFamily: 'inherit', opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid', borderColor: page === p ? '#B1723C' : '#E5E7EB', background: page === p ? '#B1723C' : '#fff', cursor: 'pointer', fontSize: 13, color: page === p ? '#fff' : '#374151', fontWeight: page === p ? 700 : 400, fontFamily: 'inherit' }}>
                  {p}
                </button>
              ))}
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                style={{ padding: '7px 13px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', cursor: page === pages ? 'not-allowed' : 'pointer', fontSize: 13, color: '#374151', fontFamily: 'inherit', opacity: page === pages ? 0.4 : 1 }}>Next →</button>
            </div>
          );
        })()}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
