// import third party libraries
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const { createServer } = require("http");

// import functions and files
const connectDB = require("./config/databaseConfig");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const globalErrorHandler = require("./middlewares/errorHandler");
const { Server } = require("socket.io");

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
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.listen(PORT, console.log(`Server is listening on ${PORT}`.yellow.bold));

app.use(globalErrorHandler);

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "*",
		credentials: true,
	},
});

httpServer.listen(PORT, () => {
	console.log(`Server is listening on ${PORT}`.yellow.bold);
});

io.on("connection", (socket) => {
	console.log("Connected to socket.io");

	socket.on("setup", (userData) => {
		console.log(userData);
		socket.join(userData._id);
		socket.emit("connected");
	});

	socket.on("JOIN_ROOM", (chatId) => {
		console.log("User joined chat: ", chatId);
		socket.join(chatId);
	});

	socket.on("NEW_MESSAGE", (message) => {
		console.log("New message: ", message);

		socket.to(message.chat._id).emit("RECEIVE_MESSAGE", message);
	});
});
