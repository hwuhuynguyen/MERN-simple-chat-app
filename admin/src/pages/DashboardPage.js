import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import SideDrawer from "../components/shared/SideDrawer";
import { Box, SimpleGrid, Spinner } from "@chakra-ui/react";
import Sidebar from "../components/shared/Sidebar";
import StatCard from "../components/card/StatCard";
import axios from "./../utils/AxiosInstance";

function DashboardPage() {
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const [loading, setLoading] = useState(false);
	const [totalUsers, setTotalUsers] = useState(0);
	const [totalMessages, setTotalMessages] = useState(0);
	const [newUsers, setNewUsers] = useState(0);
	const [newMessages, setNewMessages] = useState(0);
	const [rateMessagePerUser, setRateMessagePerUser] = useState(0);

	const getTotalUsers = async () => {
		try {
			const { data } = await axios.get(`/users`);

			setTotalUsers(data.length);
		} catch (error) {
			console.log(error);
		}
	};

	const getTotalMessages = async () => {
		try {
			const { data } = await axios.get(`/messages`);

			setTotalMessages(data.length);
		} catch (error) {
			console.log(error);
		}
	};

	const getNewUsers = async () => {
		try {
			const { data } = await axios.get(`/users/new-registered-users`);

			setNewUsers(data.length);
		} catch (error) {
			console.log(error);
		}
	};

	const getNewMessages = async () => {
		try {
			const { data } = await axios.get(`/messages/new-sent-messages`);

			setNewMessages(data.length);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!user) navigate("/");
	});

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			const promises = [
				getTotalUsers(),
				getTotalMessages(),
				getNewUsers(),
				getNewMessages(),
			];

			await Promise.all(promises);

			setLoading(false);
		};

		fetchData();
	}, []);

	useEffect(() => {
		setRateMessagePerUser(totalMessages / totalUsers + "");
	}, [totalMessages, totalUsers]);

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer user={user} />}
			<Box
				display="flex"
				justifyContent="space-between"
				w="98vw"
				minH="88vh"
				m="1vh 1vw"
				flexDirection={"row"}
				gap={"10px"}
			>
				<Sidebar column={"Dashboard"} />
				<Box
					display="flex"
					alignItems="center"
					flexDir="column"
					p={3}
					bg="white"
					w={{ base: "inherit", xl: "84%" }}
					borderRadius="lg"
					borderWidth="1px"
					overflowX={"auto"}
				>
					{loading ? (
						<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
					) : (
						<SimpleGrid
							w={"100%"}
							spacing={4}
							templateColumns={{
								base: "repeat(1, 1fr)",
								sm: "repeat(2, 1fr)",
								md: "repeat(3, 1fr)",
								lg: "repeat(4, 1fr)",
								xl: "repeat(5, 1fr)",
							}}
						>
							<StatCard
								backgroundColor={"#ab5f5f"}
								textColor={"white"}
								heading={"Total Users"}
								label={"Users"}
								stats={totalUsers}
							/>

							<StatCard
								backgroundColor={"#5faaab"}
								textColor={"white"}
								heading={"Total Messages"}
								label={"Messengers"}
								stats={totalMessages}
							/>

							<StatCard
								backgroundColor={"#ab925f"}
								textColor={"white"}
								heading={"New Users"}
								label={"Registed today"}
								stats={newUsers}
							/>

							<StatCard
								backgroundColor={"#5f75ab"}
								textColor={"white"}
								heading={"New Messages"}
								label={"Sent today"}
								stats={newMessages}
							/>

							<StatCard
								backgroundColor={"#ab6f5f"}
								textColor={"white"}
								heading={"Messages rate per user"}
								label={"Messages sent/user"}
								stats={rateMessagePerUser}
							/>
						</SimpleGrid>
					)}
				</Box>
			</Box>
		</div>
	);
}

export default DashboardPage;
