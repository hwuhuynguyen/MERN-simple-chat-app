// import third party libraries
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

// import functions and files
const connectDB = require("./config/database.config");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const globalErrorHandler = require("./middlewares/errorHandler");

// declare variables and constants
const PORT = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");

	// Request methods you wish to allow
	res.setHeader("Access-Control-Allow-Methods", "POST");

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

app.listen(PORT, console.log(`Server is listening on ${PORT}`.yellow.bold));

app.use(globalErrorHandler);
