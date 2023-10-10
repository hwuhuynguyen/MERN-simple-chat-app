import {
	Box,
	Button,
	Divider,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import UserListItem from "../user/UserListItem";
import { AuthContext } from "../../context/authContext";
import axios from "./../../utils/AxiosInstance";
import {} from "../../constants";
import UserBadgeItem from "../user/UserBadgeItem";
import Swal from "sweetalert2";
import UserProfileModal from "./UserProfileModal";
import { ChatContext } from "../../context/chatContext";

function UpdateChatModal({
	children,
	selectedChat,
	currentUser,
	fetchAgain,
	setFetchAgain,
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [chatName, setChatName] = useState(selectedChat.chatName);
	const [groupAdmin, setGroupAdmin] = useState(selectedChat.groupAdmin);
	const [members, setMembers] = useState(selectedChat.users);
	const [friends, setFriends] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [selectedAddedFriends, setSelectedAddedFriends] = useState([]);
	const [selectedRemovedFriends, setSelectedRemovedFriends] = useState([]);
	const [loading, setLoading] = useState(false);

	const [isAdmin, setIsAdmin] = useState(false);

	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const { setSelectedChat } = useContext(ChatContext);

	useEffect(() => {
		retriveFriends();
	}, []);

	useEffect(() => {
		if (selectedChat.isGroupChat && user._id === selectedChat.groupAdmin._id) {
			setIsAdmin(true);
		} else {
			setIsAdmin(false);
		}
	}, [selectedChat, user]);

	useEffect(() => {
		setChatName(selectedChat.chatName);
		setMembers(selectedChat.users);
		setGroupAdmin(selectedChat.groupAdmin);
		setSelectedAddedFriends([]);
		setSelectedRemovedFriends([]);
	}, [selectedChat]);

	const retriveChat = async () => {
		if (!selectedChat) return;

		setLoading(true);

		const { data } = await axios.get(`/chats/${selectedChat._id}`);
		console.log(data[0]);
		setLoading(false);
		setSelectedChat(data[0]);
	};

	const filterAdmin = (members) => {
		return members.filter((friend) => friend._id !== groupAdmin?._id);
	};

	const handleViewDetailOfUser = (user) => {
		Swal.fire({
			title: "USER INFORMATION",
			html: `<div style="text-align: left">
			<p style="padding: 10px"><span style="font-weight: bold; padding-right: 100px">Name:</span> ${
				user.name
			}</p>
			<p style="padding: 10px"><span style="font-weight: bold; padding-right: 100px">Email:</span> ${
				user.email
			}</p>
			<p style="padding: 10px"><span style="font-weight: bold; padding-right: 24px">Phone number:</span> ${
				user.phoneNumber || "..."
			}</p>
			</div>`,
			confirmButtonColor: "#3182ce",
			customClass: {
				container: "custom-swal-modal",
			},
		});
	};

	const retriveFriends = async () => {
		try {
			const response = await axios.get(`/users/friends`);
			setFriends(response.data.users);
			setSearchResult(response.data.users);
		} catch (error) {
			console.log(error);
		}
	};

	const searchFriends = (keyword) => {
		keyword = keyword.toLowerCase();
		const result = friends.filter((user) => {
			return (
				user.name?.toLowerCase().includes(keyword) ||
				user.email?.toLowerCase().includes(keyword) ||
				user.phoneNumber?.toLowerCase().includes(keyword)
			);
		});
		return result;
	};

	const handleSearchUsers = (keyword) => {
		if (!keyword) {
			setSearchResult(friends);
			return;
		}

		const result = searchFriends(keyword);
		setSearchResult(result);
	};

	const handleAddFriendsToGroup = (friend) => {
		const foundElement = members.find((element) => element._id === friend._id);
		if (selectedAddedFriends.includes(friend) || foundElement) {
			Swal.fire({
				title: "Oops!",
				text: "User already added to this group chat.",
				icon: "warning",
				timer: 1500,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
			return;
		}

		setSelectedAddedFriends([...selectedAddedFriends, friend]);
	};

	const handleRemoveFriendsFromSelectedList = (friend) => {
		let filterSelectedAddedFriends = selectedAddedFriends.filter((filter) => {
			return filter._id !== friend._id;
		});
		setSelectedAddedFriends(filterSelectedAddedFriends);
	};

	const handleRemoveUserFromGroup = (member) => {
		if (selectedRemovedFriends.includes(member)) {
			Swal.fire({
				title: "Oops!",
				text: "User already added to this removed list.",
				icon: "warning",
				timer: 1500,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
			return;
		}
		setSelectedRemovedFriends([...selectedRemovedFriends, member]);
	};

	const handleRemoveFriendsFromRemovedList = (member) => {
		let filterSelectedRemovedFriends = selectedRemovedFriends.filter(
			(filter) => {
				return filter._id !== member._id;
			}
		);
		setSelectedRemovedFriends(filterSelectedRemovedFriends);
	};

	const handleUpdateGroupChat = async () => {
		console.log(chatName);
		console.log(selectedAddedFriends);
		console.log(selectedRemovedFriends);
		setLoading(true);
		try {
			await axios.patch(`/chats/update-group-chat`, {
				chatId: selectedChat._id,
				chatName,
				addedMembers: selectedAddedFriends,
				removedMembers: selectedRemovedFriends,
			});
			onClose();
			// setFetchAgain(!fetchAgain);
			retriveChat();
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal size={isAdmin ? "5xl" : "xl"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign={"center"}>CHAT INFORMATION</ModalHeader>
					<ModalBody>
						{selectedChat.isGroupChat ? (
							<>
								<FormControl>
									<FormLabel fontSize={"sm"} fontWeight={"bold"}>
										Chat name:
									</FormLabel>
									<Input
										placeholder="Chat name"
										mb={3}
										value={chatName}
										onChange={(e) => setChatName(e.target.value)}
										isReadOnly={!isAdmin}
									/>
								</FormControl>
								<Divider />

								<Box display={"flex"} justifyContent={"space-between"}>
									{isAdmin && (
										<Box w={"45%"}>
											<FormControl isRequired>
												<FormLabel
													fontSize={"sm"}
													fontWeight={"bold"}
													p={"10px 0"}
												>
													User(s)
												</FormLabel>
												<Input
													placeholder="Add user(s) to group"
													onChange={(e) => handleSearchUsers(e.target.value)}
												/>
												<FormHelperText mb={3} pl={2}>
													Can only add friends to group chat
												</FormHelperText>
											</FormControl>
											<Divider />
											{selectedAddedFriends.length > 0 && (
												<Text
													fontSize={"sm"}
													fontWeight={"bold"}
													p={"10px 0 0"}
												>
													Added:
												</Text>
											)}
											<Box w="100%" d="flex" flexWrap="wrap" pb={2}>
												{selectedAddedFriends.map((friend) => (
													<UserBadgeItem
														key={friend._id}
														user={friend}
														color={"purple"}
														onHandleClick={() =>
															handleRemoveFriendsFromSelectedList(friend)
														}
													/>
												))}
											</Box>
											{searchResult?.slice(0, 4).map((friend) => (
												<UserListItem
													key={friend._id}
													user={friend}
													onHandleClick={() => handleAddFriendsToGroup(friend)}
												/>
											))}
										</Box>
									)}
									<Box w={isAdmin ? "50%" : "100%"}>
										<Text fontSize={"sm"} fontWeight={"bold"} p={"10px 0"}>
											Admin
										</Text>
										<UserListItem
											user={groupAdmin}
											onHandleClick={() => handleViewDetailOfUser(groupAdmin)}
										/>
										<Divider />
										<Text fontSize={"sm"} fontWeight={"bold"} p={"10px 0"}>
											Members
										</Text>
										{filterAdmin(members).map((member) => (
											<Box
												key={member._id}
												display={"flex"}
												alignItems={"center"}
											>
												<UserListItem
													key={member._id}
													user={member}
													onHandleClick={() => handleViewDetailOfUser(member)}
												/>
												{isAdmin && (
													<Button
														ml={2}
														mb={2}
														w={"58px"}
														h={"58px"}
														bg={"#ffe5e5c7"}
														onClick={() => handleRemoveUserFromGroup(member)}
													>
														<i
															className="fa-solid fa-xmark"
															style={{ fontSize: "36px", color: "#c9a2a2" }}
														></i>
													</Button>
												)}
											</Box>
										))}
										<Divider />
										{selectedRemovedFriends.length > 0 && (
											<Text fontSize={"sm"} fontWeight={"bold"} p={"10px 0"}>
												Removed:
											</Text>
										)}
										<Box w="100%" d="flex" flexWrap="wrap">
											{selectedRemovedFriends.map((friend) => (
												<UserBadgeItem
													key={friend._id}
													user={friend}
													color={"red"}
													onHandleClick={() =>
														handleRemoveFriendsFromRemovedList(friend)
													}
												/>
											))}
										</Box>
									</Box>
								</Box>
							</>
						) : (
							<>
								<UserProfileModal user={currentUser} />
							</>
						)}
					</ModalBody>

					<ModalFooter>
						{selectedChat.isGroupChat && isAdmin && (
							<Button
								colorScheme="blue"
								mr={3}
								onClick={handleUpdateGroupChat}
								isDisabled={loading}
							>
								{loading ? "Updating ..." : "Update"}
							</Button>
						)}
						<Button variant="ghost" onClick={onClose} isDisabled={loading}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default UpdateChatModal;
