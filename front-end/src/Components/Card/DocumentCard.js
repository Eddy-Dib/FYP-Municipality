import Card from "./Card";
import styles from "./DocumentCard.module.css";
import { FaCheck, FaTimes } from "react-icons/fa";

function DocumentCard({
    thumbnail,
    citizenName,
    docType,
    onValidate,
    onReject,
    onClick
}) {
    return (
        <Card className={styles.card} onClick={onClick}>

            <div className={styles.thumbnailWrapper}>
                <img
                    src={thumbnail}
                    alt="document preview"
                    className={styles.thumbnail}
                />
            </div>

            <div className={styles.middle}>
                <p className={styles.citizen}>{citizenName}</p>
                <p className={styles.type}>{docType}</p>
            </div>

            <div className={styles.actions}>
                <button
                    className={`${styles.btn} ${styles.validate}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onValidate();
                    }}
                >
                    <FaCheck />
                    Validate
                </button>

                <button
                    className={`${styles.btn} ${styles.reject}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onReject();
                    }}
                >
                    <FaTimes />
                    Reject
                </button>
            </div>

        </Card>
    );
}

export default DocumentCard;