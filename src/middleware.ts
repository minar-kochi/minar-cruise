// middleware.ts
import { cookies, headers } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export const config: MiddlewareConfig = {
  //set up generic matcher for to allow bots and seo to set headers accordingly.
  matcher: ["/admin/:path*", "/admin"],
};
import { auth as Authmiddleware } from "@/auth/auth";

export const middleware = Authmiddleware((req, ctx) => {
  if (req.method === "OPTIONS") {
    // setCORSHeaders(response);
    return NextResponse.next();
  }
  const { nextUrl } = req;
  // console.log(nextUrl);
  const isLoggedIn = !!req.auth;
  // console.log(req.auth);
  // console.log(isLoggedIn);
  if (!isLoggedIn) {
    return NextResponse.redirect(
      new URL(
        `${nextUrl.origin}/auth/login?origin=${nextUrl.pathname}`,
        nextUrl,
      ),
    );
  }
  return NextResponse.next();
});

export interface UserPreferences {
  theme: string;
  /** @deprecated use locale params / hook field instead */
  locale: string;
}
