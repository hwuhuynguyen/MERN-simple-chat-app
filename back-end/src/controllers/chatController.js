const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//@description     Create or fetch One to One Chat
//@route           POST /api/chats/
//@access          PROTECTED
const accessChat = catchAsync(async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		console.log("UserId param not sent with request");
		return res.status(400).json({
			message: "UserId not sent with request",
		});
	}

	var isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		],
	})
		.populate("users", "-password")
		.populate("latestMessage");

	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		select: "name pic email",
	});

	if (isChat.length > 0) {
		res.status(200).json(isChat[0]);
	} else {
		var chatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};

		try {
			const createdChat = await Chat.create(chatData);
			const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
				"users",
				"-password"
			);
			res.status(200).json(FullChat);
		} catch (error) {
			res.status(400);
			throw new AppError(error.message);
		}
	}
});

//@description     Fetch all chats for a user
//@route           GET /api/chats/
//@access          PROTECTED
const fetchChats = catchAsync(async (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "name pic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new AppError(error.message);
	}
});

//@description     Create New Group Chat
//@route           POST /api/chats/group
//@access          PROTECTED
const createGroupChat = catchAsync(async (req, res) => {
	if (!req.body.users || !req.body.chatName) {
		return res.status(400).send({ message: "Please Fill all the feilds" });
	}

	var users = req.body.users;

	if (users.length < 2) {
		return res
			.status(400)
			.send("More than 2 users are required to form a group chat");
	}

	users.push(req.user);

	try {
		const groupChat = await Chat.create({
			chatName: req.body.chatName,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user,
		});

		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		res.status(200).json(fullGroupChat);
	} catch (error) {
		res.status(400);
		throw new AppError(error.message);
	}
});

//@description		Rename Group
//@route   				PUT /api/chats/rename
//@access  				PROTECTED
const renameGroup = catchAsync(async (req, res) => {
	const { chatId, chatName } = req.body;

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{
			chatName: chatName,
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updatedChat) {
		res.status(404);
		throw new AppError("Chat Not Found");
	} else {
		res.json(updatedChat);
	}
});

//@description    Remove user from Group
//@route   				PUT /api/chats/groupremove
//@access  				PROTECTED
const removeFromGroup = catchAsync(async (req, res) => {
	const { chatId, userId } = req.body;

	// check if the requester is admin

	const removed = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!removed) {
		res.status(404);
		throw new AppError("Chat Not Found");
	} else {
		res.json(removed);
	}
});

//@description    Add user to Group / Leave
//@route   				PUT /api/chats/groupadd
//@access  				PROTECTED
const addToGroup = catchAsync(async (req, res) => {
	const { chatId, userId } = req.body;

	// check if the requester is admin

	const added = await Chat.findByIdAndUpdate(
		chatId,
		{
			$push: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!added) {
		res.status(404);
		throw new AppError("Chat Not Found");
	} else {
		res.json(added);
	}
});

module.exports = {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
};