import { createContext, useState } from "react";

const INITIAL_STATE = {};

export const ChatContext = createContext(INITIAL_STATE);

export const ChatContextProvider = (props) => {
	const [selectedChat, setSelectedChat] = useState();
	const [chats, setChats] = useState();

	const chatContext = {
		selectedChat,
		setSelectedChat,
		chats,
		setChats,
	};

	return (
		<ChatContext.Provider value={chatContext}>
			{props.children}
		</ChatContext.Provider>
	);
};
