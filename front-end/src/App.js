import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/Routing/ProtectedRoute";

// Login
import Login from "./Pages/Login";
import NotFound from "./Pages/404";

// Employee
import EmployeeLayout from "./Pages/EmployeeLayout";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import Tasks from "./Pages/Tasks";
import TaskDetails from "./Components/Tasks/TaskDetails";
import ReportEditor from "./Components/Tasks/ReportEditor";
import Reports from "./Pages/Reports";
import EmployeeProfile from "./Pages/EmployeeProfile"

// Citizen
import CitizenLayout from "./Pages/CitizenLayout";
import CitizenDashboard from "./Pages/CitizenDashboard";
import Request from "./Pages/Request";
import Complain from "./Pages/Complain";
import Documents from "./Pages/Documents";
import PayFees from "./Pages/PayFees";
import MyRequest from "./Pages/MyRequests";
import Profile from "./Pages/Profile";

// Mayor
import MayorDashboard from "./Pages/MayorDahsboard";
import MayorRequests from "./Pages/MayorRequests";
import MayorComplaints from "./Pages/MayorComplaints";
import MayorAlerts from "./Pages/MayorAlerts";
import MayorReports from "./Pages/MayorReports";
import MayorRequestDetails from "./Pages/MayorRequestDetails";

// Admin
import AdminUsers from "./Pages/AdminUsers";
import AssignRoles from "./Pages/AssignRoles";
import ServicesConfig from "./Pages/ServicesConfig";
import SystemLogs from "./Pages/SystemLogs";
// Secretary
import ManageRequests from "./Pages/Secretary/ManageRequests";
import RequestDetailsPage from "./Pages/Secretary/RequestDetailsPage";
import VerifyDocuments from "./Pages/Secretary/VerifyDocuments";
// Print
import ReportPrint from "./Pages/ReportPrint";
import ManageEvents from "./Pages/Secretary/ManageEvents";
import ManageAnnouncements from "./Pages/Secretary/ManageAnnouncements";
// Finance
import FeeSettings from "./Pages/Finance/FeeSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* EMPLOYEE LAYOUT */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<EmployeeDashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:id" element={<TaskDetails />} />
          <Route path="tasks/:id/report" element={<ReportEditor />} />
          <Route path="history" element={<Reports />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<EmployeeProfile/>}/>

          {/* ADMIN ROUTES */}
          <Route path="admin/users" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminUsers /></ProtectedRoute>}/>
          <Route path="admin/roles" element={<ProtectedRoute allowedRoles={["Admin"]}><AssignRoles /></ProtectedRoute>}/>
          <Route path="admin/services" element={ <ProtectedRoute allowedRoles={["Admin"]}> <ServicesConfig /></ProtectedRoute>}/>
          <Route path="admin/logs" element={ <ProtectedRoute allowedRoles={["Admin"]}> <SystemLogs /> </ProtectedRoute> }/>

          {/* MAYOR ROUTES */}
          <Route path="mayor/dashboard" element={<ProtectedRoute allowedRoles={["Mayor"]}><MayorDashboard /></ProtectedRoute>} />
          <Route path="mayor/requests" element={<ProtectedRoute allowedRoles={["Mayor"]}><MayorRequests /></ProtectedRoute>} />
          <Route path="mayor/complaints" element={<ProtectedRoute allowedRoles={["Mayor"]}><MayorComplaints /></ProtectedRoute>} />
          <Route path="mayor/alerts" element={<ProtectedRoute allowedRoles={["Mayor"]}><MayorAlerts /></ProtectedRoute>} />
          <Route path="mayor/reports" element={<ProtectedRoute allowedRoles={["Mayor"]}><MayorReports /></ProtectedRoute>} />
          <Route path="mayor/requests/:id" element={<ProtectedRoute allowedRoles={["Mayor"]}><MayorRequestDetails /></ProtectedRoute>}/>


          {/* SECRETARY ROUTES*/}
          <Route path="secretary/managereq" element={<ProtectedRoute allowedRoles={["Secretary"]}><ManageRequests /></ProtectedRoute>}/>
          <Route path="secretary/managereq/:id" element={<ProtectedRoute allowedRoles={["Secretary"]}><RequestDetailsPage /></ProtectedRoute>} />
          <Route path="secretary/verifydoc" element={<ProtectedRoute allowedRoles={["Secretary"]}><VerifyDocuments /></ProtectedRoute>} />
          <Route path="secretary/events" element={<ProtectedRoute allowedRoles={["Secretary"]}><ManageEvents/></ProtectedRoute>} />
          <Route path="secretary/announcements" element={<ProtectedRoute allowedRoles={["Secretary"]}><ManageAnnouncements/></ProtectedRoute>} />

          {/* FINANCE ROUTES */}
          <Route path="finance/fees" element={<ProtectedRoute allowedRoles={["Financial Staff"]}><FeeSettings /></ProtectedRoute>} />

        </Route>

        {/* CITIZEN */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute>
              <CitizenLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CitizenDashboard />} />
          <Route path="request" element={<Request />} />
          <Route path="complain" element={<Complain />} />
          <Route path="Documents" element={<Documents/>} />
          <Route path="payfees" element={<PayFees />} />
          <Route path="myrequests" element={<MyRequest/>} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* PRINT */}
        <Route path="/employee/report/print/:id" element={<ReportPrint />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;