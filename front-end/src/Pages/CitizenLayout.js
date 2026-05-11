import { Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import styles from "./CitizenLayout.module.css";
import logo from "../Assets/Logo.jpg";

function CitizenLayout() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    return (
        <div className={styles.citizenContainer}>

            <div className={styles.header}>
                <img src={logo} alt="logo" className={styles.headerIcon} />

                <div className={styles.navLinks}>
                    <span onClick={() => navigate("/citizen")}>Home</span>
                    <div className={styles.dropdown} ref={dropdownRef}>
                        <span
                            className={styles.dropdownTitle}
                            onClick={() => setOpen(!open)}
                        >
                            Citizen Services ▾
                        </span>

                        {open && (
                            <div className={styles.dropdownMenu}>
                                <span onClick={() => {
                                    navigate("/citizen/request");
                                    setOpen(false);
                                }}>
                                    Request
                                </span>

                                <span onClick={() => {
                                    navigate("/citizen/complain");
                                    setOpen(false);
                                }}>
                                    Complain
                                </span>

                                <span onClick={() => {
                                    navigate("/citizen/Documents");
                                    setOpen(false);
                                }}>
                                    Upload Documents
                                </span>
                                
                            </div>
                        )}
                    </div>

                    {/*<span onClick={() => navigate("/citizen/request")}>Request</span>
                    <span onClick={() => navigate("/citizen/complain")}>Complain</span>*/}
                    <span onClick={() => navigate("/citizen/payfees")}>Fees</span>
                    <span onClick={() => navigate("/citizen/profile")}>Profile</span>
                </div>
            </div>

            <Outlet />

        </div>
    );
}

export default CitizenLayout;