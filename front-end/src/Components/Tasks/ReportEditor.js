import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import SuccessToast from "../UI/SuccessToast";
import axios from "axios";
import styles from "./ReportEditor.module.css";

function ReportEditor() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const getDefaultType = () => {
        switch (user?.role) {
            case "Engineer":
                return "Technical Report";
            case "Lawyer":
                return "Legal Review";
            case "Financial Staff":
                return "Financial Report";
            case "Secretary":
                return "Secretary Summary";
            case "Admin":
                return "Administrative Report";
            case "Mayor":
                return "Mayoral Report";
            default:
                return "General Service Report";
        }
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get(
                    `${API_URL}/employee/report/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const report = res?.data?.data?.report;

                if (report) {
                    setTitle(report.title || "");
                    setContent(report.description || "");
                }

            } catch (err) {
                console.error(err?.response?.data);
                setError("Failed to load report");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const handleSubmit = async () => {
        try {
            await axios.post(
                `${API_URL}/employee/report/${id}`,
                {
                    title,
                    description: content,

                    type: getDefaultType()
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setShowToast(true);

        } catch (err) {
            console.error(err?.response?.data);
            setError("Failed to save report");
        }
    };

    if (loading) return <h1>Loading...</h1>;

    if (error) return <h1>{error}</h1>;

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

            {showToast && (
                <SuccessToast
                    message="Success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}

export default ReportEditor;