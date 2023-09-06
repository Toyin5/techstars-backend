import post from "../models/post.js";
import { generateSlug } from "../utils/helpers.js";

export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  const id = req.user;
  const arr = JSON.parse(tags);
  const t = [];
  arr.forEach((e) => t.push(e.value));

  try {
    const newPost = new post({
      title,
      content,
      tags: t,
      slug: generateSlug(title),
      uploader: id,
    });
    await newPost.save();
    return res.status(201).json({
      message: "Your post is published!",
      data: {
        slug: newPost.slug,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getPost = async (req, res) => {
  const { slug } = req.params;
  try {
    const onePost = await post.findOneAndUpdate(
      { slug },
      {
        $inc: {
          views: 1,
        },
      }
    );

    return res.status(200).json({
      data: {
        onePost,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const deletePost = async (req, res) => {};
