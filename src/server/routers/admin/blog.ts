import { INFINITE_QUERY_LIMIT } from "@/constants/config";
import { db } from "@/db";
import { sleep } from "@/lib/utils";
import { BlogFormValidators } from "@/lib/validators/BlogFormValidators";
import { AdminProcedure, publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const blog = router({
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
