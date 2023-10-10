import {
	Box,
	Button,
	Container,
	FormControl,
	FormLabel,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { ROOT_URL } from "../../constants";

function ForgotPassword() {
	// Step 1: Create Refs
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sendEmailDone, setSendEmailDone] = useState(false);

	useEffect(() => {
		if (user) {
			navigate("/chats");
		}
	}, [user, navigate]);

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	const handleInputChange = (event) => {
		setEmail(event.target.value);
	};

	const handleSubmitForm = async (event) => {
		event.preventDefault();
		if (!email || email.trim().length === 0) {
			Swal.fire({
				title: "Oops!",
				text: "Please provide email!",
				icon: "warning",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
			return;
		}
		if (!validateEmail(email)) {
			Swal.fire({
				title: "Oops!",
				text: "Please provide a valid email!",
				icon: "warning",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
			return;
		}
		setLoading(true);
		try {
			await axios.patch(`${ROOT_URL}/api/auth/forgot-password`, {
				email,
			});

			Swal.fire({
				title: "Success!",
				text: "Token sent to your email",
				icon: "success",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});

			setSendEmailDone(true);
		} catch (err) {
			console.log(err);
			Swal.fire({
				title: "Login failed!",
				text: `${err.response.data.message}`,
				// text: "Incorrect username or password!",
				icon: "error",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
		}

		setLoading(false);
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
				<Text fontSize="4xl">SIMPLE CHAT APPLICATION</Text>
			</Box>
			<Box p={4} bg={"white"} w="100%" borderRadius="lg" borderWidth="1px">
				{!sendEmailDone ? (
					<VStack spacing="5px">
						<Text>
							Please provide your email so that we can send you a token for
							password reset
						</Text>
						<FormControl isRequired>
							<FormLabel fontWeight={"bold"}>Email</FormLabel>
							<Input
								type="email"
								name="email"
								value={email}
								placeholder={"Enter your email"}
								onChange={handleInputChange}
							/>
						</FormControl>

						<Button
							colorScheme="blue"
							width={"100%"}
							style={{ marginTop: 15 }}
							onClick={handleSubmitForm}
							isLoading={loading}
						>
							Get reset password token
						</Button>
					</VStack>
				) : (
					<Text>
						We just sent token to reset password to your email. Please check
						your email to do the next step!
					</Text>
				)}
			</Box>
		</Container>
	);
}

export default ForgotPassword;
