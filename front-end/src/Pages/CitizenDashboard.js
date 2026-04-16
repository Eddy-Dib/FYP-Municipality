import styles from "./CitizenLayout.module.css";
import videoFile from "../Assets/Video.mp4";

import Map from "./Map.js";
import EventCalendar from "./EventCalendar.js";
import WeatherBox from "./WeatherBox.js";

function CitizenDashboard() {
    return (
        <div>
            <div className={styles.videoSection}>
                <video autoPlay loop muted className={styles.video}>
                    <source src={videoFile} type="video/mp4" />
                </video>
                <h2 className={styles.welcomeText}>Welcome</h2>
            </div>

            <div className={styles.introText}>
                <h3> Our Town, Our Future </h3>
                <p> Building a legacy of excellence for generations to come </p>
                
            </div>

            <div className={styles.topSection}>
                <WeatherBox />

            </div>


            <Map />

            <div className={styles.contactSection}>

                <div className={styles.left}>
                    <div className={styles.card}>
                        <h4> 🕿 Call Us</h4>
                        <p>+961 76 001 001</p>
                    </div>

                    <div className={`${styles.card} ${styles.dark}`}>
                        <h4>✉️ Send Email</h4>
                        <p>municipality@email.com</p>
                    </div>

                    <div className={styles.card}>
                        <h4>📅 Book Appointment</h4>
                        <p>Your Local Municipality Office</p>
                    </div>
                </div>

                <div className={styles.right}>
                    <h2>Send a Message</h2>

                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Email" />
                    <textarea placeholder="Message"></textarea>

                    <button>Send</button>
                </div>

            </div>

        </div>
    );
}

export default CitizenDashboard;