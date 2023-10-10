import {
	Box,
	Button,
	Tooltip,
	Text,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	Input,
	Spinner,
	useDisclosure,
	Divider,
	Popover,
	PopoverTrigger,
	Portal,
	PopoverContent,
	PopoverArrow,
	PopoverHeader,
	PopoverBody,
} from "@chakra-ui/react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { LOGOUT, UPDATE_USER } from "../../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/chatContext";
import UserListItem from "../user/UserListItem";
import axios from "./../../utils/AxiosInstance";
import ChatLoading from "./ChatLoading";
import MainNavigation from "./MainNavigation";

function SideDrawer({ user }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);

	const [friends, setFriends] = useState([]);
	const [friendsSearchResult, setFriendsSearchResult] = useState([]);
	const [othersSearchResult, setOthersSearchResult] = useState([]);

	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const currentUser = authCtx.user;
	const myId = currentUser._id;
	const { chats, setChats, setSelectedChat } = useContext(ChatContext);

	const logoutHandler = () => {
		authCtx.dispatch({ type: LOGOUT });
		setSelectedChat("");
		setChats([]);
		localStorage.removeItem("jwt");
		localStorage.removeItem("user");
		Swal.fire({
			title: "Success!",
			text: "Logged out of your account successfully!",
			icon: "success",
			timer: 2000,
		});
		navigate("/");
	};

	const handleSearch = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`/users?search=${search}`);

			setSearchResult(data.users);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);

			const { data } = await axios.post(`/chats`, { userId });

			navigate("/chats");
			if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			console.log(error);
		}
	};

	const retriveFriends = async () => {
		try {
			const { data } = await axios.get(`/users/friends`);

			setFriends(data.users || []);
		} catch (error) {
			console.log(error);
		}
	};

	const filterFriends = (users, friends) => {
		const matchingFriends = friends.filter((friend) => {
			return users.some((user) => user._id === friend._id);
		});
		return matchingFriends;
	};

	const filterOthers = (users, friends) => {
		if (friends.length === 0) return users.filter((user) => user._id !== myId);
		const arrayOfIds = friends.map((obj) => obj._id);
		const matchingOthers = users.filter(
			(user) => !arrayOfIds.includes(user._id) && myId !== user._id
		);
		return matchingOthers;
	};

	const handleSendFriendRequest = async (userId) => {
		try {
			const { data } = await axios.patch(`/users/send-friend-request`, {
				userId,
			});

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			Swal.fire({
				title: "Sent friend request successfully!",
				text: "You've sent friend request to this user successfully.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {
			Swal.fire({
				title: "Sent friend request failed!",
				text: `${error.response.data.message}`,
				icon: "error",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
			console.log(error);
		}
	};

	const handleCancelFriendRequest = async (userId) => {
		try {
			const { data } = await axios.patch(`/users/cancel-friend-request`, {
				userId,
			});

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			Swal.fire({
				title: "Cancelled friend request successfully!",
				text: "You've cancelled friend request to this user successfully.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {
			Swal.fire({
				title: "Cancelled friend request failed!",
				text: `${error.response.data.message}`,
				icon: "error",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
			console.log(error);
		}
	};

	const handleAcceptFriendRequest = async (userId) => {
		try {
			const { data } = await axios.patch(`/users/accept-friend-request`, {
				userId,
			});

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			Swal.fire({
				title: "Accepted friend request!",
				text: "You've became friend with this user.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleDenyFriendRequest = async (userId) => {
		try {
			const { data } = await axios.patch(`/users/deny-friend-request`, {
				userId,
			});

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			Swal.fire({
				title: "Denied friend request!",
				text: "You've denied friend request with this user.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		retriveFriends();
	}, [currentUser]);

	useEffect(() => {
		// filter search results
		const friendResult = filterFriends(searchResult, friends);
		setFriendsSearchResult(friendResult);

		const othersResult = filterOthers(searchResult, friends);
		setOthersSearchResult(othersResult);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchResult, friends]);

	return (
		<Fragment>
			<MainNavigation
				user={user}
				onHandleOpen={onOpen}
				onLogoutHandler={logoutHandler}
			/>

			<Drawer placement="left" onClose={onClose} isOpen={isOpen} size={"sm"}>
				<DrawerOverlay zIndex={1} />
				<DrawerContent>
					<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
					<DrawerBody>
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch}>Search</Button>
						</Box>
						<Divider />
						{loading ? (
							<>
								<ChatLoading />
							</>
						) : (
							<>
								{friendsSearchResult.length > 0 && (
									<Text fontSize={"sm"} fontWeight={"bold"} p={"10px 0 0"}>
										Friends:
									</Text>
								)}
								{friendsSearchResult?.slice(0, 6).map((user) => (
									<UserListItem
										key={user._id}
										user={user}
										onHandleClick={() => accessChat(user._id)}
									/>
								))}

								<Divider />
								{othersSearchResult.length > 0 && (
									<Text fontSize={"sm"} fontWeight={"bold"} p={"10px 0 0"}>
										Other users:
									</Text>
								)}

								{othersSearchResult?.slice(0, 6).map((user) => (
									<Box key={user._id} display={"flex"} alignItems={"center"}>
										<UserListItem
											key={user._id}
											user={user}
											onHandleClick={() => accessChat(user._id)}
										/>
										{currentUser.waitingAcceptedFriends.includes(user._id) && (
											<Tooltip label="Sent request" placement="auto">
												<Button
													ml={2}
													mb={2}
													w={"58px"}
													h={"58px"}
													bg={"#e5f0ffc7"}
													onClick={() => handleCancelFriendRequest(user._id)}
												>
													<i
														className="fa-solid fa-user-xmark"
														style={{ fontSize: "24px" }}
													></i>
												</Button>
											</Tooltip>
										)}
										{currentUser.waitingRequestFriends.includes(user._id) && (
											<Popover placement="right">
												<PopoverTrigger>
													<Button
														ml={2}
														mb={2}
														w={"58px"}
														h={"58px"}
														bg={"#e5f0ffc7"}
													>
														<Tooltip label="Reply request" placement="auto">
															<i
																className="fa-solid fa-user-clock"
																style={{ fontSize: "24px" }}
															></i>
														</Tooltip>
													</Button>
												</PopoverTrigger>
												<Portal>
													<PopoverContent width="auto">
														<PopoverArrow />
														<PopoverHeader>
															Accept friend request?
														</PopoverHeader>
														<PopoverBody display={"flex"} gap={3}>
															<Button
																colorScheme="green"
																onClick={() =>
																	handleAcceptFriendRequest(user._id)
																}
															>
																Accept
															</Button>
															<Button
																colorScheme="red"
																onClick={() =>
																	handleDenyFriendRequest(user._id)
																}
															>
																Deny
															</Button>
														</PopoverBody>
													</PopoverContent>
												</Portal>
											</Popover>
										)}
										{!currentUser.waitingRequestFriends.includes(user._id) &&
											!currentUser.waitingAcceptedFriends.includes(
												user._id
											) && (
												<Tooltip label="Add friend" placement="auto">
													<Button
														ml={2}
														mb={2}
														w={"58px"}
														h={"58px"}
														bg={"#e5f0ffc7"}
														onClick={() => handleSendFriendRequest(user._id)}
													>
														<i
															className="fa-solid fa-user-plus"
															style={{ fontSize: "24px" }}
														></i>
													</Button>
												</Tooltip>
											)}
									</Box>
								))}
							</>
						)}
						{loadingChat && <Spinner ml="auto" d="flex" />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Fragment>
	);
}

export default SideDrawer;
