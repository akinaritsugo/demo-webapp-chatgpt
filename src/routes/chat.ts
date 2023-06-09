import { Router } from "express";
export const Chat = Router();

Chat.get("/", (req, res) => {
  res.render("chat");
});
