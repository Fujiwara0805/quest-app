import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isLoggedIn = !!token;
    const isLoginPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    if (isLoginPage) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/quests", req.url));
      }
      return null;
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
    "/settings/:path*"
  ],
};
