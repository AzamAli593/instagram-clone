const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsyncError = require("../middleware/catchAsyncError");
const cloudinary = require("cloudinary");

exports.processRegisterS1 = async (req, res) => {
  const user = await User.findOne({ googleId: req.user.id });

  if (user) {
    const token = jwt.sign(user._id.toJSON(), process.env.JWT_SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 }).redirect(`${process.env.FRONTEND_URL}/home`);
  } else {
    const user = await User.create({
      googleId: req.user.id,
      name: req.user.displayName,
      username: req.user.emails[0].value,
      email: req.user.emails[0].value,
    });

    const token = jwt.sign(user._id.toJSON(), process.env.JWT_SECRET);
    res.cookie("tempToken", token).redirect(`${process.env.FRONTEND_URL}/register`);
  }
};

exports.processRegisterS2 = async (req, res) => {
  // fetching google data which was half registered in previous step //

  const { tempToken } = req.cookies;

  const id = jwt.verify(tempToken, process.env.JWT_SECRET);
  const user = await User.findById(id);

  res.json({
    user: user,
  });
};

exports.processRegisterS3 = catchAsyncError(async (req, res) => {
  const { tempToken } = req.cookies;
  const id = jwt.verify(tempToken, process.env.JWT_SECRET);
  const user = await User.findById(id);

  let { password } = req.body;

  const tempUser = await User.findOne({ username: req.body.username });

  if (tempUser) {
    return res.status(400).json({
      message: "username already been taken",
    });
  } else {
    user.name = req.body.name;
    user.username = req.body.username.toLowerCase();
    user.password = await bcrypt.hash(password, 10);
    user.isRegistered = true;
    const myCloud = await cloudinary.v2.uploader.upload(
      "https://res.cloudinary.com/duvgguhqc/image/upload/v1669574324/Avatars/default-pfp_mltcik.png",
      { folder: "Avatars" }
    );
    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await user.save();

    res.cookie("token", tempToken).clearCookie("tempToken").status(200).json({
      response: true,
    });
  }
});

exports.loginUser = catchAsyncError(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(400).send({
      message: "username or password is incorect",
    });
  }

  const decodedPassword = await bcrypt.compare(password, user.password);

  if (!decodedPassword) {
    return res.status(400).send({
      message: "username or password is incorect",
    });
  } else {
    const token = jwt.sign(user._id.toJSON(), process.env.JWT_SECRET);

    res
      .cookie("token", token, { expire: new Date() + 9999 })
      .status(200)
      .json({
        response: true,
      });
  }
});

exports.logoutUser = (req, res) => {
  req.logout(function (err) {
    res.clearCookie("token").json({
      success: true,
    });
  });
};

exports.getUserDetail = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

exports.getSingleUser = catchAsyncError(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username }).populate("followers").populate("following").populate("posts").populate("posts.comments");

  if (!user) {
    return res.status(400).json({
      message: "user not found",
    });
  } else {
    res.status(200).json({
      user: user,
    });
  }
});

exports.searchUser = catchAsyncError(async (req, res) => {
  const { username } = req.body;
  if (!username) {
    res.status(200).json({
      users: [],
    });
  } else {
    const users = await User.find({ username: { $regex: username } });

    res.status(200).json({
      users,
    });
  }
});

exports.addFollowers = catchAsyncError(async (req, res) => {
  const { searchedUser } = req.body;
  const user = req.user;

  await user.update({ $push: { following: searchedUser } });
  await User.findByIdAndUpdate(searchedUser._id, {
    $push: { followers: user },
  });
  user.save();
  res.status(200).json({
    response: true,
  });
});

exports.removeFollower = catchAsyncError(async (req, res) => {
  const { searchedUser } = req.body;
  const user = req.user;

  await user.update({ $pull: { following: searchedUser._id } });
  await User.findByIdAndUpdate(searchedUser._id, {
    $pull: { followers: user._id },
  });

  user.save();
  res.status(200).json({
    response: true,
  });
});

exports.updateUser = catchAsyncError(async (req, res) => {
  const { username, name, bio, avatar, oldPassword, newPassword } = req.body;

  if (oldPassword !== "" && newPassword === "") {
    res.status(400).json({ message: "password cannot be empty" });
  }

  if (newPassword !== "") {
    if (!(await bcrypt.compare(oldPassword, req.user.password))) {
      res.status(400).json({ message: "password incorrect" });
    }
  }

  const tempUser = await User.findOne({ username: username });

  if (tempUser) {
    if (tempUser._id.toString() !== req.user._id.toString()) res.status(400).json({ message: "username already taken" });
  }

  const user = await User.findById(req.user._id);

  user.username = username;
  user.name = name;
  user.bio = bio;
  if (newPassword !== "") {
    user.password = await bcrypt.hash(newPassword, 10);
  }

  if (user.avatar.url !== avatar) {
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "Avatars" });
    user.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
  }

  await user.save();

  res.status(200).json({
    user: user,
  });
});
