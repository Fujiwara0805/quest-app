import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["none"],
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // 特定のメールアドレス（管理者）の場合は常にサインインを許可
      if (user.email === "quest202412@gmail.com") {
        // データベースにユーザーが存在するか確認
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        // ユーザーが存在しない場合は作成
        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email,
              name: user.name || "Admin",
              role: "admin",
            },
          });
        } 
        // ユーザーが存在するが、Googleアカウントとリンクされていない場合
        else if (!existingUser.emailVerified) {
          // emailVerifiedフィールドを更新して、アカウントを検証済みにする
          await db.user.update({
            where: { email: user.email },
            data: {
              emailVerified: new Date(),
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
            },
          });
          
          // Googleアカウントとリンク
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account?.type || "oauth",
              provider: account?.provider || "google",
              providerAccountId: account?.providerAccountId || profile?.sub || "",
              access_token: account?.access_token || "",
              token_type: account?.token_type || "",
              scope: account?.scope || "",
              id_token: account?.id_token || "",
            },
          });
        }
        
        return true;
      }
      
      // その他のユーザーは通常の処理
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        
        // ユーザーのロール情報を取得
        const dbUser = await db.user.findUnique({
          where: { email: user.email || "" },
          select: { role: true }
        });
        
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        
        // ロール情報をセッションに追加
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 管理者ユーザー（quest202412@gmail.com）の場合はクエスト作成画面に直接リダイレクト
      // セッション情報からメールアドレスを取得できないため、URLパターンで判断
      
      // コールバックURLの場合（ログイン直後）
      if (url.includes('/api/auth/callback/google') || url.includes('/api/auth/callback')) {
        try {
          // セッショントークンからユーザー情報を取得できないため、
          // URLのクエリパラメータからメールアドレスを取得する方法は使えない
          
          // 代わりに、最近ログインしたユーザーを確認
          const recentSession = await db.session.findFirst({
            orderBy: { expires: 'desc' },
            include: { user: true },
          });
          
          if (recentSession?.user?.email === "quest202412@gmail.com") {
            return `${baseUrl}/admin/quests/create`;
          }
          
          // または直接データベースからユーザーを確認
          const adminUser = await db.user.findUnique({
            where: { email: "quest202412@gmail.com" },
            include: { sessions: { orderBy: { expires: 'desc' }, take: 1 } },
          });
          
          // 最近のセッションがあれば管理者ページにリダイレクト
          if (adminUser && adminUser.sessions.length > 0) {
            const latestSession = adminUser.sessions[0];
            const now = new Date();
            if (latestSession.expires > now) {
              return `${baseUrl}/admin/quests/create`;
            }
          }
        } catch (error) {
          console.error("リダイレクト処理中にエラーが発生しました:", error);
        }
      }
      
      // callbackUrlが明示的に指定されている場合はそれを優先
      if (url.includes('callbackUrl=')) {
        const callbackUrl = new URL(url).searchParams.get('callbackUrl');
        if (callbackUrl && callbackUrl.includes('/admin/quests/create')) {
          return callbackUrl;
        }
      }
      
      // 管理者ダッシュボードへのリダイレクトが指定されている場合
      if (url.includes('/admin/quests/create')) {
        return `${baseUrl}/admin/quests/create`;
      }
      
      // デフォルトのリダイレクト処理
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("http")) return baseUrl;
      return `${baseUrl}/quests`;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
