'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

// ─── Status map (numeric 1=Processing 2=Completed 3=Cancelled) ───────────────
const STATUS = {
  1: { label: 'Processing', bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  2: { label: 'Completed',  bg: '#F0FDF4', color: '#166534', dot: '#22C55E' },
  3: { label: 'Cancelled',  bg: '#FFF1F2', color: '#9F1239', dot: '#F43F5E' },
};
const getStatus = (v) => STATUS[Number(v)] || { label: v ? String(v) : '—', bg: '#F9FAFB', color: '#6B7280', dot: '#9CA3AF' };

// ─── Date helpers ─────────────────────────────────────────────────────────────
const fmtShort  = (s) => s ? new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtButton = (s) => s ? new Date(s + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const Dot = ({ color }) => <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />;

const TypePill = ({ type }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 0.1,
    background: type === 'hotel' ? '#EFF6FF' : '#FEF9EE',
    color:      type === 'hotel' ? '#1D4ED8' : '#92400E',
  }}>
    <Dot color={type === 'hotel' ? '#3B82F6' : '#F59E0B'} />
    {type === 'hotel' ? 'Hotel' : 'Transport'}
  </span>
);

const StatusBadge = ({ value }) => {
  const s = getStatus(value);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
      <Dot color={s.dot} />
      {s.label}
    </span>
  );
};

// ─── Loading / Empty ──────────────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ padding: '80px 0', textAlign: 'center' }}>
    <div style={{ width: 34, height: 34, border: '2.5px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.75s linear infinite', margin: '0 auto 14px' }} />
    <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>Loading arrivals…</p>
  </div>
);

const Empty = ({ label, hasFilters, onClear }) => (
  <div style={{ padding: '80px 20px', textAlign: 'center' }}>
    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ color: '#C4C9D4' }}>
        <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011 2a1.5 1.5 0 00-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <h4 style={{ margin: '0 0 5px', fontSize: 15, fontWeight: 700, color: '#374151' }}>
      {hasFilters ? 'No results match your filters' : label}
    </h4>
    <p style={{ margin: '0 0 16px', fontSize: 13, color: '#9CA3AF' }}>
      {hasFilters ? 'Try clearing your filters to see all arrivals.' : 'No invoices are scheduled for this date.'}
    </p>
    {hasFilters && (
      <button onClick={onClear} style={{ padding: '8px 18px', background: '#0A1628', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        Clear filters
      </button>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ArrivalsPage() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [hotelInvs, setHotelInvs] = useState([]);
  const [trnInvs,   setTrnInvs]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [date,      setDate]      = useState(todayStr);

  // filters
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('all');   // 'all' | 'hotel' | 'transport'
  const [agentFilter,  setAgentFilter]  = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');   // 'all' | '1' | '2' | '3'

  // ── Fetch (no server-side date filter — we match client-side by check_in OR created_at) ──
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/admin/hotel-invoices?limit=500'),
        fetch('/api/admin/transport-invoices?limit=500'),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      setHotelInvs(d1.success ? d1.data : []);
      setTrnInvs(d2.success   ? d2.data : []);
    } catch { /**/ }
    setLoading(false);
  }, []);

  // load once on mount (date change handled client-side by filtering)
  useEffect(() => { load(); }, []);

  // ── Unified list (all invoices, no date filter yet) ───────────────────────
  const allRaw = useMemo(() => [
    ...hotelInvs.map(inv => ({
      _id:         inv._id,
      type:        'hotel',
      ref:         String(inv.reserve_no || ''),
      guest:       inv.guest_name    || '—',
      nationality: inv.nationality   || '',
      agent:       inv.agent_name    || '',
      date:        inv.check_in      || '',
      createdAt:   inv.created_at ? new Date(inv.created_at).toISOString().split('T')[0] : '',
      nights:      inv.no_of_nights,
      rooms:       inv.no_of_rooms,
      time:        '',
      from:        '',
      to:          '',
      total:       Number(inv.total_amount || 0),
      status:      Number(inv.status) || 1,
      link:        `/admin/hotels/invoice/${inv._id}`,
    })),
    ...trnInvs.map(inv => ({
      _id:         inv._id,
      type:        'transport',
      ref:         `T-${inv.invoice_no}`,
      guest:       inv.guest_name    || '—',
      nationality: inv.nationality   || '',
      agent:       inv.agent_name    || '',
      date:        inv.date          || '',
      createdAt:   inv.created_at ? new Date(inv.created_at).toISOString().split('T')[0] : '',
      nights:      null,
      rooms:       null,
      time:        inv.time          || '',
      from:        inv.from_location || '',
      to:          inv.to_location   || '',
      total:       Number(inv.net_total_with_tax || inv.total || 0),
      status:      Number(inv.status) || 1,
      link:        `/admin/transport/invoice/${inv._id}`,
    })),
  ], [hotelInvs, trnInvs]);

  // Items matching the selected date: check_in/date starts with date, OR created_at = date
  const allItems = useMemo(() => allRaw.filter(item =>
    (item.date && item.date.startsWith(date)) || item.createdAt === date
  ), [allRaw, date]);

  const agentOptions = useMemo(() => {
    const s = new Set();
    allItems.forEach(i => { if (i.agent) s.add(i.agent); });
    return [...s].sort();
  }, [allItems]);

  const filtered = useMemo(() => allItems.filter(item => {
    if (typeFilter   !== 'all' && item.type             !== typeFilter)   return false;
    if (agentFilter  !== 'all' && item.agent            !== agentFilter)  return false;
    if (statusFilter !== 'all' && String(item.status)   !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.guest.toLowerCase().includes(q)
          || item.ref.toLowerCase().includes(q)
          || item.agent.toLowerCase().includes(q)
          || item.nationality.toLowerCase().includes(q);
    }
    return true;
  }), [allItems, typeFilter, agentFilter, statusFilter, search]);

  const hotelCt  = allItems.filter(i => i.type === 'hotel').length;
  const trnCt    = allItems.filter(i => i.type === 'transport').length;
  const hasFilters = !!(search || typeFilter !== 'all' || agentFilter !== 'all' || statusFilter !== 'all');
  const clearAll   = () => { setSearch(''); setTypeFilter('all'); setAgentFilter('all'); setStatusFilter('all'); };
  const isToday    = date === todayStr;

  // shared select style
  const sel = { padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, outline: 'none', background: '#FAFAFA', fontFamily: 'inherit', cursor: 'pointer', color: '#374151' };

  return (
    <>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 23, fontWeight: 800, color: '#0A1628', margin: '0 0 3px', letterSpacing: '-0.4px' }}>Arrivals</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>
            {isToday ? 'Today — ' : ''}{fmtButton(date)}
            {!isToday && (
              <> · <button onClick={() => setDate(todayStr)} style={{ background: 'none', border: 'none', color: '#B1723C', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}>
                Back to today
              </button></>
            )}
          </p>
        </div>

        {/* Count chips */}
        {!loading && allItems.length > 0 && (
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ padding: '3px 11px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#F3F4F6', color: '#374151' }}>{allItems.length} total</span>
            {hotelCt > 0 && <span style={{ padding: '3px 11px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#EFF6FF', color: '#1D4ED8' }}>{hotelCt} hotel</span>}
            {trnCt   > 0 && <span style={{ padding: '3px 11px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#FEF9EE', color: '#92400E' }}>{trnCt} transport</span>}
          </div>
        )}
      </div>

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E9EBF0', padding: '14px 16px', marginBottom: 14, boxShadow: '0 1px 3px rgba(10,22,40,0.05)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Date picker — styled as a button, native picker on click */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 13px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#FAFAFA', flexShrink: 0, cursor: 'pointer' }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{ color: '#9CA3AF', flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {fmtButton(date)}
            </span>
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" style={{ color: '#9CA3AF', flexShrink: 0, pointerEvents: 'none' }}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            />
          </div>

          {/* Today shortcut */}
          {!isToday && (
            <button onClick={() => setDate(todayStr)}
              style={{ padding: '8px 13px', border: '1px solid #E0D5C5', borderRadius: 8, background: '#FFF8F2', color: '#B1723C', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Today
            </button>
          )}

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: '#E9EBF0', flexShrink: 0 }} />

          {/* Type toggle pills */}
          <div style={{ display: 'inline-flex', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
            {[['all', 'All'], ['hotel', 'Hotel'], ['transport', 'Transport']].map(([val, label], i) => (
              <button key={val} onClick={() => setTypeFilter(val)}
                style={{
                  padding: '8px 14px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                  borderRight: i < 2 ? '1px solid #E5E7EB' : 'none',
                  background: typeFilter === val ? '#0A1628' : '#FAFAFA',
                  color:      typeFilter === val ? '#fff'    : '#6B7280',
                  transition: 'all 0.12s',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: '#E9EBF0', flexShrink: 0 }} />

          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 160px', minWidth: 150 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search guest, ref, agent…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...sel, width: '100%', padding: '8px 12px 8px 30px', boxSizing: 'border-box', cursor: 'text' }}
              onFocus={e => e.target.style.borderColor = '#B1723C'}
              onBlur={e  => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Agent */}
          <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)} style={{ ...sel, minWidth: 140 }}>
            <option value="all">All Agents</option>
            {agentOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Status */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...sel, minWidth: 136 }}>
            <option value="all">All Statuses</option>
            <option value="1">Processing</option>
            <option value="2">Completed</option>
            <option value="3">Cancelled</option>
          </select>

          {/* Refresh */}
          <button onClick={load} title="Refresh"
            style={{ ...sel, padding: '8px 10px', background: '#fff', display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#9CA3AF'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearAll}
              style={{ padding: '8px 12px', border: '1px solid #FECACA', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
              Clear
            </button>
          )}
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div style={{ display: 'flex', gap: 5, marginTop: 10, paddingTop: 10, borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#C4C9D4', fontWeight: 600 }}>Active:</span>
            {search        && <APill label={`"${search}"`} onRemove={() => setSearch('')} />}
            {typeFilter   !== 'all' && <APill label={typeFilter}                             onRemove={() => setTypeFilter('all')} />}
            {agentFilter  !== 'all' && <APill label={agentFilter}                            onRemove={() => setAgentFilter('all')} />}
            {statusFilter !== 'all' && <APill label={STATUS[Number(statusFilter)]?.label || statusFilter} onRemove={() => setStatusFilter('all')} />}
          </div>
        )}
      </div>

      {/* Result meta */}
      {!loading && allItems.length > 0 && (
        <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 10px 1px' }}>
          <strong style={{ color: '#374151' }}>{filtered.length}</strong>
          {' '}arrival{filtered.length !== 1 ? 's' : ''}
          {hasFilters && <span> — filtered from {allItems.length}</span>}
        </p>
      )}

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E9EBF0', boxShadow: '0 1px 3px rgba(10,22,40,0.05)', overflow: 'hidden' }}>
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <Empty
            label={`No arrivals${isToday ? ' today' : ` on ${fmtButton(date)}`}`}
            hasFilters={hasFilters}
            onClear={clearAll}
          />
        ) : (
          <div style={{ overflowX: 'auto' }} className="arrivals-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'inherit' }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #EDEEF2' }}>
                  {['Ref #', 'Type', 'Guest', 'Nationality', 'Agent', 'Date', 'Details', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.7, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const isHotel = item.type === 'hotel';
                  return (
                    <tr key={item._id}
                      style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #F7F8FA' : 'none', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFBFF'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>

                      {/* Ref */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontFamily: "'SF Mono','Fira Code',monospace", fontWeight: 700, color: '#B1723C', fontSize: 12.5 }}>
                          {isHotel ? '#' : ''}{item.ref}
                        </span>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '14px 16px' }}>
                        <TypePill type={item.type} />
                      </td>

                      {/* Guest */}
                      <td style={{ padding: '14px 16px', minWidth: 140 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{item.guest}</span>
                      </td>

                      {/* Nationality */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 13, color: '#6B7280' }}>{item.nationality || '—'}</span>
                      </td>

                      {/* Agent */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        {item.agent
                          ? <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.agent}</span>
                          : <span style={{ color: '#D1D5DB', fontSize: 13 }}>—</span>
                        }
                      </td>

                      {/* Date */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{fmtShort(item.date)}</span>
                      </td>

                      {/* Details */}
                      <td style={{ padding: '14px 16px', minWidth: 150 }}>
                        {isHotel ? (
                          <span style={{ fontSize: 12, color: '#6B7280' }}>
                            {item.nights ? `${item.nights}N` : '—'}
                            {item.rooms  ? <span style={{ color: '#9CA3AF' }}> · {item.rooms}R</span> : ''}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#6B7280' }}>
                            {item.time && <strong style={{ color: '#374151', marginRight: 5 }}>{item.time}</strong>}
                            {(item.from || item.to) ? `${item.from}${item.from && item.to ? ' → ' : ''}${item.to}` : '—'}
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: item.total > 0 ? '#0A1628' : '#9CA3AF' }}>
                          {item.total > 0 ? `SAR ${item.total.toLocaleString()}` : 'SAR 0'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <StatusBadge value={item.status} />
                      </td>

                      {/* View */}
                      <td style={{ padding: '14px 16px' }}>
                        <Link href={item.link}
                          className="arrivals-view-btn"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px', borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: 'none', background: '#F8FAFC', color: '#374151', border: '1px solid #E5E7EB', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                          View
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Thin neutral scrollbar */
        .arrivals-scroll { scrollbar-width: thin; scrollbar-color: #D1D5DB #F9FAFB; }
        .arrivals-scroll::-webkit-scrollbar { height: 4px; }
        .arrivals-scroll::-webkit-scrollbar-track { background: #F9FAFB; }
        .arrivals-scroll::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
        .arrivals-scroll::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }

        /* View button hover */
        .arrivals-view-btn:hover { background: #0A1628 !important; color: #fff !important; border-color: #0A1628 !important; }
      `}</style>
    </>
  );
}

// ─── Active pill ──────────────────────────────────────────────────────────────
function APill({ label, onRemove }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 7px 3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#F3F4F6', color: '#374151' }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, lineHeight: 1, fontSize: 14, display: 'flex', alignItems: 'center' }}>×</button>
    </span>
  );
}
