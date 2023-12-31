import express from "express";
import database from "./utils/db.js";
import "dotenv/config";
import cors from "cors";
import userRoute from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import postRoutes from "./routes/post.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.static("/public"));
app.use(express.json());
app.use("/api", userRoute);
app.use("/api", chatRoutes);
app.use("/api", postRoutes);

await database();

app.use("/", (req, res) => {
  res.status(200).send("Welcome to Techstar api");
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export default app;
