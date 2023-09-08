import "./App.css";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/ChatPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/chats" element={<ChatPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
