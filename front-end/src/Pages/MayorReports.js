import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import OperationsChainCard from "../Components/Card/OperationsChainCard";
import styles from "./MayorReports.module.css";

export default function MayorReports() {

    const API_URL = process.env.REACT_APP_API_URL;

    const [filter, setFilter] = useState("ALL");

    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchOperations = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${API_URL}/api/mayor/overview`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setOperations(res.data.data.operations || []);

            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                    "Failed to load operations"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOperations();

    }, [API_URL]);

    const isSameDay = (d1, d2) =>
        new Date(d1).toDateString() === new Date(d2).toDateString();

    const getFiltered = useMemo(() => {

        const now = new Date();

        return operations.filter(op => {
            const date = new Date(op.date);

            switch (filter) {

                case "TODAY":
                    return isSameDay(date, now);

                case "WEEK":
                    return (now - date) / (1000 * 60 * 60 * 24) <= 7;

                case "MONTH":
                    return (now - date) / (1000 * 60 * 60 * 24) <= 30;

                case "YEAR":
                    return date.getFullYear() === now.getFullYear();

                case "ALL":
                default:
                    return true;
            }
        });

    }, [operations, filter]);

    const handleSelect = (item) => {
        console.log("Selected operation:", item);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <h3>Loading operations...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h3>{error}</h3>
            </div>
        );
    }

    return (
        <div className={styles.container}>

            <h2 className={styles.title}>
                Municipal Operations Overview
            </h2>

            <div className={styles.filters}>
                <button onClick={() => setFilter("TODAY")}>Today</button>
                <button onClick={() => setFilter("WEEK")}>This Week</button>
                <button onClick={() => setFilter("MONTH")}>This Month</button>
                <button onClick={() => setFilter("YEAR")}>This Year</button>
                <button onClick={() => setFilter("ALL")}>All</button>
            </div>

            <div className={styles.list}>
                {getFiltered.length === 0 ? (
                    <p>No operations found</p>
                ) : (
                    getFiltered.map((op) => (
                        <OperationsChainCard
                            key={op.requestId}
                            data={{
                                requestNumber: op.requestNumber,
                                requestTitle: op.requestTitle,
                                type: op.type,

                                citizen:
                                    typeof op.citizen === "string"
                                        ? op.citizen
                                        : op.citizen?.fullName || "Unknown",

                                date: op.date,

                                report: op.report,

                                task: op.task,
                                issuedDocument: op.issuedDocument
                            }}
                            onSelect={handleSelect}
                        />
                    ))
                )}
            </div>

        </div>
    );
}