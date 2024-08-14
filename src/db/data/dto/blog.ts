import { db } from "@/db";

export type TGetBlogPosts = Awaited<ReturnType<typeof getBlogPosts>>;
export async function getBlogPosts() {
  try {
    const data = await db.blog.findMany();

    if (!data) {
      console.log("Failed to load blog posts");
    }
    return data;
  } catch (e) {
    return null;
  }
}

export type TGetBlogPostBySlug = Awaited<ReturnType<typeof getBlogPostBySlug>>;
export async function getBlogPostBySlug({ slug }: { slug: string }) {
  try {
    const data = await db.blog.findMany({
      where: {
        blogSlug: slug,
      },
      select: {
        blogSlug: true,
        author: true,
        content: true,
        image: true,
        title: true,
      },
    });

    if (!data) {
      console.log("Failed to load blog post");
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}
