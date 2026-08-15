import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/db";

export const SECTION_VISIBILITY_CACHE_TAG = "section-visibility";

/**
 * Every toggleable public surface, and the copy the admin list shows for it.
 *
 * The keys are the contract between this file and the components/pages that
 * check them — add a key here and the admin page picks it up automatically, but
 * something still has to read it at the render site.
 */
export const SITE_SECTIONS = [
  { key: "nav.facilities", label: "Navigation — Facilities" },
  { key: "nav.gallery", label: "Navigation — Gallery menu" },
  { key: "nav.blogs", label: "Navigation — Blogs" },
  { key: "nav.contact", label: "Navigation — Contact" },
  { key: "nav.packages", label: "Navigation — Packages menu" },
  { key: "page.about", label: "Page — About" },
  { key: "page.facilities", label: "Page — Facilities" },
  { key: "page.gallery", label: "Page — Gallery" },
  { key: "page.blogs", label: "Page — Blogs" },
] as const;

export type SiteSectionKey = (typeof SITE_SECTIONS)[number]["key"];

export type SectionVisibility = Record<SiteSectionKey, boolean>;

/** Everything visible — the behaviour before any of this was toggleable. */
function allVisible(): SectionVisibility {
  return Object.fromEntries(
    SITE_SECTIONS.map((s) => [s.key, true]),
  ) as SectionVisibility;
}

export const getSectionVisibility = unstable_cache(
  async (): Promise<SectionVisibility> => {
    const rows = await db.siteSectionVisibility.findMany({
      select: { key: true, isVisible: true },
    });

    // Start from all-visible so a key that has no row yet (newly added to
    // SITE_SECTIONS) shows rather than silently disappearing from the site.
    const resolved = allVisible();
    for (const row of rows) {
      if (row.key in resolved) {
        resolved[row.key as SiteSectionKey] = row.isVisible;
      }
    }
    return resolved;
  },
  ["section-visibility"],
  { tags: [SECTION_VISIBILITY_CACHE_TAG] },
);
