import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef } from "react";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function Homepage() {
	// Step 1: Create Refs
	const tabsRef = useRef();
	const tabPanelsRef = useRef();

	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	useEffect(() => {
		console.log("User details: ", user);
		if (user) {
			navigate("/dashboard");
		}
	}, [user, navigate]);

	const handleSignupSuccess = () => {
		console.log("Signup success!");
		tabsRef.current.childNodes[0].childNodes[0].click();
	};

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
				<Tabs
					variant="soft-rounded"
					colorScheme="cyan"
					defaultIndex={0}
					ref={tabsRef}
				>
					<TabList mb="1em">
						<Tab w="50%">Login</Tab>
						<Tab w="50%">Sign Up</Tab>
					</TabList>
					<TabPanels ref={tabPanelsRef}>
						<TabPanel>
							<Login></Login>
						</TabPanel>
						<TabPanel>
							<Signup onSignupSuccess={handleSignupSuccess}></Signup>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
}

export default Homepage;
