import Card from "./Card";
import styles from "./ReportCard.module.css";
import { FaEye, FaDownload } from "react-icons/fa";

function ReportCard({
    title,
    type,
    requestId,
    taskId,
    date,
    onDownload
}) {
    return (
        <Card className={styles.report}>

            <div className={styles.middle}>
                <h4 className={styles.title}>{title}</h4>
                <p className={styles.type}>{type}</p>

                <p>Request ID: {requestId}</p>
                <p>Task ID: {taskId}</p>
                <p>Date: {date}</p>
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