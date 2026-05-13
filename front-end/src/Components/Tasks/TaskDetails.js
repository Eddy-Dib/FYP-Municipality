import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import TaskDetailsCard from "../Card/TaskDetailsCard";
import RequestDetailsCard from "../Card/RequestDetailsCard";
import ReportDetailsCard from "../Card/ReportDetailsCard";

import styles from "./TaskDetails.module.css";
import axios from "axios";

function TaskDetails() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                setError("");
                setData(null);

                const res = await axios.get(`${API_URL}/employee/tasks/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setData(res?.data?.data || null);
                console.log("FULL BACKEND RESPONSE:", res.data);

            } catch (err) {
                const backendMessage =
                    err?.response?.data?.message ||
                    "Failed to load task details";

                setError(backendMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const updateStatus = async (newStatus) => {
        try {
            await axios.patch(`${API_URL}/employee/tasks/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setData(prev => {
                if (!prev) return prev;

                const isCompleted = newStatus === "Completed";

                let requestStatus = prev.request?.status;

                if (newStatus === "In Progress") {
                    requestStatus = "In Progress";
                }

                if (newStatus === "Rejected" || newStatus === "Cancelled") {
                    requestStatus = "Rejected";
                }

                return {
                    ...prev,

                    task: {
                        ...prev.task,
                        status: newStatus,
                        completedDate: isCompleted
                            ? new Date().toISOString()
                            : null
                    },

                    request: {
                        ...prev.request,
                        status: requestStatus
                    }
                };
            });
        } catch (err) {
            console.error(err?.response?.data);
            setError("Failed to update status");
        }
    };

    const renderActions = () => {
        switch (user?.role) {
            case "Engineer":
                return (
                    <>
                    </>
                );

            case "Lawyer":
                return (
                    <>
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

    return (
        <div className={styles.container}>

            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <h1 className={styles.title}>Task Details</h1>
            <div className={styles.cardContainer}>
                <TaskDetailsCard task={data?.task} />
                <RequestDetailsCard request={data?.request} />
                <ReportDetailsCard report={data?.report} />
            </div>

            <div className={styles.actions}>
                {data?.task?.status === "Pending" && (
                    <button
                        className={styles.startTaskBtn}
                        onClick={() => updateStatus("In Progress")}
                    >
                        Start Task
                    </button>
                )}

                {data?.task?.status === "In Progress" && (
                    <button
                        className={styles.completeTaskBtn}
                        onClick={() => updateStatus("Completed")}
                        disabled={!data?.report}
                        title={!data?.report ? "Write a report before completing the task" : ""}
                    >
                        Mark Completed
                    </button>
                )}

                {data?.task?.status === "Completed" && (
                    <button
                        className={styles.completeTaskBtn}
                        onClick={() => updateStatus("In Progress")}
                    >
                        Undo Completion
                    </button>
                )}

                {user?.isEmployee && (
                    <button
                        className={styles.writeReportBtn}
                        onClick={() =>
                            navigate(`/employee/tasks/${id}/report`)
                        }
                    >
                        {data?.report ? "Edit Report" : "Write Report"}
                    </button>
                )}

                {renderActions()}
            </div>
            {data?.task?.status === "In Progress" && (
                <p className={styles.msg}>You must submit a report befor completing this task.</p>
            )}

        </div>
    );
}

export default TaskDetails;