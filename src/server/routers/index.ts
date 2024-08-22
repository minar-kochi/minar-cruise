import { router } from "../trpc";
import { admin } from "./admin/admin";
import { user } from "./user/user";

export const appRouter = router({
  admin,
  user  
});

// export type definition of API
export type AppRouter = typeof appRouter;
