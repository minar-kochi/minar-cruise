import {
  BLOG_INFINITE_QUERY_LIMIT,
  INFINITE_QUERY_LIMIT,
} from "@/constants/config";
import { db } from "@/db";
import { getBlogsListDTO, getBlogWithPagination } from "@/db/data/dto/blog";
import {
  BlogFormUpdateValidator,
  BlogFormValidators,
} from "@/lib/validators/BlogFormValidators";
import { blogsInfinityQueryPropsValidation } from "@/lib/validators/blogs";
import { revalidateBlogs } from "@/revalidator/blog";
import { revalidateAllPackageImageUse } from "@/revalidator/package";
import { AdminProcedure, publicProcedure, router } from "@/server/trpc";
import { faker } from "@faker-js/faker";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { log } from "node:console";
import { z } from "zod";

export const blog = router({
  seedBlogs: AdminProcedure.input(
    z.object({
      count: z.number().nullish(),
    }),
  ).mutation(async ({ input: { count } }) => {
    const ImagesWithID = await db.image.findMany({
      take: 10,
      select: { id: true },
    });

    type TBlogDetails = {
      blogSlug: string;
      author: string;
      blogStatus: $Enums.BlogStatus;
      content: string;
      shortDes: string;
      title: string;
      imageId: string;
    };
    const ImageIds = ImagesWithID.map((item) => item.id);

    const blogs: TBlogDetails[] = Array.from({ length: count ?? 10 }).map(
      () => {
        return {
          author: faker.person.fullName(),
          blogStatus: (() => {
            const randomNumber = Math.floor(Math.random() * 2);
            const status =
              randomNumber === 0
                ? ("PUBLISHED" as $Enums.BlogStatus)
                : ("DRAFT" as $Enums.BlogStatus);
            return status;
          })(),
          content: faker.lorem.paragraphs(10),
          imageId: (() => {
            const randomNumber = Math.floor(Math.random() * 10);
            return ImageIds[randomNumber];
          })(),
          shortDes: faker.lorem.sentence(7),
          title: faker.lorem.words(5),
          blogSlug: faker.lorem.slug(2),
        };
      },
    );

    try {
      const data = await db.blog.createMany({ data: blogs });
      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to Seed blogs.",
        });
      }
      return data;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to seed blogs.",
      });
    }
  }),
  fetchBlogsInfinityQuery: AdminProcedure.input(
    blogsInfinityQueryPropsValidation,
  ).query(async ({ input: { cursor, limit } }) => {
    // const { cursor, limit } = input;
    const data = await getBlogsListDTO({ cursor, limit });

    if (!data) {
      throw new TRPCError({
        code: "BAD_GATEWAY",
        message: "Failed to retrieve data",
      });
    }

    const BlogLimit = limit ?? BLOG_INFINITE_QUERY_LIMIT;
    let nextCursor: typeof cursor | undefined = undefined;

    if (data.length > BlogLimit) {
      const nextItem = data.pop();
      nextCursor = nextItem?.id;
    }
    return {
      blogs: data,
      nextCursor,
    };
  }),
  fetchPaginatedBlogs: AdminProcedure.input(
    z.object({
      pageNumber: z.number(),
      pageSize: z.number(),
    }),
  ).query(async ({ input: { pageNumber, pageSize } }) => {
    try {
      const data = await getBlogWithPagination({ pageNumber, pageSize });
      return data;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "BAD_GATEWAY",
        message: "Failed to retrieve data",
      });
    }
  }),
  addBlog: AdminProcedure.input(BlogFormValidators).mutation(
    async ({ ctx, input }) => {
      const {
        blogSlug,
        blogStatus,
        content,
        shortDes,
        title,
        author,
        imageId,
      } = input;

      try {
        const isImageExists = await db.image.count({
          where: {
            id: imageId,
          },
        });
        if (!isImageExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Didn't find the images in Gallery",
          });
        }
        //write your logic here.
        const data = await db.blog.create({
          data: {
            blogSlug,
            author,
            blogStatus,
            content,
            shortDes,
            title,
            imageId,
          },
        });
        if (!data) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to create blog entry.",
          });
        }

        await revalidateBlogs({});
        return data;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create blog entry.",
        });
      }
    },
  ),

  checkSlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    const slugExists = await db.blog.findUnique({
      where: { blogSlug: input },
    });

    return slugExists ? true : false;
  }),

  updateBlog: AdminProcedure.input(BlogFormUpdateValidator).mutation(
    async ({
      input: {
        author,
        blogSlug,
        blogStatus,
        content,
        id,
        imageId,
        shortDes,
        title,
      },
    }) => {
      const response = await db.blog.count({ where: { id } });
      if (!response) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to find requested blog for update",
        });
      }

      const updateResponse = await db.blog.update({
        where: {
          id: id,
        },
        data: {
          author,
          blogSlug,
          blogStatus,
          content,
          imageId,
          shortDes,
          title,
        },
      });

      await revalidateBlogs({ id, blogSlug });
      return updateResponse;
    },
  ),

  deleteBlog: AdminProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ input: { id } }) => {
    try {
      const data = await db.blog.delete({
        where: {
          id,
        },
      });

      await revalidateBlogs({});

      return data.id;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Failed to seed blogs.",
      });
    }
  }),
  getImagesInfinity: AdminProcedure.input(
    z.object({
      limit: z.number().nullish(),
      cursor: z.string().nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    const { cursor } = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;

    const data = await db.image.findMany({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (data.length > limit) {
      const nextItem = data.pop();
      nextCursor = nextItem?.id;
    }
    return {
      response: data,
      nextCursor,
    };
  }),
});
