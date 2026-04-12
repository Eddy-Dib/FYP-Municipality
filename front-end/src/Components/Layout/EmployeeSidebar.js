import styles from "./EmployeeSidebar.module.css";
import { useNavigate } from "react-router-dom";

function EmployeeSideBar({ extraItems = [] }) {
    const navigate = useNavigate();

    const baseItems = [
        { label: "Home", path: "/employee" },
        { label: "Tasks", path: "/employee/tasks" },
        { label: "Reports", path: "/employee/reports" }
    ];

    const items = [...baseItems, ...extraItems];

    return (
        <aside className={styles.sidebar}>
            {items.map((item, index) => (
                <button
                    key={index}
                    className={styles.item}
                    onClick={() => navigate(item.path)}
                >
                    {item.label}
                </button>
            ))}
        </aside>
    );
}

export default EmployeeSideBar;