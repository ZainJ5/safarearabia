'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchData();
  }, [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/newsletter?page=${page}&limit=20`);
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const [confirmId, setConfirmId] = useState(null);

  async function handleDelete(id) {
    setConfirmId(null);
    const tid = toast.loading('Deleting subscriber...');
    try {
      const res  = await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Subscriber deleted', { id: tid });
        fetchData();
      } else {
        toast.error(data.error || 'Failed to delete', { id: tid });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: tid });
    }
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Newsletter Subscribers</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{pagination.total} total subscribers</p>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading...</div>
        ) : subscribers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>No subscribers yet</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub._id}>
                    <td style={{ fontWeight: 500 }}>{sub.email}</td>
                    <td style={{ color: '#888', fontSize: 13 }}>
                      {sub.created_at ? new Date(sub.created_at).toLocaleString() : '—'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 7, cursor: 'pointer' }}
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
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
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
