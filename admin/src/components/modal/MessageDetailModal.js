import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	Table,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { formatDate } from "../../utils/DateHelper";
import axios from "axios";
import { ROOT_URL } from "../../constants";
import { getSenderName } from "../../utils/ChatHelper";

function MessageDetailModal({ children, message }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [loading, setLoading] = useState(false);
	const [details, setDetails] = useState({});
	const [viewMore, setViewMore] = useState(false);

	const handleViewMessageDetail = async () => {
		setLoading(true);
		try {
			const jwt = localStorage.getItem("jwt");
			const config = {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			};

			const { data } = await axios.get(
				`${ROOT_URL}/api/messages/detail/${message._id}`,
				config
			);

			console.log(data.message);
			setDetails(data.message);
			setViewMore(true);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};
	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>MESSAGE DETAIL</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<TableContainer>
							<Table variant="simple">
								<Tbody>
									<Tr>
										<Th>ID</Th>
										<Td>{message._id}</Td>
									</Tr>
									<Tr>
										<Th>Sender</Th>
										<Td>{message.sender}</Td>
									</Tr>
									<Tr>
										<Th>Chat</Th>
										<Td>{message.chat}</Td>
									</Tr>
									<Tr>
										<Th>Content</Th>
										<Td>{message.content}</Td>
									</Tr>
									<Tr>
										<Th>Sent at</Th>
										<Td>{formatDate(message.createdAt)}</Td>
									</Tr>
									{viewMore && (
										<>
											<Tr>
												<Th>Sender name</Th>
												<Td>{details.sender.name}</Td>
											</Tr>
											{details.chat.isGroupChat ? (
												<>
													<Tr>
														<Th>Group chat</Th>
														<Td>{details.chat.chatName}</Td>
													</Tr>
													<Tr>
														<Th>Number of receivers: </Th>
														<Td>{details.chat.users.length - 1}</Td>
													</Tr>
												</>
											) : (
												<>
													<Tr>
														<Th>Receiver name</Th>
														<Td>
															{getSenderName(
																details.sender,
																details.chat.users
															)}
														</Td>
													</Tr>
												</>
											)}
										</>
									)}
								</Tbody>
							</Table>
						</TableContainer>
					</ModalBody>

					<ModalFooter>
						<Button
							onClick={handleViewMessageDetail}
							isDisabled={loading}
							display={viewMore && "none"}
						>
							{loading ? "Loading ..." : "See more"}
						</Button>
						<Button
							onClick={() => setViewMore(false)}
							display={!viewMore && "none"}
						>
							See Less
						</Button>
						<Button variant="ghost" onClick={onClose} isDisabled={loading}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default MessageDetailModal;
