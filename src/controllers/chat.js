import { OpenAIStream, streamToResponse } from "ai";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

export const chatBot = async (req, res) => {
  const { message } = req.body;
  try {
    const openAiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [message],
    });

    const stream = OpenAIStream(openAiResponse);
    // console.log(stream);
    return streamToResponse(stream, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};
