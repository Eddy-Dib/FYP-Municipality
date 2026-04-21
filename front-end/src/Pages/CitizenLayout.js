import { Outlet, useNavigate } from "react-router-dom";
import styles from "./CitizenLayout.module.css";
import logo from "../Assets/Logo.jpg";

function CitizenLayout() {
    const navigate = useNavigate();

    return (
        <div className={styles.citizenContainer}>

            <div className={styles.header}>
                <img src={logo} alt="logo" className={styles.headerIcon} />

                <div className={styles.navLinks}>
                    <span onClick={() => navigate("/citizen")}>Home</span>
                    <span onClick={() => navigate("/citizen/request")}>Request</span>
                    <span onClick={() => navigate("/citizen/complain")}>Complain</span>
                    <span onClick={() => navigate("/citizen/payfees")}>Pay Fees</span>
                </div>
            </div>

            <Outlet />

        </div>
    );
}

export default CitizenLayout;