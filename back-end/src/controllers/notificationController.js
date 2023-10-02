const Notification = require("../models/notificationModel");

const catchAsync = require("../utils/catchAsync");

//@description     Create new Notification
//@route           POST /api/notifications/
//@access          PROTECTED
const createNewNotification = catchAsync(async (req, res) => {
	const newNotification = await Notification.create({
		sender: req.user._id,
		receiver: req.body.receiver,
		type: req.body.type,
		content: req.body.content,
		isRead: req.body.isRead,
		chat: req.body.chat,
	});
	res.status(201).json({
		notification: newNotification,
	});
});

//@description     Get all unread notifications
//@route           GET /api/notifications/
//@access          PROTECTED
const getAllUnreadNotifications = catchAsync(async (req, res) => {
	const notifications = await Notification.find({
		receiver: req.user._id,
		isRead: false,
	})
		.populate("sender")
		.populate("chat");

	res.status(200).json({
		notifications: notifications,
	});
});

//@description     Read notifications
//@route           PATCH /api/notifications/
//@access          PROTECTED
const readNotifications = catchAsync(async (req, res) => {
	await Notification.updateMany(
		{ receiver: req.user._id, isRead: false },
		{ $set: { isRead: true } }
	);
	const notifications = await Notification.find({
		receiver: req.user._id,
		isRead: false,
	})
		.populate("sender")
		.populate("chat");
	console.log(notifications);
	res.status(200).json({ notifications });
});

module.exports = {
	createNewNotification,
	getAllUnreadNotifications,
	readNotifications,
};
