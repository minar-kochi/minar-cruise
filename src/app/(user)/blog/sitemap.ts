import { db } from "@/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let data: {
    blogSlug: string;
  }[] = [];
  try {
    data = await db.blog.findMany({
      select: {
        blogSlug: true,
      },
    });
  } catch (error) {}
  if (!data.length) {
    return [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/blog`,
        changeFrequency: "monthly",
      },
    ];
  }
  return [
    {
      url: `${process.env.NEXT_PUBLIC_DOMAIN}/blog`,
      changeFrequency: "monthly",
    },
    ...data.map((item) => {
      return {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/blog/${item.blogSlug}`,
      };
    }),
  ];
}
