import { db } from "@/db";
import { getPackageAllImage } from "@/db/data/dto/package";
import { AddPackageImageSchema } from "@/lib/validators/adminAddPackageImageValidator";
import { revalidateAllPackageImageUse } from "@/revalidator/package";
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

      await db.packageImage.create({
        data,
      });
      if (
        data.ImageUse === "PROD_FEATURED" ||
        data.ImageUse === "PROD_THUMBNAIL"
      ) {
        await revalidateAllPackageImageUse();
      } else {
        revalidatePath(`/package/${packageSlug.slug}`);
      }

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
        select: {
          id: true,
          ImageUse: true,
          packageId: true,
          package: {
            select: {
              slug: true,
            },
          },
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

      if (
        isImageFound.ImageUse === "PROD_FEATURED" ||
        isImageFound.ImageUse === "PROD_THUMBNAIL"
      ) {
        // add func to revalidate all the package and home page.
        await revalidateAllPackageImageUse();
      } else {
        revalidatePath(`/package/${isImageFound.package.slug}`);
      }

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
