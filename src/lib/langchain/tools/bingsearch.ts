import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";

export const run = async () => {
  const llm = new OpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.9,
    topP: 1
  });
  const tools = [
    new DynamicTool({
      name: "calculator",
      description: "Calculate math expressions",
      func: async (input: string) => {
        return input;
      }
    })
  ];
};

