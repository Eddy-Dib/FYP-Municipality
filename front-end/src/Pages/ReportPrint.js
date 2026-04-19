import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuPrinter } from "react-icons/lu";

import styles from "./ReportPrint.module.css";

function ReportPrint() {
    const location = useLocation();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const data = params.get("data");

        if (data) {
            try {
                const parsed = JSON.parse(decodeURIComponent(data));
                setReport(parsed);
            } catch (err) {
                console.error("Failed to parse report", err);
            }
        }
    }, [location.search]);

    const handlePrint = () => {
        window.print();
    };

    if (!report) {
        return (
            <div className={styles.page}>
                <h2>No report found</h2>
                <button onClick={() => navigate(-1)}>Go back</button>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <LuPrinter className={styles.printBtn} onClick={handlePrint} />

            <div className={styles.header}>
                <h1>{report.title}</h1>
                <p><strong>Type:</strong> {report.type}</p>
                <p><strong>Created by:</strong> {report.author || "Unknown"}</p>
                <p><strong>Role:</strong> {report.authorRole || "N/A"}</p>

                <p><strong>Task:</strong> {report.taskNumber} - {report.taskName}</p>
                <p><strong>Request:</strong> {report.requestNumber} ({report.requestType})</p>

                <p><strong>Completed:</strong> {report.completedDate || "N/A"}</p>
                <p><strong>Generated:</strong> {new Date(report.generatedAt).toLocaleString()}</p>
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