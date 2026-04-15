import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Components/Routing/ProtectedRoute";

// Login
import Login from "./Pages/Login";
import NotFound from "./Pages/404";

// Employee
import EmployeeLayout from "./Pages/EmployeeLayout";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import Tasks from "./Pages/Tasks";
import Reports from "./Pages/Reports";

// Citizen
import CitizenLayout from "./Pages/CitizenLayout";
import CitizenDashboard from "./Pages/CitizenDashboard";
import Request from "./Pages/Request";
import Complain from "./Pages/Complain";
import PayFees from "./Pages/PayFees";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/employee"
          element={<ProtectedRoute><EmployeeLayout /></ProtectedRoute>}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route
          path="/citizen"
          element={<ProtectedRoute><CitizenLayout /></ProtectedRoute>}>
          <Route index element={<CitizenDashboard/>} />
          <Route path="request" element={<Request />} />
          <Route path="complain" element={<Complain />} />
          <Route path="payfees" element={<PayFees />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;