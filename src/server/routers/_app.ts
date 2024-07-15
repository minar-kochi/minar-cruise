import { z } from "zod";
import { procedure, router } from "../trpc";

import { ContactValidators } from "@/lib/validators/ContactFormValidator";
import { ScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import { db } from "@/db";
// import { newsLetter } from "@/Schema/user";
export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      console.log("hello");
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  getSchedule: procedure
    .input(ScheduleSchema.optional())
    .query(async ({ input }) => {
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
        return schedule.map((item) => {
          return {
            ...item,
            day: new Date(item.day),
          };
        });
      } catch (error) {
        console.log(error);
        return null;
      }
    }),
  subscribeNewsletter: procedure
    .input(
      z.object({
        data: ContactValidators,
        type: z.enum(["normal", "whatsapp"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, type } = input;
      if (data.isNewsLetter === "false") return;
      //implement saving to mongoose database
      try {
      } catch (error) {
        console.log(error);
      }
      return input;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
