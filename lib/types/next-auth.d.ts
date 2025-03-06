import NextAuth, { DefaultSession, User } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
    interface JWT {
        id: UserId;
        role: string;
    }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: UserId;
      role: string;
    } & DefaultSession["user"];
  }
}
