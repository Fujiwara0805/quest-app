import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  // Root path "/" should always show splash screen
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Auth related paths don't need any redirects
  if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // If trying to access protected routes without token, redirect to home (which will show splash screen)
  if (!token && (pathname.startsWith('/quests') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Applies middleware only to matching paths
export const config = {
  matcher: ['/', '/quests/:path*', '/admin/:path*', '/login', '/register'],
};
