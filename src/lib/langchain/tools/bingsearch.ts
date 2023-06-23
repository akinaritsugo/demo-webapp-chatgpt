import { OpenAI } from "langchain";
import { Tool } from "langchain/tools";
import axios from "axios";

export type BingSearchResult = {
  id: string;
  name: string;
  url: string;
  displayUrl: string;
  snippet: string;
};

export class BingSearch extends Tool {
  name = "bing-search";
  description = "検索エンジン。現在の出来事に関する質問の回答が必要な時に利用します。入力（Action Input）は検索クエリです。";

  protected _apiKey: string;
  protected _retrieveCount: number;

  constructor(
    apiKey: string | undefined = process.env.AZURE_BINGSEARCH_KEY,
    retrieveCount = 3
  ) {
    super();

    if (!apiKey) {
      throw new Error("Bing Search API key is not set");
    }

    this._apiKey = apiKey;
    this._retrieveCount = retrieveCount;
  }

  async _call(input: string): Promise<string> {
    const url = new URL("https://api.bing.microsoft.com/v7.0/search");
    url.searchParams.append("q", input);
    url.searchParams.append("offset", "0");
    url.searchParams.append("count", this._retrieveCount.toString());
    url.searchParams.append("mkt", "ja-jp");
    url.searchParams.append("safesearch", "Moderate");

    const reply = await axios({
      method: "GET",
      url: url.toString(),
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": this._apiKey
      }
    });

    const resuls = reply.data.webPages.value;

    if (resuls.length > 0) {
      const summary = resuls.reduce(
        (fragment: string, current: BingSearchResult) => {
          return fragment + current.snippet + "\r\n";
        }, "");
      return summary;
    }

    return "該当する結果がありませんでした。";
  }
}