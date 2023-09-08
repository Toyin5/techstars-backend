import { Router } from "express";
import { createPost, getPost } from "../controllers/posts.js";
import { checkHeader } from "../middlewares/auth.js";

const postRoutes = Router();

postRoutes.post("/post", checkHeader, createPost);
postRoutes.get("/post/:slug", getPost);

export default postRoutes;
