import {
	Box,
	Button,
	Container,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

function ResetPassword() {
	// Step 1: Create Refs
	let { token } = useParams();

	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const [formData, setFormData] = useState({
		password: "",
		passwordConfirm: "",
	});

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (user) {
			navigate("/chats");
		}
	}, [user, navigate]);

	const handleShowPassword = (event) => {
		event.preventDefault();
		setShowPassword(!showPassword);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmitForm = async (event) => {
		event.preventDefault();

		setLoading(true);
		try {
			await axios.patch(
				`${process.env.REACT_APP_ROOT_URL}/api/auth/reset-password/${token}`,
				{
					password: formData.password,
					passwordConfirm: formData.passwordConfirm,
				}
			);

			Swal.fire({
				title: "Success!",
				text: "Change password successfully! Please login to your account!",
				icon: "success",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
			navigate("/");
		} catch (err) {
			console.log(err);
			Swal.fire({
				title: "Change password failed!",
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
				<VStack spacing="5px">
					<Text>Please provide your password</Text>

					<FormControl isRequired>
						<FormLabel fontWeight={"bold"}>Password</FormLabel>
						<InputGroup>
							<Input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								placeholder={"Enter your password"}
								onChange={handleInputChange}
							/>
							<InputRightElement w={"auto"}>
								<Button
									mr={"5px"}
									size={"sm"}
									borderRadius={"50%"}
									backgroundColor={"white"}
									onClick={handleShowPassword}
								>
									{showPassword ? (
										<ViewIcon></ViewIcon>
									) : (
										<ViewOffIcon></ViewOffIcon>
									)}
								</Button>
							</InputRightElement>
						</InputGroup>
					</FormControl>

					<FormControl isRequired>
						<FormLabel fontWeight={"bold"}>Password confirm</FormLabel>
						<Input
							type="password"
							name="passwordConfirm"
							value={formData.passwordConfirm}
							placeholder={"Enter your password confirm"}
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
						Change password
					</Button>
				</VStack>
			</Box>
		</Container>
	);
}

export default ResetPassword;
