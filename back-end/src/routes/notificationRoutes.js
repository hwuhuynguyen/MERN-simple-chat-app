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
	getAllUnreadNotifications,
	createNewNotification,
	readNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router
	.route("/")
	.get(protect, isNotAdmin, getAllUnreadNotifications)
	.post(protect, isNotAdmin, createNewNotification)
	.patch(protect, isNotAdmin, readNotifications);

module.exports = router;
