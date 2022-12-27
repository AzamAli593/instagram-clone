const {
  createPost,
  getFeedPosts,
  handleLike,
  getSinglePost,
  getUserPost,
  deletePost,
} = require("../controller/postController");
const { authenticate } = require("../middleware/authenticate");

const router = require("express").Router();

router.post("/create", authenticate, createPost);
router.get("/feed", authenticate, getFeedPosts);
router.post("/like", authenticate, handleLike);
router.get("/post/:postId", getSinglePost);
router.delete("/post/:postId", authenticate, deletePost);
router.get("/post/user/:username", getUserPost);
module.exports = router;
