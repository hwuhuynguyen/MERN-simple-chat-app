const express = require("express");
const {
	accessChat,
	fetchChats,
	fetchChatById,
	createGroupChat,
	removeFromGroup,
	addToGroup,
	renameGroup,
	updateGroupChat,
} = require("../controllers/chatController");

const { protect } = require("../middlewares/authMiddleware");
const {
	isAvailableToUpdateGroupChat,
} = require("../middlewares/chatMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/:chatId").get(protect, fetchChatById);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router
	.route("/updateGroupChat")
	.patch(protect, isAvailableToUpdateGroupChat, updateGroupChat);

module.exports = router;
