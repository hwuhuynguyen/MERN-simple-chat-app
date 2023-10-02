const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/userModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
	return jwt.sign({ id: id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
	res.cookie("jwt", token, cookieOptions);
	user.password = undefined;
	res.status(statusCode).json({
		token,
		data: {
			user,
		},
	});
};

const createUniqueSlug = (baseString) => {
	const uniqueId = uuidv4(); // Generate a unique UUID
	const slug = baseString.toLowerCase().replace(/ /g, "-") + "-" + uniqueId;
	return slug;
};

const signup = catchAsync(async (req, res, next) => {
	req.body.slug = createUniqueSlug(req.body.name);
	let newUser;
	try {
		newUser = await User.create(req.body);
	} catch (error) {
		let errorMessages;
		if (error.name === "ValidationError") {
			errorMessages = [];
			// Iterate over the validation errors and push the messages to the array
			for (const field in error.errors) {
				if (error.errors[field].name === "ValidatorError") {
					errorMessages.push(error.errors[field].message);
				}
			}
		} else if (error.code === 11000) {
			errorMessages = [];
			errorMessages.push(
				"Email is already registered. Please enter another email address"
			);
		} else {
			console.error(error);
		}
		return res.status(400).json({
			error,
			messages: errorMessages,
		});
	}
	createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new AppError("Please provide email and password", 400));
	}
	const user = await User.findOne({ email }).select("+password");

	if (!user || !(await user.correctPassword(password, user.password))) {
		return next(new AppError("Incorrect email or password", 401));
	}

	const token = signToken(user._id);
	user.password = undefined;
	res.status(200).json({
		token,
		data: {
			user: user,
		},
	});
});

const logout = catchAsync(async (req, res, next) => {
	res.clearCookie("jwt");
});

const updatePassword = catchAsync(async (req, res, next) => {
	// 1) Get user from collection
	const user = await User.findById(req.user._id).select("+password");

	// 2) Check if POSTed current password is correct
	if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
		return next(new AppError("Your current password is wrong.", 401));
	}

	// 3) If so, update password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	// 4) Log user in, send JWT
	createSendToken(user, 200, res);
});

const resetPassword = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.body.userId);

	user.password = "123456";
	user.passwordConfirm = "123456";
	await user.save();

	res.status(200).json({
		user: user,
	});
});

module.exports = { signup, login, logout, updatePassword, resetPassword };
