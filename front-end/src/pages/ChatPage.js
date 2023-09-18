import React, { useContext, useEffect, useState } from "react";
import SideDrawer from "../components/shared/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../components/chat/MyChats";
import Chatbox from "../components/chat/Chatbox";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function ChatPage() {
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;
	const [fetchAgain, setFetchAgain] = useState(false);

	useEffect(() => {
		if (!user) navigate("/");
	});

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer user={user} />}
			<Box
				display="flex"
				justifyContent="space-between"
				w="98vw"
				h="88vh"
				m="1vh 1vw"
				flexDirection={"row"}
			>
				{user && (
					<MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
				{user && (
					<Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
}

export default ChatPage;
