import { z } from "zod";
import { Prisma } from "@prisma/client";
import * as trpc from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const sentenceRouter = createTRPCRouter({
  getSentences: protectedProcedure.query(() => {
    return {
      sentences: [
        {
          text: "fasd adsf asdf asdfa sdfasdf asdfkjdasf ",
          translation: " asdfa sdfasdf asdfkjdas",
        },
        {
          text: "2",
          translation: "22",
        },
        {
          text: "3",
          translation: "33",
        },
        {
          text: "4",
          translation: "44",
        },
        {
          text: "5",
          translation: "55",
        },
      ],
    };
  }),
});
