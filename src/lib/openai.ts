import { IncomingMessage } from "http";
import { URL } from "url";
import axios, { AxiosError } from "axios";
import { type } from "os";

const OPENAI_RESOURCE = process.env.OPENAI_RESOURCE;
const OPENAI_DEPLOYMENT = process.env.OPENAI_DEPLOYMENT;
const OPENAI_API_VERSION = process.env.OPENAI_API_VERSION;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_COMPLETION_ENDPOINT = `https://${OPENAI_RESOURCE}.openai.azure.com/openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=${OPENAI_API_VERSION}`;

type OpenAICompletionParams = {
  prompt: string;
  // max_tokens: number;
  // temperature: number;
  // top_p: number;
  // n: number;
  // stream: boolean;
  // logprobs: number;
  // echo: boolean;
  // stop: string[];
  // presence_penalty: number;
  // frequency_penalty: number;
  // best_of: number;
  // logit_bias: any;
  // return_prompt: boolean;
  // return_metadata: boolean;
  // return_sequences: boolean;
  // model: string;
  // engine: string;
  // owner: string;
  // stop_sequence: string[];
  // metadata: any;
  // frequency_penalty: number;
  // presence_penalty: number;
  // logit_bias: any;
  // logprobs: number;
  // echo: boolean;
}

// export async function* streamChatCompletion(message: string, params?: OpenAICompletionParams) {
//   const res = await axios({
//     method: "post",
//     url: OPENAI_COMPLETION_ENDPOINT,
//     headers: {
//       "Content-Type": "application/json",
//       "api-key": OPENAI_API_KEY
//     },
//     data: {
//       messages: [
//         {
//           role: "user",
//           content: message
//         }
//       ],
//       stream: true
//     },
//     responseType: "stream"
//   });

//   res.data.on("data", (chunk: Buffer) => {
//     const data = JSON.parse(chunk.toString());
//     yield data.choices[0]?.message;
//   }, (err: AxiosError | Error | any) => {
//     console.log(err.message);
//     throw err;
//   });
// }