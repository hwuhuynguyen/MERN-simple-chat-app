import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import axios from "axios";
import { ROOT_URL } from "../../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Signup({ onSignupSuccess }) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		passwordConfirm: "",
	});
	const [loading, setLoading] = useState(false);

	const [showPassword, setShowPassword] = useState(false);

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
			await axios.post(`${ROOT_URL}/api/auth/register`, {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				passwordConfirm: formData.passwordConfirm,
			});

			Swal.fire({
				title: "Success!",
				text: "You registered new account! Please login to continue!",
				icon: "success",
				timer: 2000,
			});
			onSignupSuccess();
			setFormData({
				name: "",
				email: "",
				password: "",
				passwordConfirm: "",
			});
			navigate("/");
		} catch (err) {
			const messages = err.response.data.messages;
			Swal.fire({
				title: "Error!",
				html: messages?.join("<br>"),
				icon: "error",
				timer: 2000,
			});
		}
		setLoading(false);
	};

	return (
		<VStack spacing="5px">
			<FormControl isRequired>
				<FormLabel fontWeight={"bold"}>Name</FormLabel>
				<Input
					name="name"
					value={formData.name}
					placeholder={"Enter your name"}
					onChange={handleInputChange}
				/>
			</FormControl>
			<FormControl isRequired>
				<FormLabel fontWeight={"bold"}>Email</FormLabel>
				<Input
					name="email"
					value={formData.email}
					placeholder={"Enter your email"}
					onChange={handleInputChange}
				/>
			</FormControl>
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
				Sign Up
			</Button>
		</VStack>
	);
}

export default Signup;
