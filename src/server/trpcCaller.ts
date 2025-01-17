import { appRouter } from "./routers";
import { t } from "./trpc";

export const createCallerFactory = t.createCallerFactory;

export const createCaller = createCallerFactory(appRouter);
export const caller = createCaller({});
