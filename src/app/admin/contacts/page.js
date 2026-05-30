'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const STATUS_MAP = { 0: 'Unread', 1: 'Read' };
const STATUS_BADGE = { 0: 'admin-badge-warning', 1: 'admin-badge-success' };

export default function AdminContactsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [selected, setSelected] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
        setPagination(data.pagination || { total: data.data.length, pages: 1 });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const markRead = async (id) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 1 }),
      });
      setItems(prev => prev.map(item => item._id === id ? { ...item, status: 1 } : item));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: 1 }));
    } catch (e) {
      console.error(e);
    }
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const deleteContact = async (id) => {
    setConfirmDeleteId(null);
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Message deleted');
    } catch (e) {
      toast.error('Failed to delete: ' + e.message);
    }
  };

  const openMessage = (item) => {
    setSelected(item);
    if (item.status === 0) markRead(item._id);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Contact Messages</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{pagination.total} total messages</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 20 }}>
        {/* Messages List */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading...</div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
              <i className="bi bi-envelope" style={{ fontSize: 40, display: 'block', marginBottom: 12 }}></i>
              No contact messages yet
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr
                      key={item._id}
                      style={{
                        cursor: 'pointer',
                        background: selected?._id === item._id ? '#fef9f5' : item.status === 0 ? '#fffbf7' : 'transparent',
                        fontWeight: item.status === 0 ? 600 : 400,
                      }}
                      onClick={() => openMessage(item)}
                    >
                      <td>{item.name}</td>
                      <td style={{ fontSize: 13 }}>{item.email}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.subject || '(No subject)'}
                      </td>
                      <td>
                        <span className={`admin-badge ${STATUS_BADGE[item.status]}`}>
                          {STATUS_MAP[item.status]}
                        </span>
                      </td>
                      <td style={{ color: '#888', fontSize: 13 }}>
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => deleteContact(item._id)}
                          className="admin-btn admin-btn-sm"
                          style={{ background: '#fde8e8', color: '#c0392b' }}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
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

        {/* Message Detail Panel */}
        {selected && (
          <div className="admin-card" style={{ padding: 24, alignSelf: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h6 style={{ fontWeight: 700, margin: 0 }}>Message Detail</h6>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: '#888', display: 'block' }}>From</span>
              <strong>{selected.name}</strong>
              <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>&lt;{selected.email}&gt;</span>
            </div>

            {selected.phone && (
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: '#888', display: 'block' }}>Phone</span>
                <span>{selected.phone}</span>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: '#888', display: 'block' }}>Subject</span>
              <strong>{selected.subject || '(No subject)'}</strong>
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 8 }}>Message</span>
              <div style={{
                background: '#f8f9fa',
                borderRadius: 8,
                padding: 16,
                fontSize: 14,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
                {selected.message}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Inquiry'}`}
                className="admin-btn"
                style={{ background: 'var(--primary-color1)', color: '#fff', flex: 1, textAlign: 'center' }}
              >
                <i className="bi bi-reply me-1"></i> Reply
              </a>
              <button
                onClick={() => deleteContact(selected._id)}
                className="admin-btn"
                style={{ background: '#fde8e8', color: '#c0392b' }}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>

            <p style={{ fontSize: 12, color: '#aaa', marginTop: 16, marginBottom: 0, textAlign: 'center' }}>
              Received: {selected.created_at ? new Date(selected.created_at).toLocaleString() : '—'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
