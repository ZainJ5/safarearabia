'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STATUS_MAP = {
  1: { label: 'Pending', class: 'bg-warning text-dark' },
  2: { label: 'Processing', class: 'bg-info text-dark' },
  3: { label: 'Approved', class: 'bg-success' },
  4: { label: 'Cancelled', class: 'bg-danger' },
};

const PAYMENT_MAP = {
  1: { label: 'Paid', class: 'bg-success' },
  2: { label: 'Unpaid', class: 'bg-warning text-dark' },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchBookings(1);
  }, []);

  async function fetchBookings(page) {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/bookings?page=${page}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">My Bookings</h3>
        <span className="badge bg-secondary">{pagination.total} Total</span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'var(--primary-color1)' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : bookings.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle border">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Type</th>
                  <th>Check-in</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const statusInfo = STATUS_MAP[b.status] || { label: 'Unknown', class: 'bg-secondary' };
                  return (
                    <tr key={b._id}>
                      <td className="fw-bold" style={{ fontSize: '13px' }}>
                        {b.order_number || b._id?.toString().slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">{b.product_type}</span>
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        {b.start_date
                          ? new Date(b.start_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td style={{ fontSize: '13px' }}>
                        {b.adult_qty || 1} Adult{(b.adult_qty || 1) > 1 ? 's' : ''}
                        {b.child_qty > 0 ? `, ${b.child_qty} Child${b.child_qty > 1 ? 'ren' : ''}` : ''}
                      </td>
                      <td className="fw-bold" style={{ color: 'var(--primary-color1)' }}>
                        SAR {parseFloat(b.total_with_tax || b.total_amount || 0).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${PAYMENT_MAP[b.payment_status]?.class || 'bg-secondary'}`}>
                          {PAYMENT_MAP[b.payment_status]?.label || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <li key={p} className={`page-item ${p === pagination.page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => fetchBookings(p)}>
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <i
            className="bi bi-calendar-x"
            style={{ fontSize: '48px', color: '#ccc', display: 'block', marginBottom: '15px' }}
          ></i>
          <h5>No Bookings Found</h5>
          <p className="text-muted mb-4">You don&apos;t have any current or past bookings yet.</p>
          <Link href="/tours" className="primary-btn1">
            Browse Tours
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
              <path
                d="M1 5.5H13M13 5.5L8.5 1M13 5.5L8.5 10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}