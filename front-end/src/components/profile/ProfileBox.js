import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import UserCard from "../user/UserCard";

function ProfileBox({ user }) {
	const [friends, setFriends] = useState(user.friends || []);
	const [waitingAcceptedFriends, setWaitingAcceptedFriends] = useState(
		user.waitingAcceptedFriends || []
	);
	const [waitingRequestFriends, setWaitingRequestFriends] = useState(
		user.waitingRequestFriends || []
	);

	useEffect(() => {
		setFriends(user.friends);
		setWaitingAcceptedFriends(user.waitingAcceptedFriends);
		setWaitingRequestFriends(user.waitingRequestFriends);
	}, [user]);

	return (
		<Box
			display="flex"
			flexDir="column"
			p={3}
			bg="white"
			w={{ base: "100%", md: "69.5%" }}
			borderRadius="lg"
			borderWidth="1px"
			overflowY={"auto"}
		>
			<Tabs isFitted variant="soft-rounded" colorScheme="cyan" defaultIndex={0}>
				<TabList mb="1em">
					<Tab>Friends</Tab>
					<Tab>Requests sent</Tab>
					<Tab>Requests received</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Box display={"flex"} flexDir={"row"} gap={3} flexWrap={"wrap"}>
							{friends.map((friend) => (
								<UserCard
									key={friend?._id}
									user={friend}
									isRequestSent={false}
									isRequestReceived={false}
								/>
							))}
						</Box>
					</TabPanel>
					<TabPanel>
						<Box display={"flex"} flexDir={"row"} gap={3} flexWrap={"wrap"}>
							{waitingAcceptedFriends.map((friend) => (
								<UserCard
									key={friend?._id}
									user={friend}
									isRequestSent={true}
									isRequestReceived={false}
								/>
							))}
						</Box>
					</TabPanel>
					<TabPanel>
						<Box display={"flex"} flexDir={"row"} gap={3} flexWrap={"wrap"}>
							{waitingRequestFriends.map((friend) => (
								<UserCard
									key={friend?._id}
									user={friend}
									isRequestSent={false}
									isRequestReceived={true}
								/>
							))}
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}

export default ProfileBox;
