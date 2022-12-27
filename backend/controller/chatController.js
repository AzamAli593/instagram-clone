const catchAsyncError = require("../middleware/catchAsyncError");
const Chat = require("../model/chatModal");
const Message = require("../model/messageModal");

exports.createChat = async (req, res) => {
  try {
    const secondUser = req.body.reciever;
    const user = req.user._id;
    const chat = await Chat.create({ users: [user, secondUser] });

    res.status(200).json({ chat });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const content = req.body.content;
    const sender = req.user._id;
    const chatId = req.params.chatId;

    const message = await Message.create({ content, sender, chat: chatId });
    const chat = await Chat.findById(chatId);
    chat.messagesCount = chat.messagesCount + 1;
    chat.save();

    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender");
    res.status(200).json({ messages });
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const user = req.user;
    const chats = await Chat.find({ users: { $in: [user._id] } }).populate("users");

    res.status(200).json({
      chats,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate("users");
    res.status(200).json({ chat });
  } catch (err) {
    res.status(400).json({ err });
  }
};

exports.findorCreateChat = async (req, res) => {
  try {
    const user = req.user._id;
    const secondUser = req.body.secondUser;

    let chat = await Chat.findOne({ users: { $all: [user, secondUser] } });
    if (chat) {
      res.status(200).json({ chat });
    } else {
      chat = await Chat.create({ users: [user, secondUser] });
      res.status(200).json({ chat });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};
