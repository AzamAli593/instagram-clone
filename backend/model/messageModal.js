const { default: mongoose } = require("mongoose");

const messageSchema = mongoose.Schema({
  chat: {
    type: mongoose.Schema.ObjectId,
    ref: "Chat",
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Number,
  },
});

module.exports = mongoose.model("Message", messageSchema);
