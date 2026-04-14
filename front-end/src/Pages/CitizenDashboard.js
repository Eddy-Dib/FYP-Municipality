import styles from "./CitizenLayout.module.css";
import videoFile from "../Assets/Video.mp4";

function CitizenDashboard() {
    return (
        <div>

            {/* HERO SECTION (moved from layout) */}
            <div className={styles.videoSection}>
                <video autoPlay loop muted className={styles.video}>
                    <source src={videoFile} type="video/mp4" />
                </video>

                <h2 className={styles.welcomeText}>Welcome</h2>
            </div>

        </div>
    );
}

export default CitizenDashboard;