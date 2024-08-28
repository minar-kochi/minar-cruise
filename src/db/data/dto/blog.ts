import { db } from "@/db";
import { Prisma } from "@prisma/client";

export type TGetBlogPosts = Awaited<ReturnType<typeof getBlogPosts>>;
export async function getBlogPosts() {
  try {
    const data = await db.blog.findMany({
      where: {
        blogStatus: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        shortDes: true,
        image: true,
        imageId: true,
        author: true,
        blogSlug: true,
      },
    });

    if (!data) {
      console.log("Failed to load blog posts");
    }
    return data;
  } catch (e) {
    return null;
  }
}

export type TGetBlogPostBySlug = Awaited<ReturnType<typeof getBlogPostById>>;
export async function getBlogPostById({ id }: { id: string }) {
  try {
    const data = await db.blog.findUnique({
      where: {
        blogSlug: id,
        blogStatus: "PUBLISHED",
      },
      select: {
        id: true,
        blogSlug: true,
        author: true,
        content: true,
        image: true,
        imageId: true,
        title: true,
      },
    });

    if (!data) {
      console.log("Failed to load blog post");
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

export type TGetRecentPosts = Awaited<ReturnType<typeof getRecentPosts>>;
export async function getRecentPosts() {
  try {
    const data = await db.blog.findMany({
      select: {
        id: true,
        title: true,
        image: true,
        blogSlug: true,
        // createdAt: true
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    if (!data) {
      console.log("Failed to load recent post");
      return null;
    }
    return data;
  } catch (error) {
    // Handle the error appropriately
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Known errors, such as constraints violations or invalid queries
      console.error("Prisma error:", error.message);
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      // Unknown request errors
      console.error("Unknown request error:", error.message);
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      // Errors during client initialization
      console.error("Client initialization error:", error.message);
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      // Rust panic errors
      console.error("Rust panic error:", error.message);
    } else {
      // Other errors
      console.error("Unexpected error:", error);
    }
  }
}
