import Card from "./Card";
import styles from "./ReportCard.module.css";
import { FaEye, FaDownload } from "react-icons/fa";

function ReportCard({
    title,
    type,
    requestId,
    requestName,
    taskId,
    taskName,
    citizenName,
    date,
    onDownload
}) {
    return (
        <Card className={styles.report}>

            <div className={styles.middle}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.type}>{type}</p>
                <p><strong>Citizen:</strong> {citizenName}</p>
                <p><strong>Request:</strong> {requestName} ({requestId}) </p>
                <p><strong>Task:</strong> {taskName} ({taskId})</p>
                <p><strong>Date:</strong> {date}</p>
            </div>

            <div className={styles.right}>
                <button className={styles.iconBtn} onClick={onDownload} title="Download Report">
                    <FaDownload />
                </button>
            </div>

        </Card>
    );
}

export default ReportCard;