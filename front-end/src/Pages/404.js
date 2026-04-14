import { useNavigate } from "react-router-dom";
import styles from "./404.module.css";
import bgImage from "../Assets/NotFoundBg.jpg";

function NotFound() {
    const navigate = useNavigate();

    const handleReturn = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <div
            className={styles.page}
            style={{
                backgroundImage: `url(${bgImage})`
            }}
        >

            <div className={styles.overlay}></div>

            <div className={styles.card}>

                <h1 className={styles.code}>Page Not Found</h1>

                <p className={styles.text}>I looked everywhere, even asked the system politely, but what you're looking for is not here, unfortunately.</p>

                <button className={styles.button} onClick={handleReturn}>Back to Login</button>

            </div>

        </div>
    );
}

export default NotFound;