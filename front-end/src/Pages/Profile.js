import { useState } from "react";
import styles from "./Profile.module.css";
import { FaUser } from "react-icons/fa";

function Profile() {

    const [passwordData, setPasswordData] = useState({
        current: "",
        newPass: "",
        confirm: ""
    });

    const [message, setMessage] = useState("");

    const handlePassword = (e) => {
        e.preventDefault();

        if (passwordData.newPass !== passwordData.confirm) {
            setMessage("Passwords do not match");
            return;
        }

        setMessage("Password updated successfully");
        setPasswordData({ current: "", newPass: "", confirm: "" });

        setTimeout(() => setMessage(""), 3000);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className={styles.page}>

            <div className={styles.hero}>
                <div className={styles.icon}>
                    <FaUser />
                </div>

                <h1>User</h1>
                <p></p>
            </div>

            {message && <div className={styles.message}>{message}</div>}

            <div className={styles.container}>

                <div className={styles.card}>
                    <h2>Personal Information</h2>

                    <div className={styles.info}>
                        <p><span>Name:</span> User</p>
                        <p><span>Email:</span> user@gmail.com</p>
                        <p><span>Phone:</span> +000 000 000</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2>Change Password</h2>

                    <form onSubmit={handlePassword} className={styles.form}>
                        <input
                            type="password"
                            placeholder="Current password"
                            value={passwordData.current}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, current: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            value={passwordData.newPass}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, newPass: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={passwordData.confirm}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, confirm: e.target.value })
                            }
                        />

                        <button type="submit">Update Password</button>
                    </form>
                </div>

                <div className={styles.logoutCard}>
                    <div>
                        <h3>Sign out</h3>
                        <p>You will be redirected to login</p>
                    </div>

                    <button onClick={handleLogout}>
                        Logout
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Profile;