const express = require("express");

const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const {
	sendMessage,
	allMessages,
	getAllMessagesForAdmin,
	getAllNewSentMessagesForAdmin,
	getMessageById,
} = require("../controllers/messageController");

const router = express.Router();

router
	.route("/")
	.get(isAuthenticated, isAdmin, getAllMessagesForAdmin)
	.post(isAuthenticated, sendMessage);

router
	.route("/detail/:messageId")
	.get(isAuthenticated, isAdmin, getMessageById);

router
	.route("/new-sent-messages")
	.get(isAuthenticated, isAdmin, getAllNewSentMessagesForAdmin);

router.route("/:chatId").get(isAuthenticated, allMessages);

module.exports = router;
