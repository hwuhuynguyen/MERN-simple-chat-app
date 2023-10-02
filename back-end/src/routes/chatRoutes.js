const express = require("express");
const {
	accessChat,
	fetchChats,
	fetchChatById,
	createGroupChat,
	updateGroupChat,
} = require("../controllers/chatController");

const { protect, isNotAdmin } = require("../middlewares/authMiddleware");
const {
	isAvailableToUpdateGroupChat,
} = require("../middlewares/chatMiddleware");

const router = express.Router();

router
	.route("/")
	.get(protect, isNotAdmin, fetchChats)
	.post(protect, isNotAdmin, accessChat);

router.route("/:chatId").get(protect, isNotAdmin, fetchChatById);

router.route("/createGroupChat").post(protect, isNotAdmin, createGroupChat);

router
	.route("/updateGroupChat")
	.patch(protect, isNotAdmin, isAvailableToUpdateGroupChat, updateGroupChat);

module.exports = router;
