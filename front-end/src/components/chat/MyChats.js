import { Box, Button, Stack, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "./../../utils/AxiosInstance";
import { getSenderName } from "../../utils/ChatHelper";
import { ChatContext } from "../../context/chatContext";
import { AddIcon } from "@chakra-ui/icons";
import NewChatModal from "../modal/NewChatModal";
import ChatLoading from "../shared/ChatLoading";

function MyChats({ fetchAgain, setFetchAgain }) {
	const {
		selectedChat,
		setSelectedChat,
		chats,
		setChats,
		notifications,
		setNotifications,
	} = useContext(ChatContext);
	const [loggedUser, setLoggedUser] = useState();
	const [loading, setLoading] = useState(false);

	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const fetchAllChats = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`/chats`);
			const chats = response.data;
			setChats(chats);
			console.log("Selected chat: ", selectedChat);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	// eslint-disable-next-line no-unused-vars
	const retriveChat = async () => {
		if (!selectedChat) return;

		setLoading(true);

		const { data } = await axios.get(`/chats/${selectedChat._id}`);
		setLoading(false);
		setSelectedChat(data[0]);
	};

	const readNotifications = async (chatId) => {
		try {
			const { data } = await axios.patch(`/notifications`, {
				chatId,
			});

			setNotifications(data.notifications);
		} catch (error) {
			console.log(error);
		}
	};

	const checkUnreadMessages = (chatId) => {
		for (const notification of notifications) {
			if (notification.chat._id === chatId) {
				return true;
			}
		}
		return false;
	};

	useEffect(() => {
		fetchAllChats();
		// retriveChat();
		setLoggedUser(user);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box
			display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg="white"
			w={{ base: "100%", md: "30%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "28px", md: "30px" }}
				display="flex"
				w="100%"
				justifyContent="space-between"
				alignItems="center"
			>
				Recent chats
				<NewChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
					<Button display="flex" rightIcon={<AddIcon />}>
						New
					</Button>
				</NewChatModal>
			</Box>

			<Box
				display="flex"
				flexDir="column"
				p={3}
				bg="#F8F8F8"
				w="100%"
				h="100%"
				borderRadius="lg"
				overflowY="hidden"
			>
				{loading ? (
					<ChatLoading />
				) : (
					<Stack overflowY="scroll">
						{chats &&
							chats.map((chat) => (
								<Box
									key={chat._id}
									cursor="pointer"
									bg={selectedChat?._id === chat._id ? "#16A9CF" : "#E8E8E8"}
									color={selectedChat?._id === chat._id ? "white" : "black"}
									px={3}
									py={2}
									borderRadius="lg"
									onClick={() => {
										readNotifications(chat._id);
										setSelectedChat(chat);
										// setNotifications(
										// 	notifications.filter((n) => n.chat._id !== chat._id)
										// );
									}}
									display={"flex"}
								>
									<Box width={"98%"}>
										<Text>
											{chat.isGroupChat
												? chat.chatName
												: getSenderName(loggedUser, chat.users)}
										</Text>
										{chat.latestMessage ? (
											<Text fontSize="xs">
												<b>
													{chat.latestMessage.sender.name === loggedUser?.name
														? "You"
														: chat.latestMessage.sender.name}{" "}
													:{" "}
												</b>
												{chat.latestMessage.content.length > 50
													? chat.latestMessage.content.substring(0, 51) + "..."
													: chat.latestMessage.content}
											</Text>
										) : (
											<Text fontSize="xs"></Text>
										)}
									</Box>
									<Box display={"flex"} alignItems={"center"}>
										<div
											style={{
												display: checkUnreadMessages(chat._id)
													? "block"
													: "none",
												width: "10px",
												height: "10px",
												backgroundColor: "#16A9CF",
												borderRadius: "50%",
											}}
										></div>
									</Box>
								</Box>
							))}
					</Stack>
				)}
			</Box>
		</Box>
	);
}

export default MyChats;
