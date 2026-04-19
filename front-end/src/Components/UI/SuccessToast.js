import { useEffect, useState } from "react";
import styles from "./SuccessToast.module.css";
import { FaCheck } from "react-icons/fa";

function SuccessToast({ message = "Success", onClose }) {
    const [closing, setClosing] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setClosing(true);

            setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, 300);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className={`${styles.toast} ${closing ? styles.slideOut : styles.slideIn}`}>
            <FaCheck className={styles.icon} />
            <span>{message}</span>
        </div>
    );
}

export default SuccessToast;