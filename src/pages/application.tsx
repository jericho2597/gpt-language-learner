import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { AuthGuard } from "~/components/auth/withAuth";
import { Button } from "~/components/button";
import LoadWordsModal from "~/components/modal/load-words";
import StatsCard from "~/components/stats-card";

const Application: NextPage = () => {
  const [open, setOpen] = useState(false);

  const loadWords = () => {
    setOpen(true);
  };

  return (
    <AuthGuard>
      <LoadWordsModal open={open} setOpen={setOpen}></LoadWordsModal>

      <Head>
        <title>日本語GPT</title>
        <meta name="description" content="GPT Language Learner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#050b2e] to-[#010109]">
        <h1 className="my-8 text-5xl font-extrabold tracking-tight text-white">
          日本語 <span className="text-[hsl(227,100%,70%)]">GPT</span>
        </h1>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-start">
            <h6 className="text-lg font-bold tracking-tight text-white ">
              Overview
            </h6>
          </div>
        </div>
        <div className="my-1">
          <div className="relative">
            <div className="absolute inset-0 h-1/2" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl">
                <dl className="rounded-lg bg-[hsl(240,18%,14%)] shadow-md shadow-[#121a8ae1] sm:grid sm:grid-cols-2">
                  <StatsCard stat="Words" metric="890" />
                  <StatsCard stat="Sentences" metric="38" />
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="my-4">
          <Button variant="subtle" onClick={loadWords}>
            Load words
          </Button>
        </div>
        <Link href="/sentence-flash">
          <Button variant="subtle" onClick={loadWords}>
            Study Sentences
          </Button>
        </Link>
      </main>
    </AuthGuard>
  );
};

export default Application;
