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

    return (
        <Card className={styles.complaint}>

            <div className={styles.middle}>
                <h3 className={styles.title}>Complaint</h3>

                <p><strong>Subject:</strong> {complaint.Subject}</p>

                <p><strong>Details:</strong></p>
                <p className={styles.description}>
                    {complaint.Details}
                </p>

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