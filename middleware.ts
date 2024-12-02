import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check if user is authenticated
    const isAuthenticated = request.cookies.get('admin_authenticated');
    
    // If not authenticated and not trying to login, redirect to login
    if (!isAuthenticated && !request.nextUrl.pathname.endsWith('/login')) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}
