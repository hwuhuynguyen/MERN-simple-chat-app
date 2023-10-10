import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { FiHome, FiUser, FiMessageCircle } from "react-icons/fi";
import NavItem from "./NavItem";

export default function Sidebar({ column }) {
	const navSize = "large";
	return (
		<Box
			display="flex"
			flexDir="column"
			alignItems="center"
			p={3}
			bg="white"
			w={{ xl: "15%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Flex flexDir="column" w="100%" alignItems={"center"} as="nav">
				<NavItem
					navSize={navSize}
					icon={FiHome}
					title="Dashboard"
					active={column === "Dashboard"}
					link={"/dashboard"}
				/>
				<NavItem
					navSize={navSize}
					icon={FiUser}
					title="Users"
					active={column === "Users"}
					link={"/users"}
				/>
				<NavItem
					navSize={navSize}
					icon={FiMessageCircle}
					title="Messengers"
					active={column === "Messengers"}
					link={"/messages"}
				/>
			</Flex>
		</Box>
	);
}
