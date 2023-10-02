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

//@description     Fetch chat by ID for a user
//@route           GET /api/chats/:chatId
//@access          PROTECTED
const fetchChatById = catchAsync(async (req, res) => {
	const chatId = req.params.chatId || undefined;
	console.log(chatId);
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } }, _id: chatId })
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

//@description		Update group chat - used only by admin
//@route					PATCH /api/chats/updateGroupChat
//@access					PROTECTED
const updateGroupChat = catchAsync(async (req, res, next) => {
	let { chatName, addedMembers, removedMembers } = req.body;
	addedMembers = addedMembers ? addedMembers : [];
	removedMembers = removedMembers ? removedMembers : [];

	const chat = res.locals.chat || {};
	chat.chatName = chatName || chat.chatName;
	chat.users.addToSet(...addedMembers);
	chat.users.pull(...removedMembers);
	await chat.save();

	res.status(200).json({
		message: "Updated group chat successfully",
		chat,
	});
});

module.exports = {
	accessChat,
	fetchChats,
	fetchChatById,
	createGroupChat,
	updateGroupChat,
};
