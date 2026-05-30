'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/**
 * Reusable admin CRUD list page with toast notifications and confirm dialog.
 */
export default function AdminListPage({ title, apiUrl, createUrl, editUrl, columns }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [confirmId, setConfirmId] = useState(null); // id pending delete

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const res = await fetch(`${apiUrl}?${params}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
        setPagination(data.pagination || { total: data.data.length, pages: 1 });
      } else if (res.status === 401) {
        setFetchError('Session expired or not authorised. Please log out and log in again as admin.');
      } else {
        setFetchError(data.error || 'Failed to load data');
      }
    } catch (err) {
      setFetchError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    setConfirmId(null);
    const tid = toast.loading('Deleting...');
    try {
      const res  = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Deleted successfully', { id: tid });
        fetchData();
      } else {
        toast.error('Delete failed: ' + (data.error || 'Unknown error'), { id: tid });
      }
    } catch (err) {
      toast.error('Delete error: ' + err.message, { id: tid });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  return (
    <>
      {/* Confirm Delete Dialog */}
      {confirmId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px 36px', maxWidth: 380, width: '90%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-trash" style={{ fontSize: 26, color: '#dc3545' }}></i>
            </div>
            <h5 style={{ fontWeight: 700, marginBottom: 8 }}>Delete Item</h5>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} className="admin-btn" style={{ background: '#f0f0f0', minWidth: 90 }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmId)} className="admin-btn admin-btn-danger" style={{ minWidth: 90 }}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{pagination.total ?? items.length} total items</p>
        </div>
        {createUrl && (
          <Link href={createUrl} className="admin-btn admin-btn-primary">
            <i className="bi bi-plus-lg"></i> Create New
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="admin-card" style={{ padding: 16, marginBottom: 16 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
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
        ) : fetchError ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#c62828' }}>
            <i className="bi bi-exclamation-triangle" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
            {fetchError}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
            <i className="bi bi-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8 }}></i>
            No items found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map(col => <th key={col.key}>{col.label}</th>)}
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : getNestedValue(item, col.key)}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {editUrl && (
                          <Link href={editUrl(item._id)} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                            <i className="bi bi-pencil"></i>
                          </Link>
                        )}
                        <button onClick={() => setConfirmId(item._id)} className="admin-btn admin-btn-danger admin-btn-sm">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="admin-pagination" style={{ padding: '16px 0' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'active' : ''}>{i + 1}</button>
            ))}
            {pagination.pages > 7 && <span style={{ padding: '8px 4px' }}>...</span>}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function getNestedValue(obj, path) {
  if (!path) return '';
  const val = path.split('.').reduce((o, k) => o?.[k], obj);
  return val ?? '—';
}
