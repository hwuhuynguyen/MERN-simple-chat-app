import "./App.css";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import MessagePage from "./pages/MessagePage";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/users" element={<UserPage />} />
					<Route path="/messages" element={<MessagePage />} />
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
