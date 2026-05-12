import Card from "./Card";
import styles from "./ComplaintCard.module.css";
import { FaExclamationTriangle } from "react-icons/fa";

function ComplaintCard({ complaint, onResolve, onDelete }) {
    const isResolved = complaint.DateResolved !== null;
    const isRejected = complaint.DateRejected !== null;
    const isPending = !isResolved && !isRejected;

    const getStatus = () => {
        if (isResolved) return "resolved";
        if (isRejected) return "rejected";
        return "pending";
    };

    const detailLines = complaint.Details
        ?.split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    const detailMap = {};

    detailLines.forEach(line => {
        const [key, ...rest] = line.split(":");
        detailMap[key.trim()] = rest.join(":").trim();
    });

    return (
        <Card className={styles.complaint}>

            <div className={styles.middle}>
                <h3 className={styles.title}>Complaint: {complaint.CType_Name}</h3>

                <div className={styles.description}>

                    {detailMap.Name && (
                        <p>
                            <strong>Name:</strong> {detailMap.Name}
                        </p>
                    )}

                    {detailMap.Location && (
                        <p>
                            <strong>Address:</strong> {detailMap.Location}
                        </p>
                    )}

                    {detailMap.Description && (
                        <p>
                            <strong>Description:</strong> {detailMap.Description}
                        </p>
                    )}

                </div>

                <p>
                    <strong>Status:</strong> {getStatus()}
                </p>

                {isPending && (
                    <div className={styles.actions}>
                        <button
                            className={styles.resolve}
                            onClick={() => onResolve(complaint.Cmpt_ID)}
                        >
                            Resolve
                        </button>

                        <button
                            className={styles.delete}
                            onClick={() => onDelete(complaint.Cmpt_ID)}
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.right}>
                <FaExclamationTriangle />
            </div>

        </Card>
    );
}

export default ComplaintCard;