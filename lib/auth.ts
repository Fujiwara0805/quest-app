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
      console.log("リダイレクト関数実行: ", { url, baseUrl });
      
      try {
        // URLをデコードして実際の値を確認
        const decodedUrl = decodeURIComponent(url);
        console.log("デコードされたURL: ", decodedUrl);
        
        // テストアカウントのリダイレクト処理
        if (url.includes('/api/auth/callback/credentials') || url.includes('/api/auth/signin/credentials')) {
          console.log("クレデンシャルログイン後のリダイレクト");
          return `${baseUrl}/quests`;
        }
        
        // Googleログインのコールバック時
        if (url.includes('/api/auth/callback/google')) {
          console.log("Google認証後のリダイレクト");
          
          // callbackUrlパラメータを直接解析してみる
          const urlObj = new URL(url);
          const callbackParam = urlObj.searchParams.get('callbackUrl');
          if (callbackParam) {
            console.log("コールバックURLのパラメータが存在: ", callbackParam);
            if (callbackParam.includes('/admin/dashboard')) {
              return `${baseUrl}/admin/dashboard`;
            }
            return callbackParam.startsWith('/') ? `${baseUrl}${callbackParam}` : callbackParam;
          }
          
          // デフォルトでクエスト一覧にリダイレクト
          return `${baseUrl}/quests`;
        }
        
        // callbackUrlパラメータが指定されている場合はそれを使用
        if (url.includes('callbackUrl=')) {
          // URLSearchParamsを使った解析
          const params = new URLSearchParams(url.split('?')[1]);
          const callbackUrl = params.get('callbackUrl');
          console.log("URLSearchParamsで取得したcallbackUrl: ", callbackUrl);
          
          if (callbackUrl) {
            // callbackUrlをデコードする
            const decodedCallback = decodeURIComponent(callbackUrl);
            console.log("デコードされたcallbackUrl: ", decodedCallback);
            
            // 管理者ダッシュボードの場合
            if (decodedCallback.includes('/admin/dashboard')) {
              return `${baseUrl}/admin/dashboard`;
            }
            
            // クエスト一覧の場合
            if (decodedCallback.includes('/quests')) {
              return `${baseUrl}/quests`;
            }
            
            // 相対パスの場合はbaseUrlを追加
            return decodedCallback.startsWith('/') ? `${baseUrl}${decodedCallback}` : decodedCallback;
          }
        }
        
        // URLに特定のパスが含まれる場合
        if (url.includes('/admin/dashboard')) {
          return `${baseUrl}/admin/dashboard`;
        }
        
        // そのURLがそのまま使えるか確認
        if (url.startsWith(baseUrl)) {
          console.log("baseUrlで始まるURLをそのまま使用");
          return url;
        }
        
        // 絶対URLの場合の処理
        if (url.startsWith("http")) {
          // トークンなどの情報が含まれている可能性があるので、
          // 最低限必要なパスだけを抽出してリダイレクト
          try {
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            console.log("抽出されたパス: ", path);
            
            if (path.includes('/quests')) {
              return `${baseUrl}/quests`;
            }
            if (path.includes('/admin/dashboard')) {
              return `${baseUrl}/admin/dashboard`;
            }
          } catch (e) {
            console.error("URL解析エラー:", e);
          }
          
          // パスの解析に失敗した場合はベースURLに戻す
          return baseUrl;
        }
        
        // デフォルトのリダイレクト先
        console.log("デフォルトのリダイレクト先を使用: /quests");
        return `${baseUrl}/quests`;
      } catch (error) {
        console.error("リダイレクト処理中にエラーが発生しました:", error);
        // エラー時は安全にクエスト一覧に遷移
        return `${baseUrl}/quests`;
      }
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === "development",
};
