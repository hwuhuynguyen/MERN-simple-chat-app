import axios from "axios";

const instance = axios.create({
	baseURL: `${process.env.REACT_APP_ROOT_URL}/api`,
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
