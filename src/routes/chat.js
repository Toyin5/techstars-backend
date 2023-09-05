import { Router } from "express";
import { chatBot } from "../controllers/chat.js";

const chatRoutes = Router();

chatRoutes.post("/chat", chatBot);

export default chatRoutes;
