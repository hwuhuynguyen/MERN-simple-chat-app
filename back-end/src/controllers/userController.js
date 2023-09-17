const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

//@description     Search all users of a system
//@route           GET /api/users/
//@access          PROTECTED
const getAllUsers = catchAsync(async (req, res) => {
	const keyword = req.query.search
		? {
				$or: [
					{ name: { $regex: req.query.search, $options: "i" } },
					{ email: { $regex: req.query.search, $options: "i" } },
					{ phoneNumber: { $regex: req.query.search, $options: "i" } },
				],
		  }
		: {};

	const users = await User.find(keyword);
	// const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

	res.status(200).json({
		length: users.length,
		users,
	});
});

//@description		Search all friends of a user
//@route					GET /api/users/friends
//@access					PROTECTED
const getAllFriends = catchAsync(async (req, res) => {
	const user = await req.user.populate("friends");
	const keyword = req.query.search?.toLowerCase() || "";
	console.log(keyword);
	const friends = user.friends.filter((friend) => {
		return (
			friend.name?.toLowerCase().includes(keyword) ||
			friend.email?.toLowerCase().includes(keyword) ||
			friend.phoneNumber?.toLowerCase().includes(keyword)
		);
	});

	res.status(200).json({
		length: friends.length,
		users: friends,
	});
});

//@description		Send friend request to a user
//@route					PATCH /api/users/addFriend
//@access					PROTECTED
const sendFriendRequest = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.user._id, {
		$push: { waitingAcceptedFriends: req.body.userId },
	});
	await User.findByIdAndUpdate(req.body.userId, {
		$push: { waitingRequestFriends: req.user._id },
	});
	res.status(200).json({
		data: {
			user,
		},
	});
});

//@description		Accept friend request of a user
//@route					PATCH /api/users/acceptFriendRequest
//@access					PROTECTED
const acceptFriendRequest = catchAsync(async (req, res) => {
	await User.findByIdAndUpdate(req.user._id, {
		$push: { friends: req.body.userId },
	});
	await User.findByIdAndUpdate(req.body.userId, {
		$push: { friends: req.user._id },
	});
	await User.findByIdAndUpdate(req.body.userId, {
		$pull: { waitingAcceptedFriends: req.user._id },
	});
	await User.findByIdAndUpdate(req.user._id, {
		$pull: { waitingRequestFriends: req.body.userId },
	});

	res.status(200).json({
		data: {
			message: "Both of you became friends",
		},
	});
});

//@description		Deny friend request of a user
//@route					PATCH /api/users/denyFriendRequest
//@access					PROTECTED
const denyFriendRequest = catchAsync(async (req, res) => {
	await User.findByIdAndUpdate(req.user._id, {
		$pull: { waitingAcceptedFriends: req.params.id },
	});
	const user = await User.findByIdAndUpdate(req.params.id, {
		$pull: { waitingRequestFriends: req.user._id },
	});
	res.status(200).json({
		user,
		message: "Friend request deleted",
	});
});

//@description		Remove friend
//@route					PATCH /api/users/removeFriend
//@access					PROTECTED
const removeFriend = catchAsync(async (req, res) => {
	await User.findByIdAndUpdate(req.user._id, {
		$pull: { friends: req.params.id },
	});
	const user = await User.findByIdAndUpdate(req.params.id, {
		$pull: { friends: req.user._id },
	});
	res.status(200).json({
		user,
		message: "Removed friend successfully",
	});
});

module.exports = {
	getAllUsers,
	getAllFriends,
	sendFriendRequest,
	acceptFriendRequest,
	denyFriendRequest,
	removeFriend,
};
