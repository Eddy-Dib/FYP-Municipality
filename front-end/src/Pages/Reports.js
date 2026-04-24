import { useEffect, useState } from "react";
import axios from "axios";

import ReportCard from "../Components/Card/ReportCard";
import TaskCard from "../Components/Card/TaskCard";
import styles from "./Reports.module.css";

function Reports() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [reports, setReports] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get(
                    `${API_URL}/employee/reports/history`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setReports(res?.data?.data || []);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                    "Failed to load report history"
                );
            } finally {
                setLoading(false);
            }
        };
        const fetchTasks = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/employee/tasks/history`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setTasks(res?.data?.data || []);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                    "Failed to load task history"
                );
            }
        };

        fetchHistory();
        fetchTasks();
    }, []);

    const openReport = (report) => {
        window.open(
            `/employee/report/print/${report.reportId}`, "_blank"
        );
    };

    if (loading) return <p style={{ padding: 20 }}>Loading history...</p>;
    if (error) return <p style={{ padding: 20 }}>{error}</p>;

    return (
        <>
            <h1 className={styles.title}>Reports History</h1>

            <div className={styles.list}>
                {reports.length === 0 ? (
                    <p>No completed reports yet.</p>
                ) : (
                    reports.map((report) => (
                        <ReportCard
                            key={report.reportId}

                            title={report.title}
                            type={report.type}

                            requestId={report.requestNumber}
                            requestName={report.requestType}

                            taskId={report.taskNumber}
                            taskName={report.taskName}

                            citizenName={report.citizenName}

                            date={report.completedDate}

                            onDownload={() => openReport(report)}
                        />
                    ))
                )}
            </div>

            <h2 className={styles.title}>Tasks History</h2>

            <div className={styles.list}>
                {tasks.length === 0 ? (
                    <p>No completed tasks yet.</p>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.taskId}
                            number={task.taskNumber}
                            title={task.taskName}
                            requestId={task.requestNumber}
                            priority={task.priority}
                            dueDate={task.completedDate}
                            status={task.status}
                            onClick={() => console.log(task)}
                        />
                    ))
                )}
            </div>
        </>
    );
}

export default Reports;