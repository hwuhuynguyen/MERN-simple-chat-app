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
	Text,
} from "@chakra-ui/react";
import axios from "./../../utils/AxiosInstance";
import React, { useState } from "react";
import Swal from "sweetalert2";

function ResetPasswordModal({ children, user }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = useState(false);
	const handleResetPassword = async () => {
		setLoading(true);
		try {
			await axios.patch(`/auth/reset-password`, {
				userId: user._id,
			});

			Swal.fire({
				title: "Success!",
				text: "Reset password successfully!",
				icon: "success",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
			onClose();
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Error!",
				text: "Something went wrong!",
				icon: "error",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
		}
		setLoading(false);
	};
	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>RESET PASSWORD</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text fontSize={"xl"}>
							Do you want to reset the password for this account to the default
							password?
						</Text>
						<Text>
							Default password: <strong> 123456</strong>
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="red"
							onClick={handleResetPassword}
							isDisabled={loading}
						>
							{loading ? "Reseting" : "Reset"}
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

export default ResetPasswordModal;
