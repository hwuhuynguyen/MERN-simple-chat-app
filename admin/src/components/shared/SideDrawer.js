import React, { Fragment, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { LOGOUT } from "../../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import MainNavigation from "./MainNavigation";

function SideDrawer({ user }) {
	const navigate = useNavigate();
	const authCtx = useContext(AuthContext);

	const logoutHandler = () => {
		authCtx.dispatch({ type: LOGOUT });
		localStorage.removeItem("jwt");
		localStorage.removeItem("user");
		Swal.fire({
			title: "Success!",
			text: "Logged out of your account successfully!",
			icon: "success",
			timer: 2000,
		});
		navigate("/");
	};

	return (
		<Fragment>
			<MainNavigation user={user} onLogoutHandler={logoutHandler} />
		</Fragment>
	);
}

export default SideDrawer;
