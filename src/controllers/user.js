import User from "../models/user.js";
import Verify from "../models/verify.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import "dotenv/config";
import { cryptoToken } from "../utils/helpers.js";
import sendEmail from "../utils/sendEmail.js";
import sendHtml from "../utils/sendHtml.js";
import { novu } from "../utils/novuhandler.js";

export const registerUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const salt = await bcrypt.genSalt(10);

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(409).json({
      error: "Duplicate User",
    });
  }

  try {
    const newUser = new User({
      email,
      password: await bcrypt.hash(password, salt),
      first_name: firstName,
      last_name: lastName,
    });
    const user = await newUser.save();

    const token = cryptoToken();
    const verification = new Verify({
      userId: user._id,
      token,
    });

    await verification.save();

    const url = new URL(process.env.VERIFY_URL + user._id);
    url.searchParams.set("token", token);
    await novu.subscribers.identify(newUser._id, {
      email: newUser.email,
    });
    await sendEmail(email, "Verify your account", sendHtml(url));
    await novu.trigger("getting-started", {
      to: {
        subscriberId: newUser._id,
      },
      payload: {
        name: user.email,
      },
    });
    return res.status(201).json({
      message: "Successfully registered",
      data: { id: user._id, email },
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Duplicate user credentials!",
      });
    } else {
      return res.status(500).json({
        error: "Server Error!",
      });
    }
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.status(404).json({ error: "User not found", token: null });
  }
  try {
    const match = await bcrypt.compare(password, userExist.password);
    const user = { id: userExist._id };
    const token = Jwt.sign(user, process.env.JWT_TOKEN, { expiresIn: 360000 });

    if (match) {
      return userExist.verified
        ? res.status(200).json({
            message: "Successfully logged in",
            token: token,
          })
        : res.status(403).json({ error: "Account not verified", token: null });
    }
    return res.status(409).json({ error: "Incorrect Password", token: null });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Error decrypting",
      token: null,
    });
  }
};

export const verifyUser = async (req, res) => {
  const { userId } = req.params;
  const { token } = req.query;
  console.log(userId, token);
  try {
    const verification = await Verify.findOne({ userId });

    if (!verification) {
      return res.status(400).json({
        error: "Link expired!",
      });
    }

    if (verification.token === token) {
      await User.findByIdAndUpdate(userId, { verified: true });
      await Verify.findOneAndDelete(userId);

      return res.status(200).json({
        message: "User Verified",
      });
    }

    return res.status(400).json({ errors: "Invalid Link" });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  const auth = req.auth;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { password, verified, ...info } = user;
    if (!auth) return res.status(200).json({ data: info });
    return res.status(200).json({ data: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error",
    });
  }
};
