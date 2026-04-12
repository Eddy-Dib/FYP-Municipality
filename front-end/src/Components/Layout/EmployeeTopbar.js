import styles from "./EmployeeTopBar.module.css";

function EmployeeTopBar() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <header className={styles.topbar}>

            <div className={styles.logoContainer}>
                <div className={styles.logo}>🏛️</div>
                <span className={styles.logoName}>Municipality System</span>
            </div>

            <div className={styles.searchContainer}>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search tasks..."
                />
            </div>

            <div className={styles.profileContainer}>
                <div className={styles.profileIcon}>👤</div>

                <div className={styles.profileInfo}>
                    <span className={styles.name}>
                        {user.name}
                    </span>

                    <span className={styles.role}>
                        {user.role}
                    </span>
                </div>
            </div>

        </header>
    );
}

export default EmployeeTopBar;