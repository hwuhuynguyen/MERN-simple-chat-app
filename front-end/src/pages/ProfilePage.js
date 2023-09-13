import React, { useContext, useEffect } from "react";
import SideDrawer from "../components/shared/SideDrawer";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	useEffect(() => {
		if (!user) navigate("/");
	});

	return (
		<div style={{ width: "100%" }}>{user && <SideDrawer user={user} />}</div>
	);
}

export default ProfilePage;
