import Post from "../models/Post.js";

export const getPublicPosts = async (req, res) => {
  const filter = { status: "published" };

  if (req.query.hashtag) {
    const hashtags = Array.isArray(req.query.hashtag)
      ? req.query.hashtag
      : [req.query.hashtag];
    filter.hashtags = { $in: hashtags };
  }

  const posts = await Post.find(filter).sort({ createdAt: -1 });
  res.json(posts);
};

export const createPost = async (req, res) => {
  const { title, body, hashtags = [] } = req.body;
  const post = await Post.create({
    title,
    body,
    hashtags,
    author: "Brian Fox",
  });

  res.status(201).json(post);
};

export const publishPost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { status: "published" },
    { new: true, runValidators: true },
  );

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(204).end();
};
