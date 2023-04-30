import { createTRPCRouter } from "~/server/api/trpc";
import { wordRouter } from "./routers/word";
import { sentenceRouter } from "./routers/sentence";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  word: wordRouter,
  sentence: sentenceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
