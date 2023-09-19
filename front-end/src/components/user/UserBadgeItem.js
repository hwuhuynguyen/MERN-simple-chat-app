import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import React from "react";

function UserBadgeItem({ user, onHandleClick, color }) {
	return (
		<Badge
			px={2}
			py={1}
			borderRadius="lg"
			m={1}
			mb={2}
			variant="solid"
			fontSize={12}
			colorScheme={color}
			cursor="pointer"
		>
			{user.name}
			{/* {admin === user._id && <span> (Admin)</span>} */}
			<CloseIcon onClick={onHandleClick} ml={"10px"} pb={"2px"} />
		</Badge>
	);
}

export default UserBadgeItem;
