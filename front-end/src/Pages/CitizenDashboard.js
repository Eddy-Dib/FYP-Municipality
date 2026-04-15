import styles from "./CitizenLayout.module.css";
import videoFile from "../Assets/Video.mp4";

import Map from "./Map.js";

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

            <div className={styles.contactLeft}>
                <div className={styles.contactCard}>
                    <h4> 🕿 Call Us </h4>
                    <p> +961 76 001 001 </p>
                </div>

                <div className={styles.contactCard}>
                    <h4> ✉️ Send Email </h4>
                    <p> Municipality@email.com </p>
                </div>

                <div className={styles.contactCard}>
                    <h4> Book An Appointment </h4>
                    <p> Your Local Municipality Office </p>
                </div>
            </div>

            <Map/>

        </div>
    );
}

export default CitizenDashboard;