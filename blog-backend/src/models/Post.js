import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Il titolo è obbligatorio"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Il corpo del post è obbligatorio"],
      trim: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: {
      type: String,
      default: "Brian Fox",
      immutable: true,
    },
  },
  { timestamps: true },
);

postSchema.index({ hashtags: 1 });
postSchema.index({ status: 1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
