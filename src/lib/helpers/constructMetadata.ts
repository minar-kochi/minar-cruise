import { Metadata } from "next";
import { TemplateString } from "next/dist/lib/metadata/types/metadata-types";
import { getSiteConfig } from "./config/getSiteConfig";
/**
 * |- app
 * |  \- page.tsx localhost/
 * |-- hello
 * |   |--[slug] - {params: {slug: "anything"}} ->
 *     |   \- page.tsx /localhost/hello/anything
 * |   \- page.tsx localhost/hello
 *
 */

// "Minar Cruise", Cochin cruise, Arabian Sea, luxury dining, sunset cruise, Kerala tourism, gourmet experience, sea adventure
/**
 * Async because the site name, default title/description, keywords and OG image
 * are admin-editable (`SiteConfig`) rather than compile-time literals. Callers
 * must therefore use `export async function generateMetadata()` — a static
 * `export const metadata` cannot await.
 *
 * Anything passed explicitly still wins; the config only supplies the defaults,
 * and `getSiteConfig` itself falls back to the original hardcoded values.
 */
export async function constructMetadata({
  MetaHeadtitle,
  title,
  description,
  Ogimage,
  keywords,
  icons = "/logo-small.png",
  noIndex = false,
  publishedTime,
  ...rest
}: {
  title?: string;
  MetaHeadtitle?: string | TemplateString | null;
  description?: string;
  Ogimage?: string;
  icons?: string;
  noIndex?: boolean;
  publishedTime?: Date;
} & Partial<Metadata>): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  title = title ?? siteConfig.metaTitle;
  description = description ?? siteConfig.metaDescription;
  Ogimage = Ogimage ?? siteConfig.ogImage;
  keywords = keywords ?? siteConfig.keywords;

  return {
    title: MetaHeadtitle ? MetaHeadtitle : title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          alt: title,
          url: Ogimage,
        },
      ],
      publishedTime: publishedTime ? publishedTime.toString() : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [Ogimage],
      creator: "muadpn434",
      creatorId: "@muadpn434",
    },

    icons,
    creator: "muadpn | muadpn.globexhost.com",
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_DOMAIN}`),
    ...(noIndex && {
      robots: {
        index: true,
        follow: true,
      },
    }),
    ...rest,
  };
}
