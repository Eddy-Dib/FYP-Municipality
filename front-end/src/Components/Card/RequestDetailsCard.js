import Card from "./Card";
import styles from "./RequestDetailsCard.module.css";

function RequestDetailsCard({ request }) {
    let parsedDescription = request.description;

    if (typeof parsedDescription === "string") {
        try {
            parsedDescription = JSON.parse(parsedDescription);
        } catch (e) {
            parsedDescription = null;
        }
    }

    return (
        <Card className={styles.request}>

            <div className={styles.middle}>
                <h3 className={styles.title}>{request.type}{": "}{request.description.title}</h3>

                <p><strong>Request #:</strong> {request.requestNumber}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Due Date:</strong> {request.dueDate}</p>

                <p><strong>Description:</strong></p>
                {parsedDescription && typeof parsedDescription === "object" ? (
                    <div className={styles.jsonBox}>
                        {Object.entries(parsedDescription).map(([key, value]) => (
                            <div key={key} className={styles.row}>
                                <span className={styles.key}>{key}</span>
                                <span className={styles.value}>{String(value)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.descriptionText}>
                        {request.description}
                    </p>
                )}

            </div>

        </Card>
    );
}

export default RequestDetailsCard;