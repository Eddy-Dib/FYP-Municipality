import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./ReportEditor.module.css";

function ReportEditor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const getDefaultType = () => {
        switch (user?.role) {
            case "Engineer":
                return "Technical";
            case "Lawyer":
                return "Legal";
            case "Financial Staff":
                return "Financial";
            case "Secretary":
                return "Administrative";
            default:
                return "General";
        }
    };

    const handleSubmit = () => {
        const newReport = {
            taskId: id,
            title,
            content,
            type: getDefaultType(),
            date: new Date().toISOString().split("T")[0]
        };

        console.log("Saved report:", newReport);

        // later: send to backend here

        navigate("/employee/history");
    };

    return (
        <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <h1>Create Report</h1>

            <div className={styles.card}>
                <p><strong>Task ID:</strong> #{id}</p>
                <p><strong>Type:</strong> {getDefaultType()}</p>
            </div>

            <div className={styles.card}>
                <input
                    placeholder="Report Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder="Write your report..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className={styles.actions}>
                <button onClick={handleSubmit}>
                    Submit Report
                </button>
            </div>

        </div>
    );
}

export default ReportEditor;