import { db } from "@/db";
import { getPackageAllImage } from "@/db/data/dto/package";
import { AddPackageImageSchema } from "@/lib/validators/adminAddPackageImageValidator";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const packages = router({
  getPackageImage: AdminProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).query(async ({ input: { id } }) => {
    try {
      return await getPackageAllImage(id);
    } catch (error) {
      return null;
    }
  }),
  setPackageImage: AdminProcedure.input(
    z.object({
      data: AddPackageImageSchema,
    }),
  ).mutation(async ({ input: { data } }) => {
    try {
      const isImageFound = await db.packageImage.count({
        where: {
          imageId: data.imageId,
          packageId: data.packageId,
        },
      });
      if (isImageFound) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This Image has Already been used for this package",
        });
      }
      const upserted = await db.packageImage.create({
        data,
      });
      return { success: true };
    } catch (error) {
      return null;
    }
  }),
  removeImage: AdminProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ input: { id } }) => {
    try {
      const isImageFound = await db.packageImage.findFirst({
        where: {
          id,
        },
      });
      if (!isImageFound) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This Image is not found to be deleted",
        });
      }
      await db.packageImage.delete({
        where: {
          id,
        },
      });
      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
});
