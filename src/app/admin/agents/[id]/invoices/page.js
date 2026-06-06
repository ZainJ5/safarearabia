'use client';
import { use, useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const fmt = (n) => Number(n || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_OPTIONS = ['Processing', 'Completed', 'Cancelled', 'Paid', 'Unpaid'];

const statusBadge = (s) => {
  const map = {
    Processing: { bg: '#FFFBEB', color: '#D97706' },
    Completed:  { bg: '#ECFDF5', color: '#059669' },
    Cancelled:  { bg: '#FEF2F2', color: '#DC2626' },
    Paid:       { bg: '#ECFDF5', color: '#059669' },
    Unpaid:     { bg: '#FFFBEB', color: '#D97706' },
  };
  const st = map[s] || { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color }}>
      {s || '—'}
    </span>
  );
};

const Pager = ({ page, pages, onPage }) => {
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) nums.push(i);
    else if (nums[nums.length - 1] !== '…') nums.push('…');
  }
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 16, flexWrap: 'wrap' }}>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}
        style={{ padding: '6px 12px', borderRadius: 6, border: '1.5px solid #E5E7EB', background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: 12, color: '#374151', opacity: page <= 1 ? 0.4 : 1 }}>
        ← Prev
      </button>
      {nums.map((n, i) => (
        <button key={i} onClick={() => typeof n === 'number' && onPage(n)} disabled={n === '…' || n === page}
          style={{ padding: '6px 12px', borderRadius: 6, border: `1.5px solid ${n === page ? '#B1723C' : '#E5E7EB'}`, background: n === page ? '#B1723C' : '#fff', color: n === page ? '#fff' : '#374151', fontSize: 12, cursor: typeof n === 'number' && n !== page ? 'pointer' : 'default', minWidth: 36 }}>
          {n}
        </button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page >= pages}
        style={{ padding: '6px 12px', borderRadius: 6, border: '1.5px solid #E5E7EB', background: '#fff', cursor: page >= pages ? 'not-allowed' : 'pointer', fontSize: 12, color: '#374151', opacity: page >= pages ? 0.4 : 1 }}>
        Next →
      </button>
    </div>
  );
};

const Spinner = () => (
  <div style={{ padding: '40px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
    <div style={{ width: 28, height: 28, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
    Loading…
  </div>
);

function AgentInvoicesContent({ agentId }) {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'all';

  const [agent, setAgent]     = useState(null);
  const [agentLoading, setAgentLoading] = useState(true);

  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('');
  const [type, setType]       = useState(initialType);

  const [hotelData, setHotelData]         = useState({ items: [], total: 0, pages: 1 });
  const [transportData, setTransportData] = useState({ items: [], total: 0, pages: 1 });
  const [hPage, setHPage]     = useState(1);
  const [tPage, setTPage]     = useState(1);
  const [hLoading, setHLoading] = useState(false);
  const [tLoading, setTLoading] = useState(false);

  const agentNameRef = useRef('');

  useEffect(() => {
    fetch(`/api/admin/users/${agentId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setAgent(d.data);
          agentNameRef.current = `${d.data.fname || ''} ${d.data.lname || ''}`.trim();
        }
      })
      .finally(() => setAgentLoading(false));
  }, [agentId]);

  const fetchHotel = useCallback(async (page) => {
    setHLoading(true);
    const p = new URLSearchParams({ agent_user_id: agentId, page, limit: 15 });
    if (search)  p.set('search', search);
    if (status)  p.set('status', status);
    const r = await fetch(`/api/admin/hotel-invoices?${p}`);
    const d = await r.json();
    if (d.success) setHotelData({ items: d.data, total: d.pagination?.total || 0, pages: d.pagination?.pages || 1 });
    setHLoading(false);
  }, [search, status, agentId]);

  const fetchTransport = useCallback(async (page) => {
    setTLoading(true);
    const p = new URLSearchParams({ agent_user_id: agentId, page, limit: 15 });
    if (search)  p.set('search', search);
    if (status)  p.set('status', status);
    const r = await fetch(`/api/admin/transport-invoices?${p}`);
    const d = await r.json();
    if (d.success) setTransportData({ items: d.data, total: d.pagination?.total || 0, pages: d.pagination?.pages || 1 });
    setTLoading(false);
  }, [search, status, agentId]);

  // Load after agent is ready
  useEffect(() => {
    if (!agent) return;
    if (type !== 'transport') { setHPage(1); fetchHotel(1); }
    if (type !== 'hotel')     { setTPage(1); fetchTransport(1); }
  }, [agent, search, status, type]);

  // Hotel page navigation
  useEffect(() => {
    if (!agent || hPage === 1) return;
    fetchHotel(hPage);
  }, [hPage]);

  // Transport page navigation
  useEffect(() => {
    if (!agent || tPage === 1) return;
    fetchTransport(tPage);
  }, [tPage]);

  const handleHPage = (p) => { setHPage(p); fetchHotel(p); };
  const handleTPage = (p) => { setTPage(p); fetchTransport(p); };

  const agentName = agent ? `${agent.fname || ''} ${agent.lname || ''}`.trim() : '';

  if (agentLoading) return (
    <div style={{ padding: 80, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
    </div>
  );

  if (!agent) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>
      Agent not found. <Link href="/admin/agents">Go back</Link>
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Agent Invoices</h4>
          <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
            All invoices for <strong style={{ color: '#B1723C' }}>{agentName}</strong>
          </p>
        </div>
        <Link href={`/admin/agents/${agentId}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          Back to Profile
        </Link>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text" value={search} placeholder="Search guest, invoice no…"
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#B1723C'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Status filter */}
          <select
            value={status} onChange={e => setStatus(e.target.value)}
            style={{ padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', fontFamily: 'inherit', cursor: 'pointer', minWidth: 150 }}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Type tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', borderRadius: 8, padding: 4 }}>
            {[['all', 'All'], ['hotel', 'Hotel'], ['transport', 'Transport']].map(([val, label]) => (
              <button key={val} onClick={() => setType(val)}
                style={{
                  padding: '7px 16px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  background: type === val ? '#fff' : 'transparent',
                  color: type === val ? '#B1723C' : '#6B7280',
                  boxShadow: type === val ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {(search || status) && (
            <button
              onClick={() => { setSearch(''); setStatus(''); }}
              style={{ padding: '10px 14px', border: '1.5px solid #FEE2E2', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Hotel Invoices Section */}
      {type !== 'transport' && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }} />
              <h5 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Hotel Invoices</h5>
              <span style={{ fontSize: 11, fontWeight: 600, background: '#EFF6FF', color: '#2563EB', padding: '2px 10px', borderRadius: 20 }}>
                {hotelData.total} total
              </span>
            </div>
          </div>

          {hLoading ? <Spinner /> : hotelData.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>No hotel invoices found</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Invoice No.</th><th>Date</th><th>Guest Name</th>
                      <th>Nationality</th><th>Hotel</th><th>Check-In</th><th>Nights</th>
                      <th>Amount</th><th>Status</th><th style={{ width: 60 }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelData.items.map((inv, idx) => (
                      <tr key={inv._id}>
                        <td style={{ color: '#9CA3AF', fontSize: 12 }}>{(hPage - 1) * 15 + idx + 1}</td>
                        <td style={{ fontWeight: 700, color: '#B1723C', whiteSpace: 'nowrap' }}>#{inv.reserve_no}</td>
                        <td style={{ fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>
                          {inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td style={{ fontWeight: 600 }}>{inv.guest_name || '—'}</td>
                        <td style={{ fontSize: 12 }}>{inv.nationality || '—'}</td>
                        <td style={{ fontSize: 12 }}>{inv.hotel_name || '—'}</td>
                        <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{inv.check_in || '—'}</td>
                        <td style={{ textAlign: 'center', fontSize: 12 }}>{inv.no_of_nights ?? '—'}</td>
                        <td style={{ fontWeight: 700, color: '#059669', whiteSpace: 'nowrap' }}>SAR {fmt(inv.total_amount)}</td>
                        <td>{statusBadge(inv.status || 'Processing')}</td>
                        <td>
                          <Link href={`/admin/hotels/invoice/${inv._id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#EFF6FF', borderRadius: 6, color: '#2563EB', textDecoration: 'none' }}>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager page={hPage} pages={hotelData.pages} onPage={handleHPage} />
            </>
          )}
        </div>
      )}

      {/* Transport Invoices Section */}
      {type !== 'hotel' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
              <h5 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Transport Invoices</h5>
              <span style={{ fontSize: 11, fontWeight: 600, background: '#ECFDF5', color: '#059669', padding: '2px 10px', borderRadius: 20 }}>
                {transportData.total} total
              </span>
            </div>
          </div>

          {tLoading ? <Spinner /> : transportData.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>No transport invoices found</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th><th>Invoice No.</th><th>Date</th><th>Guest Name</th>
                      <th>From</th><th>To</th><th>Vehicle</th><th>Mov. Type</th>
                      <th>Amount</th><th>Status</th><th style={{ width: 60 }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transportData.items.map((inv, idx) => (
                      <tr key={inv._id}>
                        <td style={{ color: '#9CA3AF', fontSize: 12 }}>{(tPage - 1) * 15 + idx + 1}</td>
                        <td style={{ fontWeight: 700, color: '#B1723C', whiteSpace: 'nowrap' }}>T-{inv.invoice_no}</td>
                        <td style={{ fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>{inv.date || '—'}</td>
                        <td style={{ fontWeight: 600 }}>{inv.guest_name || '—'}</td>
                        <td style={{ fontSize: 12 }}>{inv.from_location || '—'}</td>
                        <td style={{ fontSize: 12 }}>{inv.to_location || '—'}</td>
                        <td style={{ fontSize: 12 }}>{inv.vehicle || '—'}</td>
                        <td style={{ fontSize: 12 }}>{inv.mov_type || '—'}</td>
                        <td style={{ fontWeight: 700, color: '#059669', whiteSpace: 'nowrap' }}>SAR {fmt(inv.net_total_with_tax || inv.total)}</td>
                        <td>{statusBadge(inv.status || 'Processing')}</td>
                        <td>
                          <Link href={`/admin/transport/invoice/${inv._id}`}
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#ECFDF5', borderRadius: 6, color: '#059669', textDecoration: 'none' }}>
                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager page={tPage} pages={transportData.pages} onPage={handleTPage} />
            </>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

export default function AgentInvoicesPage({ params }) {
  const { id } = use(params);
  return (
    <Suspense>
      <AgentInvoicesContent agentId={id} />
    </Suspense>
  );
}
