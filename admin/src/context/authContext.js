import { createContext, useReducer } from "react";
import { authReducer } from "./authReducer";
import axios from "axios";
import { LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT } from "../constants";

const INITIAL_STATE = {
	user: JSON.parse(localStorage.getItem("user")) || null,
	isFetching: false,
	onLogin: (email, password) => {},
	onLogout: () => {},
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = (props) => {
	const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

	const loginHandler = async (email, password) => {
		try {
			const res = await axios.post(
				`${process.env.REACT_APP_ROOT_URL}/api/auth/login`,
				{
					email: email,
					password: password,
				}
			);

			dispatch({ type: LOGIN_SUCCESS, payload: res.data.data.user });

			localStorage.setItem("jwt", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.data.user));
		} catch (err) {
			dispatch({ type: LOGIN_FAILURE });
			console.log("error: ", err);
		}
	};

	const logoutHandler = async () => {
		try {
			await axios.get(`${process.env.REACT_APP_ROOT_URL}/api/auth/logout`);

			dispatch({ type: LOGOUT });
			localStorage.removeItem("jwt");
			localStorage.removeItem("user");
		} catch (err) {
			dispatch({ type: LOGIN_FAILURE });
			console.log("error: ", err);
		}
	};

	const authContext = {
		user: state.user,
		isFetching: state.isFetching,
		onLogin: loginHandler,
		onLogout: logoutHandler,
		dispatch,
	};

	return (
		<AuthContext.Provider value={authContext}>
			{props.children}
		</AuthContext.Provider>
	);
};
