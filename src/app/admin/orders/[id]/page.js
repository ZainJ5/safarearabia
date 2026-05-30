'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';

const statusMap = { 1: 'Pending', 2: 'Processing', 3: 'Approved', 4: 'Cancelled' };
const statusBadge = { 1: 'admin-badge-warning', 2: 'admin-badge-info', 3: 'admin-badge-success', 4: 'admin-badge-danger' };
const paymentMap = { 1: 'Paid', 2: 'Unpaid' };

export default function AdminOrderDetailPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setOrder(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = async (field, value) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (data.success) setOrder(data.data);
    } catch (e) { alert(e.message); }
    setSaving(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading...</div>;
  if (!order) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Order not found</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Order: {order.order_number}</h4>
          <p style={{ color: '#888', fontSize: 13 }}>{order.created_at ? new Date(order.created_at).toLocaleString() : ''}</p>
        </div>
        <Link href="/admin/orders" className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>
          <i className="bi bi-arrow-left"></i> Back
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Order Details */}
          <div className="admin-card">
            <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Order Details</h5>
            <table className="admin-table">
              <tbody>
                <tr><td style={{ fontWeight: 500, width: 180 }}>Order Number</td><td>{order.order_number}</td></tr>
                <tr><td style={{ fontWeight: 500 }}>Product Type</td><td style={{ textTransform: 'capitalize' }}>{order.product_type}</td></tr>
                {order.transport_type && <tr><td style={{ fontWeight: 500 }}>Transport Type</td><td>{order.transport_type}</td></tr>}
                <tr><td style={{ fontWeight: 500 }}>Start Date</td><td>{order.start_date || '—'}</td></tr>
                <tr><td style={{ fontWeight: 500 }}>End Date</td><td>{order.end_date || '—'}</td></tr>
                <tr><td style={{ fontWeight: 500 }}>Days</td><td>{order.days || '—'}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Pricing */}
          <div className="admin-card">
            <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Pricing</h5>
            <table className="admin-table">
              <tbody>
                {order.adult_qty > 0 && <tr><td>Adults ({order.adult_qty}x @ SAR {order.adult_unit_price})</td><td style={{ textAlign: 'right' }}>SAR {order.adult_total_price}</td></tr>}
                {order.child_qty > 0 && <tr><td>Children ({order.child_qty}x @ SAR {order.child_unit_price})</td><td style={{ textAlign: 'right' }}>SAR {order.child_total_price}</td></tr>}
                <tr><td>Subtotal</td><td style={{ textAlign: 'right' }}>SAR {order.total_amount}</td></tr>
                {order.tax_amount > 0 && <tr><td>Tax ({order.tax_rate}%)</td><td style={{ textAlign: 'right' }}>SAR {order.tax_amount}</td></tr>}
                <tr style={{ fontWeight: 700, fontSize: 16 }}><td>Total</td><td style={{ textAlign: 'right' }}>SAR {order.total_with_tax || order.total_amount}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Customer */}
          <div className="admin-card">
            <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Customer Info</h5>
            <table className="admin-table">
              <tbody>
                <tr><td style={{ fontWeight: 500, width: 180 }}>Name</td><td>{order.first_name} {order.last_name}</td></tr>
                <tr><td style={{ fontWeight: 500 }}>Email</td><td>{order.email}</td></tr>
                <tr><td style={{ fontWeight: 500 }}>Phone</td><td>{order.phone || '—'}</td></tr>
                <tr><td style={{ fontWeight: 500 }}>Address</td><td>{order.address || '—'}</td></tr>
                {order.notes && <tr><td style={{ fontWeight: 500 }}>Notes</td><td>{order.notes}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Status Controls */}
          <div className="admin-card">
            <h5 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Manage Order</h5>
            <div className="admin-form-group">
              <label>Order Status</label>
              <select
                value={order.status}
                onChange={e => updateField('status', Number(e.target.value))}
                disabled={saving}
              >
                <option value={1}>Pending</option>
                <option value={2}>Processing</option>
                <option value={3}>Approved</option>
                <option value={4}>Cancelled</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Payment Status</label>
              <select
                value={order.payment_status}
                onChange={e => updateField('payment_status', Number(e.target.value))}
                disabled={saving}
              >
                <option value={1}>Paid</option>
                <option value={2}>Unpaid</option>
              </select>
            </div>
            <div style={{ marginTop: 16 }}>
              <span className={`admin-badge ${statusBadge[order.status]}`} style={{ fontSize: 14, padding: '6px 14px' }}>
                {statusMap[order.status]}
              </span>
              {' '}
              <span className={`admin-badge ${order.payment_status === 1 ? 'admin-badge-success' : 'admin-badge-danger'}`} style={{ fontSize: 14, padding: '6px 14px' }}>
                {paymentMap[order.payment_status]}
              </span>
            </div>
            {saving && <p style={{ fontSize: 12, color: 'var(--primary-color1)', marginTop: 8 }}>Saving...</p>}
          </div>
        </div>
      </div>
    </>
  );
}
