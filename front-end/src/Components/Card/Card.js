import styles from "./Card.module.css";

function Card({ children, className = "", onClick }) {
    return (
        <div className={`${styles.card} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
}

export default Card;