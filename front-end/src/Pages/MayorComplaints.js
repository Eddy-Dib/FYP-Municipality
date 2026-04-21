import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MayorComplaints.module.css";
import ComplaintCard from "../Components/Card/ComplaintsCard";

const API_URL = process.env.REACT_APP_API_URL;

export default function MayorComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH =================
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${API_URL}/employee/complaints`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setComplaints(res.data.data || []);
                setError("");
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                    "Failed to load complaints"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    // ================= RESOLVE =================
    const resolveComplaint = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.patch(
                `${API_URL}/employee/complaints/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setComplaints(prev =>
                prev.map(c =>
                    c.Cmpt_ID === id
                        ? { ...c, DateResolved: new Date() }
                        : c
                )
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Failed to resolve complaint"
            );
        }
    };

    // ================= DELETE =================
    const deleteComplaint = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `${API_URL}/employee/complaints/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setComplaints(prev =>
                prev.filter(c => c.Cmpt_ID !== id)
            );
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Failed to delete complaint"
            );
        }
    };

    // ================= UI STATES =================
    if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.stateMessage}>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1 className={styles.stateMessage} style={{ color: "red" }}>
                    {error}
                </h1>
            </div>
        );
    }

    return (
        <div className={styles.container}>

            <h2 className={styles.title}>Complaints</h2>

            {complaints.length === 0 ? (
                <p className={styles.empty}>No complaints found</p>
            ) : (
                <div className={styles.cardContainer}>
                    {complaints.map((c) => (
                        <ComplaintCard
                            key={c.Cmpt_ID}
                            complaint={c}
                            onResolve={resolveComplaint}
                            onDelete={deleteComplaint}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}