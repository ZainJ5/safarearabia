import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole   = Number(req.auth?.user?.role);
  const isAdmin    = isLoggedIn && userRole === 1;
  const isEmployee = isLoggedIn && userRole === 4;
  // Admins and employees use the admin (management) portal. Agents no longer log in.
  const isStaff    = isAdmin || isEmployee;
  // Employees are scoped to the invoice screens; admins land on the dashboard.
  const staffHome  = isAdmin ? '/admin/dashboard' : '/admin/hotels/invoice';

  const protectedPaths = ['/dashboard', '/checkout'];
  const isProtected    = protectedPaths.some((p) => pathname.startsWith(p));
  const isAdminRoute   = pathname.startsWith('/admin');
  const isMerchantRoute = pathname.startsWith('/merchant');
  const authPaths      = ['/login', '/user-login', '/register', '/forgot-password'];
  const isAuthPage     = authPaths.some((p) => pathname.startsWith(p));

  // Logged-in users visiting auth pages → redirect to their portal
  if (isAuthPage && isLoggedIn) {
    const dest = isStaff ? staffHome : '/dashboard';
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // Staff visiting the customer dashboard → send to their portal home
  if (pathname.startsWith('/dashboard') && isStaff) {
    return NextResponse.redirect(new URL(staffHome, req.url));
  }

  // Staff visiting checkout → not needed, redirect to their portal home
  if (pathname.startsWith('/checkout') && isStaff) {
    return NextResponse.redirect(new URL(staffHome, req.url));
  }

  // Employees have no dashboard — bounce them to their invoices
  if (pathname.startsWith('/admin/dashboard') && isEmployee) {
    return NextResponse.redirect(new URL('/admin/hotels/invoice', req.url));
  }

  // Customer protected routes
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: require admin OR agent
  if (isAdminRoute && !isStaff) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isMerchantRoute && (!isLoggedIn || (userRole !== 4 && userRole !== 1))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/checkout/:path*',
    '/admin/:path*',
    '/merchant/:path*',
    '/login',
    '/user-login',
    '/register',
    '/forgot-password',
  ],
};
