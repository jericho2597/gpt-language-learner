// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Configuration, OpenAIApi } from "openai";
export class OpenAI {
  /**
   * @param {string} apiKey
   */
  constructor(apiKey) {
    // Create the Configuration and OpenAIApi instances
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.openai = new OpenAIApi(new Configuration({ apiKey }));
  }
  // Asynchronous function to generate text from the OpenAI API
  /**
   * @param {string} prompt
   * @param {number} max_tokens
   */
  async generateText(prompt, temperature = 0.85) {

    const model = "text-davinci-003";

    try {
      // Send a request to the OpenAI API to generate text
      const response = await this.openai.createCompletion({
        model,
        prompt,
        max_tokens: 800,
        n: 1,
        temperature,
      });
      console.log(`request cost: ${response.data.usage.total_tokens} tokens`);
      // Return the text of the response

      return response.data.choices[0].text;
    } catch (error) {
      throw error;
    }
  }
}
