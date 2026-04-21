import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MayorDashboard.module.css";

const API = process.env.REACT_APP_API_URL;

export default function MayorAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        axios.get(`${API}/api/alerts`)
            .then(res => setAlerts(res.data.data || []))
            .catch(err => console.log(err));
    }, []);

    const sendAlert = () => {
        if (!alertMessage.trim()) return;

        axios.post(`${API}/api/alerts`, {
            message: alertMessage
        })
            .then(res => {
                setAlerts(prev => [...prev, res.data.data]);
                setAlertMessage("");
            })
            .catch(err => console.log(err));
    };

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2>Alerts</h2>

                <textarea
                    placeholder="Write alert..."
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                />

                <br />

                <button className={styles.send} onClick={sendAlert}>
                    Send Alert
                </button>

                <h3>All Alerts</h3>

                {alerts.map((a) => (
                    <div key={a.Notif_ID} className={styles.card}>
                        <p>{a.Text || a.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}