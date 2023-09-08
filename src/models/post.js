import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import user from "./user.js";

const PostSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    uploader: {
      type: Schema.Types.UUID,
      // ref: user,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
    comments: [
      {
        description: {
          type: String,
        },
        author: {
          type: Schema.Types.UUID,
          // ref: user,
        },
      },
    ],
    content: {
      type: Schema.Types.Buffer,
      required: true,
    },
    upvote: {
      type: Number,
      default: 0,
    },
    downvote: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export default model("posts", PostSchema);
