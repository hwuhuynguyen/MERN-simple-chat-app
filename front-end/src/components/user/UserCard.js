import {
	Avatar,
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	Heading,
	Stack,
	Text,
} from "@chakra-ui/react";
import axios from "./../../utils/AxiosInstance";
import React, { useContext } from "react";
import Swal from "sweetalert2";
import { UPDATE_USER } from "../../constants";
import { AuthContext } from "../../context/authContext";

function UserCard({ user, isRequestSent, isRequestReceived }) {
	const authCtx = useContext(AuthContext);

	const handleViewDetailOfUser = (user) => {
		Swal.fire({
			title: "USER INFORMATION",
			html: `<div style="text-align: left">
			<p style="padding: 10px"><span style="font-weight: bold; padding-right: 100px">Name:</span> ${
				user.name
			}</p>
			<p style="padding: 10px"><span style="font-weight: bold; padding-right: 100px">Email:</span> ${
				user.email
			}</p>
			<p style="padding: 10px"><span style="font-weight: bold; padding-right: 24px">Phone number:</span> ${
				user.phoneNumber || "..."
			}</p>
			<p style="padding: 10px"><span style="font-weight: bold; padding-right: 82px">Friends:</span> ${
				user.friends.length
			}</p>
			</div>`,
			confirmButtonColor: "#3182ce",
			customClass: {
				container: "custom-swal-modal",
			},
		});
	};

	const handleCancelFriendRequest = async (userId) => {
		try {
			const { data } = await axios.patch(`/users/cancelFriendRequest`, {
				userId,
			});

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			Swal.fire({
				title: "Cancelled friend request successfully!",
				text: "You've cancelled friend request to this user successfully.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {
			Swal.fire({
				title: "Cancelled friend request failed!",
				text: `${error.response.data.message}`,
				icon: "error",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		}
	};

	const handleAcceptFriendRequest = async (userId) => {
		try {
			const { data } = await axios.patch(`/users/acceptFriendRequest`, {
				userId,
			});

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			Swal.fire({
				title: "Accepted friend request!",
				text: "You've became friend with this user.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {}
	};

	const handleDenyFriendRequest = async (userId) => {
		try {
			const { data } = await axios.patch(`/users/denyFriendRequest`, {
				userId,
			});

			authCtx.dispatch({
				type: UPDATE_USER,
				payload: data.user,
			});

			localStorage.setItem("user", JSON.stringify(data.user));

			Swal.fire({
				title: "Denied friend request!",
				text: "You've denied friend request with this user.",
				icon: "success",
				timer: 3000,
				confirmButtonColor: "#3182ce",
				customClass: {
					container: "custom-swal-modal",
				},
			});
		} catch (error) {}
	};

	return (
		<Card w="200px" textAlign={"center"}>
			<CardBody>
				<Avatar src="" name={user.name} size={"lg"} />
				<Stack mt="6" spacing="3">
					<Heading size="md">{user?.name}</Heading>
					<Text>{user.email}</Text>
				</Stack>
			</CardBody>
			<CardFooter justifyContent={"center"}>
				<Button
					variant="solid"
					colorScheme="blue"
					onClick={() => handleViewDetailOfUser(user)}
				>
					View details
				</Button>
			</CardFooter>
			{isRequestSent && (
				<Box display={"flex"} justifyContent={"center"} gap={3} pb={3}>
					<Button
						colorScheme={"teal"}
						color={"white"}
						onClick={() => handleCancelFriendRequest(user._id)}
					>
						Cancel request
					</Button>
				</Box>
			)}
			{isRequestReceived && (
				<Box display={"flex"} justifyContent={"center"} gap={3} pb={3}>
					<Button
						colorScheme={"green"}
						color={"white"}
						onClick={() => handleAcceptFriendRequest(user._id)}
					>
						Accept
					</Button>
					<Button
						colorScheme={"red"}
						color={"white"}
						onClick={() => handleDenyFriendRequest(user._id)}
					>
						Deny
					</Button>
				</Box>
			)}
		</Card>
	);
}

export default UserCard;
