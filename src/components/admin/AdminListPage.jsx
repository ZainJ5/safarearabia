'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const IcoSearch = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);
const IcoPlus = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
);
const IcoPencil = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IcoTrash = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
);
const IcoX = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);
const IcoInbox = () => (
  <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M22 12h-6l-2 3h-4l-2-3H2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const IcoAlert = () => (
  <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
);

export default function AdminListPage({ title, apiUrl, createUrl, editUrl, columns, extraActions }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [confirmId, setConfirmId] = useState(null);

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
        setFetchError('Session expired. Please log out and log in again.');
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

  const total = pagination.total ?? items.length;

  return (
    <>
      {/* Confirm Delete Dialog */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '36px 40px', maxWidth: 400, width: '90%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#EF4444' }}>
              <IcoTrash />
            </div>
            <h5 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: '#111827' }}>Delete Item</h5>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>Are you sure you want to delete this item? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: '10px 24px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmId)} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
                <IcoTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#111827', letterSpacing: '-0.3px' }}>{title}</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>{total.toLocaleString()} total records</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {extraActions}
          {createUrl && (
            <Link href={createUrl} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <IcoPlus /> Create New
            </Link>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}>
              <IcoSearch />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              style={{ width: '100%', padding: '9px 14px 9px 38px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13.5, fontFamily: 'inherit', color: '#111827', background: '#FAFAFA', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#B1723C'; e.target.style.boxShadow = '0 0 0 3px rgba(177,114,60,0.1)'; e.target.style.background = '#fff'; }}
              onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#FAFAFA'; }}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IcoSearch /> Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setPage(1); }} style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#fff', fontSize: 12, cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', fontWeight: 500 }}>
              <IcoX /> Clear
            </button>
          )}
        </form>
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #F0F0F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
            <p style={{ margin: 0, fontSize: 13 }}>Loading data...</p>
          </div>
        ) : fetchError ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#DC2626' }}>
            <div style={{ color: '#FCA5A5', marginBottom: 12, display: 'flex', justifyContent: 'center' }}><IcoAlert /></div>
            <p style={{ margin: 0, fontSize: 14 }}>{fetchError}</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
            <div style={{ color: '#D1D5DB', marginBottom: 12, display: 'flex', justifyContent: 'center' }}><IcoInbox /></div>
            <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#6B7280' }}>No records found</p>
            <p style={{ margin: 0, fontSize: 13 }}>{search ? 'Try a different search term.' : 'Get started by creating one.'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map(col => <th key={col.key}>{col.label}</th>)}
                  <th style={{ width: 120, textAlign: 'right', paddingRight: 20 }}>Actions</th>
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
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', paddingRight: 6 }}>
                        {editUrl && (
                          <Link href={editUrl(item._id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, background: '#EFF6FF', color: '#2563EB', fontSize: 12, fontWeight: 600, textDecoration: 'none', border: '1px solid #DBEAFE', transition: 'all 0.15s' }}>
                            <IcoPencil /> Edit
                          </Link>
                        )}
                        <button onClick={() => setConfirmId(item._id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 600, border: '1px solid #FECACA', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                          <IcoTrash /> Delete
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
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', padding: '16px 0', borderTop: '1px solid #F3F4F6' }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '7px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#374151', fontFamily: 'inherit', opacity: page <= 1 ? 0.4 : 1 }}>
              ← Prev
            </button>
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} style={{ padding: '7px 13px', border: '1.5px solid', borderColor: page === i + 1 ? '#B1723C' : '#E5E7EB', borderRadius: 8, background: page === i + 1 ? '#B1723C' : '#fff', cursor: 'pointer', fontSize: 13, color: page === i + 1 ? '#fff' : '#374151', fontWeight: page === i + 1 ? 700 : 400, fontFamily: 'inherit' }}>{i + 1}</button>
            ))}
            {pagination.pages > 7 && <span style={{ padding: '7px 8px', color: '#9CA3AF', fontSize: 13 }}>...</span>}
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} style={{ padding: '7px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#374151', fontFamily: 'inherit', opacity: page >= pagination.pages ? 0.4 : 1 }}>
              Next →
            </button>
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
