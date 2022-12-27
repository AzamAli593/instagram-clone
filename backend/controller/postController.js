const cloudinary = require("cloudinary");
const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../model/postModel");
const User = require("../model/userModel");
const Notifications = require("../model/notificationModal");

exports.createPost = catchAsyncError(async (req, res, next) => {
  let postBody = req.body;
  let images = [];

  // if there is only one image then only push it else set images equals to req.images //

  images = req.body.images;

  const imageLinks = [];
  for (let i = 0; i < images.length; i++) {
    const myCloud = await cloudinary.v2.uploader.upload(images[i], {
      folder: "post-images",
    });

    imageLinks.push({
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    });
  }

  postBody.images = imageLinks;
  postBody.author = req.user;
  postBody.createdAt = new Date(Date.now()).getTime();

  const post = await Post.create(postBody);

  const id = req.user._id;
  await User.findByIdAndUpdate(id, { $push: { posts: post } });

  res.status(200).json({
    response: true,
  });
});

exports.getFeedPosts = catchAsyncError(async (req, res) => {
  const array = req.user.following;

  let posts = [];

  const loggedInUserPosts = await Post.find({ author: req.user._id }).populate("author").populate("comments.author");
  posts.push(...loggedInUserPosts);

  for (let i = 0; i < array.length; i++) {
    await Post.find({ author: array[i].toString() })
      .populate("author")
      .populate("comments.author")
      .then((res) => {
        posts.push(...res);
      });
  }

  posts.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  res.status(200).json({
    posts: posts,
  });
});

exports.getSinglePost = catchAsyncError(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate("author").populate("comments.author");

  if (!post) {
    return res.status(400).json({
      message: "post not found",
    });
  } else {
    res.status(200).json({
      post: post,
    });
  }
});

exports.handleLike = catchAsyncError(async (req, res) => {
  const user = req.user;
  const { id } = req.body;
  const post = await Post.findById(id).populate("author");
  if (!post) {
    res.status(400).json({
      message: "post not found",
    });
  }
  if (post.usersLiked.includes(user._id)) {
    await post.update({ $pull: { usersLiked: user._id } });
  } else {
    post.usersLiked.push(user);
    if (post.author._id.toString() !== req.user._id.toString()) {
      const notification = {
        content: `${user.username} liked your post`,
        reference: `/p/${post._id}`,
        timeStamp: new Date(Date.now()).getTime(),
      };
      const isPresent = await Notifications.findOne({
        content: notification.content,
        reference: notification.reference,
      });
      if (!isPresent) {
        const newNotification = await Notifications.create(notification);
        await User.findByIdAndUpdate(post.author._id, {
          $push: { notifications: newNotification },
        });
      }
    }
  }
  await post.save();
  res.status(200).json({
    response: true,
  });
});

exports.getUserPost = catchAsyncError(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) return;

  const posts = await Post.find({ author: user._id }).populate("author").populate("comments.author");

  posts.sort((a, b) => {
    return b.createdAt - a.createdAt;
  });

  res.status(200).json({
    posts: posts,
  });
});

exports.deletePost = catchAsyncError(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate("author");
  if (post.author._id.toString() !== req.user._id.toString()) {
    res.status(401).json({
      message: "not allowed",
    });
  } else {
    post.images.forEach(async (item) => {
      await cloudinary.v2.uploader.destroy(item.public_id);
    });
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: postId } });
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      response: true,
    });
  }
});
