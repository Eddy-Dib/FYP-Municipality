import { Outlet } from "react-router-dom";
import EmployeeTopBar from "../Components/Layout/EmployeeTopbar";
import EmployeeSideBar from "../Components/Layout/EmployeeSidebar";
import styles from "./EmployeeLayout.module.css";

function EmployeeLayout() {
    return (
        <>
            <EmployeeTopBar />

            <div className={styles.body}>
                <EmployeeSideBar />

                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default EmployeeLayout;