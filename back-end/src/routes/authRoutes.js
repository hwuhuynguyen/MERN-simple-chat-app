const express = require("express");

const { signup, login, logout } = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(signup);

router.route("/login").post(login);

router.route("/logout").get(logout);

module.exports = router;
