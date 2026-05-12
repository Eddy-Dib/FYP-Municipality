import styles from "./CitizenLayout.module.css";
import videoFile from "../Assets/Video.mp4";
import calendarImg from "../Assets/Municipality.jpg";

import { FaCity, FaUsers, FaHardHat, FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

import Map from "./Map.js";
import EventCalendar from "./EventCalendar.js";
import WeatherBox from "./WeatherBox.js";
import Footer from "./Footer.js";

function CitizenDashboard() {
    return (
        <div>
            <div className={styles.homeBg}>
                <div className={styles.videoSection}>
                    <video autoPlay loop muted className={styles.video}>
                        <source src={videoFile} type="video/mp4" />
                    </video>
                </div>

                <div className={styles.introText}>
                    <h1> Welcome to your Municipality </h1>
                    <p> Our Town, Our Future, building a stronger community together. </p>
                </div>
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

                    <div className={styles.calendarLeft}>
                        <EventCalendar />
                    </div>

                    <div className={styles.calendarRight}>
                        <img src={calendarImg} alt="calendar visual" />

                        <div className={styles.calendarText}>
                            <h3>Your Community at a Glance</h3>
                            <p>
                                Access information on upcoming municipal events, maintenance plans, and community programs. Choose a date to view full details.
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            <div className={styles.Map}>
                <Map />
            </div>

            <div className={styles.contactBar}>

                <div className={styles.opening}>
                    <p><strong> Opening Hours: </strong></p>
                    <p><strong>Mon - Friday:</strong> 9:00 AM – 2:00 PM</p>
                    <p><strong>Saturday:</strong> 10:00 AM – 12:00 PM</p>
                </div>

                <div className={styles.socials}>
                    <FaFacebookF />
                    <FaInstagram />
                    <FaTiktok />
                </div>

            </div>

            <Footer />


        </div>
    );
}

export default CitizenDashboard;