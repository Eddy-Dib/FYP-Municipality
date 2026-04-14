import Card from "./Card";
import styles from "./TaskCard.module.css";
import { PriorityBadge, StatusBadge } from "../UI/Badge";

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

                <PriorityBadge value={priority} />
            </div>

            <div className={styles.middle}>
                <h4>{title}</h4>
                <p>Request ID: {requestId}</p>
                <p>Due: {dueDate}</p>
            </div>

            <div className={styles.right}>
                <StatusBadge value={status} />
            </div>

        </Card>
    );
}

export default TaskCard;