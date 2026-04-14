import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileMenu.module.css";

function ProfileMenu({ open }) {    
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/");
    };

    if (!open) return null;

    return (
        <div className={styles.dropdown} ref={menuRef}>
            <button className={styles.item}>
                Profile
            </button>

            <button className={styles.item} onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default ProfileMenu;