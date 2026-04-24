import { useState } from "react";
import RequestCard from "../../Components/Card/RequestCard";
import styles from "./ManageRequests.module.css";
import { useNavigate } from "react-router-dom";

function ManageRequests() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");

    const handleSelect = (req) => {
        navigate(`/employee/secretary/managereq/${req.requestNumber}`);
    };

    const dummyRequests = [
        {
            requestNumber: 101,
            type: "Building Permit",
            priority: "High",
            status: "Submitted",
            dueDate: "2026-05-01",
            description: "Request to build a 3-floor house in Main Street."
        },
        {
            requestNumber: 102,
            type: "Business License",
            priority: "Medium",
            status: "Under Review",
            dueDate: "2026-04-28",
            description: "Opening a coffee shop in Sunset Plaza."
        },
        {
            requestNumber: 103,
            type: "Event Permit",
            priority: "Low",
            status: "Missing Documents",
            dueDate: "2026-05-10",
            description: "Street festival organization request."
        },
        {
            requestNumber: 104,
            type: "Property Certificate",
            priority: "High",
            status: "Submitted",
            dueDate: "2026-04-25",
            description: "Request for ownership confirmation documents."
        }
    ];

    const filteredRequests = dummyRequests.filter(req => {
        if (filter === "All") return true;
        if (filter === "High Priority") return req.priority === "High";
        if (filter === "Submitted") return req.status === "Submitted";
        if (filter === "Under Review") return req.status === "Under Review";
        if (filter === "Missing Documents") return req.status === "Missing Documents";

        return true;
    });

    return (
        <div>
            <h1 className={styles.title}>Manage Requests</h1>

            <div className={styles.ribbon}>
                {["All", "High Priority", "Submitted", "Under Review", "Missing Documents"].map(tab => (
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
                {filteredRequests.map(req => (
                    <RequestCard
                        key={req.requestNumber}
                        request={req}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

        </div>
    );
}

export default ManageRequests;