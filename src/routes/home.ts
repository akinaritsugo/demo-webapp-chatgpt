import { Router } from "express";
export const Home = Router();

Home.get("/", (req, res) => {
  res.render("home");
});
