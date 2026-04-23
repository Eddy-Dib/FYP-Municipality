import styles from "./EmployeeSidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";

function EmployeeSideBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    const baseItems = [
        { label: "Home", path: "/employee" },
        { label: "Tasks", path: "/employee/tasks" },
        { label: "Reports", path: "/employee/reports"}
    ];

    let roleItems = [];

    switch (user?.role) {
        case "Admin":
            roleItems = [
                { label: "User Management", path: "/employee/admin/users" },
                { label: "Assign Roles", path: "/employee/admin/roles" },
                { label: "Services Config", path: "/employee/admin/services" },
                { label: "System Logs", path: "/employee/admin/logs" }
            ];
            break;

        case "Mayor":
            roleItems = [
                { label: "Dashboard", path: "/employee/mayor/dashboard" },
                { label: "Review Requests", path: "/employee/mayor/requests" },
                { label: "Employee Reports", path: "/employee/mayor/reports" },
                { label: "Complaints", path: "/employee/mayor/complaints" },
                { label: "Send Alerts", path: "/employee/mayor/alerts" }
            ];
            break;

        case "Secretary":
            roleItems = [
                { label: "Register Request", path: "/employee/secretary/register" },
                { label: "Verify Documents", path: "/employee/secretary/verify" },
                { label: "Manage Requests", path: "/employee/secretary/requests" },
                { label: "Events", path: "/employee/secretary/events" },
                { label: "Announcements", path: "/employee/secretary/announcements" },
                { label: "Print Documents", path: "/employee/secretary/print" }
            ];
            break;

        case "Engineer":
            roleItems = [
                { label: "Schedule Inspections", path: "/employee/engineer/inspections" },
                { label: "Technical Report", path: "/employee/engineer/report" }
            ];
            break;

        case "Lawyer":
            roleItems = [
                { label: "Legal Cases", path: "/employee/lawyer/cases" },
                { label: "Validate Permits", path: "/employee/lawyer/permits" },
                { label: "Legal Report", path: "/employee/lawyer/report" }
            ];
            break;

        case "Financial Staff":
            roleItems = [
                { label: "Set Fees", path: "/employee/finance/fees" },
                { label: "Unpaid Fees", path: "/employee/finance/unpaid" },
                { label: "Review Payments", path: "/employee/finance/payments" }
            ];
            break;

        case "Staff":
            roleItems = [
                { label: "General Tasks", path: "/employee/staff/tasks" }
            ];
            break;

        default:
            roleItems = [];
    }

    const items = [...baseItems, ...roleItems];

    const isActive = (path) => {
        if (path === "/employee") {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={styles.sidebar}>
            {items.map((item, index) => (
                <button
                    key={index}
                    className={`${styles.item} ${isActive(item.path) ? styles.active : ""}`}
                    onClick={() => navigate(item.path)}
                >
                    {item.label}
                </button>
            ))}
        </aside>
    );
}

export default EmployeeSideBar;