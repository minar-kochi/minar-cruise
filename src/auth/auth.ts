import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "@/db";

//import { edge } from "@/lib/utils";
export const runtime = "nodejs";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, user, credentials, email, profile }) {
      try {
        if (account?.provider === "google") {
          return "/auth/error?error=accessDenied";
          return true;
        }
        return true;
      } catch (error) {
        return `/auth/error?error=UnknownError`;
      }
    },
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },

    async jwt({ token, session, trigger, user, account, profile }) {
      if (user) {
        if ("password" in user) {
          const { password, ...userWithoutPass } = user;
          token.user = userWithoutPass;
        } else {
          token.user = user;
        }
      }
      return token;
    },
    async session({ session, user, token, newSession, trigger }) {
      console.log(newSession);
      session.user = token.user as any;
      return session;
    },
  },
  basePath: "/api/auth",
  ...authConfig,
});
