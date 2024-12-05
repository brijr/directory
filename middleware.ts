import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin-token")?.value;
    const isAuthenticated = !!token;
    const isLoginPage = request.nextUrl.pathname === "/admin/login";

    // Handle unauthenticated users
    if (!isAuthenticated) {
      if (isLoginPage) return NextResponse.next();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify token
    try {
      await jwtVerify(
        token!,
        new TextEncoder().encode(process.env.JWT_SECRET!),
      );

      if (isLoginPage) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      if (isLoginPage) return NextResponse.next();
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
