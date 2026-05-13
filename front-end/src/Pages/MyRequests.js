import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyRequests.module.css";

function MyRequests() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [requests, setRequests] = useState([]);
    const [complaints, setComplaints] = useState([]);

    const [openRequest, setOpenRequest] = useState(null);
    const [openComplaint, setOpenComplaint] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/my-requests`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setRequests(res.data.data.requests || []);
                setComplaints(res.data.data.complaints || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const formatPriority = (value) => {
        switch (Number(value)) {
            case 4: return "Urgent";
            case 3: return "High";
            case 2: return "Medium";
            case 1:
            default: return "Low";
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

            {/* EMPTY */}
            {isEmpty && (
                <div className={styles.emptyState}>
                    <h2>Nothing submitted yet</h2>
                    <p>Your requests and complaints will appear here once you submit them.</p>
                </div>
            )}

            {/* ================= REQUESTS ================= */}
            {requests.length > 0 && (
                <h1 className={styles.sectionTitle}>Requests</h1>
            )}

            {requests.map(r => (
                <div key={r.Req_ID} className={styles.cardFull}>

                    <div
                        className={styles.cardHeader}
                        onClick={() =>
                            setOpenRequest(openRequest === r.Req_ID ? null : r.Req_ID)
                        }
                    >
                        <div>
                            <h3>{r.RType_Name}</h3>
                            <p className={styles.smallText}>
                                {new Date(r.DateMade).toLocaleDateString()}
                            </p>
                        </div>

                        <div className={styles.headerRight}>
                            <span className={styles.badge}>{r.RStat_Name}</span>
                            <span className={styles.arrow}>
                                {openRequest === r.Req_ID ? "▲" : "▼"}
                            </span>
                        </div>
                    </div>

                    {openRequest === r.Req_ID && (
                        <div className={styles.cardBody}>

                            <p><b>ID:</b> {r.Request_Number}</p>
                            <p><b>Type:</b> {r.RType_Name}</p>
                            <p><b>Status:</b> {r.RStat_Name}</p>
                            <p><b>Priority:</b> {formatPriority(r.Priority)}</p>
                            <p><b>Date:</b> {new Date(r.DateMade).toLocaleDateString()}</p>

                            <p><b>Full Name:</b> {r.FullName}</p>
                            <p><b>Email:</b> {r.Email}</p>
                            <p><b>Phone:</b> {r.Phone1}{r.Phone2 ? `, ${r.Phone2}` : ""}</p>
                            <p><b>Address:</b> {r.Address}</p>
                            <p><b>Description:</b> {r.Details}</p>
                            <p><b>Urgency:</b> {r.Urgency}</p>

                            {r.DateCompleted && (
                                <p>
                                    <b>Completed:</b>{" "}
                                    {new Date(r.DateCompleted).toLocaleDateString()}
                                </p>
                            )}

                        </div>
                    )}
                </div>
            ))}

            {/* ================= COMPLAINTS ================= */}
            {complaints.length > 0 && (
                <h1 className={styles.sectionTitle}>Complaints</h1>
            )}

            {complaints.map(c => (
                <div key={c.Cmpt_ID} className={styles.cardFull}>

                    <div
                        className={styles.cardHeader}
                        onClick={() =>
                            setOpenComplaint(openComplaint === c.Cmpt_ID ? null : c.Cmpt_ID)
                        }
                    >
                        <div>
                            <h3>{c.Subject}</h3>
                            <p className={styles.smallText}>
                                {new Date(c.DateMade).toLocaleDateString()}
                            </p>
                        </div>

                        <div className={styles.headerRight}>
                            <span className={styles.badge}>
                                {c.DateResolved
                                    ? "Resolved"
                                    : c.DateRejected
                                        ? "Rejected"
                                        : "Pending"}
                            </span>

                            <span className={styles.arrow}>
                                {openComplaint === c.Cmpt_ID ? "▲" : "▼"}
                            </span>
                        </div>
                    </div>

                    {openComplaint === c.Cmpt_ID && (
                        <div className={styles.cardBody}>

                            <p><b>ID:</b> {c.Cmpt_ID}</p>
                            <p><b>Type:</b> {c.CType_Name}</p>
                            <p><b>Status:</b>
                                {c.DateResolved
                                    ? "Resolved"
                                    : c.DateRejected
                                        ? "Rejected"
                                        : "Pending"}
                            </p>

                            <p><b>Date:</b> {new Date(c.DateMade).toLocaleDateString()}</p>

                           <div>
    <b>Description:</b>

    <div className={styles.descriptionBox}>
        {(c.Details || "No description provided")
            .split("\n")
            .map((line, index) => (
                <p key={index} className={styles.descriptionLine}>
                    {line}
                </p>
            ))}
    </div>
</div>

                            {c.DateResolved && (
                                <p>
                                    <b>Resolved:</b>{" "}
                                    {new Date(c.DateResolved).toLocaleDateString()}
                                </p>
                            )}

                            {c.DateRejected && (
                                <p>
                                    <b>Rejected:</b>{" "}
                                    {new Date(c.DateRejected).toLocaleDateString()}
                                </p>
                            )}

                        </div>
                    )}
                </div>
            ))}

        </div>
    );
}

export default MyRequests;