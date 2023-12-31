const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

//Document middleware: runs before .save() and .create()
chatSchema.pre("save", async function (next) {});

chatSchema.pre(/^find/, function (next) {
	this.populate({
		path: "users",
		select: "-password",
	});

	this.populate({
		path: "groupAdmin",
		select: "-password",
	});

	next();
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
