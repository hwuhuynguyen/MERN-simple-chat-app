import { BellIcon, ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Tooltip,
	Text,
	Menu,
	MenuButton,
	Avatar,
	MenuList,
	MenuItem,
	MenuDivider,
	MenuGroup,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	Input,
	Spinner,
	useDisclosure,
	Divider,
	Stack,
	Skeleton,
	Popover,
	PopoverTrigger,
	Portal,
	PopoverContent,
	PopoverArrow,
	PopoverHeader,
	PopoverBody,
	useToast,
} from "@chakra-ui/react";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { LOGOUT, ROOT_URL } from "../../constants";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/chatContext";
import UserListItem from "../user/UserListItem";
import axios from "axios";

function SideDrawer({ user }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast({
		containerStyle: {
			zIndex: 2000,
		},
	});

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
			const jwt = localStorage.getItem("jwt");
			const config = {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			};

			const { data } = await axios.get(
				`${ROOT_URL}/api/users?search=${search}`,
				config
			);

			setSearchResult(data.users);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const jwt = localStorage.getItem("jwt");

			const config = {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			};
			const { data } = await axios.post(
				`${ROOT_URL}/api/chats`,
				{ userId },
				config
			);

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
			const jwt = localStorage.getItem("jwt");
			const config = {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			};

			const { data } = await axios.get(`${ROOT_URL}/api/users/friends`, config);

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
		const matchingOthers = users.filter((user) => {
			return friends.some(
				(friend) => user._id !== friend._id && myId !== user._id
			);
		});
		return matchingOthers;
	};

	const handleSendFriendRequest = async (userId) => {
		try {
			const jwt = localStorage.getItem("jwt");
			const config = {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			};

			const { data } = await axios.patch(
				`${ROOT_URL}/api/users/sendFriendRequest`,
				{
					userId,
				},
				config
			);
			console.log(data);
			toast({
				title: "Sent friend request successfully.",
				description: "You've sent friend request to this user successfully.",
				status: "success",
				duration: 5000,
				isClosable: true,
				containerStyle: {
					zIndex: 2000,
				},
			});
			Swal.fire({
				title: "Sent friend request failed!",
				text: "You've sent friend request to this user successfully.",
				icon: "error",
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

	const handleAcceptFriendRequest = async (userId) => {
		console.log(userId);
	};

	useEffect(() => {
		retriveFriends();
	}, []);

	useEffect(() => {
		// filter search results
		console.log(searchResult);
		const friendResult = filterFriends(searchResult, friends);
		setFriendsSearchResult(friendResult);

		const othersResult = filterOthers(searchResult, friends);
		setOthersSearchResult(othersResult);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchResult, friends]);

	return (
		<Fragment>
			<Box
				m={"1vh 1vw"}
				bg={"white"}
				w={"98vw"}
				p={"10px"}
				display="flex"
				flexDirection={"row"}
				justifyContent={"space-between"}
				alignItems={"center"}
				border={"5px solid white"}
				borderRadius={"10px"}
			>
				<Tooltip label="Search users">
					<Button onClick={onOpen}>
						<i className="fa-solid fa-magnifying-glass"></i>
						<Text px={3}>Search users</Text>
					</Button>
				</Tooltip>

				<Text fontSize={"4xl"}>SIMPLE CHAT APPLICATION</Text>
				<div style={{ gap: "10px" }} className="d-flex align-items-center">
					<Menu>
						<Tooltip label="Chats" p={"10px"}>
							<Link to={"/chats"}>
								<MenuButton p={"12px"}>
									<ChatIcon />
								</MenuButton>
							</Link>
						</Tooltip>
						<Tooltip label="Notifications">
							<MenuButton p={1}>
								<BellIcon fontSize="2xl" m={1} />
							</MenuButton>
						</Tooltip>
					</Menu>
					<Menu>
						<MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
							<Avatar size="sm" cursor="pointer" name={user.name} src={""} />
						</MenuButton>
						<MenuList>
							<Text ps={4} pt={1}>
								Hello, {user.name}!
							</Text>
							<MenuDivider />
							<MenuGroup title="Profile">
								<Link to={"/profile"}>
									<MenuItem>My profile</MenuItem>
								</Link>
								<MenuItem onClick={logoutHandler}>Log out</MenuItem>
							</MenuGroup>
							<MenuDivider />
							<MenuGroup title="Help">
								<MenuItem>Docs</MenuItem>
								<MenuItem>FAQs</MenuItem>
							</MenuGroup>
						</MenuList>
					</Menu>
				</div>
			</Box>

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
								<Stack>
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
													{/* <Tooltip label="Reply request" placement="auto" > */}
													<Button
														ml={2}
														mb={2}
														w={"58px"}
														h={"58px"}
														bg={"#e5f0ffc7"}
													>
														<i
															className="fa-solid fa-user-clock"
															style={{ fontSize: "24px" }}
														></i>
													</Button>
													{/* </Tooltip> */}
												</PopoverTrigger>
												<Portal>
													<PopoverContent width="auto">
														<PopoverArrow />
														<PopoverHeader>
															Accept friend request?
														</PopoverHeader>
														<PopoverBody display={"flex"} gap={3}>
															<Button colorScheme="green">Accept</Button>
															<Button colorScheme="red">Deny</Button>
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
