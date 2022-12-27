const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../model/postModel");
const Comment = require("../model/commentModel");
const Notifications = require("../model/notificationModal");
const User = require("../model/userModel");

exports.addComment = catchAsyncError(async (req, res) => {
  const user = req.user;
  const { id, body } = req.body;
  let comment = await Comment.create({ author: user, body: body });
  let post = await Post.findByIdAndUpdate(id, {
    $push: { comments: comment },
  }).populate("author");

  if (post.author._id.toString() !== user._id.toString()) {
    const notification = {
      content: `${user.username} commented on your post`,
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

  comment = await comment.populate("author");

  res.status(200).json({
    comment: comment,
  });
});

exports.deleteComment = catchAsyncError(async (req, res) => {
  const { commentId, postId } = req.body;

  let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: { $eq: commentId } } } })
    .populate("comments")
    .populate("comments.author");

  await Comment.findByIdAndDelete(commentId);

  postComments = post.comments.filter((item) => item !== commentId);

  res.status(200).json({
    postComments,
  });
});
