import { db } from "@/db";
import { BlogFormValidators } from "@/lib/validators/BlogFormValidators";
import { AdminProcedure, publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const blog = router({
  addBlog: AdminProcedure.input(BlogFormValidators).mutation(
    async ({ ctx, input }) => {
      const { blogSlug, blogStatus, content, shortDes, title, author, banner } =
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
});
