import { ChevronDownIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Text,
	Menu,
	MenuButton,
	Avatar,
	MenuList,
	MenuItem,
	MenuDivider,
	MenuGroup,
} from "@chakra-ui/react";
import React from "react";
import UserProfileModal from "../modal/UserProfileModal";

function MainNavigation({ user, onLogoutHandler }) {
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
			<Text fontSize={"4xl"} textAlign={"center"} m={"auto"}>
				SIMPLE CHAT DASHBOARD
			</Text>
			<div className="d-flex align-items-center" style={{ display: "flex" }}>
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
							<UserProfileModal user={user}>
								<MenuItem>My profile</MenuItem>
							</UserProfileModal>
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
