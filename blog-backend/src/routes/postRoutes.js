import { Router } from "express";
import {
  createPost,
  deletePost,
  getPublicPosts,
  publishPost,
} from "../controllers/postController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", getPublicPosts);
router.post("/", auth, createPost);
router.patch("/:id/publish", auth, publishPost);
router.delete("/:id", auth, deletePost);

export default router;
