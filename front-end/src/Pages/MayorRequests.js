import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MayorDashboard.module.css";

const API = process.env.REACT_APP_API_URL;

export default function MayorRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        axios.get(`${API}/api/requests`)
            .then(res => setRequests(res.data.data || []))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2>Requests</h2>

                {requests.map((r) => (
                    <div key={r.Req_ID} className={styles.card}>
                        <h3>{JSON.stringify(r.Description)}</h3>
                        <p>Status: {r.RStat_Code}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}