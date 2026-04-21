import styles from "./Footer.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLandmark } from "react-icons/fa";
import logo from "../Assets/Logo.jpg";

function Footer() {
    return (
        <footer className={styles.footer}>

            <div className={styles.top}>
                <h3>We're always here to help you</h3>
                <p>
                    Serving citizens with transparency and efficiency.
                    Stay connected with your local municipality.
                </p>
            </div>

            <div className={styles.content}>

                <div className={styles.left}>
                    <h4>Send Message</h4>
                    <textarea placeholder="Your Message"></textarea>
                    <button>Send</button>
                </div>

                <div className={styles.center}>
                    <div className={styles.center}>
                        <FaLandmark className={styles.logoIcon} />
                        <h4>Municipality</h4>
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={styles.item}>
                        <FaPhone />
                        <span>+961 76 001 001</span>
                    </div>

                    <div className={styles.item}>
                        <FaEnvelope />
                        <span>municipality@email.com</span>
                    </div>

                    <div className={styles.item}>
                        <FaMapMarkerAlt />
                        <span>Main Street, City Center</span>
                    </div>
                </div>

            </div>
            
            <div className={styles.bottom}>
                © 2026 Municipality. All rights reserved.
            </div>

        </footer>
    );
}

export default Footer;