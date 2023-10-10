import { InfoIcon } from "@chakra-ui/icons";
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Button,
	Box,
	Tooltip,
} from "@chakra-ui/react";
import MessageDetailModal from "../modal/MessageDetailModal";
function MessageTable({ messages, itemOffset }) {
	const formatDate = (date) => {
		const originalDate = new Date(date);
		const day = String(originalDate.getDate()).padStart(2, "0");
		const month = String(originalDate.getMonth() + 1).padStart(2, "0");
		const year = originalDate.getFullYear();

		const hours = String(originalDate.getHours()).padStart(2, "0");
		const minutes = String(originalDate.getMinutes()).padStart(2, "0");
		const seconds = String(originalDate.getSeconds()).padStart(2, "0");

		return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} UTC`;
	};

	return (
		<TableContainer
			w={"100%"}
			overflowY={"auto"}
			height={"-webkit-fill-available"}
		>
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>No.</Th>
						<Th>Message ID</Th>
						<Th>Sender ID</Th>
						<Th>Chat ID</Th>
						<Th>Content</Th>
						<Th>Created at</Th>
						<Th>Action</Th>
					</Tr>
				</Thead>
				<Tbody>
					{messages?.map((message, i) => (
						<Tr key={message._id}>
							<Td>{i + 1 + itemOffset}</Td>
							<Td>{message._id}</Td>
							<Td>{message.sender}</Td>
							<Td>{message.chat}</Td>
							<Td>
								{message.content.length > 25
									? message.content.substring(0, 25) + "..."
									: message.content}
							</Td>
							<Td>{formatDate(message.createdAt)}</Td>
							<Td>
								<Box display={"flex"} columnGap={2}>
									<MessageDetailModal message={message}>
										<Tooltip label="View details">
											<Button bg={"#a6e1ff"}>
												<InfoIcon />
											</Button>
										</Tooltip>
									</MessageDetailModal>
								</Box>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
}

export default MessageTable;
