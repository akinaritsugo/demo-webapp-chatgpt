import { Router } from "express";
import { OpenAI } from "langchain/llms/openai";
import {
  LLMSingleActionAgent,
  AgentActionOutputParser,
  AgentExecutor
} from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { v4 as uuid } from "uuid";
import axios, { Axios, AxiosError } from "axios";
import { LLMChain } from "langchain/chains";
import { ReActPromptTemplate } from "../..//lib/langchain/propmts/reactprompttemplate";
import { ReActOutputParser } from "../..//lib/langchain/agents/reactoutputparser";
import { BingSearch } from "../../lib/langchain/tools/bingsearch";


export const Bing = Router();

Bing.post("/", async (req, res, next) => {
  const chatId = req.body.chatId || uuid();
  const message = req.body.message;

  try {
    const llm = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.9,
      topP: 1
    });
    const memory = new BufferMemory({
      returnMessages: true,
      // memoryKey: chatId
    });
    const chain = new ConversationChain({ llm, memory });
    const reply = await chain.call({ input: message });
    res.json({ chatId, message: reply.response });
  } catch (err: Error | any) {
    console.log(err.message);
    next(err);
  }
});


Bing.post("/bing", async (req, res, next) => {
  const chatId = req.body.chatId || uuid();
  const message = req.body.message;

  try {
    const llm = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.9,
      topP: 1
    });

    const tools = [
      new BingSearch(),
      new Calculator()
    ];
    
    const llmChain = new LLMChain({
      prompt: new ReActPromptTemplate({
        tools,
        inputVariables: ["input", "agentThought"]
      }),
      llm
    });

    const agent = new LLMSingleActionAgent({
      llmChain,
      outputParser: new ReActOutputParser(),
      stop: ["\nObservation"],
    });

    const executor = new AgentExecutor({
      agent,
      tools,
      verbose: true
    });

    const reply = await executor.call({ input: message });
    res.json({ chatId, message: reply.output });
  } catch (err: Error | any) {
    console.log(err.message);
    next(err);
  }
});



Bing.post("/search", async (req, res, next) => {
  const searchText = "coronavirus vaccine";
  const url = new URL("https://api.bing.microsoft.com/v7.0/search");
  url.searchParams.append("q", encodeURIComponent(searchText));
  url.searchParams.append("offset", "0");
  url.searchParams.append("count", "10");
  // url.searchParams.append("cc", "JP");
  url.searchParams.append("mkt", "ja-JP");
  // url.searchParams.append("setLang", "ja");
  url.searchParams.append("safesearch", "Moderate");

  try {
    const reply = await axios({
      method: "GET",
      // url: `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(searchText)}`,
      url: url.toString(),
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.AZURE_BINGSEARCH_KEY
      }
    });

    res.json(reply.data?.webPages?.value);
  } catch (err: AxiosError | Error | any) {
    console.log(err.message);
    next(err);
  }
});
