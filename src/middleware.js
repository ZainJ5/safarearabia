import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = Number(req.auth?.user?.role);
  const isAdmin = isLoggedIn && userRole === 1;

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/checkout'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // Admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  // Merchant routes
  const isMerchantRoute = pathname.startsWith('/merchant');

  // Auth pages (login, register) — redirect if already logged in
  const authPaths = ['/login', '/register', '/forgot-password'];
  const isAuthPage = authPaths.some((path) => pathname.startsWith(path));

  if (isAuthPage && isLoggedIn) {
    const dest = isAdmin ? '/admin/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // Redirect admins away from the user dashboard to the admin dashboard
  if (pathname.startsWith('/dashboard') && isAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isMerchantRoute && (!isLoggedIn || (userRole !== 2 && userRole !== 1))) {
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
    '/register',
    '/forgot-password',
  ],
};
