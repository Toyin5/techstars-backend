import express from "express";
import { loginUser, registerUser, verifyUser } from "../controllers/user.js";

const userRoute = express.Router();

userRoute.post("/auth/register", registerUser);
userRoute.post("/auth/login", loginUser);
userRoute.get("/auth/verify/:userId?", verifyUser);
export default userRoute;
