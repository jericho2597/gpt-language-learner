import { z } from "zod";
import { Prisma } from "@prisma/client";
import * as trpc from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateSentences } from "~/server/gpt/generateSentences";

export const sentenceRouter = createTRPCRouter({
  getSentences: protectedProcedure.query(async ({ ctx }) => {
    // get sentences from DB where review is before current time.

    // if none make async call to start generating new sentences
    // return that new sentences being generated and come back later

    const currentDate = new Date(); // Get the current date and time

    const sentences = await ctx.prisma.sentence.findMany({
      where: {
        review: {
          lte: currentDate, // Filter records with review datetime less than or equal to the current date and time
        },
      },
      take: 10, // Limit the number of records returned to up to 10
    });

    if (sentences.length == 0) {
      void generateSentences(ctx.prisma);

      return {
        sentences: [],
        generatingMore: true,
      };
    }

    return {
      sentences,
      generatingMore: false,
    };
  }),

  // FEEDBACK
  // EASY: 1
  // OKAY: 2
  // HARD: 3
  // NOTHING: 4
  giveFeedback: protectedProcedure
    .input(
      z.object({
        sentenceId: z.string(),
        feedback: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const sentence = await ctx.prisma.sentence.findUnique({
        where: {
          id: input.sentenceId,
        },
      });
      const word = await ctx.prisma.word.findUnique({
        where: {
          id: sentence?.wordId,
        },
      });

      const wordScore = word?.score;
      const sentenceScore = sentence?.score;

      let wordReviewIncrement = 1;
      let sentenceReviewIncrement = 1;
      let newWordScore = wordScore;
      let newSentenceScore = sentenceScore;

      if (input.feedback == 1) {
        wordReviewIncrement = Math.pow(2, wordScore);
        sentenceReviewIncrement = Math.pow(2, sentenceScore);
      } else if (input.feedback == 2) {
        wordReviewIncrement = Math.pow(2, wordScore) / 2;
        sentenceReviewIncrement = Math.pow(2, sentenceScore) / 2;
      } else if (input.feedback == 3) {
        wordReviewIncrement = Math.pow(2, wordScore) / 3;
        sentenceReviewIncrement = Math.pow(2, sentenceScore) / 3;
      } else if (input.feedback == 4) {
        wordReviewIncrement = 1;
      }

      if (input.feedback != 4) {
        newWordScore += 1;
        newSentenceScore += 1;
      } else {
        newWordScore = 1;
        newSentenceScore = 1;
      }

      const currentDate = new Date();
      const newWordDate = new Date(currentDate);
      newWordDate.setDate(newWordDate.getDate() + wordReviewIncrement);

      await ctx.prisma.word.update({
        where: {
          id: sentence.wordId,
        },
        data: {
          score: newWordScore,
          review: newWordDate,
        },
      });

      const newSentenceDate = new Date(currentDate);
      newSentenceDate.setDate(
        newSentenceDate.getDate() + sentenceReviewIncrement
      );

      await ctx.prisma.sentence.update({
        where: {
          id: sentence.id,
        },
        data: {
          score: newSentenceScore,
          review: newSentenceDate,
        },
      });
    }),
});
