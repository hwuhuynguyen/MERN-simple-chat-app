import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";

function UserProfileModal({ user }) {
	return (
		<Box>
			<Image
				borderRadius="full"
				boxSize="150px"
				src={user.pic}
				alt={user.name}
				pb={3}
				m={"auto"}
			/>

			<Text fontSize={"20px"} p={"10px 0"}>
				<span style={{ "margin-right": "100px" }}>Name: </span>
				{user.name}
			</Text>
			<Text fontSize={"20px"} p={"10px 0"}>
				<span style={{ "margin-right": "100px" }}>Email: </span>
				{user.email}
			</Text>
			<Text fontSize={"20px"} p={"10px 0"}>
				<span style={{ "margin-right": "25px" }}>Phone number:</span>
				{user.phoneNumber || "..."}
			</Text>
		</Box>
	);
}

export default UserProfileModal;
