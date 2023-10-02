const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

//@description     Search all users of a system (except Admin)
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

	const users = await User.find({ ...keyword, isAdmin: false });
	// const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

	res.status(200).json({
		length: users.length,
		users,
	});
});

//@description     Search all users of a system (except Admin)
//@route           GET /api/users/profile/:userId
//@access          PROTECTED
const getUserDetailById = catchAsync(async (req, res) => {
	const userId = req.params.userId;

	const user = await User.find({ _id: { $eq: userId } });
	// const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

	res.status(200).json({
		user,
	});
});

//@description     Get all new registed users of a system (except Admin)
//@route           GET /api/users/newRegistedUsers
//@access          PROTECTED
const getAllNewUsersRegistedToday = catchAsync(async (req, res) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the current day.

	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1); // Get the start of the next day.

	const users = await User.find({
		isAdmin: false,
		createdAt: {
			$gte: today,
			$lt: tomorrow,
		},
	});

	res.status(200).json({
		length: users.length,
		users,
	});
});

//@description     Get current user information
//@route           GET /api/users/me
//@access          PROTECTED
const getCurrentUserDetail = catchAsync(async (req, res) => {
	const user = await User.findById(req.user._id)
		.populate("friends")
		.populate("waitingAcceptedFriends")
		.populate("waitingRequestFriends");

	res.status(200).json({
		user,
	});
});

//@description		Update current user information
//@route					PATCH /api/users/me
//@access					PROTECTED
const updateCurrentUserDetail = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			name: req.body.name || req.user.name,
			email: req.body.email || req.user.email,
			phoneNumber: req.body.phoneNumber || req.user.phoneNumber,
		},
		{ new: true }
	);
	res.status(200).json({
		user,
	});
});

//@description		Update user information (for admin only)
//@route					PATCH /api/users/me
//@access					PROTECTED
const updateUserDetail = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.body.userId,
		{
			name: req.body.name,
			phoneNumber: req.body.phoneNumber || "",
		},
		{ new: true }
	);
	res.status(200).json({
		user,
	});
});

//@description		Search all friends of a user
//@route					GET /api/users/friends
//@access					PROTECTED
const getAllFriends = catchAsync(async (req, res) => {
	const user = await req.user.populate("friends");
	const keyword = req.query.search?.toLowerCase() || "";
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
//@route					PATCH /api/users/sendFriendRequest
//@access					PROTECTED
const sendFriendRequest = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$push: { waitingAcceptedFriends: req.body.userId },
		},
		{ new: true }
	);
	await User.findByIdAndUpdate(req.body.userId, {
		$push: { waitingRequestFriends: req.user._id },
	});
	res.status(200).json({
		user,
	});
});

//@description		Send friend request to a user
//@route					PATCH /api/users/cancelFriendRequest
//@access					PROTECTED
const cancelFriendRequest = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: { waitingAcceptedFriends: req.body.userId },
		},
		{ new: true }
	);
	await User.findByIdAndUpdate(req.body.userId, {
		$pull: { waitingRequestFriends: req.user._id },
	});
	res.status(200).json({
		user,
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
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: { waitingRequestFriends: req.body.userId },
		},
		{ new: true }
	);

	res.status(200).json({
		user,
		message: "Both of you became friends",
	});
});

//@description		Deny friend request of a user
//@route					PATCH /api/users/denyFriendRequest
//@access					PROTECTED
const denyFriendRequest = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: { waitingRequestFriends: req.body.userId },
		},
		{ new: true }
	);
	await User.findByIdAndUpdate(req.body.userId, {
		$pull: { waitingAcceptedFriends: req.user._id },
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
	getUserDetailById,
	getAllNewUsersRegistedToday,
	getCurrentUserDetail,
	updateCurrentUserDetail,
	updateUserDetail,
	getAllFriends,
	sendFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	denyFriendRequest,
	removeFriend,
};
