import * as kuromoji from 'kuromoji';

const tokenizerPromise = new Promise<kuromoji.Tokenizer>((resolve, reject) => {
  const builder = kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' });

  builder.build((err, tokenizer) => {
    if (err) {
      reject(err);
    } else {
      resolve(tokenizer);
    }
  });
});

export async function tokenizeText(text: string): Promise<kuromoji.IpadicFeatures[]> {
  const tokenizer = await tokenizerPromise;
  return tokenizer.tokenize(text);
}