import { db } from "@/db";
import { getPackageAllImage } from "@/db/data/dto/package";
import { AddPackageImageSchema } from "@/lib/validators/adminAddPackageImageValidator";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
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
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  setPackageImage: AdminProcedure.input(
    z.object({
      data: AddPackageImageSchema,
    }),
  ).mutation(async ({ input: { data } }) => {
    try {
      const packageSlug = await db.package.findFirst({
        where: {
          id: data.packageId,
        },
        select: {
          slug: true,
          packageImage: {
            where: {
              imageId: data.imageId,
            },
          },
        },
      });
      if (!packageSlug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Couldn't find the package.",
        });
      }
      // console.log(packageSlug)
      if (packageSlug?.packageImage.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This Image has Already been used for this package",
        });
      }
      const upserted = await db.packageImage.create({
        data,
      });
      revalidatePath(`/package/[slug]`);
      revalidatePath(`/`);
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
      revalidatePath("/package");
      revalidatePath(`/`);
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
