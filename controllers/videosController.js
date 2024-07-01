import { getArticles } from "../models/articles.js";

const index = (req, res) => {
  res.render("articles", { articles: getArticles() });
};

export { index };
