import Card from "./Card";
import styles from "./RequestCard.module.css";
import { FaFileAlt } from "react-icons/fa";

function RequestCard({ request, onSelect }) {

    const formatDescription = (desc) => {
        if (!desc) return "";

        if (typeof desc === "string") return desc;

        if (typeof desc === "object") {
            return Object.entries(desc)
                .map(([k, v]) => `${k.replaceAll("_", " ")}: ${v}`)
                .join(" | ");
        }

        return String(desc);
    };

    const descriptionText = formatDescription(request.description);

    const statusKey = request.status
        ? request.status.toLowerCase().replaceAll(" ", "")
        : "";

    return (
        <Card
            className={styles.request}
            onClick={() => onSelect(request)}
        >
            <div className={styles.middle}>
                <h3 className={styles.title}>{request.type}</h3>

                <p>
                    <strong>Request #:</strong> {request.requestNumber}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    <span className={`${styles.status} ${styles[statusKey] || ""}`}>
                        {request.status}
                    </span>
                </p>

                <p>
                    <strong>Priority:</strong> {request.priority}
                </p>

                <p>
                    <strong>Due Date:</strong> {request.dueDate}
                </p>

                <p className={styles.description}>
                    {descriptionText.length > 80
                        ? descriptionText.slice(0, 80) + "..."
                        : descriptionText}
                </p>
            </div>

            <div className={styles.right}>
                <FaFileAlt />
            </div>
        </Card>
    );
}

export default RequestCard;