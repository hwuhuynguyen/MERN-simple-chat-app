import {
	LOGIN_FAILURE,
	LOGIN_START,
	LOGIN_SUCCESS,
	LOGOUT,
	UPDATE_USER,
} from "../constants";

export const authReducer = (state, action) => {
	switch (action.type) {
		case LOGIN_START:
			return {
				user: null,
				isFetching: true,
			};
		case LOGIN_SUCCESS:
			return {
				user: action.payload,
				isFetching: false,
			};
		case LOGIN_FAILURE:
			return {
				user: null,
				isFetching: false,
			};
		case LOGOUT:
			return {
				user: null,
				isFetching: false,
			};
		case UPDATE_USER:
			return {
				user: action.payload,
				isFetching: false,
			};
		default:
			return state;
	}
};
