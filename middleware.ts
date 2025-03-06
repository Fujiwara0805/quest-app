import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isLoggedIn = !!token;
    const isLoginPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isAdminEmail = token?.email === "quest202412@gmail.com";

    // ログイン後のリダイレクト処理
    if (isLoggedIn) {
      // 管理者メールアドレスの場合、ログインページにいる場合は管理者ページにリダイレクト
      if (isAdminEmail && isLoginPage) {
        return NextResponse.redirect(new URL("/admin/quests/create", req.url));
      }
      
      // 一般ユーザーがログインページにいる場合はクエスト一覧にリダイレクト
      if (isLoginPage && !isAdminEmail) {
        return NextResponse.redirect(new URL("/quests", req.url));
      }
    }
    
    // 管理者ルートへのアクセスをチェック
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // 未認証の場合はログインページにリダイレクト
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      
      // 管理者でない場合はホームページにリダイレクト
      if (token.role !== 'admin' && !isAdminEmail) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // クエスト一覧ページにアクセスした管理者を管理者ページにリダイレクト
    if (isAdminEmail && req.nextUrl.pathname === "/quests") {
      return NextResponse.redirect(new URL("/admin/quests/create", req.url));
    }
    
    return null;
  },
  {
    callbacks: {
      async authorized({ token, req }) {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/login/:path*", 
    "/register/:path*", 
    "/quests/:path*",
    "/quests",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*"
  ],
};
