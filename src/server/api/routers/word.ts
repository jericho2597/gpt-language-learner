import { z } from "zod";
import { Prisma } from "@prisma/client";
import * as trpc from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { tokenizeText } from "~/server/kuromoji/tokenizer";

const LoadWordInput = z.object({
  text: z.string(),
});

export const wordRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany();
  }),

  create: protectedProcedure
    .input(LoadWordInput)
    .mutation(async ({ input, ctx }) => {
      // Tokenize the input text using kuromoji
      const tokenizedText = await tokenizeText(input.text);

      try {
        // Wait for all Prisma operations to complete
        let count = 0;
        await Promise.all(
          tokenizedText.map(async (element) => {
            if (element.word_type === "KNOWN") {
              count++;
              const newWord = await ctx.prisma.word.upsert({
                where: {
                  word_pos_pos1_pos2_pos3: {
                    word: element.surface_form,
                    pos: element.pos,
                    pos1: element.pos_detail_1,
                    pos2: element.pos_detail_2,
                    pos3: element.pos_detail_3,
                  },
                },
                create: {
                  word: element.surface_form,
                  pos: element.pos,
                  pos1: element.pos_detail_1,
                  pos2: element.pos_detail_2,
                  pos3: element.pos_detail_3,
                },
                update: {},
              });
            }
          })
        );

        return {
          message: "Found  words",
        };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === "P2002") {
            console.log(
              "There is a unique constraint violation, a new user cannot be created with this email"
            );
            throw trpc.httpError.badRequest(
              "A collection with this name already exists."
            );
          }
        }
      }
    }),
});
