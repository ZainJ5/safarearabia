import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { AdminUserProvider } from '@/components/admin/AdminUserContext';
import { AdminSidebarProvider } from '@/components/admin/AdminSidebarContext';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-admin',
});

export const metadata = {
  title: { default: 'Admin Panel', template: '%s | Admin — Safar e Arabian' },
};

export default async function AdminLayout({ children }) {
  const session = await auth();
  const role = Number(session?.user?.role);
  // Only Admin (1) and Employee (4) may access the management portal.
  if (!session?.user || (role !== 1 && role !== 4)) redirect('/login');

  const userCtx = { role, id: session.user.id, fname: session.user.fname || '', lname: session.user.lname || '', customId: session.user.custom_id || null };

  return (
    <AdminUserProvider value={userCtx}>
      <AdminSidebarProvider>
      <div className={`admin-wrapper ${inter.variable}`} style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F1F4F9', fontFamily: 'var(--font-admin, "Inter", -apple-system, BlinkMacSystemFont, sans-serif)' }}>
        <AdminSidebar userRole={role} />
        <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', marginLeft: 248 }}>
          <AdminHeader user={session.user} />
          <main className="admin-content" style={{ flex: 1, padding: '26px 28px', overflowY: 'auto' }}>
            {children}
          </main>
        </div>

        <style>{`
          /* ── Reset & font ── */
          .admin-wrapper, .admin-wrapper * { box-sizing: border-box; }
          /* Force Inter across the entire admin panel regardless of body font */
          .admin-wrapper,
          .admin-wrapper p, .admin-wrapper span, .admin-wrapper div,
          .admin-wrapper h1, .admin-wrapper h2, .admin-wrapper h3,
          .admin-wrapper h4, .admin-wrapper h5, .admin-wrapper h6,
          .admin-wrapper input, .admin-wrapper select,
          .admin-wrapper textarea, .admin-wrapper button, .admin-wrapper a {
            font-family: var(--font-admin, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif) !important;
          }
          /* tabular nums for numeric content in tables */
          .admin-table td { font-variant-numeric: tabular-nums; }

          /* ── Cards ── */
          .admin-card {
            background: #fff;
            border-radius: 14px;
            border: 1px solid #ECEEF2;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
            padding: 24px;
            margin-bottom: 20px;
          }

          /* ── Table ── */
          .admin-table { width: 100%; border-collapse: collapse; }
          .admin-table th {
            background: #F8FAFC;
            padding: 13px 16px;
            text-align: left;
            font-weight: 700;
            font-size: 11.5px;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            border-bottom: 1px solid #ECEEF2;
          }
          .admin-table td {
            padding: 14px 16px;
            border-bottom: 1px solid #F3F5F8;
            font-size: 14px;
            vertical-align: middle;
            color: #1F2937;
          }
          .admin-table tbody tr:hover td { background: #FAFBFD; }
          .admin-table tbody tr:last-child td { border-bottom: none; }

          /* ── Buttons ── */
          .admin-btn {
            padding: 9px 18px; border-radius: 8px; border: none;
            font-size: 13px; font-weight: 600; cursor: pointer;
            transition: all 0.15s ease; display: inline-flex; align-items: center;
            gap: 7px; text-decoration: none; font-family: inherit; line-height: 1;
            white-space: nowrap; letter-spacing: -0.1px;
          }
          .admin-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.1); text-decoration: none; }
          .admin-btn:active { transform: translateY(0); }
          .admin-btn-primary { background: #B1723C; color: #fff; }
          .admin-btn-primary:hover { background: #9B6234; color: #fff; }
          .admin-btn-success { background: #10B981; color: #fff; }
          .admin-btn-danger  { background: #EF4444; color: #fff; }
          .admin-btn-ghost   { background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB; }
          .admin-btn-ghost:hover { background: #E9EAEC; color: #111827; }
          .admin-btn-sm { padding: 7px 13px; font-size: 12px; border-radius: 7px; }
          .admin-btn-xs { padding: 5px 10px; font-size: 11px; border-radius: 6px; }

          /* ── Badges ── */
          .admin-badge {
            padding: 3px 10px; border-radius: 20px;
            font-size: 11px; font-weight: 600; display: inline-block;
            border: 1px solid transparent;
          }
          .admin-badge-success { background: #ECFDF5; color: #059669; border-color: #A7F3D0; }
          .admin-badge-danger  { background: #FEF2F2; color: #DC2626; border-color: #FECACA; }
          .admin-badge-warning { background: #FFFBEB; color: #D97706; border-color: #FDE68A; }
          .admin-badge-info    { background: #EFF6FF; color: #2563EB; border-color: #BFDBFE; }
          .admin-badge-neutral { background: #F3F4F6; color: #6B7280; border-color: #E5E7EB; }

          /* ── Form groups ── */
          .admin-form-group { margin-bottom: 20px; }
          .admin-form-group label {
            display: block; font-size: 13px; font-weight: 700;
            margin-bottom: 7px; color: #1F2937; letter-spacing: 0.1px;
          }
          .admin-form-group input,
          .admin-form-group textarea,
          .admin-form-group select {
            width: 100%; padding: 10px 14px;
            border: 1.5px solid #E5E7EB;
            border-radius: 9px; font-size: 13.5px; font-family: inherit;
            transition: border-color 0.15s, box-shadow 0.15s;
            background: #FAFAFA; color: #111827;
          }
          .admin-form-group input:focus,
          .admin-form-group textarea:focus,
          .admin-form-group select:focus {
            outline: none; border-color: #B1723C; background: #fff;
            box-shadow: 0 0 0 3px rgba(177,114,60,0.1);
          }
          .admin-form-group input::placeholder,
          .admin-form-group textarea::placeholder { color: #C4C9D4; }

          /* ── Stat cards ── */
          .admin-stat-card {
            background: #fff; border-radius: 14px;
            padding: 20px 22px;
            border: 1px solid #ECEEF2;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
            display: flex; align-items: center; gap: 14px;
            transition: transform 0.15s, box-shadow 0.15s;
          }
          .admin-stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.07);
          }
          .stat-icon {
            width: 50px; height: 50px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 22px; flex-shrink: 0;
          }
          .stat-info h3 { font-size: 24px; font-weight: 800; margin: 0 0 2px; color: #0F172A; letter-spacing: -0.5px; }
          .stat-info p  { font-size: 12px; color: #6B7280; margin: 0; font-weight: 500; }

          /* ── Pagination ── */
          .admin-pagination { display: flex; gap: 4px; justify-content: center; padding: 16px 0; }
          .admin-pagination button {
            padding: 7px 13px; border: 1.5px solid #E5E7EB; border-radius: 8px;
            background: #fff; cursor: pointer; font-size: 13px;
            color: #374151; transition: all 0.15s; font-family: inherit; font-weight: 500;
          }
          .admin-pagination button:hover { border-color: #B1723C; color: #B1723C; }
          .admin-pagination button.active { background: #B1723C; color: #fff; border-color: #B1723C; font-weight: 700; }
          .admin-pagination button:disabled { opacity: 0.35; cursor: not-allowed; }

          /* ── Divider ── */
          .admin-divider { height: 1px; background: #F0F2F5; margin: 20px 0; }

          /* ── Section heading ── */
          .admin-section-title { font-size: 13px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 14px; }

          /* ── Content scrollbar ── */
          .admin-content::-webkit-scrollbar { width: 5px; }
          .admin-content::-webkit-scrollbar-track { background: transparent; }
          .admin-content::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }

          /* ── Spin animation ── */
          @keyframes spin { to { transform: rotate(360deg); } }

          /* ── Responsive ── */
          @media (max-width: 768px) {
            .admin-content { padding: 16px !important; }
            .admin-main { margin-left: 0 !important; }
          }
        `}</style>
      </div>
      </AdminSidebarProvider>
    </AdminUserProvider>
  );
}
