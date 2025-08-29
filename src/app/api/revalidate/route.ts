import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateRequestSchema } from "@/lib/validators/revalidateRequestValidator";
import { headers } from "next/headers";

// e.g a webhook to `your-website.com/api/revalidate?tag=collection&secret=<token>`
// http://localhost:3000/api/revalidate

//add header "Authorization" and the secret password.
/**
 *
 * @example {"type" : "path", path: { nextPath: "page", webPath: "/projects"}}
 * @example {"type" : "tag", tag: ["project_id", "data"]} //This is Cache Key that is set on Unstable_cache / nextFetch CacheKey
 * Authorization Headers as "Authorization": "Env revalidate secret"
 */

export async function POST(request: NextRequest) {
  try {
    // const header = request.headers;
    const authentication = headers().get("Authorization");
    if (!authentication || authentication.length < 4) {
      return NextResponse.json(
        { message: "Please Authenticate and try again" },
        { status: 401 },
      );
    }

    let isVerified = authentication === process.env.REVALIDATION_SECRET;
    if (!isVerified) {
      return NextResponse.json(
        { message: "Invalid Revalidation Key" },
        { status: 401 },
      );
    }

    let body = await request.json();
    const data = revalidateRequestSchema.parse(body);

    if (data.type == "path") {
      const { nextPath, webPath } = data.path;
      revalidatePath(webPath, nextPath);
    }

    if (data.type == "tag") {
      data.tags.map((item) => revalidateTag(item));
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ revalidated: false, message: error });
  }
}
