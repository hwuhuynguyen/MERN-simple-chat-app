import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import SideDrawer from "../components/shared/SideDrawer";
import { Box, Spinner } from "@chakra-ui/react";
import Sidebar from "../components/shared/Sidebar";
import axios from "./../utils/AxiosInstance";
import ReactPaginate from "react-paginate";
import MessageTable from "../components/message/MessageTable";

function MessagePage() {
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;
	const [messages, setMessages] = useState([]);
	const [itemsPerPage] = useState(10);
	const [loading, setLoading] = useState(false);

	const getAllMessages = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`/messages`);

			setMessages(data.messages);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	useEffect(() => {
		getAllMessages();
	}, []);

	const [itemOffset, setItemOffset] = useState(0);

	// Simulate fetching items from another resources.
	// (This could be items from props; or items loaded in a local state
	// from an API endpoint with useEffect and useState)
	const endOffset = itemOffset + itemsPerPage;
	console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	const currentMessages = messages.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(messages.length / itemsPerPage);

	// Invoke when user click to request another page.
	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % messages.length;
		console.log(
			`User requested page number ${event.selected}, which is offset ${newOffset}`
		);
		setItemOffset(newOffset);
	};

	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer user={user} />}
			<Box
				display="flex"
				justifyContent="space-between"
				w="98vw"
				minH="88vh"
				m="1vh 1vw"
				flexDirection={"row"}
				gap={"10px"}
			>
				<Sidebar column={"Messengers"} />
				<Box
					display="flex"
					alignItems="center"
					flexDir="column"
					p={3}
					bg="white"
					w={{ base: "inherit", xl: "84%" }}
					borderRadius="lg"
					borderWidth="1px"
					overflowX={"auto"}
				>
					{loading ? (
						<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
					) : (
						<>
							<MessageTable
								messages={currentMessages}
								itemOffset={itemOffset}
							/>
							<Box>
								<ReactPaginate
									breakLabel="..."
									nextLabel="Next"
									onPageChange={handlePageClick}
									pageRangeDisplayed={5}
									pageCount={pageCount}
									previousLabel="Previous"
									renderOnZeroPageCount={null}
									marginPagesDisplayed={2}
									pageClassName="page-item"
									pageLinkClassName="page-link"
									previousClassName="page-item"
									previousLinkClassName="page-link"
									nextClassName="page-item"
									nextLinkClassName="page-link"
									breakClassName="page-item"
									breakLinkClassName="page-link"
									containerClassName="pagination justify-content-center flex-wrap"
									activeClassName="active"
								/>
							</Box>
						</>
					)}
				</Box>
			</Box>
		</div>
	);
}

export default MessagePage;
