import React, { useContext, useEffect } from "react";
import SideDrawer from "../components/shared/SideDrawer";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Text } from "@chakra-ui/react";

function ErrorPage() {
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	useEffect(() => {
		if (!user) navigate("/");
	});

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer user={user} />}
			<Box
				display="flex"
				alignItems="center"
				flexDir="column"
				p={3}
				bg="white"
				w={"98vw"}
				m={"1vh 1vw"}
				h={"88vh"}
				borderRadius="lg"
				borderWidth="1px"
			>
				<Text fontSize="5xl">404 ERROR</Text>
				<Text fontSize="4xl">Page not found</Text>
				<Link to="/chats">
					<Button>Back to your homepage!</Button>
				</Link>
			</Box>
		</div>
	);
}

export default ErrorPage;
