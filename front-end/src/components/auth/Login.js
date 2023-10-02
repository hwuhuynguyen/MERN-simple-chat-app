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
import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
	LOGIN_FAILURE,
	LOGIN_SUCCESS,
	ROOT_URL,
	SAMPLE_EMAIL,
	SAMPLE_PASSWORD,
} from "../../constants";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

function Login() {
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
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

	const getSampleAccount = () => {
		setFormData({
			email: SAMPLE_EMAIL,
			password: SAMPLE_PASSWORD,
		});
	};

	const handleSubmitForm = async (event) => {
		event.preventDefault();
		if (!formData.email || !formData.password) {
			Swal.fire({
				title: "Oops!",
				text: "Please provide email and password!",
				icon: "warning",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
			return;
		}
		setLoading(true);
		try {
			const res = await axios.post(`${ROOT_URL}/api/auth/login`, {
				email: formData.email,
				password: formData.password,
			});

			console.log(res.data.data.user);

			if (res.data.data.user.isAdmin) {
				setLoading(false);
				return Swal.fire({
					title: "Login failed!",
					text: "You are not able to perform this action",
					icon: "error",
					timer: 1500,
					confirmButtonColor: "#3182ce",
				});
			}

			authCtx.dispatch({ type: LOGIN_SUCCESS, payload: res.data.data.user });

			localStorage.setItem("jwt", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.data.user));

			Swal.fire({
				title: "Success!",
				text: "Login success!",
				icon: "success",
				timer: 1500,
				confirmButtonColor: "#3182ce",
			});
			navigate("/chats");
		} catch (err) {
			authCtx.dispatch({ type: LOGIN_FAILURE });
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
		<VStack spacing="5px">
			<FormControl isRequired>
				<FormLabel fontWeight={"bold"}>Email</FormLabel>
				<Input
					type="email"
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
						isRequired={true}
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
			<Button
				colorScheme="blue"
				width={"100%"}
				style={{ marginTop: 15 }}
				onClick={handleSubmitForm}
				isLoading={loading}
			>
				Login
			</Button>
			<Button colorScheme="red" width={"100%"} onClick={getSampleAccount}>
				Get Sample Account
			</Button>
		</VStack>
	);
}

export default Login;
