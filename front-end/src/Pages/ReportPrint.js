import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { LuPrinter } from "react-icons/lu";
import styles from "./ReportPrint.module.css";

function ReportPrint() {
    const { id } = useParams();
    const API_URL = process.env.REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem("user"));

    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/employee/reports/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = res?.data?.data;

                if (!data) {
                    setReport(null);
                    return;
                }
                
                setReport({
                    ...data,
                    author: user?.name || "Unknown",
                    authorRole: user?.role || "N/A",
                    generatedAt: new Date().toISOString()
                });

            } catch (err) {
                console.error("Failed to fetch report", err);
                setReport(null);
            }
        };

        if (id) fetchReport();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (!report) {
        return (
            <div className={styles.page}>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <LuPrinter className={styles.printBtn} onClick={handlePrint} />

            <div className={styles.header}>
                <h1>{report.title}</h1>

                <p><strong>Type:</strong> {report.type}</p>

                <p><strong>Created by:</strong> {report.author}</p>
                <p><strong>Role:</strong> {report.authorRole}</p>

                <p>
                    <strong>Task:</strong> {report.taskNumber} - {report.taskName}
                </p>

                <p>
                    <strong>Request:</strong> {report.requestNumber} ({report.requestType})
                </p>

                <p>
                    <strong>Completed:</strong> {report.completedDate || "N/A"}
                </p>

                <p>
                    <strong>Generated:</strong>{" "}
                    {new Date(report.generatedAt).toLocaleString()}
                </p>
            </div>

            <div className={styles.content}>
                {report.description.split("\n").map((line, i) => {
                    const trimmed = line.trim();

                    if (trimmed.startsWith("# ")) {
                        return <h1 key={i}>{trimmed.replace("#", "").trim()}</h1>;
                    }

                    if (trimmed.startsWith("## ")) {
                        return <h2 key={i}>{trimmed.replace("##", "").trim()}</h2>;
                    }

                    if (trimmed.startsWith("### ")) {
                        return <h3 key={i}>{trimmed.replace("###", "").trim()}</h3>;
                    }

                    if (!trimmed) return <br key={i} />;

                    return <p key={i}>{trimmed}</p>;
                })}
            </div>
        </div>
    );
}

export default ReportPrint;