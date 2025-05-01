import { BLOG_INFINITE_QUERY_LIMIT } from "@/constants/config";
import { db } from "@/db";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { TBlogsInfinityQueryPropsValidation } from "@/lib/validators/blogs";

export type TGetPublishedBlogsCount = Awaited<
  ReturnType<typeof getPublishedBlogsCount>
>;
export async function getPublishedBlogsCount() {
  const totalBlogs = await db.blog.count({
    where: { blogStatus: "PUBLISHED" },
  });
  return totalBlogs;
}

export type TGetBlogDetailsFromSlug = Awaited<
  ReturnType<typeof getBlogDetailsFromSlug>
>;
export async function getBlogDetailsFromSlug({
  blogSlug,
}: {
  blogSlug: string;
}) {
  const data = await db.blog.findUnique({
    where: {
      blogSlug: blogSlug,
    },
    select: {
      author: true,
      title: true,
      content: true,
      image: {
        select: {
          url: true,
          alt: true,
        },
      },
    },
  });
  return data;
}
export type TGetBlogsListDTO = Awaited<ReturnType<typeof getBlogsListDTO>>;
export async function getBlogsListDTO({
  cursor,
  limit,
}: TBlogsInfinityQueryPropsValidation) {
  try {
    const data = await db.blog.findMany({
      take: limit ? limit + 1 : BLOG_INFINITE_QUERY_LIMIT,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        image: {
          select: {
            url: true,
            alt: true,
          },
        },
        id: true,
        author: true,
        title: true,
        shortDes: true,
        blogStatus: true,
        createdAt: true,
        blogSlug: true,
      },
    });

    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

export type TGetBlogWithPagination = Awaited<
  ReturnType<typeof getBlogWithPagination>
>;
interface IGetBlogWithPagination {
  pageNumber: number;
  pageSize: number;
}
export async function getBlogWithPagination({
  pageNumber,
  pageSize,
}: IGetBlogWithPagination) {
  const [totalBlogsCount, blogs] = await Promise.all([
    db.blog.count({
      where: { blogStatus: "PUBLISHED" },
    }),
    db.blog.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
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
        createdAt: true,
      },
    }),
  ]);

  return {
    blogs,
    meta: {
      totalItems: totalBlogsCount,
      totalPages: Math.ceil(totalBlogsCount / pageSize),
      currentPage: pageNumber,
    },
  };
}
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
      return null;
    }
    return data;
  } catch (error) {
    ErrorLogger(error);
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
      return null;
    }
    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

export type TGetRecentPosts = Awaited<ReturnType<typeof getRecentPosts>>;
export async function getRecentPosts() {
  try {
    const data = await db.blog.findMany({
      where: {
        blogStatus: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        image: true,
        blogSlug: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}
