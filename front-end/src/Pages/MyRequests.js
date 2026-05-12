import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyRequests.module.css";

function MyRequests() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [requests, setRequests] = useState([]);
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/my-requests`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setRequests(res.data.data.requests);
                setComplaints(res.data.data.complaints);

            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const formatPriority = (value) => {
        switch (Number(value)) {
            case 4:
                return "Urgent";
            case 3:
                return "High";
            case 2:
                return "Medium";
            case 1:
            default:
                return "Low";
        }
    };

    const isEmpty =
        (!requests || requests.length === 0) &&
        (!complaints || complaints.length === 0);

    return (
        <div className={styles.page}>

            {/* HERO */}
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1>My Requests & Complaints</h1>
                        <p>Review your submissions and track their real-time status</p>
                    </div>
                </div>
            </div>

            {/* EMPTY STATE */}
            {isEmpty && (
                <div className={styles.emptyState}>
                    <h2>Nothing submitted yet</h2>
                    <p>Your requests and complaints will appear here once you submit them.</p>
                </div>
            )}

            {/* REQUESTS */}
            {requests.length > 0 && (<h1 className={styles.sectionTitle}>Requests</h1>)}
            {requests.map(r => (
                <div key={r.Req_ID} className={styles.cardFull}>
                    <div className={styles.cardHeader}>
                        <h3>{r.RType_Name}</h3>
                        <span className={styles.badge}>{r.RStat_Name}</span>
                    </div>

                    <div className={styles.cardBody}>
                        <p><b>ID:</b> {r.Request_Number}</p>
                        <p><b>Priority:</b> {formatPriority(r.Priority)}</p>
                        <p><b>Date:</b> {new Date(r.DateMade).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}

            {/* COMPLAINTS */}
            {complaints.length > 0 && (<h1 className={styles.sectionTitle}>Complaints</h1>)}

            {complaints.map(c => (
                <div key={c.Cmpt_ID} className={styles.cardFull}>
                    <div className={styles.cardHeader}>
                        <h3>{c.Subject}</h3>
                        <span className={styles.badge}>
                            {c.DateResolved
                                ? "Resolved"
                                : c.DateRejected
                                    ? "Rejected"
                                    : "Pending"}
                        </span>
                    </div>

                    <div className={styles.cardBody}>
                        <p><b>Type:</b> {c.CType_Name}</p>
                        <p><b>Date:</b> {new Date(c.DateMade).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}

        </div>
    );
}

export default MyRequests;