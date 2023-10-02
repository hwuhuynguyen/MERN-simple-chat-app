import { MenuItem } from "@chakra-ui/react";
import React from "react";

function ProfileListItem({ text, icon }) {
	return (
		<MenuItem
			p={4}
			fontSize={"24px"}
			cursor="pointer"
			bg="#E8E8E8"
			_hover={{
				background: "#38B2AC",
				color: "white",
			}}
			w="100%"
			display="flex"
			alignItems="center"
			color="black"
			mb={2}
			borderRadius="lg"
		>
			<i className={icon} style={{ marginRight: "16px", width: "30px" }} />
			{text}
		</MenuItem>
	);
}

export default ProfileListItem;
