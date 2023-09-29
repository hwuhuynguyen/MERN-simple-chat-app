import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<AuthContextProvider>
		<ChakraProvider portalZIndex={1500}>
			<App />
		</ChakraProvider>
	</AuthContextProvider>
);
