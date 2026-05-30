'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const statCards = [
  { key: 'tours', label: 'Tours', icon: 'bi-map', color: '#B1723C', bg: 'rgba(177,114,60,0.1)' },
  { key: 'hotels', label: 'Hotels', icon: 'bi-building', color: '#1565c0', bg: 'rgba(21,101,192,0.1)' },
  { key: 'transports', label: 'Transports', icon: 'bi-car-front', color: '#2e7d32', bg: 'rgba(46,125,50,0.1)' },
  { key: 'orders', label: 'Orders', icon: 'bi-receipt', color: '#e65100', bg: 'rgba(230,81,0,0.1)' },
  { key: 'users', label: 'Users', icon: 'bi-people', color: '#6a1b9a', bg: 'rgba(106,27,154,0.1)' },
  { key: 'visas', label: 'Visas', icon: 'bi-passport', color: '#00838f', bg: 'rgba(0,131,143,0.1)' },
  { key: 'activities', label: 'Activities', icon: 'bi-activity', color: '#ad1457', bg: 'rgba(173,20,87,0.1)' },
  { key: 'destinations', label: 'Destinations', icon: 'bi-geo-alt', color: '#4527a0', bg: 'rgba(69,39,160,0.1)' },
];

const orderStatusMap = { 1: 'Pending', 2: 'Processing', 3: 'Approved', 4: 'Cancelled' };
const orderStatusBadge = { 1: 'admin-badge-warning', 2: 'admin-badge-info', 3: 'admin-badge-success', 4: 'admin-badge-danger' };

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><p>Loading dashboard...</p></div>;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h4>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="row" style={{ marginBottom: 24 }}>
        {statCards.map(card => (
          <div key={card.key} className="col-xl-3 col-lg-4 col-md-6 mb-3">
            <div className="admin-stat-card">
              <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div className="stat-info">
                <h3 style={{ color: '#333' }}>{data?.stats?.[card.key] || 0}</h3>
                <p>{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="admin-card" style={{ background: 'linear-gradient(135deg, var(--primary-color1, #B1723C), var(--primary-color2, #6D4100))', color: '#fff' }}>
            <p style={{ fontSize: 14, margin: '0 0 8px', opacity: 0.85 }}>Total Revenue</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, margin: 0 }}>${(data?.totalRevenue || 0).toLocaleString()}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="admin-card">
            <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Link href="/admin/tours/create" className="admin-btn admin-btn-primary admin-btn-sm"><i className="bi bi-plus"></i> New Tour</Link>
              <Link href="/admin/hotels/create" className="admin-btn admin-btn-primary admin-btn-sm"><i className="bi bi-plus"></i> New Hotel</Link>
              <Link href="/admin/transport/create" className="admin-btn admin-btn-primary admin-btn-sm"><i className="bi bi-plus"></i> New Transport</Link>
              <Link href="/admin/blog/create" className="admin-btn admin-btn-primary admin-btn-sm"><i className="bi bi-plus"></i> New Blog</Link>
              <Link href="/admin/orders" className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}><i className="bi bi-receipt"></i> View Orders</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h5 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Recent Orders</h5>
          <Link href="/admin/orders" style={{ fontSize: 13, color: 'var(--primary-color1)' }}>View All →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(!data?.recentOrders || data.recentOrders.length === 0) ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#999', padding: 32 }}>No orders yet</td></tr>
              ) : (
                data.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td><Link href={`/admin/orders/${order._id}`} style={{ color: 'var(--primary-color1)', fontWeight: 500 }}>{order.order_number}</Link></td>
                    <td style={{ textTransform: 'capitalize' }}>{order.product_type}</td>
                    <td style={{ fontWeight: 600 }}>${order.total_amount?.toLocaleString() || 0}</td>
                    <td><span className={`admin-badge ${orderStatusBadge[order.status] || ''}`}>{orderStatusMap[order.status] || 'Unknown'}</span></td>
                    <td style={{ color: '#888' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
