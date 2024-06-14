import { z } from "zod";

const pathSchema = z.object({
  nextPath: z.enum(["page", "layout"]),
  webPath: z.string(),
});

// Define the schema for the "tag" type
const tagSchema = z.object({
  tags: z.array(z.string()),
});

// Define the overall schema with a discriminator
export const revalidateRequestSchema = z
  .object({
    type: z.enum(["path", "tag"]),
  })
  .and(
    z.union([
      z.object({
        type: z.literal("path"),
        path: pathSchema,
      }),
      z.object({
        type: z.literal("tag"),
        tags: tagSchema.shape.tags,
      }),
    ])
  );

export type RevalidateRequestData = z.infer<typeof revalidateRequestSchema>;
