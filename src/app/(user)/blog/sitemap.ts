import { BLOG_PAGINATION_QUERY_LIMIT } from "@/constants/config";
import { db } from "@/db";
import { getPublishedBlogsCount } from "@/db/data/dto/blog";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogs: {
    blogSlug: string;
  }[] = [];

  let totalPages = 1;

  try {
    blogs = await db.blog.findMany({
      select: {
        blogSlug: true,
      },
      where: {
        blogStatus: "PUBLISHED",
      },
    });
    totalPages = Math.ceil(blogs.length / BLOG_PAGINATION_QUERY_LIMIT);
  } catch (error) {}

  if (!blogs.length) {
    return [
      {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/blogs/1`,
        changeFrequency: "monthly",
      },
    ];
  }

  // Paginated blog pages
  const paginatedBlogUrl: MetadataRoute.Sitemap = Array.from({
    length: totalPages,
  }).map((_, index) => ({
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${index + 1}`,
  }));

  // Individual blog pages
  const blogPages = blogs.map((item) => ({
    url: `${process.env.NEXT_PUBLIC_DOMAIN}/blog/${item.blogSlug}`,
  }));

  return [...blogPages, ...paginatedBlogUrl];
}
