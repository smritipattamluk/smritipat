import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // API routes should be handled separately
  const isApiRoute = pathname.startsWith('/api');

  // Don't interfere with API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from login page
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect non-logged-in users to login page
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, other static assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
