import { PrismaClient, Prisma, Word } from "@prisma/client";
import { OpenAI } from "./OpenAI";
import { env } from "~/env.mjs";
import { error } from "console";

type GptResponse = {
  sentenceOne: string;
  translationOne: string;
  sentenceTwo: string;
  translationTwo: string;
};

export async function generateSentences(
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) {
  // GET UP TO 100 words with score greater 0 and review is due, or get 20 with score is 0.
  const currentDate = new Date(); // Get the current date and time

  let words = await prisma.word.findMany({
    where: {
      score: {
        gt: 0, // Filter records with score greater than 0
      },
      review: {
        lte: currentDate, // Filter records with review datetime less than or equal to the current date and time
      },
    },
    take: 20, // Limit the number of records returned to up to 50
  });

  if (words.length < 20) {
    const additionalWords = await prisma.word.findMany({
      where: {
        score: 0, // Filter records with score equal to 0
      },
      take: 20 - words.length, // Limit the number of additional records to reach a total of 20
    });

    words = words.concat(additionalWords); // Combine the two lists of words
  }

  words.forEach((word) => {
    void generateSentence(prisma, word);
  });
}

const generateSentence = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  word: Word
) => {
  const prompt = `
    Imagine you are Japanese language expert that excels at creating content for Japanese language learners.
    I want you to create two natural Japanese sentences with translation based on a provided key word.
    The key word is provided with its reading, as well as its grammar type, and it is essential that this word is included in the generated sentence according to its given grammar type.
    You can use common simple words in the sentences in order to make it grammatically correct.
    You can randomly use any modifications to the provided word such as using different conjugations or honorifics to fit the sentence.

    The priority for the generated sentences is that they are natural sounding sentences that can be used in everyday life. They must also be grammatically correct.

    Key Word: ${word.word}
    Grammer Type: ${word.pos}, ${word.pos1}

    I need your response to be in JSON format so that it can be parsed by my system.
    DO NOT ADD ANY ADDITIONAL COMMENTS OR EXPLANATIONS, ONLY RETURN THE JSON OBJECT IN THE EXPECTED RESPONSE FORMAT AS BELOW.
    'sentenceOne' and 'sentenceTwo' should be a natural Japanese language showcasing the Key Word.
    'translationOne' and 'translationTwo' should be the corresponding english translations.

    Expected response format:

    {
      "sentenceOne": "こんにちは、私は医者です",
      "translationOne": Hello, I'm a doctor",
      "sentenceTwo": "これはリンゴです",
      "translationTwo": "this is an apple",
    }
    `;

  const openAI = new OpenAI(env.OPENAI_KEY);

  void (await openAI
    .generateText(prompt)
    .then((response) => {
      if (!response) {
        throw error(word.word);
      }
      const parsedResponse = JSON.parse(response) as GptResponse;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      void writeSentence(
        parsedResponse.sentenceOne,
        parsedResponse.translationOne,
        word,
        prisma
      );

      void writeSentence(
        parsedResponse.sentenceTwo,
        parsedResponse.translationTwo,
        word,
        prisma
      );
    })
    .catch((error) => {
      console.error("Failed to generate sentences for word", error);
    }));
};

const writeSentence = async (
  sentence: string,
  translation: string,
  word: Word,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const audioUrl = await generateAudio(sentence);

  void (await prisma.sentence.create({
    data: {
      sentence: sentence,
      translation: translation,
      score: 0,
      wordId: word.id,
      audioUrl,
    },
  }));
};

const generateAudio = async (sentence: string) => {
  const AUDIO_MICROSERVICE_ENDPOINT = process.env.AUDIO_MICROSERVICE_ENDPOINT;
  const API_KEY = process.env.AUDIO_MICROSERVICE_API_KEY;

  const response = await fetch(AUDIO_MICROSERVICE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ content: sentence }),
  });

  if (!response.ok) {
    throw new Error(`Error generating audio: ${response.statusText}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const responseBody = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  console.log(responseBody.ur);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return responseBody.url;
};
