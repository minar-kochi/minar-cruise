import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { keywords as FALLBACK_KEYWORDS } from "@/constants/seo/home";
import { bookingNumber, contactInfo } from "@/constants/contact/contact";

export const SITE_CONFIG_CACHE_TAG = "site-config";
export const SITE_CONFIG_SINGLETON_ID = "singleton";

export type SiteConfig = {
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  bookingNumbers: string[];
  contactEmail: string | null;
};

/**
 * The literals that used to be hardcoded in `constructMetadata` and
 * `src/constants`. Same role `gst.ts` plays for the tax config: if the row is
 * missing the site renders exactly as it did before this became editable.
 */
export const FALLBACK_SITE_CONFIG: SiteConfig = {
  siteName: "Minar Cruise",
  metaTitle:
    "Minar Cruise Cochin | Luxury Arabian Sea Cruises & Dining Experiences",
  metaDescription:
    "Experience luxury cruises on the Arabian Sea with Minar Cruise Cochin. Enjoy gourmet dining, stunning views, and entertainment. Book breakfast, lunch, sunset, and dinner cruises for unforgettable Kerala adventures.",
  keywords: FALLBACK_KEYWORDS,
  ogImage: "/thumbnail.jpg",
  bookingNumbers: bookingNumber,
  contactEmail: contactInfo.email,
};

async function readSiteConfig(): Promise<SiteConfig> {
  const row = await db.siteConfig.findUnique({
    where: { id: SITE_CONFIG_SINGLETON_ID },
    select: {
      siteName: true,
      metaTitle: true,
      metaDescription: true,
      keywords: true,
      ogImage: true,
      bookingNumbers: true,
      contactEmail: true,
    },
  });
  return row ?? FALLBACK_SITE_CONFIG;
}

/** Cached read for public rendering. Busted by `revalidateSiteConfig()`. */
export const getSiteConfig = unstable_cache(readSiteConfig, ["site-config"], {
  tags: [SITE_CONFIG_CACHE_TAG],
});

/**
 * Uncached read for the admin editor.
 *
 * The form loads these values and saves them straight back, so reading through
 * the cache risks writing a stale value over a newer one — for instance after
 * the row is changed out of band (a manual SQL fix, a restore). An admin
 * editing settings should always be looking at the real row.
 */
export const getSiteConfigUncached = readSiteConfig;
