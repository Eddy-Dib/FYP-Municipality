import { useState } from "react";
import styles from "./EmployeeTopBar.module.css";
import ProfileMenu from "../UI/ProfileMenu";
import { HiBuildingLibrary, HiMiniUser } from "react-icons/hi2";

function EmployeeTopBar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [open, setOpen] = useState(false);

    const handleProfileMenu = () => {
        if(open) setOpen(false);
        else setOpen(true);
    }

    return (
        <header className={styles.topbar}>

            <div className={styles.logoContainer}>
                <div className={styles.logo}><HiBuildingLibrary /></div>
                <span className={styles.logoName}>Municipality System</span>
            </div>

            {/*Search does nothing now, it's just a placeholder, might change it later*/}
            <div className={styles.searchContainer}>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search..."
                />
            </div>

            <div className={styles.profileContainer} onClick={handleProfileMenu}>
                <div className={styles.profileIcon}> <HiMiniUser /> </div>

                <div className={styles.profileInfo}>
                    <span className={styles.name}>
                        {user.name}
                    </span>

                    <span className={styles.role}>
                        {user.role}
                    </span>
                </div>
            </div>
            <ProfileMenu
                open={open}
            />

        </header>
    );
}

export default EmployeeTopBar;