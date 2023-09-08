import post from "../models/post.js";
import user from "../models/user.js";
import { generateSlug } from "../utils/helpers.js";

export const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  const id = req.user.id;
  console.log(typeof tags);
  try {
    const newPost = new post({
      title,
      content,
      tags: tags,
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

    if (!onePost)
      return res.status(404).json({ message: "Post doesn't exist or deleted" });

    return res.status(200).json({
      data: {
        ...onePost,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const getPostByUploader = async (req, res) => {
  const { uploader } = req.params;
  try {
    const posts = await post.find({ uploader });
    return res.status(200).json({ data: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
  } catch (error) {}
};

export const upvotePost = async (req, res) => {
  const id = req.user.id;
  const slug = req.params;
  try {
    const oneUser = await user.findOne({ _id: id });
    const onePost = await post.findOne({ slug });
    if (!oneUser)
      return res.status(404).json({ messsgae: "User not found or deleted" });
    if (!onePost)
      return res.status(404).json({ message: "Post doesn't exist or deleted" });
    if (oneUser.upvotes.includes(onePost._id))
      return res.status(409).json({ message: "You already upvoted this post" });
    onePost.upvote++;
    await onePost.save();
    oneUser.upvotes.push(onePost._id);
    await oneUser.save();
    return res.status(200).json({ message: "Liked!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};
export const downvotePost = async (req, res) => {
  const id = req.user.id;
  const slug = req.params;
  try {
    const oneUser = await user.findOne({ _id: id });
    const onePost = await post.findOne({ slug });
    if (!oneUser)
      return res.status(404).json({ messsgae: "User not found or deleted" });
    if (!onePost)
      return res.status(404).json({ message: "Post doesn't exist or deleted" });
    if (oneUser.downvotes.includes(onePost._id))
      return res
        .status(409)
        .json({ message: "You already downvoted this post" });
    onePost.downvote++;
    await onePost.save();
    oneUser.downvotes.push(onePost._id);
    await oneUser.save();
    return res.status(200).json({ message: "Liked!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Server error",
    });
  }
};
