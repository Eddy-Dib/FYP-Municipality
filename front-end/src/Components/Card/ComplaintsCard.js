import Card from "./Card";
import styles from "./ComplaintCard.module.css";
import { FaExclamationTriangle } from "react-icons/fa";

function ComplaintCard({ complaint, onResolve, onDelete }) {
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
                    <strong>Status:</strong>{" "}
                    {complaint.DateResolved ? "resolved" : "pending"}
                </p>

                {!complaint.DateResolved && (
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
                            Delete
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