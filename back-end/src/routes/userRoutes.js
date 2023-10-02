const express = require("express");

const {
	getAllUsers,
	getAllFriends,
	getCurrentUserDetail,
	sendFriendRequest,
	acceptFriendRequest,
	denyFriendRequest,
	removeFriend,
	cancelFriendRequest,
	updateCurrentUserDetail,
	getAllNewUsersRegistedToday,
	getUserDetailById,
	updateUserDetail,
} = require("../controllers/userController");
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const {
	isAvailableToSendFriendRequest,
	isAvailableToAcceptFriendRequest,
	isAvailableToDenyFriendRequest,
	isAvailableToRemoveFriend,
} = require("../middlewares/userMiddleware");

const router = express.Router();

router.route("/").get(protect, getAllUsers);

router.route("/profile/:userId").get(protect, getUserDetailById);

router.route("/newRegisteredUsers").get(protect, getAllNewUsersRegistedToday);

router
	.route("/me")
	.get(protect, getCurrentUserDetail)
	.patch(protect, updateCurrentUserDetail);

router.route("/updateUserProfile").patch(protect, isAdmin, updateUserDetail);

router.route("/friends").get(protect, getAllFriends);

router
	.route("/sendFriendRequest")
	.patch(protect, isAvailableToSendFriendRequest, sendFriendRequest);

router.route("/cancelFriendRequest").patch(protect, cancelFriendRequest);

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
