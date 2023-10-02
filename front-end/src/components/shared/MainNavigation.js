import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChatContext } from "../../context/chatContext";
import { getSenderName } from "../../utils/ChatHelper";
import axios from "axios";
import { ROOT_URL } from "../../constants";

function MainNavigation({ user, onHandleOpen, onLogoutHandler }) {
	const { setSelectedChat, notifications, setNotifications } =
		useContext(ChatContext);

	const retrieveNotifications = async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			const config = {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			};

			const { data } = await axios.get(`${ROOT_URL}/api/notifications`, config);
			console.log(data.notifications);
			setNotifications(data.notifications);
		} catch (error) {
			console.log(error);
		}
	};

	const readNotifications = async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			const config = {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			};

			const { data } = await axios.patch(
				`${ROOT_URL}/api/notifications`,
				{},
				config
			);
			console.log(data.notifications);
			setNotifications(data.notifications);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		retrieveNotifications();
	}, []);

	return (
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
				<Button onClick={onHandleOpen}>
					<i className="fa-solid fa-magnifying-glass"></i>
					<Text px={3}>Search users</Text>
				</Button>
			</Tooltip>

			<Text fontSize={"4xl"}>SIMPLE CHAT APPLICATION</Text>
			<div className="d-flex align-items-center" style={{ display: "flex" }}>
				<Menu>
					{/* <Tooltip label="Chats" p={"10px"}>
						<Link to={"/chats"}>
							<MenuButton p={"12px"}>
								<ChatIcon />
							</MenuButton>
						</Link>
					</Tooltip> */}
					<Tooltip label="Notifications">
						<MenuButton p={1}>
							<BellIcon fontSize="2xl" m={1}></BellIcon>
						</MenuButton>
					</Tooltip>
					<span
						style={{
							display: "flex",
							width: "20px",
							height: "20px",
							backgroundColor: "red",
							color: "white",
							position: "relative",
							left: "-20px",
							borderRadius: "10px",
							justifyContent: "center",
							fontSize: "13px",
						}}
					>
						{notifications.length}
					</span>

					<MenuList pl={2}>
						{!notifications.length && "No new messages"}
						{notifications.map((notif) => (
							<MenuItem
								key={notif._id}
								onClick={() => {
									readNotifications();
									setSelectedChat(notif.chat);
									setNotifications(
										notifications.filter((n) => n._id !== notif._id)
									);
								}}
							>
								{notif.content}
								{/* {notif.chat.isGroupChat
									? `New message in ${notif.chat.chatName}`
									: `New message from ${getSenderName(user, notif.chat.users)}`} */}
							</MenuItem>
						))}
					</MenuList>
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
							<Link to={"/chats"}>
								<MenuItem>Messengers</MenuItem>
							</Link>
							<MenuItem onClick={onLogoutHandler}>Log out</MenuItem>
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
	);
}

export default MainNavigation;
