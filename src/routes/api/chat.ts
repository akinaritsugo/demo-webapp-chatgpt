import { Router } from "express";
import EventSource from "eventsource";
import axios, { Axios, AxiosError } from "axios";
export const Chat = Router();

const OPENAI_RESOURCE = process.env.AZURE_OPENAI_API_INSTANCE_NAME;
const OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
const OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;
const OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const OPENAI_COMPLETION_ENDPOINT = `https://${OPENAI_RESOURCE}.openai.azure.com/openai/deployments/${OPENAI_DEPLOYMENT}/chat/completions?api-version=${OPENAI_API_VERSION}`;

const createRequestData = (message: string, stream = false) => {
  return {
    messages: [
      {
        role: "user",
        content: message
      }
    ],
    stream
  };
};



// Get chat logs by specified user id.
Chat.get("/", (req, res, next) => {
  res.json("OK");
});

// Request new chat compeletion.
Chat.post("/", async (req, res, next) => {
  const data = createRequestData(req.body.message);

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

// Request new chat compeletion with stream.
Chat.use("/stream", async (req, res, next) => {
  // Create request data
  const data = createRequestData(req.body.message, true);

  try {
    // Request OpenAI API
    const response = await axios({
      method: "post",
      url: OPENAI_COMPLETION_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        "api-key": OPENAI_API_KEY
      },
      data,
      responseType: "stream"
    });

    // Set response headers
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });

    // Close connection when client disconnects
    req.socket.addListener("close", () => {
      res.end();
    });

    // Stream settings
    const stream = response.data;
    stream.on("data", (chunk: Buffer) => {
      res.write(chunk.toString());
    });
    stream.on("end", () => {
      res.end();
    });
    stream.on("error", (err: AxiosError | Error | any) => {
      console.log(err.message);
      next(err);
    });
  } catch (err: AxiosError | Error | any) {
    console.log(err.message);
    next(err);
  }
});

const recursive = (count: number, req: any, res: any, next: any) => {
  setTimeout(() => {
    const data = {
      messages: `Hello, world! - ${(new Date()).toLocaleString()}`
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    const nextCount = count - 1;
    if (nextCount > 0) {
      recursive(nextCount, req, res, next);
    } else {
      res.write("data: done\n\n");
      res.end();
      next();
    }
  }, 1000);
};

Chat.get("/time", (req, res, next) => {
  // Set response header
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  });

  // Close connection when client disconnects
  req.socket.addListener("close", () => {
    res.end();
  });

  recursive(10, req, res, next);
});
