import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	useDisclosure,
	FormControl,
	Input,
	FormLabel,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { ROOT_URL, UPDATE_USER } from "../../constants";
import Swal from "sweetalert2";

function UpdateUserModal({ children }) {
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState(false);

	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

	const handleUpdateProfile = async (event) => {
		setLoading(true);
		try {
			const jwt = localStorage.getItem("jwt");
			const { data } = await axios.patch(
				`${ROOT_URL}/api/users/me`,
				{
					name,
					email,
					phoneNumber,
				},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);
			onClose();

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

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
				text: `${error.response.data.message}`,
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
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign={"center"}>
						UPDATE USER INFORMATION
					</ModalHeader>
					<ModalBody>
						<FormControl>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
								Name:
							</FormLabel>
							<Input
								placeholder="Name"
								mb={3}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
								Email:
							</FormLabel>
							<Input
								placeholder="Email"
								mb={3}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
								Phone number:
							</FormLabel>
							<Input
								placeholder="Phone number"
								mb={3}
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleUpdateProfile}
							isDisabled={loading}
						>
							{loading ? "Updating..." : "Update"}
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
