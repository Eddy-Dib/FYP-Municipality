import SummaryCard from "../Components/Card/SummaryCard";

import { FaTasks, FaClock, FaBell, FaFileAlt } from "react-icons/fa";
import { PriorityBadge, StatusBadge } from "../Components/UI/Badge";

import styles from "./EmployeeDashboard.module.css";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {

    const summaryData = [
        {
            title: "Assigned Tasks",
            value: 12,
            subtitle: "Tasks currently assigned to you",
            icon: <FaTasks />
        },
        {
            title: "Pending Tasks",
            value: 5,
            subtitle: "Waiting for action",
            icon: <FaClock />
        },
        {
            title: "Notifications",
            value: 3,
            subtitle: "Unread updates",
            icon: <FaBell />
        },
        {
            title: "Reports",
            value: 2,
            subtitle: "Generated this week",
            icon: <FaFileAlt />
        }
    ];

    const recentTasks = [
        {
            id: 101,
            name: "Inspect Water Pipeline",
            status: "In Progress",
            priority: "High",
            requestId: "REQ-5532",
            dueDate: "2026-04-15"
        },
        {
            id: 102,
            name: "Approve Building Permit",
            status: "Pending",
            priority: "Medium",
            requestId: "REQ-5511",
            dueDate: "2026-04-18"
        },
        {
            id: 103,
            name: "Road Damage Report Review",
            status: "Done",
            priority: "Low",
            requestId: "REQ-5499",
            dueDate: "2026-04-10"
        },
        {
            id: 101,
            name: "Inspect Water Pipeline",
            status: "In Progress",
            priority: "High",
            requestId: "REQ-5532",
            dueDate: "2026-04-15"
        },
        {
            id: 102,
            name: "Approve Building Permit",
            status: "Pending",
            priority: "Medium",
            requestId: "REQ-5511",
            dueDate: "2026-04-18"
        },
        {
            id: 103,
            name: "Road Damage Report Review",
            status: "Done",
            priority: "Low",
            requestId: "REQ-5499",
            dueDate: "2026-04-10"
        },
        {
            id: 101,
            name: "Inspect Water Pipeline",
            status: "In Progress",
            priority: "High",
            requestId: "REQ-5532",
            dueDate: "2026-04-15"
        },
        {
            id: 102,
            name: "Approve Building Permit",
            status: "Pending",
            priority: "Medium",
            requestId: "REQ-5511",
            dueDate: "2026-04-18"
        },
        {
            id: 103,
            name: "Road Damage Report Review",
            status: "Done",
            priority: "Low",
            requestId: "REQ-5499",
            dueDate: "2026-04-10"
        }
    ];

    const navigate = useNavigate();

    return (
        <div >
            <h1>Dashboard</h1>

            <div className={styles.summaryGrid}>
                {summaryData.map((item, index) => (
                    <SummaryCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        onClick={() => console.log(item.title)}
                    />
                ))}
            </div>

            <h1>Recent Tasks</h1>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Task ID</th>
                            <th>Task Name</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Request ID</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {recentTasks.map(task => (
                            <tr key={task.id}>
                                <td>#{task.id}</td>
                                <td>{task.name}</td>
                                <td><StatusBadge value={task.status} /></td>
                                <td><PriorityBadge value={task.priority} /></td>
                                <td>{task.requestId}</td>
                                <td>{task.dueDate}</td>
                                <td>
                                    <button className={styles.viewBtn}
                                        onClick={() => navigate(`/employee/tasks/${task.id}`)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeDashboard;