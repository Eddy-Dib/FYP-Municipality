import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import NotFound from "./Pages/404";
import ProtectedRoute from "./Components/Routing/ProtectedRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>

				<Route path="/" element={<Login />} />

				<Route
					path="/employee"
					element={
						<ProtectedRoute allowedRoles={["Mayor", "Engineer", "Secretary", "Admin", "Finance", "Lawyer"]}>
							<EmployeeDashboard />
						</ProtectedRoute>
					}
				/>

				{/* To add more routes later, add them before NotFound ALWAYS!!*/}

				<Route path="*" element={<NotFound />} />

			</Routes>
		</BrowserRouter>
	);
}

export default App;