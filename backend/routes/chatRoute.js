const { getAllChats, createChat, createMessage, getMessages, getSingleChat, findorCreateChat } = require("../controller/chatController");
const { authenticate } = require("../middleware/authenticate");

const router = require("express").Router();

router.route("/chats").get(authenticate, getAllChats);
router.route("/chat").post(authenticate, findorCreateChat);
router.route("/direct/:chatId").post(authenticate, createMessage).get(authenticate, getSingleChat);
router.route("/direct/messages/:chatId").get(authenticate, getMessages);

module.exports = router;
