import Card from "./Card";
import styles from "./SummaryCard.module.css";

function SummaryCard({ title, value, subtitle, icon, onClick }) {
    return (
        <Card className={styles.summary} onClick={onClick}>
            <div className={styles.left}>
                <div className={styles.icon}>{icon}</div>
            </div>

            <div className={styles.middle}>
                <h3>{title}</h3>
                <h1>{value}</h1>
                <p>{subtitle}</p>
            </div>
        </Card>
    );
}

export default SummaryCard;