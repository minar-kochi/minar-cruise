import { db } from "@/db";
import { z } from "zod";

export const BlogFormValidators = z.object({
  author: z
    .string()
    .min(3, { message: "Author name must be at least 3 characters long" })
    .max(30, { message: "Author name must be at most 30 characters long" }),
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(50, { message: "Title must be at most 50 characters long" }),
  shortDes: z
    .string()
    .min(8, { message: "Description must be at least 8 characters long" })
    .max(150, { message: "Description must be at most 150 characters long" }),
  blogSlug: z
    .string()
    .min(4, { message: "Slug must be at least 4 characters long" })
    .max(40, { message: "Slug must be at most 40 characters long" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  content: z.string().min(10, { message: "Content cannot be empty" }),
  blogStatus: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  imageId: z.string().min(1, { message: "Image ID cannot be empty" }),
});

export type TBlogFormValidators = z.infer<typeof BlogFormValidators>;
export type TBlogFormUpdateValidator = z.infer<typeof BlogFormUpdateValidator>;

export const BlogFormUpdateValidator = z
  .object({
    id: z.string().nonempty(),
  })
  .merge(BlogFormValidators);
