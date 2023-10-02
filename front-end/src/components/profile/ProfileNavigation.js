import {
	Avatar,
	Box,
	Button,
	Table,
	TableContainer,
	Tbody,
	Td,
	Tr,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import UpdateUserModal from "../modal/UpdateUserModal";
import UpdatePasswordModal from "../modal/UpdatePasswordModal";

function ProfileNavigation() {
	const { user } = useContext(AuthContext);

	return (
		<Box
			display={{ base: "none", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg="white"
			w={{ base: "100%", md: "30%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "28px", md: "30px" }}
				w="100%"
				justifyContent="space-between"
			>
				Profile
			</Box>
			<Avatar src="" name={user.name} size={"2xl"} mb={5} />

			<TableContainer w={"100%"} overflowY={"auto"}>
				<Table variant="simple">
					<Tbody>
						<Tr>
							<Td fontWeight={"bold"}>Name</Td>
							<Td>{user.name}</Td>
						</Tr>
						<Tr>
							<Td fontWeight={"bold"}>Email</Td>
							<Td>{user.email}</Td>
						</Tr>
						<Tr>
							<Td fontWeight={"bold"}>Phone number</Td>
							<Td>{user.phoneNumber || "..."}</Td>
						</Tr>
						<Tr>
							<Td fontWeight={"bold"}>Friends</Td>
							<Td>{user.friends.length}</Td>
						</Tr>
						<Tr>
							{/* <Tooltip label="Waiting accepted friends"> */}
							<Td fontWeight={"bold"}>Sent requests</Td>
							{/* </Tooltip> */}
							<Td>{user.waitingAcceptedFriends.length}</Td>
						</Tr>
						<Tr>
							{/* <Tooltip label="Waiting request friends"> */}
							<Td fontWeight={"bold"}>Received requests </Td>
							{/* </Tooltip> */}
							<Td>{user.waitingRequestFriends.length}</Td>
						</Tr>
						<Tr></Tr>
					</Tbody>
				</Table>
			</TableContainer>
			<Box display={"flex"} gap={"16px"}>
				<UpdateUserModal>
					<Button colorScheme="blue" display="flex">
						Update
					</Button>
				</UpdateUserModal>
				<UpdatePasswordModal>
					<Button colorScheme="orange" display="flex">
						Change password
					</Button>
				</UpdatePasswordModal>
			</Box>
		</Box>
	);
}

export default ProfileNavigation;
