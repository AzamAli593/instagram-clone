const { default: mongoose } = require("mongoose");

const chatSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  messagesCount: [{ type: Number, default: 0 }],
});

module.exports = mongoose.model("Chat", chatSchema);
