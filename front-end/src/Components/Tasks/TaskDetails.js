import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import { StatusBadge, PriorityBadge } from "../UI/Badge";
import styles from "./TaskDetails.module.css";

function TaskDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fakeTasks = [
        {
            id: "101",
            name: "Inspect Water Pipeline",
            status: "In Progress",
            priority: "High",
            assignedDate: "2026-04-01",
            assignedRole: "Engineer",
            request: {
                id: "REQ-5532",
                type: "Maintenance Request",
                status: "Submitted",
                description: {
                    location: "District A",
                    issue: "Water leak in main pipeline",
                    severity: "High"
                }
            }
        },
        {
            id: "102",
            name: "Approve Building Permit",
            status: "Pending",
            priority: "Medium",
            assignedDate: "2026-04-02",
            assignedRole: "Mayor",
            request: {
                id: "REQ-5511",
                type: "Building Permit",
                status: "Under Review",
                description: {
                    property_address: "123 Elm St",
                    contractor: "John Doe"
                }
            }
        }
    ];

    useEffect(() => {
        const foundTask = fakeTasks.find(t => t.id === id);

        if (!foundTask) {
            setError("Task not found");
            setLoading(false);
            return;
        }

        if (foundTask.assignedRole !== user?.role) {
            setError("You are not authorised to view this task");
            setLoading(false);
            return;
        }

        setTask(foundTask);
        setLoading(false);

    }, [id, user?.role]);

    const updateStatus = (newStatus) => {
        setTask(prev => {
            if (!prev) return prev;
            return { ...prev, status: newStatus };
        });
    };

    const renderActions = () => {
        switch (user?.role) {

            case "Engineer":
                return (
                    <>
                        <button onClick={() => updateStatus("In Progress")}>
                            Start Task
                        </button>

                        <button onClick={() => navigate(`/employee/tasks/${task.id}/report`)}>
                            Write Technical Report
                        </button>

                        <button onClick={() => updateStatus("Done")}>
                            Mark Completed
                        </button>
                    </>
                );

            case "Mayor":
                return (
                    <>
                        <button>Approve</button>
                        <button>Reject</button>
                    </>
                );

            case "Lawyer":
                return (
                    <>
                        <button>Flag Case</button>
                        <button>Write Report</button>
                    </>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return <p style={{ padding: 20 }}>Loading...</p>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>

                <h1 className={styles.title}>{error}</h1>
            </div>
        );
    }

    const requestDetails = task.request.description;

    return (
        <div className={styles.container}>

            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <h1 className={styles.title}>Task Details</h1>

            <div className={styles.card}>
                <h2>{task.name}</h2>

                <p><strong>ID:</strong> #{task.id}</p>

                <div className={styles.badges}>
                    <StatusBadge value={task.status} />
                    <PriorityBadge value={task.priority} />
                </div>

                <p><strong>Assigned:</strong> {task.assignedDate}</p>
            </div>

            <div className={styles.card}>
                <h2>Request</h2>

                <p><strong>Type:</strong> {task.request.type}</p>
                <p><strong>Status:</strong> {task.request.status}</p>

                <div className={styles.requestDetails}>
                    {Object.entries(requestDetails).map(([k, v]) => (
                        <p key={k}>
                            <strong>{k.replaceAll("_", " ")}:</strong> {v}
                        </p>
                    ))}
                </div>
            </div>

            <div className={styles.actions}>
                {renderActions()}
            </div>

        </div>
    );
}

export default TaskDetails;