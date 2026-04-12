import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import EmployeeDashboard from "./Pages/EmployeeDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/employee" element={<EmployeeDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;