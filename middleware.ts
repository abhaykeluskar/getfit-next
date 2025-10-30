import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Check if it's an auth page
  const isAuthPage = pathname.startsWith("/auth");

  // Skip middleware for these paths
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/manifest.json")
  ) {
    return NextResponse.next();
  }

  // Check for PocketBase auth cookie
  const pbAuthCookie = request.cookies.get("pb_auth");

  // If on auth page and already logged in, redirect to home
  if (isAuthPage && pbAuthCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not on auth page and not logged in, redirect to login
  if (!isAuthPage && !pbAuthCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)",
  ],
};
