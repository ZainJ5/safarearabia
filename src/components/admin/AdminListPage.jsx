'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Reusable admin CRUD list page.
 * Props:
 *  - title: page heading
 *  - apiUrl: API endpoint (e.g. '/api/admin/tours')
 *  - createUrl: URL for create page
 *  - editUrl: function(id) => edit page URL
 *  - columns: array of { key, label, render? }
 */
export default function AdminListPage({ title, apiUrl, createUrl, editUrl, columns }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const res = await fetch(`${apiUrl}?${params}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert('Delete failed: ' + data.error);
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h4>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>{pagination.total} total items</p>
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
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>No items found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(item) : (
                          typeof col.key === 'function' ? col.key(item) : getNestedValue(item, col.key)
                        )}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {editUrl && (
                          <Link href={editUrl(item._id)} className="admin-btn admin-btn-sm" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                            <i className="bi bi-pencil"></i>
                          </Link>
                        )}
                        <button onClick={() => handleDelete(item._id)} className="admin-btn admin-btn-danger admin-btn-sm">
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
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <button key={p} onClick={() => setPage(p)} className={page === p ? 'active' : ''}>
                  {p}
                </button>
              );
            })}
            {pagination.pages > 7 && <span style={{ padding: '8px 4px' }}>...</span>}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </>
  );
}

function getNestedValue(obj, path) {
  if (!path) return '';
  const val = path.split('.').reduce((o, k) => o?.[k], obj);
  return val ?? '—';
}
