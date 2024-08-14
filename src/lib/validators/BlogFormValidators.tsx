import { z } from "zod";

export const BlogFormValidators = z.object({
  author: z.string().min(1),
  title: z.string().min(1),
  shortDes: z.string().min(1).max(64),
  blogSlug: z.string().min(1),
  banner: z.string().optional(),
  content: z.string().min(1),
  blogStatus: z.enum(["DRAFT", "PUBLISHED"]),
  // image: z.any().optional(),
});

export type TBlogFormValidators = z.infer<typeof BlogFormValidators>;
