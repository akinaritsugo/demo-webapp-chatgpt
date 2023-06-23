import express from "express";
import { Home } from "./routes/home";
import { Chat as ViewChat } from "./routes/chat";
import { Bing as ViewBing } from "./routes/bing";
import { Chat as ApiChat } from "./routes/api/chat";
import { Bing as ApiBing } from "./routes/api/bing";
import path from "path";

const PORT = process.env.PORT || 3000;

const app: express.Express = express();

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static folder
app.use("/public", express.static(path.join(__dirname, "/public")));

// Set up routes
app.use("/", (() => {
  const router = express.Router();
  router.use("/", Home);
  router.use("/chat", ViewChat);
  router.use("/bing", ViewBing);
  return router;
})());
app.use("/api", (() => {
  const router = express.Router();
  router.use("/chat", ApiChat);
  router.use("/bing", ApiBing);
  return router;
})());
app.use("/healthz", (req, res, next)=> {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});