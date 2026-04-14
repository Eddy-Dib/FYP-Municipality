import styles from "./EmployeeSidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function EmployeeSideBar({ extraItems = [] }) {
    const navigate = useNavigate();
    const location = useLocation();

    const baseItems = [
        { label: "Home", path: "/employee" },
        { label: "Tasks", path: "/employee/tasks" },
        { label: "Reports", path: "/employee/reports" }
    ];

    const items = [...baseItems, ...extraItems];

    const isActive = (path) => {
        if (path === "/employee") {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={styles.sidebar}>
            {items.map((item, index) => (
                <button key={index}
                    className={`${styles.item} ${isActive(item.path) ? styles.active : ""}`}
                    onClick={() => navigate(item.path)}>

                    {item.label}
                </button>
            ))}
        </aside>
    );
}

export default EmployeeSideBar;