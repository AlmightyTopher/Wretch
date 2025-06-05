import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /admin
  if (pathname.startsWith('/admin')) {
    console.log(`Accessing admin route: ${pathname}`);
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Optional: Define config to specify which paths the middleware should run on
export const config = {
  matcher: '/admin/:path*', // Apply middleware to all paths under /admin
};
