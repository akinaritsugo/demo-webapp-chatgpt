import { Router } from "express";
import axios, { Axios, AxiosError } from "axios";
export const Chat = Router();

const OPENAI_RESOURCE = process.env.OPENAI_RESOURCE;
const OPENAI_DEPLOYMENT = process.env.OPENAI_DEPLOYMENT;
const OPENAI_API_VERSION = process.env.OPENAI_API_VERSION;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_COMPLETION_ENDPOINT = `https://${OPENAI_RESOURCE}.openai.azure.com/openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=${OPENAI_API_VERSION}`;

Chat.get("/", (req, res, next) => {
  res.json("OK");
});

Chat.post("/", async (req, res, next) => {
  const message = req.body.message;
  const data = {
    messages: [
      {
        role: "user",
        content: message
      }
    ]
  };
  try {
    const response = await axios({
      method: "post",
      url: OPENAI_COMPLETION_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        "api-key": OPENAI_API_KEY
      },
      data
    });
    res.json(response.data.choices[0]?.message);
  } catch (err: AxiosError | Error | any) {
    console.log(err.message);
    next(err);
  }
});
