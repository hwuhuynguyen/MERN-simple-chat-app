const express = require("express");

const {
	getAllUsers,
	getAllFriends,
	sendFriendRequest,
	acceptFriendRequest,
	denyFriendRequest,
	removeFriend,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const {
	isAvailableToSendFriendRequest,
	isAvailableToAcceptFriendRequest,
	isAvailableToDenyFriendRequest,
	isAvailableToRemoveFriend,
} = require("../middlewares/userMiddleware");

const router = express.Router();

router.route("/").get(protect, getAllUsers);

router.route("/friends").get(protect, getAllFriends);

router
	.route("/sendFriendRequest")
	.patch(protect, isAvailableToSendFriendRequest, sendFriendRequest);

router
	.route("/acceptFriendRequest")
	.patch(protect, isAvailableToAcceptFriendRequest, acceptFriendRequest);

router
	.route("/denyFriendRequest")
	.patch(protect, isAvailableToDenyFriendRequest, denyFriendRequest);

router
	.route("/removeFriend")
	.patch(protect, isAvailableToRemoveFriend, removeFriend);

module.exports = router;
