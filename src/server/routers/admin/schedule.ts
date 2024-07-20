import { db } from "@/db";
import { ScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import { AdminProcedure, router } from "@/server/trpc";

export const schedule = router({
  getSchedule: AdminProcedure
    .input(ScheduleSchema.optional())
    .query(async ({ input }) => {
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
    }),
});
