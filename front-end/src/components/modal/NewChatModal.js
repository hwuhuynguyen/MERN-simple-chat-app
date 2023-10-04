import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useDisclosure,
	FormControl,
	Input,
	FormLabel,
	Box,
	FormHelperText,
} from "@chakra-ui/react";
import axios from "./../../utils/AxiosInstance";
import React, { useContext, useEffect, useState } from "react";
import UserListItem from "../user/UserListItem";
import Swal from "sweetalert2";
import UserBadgeItem from "../user/UserBadgeItem";
import "./../../assets/css/index.css";
import { AuthContext } from "./../../context/authContext";
import { ChatContext } from "../../context/chatContext";

function NewChatModal({ children, fetchAgain, setFetchAgain }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [chatName, setChatName] = useState("");
	const [friends, setFriends] = useState([]);
	const [searchResult, setSearchResult] = useState([]);
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [loading, setLoading] = useState(false);

	const { setSelectedChat } = useContext(ChatContext);
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

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

	useEffect(() => {
		retriveFriends();
	}, []);

	const handleSearchUsers = (keyword) => {
		if (!keyword) {
			setSearchResult(friends);
			return;
		}

		const result = searchFriends(keyword);
		setSearchResult(result);
	};

	const handleCreateNewChat = async (event) => {
		if (selectedFriends.length === 0) {
			Swal.fire({
				title: "Oops!",
				text: "Please choose friend(s) you want to start a chat.",
				icon: "warning",
				timer: 1500,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
			return;
		}
		setLoading(true);
		try {
			if (selectedFriends.length > 1) {
				const { data } = await axios.post(`/chats/createGroupChat`, {
					chatName,
					isGroupChat: true,
					users: selectedFriends,
					groupAdmin: user,
				});
				setSelectedChat(data);
				setFetchAgain(!fetchAgain);
				Swal.fire({
					title: "Success!",
					text: "Created a new group chat successfully",
					icon: "success",
					timer: 1500,
					confirmButtonColor: "#3182ce",
					customClass: {
						container: "custom-swal-modal",
					},
				});
			} else {
				const { data } = await axios.post(`/chats`, {
					userId: selectedFriends[0]._id,
				});
				setSelectedChat(data);
			}
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
		setSearchResult([]);
		setSelectedFriends([]);
		onClose();
	};

	const handleAddFriendsToGroup = (friend) => {
		if (selectedFriends.includes(friend)) {
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

		setSelectedFriends([...selectedFriends, friend]);
	};

	const handleRemoveFriendsFromGroup = (friend) => {
		let filterSelectedFriends = selectedFriends.filter((filter) => {
			return filter._id !== friend._id;
		});
		setSelectedFriends(filterSelectedFriends);
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign={"center"}>CREATE A NEW CHAT</ModalHeader>
					<ModalBody>
						<FormControl>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
								Chat name:
							</FormLabel>
							<Input
								placeholder="Chat name"
								mb={3}
								onChange={(e) => setChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
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
						<Box w="100%" d="flex" flexWrap="wrap">
							{selectedFriends.map((friend) => (
								<UserBadgeItem
									key={friend._id}
									user={friend}
									color={"blue"}
									onHandleClick={() => handleRemoveFriendsFromGroup(friend)}
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
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleCreateNewChat}
							isDisabled={loading}
						>
							{loading ? "Creating ..." : "Create"}
						</Button>
						<Button variant="ghost" onClick={onClose} isDisabled={loading}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default NewChatModal;
