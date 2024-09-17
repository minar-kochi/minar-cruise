import { db } from "@/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: MetadataRoute.Sitemap = [];
  try {
    const slugs = await db.package.findMany({
      select: {
        slug: true,
        createdAt: true,
      },
    });
    data = slugs.map((item) => {
      return {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/package/${item.slug}`,
        changeFrequency: "monthly",
        lastModified: item.createdAt,
        priority: 1,
      };
    });

  } catch (error) {}

  return [
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
      changeFrequency: "monthly",
      lastModified: new Date(Date.now()),
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/about`,
      changeFrequency: "monthly",
      lastModified: new Date(Date.now()),
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/blog`,
      changeFrequency: "monthly",
      lastModified: new Date(Date.now()),
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/contact`,
      changeFrequency: "yearly",
      lastModified: new Date(Date.now()),
      priority: 0.5,
    },
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/facilities`,
      changeFrequency: "monthly",
      lastModified: new Date(Date.now()),
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery`,
      changeFrequency: "monthly",
      lastModified: new Date(Date.now()),
      priority: 0.8,
    },
    ...data,
  ];
}
