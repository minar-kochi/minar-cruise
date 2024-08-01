import { db } from "@/db";
import { getPackageByIdWithStatusAndCount } from "@/db/data/dto/package";
import {
  isDateValid,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import {
  ScheduleCreateSchema,
  ScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const schedule = router({
  /**
   * @description
   * String that should be passed in Should be in YYYY-MM-DD
   *
   * if not passed in any then it will get the Current Date and fetch it.
   *
   *  */
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

      const isPackageFound = await getPackageByIdWithStatusAndCount(packageId);
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

      const createdSchedule = await db.schedule.create({
        data: {
          day: SafelyParsedDate,
          packageId,
          schedulePackage: ScheduleTime,
          scheduleStatus: "AVAILABLE",
        },
      });

      return createdSchedule;
    },
  ),
});
