import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TaskCard from "../Components/Card/TaskCard";
import styles from "./Tasks.module.css";

function Tasks() {
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [filter, setFilter] = useState("All");
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${API_URL}/employee/dashboard`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const backendTasks = res.data.data.recentTasks;

                const formattedTasks = backendTasks.map(task => ({
                    id: task.id,
                    number: task.number,
                    priority: task.priority,
                    title: task.name,
                    requestId: task.requestId,
                    requestNum: task.requestNum,
                    dueDate: task.dueDate,
                    status: task.status
                }));

                setTasks(formattedTasks);

            } catch (err) {
                console.error("Tasks fetch error:", err);
                setError(
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load tasks"
                );

                if (err.response?.status === 401) {
                    localStorage.clear();
                    sessionStorage.clear();
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [navigate]);

    const filteredTasks = tasks.filter(task => {
        if (filter === "All") return true;
        if (filter === "High Priority") return task.priority === "High";
        if (filter === "Pending") return task.status === "Pending";
        if (filter === "In Progress") return task.status === "In Progress";
        if (filter === "Overdue") {
            const today = new Date();
            const dueDate = new Date(task.dueDate);

            return ( task.status !== "Completed" && dueDate <= today);
        }
        return true;
    });

    if (loading) return <h1>Loading tasks...</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <div>
            <h1 className={styles.title}>Tasks</h1>

            <div className={styles.ribbon}>
                {["All", "High Priority", "Pending", "In Progress", "Overdue"].map(tab => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${filter === tab ? styles.active : ""}`}
                        onClick={() => setFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={styles.list}>
                {filteredTasks.map(task => (
                    <TaskCard
                        key={task.id}
                        number={task.number}
                        priority={task.priority}
                        title={task.title}
                        requestId={task.requestNum}
                        dueDate={task.dueDate}
                        status={task.status}
                        onClick={() =>
                            navigate(`/employee/tasks/${task.id}`)
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export default Tasks;