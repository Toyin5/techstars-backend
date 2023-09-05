import { Novu } from "@novu/node";
import "dotenv/config";

export const novu = new Novu(process.env.NOVU_API_KEY);
