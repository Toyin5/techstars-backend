import { Router } from "express";
import { createPost } from "../controllers/posts.js";
import { checkHeader } from "../middlewares/auth.js";

const postRoutes = Router();

postRoutes.post("/post", checkHeader, createPost);

export default postRoutes;
