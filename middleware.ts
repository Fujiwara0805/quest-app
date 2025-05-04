import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  // ルートパスは常にアクセス可能（スプラッシュ画面）
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 認証関連のパスは常にアクセス可能
  if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // メインエリアの保護されたルート
  if (!token && pathname.startsWith('/quests') || pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // その他の場合は通常通り処理
  return NextResponse.next();
}

// 簡略化されたマッチャー
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/quests/:path*',
    '/admin/:path*',
  ],
};
