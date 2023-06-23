import {
  BasePromptTemplate,
  BaseStringPromptTemplate,
  SerializedBasePromptTemplate
} from "langchain/prompts";
import { Tool } from "langchain/tools";
import {
  InputValues,
  PartialValues,
  AgentStep,
} from "langchain/schema";

const PROMPT = `
次の質問にできる限り最善の回答をしてください。あなたは以下のツールを利用することができます:

ツール:
###
{{TOOLS_INFO}}
###

回答フォーマット:
###
Question: 答えなければならない質問内容を記載します
Thought: 質問に答えるため何をすべきか、やるべきことを考えます
Action: 実行するアクションを [{{TOOLS_NAME_LIST}}] から選択します
Action Input: アクションに入力する値を記載します
Observation: アクションの実行結果を記載します
... (Thought/Action/Action Input/Observation は複数回繰り返します)
Thought: 最終結論(Final Answer)が出ました
Final Answer: 元の質問に対する最終結論を記載します。
###

Begin!
###
Question: {{INPUT}}
Thought: {{AGENT_THOUGHT}}
`;

export class ReActPromptTemplate extends BaseStringPromptTemplate {
  tools: Tool[];

  constructor(args: { tools: Tool[], inputVariables: string[] }) {
    super(args);
    this.tools = args.tools;
  }

  _getPromptType(): string {
    return "custom-prompt";
  }

  format(values: InputValues): Promise<string> {
    // Tool information
    const toolsInfo = this.tools
      .map(tool => `${tool.name}: ${tool.description}`)
      .join("\r\n");
    const toolsNameList = this.tools.map(tool => tool.name).join(",");

    // Intermediate step
    const intermediateSteps = values.intermediate_steps as AgentStep[];
    const agentThought = intermediateSteps.reduce(
      (thoughts, { action, observation }) => {
        return [
          thoughts,
          action.log,
          `Observation: ${observation}`,
          "Thought:"
        ].join("\n");
      }, ""
    ).trim();

    return Promise.resolve(
      PROMPT
        .replace("{{TOOLS_INFO}}", toolsInfo)
        .replace("{{TOOLS_NAME_LIST}}", toolsNameList)
        .replace("{{INPUT}}", values.input)
        .replace("{{AGENT_THOUGHT}}", agentThought)
    );
  }

  partial(_values: PartialValues): Promise<BasePromptTemplate> {
    throw new Error("Not implemented");
  }

  serialize(): SerializedBasePromptTemplate {
    throw new Error("Not implemented");
  }
}

