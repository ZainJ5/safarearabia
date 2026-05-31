'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

const ORDER_STATUS = {
  1: { label: 'Pending',    bg: '#fff8e1', color: '#f57f17' },
  2: { label: 'Processing', bg: '#e3f2fd', color: '#1565c0' },
  3: { label: 'Approved',   bg: '#e8f5e9', color: '#2e7d32' },
  4: { label: 'Cancelled',  bg: '#ffebee', color: '#c62828' },
};

const PAYMENT_STATUS = {
  1: { label: 'Paid',   bg: '#e8f5e9', color: '#2e7d32' },
  2: { label: 'Unpaid', bg: '#fff8e1', color: '#f57f17' },
};

const TYPE_ICONS = {
  tour:      { icon: 'bi-map', color: '#2e7d32', bg: '#e8f5e9' },
  hotel:     { icon: 'bi-building', color: '#1565c0', bg: '#e3f2fd' },
  transport: { icon: 'bi-car-front', color: '#B1723C', bg: '#f8f4f0' },
  activity:  { icon: 'bi-activity', color: '#6a1b9a', bg: '#f3e5f5' },
  visa:      { icon: 'bi-passport', color: '#c62828', bg: '#ffebee' },
};

function Badge({ cfg, value }) {
  const s = cfg[value] || { label: '—', bg: '#f5f5f5', color: '#888' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [page, setPage]           = useState(1);
  const [expanded, setExpanded]   = useState(null);

  const fetchBookings = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/bookings?page=${p}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setPagination(data.pagination);
        setPage(p);
      }
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(1); }, [fetchBookings]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <i className="bi bi-arrow-repeat" style={{ fontSize: 36, color: '#B1723C', display: 'block', marginBottom: 12, animation: 'spin 1s linear infinite' }}></i>
        <p style={{ color: '#888' }}>Loading your bookings...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f8f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <i className="bi bi-calendar-x" style={{ fontSize: 36, color: '#B1723C' }}></i>
        </div>
        <h5 style={{ color: '#333', fontWeight: 700, marginBottom: 8 }}>No Bookings Yet</h5>
        <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>
          You don&apos;t have any bookings yet. Start exploring our services!
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tours" style={{ padding: '10px 24px', background: '#B1723C', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Browse Tours</Link>
          <Link href="/all-visa" style={{ padding: '10px 24px', background: '#6f42c1', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Visa Services</Link>
          <Link href="/transport" style={{ padding: '10px 24px', background: '#0d6efd', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Transport</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontWeight: 700, margin: 0, color: '#100C08' }}>My Bookings</h3>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{pagination.total} total bookings</p>
        </div>
      </div>

      {/* Booking cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {bookings.map((b) => {
          const typeInfo = TYPE_ICONS[b.product_type] || TYPE_ICONS.tour;
          const isExpanded = expanded === b._id;

          return (
            <div key={b._id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
              {/* Card header row */}
              <div
                onClick={() => setExpanded(isExpanded ? null : b._id)}
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', userSelect: 'none' }}
              >
                {/* Type icon */}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: typeInfo.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`bi ${typeInfo.icon}`} style={{ fontSize: 20, color: typeInfo.color }}></i>
                </div>

                {/* Order info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#100C08' }}>
                      #{b.order_number || b._id?.toString().slice(-8).toUpperCase()}
                    </span>
                    <span style={{ textTransform: 'capitalize', fontSize: 12, color: typeInfo.color, background: typeInfo.bg, padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
                      {b.product_type}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#555' }}>
                    {b.start_date ? `Check-in: ${new Date(b.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Date not specified'}
                    {b.days ? ` · ${b.days} day(s)` : ''}
                  </div>
                </div>

                {/* Status badges */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge cfg={ORDER_STATUS} value={b.status} />
                  <span style={{ fontWeight: 700, color: '#B1723C', fontSize: 15 }}>
                    SAR {parseFloat(b.total_with_tax || b.total_amount || 0).toFixed(2)}
                  </span>
                </div>

                {/* Expand toggle */}
                <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} style={{ color: '#aaa', fontSize: 14, flexShrink: 0 }}></i>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f5f5f5' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginTop: 16 }}>
                    {[
                      ['Payment', <Badge key="p" cfg={PAYMENT_STATUS} value={b.payment_status} />],
                      b.adult_qty  && ['Adults',   `${b.adult_qty} × SAR ${b.adult_unit_price || 0}`],
                      b.child_qty  && ['Children', `${b.child_qty} × SAR ${b.child_unit_price || 0}`],
                      b.end_date   && ['Check-out', b.end_date],
                      b.transport_type && ['Vehicle', b.transport_type],
                      b.notes      && ['Notes', b.notes],
                    ].filter(Boolean).map(([label, val], i) => (
                      <div key={i} style={{ padding: '10px 12px', background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
                        <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  {(b.total_amount || b.tax_amount) > 0 && (
                    <div style={{ marginTop: 14, padding: '12px 16px', background: '#f8f4f0', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, color: '#666' }}>
                        Subtotal: SAR {b.total_amount || 0}
                        {b.tax_amount > 0 && <span style={{ marginLeft: 12 }}>Tax ({b.tax_rate}%): SAR {b.tax_amount}</span>}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#B1723C' }}>
                        Total: SAR {b.total_with_tax || b.total_amount || 0}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 24 }}>
          <button
            onClick={() => fetchBookings(page - 1)}
            disabled={page <= 1}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: '#555', fontSize: 13 }}
          >
            ← Prev
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchBookings(p)}
              style={{
                padding: '8px 14px', border: '1px solid', borderRadius: 6, fontSize: 13, cursor: 'pointer',
                borderColor: p === page ? '#B1723C' : '#ddd',
                background: p === page ? '#B1723C' : '#fff',
                color: p === page ? '#fff' : '#555',
                fontWeight: p === page ? 700 : 400,
              }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => fetchBookings(page + 1)}
            disabled={page >= pagination.pages}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: page >= pagination.pages ? 'not-allowed' : 'pointer', color: '#555', fontSize: 13 }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Info note */}
      <div style={{ marginTop: 24, padding: '14px 18px', background: '#f8f4f0', borderRadius: 10, borderLeft: '4px solid #B1723C', fontSize: 13, color: '#666' }}>
        <i className="bi bi-info-circle" style={{ color: '#B1723C', marginRight: 8 }}></i>
        Transport inquiries and visa applications submitted via the website are managed by our team and will be confirmed by email.
        <Link href="/contact-us" style={{ color: '#B1723C', fontWeight: 600, marginLeft: 8, textDecoration: 'none' }}>Contact us →</Link>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
