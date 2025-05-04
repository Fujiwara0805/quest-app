import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  // ルートパスは常にアクセス可能
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 認証関連パスは常にアクセス可能
  if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // トークンなしで保護されたルートにアクセスしようとする場合、ルートにリダイレクト
  if (!token && (pathname.startsWith('/quests') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Middlewareが適用されるパス
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/quests',
    '/quests/:path*',
    '/admin',
    '/admin/:path*',
    '/favorites',
    '/reservations',
    '/profile',
  ],
};
