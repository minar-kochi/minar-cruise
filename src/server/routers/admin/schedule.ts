import { db } from "@/db";
import { isDateValid, parseDateFormatYYYMMDDToNumber } from "@/lib/utils";
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
      /**
       * ctx -> admin check is available from the Admin middlware.
       *
       * */

      // Check input scheduleDate here see if it is actual date.

      // string that will receive is in the format YYYY-MM-DD
      // Check if the Format is actual format.
      try {
        console.log(ScheduleDate);
        /** @TODO Fix the positioning of date */
        const schedule = await db.schedule.findMany({
          where: {
            day: new Date(ScheduleDate ?? Date.now()),
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
    }
  ),
  // getUpcommingScheduleDates: AdminProcedure.input().query()
  createNewSchedule: AdminProcedure.input(ScheduleCreateSchema).mutation(
    async ({ ctx, input: { packageId, ScheduleDate, ScheduleTime } }) => {
      /**
       * Check to do before creating a schedule.
       *  - There shouldn't be multiple schedule placed at the same Schedule time [multiple breakfast cruise].
       *  - Schedule should be new.
       *  - Schedule's can be Block be too, PackageId should be null and status should send a Blocked one.
       *  -
       */

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

      const isPackageFound = await db.package.count({
        where: {
          id: packageId,
        },
      });
      if (!isPackageFound) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Selected Package is not found on our database.",
        });
      }
      //________________Validate Input ends _____________
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
          schedulePackage: "BREAKFAST",
          scheduleStatus: "AVAILABLE",
        },
      });

      return createdSchedule;
    }
  ),
});
