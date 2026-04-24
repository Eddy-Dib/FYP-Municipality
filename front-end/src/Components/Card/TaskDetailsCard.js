import { PriorityBadge, StatusBadge } from "../UI/Badge";
import Card from "./Card";
import styles from "./TaskDetailsCard.module.css";

function TaskDetailsCard({ task }) {
    return (
        <Card className={styles.task}>

            <div className={styles.middle}>
                <h3 className={styles.title}>{task.name}</h3>

                <p><strong>Task #:</strong> {task.taskNumber}</p>
                <p>
                    <strong>Status:</strong> 
                    <StatusBadge value={ task.status }/>
                </p>
                <p>
                    <strong>Priority:</strong>
                    <PriorityBadge value={task.priority} />
                </p>

                <p><strong>Assigned:</strong> {task.assignedDate}</p>
                <p><strong>Completed:</strong> {task.completedDate || "Not completed"}</p>
                <p><strong>Due:</strong> {task.dueDate}</p>
            </div>

        </Card>
    );
}

export default TaskDetailsCard;