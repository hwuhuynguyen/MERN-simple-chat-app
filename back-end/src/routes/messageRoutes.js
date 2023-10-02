const express = require("express");

const { protect, isAdmin } = require("../middlewares/authMiddleware");

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
	.get(protect, isAdmin, getAllMessagesForAdmin)
	.post(protect, sendMessage);

router.route("/detail/:messageId").get(protect, isAdmin, getMessageById);

router
	.route("/newSentMessages")
	.get(protect, isAdmin, getAllNewSentMessagesForAdmin);

router.route("/:chatId").get(protect, allMessages);

module.exports = router;
