import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/chatContext";
import {
	Box,
	Button,
	FormControl,
	Input,
	Spinner,
	Text,
	Tooltip,
} from "@chakra-ui/react";
import { AuthContext } from "../../context/authContext";
import { getSenderName } from "../../utils/ChatHelper";
import axios from "axios";
import {
	JOIN_ROOM,
	NEW_MESSAGE,
	RECEIVE_MESSAGE,
	ROOT_URL,
} from "../../constants";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import UpdateChatModal from "../modal/UpdateChatModal";

var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
	const { selectedChat, notifications, setNotifications } =
		useContext(ChatContext);
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		socket = io(ROOT_URL);
		socket.emit("setup", user);
		console.log("Setup socket");
		console.log(selectedChatCompare);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchAllMessages = async () => {
		if (!selectedChat) return;

		const jwt = localStorage.getItem("jwt");
		setLoading(true);
		const { data } = await axios.get(
			`${ROOT_URL}/api/messages/${selectedChat._id}`,
			{
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			}
		);
		setLoading(false);
		setMessages(data);
		socket.emit(JOIN_ROOM, selectedChat._id);
	};

	const sendMessage = async (event) => {
		if ((event.key === "Enter" || event.type === "click") && newMessage) {
			console.log("SEND MESSAGE", event);
			try {
				// optimize performance when emitting messages and sending requests to server at the same time
				const message = {
					chat: selectedChat,
					content: newMessage,
					createdAt: new Date().toISOString(),
					sender: user,
					_id: Date.now() + "",
				};
				socket.emit(NEW_MESSAGE, message);
				// setFetchAgain(!fetchAgain);
				setMessages([...messages, message]);

				// in the comment code, we need to wait for the reponse from the server before emitting the new message
				const jwt = localStorage.getItem("jwt");
				setNewMessage("");
				await axios.post(
					`${ROOT_URL}/api/messages`,
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					{
						headers: {
							Authorization: `Bearer ${jwt}`,
						},
					}
				);
				// socket.emit(NEW_MESSAGE, data);
				// setFetchAgain(!fetchAgain);
				// setMessages([...messages, data]);
				// console.log(data);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleTypeMessage = (event) => {
		setNewMessage(event.target.value);
	};

	useEffect(() => {
		fetchAllMessages();
		selectedChatCompare = selectedChat;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat]);

	console.log(notifications);
	useEffect(() => {
		console.log("use effecting");
		socket.on(RECEIVE_MESSAGE, (newMessageReceived) => {
			if (
				!selectedChatCompare ||
				newMessageReceived.chat._id !== selectedChatCompare._id
			) {
				if (!notifications.includes(newMessageReceived)) {
					setNotifications([newMessageReceived, ...notifications]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageReceived]);
			}
		});
	});

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						fontFamily="Work sans"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						{!selectedChat.isGroupChat ? (
							<>{getSenderName(user, selectedChat.users)}</>
						) : (
							<>{selectedChat.chatName.toUpperCase()}</>
						)}
						<UpdateChatModal
							selectedChat={selectedChat}
							fetchAgain={fetchAgain}
							setFetchAgain={setFetchAgain}
						>
							<Tooltip label="Info">
								<Button borderRadius={"10%"}>
									<InfoOutlineIcon boxSize={6} />
								</Button>
							</Tooltip>
						</UpdateChatModal>
					</Text>

					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#E8E8E8"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{loading ? (
							<Spinner
								size="xl"
								w={20}
								h={20}
								alignSelf="center"
								margin="auto"
							/>
						) : (
							<div className="messages" style={{ display: "contents" }}>
								<ScrollableChat messages={messages} />
							</div>
						)}

						<FormControl
							onKeyDown={sendMessage}
							id="first-name"
							isRequired
							mt={3}
							display={"flex"}
							gap={"5px"}
						>
							<Input
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message.."
								value={newMessage}
								onChange={handleTypeMessage}
							/>
							<Tooltip label="Send message">
								<Button bg={"rgb(190, 227, 248)"}>
									<i className="fas fa-paper-plane"></i>
								</Button>
							</Tooltip>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					h="100%"
				>
					<Text fontSize="3xl" pb={3} fontFamily="Work sans">
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
}

export default SingleChat;
