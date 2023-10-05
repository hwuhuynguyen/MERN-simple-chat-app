const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//@description     Get all Messages
//@route           GET /api/Messages/:chatId
//@access          PROTECTED
const allMessages = catchAsync(async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.chatId })
			.populate("sender", "name pic email")
			.populate("chat");
		res.json(messages);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

//@description     Get Message
//@route           GET /api/Message/detail/:messageId
//@access          PROTECTED
const getMessageById = catchAsync(async (req, res) => {
	try {
		let message = await Message.findById(req.params.messageId)
			.populate("sender", "name pic email")
			.populate("chat");
		message = await User.populate(message, {
			path: "chat.users",
			select: "name pic email",
		});
		res.status(200).json({ message });
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

//@description     Get all Messages (for admin only)
//@route           GET /api/Message
//@access          PROTECTED
const getAllMessagesForAdmin = catchAsync(async (req, res) => {
	try {
		const messages = await Message.find().sort({ createdAt: -1 });
		res.status(200).json({
			length: messages.length,
			messages,
		});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

//@description     Get all Messages (for admin only)
//@route           GET /api/Message
//@access          PROTECTED
const getAllNewSentMessagesForAdmin = catchAsync(async (req, res) => {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the current day.

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1); // Get the start of the next day.

		const messages = await Message.find({
			createdAt: {
				$gte: today,
				$lt: tomorrow,
			},
		});
		res.status(200).json({
			length: messages.length,
			messages,
		});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

//@description     Create New Message
//@route           POST /api/Messages/
//@access          PROTECTED
const sendMessage = catchAsync(async (req, res) => {
	const { content, type, mimeType, fileName, chatId } = req.body;

	if (!content || !chatId) {
		return res.status(400).json({
			message: "Invalid data passed into request",
		});
	}

	var newMessage = {
		sender: req.user._id,
		content: content,
		chat: chatId,
		type,
		mimeType,
		fileName,
	};

	try {
		var message = await Message.create(newMessage);
		message = await message.populate("sender", "name pic");
		message = await message.populate("chat");
		message = await User.populate(message, {
			path: "chat.users",
			select: "name pic email",
		});
		await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

		res.status(201).json(message);
	} catch (error) {
		res.status(400);
		throw new AppError(error.message);
	}
});

module.exports = {
	allMessages,
	getMessageById,
	sendMessage,
	getAllMessagesForAdmin,
	getAllNewSentMessagesForAdmin,
};
