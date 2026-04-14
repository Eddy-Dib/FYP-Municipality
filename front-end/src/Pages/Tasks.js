import { useState } from "react";

import TaskCard from "../Components/Card/TaskCard";

import styles from "./Tasks.module.css";

function Tasks() {

    const [filter, setFilter] = useState("All");

    const tasks = [
        {
            number: 101,
            priority: "High",
            title: "Inspect Water Pipeline",
            requestId: "REQ-5532",
            dueDate: "2026-04-15",
            status: "In Progress"
        },
        {
            number: 102,
            priority: "Medium",
            title: "Approve Building Permit",
            requestId: "REQ-5511",
            dueDate: "2026-04-18",
            status: "Pending"
        },
        {
            number: 103,
            priority: "Low",
            title: "Road Damage Report Review",
            requestId: "REQ-5499",
            dueDate: "2026-04-10",
            status: "Done"
        }
    ];

    const filteredTasks = tasks.filter(task => {
        if (filter === "All") return true;
        if (filter === "High Priority") return task.priority === "High";
        if (filter === "Pending") return task.status === "Pending";
        if (filter === "In Progress") return task.status === "In Progress";
        return true;
    });

    return (
        <div>

            <h1 className={styles.title}>Tasks</h1>

            <div className={styles.ribbon}>
                {["All", "High Priority", "Pending", "In Progress"].map(tab => (
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
                        key={task.number}
                        number={task.number}
                        priority={task.priority}
                        title={task.title}
                        requestId={task.requestId}
                        dueDate={task.dueDate}
                        status={task.status}
                        onClick={() => console.log("Open task", task.number)}
                    />
                ))}
            </div>

        </div>
    );
}

export default Tasks;