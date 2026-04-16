import Card from "./Card";
import styles from "./ReportDetailsCard.module.css";
import { FaFileAlt } from "react-icons/fa";

function ReportDetailsCard({ report }) {
    return (
        <Card className={styles.report}>

            <div className={styles.middle}>
                <h3 className={styles.title}>Report</h3>

                {!report ? (
                    <p>No report submitted yet.</p>
                ) : (
                    <>
                        <p><strong>Title:</strong> {report.title}</p>
                        <p><strong>Type:</strong> {report.type}</p>

                        <p><strong>Description:</strong></p>
                        <p className={styles.description}>{report.description}</p>
                    </>
                )}
            </div>

            <div className={styles.right}>
                <FaFileAlt />
            </div>

        </Card>
    );
}

export default ReportDetailsCard;