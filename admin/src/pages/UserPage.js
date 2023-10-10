import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import SideDrawer from "../components/shared/SideDrawer";
import { Box, Spinner } from "@chakra-ui/react";
import Sidebar from "../components/shared/Sidebar";
import axios from "./../utils/AxiosInstance";
import UserTable from "../components/user/UserTable";
import ReactPaginate from "react-paginate";

function UserPage() {
	const authCtx = useContext(AuthContext);
	const user = authCtx.user;
	const [users, setUsers] = useState([]);
	const [itemsPerPage] = useState(10);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false);

	const getAllUsers = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(`/users`);

			setUsers(data.users);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	useEffect(() => {
		getAllUsers();
	}, [fetching]);

	const [itemOffset, setItemOffset] = useState(0);

	// Simulate fetching items from another resources.
	// (This could be items from props; or items loaded in a local state
	// from an API endpoint with useEffect and useState)
	const endOffset = itemOffset + itemsPerPage;
	console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	const currentUsers = users.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(users.length / itemsPerPage);

	// Invoke when user click to request another page.
	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % users.length;
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
				<Sidebar column={"Users"} />
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
							<UserTable
								users={currentUsers}
								itemOffset={itemOffset}
								fetching={fetching}
								setFetching={setFetching}
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

export default UserPage;
