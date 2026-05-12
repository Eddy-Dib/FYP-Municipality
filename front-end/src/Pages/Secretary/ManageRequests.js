import { useEffect, useState } from "react";
import axios from "axios";
import RequestCard from "../../Components/Card/RequestCard";
import styles from "./ManageRequests.module.css";
import { useNavigate } from "react-router-dom";
import { PriorityBadge, StatusBadge } from "../../Components/UI/Badge";

function ManageRequests() {
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [filter, setFilter] = useState("All");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/secretary/requests`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (res.data.success) {
                    setRequests(res.data.data);
                } else {
                    setError(res.data.message || "Failed to load requests");
                }

            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Server error while fetching requests"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [API_URL, token]);

    const handleSelect = (req) => {
        navigate(`/employee/secretary/managereq/${req.id}`);
    };

    const normalize = (str) =>
        (str || "").toLowerCase().replace(/\s+/g, "");

    const filteredRequests = requests.filter(req => {
        const status = normalize(req.status);
        const priority = normalize(req.priority);

        switch (filter) {
            case "All":
                return true;

            case "High Priority":
                return Number(req.priority) === 3 || Number(req.priority) === 4;

            case "Submitted":
                return status === "submitted";

            case "Under Review":
                return status === "underreview";

            default:
                return true;
        }
    });

    if (error) {
        return <h1 className={styles.error}>{error}</h1>;
    }

    return (
        <div>
            <h1 className={styles.title}>Manage Requests</h1>

            <div className={styles.ribbon}>
                {[
                    "All",
                    "High Priority",
                    "Submitted",
                    "Under Review"
                ].map(tab => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${filter === tab ? styles.active : ""}`}
                        onClick={() => setFilter(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={styles.list}>
                {loading ? (
                    <p>Loading requests...</p>
                ) : filteredRequests.length === 0 ? (
                    <p>No requests found</p>
                ) : (
                    filteredRequests.map(req => (
                        <RequestCard
                            key={req.id}
                            request={req}
                            onSelect={handleSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageRequests;