import { z } from "zod";
import { procedure, router } from "../trpc";

import { ContactValidators } from "@/lib/validators/ContactFormValidator";
// import { newsLetter } from "@/Schema/user";
import dbConnect from "@/Db/db";
import newsLetter  from "@/Db/models/NewsLetters";
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
  get: procedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .mutation(({ input }) => {
      console.log(input);
      return true;
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
        await dbConnect();
        const newsLetters = await newsLetter.create({ ...data });
        console.log(newsLetters);
      } catch (error) {
        console.log(error);
      }
      return input;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
