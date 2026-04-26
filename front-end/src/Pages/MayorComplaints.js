import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MayorComplaints.module.css";
import ComplaintCard from "../Components/Card/ComplaintsCard";

const API_URL = process.env.REACT_APP_API_URL;

export default function MayorComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${API_URL}/employee/complaints`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setComplaints(res.data.data || []);
                setError("");
            } catch (err) {
                setError(
                    err?.response?.data?.message || "Failed to load complaints"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const filteredComplaints = complaints.filter((c) => {
        const isResolved = !!c.DateResolved;
        const isRejected = !!c.DateRejected;
        const isPending = !isResolved && !isRejected;

        if (filter === "resolved") return isResolved;
        if (filter === "rejected") return isRejected;
        if (filter === "pending") return isPending;
        return true;
    });

    const resolveComplaint = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.patch(
                `${API_URL}/employee/complaints/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComplaints((prev) =>
                prev.map((c) =>
                    c.Cmpt_ID === id
                        ? {
                            ...c,
                            DateResolved: new Date().toISOString(),
                            DateRejected: null,
                        }
                        : c
                )
            );
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to resolve complaint");
        }
    };

    const rejectComplaint = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.patch(
                `${API_URL}/employee/complaints/${id}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComplaints((prev) =>
                prev.map((c) =>
                    c.Cmpt_ID === id
                        ? {
                            ...c,
                            DateRejected: new Date().toISOString(),
                            DateResolved: null,
                        }
                        : c
                )
            );
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to reject complaint");
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Loading...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h1 style={{ color: "red" }}>{error}</h1>
            </div>
        );
    }

    return (
        <div className={styles.container}>

            <h2 className={styles.title}>Complaints</h2>

            <div className={styles.filters}>
                <button
                    className={`${styles.tab} ${filter === "all" ? styles.active : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All
                </button>

                <button
                    className={`${styles.tab} ${filter === "pending" ? styles.active : ""}`}
                    onClick={() => setFilter("pending")}
                >
                    Pending
                </button>

                <button
                    className={`${styles.tab} ${filter === "resolved" ? styles.active : ""}`}
                    onClick={() => setFilter("resolved")}
                >
                    Resolved
                </button>

                <button
                    className={`${styles.tab} ${filter === "rejected" ? styles.active : ""}`}
                    onClick={() => setFilter("rejected")}
                >
                    Rejected
                </button>
            </div>

            {filteredComplaints.length === 0 ? (
                <p className={styles.empty}>No complaints found</p>
            ) : (
                <div className={styles.cardContainer}>
                    {filteredComplaints.map((c) => (
                        <ComplaintCard
                            key={c.Cmpt_ID}
                            complaint={c}
                            onResolve={resolveComplaint}
                            onDelete={rejectComplaint}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}