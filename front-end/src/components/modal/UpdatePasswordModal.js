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
import axios from "./../../utils/AxiosInstance";
import { UPDATE_USER } from "../../constants";
import Swal from "sweetalert2";

function UpdatePasswordModal({ children }) {
	const authCtx = useContext(AuthContext);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState(false);

	const [passwordCurrent, setPasswordCurrent] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const handleUpdateProfile = async (event) => {
		setLoading(true);
		try {
			const { data } = await axios.patch(`/auth/updatePassword`, {
				passwordCurrent,
				password,
				passwordConfirm,
			});

			onClose();

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.data.user));

			Swal.fire({
				title: "Updated new password successfully!",
				text: "You've updated password successfully.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {
			Swal.fire({
				title: "Updated password failed!",
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
					<ModalHeader textAlign={"center"}>UPDATE PASSWORD</ModalHeader>
					<ModalBody>
						<FormControl>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
								Password current:
							</FormLabel>
							<Input
								type="password"
								placeholder="Password current"
								mb={3}
								value={passwordCurrent}
								onChange={(e) => setPasswordCurrent(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
								Password:
							</FormLabel>
							<Input
								type="password"
								placeholder="Password"
								mb={3}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<FormLabel fontSize={"sm"} fontWeight={"bold"}>
								Password confirm:
							</FormLabel>
							<Input
								type="password"
								placeholder="Password confirm"
								mb={3}
								value={passwordConfirm}
								onChange={(e) => setPasswordConfirm(e.target.value)}
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

export default UpdatePasswordModal;
