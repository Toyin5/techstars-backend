import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
  verifyUser,
} from "../controllers/user.js";
import { checkHeader } from "../middlewares/auth.js";

const userRoute = express.Router();

userRoute.post("/auth/register", registerUser);
userRoute.post("/auth/login", loginUser);
userRoute.get("/auth/verify/:userId?", verifyUser);
userRoute.get("/user/:id", getUser);
export default userRoute;
