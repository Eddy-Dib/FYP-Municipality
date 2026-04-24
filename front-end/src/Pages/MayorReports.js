import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MayorReports.module.css";

const API = process.env.REACT_APP_API_URL;

export default function MayorReports() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        axios.get(`${API}/api/reports`)
            .then(res => setReports(res.data.data || []))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2>Employee Reports</h2>

                {reports.length === 0 ? (
                    <p>No reports available</p>
                ) : (
                    reports.map((r) => (
                        <div key={r.Report_ID} className={styles.card}>
                            <h3>{r.Title}</h3>
                            <p>{r.Description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}