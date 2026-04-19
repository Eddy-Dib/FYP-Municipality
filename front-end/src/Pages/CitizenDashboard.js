import styles from "./CitizenLayout.module.css";
import videoFile from "../Assets/Video.mp4";
import calendarImg from "../Assets/Municipality.jpg";

import { FaCity, FaUsers, FaHardHat } from "react-icons/fa";

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
            </div>

            <div className={styles.introText}>
                <h1> Welcome to your Municipality </h1>
                <p> Our Town, Our Future, building a stronger community together. </p>
            </div>

            <div className={styles.weatherSection}>
                <WeatherBox />
            </div>

            <div className={styles.section}>
                <div className={styles.bluebg}></div>

                <div className={styles.cardscontainer}>
                    <div className={styles.card}>
                        <div className={styles.icons}>
                            <FaUsers />
                        </div>
                        <div className={styles.text}>
                            <h3> Population </h3>
                            <p> Proudly serving a growing community of over 10,000 residents. </p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icons}>
                            <FaCity />
                        </div>
                        <div className={styles.text}>
                            <h3> About  </h3>
                            <p>  Dedicated to serving our community with transparency and care,
                                improving daily life for all residents.
                            </p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.icons}>
                            <FaHardHat />
                        </div>
                        <div className={styles.text}>
                            <h3> Projects </h3>
                            <p> Leading development projects to enhance infrastructure and public spaces. </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.calendarSectionWrapper}>

                <div className={styles.calendarContent}>

                    {/* LEFT → CALENDAR */}
                    <div className={styles.calendarLeft}>
                        <EventCalendar />
                    </div>

                    {/* RIGHT → IMAGE + TEXT UNDER */}
                    <div className={styles.calendarRight}>
                        <img src={calendarImg} alt="calendar visual" />

                        <div className={styles.calendarText}>
                            <h3>Stay Informed</h3>
                            <p>
                                Check upcoming municipality events, maintenance schedules,
                                and community activities. Click on any date to view details.
                            </p>
                        </div>
                    </div>

                </div>

            </div>




            {/* <div className={styles.contactSection}>

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

            </div>*/}

        </div>
    );
}

export default CitizenDashboard;