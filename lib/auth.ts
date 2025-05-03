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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production"
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // 特定のメールアドレス（管理者）の場合は常にサインインを許可
      if (user.email === "quest202412@gmail.com") {
        try {
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
          // ユーザーが存在するが、ロールが設定されていない場合は管理者に設定
          else if (!existingUser.role || existingUser.role !== "admin") {
            await db.user.update({
              where: { email: user.email },
              data: { role: "admin" },
            });
          }
          // Googleアカウントとリンクされていない場合
          if (account?.provider === "google" && !existingUser?.emailVerified) {
            // emailVerifiedフィールドを更新して、アカウントを検証済みにする
            await db.user.update({
              where: { email: user.email },
              data: {
                emailVerified: new Date(),
                name: user.name || existingUser?.name,
                image: user.image || existingUser?.image,
              },
            });
            
            // 既にAccountが存在するか確認
            const existingAccount = await db.account.findFirst({
              where: {
                provider: "google",
                userId: existingUser?.id,
              }
            });
            
            // Accountが存在しない場合のみ作成
            if (!existingAccount) {
              await db.account.create({
                data: {
                  userId: existingUser?.id || "",
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
          }
        } catch (error) {
          console.error("サインイン処理でエラーが発生しました:", error);
        }
        
        return true;
      }
      
      // その他のユーザーは通常の処理
      return true;
    },
    async jwt({ token, user, account }) {
      try {
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
            } else {
              token.role = "user"; // デフォルトロール
            }
          }
        }
      } catch (error) {
        console.error("JWT処理中にエラーが発生しました:", error);
      }
      
      return token;
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
          
          // ロール情報をセッションに追加
          session.user.role = token.role as string || "user";
        }
      } catch (error) {
        console.error("セッション処理中にエラーが発生しました:", error);
      }
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      // リダイレクト処理をシンプルに保ち、本番環境でも正しく動作するようにする
      
      // 認証コールバック（サインイン後）の場合は常にクエスト一覧に遷移
      if (url.includes('/api/auth/callback/') || url.includes('/api/auth/signin/')) {
        // 管理者の場合はダッシュボードへ
        if (url.includes('/admin/dashboard')) {
          return `${baseUrl}/admin/dashboard`;
        }
        // それ以外は全てクエスト一覧へ
        return `${baseUrl}/quests`;
      }
      
      // URLにクエスト一覧へのリダイレクトが含まれている場合
      if (url.includes('/quests')) {
        return `${baseUrl}/quests`;
      }
      
      // 管理者ダッシュボードの場合
      if (url.includes('/admin/dashboard')) {
        return `${baseUrl}/admin/dashboard`;
      }
      
      // callbackUrlパラメータが含まれている場合
      if (url.includes('callbackUrl=')) {
        try {
          const params = new URLSearchParams(url.split('?')[1]);
          const callbackUrl = params.get('callbackUrl');
          
          if (callbackUrl) {
            const decodedCallback = decodeURIComponent(callbackUrl);
            // 安全なリダイレクト先かチェック
            if (decodedCallback.startsWith('/')) {
              return `${baseUrl}${decodedCallback}`;
            }
          }
        } catch (error) {
          console.error("コールバックURL解析エラー:", error);
          // エラー時はデフォルトへ
          return `${baseUrl}/quests`;
        }
      }
      
      // デフォルトのリダイレクト先（常にクエスト一覧へ）
      return `${baseUrl}/quests`;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === "development",
};
