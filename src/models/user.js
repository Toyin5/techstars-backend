import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    socials: [String],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async (next) => {
  try {
    let user = this;
    if (!user.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});
UserSchema.methods.comparePassword = async (password, cb) => {
  try {
    const match = await bcrypt.compare(password, this.password);
    cb(null, match);
  } catch (err) {
    return cb(err);
  }
};
export default model("users", UserSchema);
