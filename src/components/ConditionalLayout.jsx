'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/**
 * ConditionalLayout - Wraps children with Navbar and Footer
 * except for admin routes which have their own layout
 */
export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Admin routes have their own layout with AdminSidebar and AdminHeader
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Dashboard routes also have their own layout
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  // Auth routes (login, register) don't need full layout
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
  
  // Skip navbar/footer for admin, dashboard, and auth routes
  if (isAdminRoute || isDashboardRoute || isAuthRoute) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
