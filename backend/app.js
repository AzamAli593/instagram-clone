const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const postRouter = require("./routes/postRoute");
const commentRouter = require("./routes/commentRoute");
const chatRouter = require("./routes/chatRoute");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

// middlewares //

app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(cors());

// routes //

app.use("/api/v1", userRouter);
app.use("", authRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", commentRouter);
app.use("/api/v1", chatRouter);

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

module.exports = app;
