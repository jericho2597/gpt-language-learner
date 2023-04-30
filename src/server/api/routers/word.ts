import { z } from "zod";
import { Prisma } from "@prisma/client";
import * as trpc from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { tokenizeText } from "~/server/kuromoji/tokenizer";

import PLimit from "p-limit";

const LoadWordInput = z.object({
  text: z.string(),
});

const grammarTypes = [
  "名詞",
  "動詞",
  "形容詞",
  "副詞",
  "接続詞",
  "助動詞",
  "接頭詞",
  "助詞",
];

export const wordRouter = createTRPCRouter({
  create: protectedProcedure
    .input(LoadWordInput)
    .mutation(async ({ input, ctx }) => {
      // Tokenize the input text using kuromoji
      const tokenizedText = await tokenizeText(input.text);

      // Set concurrency limit
      const concurrencyLimit = 10;
      const limit = PLimit(concurrencyLimit);

      try {
        // Wait for all Prisma operations to complete
        await Promise.all(
          tokenizedText.map(async (element) => {
            return limit(async () => {
              if (
                element.word_type === "KNOWN" &&
                grammarTypes.includes(element.pos)
              ) {
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
            });
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
