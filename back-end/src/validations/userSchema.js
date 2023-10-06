const Joi = require("joi");

const userSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	passwordConfirm: Joi.string().valid(Joi.ref("password")).required(),
	phoneNumber: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.allow(""),
	pic: Joi.string().uri(),
	slug: Joi.string(),
	isAdmin: Joi.boolean(),
	friends: Joi.array().items(Joi.string().hex().length(24)),
	waitingAcceptedFriends: Joi.array().items(Joi.string().hex().length(24)),
	waitingRequestFriends: Joi.array().items(Joi.string().hex().length(24)),
});

module.exports = userSchema;
