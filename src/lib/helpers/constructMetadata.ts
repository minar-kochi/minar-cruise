import { Metadata } from "next";
import { keywords } from "@/constants/seo/home";
import { TemplateString } from "next/dist/lib/metadata/types/metadata-types";
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
export function constructMetadata({
  MetaHeadtitle,
  title = "Minar Cruise Cochin | Luxury Arabian Sea Cruises & Dining Experiences",
  description = "Experience luxury cruises on the Arabian Sea with Minar Cruise Cochin. Enjoy gourmet dining, stunning views, and entertainment. Book breakfast, lunch, sunset, and dinner cruises for unforgettable Kerala adventures.",
  Ogimage = "/thumbnail.jpg",
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
} & Partial<Metadata>): Metadata {
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
