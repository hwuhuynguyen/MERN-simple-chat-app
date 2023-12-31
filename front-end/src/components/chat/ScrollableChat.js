import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { AuthContext } from "../../context/authContext";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
	isLastMessageSentByOthersTurn,
	isSentByCurrentUser,
	setMarginLeftForMessageSent,
	setMarginTopForMessageSentAndAvatar,
} from "../../utils/ChatHelper";

function ScrollableChat({ messages }) {
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;

	return (
		<ScrollableFeed>
			{messages &&
				messages.map((m, i) => (
					<div style={{ display: "flex" }} key={m._id}>
						{!isSentByCurrentUser(m, i, user._id) &&
							isLastMessageSentByOthersTurn(messages, m, i, user._id) && (
								<Tooltip label={m.sender.name} placement="left">
									<Avatar
										mt={setMarginTopForMessageSentAndAvatar(
											messages,
											m,
											i,
											user._id
										)}
										mr={1}
										size="sm"
										cursor="pointer"
										name={m.sender.name}
										src={""}
										alignSelf={"end"}
									/>
								</Tooltip>
							)}
						{m.type === "file" ? (
							<>
								<span
									style={{
										backgroundColor: `${
											m.sender?._id === user?._id ? "#BEE3F8" : "#B9F5D0"
										}`,
										borderRadius: "20px",
										// marginTop: `${m.sender?._id === user?._id ? "3px" : "5px"}`,
										marginTop: setMarginTopForMessageSentAndAvatar(
											messages,
											m,
											i,
											user._id
										),
										// marginLeft: `${m.sender?._id === user?._id ? "auto" : "0"}`,
										marginLeft: setMarginLeftForMessageSent(
											messages,
											m,
											i,
											user._id
										),
										marginRight: `${
											m.sender?._id === user?._id ? "5px" : undefined
										}`,
										padding: "5px 15px",
										maxWidth: "75%",
									}}
								>
									<img
										src={process.env.REACT_APP_ROOT_URL + m.content}
										alt=""
										width={"300px"}
										height={"auto"}
									/>
								</span>
							</>
						) : (
							<Tooltip label={m?.createdAt?.toString()} placement="auto">
								<span
									style={{
										backgroundColor: `${
											m.sender?._id === user?._id ? "#BEE3F8" : "#B9F5D0"
										}`,
										borderRadius: "20px",
										// marginTop: `${m.sender?._id === user?._id ? "3px" : "5px"}`,
										marginTop: setMarginTopForMessageSentAndAvatar(
											messages,
											m,
											i,
											user._id
										),
										// marginLeft: `${m.sender?._id === user?._id ? "auto" : "0"}`,
										marginLeft: setMarginLeftForMessageSent(
											messages,
											m,
											i,
											user._id
										),
										marginRight: `${
											m.sender?._id === user?._id ? "5px" : undefined
										}`,
										padding: "5px 15px",
										maxWidth: "75%",
									}}
								>
									{m.content}
								</span>
							</Tooltip>
						)}
					</div>
				))}
		</ScrollableFeed>
	);
}

export default ScrollableChat;
