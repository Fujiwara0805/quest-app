import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";

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
    // テスト用のCredentials Provider
    CredentialsProvider({
      name: "テストアカウント",
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials) {
        // テスト用アカウントの検証
        if (
          credentials?.email === "test@gmail.com" && 
          credentials?.password === "2025"
        ) {
          // テスト用ユーザー情報を返す
          return {
            id: "test-user-id",
            name: "テストユーザー",
            email: "test@gmail.com",
            role: "user"
          };
        }
        
        // 認証失敗
        return null;
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
        
        // Credentialsプロバイダーでログインした場合、userオブジェクトから直接ロールを設定
        if ('role' in user) {
          token.role = (user as any).role;
        } 
        // それ以外の場合はデータベースからロール情報を取得
        else {
          const dbUser = await db.user.findUnique({
            where: { email: user.email || "" },
            select: { role: true }
          });
          
          if (dbUser) {
            token.role = dbUser.role;
          }
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
      // コールバックURLの場合（ログイン直後）
      if (url.includes('/api/auth/callback/google') || url.includes('/api/auth/callback')) {
        try {
          // 最近ログインしたユーザーを確認
          const recentSession = await db.session.findFirst({
            orderBy: { expires: 'desc' },
            include: { user: true },
          });
          
          if (recentSession?.user?.email === "quest202412@gmail.com" || recentSession?.user?.role === "admin") {
            return `${baseUrl}/admin/dashboard`;
          }
        } catch (error) {
          console.error("リダイレクト処理中にエラーが発生しました:", error);
        }
      }
      
      // callbackUrlが明示的に指定されている場合はそれを優先
      if (url.includes('callbackUrl=')) {
        const callbackUrl = new URL(url).searchParams.get('callbackUrl');
        if (callbackUrl) {
          // 管理者のためのダッシュボードチェック
          if (callbackUrl.includes('/admin/dashboard')) {
            return callbackUrl;
          }
          return callbackUrl.startsWith('/') ? `${baseUrl}${callbackUrl}` : callbackUrl;
        }
      }
      
      // 管理者ダッシュボードへのリダイレクトが指定されている場合
      if (url.includes('/admin/dashboard')) {
        return `${baseUrl}/admin/dashboard`;
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
