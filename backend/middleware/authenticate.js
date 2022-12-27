const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.authenticate = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const id = jwt.verify(token, process.env.JWT_SECRET); // decoding the token from the cookies
    const user = await User.findById(id).populate("posts").populate("notifications");
    req.user = user;
    next();
  } else {
    res.clearCookie("token");
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }
};
