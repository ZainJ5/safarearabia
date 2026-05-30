'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const statusMap = { 1: 'Pending', 2: 'Processing', 3: 'Approved', 4: 'Cancelled' };
const statusBadge = { 1: 'admin-badge-warning', 2: 'admin-badge-info', 3: 'admin-badge-success', 4: 'admin-badge-danger' };
const paymentMap = { 1: 'Paid', 2: 'Unpaid' };
const paymentBadge = { 1: 'admin-badge-success', 2: 'admin-badge-danger' };

export default function AdminOrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [filters, setFilters] = useState({ status: '', payment_status: '', product_type: '', search: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    try {
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) { setItems(data.data); setPagination(data.pagination); }
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Orders</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{pagination.total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search order #..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, width: 180 }} />
          <select value={filters.status} onChange={e => { setFilters(p => ({ ...p, status: e.target.value })); setPage(1); }} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}>
            <option value="">All Status</option>
            <option value="1">Pending</option>
            <option value="2">Processing</option>
            <option value="3">Approved</option>
            <option value="4">Cancelled</option>
          </select>
          <select value={filters.payment_status} onChange={e => { setFilters(p => ({ ...p, payment_status: e.target.value })); setPage(1); }} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}>
            <option value="">All Payments</option>
            <option value="1">Paid</option>
            <option value="2">Unpaid</option>
          </select>
          <select value={filters.product_type} onChange={e => { setFilters(p => ({ ...p, product_type: e.target.value })); setPage(1); }} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}>
            <option value="">All Types</option>
            <option value="tour">Tour</option>
            <option value="hotel">Hotel</option>
            <option value="transport">Transport</option>
            <option value="visa">Visa</option>
            <option value="activity">Activity</option>
          </select>
          <button onClick={() => { setFilters({ status: '', payment_status: '', product_type: '', search: '' }); setPage(1); }} className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>Clear</button>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>No orders found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(order => (
                  <tr key={order._id}>
                    <td><Link href={`/admin/orders/${order._id}`} style={{ color: 'var(--primary-color1)', fontWeight: 500 }}>{order.order_number}</Link></td>
                    <td>{order.first_name} {order.last_name}<br /><span style={{ fontSize: 12, color: '#888' }}>{order.email}</span></td>
                    <td style={{ textTransform: 'capitalize' }}>{order.product_type}</td>
                    <td style={{ fontWeight: 600 }}>SAR {order.total_with_tax?.toLocaleString() || order.total_amount?.toLocaleString() || 0}</td>
                    <td><span className={`admin-badge ${statusBadge[order.status]}`}>{statusMap[order.status]}</span></td>
                    <td><span className={`admin-badge ${paymentBadge[order.payment_status]}`}>{paymentMap[order.payment_status]}</span></td>
                    <td style={{ color: '#888', fontSize: 13 }}>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</td>
                    <td><Link href={`/admin/orders/${order._id}`} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}><i className="bi bi-eye"></i></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ padding: '16px 0' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>)}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}
