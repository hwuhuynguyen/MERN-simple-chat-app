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
	Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { formatDate } from "../../utils/DateHelper";
import axios from "axios";
import { ROOT_URL } from "../../constants";
import Swal from "sweetalert2";

function UpdateUserModal({ children, user, fetching, setFetching }) {
	const [name, setName] = useState(user.name);
	const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState(false);

	const handleUpdateUser = async () => {
		console.log(name);
		console.log(phoneNumber);
		setLoading(true);
		try {
			const jwt = localStorage.getItem("jwt");
			const { data } = await axios.patch(
				`${ROOT_URL}/api/users/updateUserProfile`,
				{
					userId: user._id,
					name,
					phoneNumber,
				},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);
			setFetching(!fetching);
			console.log(data);
			onClose();

			Swal.fire({
				title: "Updated information successfully!",
				text: "You've updated information successfully.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {
			Swal.fire({
				title: "Updated information failed!",
				text: `${error}`,
				icon: "error",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
			console.log(error);
		}

		setLoading(false);
		onClose();
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>UPDATE USER INFORMATION</ModalHeader>
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
										<Td>
											<Input
												placeholder="Name"
												size="md"
												value={name}
												onChange={(e) => setName(e.target.value)}
											/>
										</Td>
									</Tr>
									<Tr>
										<Th>Email</Th>
										<Td>{user.email}</Td>
									</Tr>
									<Tr>
										<Th>Phone number</Th>
										<Td>
											<Input
												placeholder="Phone number"
												size="md"
												value={phoneNumber}
												onChange={(e) => setPhoneNumber(e.target.value)}
											/>
										</Td>
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
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={handleUpdateUser}
							isDisabled={loading}
						>
							{loading ? "Updating" : "Update"}
						</Button>
						<Button variant="ghost" onClick={onClose} isDisabled={loading}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default UpdateUserModal;
