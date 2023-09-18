import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./context/authContext";
import { ChatContextProvider } from "./context/chatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<AuthContextProvider>
		<ChatContextProvider>
			<ChakraProvider>
				<App />
			</ChakraProvider>
		</ChatContextProvider>
	</AuthContextProvider>
	// </React.StrictMode>
);
