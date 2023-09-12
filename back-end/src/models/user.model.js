const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
	{
		name: {
			type: "String",
			required: [true, "Please provide a name"],
			unique: true,
		},
		email: {
			type: "String",
			unique: true,
			required: [true, "Please provide a email address"],
			lơwercase: true,
			validate: [validator.isEmail, "Please provide a valid email"],
		},
		password: {
			type: "String",
			required: [true, "Please provide a password"],
			minlength: 6,
			select: false,
		},
		passwordConfirm: {
			type: "String",
			required: [true, "Please provide a password confirm"],
			//only works on CREATE and SAVE
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				message: "Password are not the same",
			},
		},
		phoneNumber: {
			type: "String",
			validate: {
				validator: function (phone) {
					var regex = "/^$|^d{10}$/";
					return !phone || !phone.trim().length || regex.test(phone);
				},
				message: "Please provide a valid phone number.",
			},
		},
		pic: {
			type: "String",
			default:
				"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
		},
		slug: { type: "String", unique: true },
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
		friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		waitingAcceptedFriends: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
		],
		waitingRequestFriends: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
		],
		passwordChangedAt: Date,
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimestamp;
	}
	// False means NOT changed
	return false;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
