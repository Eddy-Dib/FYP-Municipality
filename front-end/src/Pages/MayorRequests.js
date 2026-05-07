import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import RequestCard from "../Components/Card/RequestCard";
import styles from "./MayorRequests.module.css";

function MayorRequests() {
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${API_URL}/api/mayor/requests`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setRequests(res.data.data || []);
            } catch (err) {
                setError(err?.response?.data?.message || "Failed to load requests");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [API_URL]);

    const handleSelect = (request) => {
        navigate(`/employee/mayor/requests/${request.Req_ID}`);
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Requests</h2>

            <div className={styles.grid}>
                {requests.length === 0 ? (
                    <p>No requests available</p>
                ) : (
                    requests.map(req => (
                        <RequestCard
                            key={req.Req_ID}
                            request={{
                                requestNumber: req.RequestNumber,
                                type: req.RType_Name,
                                status: req.RStat_Name,
                                priority: req.Priority,
                                dueDate: req.TaskCompletedAt || req.DateMade,
                                description: req.Description,
                                report: req.report
                            }}
                            onSelect={() => handleSelect(req)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default MayorRequests;