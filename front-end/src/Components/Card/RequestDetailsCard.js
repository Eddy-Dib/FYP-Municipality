import Card from "./Card";
import styles from "./RequestDetailsCard.module.css";

function RequestDetailsCard({ request }) {
    return (
        <Card className={styles.request}>

            <div className={styles.middle}>
                <h3 className={styles.title}>{request.type}</h3>

                <p><strong>Request #:</strong> {request.requestNumber}</p>
                <p><strong>Status:</strong> {request.status}</p>

                <p><strong>Description:</strong></p>
                <p className={styles.description}>{request.description}</p>

                <p><strong>Due Date:</strong> {request.dueDate}</p>
            </div>

        </Card>
    );
}

export default RequestDetailsCard;