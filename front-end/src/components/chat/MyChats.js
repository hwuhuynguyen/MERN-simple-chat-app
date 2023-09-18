import { Box, Button, Skeleton, Stack, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { ROOT_URL } from "../../constants";
import { getSenderName } from "../../utils/ChatHelper";
import { ChatContext } from "../../context/chatContext";
import { AddIcon } from "@chakra-ui/icons";
import NewChatModal from "../modal/NewChatModal";

function MyChats({ fetchAgain, setFetchAgain }) {
	const { selectedChat, setSelectedChat, chats, setChats } =
		useContext(ChatContext);
	const [loggedUser, setLoggedUser] = useState();
	const [loading, setLoading] = useState(false);

	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const fetchAllChats = async () => {
		setLoading(true);
		try {
			const jwt = localStorage.getItem("jwt");
			const response = await axios.get(`${ROOT_URL}/api/chats`, {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			});
			const chats = response.data;
			setChats(chats);
			console.log(chats);
			console.log("Selected chat: ", selectedChat);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const retriveChat = async () => {
		if (!selectedChat) return;

		const jwt = localStorage.getItem("jwt");
		setLoading(true);

		const { data } = await axios.get(
			`${ROOT_URL}/api/chats/${selectedChat._id}`,
			{
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			}
		);
		console.log(data[0]);
		setLoading(false);
		setSelectedChat(data[0]);
	};

	useEffect(() => {
		fetchAllChats();
		retriveChat();
		setLoggedUser(user);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAgain]);

	return (
		<Box
			display="flex"
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
				{" "}
				{loading ? (
					<Stack overflowY="scroll">
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
						<Skeleton height="60px" />
					</Stack>
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
									onClick={() => setSelectedChat(chat)}
								>
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
							))}
					</Stack>
				)}
			</Box>
		</Box>
	);
}

export default MyChats;
