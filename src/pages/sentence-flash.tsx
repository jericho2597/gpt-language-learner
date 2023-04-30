import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/button";
import { AuthGuard } from "~/components/auth/withAuth";
import { useRef, useEffect } from "react";

const SentenceFlash: NextPage = () => {
  const { data, refetch } = api.sentence.getSentences.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const { mutate } = api.sentence.giveFeedback.useMutation();

  const reveal = () => {
    setRevealed(true);
  };

  const submitFeedback = (feedback: number) => {
    void mutate({
      sentenceId: data.sentences[index].id,
      feedback,
    });
    setRevealed(false);
    if (data && index === data?.sentences.length - 1) {
      void loadMoreSentences();
    } else {
      setIndex(index + 1);
    }
  };

  const loadMoreSentences = async () => {
    await refetch();
    setIndex(0);
  };

  return (
    <AuthGuard>
      <Head>
        <title>日本語GPT</title>
        <meta name="description" content="GPT Language Learner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#050b2e] to-[#010109]">
        <h1 className="my-8 text-5xl font-extrabold tracking-tight text-white">
          日本語 <span className="text-[hsl(227,100%,70%)]">GPT</span>
        </h1>
        <div className=" h-68 flex w-10/12 justify-center rounded-lg bg-[hsl(0,0%,0%)]">
          <div className="my-8 flex flex-col justify-start text-center">
            {!data && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
            {data?.generatingMore && (
              <h6 className="text-4xl font-bold tracking-tight text-white ">
                Generating new sentences, come back later
              </h6>
            )}
            {data && !data.generatingMore && (
              <>
                <h6 className="text-4xl font-bold tracking-tight text-white ">
                  {data.sentences[index]?.sentence}
                </h6>
                {revealed && (
                  <>
                    <h6 className="text-md mt-16 font-bold tracking-tight text-white ">
                      {data.sentences[index]?.translation}
                    </h6>
                  </>
                )}
                <div className="my-6">
                  <AudioPlayer audioUrl={data.sentences[index]?.audioUrl} />
                </div>
              </>
            )}
          </div>
        </div>
        {revealed && !data?.generatingMore && (
          <>
            <div className="my-4 flex flex-row space-x-3">
              <Button variant="subtle" onClick={() => submitFeedback(1)}>
                Easy
              </Button>
              <Button variant="subtle" onClick={() => submitFeedback(2)}>
                Okay
              </Button>
              <Button variant="subtle" onClick={() => submitFeedback(3)}>
                Hard
              </Button>
              <Button variant="subtle" onClick={() => submitFeedback(4)}>
                Nothing
              </Button>
            </div>
          </>
        )}
        {!revealed && !data?.generatingMore && (
          <>
            <div className="my-4">
              <Button variant="subtle" onClick={() => reveal()}>
                Reveal
              </Button>
            </div>
          </>
        )}
      </main>
    </AuthGuard>
  );
};

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  return (
    <audio ref={audioRef} controls>
      <source src={audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default SentenceFlash;
