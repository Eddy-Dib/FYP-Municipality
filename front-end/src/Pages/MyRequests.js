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
                const res = await axios.get(`${API_URL}/api/citizen/my-activity`, {
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

    return (
        <div className={styles.page}>
            <h2>My Requests & Complaints</h2>

            {/* REQUESTS */}
            <h3>Requests</h3>
            <div className={styles.grid}>
                {requests.map(r => (
                    <div key={r.Req_ID} className={styles.card}>
                        <h4>{r.RType_Name}</h4>
                        <p>ID: #{r.Req_ID}</p>
                        <p>Status: {r.RStat_Name}</p>
                        <p>Priority: {r.Priority}</p>
                        <p>Date: {new Date(r.DateMade).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            {/* COMPLAINTS */}
            <h3>Complaints</h3>
            <div className={styles.grid}>
                {complaints.map(c => (
                    <div key={c.Cmpt_ID} className={styles.card}>
                        <h4>{c.Subject}</h4>
                        <p>Type: {c.CType_Name}</p>
                        <p>Date: {new Date(c.DateMade).toLocaleDateString()}</p>

                        <p>
                            Status: {
                                c.DateResolved
                                    ? "Resolved"
                                    : c.DateRejected
                                        ? "Rejected"
                                        : "Pending"
                            }
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyRequests;
