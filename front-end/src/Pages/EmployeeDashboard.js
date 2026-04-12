import EmployeeTopBar from "../Components/Layout/EmployeeTopbar";
import EmployeeSideBar from "../Components/Layout/EmployeeSidebar";
import WelcomeToast from "../Components/UI/WelcomeToast";

import styles from "./EmployeeDashboard.module.css";

function EmployeeDashboard() {
    return (
        <div>
            <EmployeeTopBar />
            <WelcomeToast />
            <EmployeeSideBar/>
            
            <h1>Dashboard</h1>
        </div>

    );
}

export default EmployeeDashboard;