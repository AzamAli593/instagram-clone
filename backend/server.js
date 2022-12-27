const app = require("./app");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const socket = require("socket.io");

require("dotenv").config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectToDb = () => {
  mongoose.connect(process.env.DB_URI).then((response) => {
    console.log(`successfully connected to ${response.connection.host}`);
  });
};

connectToDb();

const server = app.listen(process.env.PORT, (req, res) => {
  console.log("server listening on port 4000");
});

const io = socket(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const findUser = (recieverId) => {
  return users.find((user) => user.userId === recieverId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ sender, recieverId, content }) => {
    const user = findUser(recieverId);
    if (user)
      io.to(user.socketId).emit("getMessage", {
        sender,
        content,
      });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});
