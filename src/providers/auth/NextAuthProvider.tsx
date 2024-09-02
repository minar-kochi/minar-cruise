"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface INextAuthProvider {
  children: React.ReactNode;
  session: Session | null;
}
const NextAuthProvider = ({ children, session }: INextAuthProvider) => {
  return (
    <SessionProvider
      refetchInterval={864000}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      session={session}
    >
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
