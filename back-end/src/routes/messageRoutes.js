const express = require("express");

const { protect } = require("../middlewares/authMiddleware");

const {
	sendMessage,
	allMessages,
	getAllMessagesForAdmin,
	getAllNewSentMessagesForAdmin,
} = require("../controllers/messageController");

const router = express.Router();

router
	.route("/")
	.get(protect, getAllMessagesForAdmin)
	.post(protect, sendMessage);

router.route("/newSentMessages").get(protect, getAllNewSentMessagesForAdmin);

router.route("/:chatId").get(protect, allMessages);

module.exports = router;
