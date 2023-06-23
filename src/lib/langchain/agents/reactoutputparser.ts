import {
  AgentActionOutputParser,
} from "langchain/agents";
import {
  AgentAction,
  AgentFinish
} from "langchain/schema";
import { Callbacks } from "langchain/callbacks";

export class ReActOutputParser extends AgentActionOutputParser {
  async parse(text: string, callbacks?: Callbacks | undefined): Promise<AgentAction | AgentFinish> {
    if (text.includes("Final Answer:")) {
      const parts = text.split("Final Answer:");
      const input = parts[parts.length - 1].trim();
      const finalAnwers = { output: input };
      return { log: text, returnValues: finalAnwers };
    }

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error("Invalid output");
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
      log: text
    };
  }

  getFormatInstructions(): string {
    throw new Error("Not implemented");
  }
}
