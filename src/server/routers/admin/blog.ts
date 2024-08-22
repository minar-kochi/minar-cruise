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
      const { blogSlug, blogStatus, content, shortDes, title, author, banner, imageId } =
        input;

      //write your logic here.
      const data = await db.blog.create({
        data: {
          blogSlug,
          author,
          blogStatus,
          content,
          shortDes,
          title,
          banner,
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
    },
  ),

  getImagesInfinity: AdminProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
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
