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

                const res = await axios.get(
                    `${API_URL}/employee/tasks/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setData(res?.data?.data || null);

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

    const updateStatus = (newStatus) => {
        setData(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                task: {
                    ...prev.task,
                    status: newStatus
                }
            };
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

                        <button
                            onClick={() =>
                                navigate(`/employee/tasks/${id}/report`)
                            }
                        >
                            Write Technical Report
                        </button>

                        <button onClick={() => updateStatus("Completed")}>
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
                {renderActions()}
            </div>

        </div>
    );
}

export default TaskDetails;