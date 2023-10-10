import React from "react";
import { Flex, Text, Icon, Menu, MenuButton } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function NavItem({ icon, title, active, navSize, link }) {
	return (
		<Flex
			mt={"10px"}
			flexDir="column"
			w="100%"
			alignItems={navSize === "small" ? "center" : "flex-start"}
		>
			<Menu placement="right">
				<NavLink
					to={link}
					style={({ isActive, isPending }) => {
						return {
							backgroundColor: isActive ? "#16A9CF" : "",
							color: isPending ? "white" : "black",
							width: "100%",
							padding: "16px",
							borderRadius: "8px",
						};
					}}
				>
					<MenuButton w="100%">
						<Flex>
							<Icon
								as={icon}
								fontSize="xl"
								color={active ? "#FFF" : "gray.500"}
							/>
							<Text
								mb={0}
								ml={5}
								display={{ base: "none", xl: "flex" }}
								color={active && "#FFF"}
								alignItems={"center"}
							>
								{title}
							</Text>
						</Flex>
					</MenuButton>
				</NavLink>
			</Menu>
		</Flex>
	);
}
