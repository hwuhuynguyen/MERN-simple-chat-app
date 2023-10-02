const express = require("express");

const {
	signup,
	login,
	logout,
	updatePassword,
	resetPassword,
} = require("../controllers/authController");
const {
	protect,
	isAdmin,
	isNotAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/register").post(signup);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/updatePassword").patch(protect, isNotAdmin, updatePassword);

router.route("/resetPassword").patch(protect, isAdmin, resetPassword);

module.exports = router;
