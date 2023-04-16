import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/button";

const SentenceFlash: NextPage = () => {
  const { data: sentences } = api.sentence.getSentences.useQuery();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const loadWords = () => {
    setOpen(true);
  };

  const reveal = () => {
    setRevealed(true);
  };

  return (
    <>
      <Head>
        <title>日本語GPT</title>
        <meta name="description" content="GPT Language Learner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#050b2e] to-[#010109]">
        <h1 className="my-8 text-5xl font-extrabold tracking-tight text-white">
          日本語 <span className="text-[hsl(227,100%,70%)]">GPT</span>
        </h1>
        <div className=" flex h-48 w-10/12 justify-center rounded-lg bg-[hsl(0,0%,0%)]">
          <div className="my-16">
            {!sentences && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
            {sentences && (
              <>
                <h6 className="text-2xl font-bold tracking-tight text-white ">
                  {sentences.sentences[index].text}
                </h6>
              </>
            )}
          </div>
        </div>
        {!revealed && (
          <>
            <div className="my-4">
              <Button variant="subtle" onClick={loadWords}>
                Load words
              </Button>
            </div>
          </>
        )}
        {revealed && (
          <>
            <div className="my-4">
              <Button variant="subtle" onClick={reveal}>
                Reveal
              </Button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default SentenceFlash;
