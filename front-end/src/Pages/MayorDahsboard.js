import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MayorDashboard.module.css";

const API = process.env.REACT_APP_API_URL;

export default function MayorDashboard() {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        axios.get(`${API}/api/complaints`)
            .then(res => setComplaints(res.data.data || []))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className={styles.container}>

            <div className={styles.stats}>
                {[
                    { title: "Population", value: "284,592" },
                    { title: "Annual Budget", value: "$156.2M" },
                    { title: "Active Complaints", value: complaints.length },
                    { title: "Resolved This Month", value: "342" },
                    { title: "Revenue Growth", value: "6.8%" },
                    { title: "Departments", value: "18" },
                ].map((item, i) => (
                    <div key={i} className={styles.card}>
                        <h3>{item.title}</h3>
                        <p>{item.value}</p>
                    </div>
                ))}
            </div>

            <div className={styles.section}>
                <h2>Monthly Financial Overview</h2>
                <div className={styles.chart}>Chart goes here</div>
            </div>

            <div className={styles.section}>
                <h2>Recent Activity</h2>
                <ul>
                    <li>New complaint submitted about road damage</li>
                    <li>Budget updated for infrastructure department</li>
                    <li>20 complaints resolved today</li>
                </ul>
            </div>
        </div>
    );
}