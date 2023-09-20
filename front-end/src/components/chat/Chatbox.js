import { Box } from "@chakra-ui/react";
import React from "react";
import SingleChat from "./SingleChat";

function Chatbox({ fetchAgain, setFetchAgain }) {
	return (
		<Box
			display="flex"
			alignItems="center"
			flexDir="column"
			p={3}
			bg="white"
			w={{ base: "100%", md: "69%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
		</Box>
	);
}

export default Chatbox;
