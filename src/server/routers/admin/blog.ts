import { INFINITE_QUERY_LIMIT } from "@/constants/config";
import { db } from "@/db";
import {
  BlogFormUpdateValidator,
  BlogFormValidators,
} from "@/lib/validators/BlogFormValidators";
import { AdminProcedure, publicProcedure, router } from "@/server/trpc";
import { faker } from "@faker-js/faker";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
  fetchAllBlogsInfinityQuery: AdminProcedure
    // .input(
    //   z.object({ cursor: z.string().nullish(), limit: z.number().nullish() }),
    // )
    .query(async ({ input }) => {
      // const { cursor, limit } = input;

      const data = await db.blog.findMany({
        // cursor: cursor ? { id: cursor } : undefined,
        // take: limit ? limit + 1 : INFINITE_QUERY_LIMIT,
      });

      return data;
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
      
      return updateResponse
    },
  ),
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
