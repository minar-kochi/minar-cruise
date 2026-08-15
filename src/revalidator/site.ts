import { db } from "@/db";
import { ORGANIZED_PACKAGE_KEY } from "@/constants/CacheKeys/package";
import { BLOG_PAGINATION_QUERY_LIMIT } from "@/constants/config";
import { Galleries } from "@/Types/type";
import { BOOKING_CONFIG_CACHE_TAG } from "@/lib/helpers/config/getBookingConfig";
import { SITE_CONFIG_CACHE_TAG } from "@/lib/helpers/config/getSiteConfig";
import { SECTION_VISIBILITY_CACHE_TAG } from "@/lib/helpers/config/getSectionVisibility";
import { getPublishedBlogsCount } from "@/db/data/dto/blog";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand revalidation for the admin-editable configuration.
 *
 * There is no `export const revalidate` anywhere in this app — public pages are
 * prerendered once and never expire on a timer. So anything an admin edits has
 * to bust its cache here explicitly, or the change simply never reaches
 * visitors.
 *
 * Two separate caches matter, and busting one does NOT bust the other:
 *
 *  - the *data* cache behind `unstable_cache` (cleared by `revalidateTag`), and
 *  - the *route* cache holding the prerendered HTML/RSC payload for an SSG page
 *    (cleared only by `revalidatePath` for that specific route).
 *
 * A tag bust alone leaves a prerendered page serving its old HTML forever, so
 * every helper below pairs the tag with the routes that embed its value.
 */

/** Static public routes that carry site-wide metadata or the shared nav. */
const STATIC_PUBLIC_PATHS = [
  "/",
  "/about",
  "/facilities",
  "/contact",
  "/privacy-policy",
  "/terms-conditions",
  "/refund_returns",
];

/** Every public surface that renders package content. */
async function revalidateAllPackageSurfaces() {
  const packageSlugs = await db.package.findMany({ select: { slug: true } });
  for (const item of packageSlugs) {
    revalidatePath(`/package/${item.slug}`);
  }
  revalidatePath("/search");
  revalidatePath("/", "layout");
  revalidatePath("/", "page");
}

/**
 * Every prerendered public route. Used when a change is site-wide — the nav and
 * the default SEO copy appear on all of them, so revalidating only "/" would
 * leave every other page showing the old value.
 */
async function revalidateEveryPublicPage() {
  for (const path of STATIC_PUBLIC_PATHS) {
    revalidatePath(path);
  }

  for (const slug of Galleries) {
    revalidatePath(`/gallery/${slug}`);
  }

  const totalBlogs = await getPublishedBlogsCount();
  const lastPage = Math.max(
    1,
    Math.ceil(totalBlogs / BLOG_PAGINATION_QUERY_LIMIT),
  );
  for (let page = 1; page <= lastPage; page++) {
    revalidatePath(`/blogs/${page}`);
  }

  // Individual posts, not just the paginated index. These are prerendered by
  // their own `generateStaticParams` and sit inside the (user) layout, so each
  // one holds a baked copy of the nav and the site metadata — revalidating only
  // /blogs/{page} leaves every post serving the old nav indefinitely.
  const posts = await db.blog.findMany({
    where: { blogStatus: "PUBLISHED" },
    select: { blogSlug: true },
  });
  for (const { blogSlug } of posts) {
    revalidatePath(`/blog/${blogSlug}`);
  }

  await revalidateAllPackageSurfaces();
  revalidatePath("/", "layout");
}

/**
 * Cutoffs, capacity and party-size minimums. These reach the browser as props
 * baked into the package pages, so busting the tag alone is not enough — the
 * pages that carry them have to be regenerated too.
 */
export async function revalidateBookingConfig() {
  revalidateTag(BOOKING_CONFIG_CACHE_TAG);
  revalidateTag(ORGANIZED_PACKAGE_KEY[0]);
  await revalidateAllPackageSurfaces();
}

/** Package content, prices, amenities or visibility changed. */
export async function revalidatePackageContent() {
  revalidateTag(ORGANIZED_PACKAGE_KEY[0]);
  await revalidateAllPackageSurfaces();
}

/**
 * Schedule status changed (blocked / available / exclusive). The calendar reads
 * schedules client-side via tRPC, but the home page and package pages embed
 * availability, so they need regenerating too.
 */
export async function revalidateSchedules() {
  revalidateTag(ORGANIZED_PACKAGE_KEY[0]);
  await revalidateAllPackageSurfaces();
}

/**
 * Site name, default SEO copy and contact numbers.
 *
 * Every page's `generateMetadata` reads this, so every prerendered page holds a
 * copy of the title and description — all of them have to be rebuilt.
 */
export async function revalidateSiteConfig() {
  revalidateTag(SITE_CONFIG_CACHE_TAG);
  await revalidateEveryPublicPage();
}

/**
 * Nav entries and whole pages being shown or hidden.
 *
 * The nav is rendered by the shared layout, so it is baked into every
 * prerendered page — and a hidden page only starts returning 404 once its own
 * route is rebuilt. Both need the full sweep.
 */
export async function revalidateSectionVisibility() {
  revalidateTag(SECTION_VISIBILITY_CACHE_TAG);
  await revalidateEveryPublicPage();
}
