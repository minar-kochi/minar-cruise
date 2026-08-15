import { PrismaClient } from "@prisma/client";
import { keywords as KEYWORDS } from "@/constants/seo/home";

/**
 * Seeds the admin-editable site settings with the values that used to be
 * hardcoded in constructMetadata / src/constants, plus one visibility row per
 * toggleable section (all visible, matching current behaviour).
 *
 * Idempotent and non-destructive: only creates what is missing, never updates,
 * so re-running cannot stomp an admin's edits.
 */
const db = new PrismaClient();

/**
 * Duplicated from `src/lib/helpers/config/getSectionVisibility.ts`, which is
 * the real source of truth. It cannot be imported here: that module is
 * `import "server-only"`, which throws outside a Next.js server context, and
 * this runs as a plain `tsx` script. Keep the two lists in step by hand.
 */
const SITE_SECTIONS = [
  { key: "nav.facilities", label: "Navigation — Facilities" },
  { key: "nav.gallery", label: "Navigation — Gallery menu" },
  { key: "nav.blogs", label: "Navigation — Blogs" },
  { key: "nav.contact", label: "Navigation — Contact" },
  { key: "nav.packages", label: "Navigation — Packages menu" },
  { key: "page.about", label: "Page — About" },
  { key: "page.facilities", label: "Page — Facilities" },
  { key: "page.gallery", label: "Page — Gallery" },
  { key: "page.blogs", label: "Page — Blogs" },
];

async function seedSiteConfig() {
  await db.$connect();

  const existing = await db.siteConfig.findUnique({
    where: { id: "singleton" },
    select: { id: true },
  });

  if (existing) {
    console.log("SiteConfig already present — leaving it alone.");
  } else {
    await db.siteConfig.create({
      data: {
        id: "singleton",
        siteName: "Minar Cruise",
        metaTitle:
          "Minar Cruise Cochin | Luxury Arabian Sea Cruises & Dining Experiences",
        metaDescription:
          "Experience luxury cruises on the Arabian Sea with Minar Cruise Cochin. Enjoy gourmet dining, stunning views, and entertainment. Book breakfast, lunch, sunset, and dinner cruises for unforgettable Kerala adventures.",
        keywords: KEYWORDS,
        ogImage: "/thumbnail.jpg",
        bookingNumbers: [
          "+91 80890 21666",
          "+91 80890 61444",
          "+91 80890 41666",
          "+91 80890 51444",
        ],
        contactEmail: "info@cochincruiseline.com",
      },
    });
    console.log("SiteConfig singleton created.");
  }

  const present = new Set(
    (await db.siteSectionVisibility.findMany({ select: { key: true } })).map(
      (r) => r.key,
    ),
  );
  const missing = SITE_SECTIONS.filter((s) => !present.has(s.key));

  if (!missing.length) {
    console.log("All SiteSectionVisibility rows already present.");
  } else {
    await db.siteSectionVisibility.createMany({
      data: missing.map((s) => ({ ...s, isVisible: true })),
    });
    console.log(
      `SiteSectionVisibility rows created: ${missing.map((s) => s.key).join(", ")}`,
    );
  }

  await db.$disconnect();
  process.exit(0);
}

seedSiteConfig().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
