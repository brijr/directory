import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip middleware for login route and API routes
    if (request.nextUrl.pathname === '/admin/login' ||
        request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    const isAuthenticated = request.cookies.get('admin_authenticated')?.value === 'true';

    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    console.log('User authenticated, allowing access...');
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
