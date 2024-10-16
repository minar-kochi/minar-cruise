import { z } from "zod";

export const AddPackageImageSchema = z.object({
  imageId: z.string(),
  packageId: z.string(),
  ImageUse: z
    .enum(["PROD_FEATURED", "PROD_THUMBNAIL", "COMMON"])
    .default("COMMON"),
});
