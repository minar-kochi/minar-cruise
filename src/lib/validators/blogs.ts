import { z } from "zod";

export type TBlogsInfinityQueryPropsValidation = z.infer<
  typeof blogsInfinityQueryPropsValidation
>;
export const blogsInfinityQueryPropsValidation = z.object({
  cursor: z.string().nullish(),
  limit: z.number().nullish(),
});
