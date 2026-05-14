import styles from "./Footer.module.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLandmark } from "react-icons/fa";
import logo from "../Assets/Logo.jpg";
import axios from "axios";
import { useState } from "react";
import SuccessToast from "../Components/UI/SuccessToast";

function Footer() {
    const token = localStorage.getItem("token");
    const API_URL = process.env.REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem("user"));

    const [message, setMessage] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [error, setError] = useState("");

    const sendMessage = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/complaints/message`,
                {message: message},
                {headers: {
                        Authorization: `Bearer ${token}`
                    }});

            if (res.data.success) {
                setSuccessMsg("Message sent successfully");
                setMessage("");
                setError("");
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            console.log(err);
            setError("Server error");
        }
    };

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
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    {error && (<p className={styles.error}>{error}</p>)}
                    {successMsg && <SuccessToast message={successMsg} onClose={() => setSuccessMsg("")}/>}
                    <button onClick={sendMessage}>Send</button>
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