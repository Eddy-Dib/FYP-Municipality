import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MayorDashboard.module.css";

const API = process.env.REACT_APP_API_URL;

export default function MayorRequests() {
    const [requests, setRequests] = useState([]);

    /* =========================
       FETCH REQUESTS (FIXED WITH TOKEN)
    ========================= */
   const fetchRequests = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("USER FROM STORAGE:", user);

    axios.get(`${API}/api/requests`, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    })
    .then(res => {
        console.log("REQUESTS RESPONSE:", res.data);
        setRequests(res.data.data || []);
    })
    .catch(err => console.log("ERROR:", err.response?.data || err));
};

    /* =========================
       HANDLE ACTION
    ========================= */
    const handleAction = async (id, action) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            await axios.patch(
                `${API}/api/requests/${id}/status`,
                { action },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`
                    }
                }
            );

            fetchRequests();

        } catch (err) {
            console.log(err);
        }
    };

    /* =========================
       UI
    ========================= */
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2>Requests</h2>

                {requests.length === 0 ? (
                    <p>No requests available</p>
                ) : (
                    requests.map((r) => (
                        <div key={r.Req_ID} className={styles.card}>

                            <h3>
                                {typeof r.Description === "string"
                                    ? r.Description
                                    : JSON.stringify(r.Description)}
                            </h3>

                            <p><strong>Status:</strong> {r.RStat_Code}</p>

                            <div style={{ marginTop: "10px" }}>

                                <button
                                    onClick={() => handleAction(r.Req_ID, "approve")}
                                    style={{
                                        marginRight: "10px",
                                        padding: "6px 12px",
                                        backgroundColor: "green",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() => handleAction(r.Req_ID, "reject")}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "red",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    Reject
                                </button>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}