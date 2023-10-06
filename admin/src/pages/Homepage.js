import { Box, Container, Text } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import Login from "../components/auth/Login";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function Homepage() {
	// Step 1: Create Refs

	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	useEffect(() => {
		console.log("User details: ", user);
		if (user) {
			navigate("/dashboard");
		}
	}, [user, navigate]);

	return (
		<Container maxW="2xl" centerContent>
			<Box
				display="flex"
				justifyContent="center"
				p={3}
				bg={"white"}
				w="100%"
				m="40px 0 15px 0"
				borderRadius="lg"
				borderWidth="1px"
			>
				<Text fontSize="4xl">SIMPLE CHAT DASHBOARD</Text>
			</Box>
			<Box p={4} bg={"white"} w="100%" borderRadius="lg" borderWidth="1px">
				<Login></Login>
			</Box>
		</Container>
	);
}

export default Homepage;
