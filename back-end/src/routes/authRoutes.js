const express = require("express");

const {
	signup,
	login,
	logout,
	updatePassword,
	resetPassword,
} = require("../controllers/authController");
const {
	isAuthenticated,
	isAdmin,
	isUser,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/register").post(signup);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/update-password").patch(isAuthenticated, isUser, updatePassword);

router.route("/reset-password").patch(isAuthenticated, isAdmin, resetPassword);

module.exports = router;
