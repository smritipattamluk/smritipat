import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/api/auth'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (!session && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access login page
    if (session && pathname === '/login') {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
