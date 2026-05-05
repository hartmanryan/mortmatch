import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({ apiKey: "test" });
async function test() {
  const result = streamText({
    model: google('gemini-2.5-flash'),
    prompt: 'hello'
  });
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(result)));
  console.log("Exports from ai:", Object.keys(await import('ai')));
}
test();
