'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const API = '/api/admin/transport-inquiries';

const STATUS_CFG = {
  new:       { bg: '#fff8e1', color: '#f57f17', label: 'New' },
  contacted: { bg: '#e3f2fd', color: '#1565c0', label: 'Contacted' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32', label: 'Confirmed' },
  cancelled: { bg: '#ffebee', color: '#c62828', label: 'Cancelled' },
};

export default function TransportInquiriesPage() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [detailItem, setDetailItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 20 });
      if (search) p.set('search', search);
      const r = await fetch(`${API}?${p}`);
      const d = await r.json();
      if (d.success) { setItems(d.data); setPagination(d.pagination || { total: d.data.length, pages: 1 }); }
    } catch { /**/ }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const r = await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const d = await r.json();
      if (d.success) {
        toast.success('Status updated');
        setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
        if (detailItem?._id === id) setDetailItem(prev => ({ ...prev, status }));
      } else toast.error(d.error || 'Failed');
    } catch (e) { toast.error(e.message); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id) => {
    setConfirmId(null);
    const tid = toast.loading('Deleting...');
    try {
      const r = await fetch(`${API}/${id}`, { method: 'DELETE' });
      const d = await r.json();
      if (d.success) { toast.success('Deleted', { id: tid }); load(); }
      else toast.error(d.error || 'Failed', { id: tid });
    } catch (e) { toast.error(e.message, { id: tid }); }
  };

  return (
    <>
      {/* Delete confirm */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', maxWidth: 380, width: '90%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-trash" style={{ fontSize: 26, color: '#dc3545' }}></i>
            </div>
            <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Inquiry</h5>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} className="admin-btn" style={{ background: '#f0f0f0', minWidth: 90 }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} className="admin-btn admin-btn-danger" style={{ minWidth: 90 }}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ background: 'linear-gradient(135deg, #B1723C, #6D4100)', padding: '20px 24px', borderRadius: '14px 14px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>Inquiry Detail</h5>
              <button onClick={() => setDetailItem(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, padding: '4px 10px', color: '#fff', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: 24 }}>
              {/* Transport info */}
              <div style={{ background: '#f8f4f0', borderRadius: 8, padding: '14px 16px', marginBottom: 20, borderLeft: '4px solid #B1723C' }}>
                <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Transport</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#333' }}>{detailItem.transport_title}</div>
                {detailItem.vehicle_type && (
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                    <i className="bi bi-car-front" style={{ marginRight: 5, color: '#B1723C' }}></i>
                    {detailItem.vehicle_type}
                  </div>
                )}
              </div>

              {/* Inquiry fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Full Name',     value: detailItem.name,        icon: 'person' },
                  { label: 'Email',         value: detailItem.email,       icon: 'envelope' },
                  { label: 'Phone',         value: detailItem.phone,       icon: 'telephone' },
                  { label: 'Passengers',    value: detailItem.passengers,  icon: 'people' },
                  { label: 'Travel Date',   value: detailItem.travel_date, icon: 'calendar3' },
                  { label: 'Vehicle Type',  value: detailItem.vehicle_type,icon: 'car-front' },
                ].map(({ label, value, icon }) => value ? (
                  <div key={label} style={{ padding: '11px 14px', background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee' }}>
                    <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                      <i className={`bi bi-${icon}`} style={{ marginRight: 4 }}></i>{label}
                    </div>
                    <div style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{value}</div>
                  </div>
                ) : null)}
              </div>

              {detailItem.message && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 8 }}>
                    <i className="bi bi-chat-text" style={{ marginRight: 5 }}></i>Message
                  </div>
                  <div style={{ padding: '12px 16px', background: '#f9f9f9', borderRadius: 8, border: '1px solid #eee', fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                    {detailItem.message}
                  </div>
                </div>
              )}

              {/* Status buttons */}
              <div>
                <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 10 }}>Update Status</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Object.entries(STATUS_CFG).map(([key, { bg, color, label }]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(detailItem._id, key)}
                      disabled={updatingId === detailItem._id}
                      style={{
                        padding: '8px 18px', border: `2px solid ${color}`, borderRadius: 6,
                        cursor: 'pointer', fontWeight: 600, fontSize: 13,
                        background: detailItem.status === key ? color : bg,
                        color: detailItem.status === key ? '#fff' : color,
                        transition: 'all 0.2s', fontFamily: 'inherit',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 18, fontSize: 12, color: '#aaa' }}>
                Submitted: {new Date(detailItem.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Transport Inquiries</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{pagination.total} total inquiries</p>
        </div>
        <Link href="/admin/transport" className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>
          <i className="bi bi-arrow-left"></i> Go Back
        </Link>
      </div>

      {/* Search */}
      <div className="admin-card" style={{ padding: 16, marginBottom: 16 }}>
        <form onSubmit={e => { e.preventDefault(); setPage(1); load(); }} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or transport..."
            style={{ flex: 1, padding: '8px 14px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
          />
          <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
            <i className="bi bi-search"></i> Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setPage(1); }} className="admin-btn admin-btn-sm" style={{ background: '#f0f0f0' }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <i className="bi bi-arrow-repeat" style={{ fontSize: 28, display: 'block', marginBottom: 8, animation: 'spin 1s linear infinite' }}></i>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888' }}>
            <i className="bi bi-inbox" style={{ fontSize: 40, display: 'block', marginBottom: 12 }}></i>
            <h5 style={{ color: '#555' }}>No inquiries yet</h5>
            <p style={{ fontSize: 14 }}>Inquiries submitted from the website will appear here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Inquirer</th>
                  <th>Transport</th>
                  <th>Vehicle / Date</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const sc = STATUS_CFG[item.status] || STATUS_CFG.new;
                  return (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{item.email}</div>
                        {item.phone && <div style={{ fontSize: 12, color: '#888' }}>{item.phone}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: 14, maxWidth: 160 }}>{item.transport_title}</div>
                      </td>
                      <td style={{ fontSize: 13, color: '#555' }}>
                        {item.vehicle_type && <div>{item.vehicle_type}</div>}
                        {item.travel_date && <div style={{ color: '#888', fontSize: 12 }}>{item.travel_date}</div>}
                        {item.passengers && <div style={{ color: '#888', fontSize: 12 }}>{item.passengers} pax</div>}
                      </td>
                      <td style={{ fontSize: 13, color: '#888' }}>
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td>
                        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>
                          {sc.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setDetailItem(item)} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }} title="View">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button onClick={() => setConfirmId(item._id)} className="admin-btn admin-btn-danger admin-btn-sm" title="Delete">
                            <i className="bi bi-trash"></i>
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

        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ padding: '16px 0' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>
            ))}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
