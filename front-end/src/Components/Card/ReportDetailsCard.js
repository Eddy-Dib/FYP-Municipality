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
                            <p className={styles.description}>
                                {report.description.split("\n").map((line, i) => {
                                    const text = line.trim();

                                    if (!text) return null;

                                    if (
                                        text.startsWith("#") ||
                                        text.startsWith("##") ||
                                        text.startsWith("###")
                                    ) {
                                        return (
                                            <strong key={i} style={{ display: "block", marginTop: 6 }}>
                                                {text.replace(/^#+/, "").trim()}
                                            </strong>
                                        );
                                    }

                                    return (
                                        <span key={i} style={{ display: "block", marginTop: 2 }}>
                                            {text}
                                        </span>
                                    );
                                })}
                            </p>
                    </>
                )}
            </div>

            {/* Print functionality moved to Report Page
            <div className={styles.right}>
                <FaFileAlt />
            </div> */}

        </Card>
    );
}

export default ReportDetailsCard;