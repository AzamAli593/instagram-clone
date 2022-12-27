const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  getUserDetail,
  logoutUser,
  processRegisterS1,
  processRegisterS2,
  processRegisterS3,
  loginUser,
  getSingleUser,
  searchUser,
  addFollowers,
  removeFollower,
  updateUser,
} = require("../controller/userController");
const { authenticate } = require("../middleware/authenticate");
require("../middleware/passport");

router.get("/register/process/s1", processRegisterS1);
router.get("/register/process/s2", processRegisterS2);
router.post("/register/process/s3", processRegisterS3);
router.post("/login", loginUser);
router.get("/loadUser", authenticate, getUserDetail);
router.get("/logout", logoutUser);
router.get("/user/:username", getSingleUser);
router.post("/search", searchUser);
router.post("/follower/add", authenticate, addFollowers);
router.post("/follower/remove", authenticate, removeFollower);
router.post("/profile/update", authenticate, updateUser);

module.exports = router;
