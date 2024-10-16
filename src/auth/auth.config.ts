import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const { ADMIN_EMAIL, ADMIN_DASHBOARD_PASSWORD } = process.env;
export default {
  trustHost: true,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "token",
        },
      },
      type: "credentials",

      async authorize(credentials, request) {
        if (ADMIN_EMAIL !== credentials.email) {
          return null;
        }
        if (ADMIN_DASHBOARD_PASSWORD !== credentials.password) {
          return null;
        }
        return {
          id: "admin-user",
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
