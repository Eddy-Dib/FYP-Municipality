import Card from "./Card";
import styles from "./TaskCard.module.css";

function TaskCard({
    number,
    priority,
    title,
    requestId,
    dueDate,
    status,
    onClick
}) {
    return (
        <Card className={styles.task} onClick={onClick}>

            <div className={styles.left}>
                <span className={styles.number}>#{number}</span>
                <span className={`${styles.priority} ${styles[priority.toLowerCase()]}`}>
                    {priority}
                </span>
            </div>

            <div className={styles.middle}>
                <h4>{title}</h4>
                <p>Request ID: {requestId}</p>
                <p>Due: {dueDate}</p>
            </div>

            <div className={styles.right}>
                <span className={styles.status}>{status}</span>
            </div>

        </Card>
    );
}

export default TaskCard;