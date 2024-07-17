import { db } from "@/db";
import { getScheduleByDayOrStatus } from "@/db/data/dto/schedule";
import {
  ScheduleCreateSchema,
  ScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { AdminProcedure, procedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const schedule = router({
  getSchedule: AdminProcedure.input(ScheduleSchema.optional()).query(
    async ({ input }) => {
      /**
       * ctx -> admin check is available from the Admin middlware.
       *
       * */
      try {
        /** @TODO Fix the positioning of date */
        const schedule = await db.schedule.findMany({
          where: {
            day: new Date(input?.ScheduleDate ?? Date.now()),
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
