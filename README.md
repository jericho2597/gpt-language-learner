# Create T3 App

This is a Japanese language learning app bootstrapped with `create-t3-app`.

This application is only intended for my personal use but the repo is public so other people can copy it and deploy their own language learning tool if they want.

_This app is still a WORK IN PROGRESS and I do not intend to create proper deployment steps or demo environment until I am finished development. It is possible however to clone the repo and get the app running by looking into the .env file, package.json etc to see what is required._

## Features

- Load in Japanese vocabulary you are (e.g. from a piece of media, flashcard deck, exam vocabulary etc.)
- [kuromoji](https://github.com/atilika/kuromoji) is used to tokenize the input words and they are stored in database.
- OpenAI GPT is used to take the vocabulary words and generate example sentences to test the user on.
- The user can rate the difficulty in comprehending the sentence and this is used to determine a timeframe for next showing the user the sentence (similar to spaced repetition systems.)
- My [text-to-speech microservice](https://github.com/jericho2597/gptll-polly-microservice) is used that makes use of Amazon Polly to generate audio for the generated sentences.

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), which is the recommended way to deploy T3 bootsrapped apps, for more information.
