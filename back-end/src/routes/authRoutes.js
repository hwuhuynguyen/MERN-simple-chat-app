const express = require("express");

const {
	signup,
	login,
	logout,
	updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/register").post(signup);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/updatePassword").patch(protect, updatePassword);

module.exports = router;
