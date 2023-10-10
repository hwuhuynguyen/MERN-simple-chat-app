import { EditIcon, InfoIcon, RepeatIcon } from "@chakra-ui/icons";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Button,
	Box,
	Tooltip,
} from "@chakra-ui/react";
import UserProfileModal from "../modal/UserProfileModal";
import UpdateUserModal from "../modal/UpdateUserModal";
import ResetPasswordModal from "../modal/ResetPasswordModal";
function UserTable({ users, itemOffset, fetching, setFetching }) {
	return (
		<TableContainer
			w={"100%"}
			overflowY={"auto"}
			height={"-webkit-fill-available"}
		>
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>No.</Th>
						<Th>ID</Th>
						<Th>Name</Th>
						<Th>Email</Th>
						<Th>Phone number</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{users?.map((user, i) => (
						<Tr key={user._id}>
							<Td>{i + 1 + itemOffset}</Td>
							<Td>{user._id}</Td>
							<Td>{user.name}</Td>
							<Td>{user.email}</Td>
							<Td>{user.phoneNumber}</Td>
							<Td>
								<Box display={"flex"} columnGap={2}>
									<UserProfileModal user={user}>
										<Tooltip label="View details">
											<Button bg={"#a6e1ff"}>
												<InfoIcon />
											</Button>
										</Tooltip>
									</UserProfileModal>
									<UpdateUserModal
										user={user}
										fetching={fetching}
										setFetching={setFetching}
									>
										<Tooltip label="Update user">
											<Button bg={"#c9cd67cc"}>
												<EditIcon />
											</Button>
										</Tooltip>
									</UpdateUserModal>
									<ResetPasswordModal user={user}>
										<Tooltip label="Reset password">
											<Button bg={"#e98ce3"}>
												<RepeatIcon />
											</Button>
										</Tooltip>
									</ResetPasswordModal>
									{/* <Tooltip label="Delete user">
										<Button bg={"#e98c8ce3"}>
											<DeleteIcon />
										</Button>
									</Tooltip> */}
								</Box>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
}

export default UserTable;
