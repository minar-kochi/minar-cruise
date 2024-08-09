import { INFINITE_QUERY_LIMIT } from "@/constants/config";
import { defaultEmptyTrigger } from "@/constants/data/timer";
import { db } from "@/db";
import { getPackageByIdWithStatusAndCount } from "@/db/data/dto/package";
import {
  isDateValid,
  isProd,
  isValidMergeTimeCycle,
  mergeTimeCycle,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
  sleep,
} from "@/lib/utils";
import {
  CompleteScheduleUpdateSchema,
  ScheduleCreateSchema,
  ScheduleSchema,
  UpdatedDateScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { isStatusCustom } from "@/lib/validators/Schedules";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { booking } from "./booking";
import { z } from "zod";
import { ShouldStatusBeAvaiablePublicWithPackage } from "@/lib/validators/Package";

export const schedule = router({
  /**
   * @description
   * String that should be passed in Should be in YYYY-MM-DD
   *
   * if not passed in any then it will get the Current Date and fetch it.
   *
   *  */
  booking,
  getSchedulesByDateOrNow: AdminProcedure.input(ScheduleSchema).query(
    async ({ input: { ScheduleDate } }) => {
      // string that will receive is in the format YYYY-MM-DD
      //________________Validate Input Starts _____________
      const date = parseDateFormatYYYMMDDToNumber(ScheduleDate);
      if (!date) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Date Format is not valid YYYY-MM-DD",
        });
      }

      const validatedDate = isDateValid(date);

      if (!validatedDate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Requested date is invalid",
        });
      }
      //________________Validate Input ends _____________
      try {
        /** @TODO Fix the positioning of date */
        const schedule = await db.schedule.findMany({
          where: {
            day: new Date(ScheduleDate),
          },
        });

        if (schedule.length < 0) {
          return null;
        }
        return schedule;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  ),
  getSchedulesInfinity: AdminProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    await sleep(2000);
    const { cursor } = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;

    const data = await db.schedule.findMany({
      select: {
        day: true,
        fromTime: true,
        id: true,
        packageId: true,
        schedulePackage: true,
        scheduleStatus: true,
        toTime: true,
        Package: {
          select: {
            title: true,
          },
        },
      },
      where: {
        day: {
          gte: new Date(Date.now()),
        },
      },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      orderBy: {
        day: "asc",
      },
    });
    let nextCursor: typeof cursor | undefined = undefined;
    if (data.length > limit) {
      const nextItem = data.pop();
      nextCursor = nextItem?.id;
    }
    return {
      response: data,
      nextCursor,
    };
  }),
  // getUpcommingScheduleDates: AdminProcedure.input().query()
  createNewSchedule: AdminProcedure.input(
    ScheduleCreateSchema.required({
      packageId: true,
    }),
  ).mutation(
    async ({
      ctx,
      input: { packageId, ScheduleDate, ScheduleTime, ScheduleDateTime },
    }) => {
      /**
       * Check to do before creating a schedule.
       *  - There shouldn't be multiple schedule placed at the same Schedule time [multiple breakfast cruise].
       *  - Schedule should be new.
       *  - Schedule's can be Block be too, PackageId should be null and status should send a Blocked one.
       *  -
       */

      //________________Validate Input Starts _____________
      /** */
      try {
        const date = parseDateFormatYYYMMDDToNumber(ScheduleDate);

        if (!date) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Date Format is not valid YYYY-MM-DD",
          });
        }

        const validatedDate = isDateValid(date);

        if (!validatedDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Requested date is invalid",
          });
        }

        const isPackageFound =
          await getPackageByIdWithStatusAndCount(packageId);
        if (!isPackageFound) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Selected Package is not found on our database.",
          });
        }

        //________________Validate Input ends _____________
        // Testout the date that is recieved (UTC format.)
        let SafelyParsedDate = new Date(ScheduleDate);
        let fromTimeObj =
          mergeTimeCycle(ScheduleDateTime?.fromTime ?? defaultEmptyTrigger) ??
          null;

        let toTimeObjParsed =
          mergeTimeCycle(ScheduleDateTime?.toTime ?? defaultEmptyTrigger) ??
          null;
        let toTime = isValidMergeTimeCycle(toTimeObjParsed ?? "");
        let fromTime = isValidMergeTimeCycle(fromTimeObj ?? "");
        if (isStatusCustom(ScheduleTime) && (!toTime || !fromTime)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Time is Required for ${ScheduleTime} Packages.`,
          });
        }
        const Schedule = await db.schedule.findFirst({
          where: {
            AND: [
              {
                schedulePackage: ScheduleTime,
              },
              {
                day: SafelyParsedDate,
              },
            ],
          },
        });
        if (Schedule?.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Schedule has been already set for this date.",
          });
        }
        let scheduleStatus = ShouldStatusBeAvaiablePublicWithPackage({
          packageCategory: isPackageFound.packageCategory,
          scheduleTime: ScheduleTime,
        });

        const createdSchedule = await db.schedule.create({
          data: {
            day: SafelyParsedDate,
            packageId,
            fromTime: fromTime ? fromTimeObj : null,
            toTime: toTime ? toTimeObjParsed : null,
            schedulePackage: ScheduleTime,
            scheduleStatus: scheduleStatus,
          },
        });

        return createdSchedule;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Something went wrong, Please try again. and report to developer.",
        });
      }
    },
  ),
  /** @TODO incomplete */
  updateSchedule: AdminProcedure.input(CompleteScheduleUpdateSchema).mutation(
    async ({
      ctx,
      input: {
        date: ScheduleDate,
        schedule: { fromTime, packageId, scheduleTime, toTime },
      },
    }) => {
      try {
        /**
         * Do something!
         */
        const date = parseDateFormatYYYMMDDToNumber(ScheduleDate);

        if (!date) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Date Format is not valid YYYY-MM-DD",
          });
        }

        const validatedDate = isDateValid(date);

        if (!validatedDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Requested date is invalid",
          });
        }

        const isPackageFound =
          await getPackageByIdWithStatusAndCount(packageId);
        if (!isPackageFound) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Selected Package is not found on our database.",
          });
        }
        // if(isexcl)
        //________________Validate Input ends _____________
        // Testout the date that is recieved (UTC format.)
        let SafelyParsedDate = new Date(ScheduleDate);
        const Schedule = await db.schedule.findFirst({
          where: {
            AND: [
              {
                schedulePackage: scheduleTime,
              },
              {
                day: SafelyParsedDate,
              },
            ],
          },
        });
        return { message: "updated Sucessfully" };
      } catch (error) {
        console.log(error);
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    },
  ),
  clearSchedule: AdminProcedure.mutation(async () => {
    try {
      if (isProd) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You are on production cannot cascade all the schedules.",
        });
      }
      const clearSchedule = await db.schedule.deleteMany({});
      return true;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOmehting went wrong",
      });
    }
  }),
});
