const router = require("express").Router();
const { addComment, deleteComment } = require("../controller/commentController");
const { authenticate } = require("../middleware/authenticate");

router.route("/comment").post(authenticate, addComment);
router.route("/comment/delete").post(authenticate, deleteComment);

module.exports = router;
