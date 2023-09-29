import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	Table,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
} from "@chakra-ui/react";
import React from "react";
import { formatDate } from "../../utils/DateHelper";

function UserProfileModal({ children, user }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>USER INFORMATION</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TableContainer>
							<Table variant="simple">
								<Tbody>
									<Tr>
										<Th>ID</Th>
										<Td>{user._id}</Td>
									</Tr>
									<Tr>
										<Th>Name</Th>
										<Td>{user.name}</Td>
									</Tr>
									<Tr>
										<Th>Email</Th>
										<Td>{user.email}</Td>
									</Tr>
									{!user.isAdmin && (
										<>
											<Tr>
												<Th>Phone number</Th>
												<Td>{user.phoneNumber || ""}</Td>
											</Tr>
											<Tr>
												<Th>Registed at</Th>
												<Td>{formatDate(user.createdAt)}</Td>
											</Tr>
											<Tr>
												<Th>Friends</Th>
												<Td>{user.friends.length}</Td>
											</Tr>
											<Tr>
												<Th>Requests sent</Th>
												<Td>{user.waitingAcceptedFriends.length}</Td>
											</Tr>
											<Tr>
												<Th>Requests received</Th>
												<Td>{user.waitingRequestFriends.length}</Td>
											</Tr>
										</>
									)}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default UserProfileModal;
