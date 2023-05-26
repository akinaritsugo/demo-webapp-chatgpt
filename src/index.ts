import express from "express";
import { Home } from "./routes/home";
import { Chat } from "./routes/api/chat";
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
app.use("/", Home);
app.use("/test", (req, res, next)=>{
  res.render("test");
});
app.use("/api/chat", Chat);
// app.use("/api", (() => {
//   const router = express.Router();
//   router.use("/chat", Chat);
//   return router;
// })());

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});