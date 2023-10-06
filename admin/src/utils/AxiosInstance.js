import axios from "axios";
import { ROOT_URL } from "../constants";

const instance = axios.create({
	baseURL: `${ROOT_URL}/api`,
	headers: {
		"Content-Type": "application/json",
	},
});

instance.interceptors.request.use(
	(config) => {
		const accessToken = getAccessToken();
		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

function getAccessToken() {
	return localStorage.getItem("jwt");
}

export default instance;
