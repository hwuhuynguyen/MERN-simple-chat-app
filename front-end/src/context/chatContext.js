import { createContext, useState } from "react";

const INITIAL_STATE = {};

export const ChatContext = createContext(INITIAL_STATE);

export const ChatContextProvider = (props) => {
	const [selectedChat, setSelectedChat] = useState();
	const [chats, setChats] = useState([]);
	const [notifications, setNotifications] = useState([]);

	const chatContext = {
		selectedChat,
		setSelectedChat,
		chats,
		setChats,
		notifications,
		setNotifications,
	};

	return (
		<ChatContext.Provider value={chatContext}>
			{props.children}
		</ChatContext.Provider>
	);
};
