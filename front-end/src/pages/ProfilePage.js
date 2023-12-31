import React, { useContext, useEffect, useState } from "react";
import SideDrawer from "../components/shared/SideDrawer";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import ProfileNavigation from "../components/profile/ProfileNavigation";
import ProfileBox from "../components/profile/ProfileBox";
import axios from "./../utils/AxiosInstance";

function ProfilePage() {
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	const [currentUser, setCurrentUser] = useState(user);

	useEffect(() => {
		if (!user) navigate("/");
	});

	const retriveUserInformation = async () => {
		try {
			const { data } = await axios.get(`/users/me`);
			setCurrentUser(data.user);
		} catch (error) {}
	};

	useEffect(() => {
		retriveUserInformation();
	}, [user]);

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer user={user} />}
			<Box
				display="flex"
				justifyContent="space-between"
				w="98vw"
				h="88vh"
				m="1vh 1vw"
				flexDirection={"row"}
			>
				{user && <ProfileNavigation />}
				{user && <ProfileBox user={currentUser} />}
			</Box>
		</div>
	);
}

export default ProfilePage;
