import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/chatContext";
import {
	Box,
	Button,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	Textarea,
	Tooltip,
} from "@chakra-ui/react";
import { AuthContext } from "../../context/authContext";
import { getSender, getSenderName } from "../../utils/ChatHelper";
import axios from "./../../utils/AxiosInstance";
import {
	JOIN_ROOM,
	NEW_MESSAGE,
	RECEIVE_IMAGE,
	RECEIVE_MESSAGE,
	ROOT_URL,
	SEND_IMAGE,
} from "../../constants";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import { ArrowBackIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import UpdateChatModal from "../modal/UpdateChatModal";
import { v4 as uuidv4 } from "uuid";

var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
	const { selectedChat, setSelectedChat, notifications, setNotifications } =
		useContext(ChatContext);
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState();

	useEffect(() => {
		socket = io(ROOT_URL);
		socket.emit("setup", user);
		console.log("Setup socket");
		console.log(selectedChatCompare);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchAllMessages = async () => {
		if (!selectedChat) return;

		setLoading(true);
		const { data } = await axios.get(`/messages/${selectedChat._id}`);
		setLoading(false);
		setMessages(data);
		socket.emit(JOIN_ROOM, selectedChat._id);
	};

	const sendFile = () => {
		const reader = new FileReader();

		const uniqueFilename = uuidv4();

		reader.onload = async () => {
			const filePath = `uploads/images/chat/${uniqueFilename}`;
			const base64String = reader.result;

			const extension = base64String.substring(
				base64String.indexOf("/") + 1,
				base64String.indexOf(";")
			);
			const message = {
				chat: selectedChat,
				type: "file",
				mimeType: file.type,
				fileName: uniqueFilename,
				createdAt: new Date().toISOString(),
				sender: user,
				_id: Date.now() + "",
				content: `/${filePath}.${extension}`,
			};

			setMessages([...messages, message]);

			socket.emit(SEND_IMAGE, { message, image: reader.result });

			await axios.post(`/messages`, {
				content: `/${filePath}.${extension}`,
				type: "file",
				mimeType: file.type,
				fileName: uniqueFilename,
				chatId: selectedChat._id,
			});
		};

		setNewMessage("");
		setFile();
		reader.readAsDataURL(file);
	};

	const sendMessage = async (event) => {
		if (
			(event.key === "Enter" || event.type === "click") &&
			newMessage &&
			newMessage.trim().length > 0
		) {
			try {
				if (file) {
					sendFile();
					return;
				}

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
				console.log(selectedChat);

				// ----------------------------------------------------------------
				// SEND NOTIFICATION

				selectedChat.users.forEach(async (chatUser) => {
					const content = selectedChat.isGroupChat
						? `New message in '${selectedChat.chatName}' group`
						: `New message from ${user.name}`;
					if (user._id === chatUser._id) return;
					await axios.post(`/notifications`, {
						sender: user._id,
						receiver: chatUser._id,
						type: "message",
						content,
						chat: selectedChat,
					});
				});

				// ----------------------------------------------------------------
				// in the comment code, we need to wait for the reponse from the server before emitting the new message
				setNewMessage("");

				await axios.post(`/messages`, {
					content: newMessage,
					chatId: selectedChat._id,
				});

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

	const selectFile = (e) => {
		setNewMessage(e.target.files[0]?.name);
		setFile(e.target.files[0]);
	};

	useEffect(() => {
		fetchAllMessages();
		selectedChatCompare = selectedChat;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat]);

	useEffect(() => {
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

		socket.on(RECEIVE_IMAGE, (data) => {
			const receivedImage = new Image();
			receivedImage.src = data.message.content;
			const message = data.message;
			message.content = data.message.content;

			if (
				!selectedChatCompare ||
				data.message.chat._id !== selectedChatCompare._id
			) {
				if (!notifications.includes(data.message)) {
					setNotifications([data.message, ...notifications]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, message]);
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
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>{getSenderName(user, selectedChat.users)}</>
						) : (
							<>{selectedChat.chatName.toUpperCase()}</>
						)}
						<UpdateChatModal
							currentUser={getSender(user, selectedChat.users)}
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
							<Textarea
								h={"40px"}
								minH={"40px"}
								lineHeight={"initial"}
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message.."
								value={newMessage}
								onChange={handleTypeMessage}
							/>
							<Input
								display="none"
								type="file"
								id="file-selected"
								onChange={selectFile}
							/>
							<Tooltip label="Attach file">
								<Button>
									<label htmlFor="file-selected">
										<i
											className="fa-solid fa-paperclip"
											style={{ cursor: "pointer" }}
										></i>
									</label>
								</Button>
							</Tooltip>
							<Tooltip label="Send message">
								<Button bg={"rgb(190, 227, 248)"} onClick={sendMessage}>
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
