import { db } from "@/db";
import { getScheduleByDayOrStatus } from "@/db/data/dto/schedule";
import {
  ScheduleCreateSchema,
  ScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
  createNewSchedule: AdminProcedure.input(ScheduleCreateSchema).mutation(
    async ({ ctx, input: { packageId, ScheduleDate, ScheduleTime } }) => {
      try {
        const isScheduled = await getScheduleByDayOrStatus({
          packageId,
          ScheduleDate,
          ScheduleTime,
        });
        if (isScheduled?.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Schedule already In-Place, Please use Update Method",
          });
        }
        return true;
      } catch (error) {
        return false;
      }
    }
  ),
});
