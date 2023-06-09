import { Router } from "express";
export const Bing = Router();

Bing.get("/", (req, res) => {
  res.render("bing");
});
