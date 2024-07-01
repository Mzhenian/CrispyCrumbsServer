import express from "express";
import { index } from "../controllers/articles.js";
import { isLoggedIn } from "../controllers/login.js";

const router = express.Router();

router.get("/articles", isLoggedIn, index); 

export default router;
