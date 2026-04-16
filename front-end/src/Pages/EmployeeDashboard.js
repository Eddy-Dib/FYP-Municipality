import { useEffect, useState } from "react";
import axios from "axios";

import SummaryCard from "../Components/Card/SummaryCard";
import { FaTasks, FaClock, FaExclamationTriangle, FaFileAlt } from "react-icons/fa";
import { PriorityBadge, StatusBadge } from "../Components/UI/Badge";

import styles from "./EmployeeDashboard.module.css";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [summaryData, setSummaryData] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(`${API_URL}/employee/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = res.data.data;

                setSummaryData([
                    {
                        title: "Assigned Tasks",
                        value: data.summary.assignedTasks,
                        subtitle: "Tasks currently assigned to you",
                        icon: <FaTasks />
                    },
                    {
                        title: "Pending Tasks",
                        value: data.summary.pendingTasks,
                        subtitle: "Waiting for action",
                        icon: <FaClock />
                    },
                    {
                        title: "Outstanding Tasks",
                        value: data.summary.overdueTasks,
                        subtitle: "Tasks past due date",
                        icon: <FaExclamationTriangle />
                    },
                    {
                        title: "Reports",
                        value: data.summary.reports,
                        subtitle: "Generated reports",
                        icon: <FaFileAlt />
                    }
                ]);

                setRecentTasks(data.recentTasks);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError(err.response?.data?.message || "Failed to load dashboard");

                if (err.response?.status === 401) {
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [navigate, API_URL]);

    if (loading) return <h1>Loading dashboard...</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <div>
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
                                <td>#{task.number}</td>
                                <td>{task.name}</td>
                                <td><StatusBadge value={task.status} /></td>
                                <td><PriorityBadge value={task.priority} /></td>
                                <td>{task.requestNumber}</td>
                                <td>{task.dueDate}</td>
                                <td>
                                    <button
                                        className={styles.viewBtn}
                                        onClick={() => navigate(`/employee/tasks/${task.id}`)}
                                    >
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