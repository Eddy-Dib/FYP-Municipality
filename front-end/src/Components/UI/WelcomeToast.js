import { useEffect, useState } from "react";
import styles from "./WelcomeToast.module.css";

function WelcomeToast() {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) return;

        const shown = sessionStorage.getItem("welcomeShown"); // doesn't appear on refresh only in new tab

        if (!shown) {
            sessionStorage.setItem("welcomeShown", "true");

            setVisible(true);

            const timer = setTimeout(() => { // full toast timer: 3s
                setClosing(true);

                setTimeout(() => { // out animation timer: 0.3s
                    setVisible(false);
                }, 300);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    if (!visible) return null;

    return (
        <div className={`${styles.toast} ${closing ? styles.slideOut : styles.slideIn}`}>
            <h3>
                Welcome <span className={styles.name}>{user.name}</span>!
            </h3>

            {user.role && user.role !== "citizen" && (
                <p>Logged in as {user.role}</p>
            )}
        </div>
    );
}

export default WelcomeToast;