import { db } from "@/db";
import { dayKeyToDateColumn, istToday } from "@/lib/datetime";
import { deriveScheduleInstants } from "@/lib/helpers/scheduleInstants";
import { getBookingConfigUncached } from "@/lib/helpers/config/getBookingConfig";
import { getPackageAllImage } from "@/db/data/dto/package";
import { AddPackageImageSchema } from "@/lib/validators/adminAddPackageImageValidator";
import {
  PackageDetailsValidator,
  PackageSettingsValidator,
  UpdateAmenityItemsValidator,
} from "@/lib/validators/PackageContentValidator";
import { revalidateAllPackageImageUse } from "@/revalidator/package";
import { revalidatePackageContent } from "@/revalidator/site";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PackageSettingsProcedure = AdminProcedure.input(
  PackageSettingsValidator,
).mutation(async ({ input }) => {
  const { id, ...settings } = input;
  try {
    await db.package.update({ where: { id }, data: settings });
    await revalidatePackageContent();
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update package settings",
    });
  }
});

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

  /** Everything the admin editor needs for one package, in one round trip. */
  getPackageContent: AdminProcedure.input(z.object({ id: z.string() })).query(
    async ({ input: { id } }) => {
      const data = await db.package.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          packageType: true,
          adultPrice: true,
          childPrice: true,
          duration: true,
          startMinutesIst: true,
          slug: true,
          isVisible: true,
          minLeadTimeHours: true,
          minNewBookingCount: true,
          isBookableOnline: true,
          amenitiesId: true,
          amenities: {
            select: {
              id: true,
              items: {
                orderBy: { order: "asc" },
                select: { id: true, label: true, isVisible: true, order: true },
              },
            },
          },
        },
      });
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Package not found",
        });
      }
      // The Settings tab shows "Use default (N)" inline, so it needs the numbers
      // this package would inherit as well as its own overrides.
      const defaults = await getBookingConfigUncached();
      return { ...data, defaults };
    },
  ),

  updatePackageSettings: PackageSettingsProcedure,

  updatePackageDetails: AdminProcedure.input(PackageDetailsValidator).mutation(
    async ({ input }) => {
      const { id, adultPrice, childPrice, startMinutesIst, ...rest } = input;
      try {
        await db.$transaction(async (tx) => {
          await tx.package.update({
            where: { id },
            // Written out field by field rather than spread. TypeScript does
            // NOT apply excess-property checking to spread properties, so
            // `data: { ...rest }` silently carried `fromTime`/`toTime` here
            // long after those columns were dropped — Prisma rejected it at
            // runtime with `Unknown argument 'fromTime'` and the type-checker
            // never saw it. An explicit literal is checked.
            data: {
              title: rest.title,
              description: rest.description,
              packageType: rest.packageType,
              duration: rest.duration,
              startMinutesIst,
              // The form works in rupees; the column is paise.
              adultPrice: Math.round(adultPrice * 100),
              childPrice: Math.round(childPrice * 100),
            },
          });

          // Schedules that inherit this package's times used to follow an edit
          // automatically, because the departure was recomputed from the
          // package at every read. Now that `startsAt` is stored, an edit would
          // silently leave them on the old time — so propagate explicitly.
          //
          // FUTURE schedules only: a sailing that has already departed keeps
          // the time it actually departed at. Overridden schedules are left
          // alone by definition — the admin set those times deliberately.
          const affected = await tx.schedule.findMany({
            where: {
              packageId: id,
              isTimeOverridden: false,
              day: { gte: dayKeyToDateColumn(istToday()) },
            },
            select: { id: true, day: true },
          });

          for (const s of affected) {
            const instants = deriveScheduleInstants({
              day: s.day,
              packageStartMinutesIst: startMinutesIst,
              packageDurationMinutes: rest.duration,
            });
            await tx.schedule.update({
              where: { id: s.id },
              data: {
                startsAt: instants.startsAt,
                endsAt: instants.endsAt,
              },
            });
          }
        });

        await revalidatePackageContent();
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update package details",
        });
      }
    },
  ),

  /**
   * Replaces a package's amenity list wholesale. The submitted array order is
   * the display order.
   *
   * Rows absent from the payload are deleted, which is what makes "remove" work
   * — but it also means a stale client could wipe items added elsewhere since
   * it loaded. Acceptable here: this is a single-admin dashboard and the editor
   * refetches after every save.
   */
  updateAmenityItems: AdminProcedure.input(
    UpdateAmenityItemsValidator,
  ).mutation(async ({ input: { packageId, items } }) => {
    try {
      const pkg = await db.package.findUnique({
        where: { id: packageId },
        select: { amenitiesId: true },
      });
      if (!pkg) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Package not found",
        });
      }

      const keptIds = items
        .map((item) => item.id)
        .filter((id): id is string => Boolean(id));

      await db.$transaction(async (tx) => {
        await tx.amenityItem.deleteMany({
          where: {
            amenitiesId: pkg.amenitiesId,
            ...(keptIds.length ? { id: { notIn: keptIds } } : {}),
          },
        });

        // Indexed loop rather than .entries(): this tsconfig targets below
        // ES2015, so iterating an ArrayIterator needs downlevelIteration.
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          if (item.id) {
            // `updateMany` scoped to this package's amenities, not `update` by
            // id alone: `item.id` is client-supplied and validated only as a
            // cuid, so an id belonging to another package's list would
            // otherwise be rewritten here. Matches the `deleteMany` above. A
            // stale id now matches nothing instead of hitting the wrong row.
            await tx.amenityItem.updateMany({
              where: { id: item.id, amenitiesId: pkg.amenitiesId },
              data: {
                label: item.label,
                isVisible: item.isVisible,
                order: index,
              },
            });
          } else {
            await tx.amenityItem.create({
              data: {
                amenitiesId: pkg.amenitiesId,
                label: item.label,
                isVisible: item.isVisible,
                order: index,
              },
            });
          }
        }
      });

      await revalidatePackageContent();
      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update amenities",
      });
    }
  }),
});
