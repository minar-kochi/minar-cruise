// middleware.ts
import { cookies, headers } from "next/headers";
import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

export const config: MiddlewareConfig = {
  //set up generic matcher for to allow bots and seo to set headers accordingly.
  matcher: ["/admin/:path*", "/admin"],
};

//Change this to headers from 'next/headers'
// const setCORSHeaders = (response: NextResponse) => {
//   response.headers.set("Access-Control-Allow-Origin", "*"); // Adjust this as per your requirements
//   response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   response.headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization",
//   );
//   response.headers.set("Access-Control-Allow-Credentials", "true");
// };

export const middleware = async (req: NextRequest) => {
  if (req.method === "OPTIONS") {
    // setCORSHeaders(response);
    return NextResponse.next();
  }
  // Do admin Authentication using next-middleware.

  return NextResponse.next();
};

// types.ts
export interface UserPreferences {
  theme: string;
  /** @deprecated use locale params / hook field instead */
  locale: string;
}
