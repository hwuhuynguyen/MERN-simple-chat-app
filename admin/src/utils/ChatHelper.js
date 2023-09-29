export const getSenderName = (loggedUser, users) => {
	return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSender = (loggedUser, users) => {
	return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSentByCurrentUser = (m, i, userId) => {
	return m.sender._id === userId;
};

export const isLastMessageSentByOthersTurn = (messages, m, i, userId) => {
	return (
		i <= messages.length - 1 &&
		messages[i].sender?._id !== messages[i + 1]?.sender?._id
	);
};

export const setMarginLeftForMessageSent = (messages, m, i, userId) => {
	if (m.sender?._id === userId) return "auto";
	if (
		i <= messages.length - 1 &&
		messages[i].sender?._id !== messages[i + 1]?.sender?._id
	) {
		return "0";
	} else {
		return "35px";
	}
};

export const setMarginTopForMessageSentAndAvatar = (messages, m, i, userId) => {
	if (
		i <= messages.length - 1 &&
		messages[i - 1]?.sender?._id === messages[i]?.sender?._id
	) {
		return "1px";
	} else {
		return "10px";
	}
};
