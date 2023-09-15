const express = require("express");

const { getAllUsers, getAllFriends } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getAllUsers);

router.route("/friends").get(protect, getAllFriends);

module.exports = router;
