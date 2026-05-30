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

  // Auth routes (login, register) don't need full layout
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  // Skip navbar/footer for admin and auth routes only
  // Dashboard routes get navbar/footer so users can navigate
  if (isAdminRoute || isAuthRoute) {
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
