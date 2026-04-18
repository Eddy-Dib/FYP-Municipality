import styles from "./Badge.module.css";
import { FaExclamationTriangle, FaClock, FaSpinner, FaCheckCircle } from "react-icons/fa";

export function PriorityBadge({ value }) {
    const priorityConfig = {
        High: {
            label: "High",
            className: "high",
            icon: <FaExclamationTriangle />
        },
        Medium: {
            label: "Medium",
            className: "medium",
            icon: null
        },
        Low: {
            label: "Low",
            className: "low",
            icon: null
        }
    };

    const config = priorityConfig[value] || priorityConfig.Low;

    return (
        <span className={`${styles.badge} ${styles[config.className]}`}>
            {config.icon && <span className={styles.icon}>{config.icon}</span>}
            {config.label}
        </span>
    );
}

export function StatusBadge({ value }) {
    const statusConfig = {
        "In Progress": {
            label: "In Progress",
            className: "inProgress",
            icon: <FaSpinner />
        },
        Pending: {
            label: "Pending",
            className: "pending",
            icon: <FaClock />
        },
        Completed: {
            label: "Completed",
            className: "done",
            icon: <FaCheckCircle />
        }
    };

    const config = statusConfig[value] || statusConfig.Pending;

    return (
        <span className={`${styles.badge} ${styles[config.className]}`}>
            {config.icon && <span className={styles.icon}>{config.icon}</span>}
            {config.label}
        </span>
    );
}