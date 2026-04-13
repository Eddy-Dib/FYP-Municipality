import Card from "./Card";
import styles from "./ReportCard.module.css";

function ReportCard({
    title,
    type,
    requestId,
    taskId,
    date,
    onView,
    onDownload
}) {
    return (
        <Card className={styles.report}>

            <div className={styles.middle}>
                <h4>{title}</h4>
                <p className={styles.type}>{type}</p>

                <p>Request ID: {requestId}</p>
                <p>Task ID: {taskId}</p>
                <p>Date: {date}</p>
            </div>

            <div className={styles.right}>
                <button onClick={onView}>View</button>
                <button onClick={onDownload}>Download</button>
            </div>

        </Card>
    );
}

export default ReportCard;