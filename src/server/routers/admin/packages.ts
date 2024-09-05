import { db } from "@/db";
import { AdminProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const packages = router({
  getPackageImage: AdminProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).query(async ({ input: { id } }) => {
    try {
      return await db.package.findUnique({
        where: {
          id,
        },
        select: {
          packageImage: {
            include: {
              image: true,
            },
          },
        },
      });
    } catch (error) {
      return null;
    }
  }),
});
