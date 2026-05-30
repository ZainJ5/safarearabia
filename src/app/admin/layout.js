import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: { default: 'Admin Panel', template: '%s | Admin — Safar e Arabian' },
};

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 1) {
    redirect('/login');
  }

  return (
    <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <AdminSidebar />
      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader user={session.user} />
        <main className="admin-content" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        /* Admin-specific overrides — hide public navbar/footer */
        .admin-wrapper ~ footer,
        .admin-wrapper ~ .footer-area,
        .admin-wrapper ~ .footer-marketing-area { display: none !important; }

        .admin-wrapper {
          font-family: 'Jost', sans-serif;
        }
        .admin-wrapper .admin-card {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 24px;
          margin-bottom: 20px;
        }
        .admin-wrapper .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-wrapper .admin-table th {
          background: #f8f9fa;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e8e8e8;
        }
        .admin-wrapper .admin-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
          vertical-align: middle;
        }
        .admin-wrapper .admin-table tr:hover td {
          background: #fafafa;
        }
        .admin-wrapper .admin-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .admin-wrapper .admin-btn-primary {
          background: var(--primary-color1, #B1723C);
          color: #fff;
        }
        .admin-wrapper .admin-btn-primary:hover {
          opacity: 0.9;
        }
        .admin-wrapper .admin-btn-success {
          background: #28a745;
          color: #fff;
        }
        .admin-wrapper .admin-btn-danger {
          background: #dc3545;
          color: #fff;
        }
        .admin-wrapper .admin-btn-sm {
          padding: 5px 10px;
          font-size: 12px;
        }
        .admin-wrapper .admin-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .admin-wrapper .admin-badge-success {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .admin-wrapper .admin-badge-danger {
          background: #ffebee;
          color: #c62828;
        }
        .admin-wrapper .admin-badge-warning {
          background: #fff3e0;
          color: #e65100;
        }
        .admin-wrapper .admin-badge-info {
          background: #e3f2fd;
          color: #1565c0;
        }
        .admin-wrapper .admin-form-group {
          margin-bottom: 20px;
        }
        .admin-wrapper .admin-form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #333;
        }
        .admin-wrapper .admin-form-group input,
        .admin-wrapper .admin-form-group textarea,
        .admin-wrapper .admin-form-group select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: 0.2s;
        }
        .admin-wrapper .admin-form-group input:focus,
        .admin-wrapper .admin-form-group textarea:focus,
        .admin-wrapper .admin-form-group select:focus {
          outline: none;
          border-color: var(--primary-color1, #B1723C);
          box-shadow: 0 0 0 3px rgba(177,114,60,0.1);
        }
        .admin-wrapper .admin-stat-card {
          background: #fff;
          border-radius: 10px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .admin-wrapper .admin-stat-card .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .admin-wrapper .admin-stat-card .stat-info h3 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px;
        }
        .admin-wrapper .admin-stat-card .stat-info p {
          font-size: 13px;
          color: #888;
          margin: 0;
        }
        .admin-wrapper .admin-pagination {
          display: flex;
          gap: 6px;
          margin-top: 20px;
          justify-content: center;
        }
        .admin-wrapper .admin-pagination button,
        .admin-wrapper .admin-pagination a {
          padding: 8px 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          text-decoration: none;
          color: #333;
        }
        .admin-wrapper .admin-pagination .active {
          background: var(--primary-color1, #B1723C);
          color: #fff;
          border-color: var(--primary-color1, #B1723C);
        }
        @media (max-width: 768px) {
          .admin-content { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
