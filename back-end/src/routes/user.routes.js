const express = require("express");

const { getAllUsers } = require("../controllers/user.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getAllUsers);

module.exports = router;
