import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    socials: [String],
    verified: {
      type: Boolean,
      default: false,
    },
    intro: {
      type: String,
    },
  },
  { timestamps: true }
);
export default model("users", UserSchema);
