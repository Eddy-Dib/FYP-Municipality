import { useEffect, useState } from "react";
import axios from "axios";

import ReportCard from "../Components/Card/ReportCard";
import styles from "./Reports.module.css";

function Reports() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [reports, setReports] = useState([]);
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

        fetchHistory();
    }, [API_URL, token]);

    const openReport = (report) => {
        window.open(
            `/employee/report/print/${report.reportId}`, "_blank"
        );
    };

    if (loading) return <p style={{ padding: 20 }}>Loading history...</p>;
    if (error) return <p style={{ padding: 20 }}>{error}</p>;

    return (
        <>
            <h1 className={styles.title}>History</h1>

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
                            taskId={report.taskNumber}

                            date={report.completedDate}

                            onView={() => openReport(report)}
                            onDownload={() => openReport(report)}
                        />
                    ))
                )}
            </div>
        </>
    );
}

export default Reports;