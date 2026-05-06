import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

import RequestDetailsCard from "../Components/Card/RequestDetailsCard";
import ReportDetailsCard from "../Components/Card/ReportDetailsCard";

import styles from "./MayorRequestDetails.module.css";

function MayorRequestDetails() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/mayor/requests/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setData(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load request details");
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [API_URL, id]);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;
    if (!data) return <h2>No data found</h2>;

    return (
        <div className={styles.container}>

            <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>

            <h1 className={styles.title}>
                Request Review #{id}
            </h1>

            <div className={styles.cardContainer}>
                <RequestDetailsCard request={data.request} />
                <ReportDetailsCard report={data.report} />
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.approveBtn}
                    onClick={() => console.log("approve", data)}
                >
                    Approve & Issue Document
                </button>

                <button
                    className={styles.rejectBtn}
                    onClick={() => console.log("reject", data)}
                >
                    Reject Request
                </button>
            </div>
        </div>
    );
}

export default MayorRequestDetails;