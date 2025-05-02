import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isLoggedIn = !!token;
    const isLoginPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isAdminEmail = token?.email === "quest202412@gmail.com";
    const isAdminRole = token?.role === "admin";
    const isAdmin = isAdminEmail || isAdminRole;

    // 認証関連のページは通過させる
    if (isLoginPage) {
      // すでにログインしている場合はリダイレクト
      if (isLoggedIn) {
        if (isAdmin) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        } else {
          return NextResponse.redirect(new URL("/quests", req.url));
        }
      }
      return null;
    }

    // 未ログインの場合は、常にログインページにリダイレクト
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }
    
    // 管理者ルートへのアクセスをチェック
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // 管理者でない場合はホームページにリダイレクト
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // クエスト一覧ページにアクセスした管理者を管理者ダッシュボードにリダイレクト
    if (isAdmin && req.nextUrl.pathname === "/quests") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    
    // ルートページへのアクセスをリダイレクト
    if (req.nextUrl.pathname === "/") {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/quests", req.url));
      }
    }
    
    return null;
  },
  {
    callbacks: {
      async authorized({ token, req }) {
        // 認証はミドルウェア内で処理するため、ここでは常にtrueを返す
        return true;
      },
    },
  }
);

// すべてのルートに対してミドルウェアを適用
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
