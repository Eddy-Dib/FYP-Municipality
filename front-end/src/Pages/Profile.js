import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { FaUser } from "react-icons/fa";
import axios from "axios";

function Profile() {

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState({
        FullName: "Guest Citizen",
        Email: "No email available",
        Phone_Num: "No phone available",
        Address: "No address available"
    });

    const [passwordData, setPasswordData] = useState({
        current: "",
        newPass: "",
        confirm: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {

        if (token) {
            fetchProfile();
        }

    }, []);

    const fetchProfile = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/api/citizen/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            if (response.data.data) {
                setProfile(response.data.data);
            }

        } catch (err) {

            console.log(err);

            setProfile({
                FullName: "Guest Citizen",
                Email: "No email available",
                Phone_Num: "No phone available",
                Address: "No address available"
            });
        }
    };

    const handlePassword = async (e) => {

        e.preventDefault();

        if (!token) {
            setMessage("Please login first");
            return;
        }

        if (passwordData.newPass !== passwordData.confirm) {
            setMessage("Passwords do not match");
            return;
        }

        try {

            const response = await axios.put(
                `${API_URL}/api/citizen/change-password`,
                {
                    currentPassword: passwordData.current,
                    newPassword: passwordData.newPass
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);

            setPasswordData({
                current: "",
                newPass: "",
                confirm: ""
            });

        } catch (err) {

            console.log(err);

            setMessage(
                err.response?.data?.message ||
                "Failed to update password"
            );
        }

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

                <h1>{profile.FullName}</h1>
                <p>{profile.Email}</p>

            </div>

            {message && (
                <div className={styles.message}>
                    {message}
                </div>
            )}

            <div className={styles.container}>

                <div className={styles.card}>

                    <h2>Personal Information</h2>

                    <div className={styles.info}>

                        <p>
                            <span>Name:</span>
                            {profile.FullName}
                        </p>

                        <p>
                            <span>Email:</span>
                            {profile.Email}
                        </p>

                        <p>
                            <span>Phone:</span>
                            {profile.Phone_Num}
                        </p>

                        <p>
                            <span>Address:</span>
                            {profile.Address}
                        </p>

                    </div>

                </div>

                {token && (
                    <div className={styles.card}>

                        <h2>Change Password</h2>

                        <form
                            onSubmit={handlePassword}
                            className={styles.form}
                        >

                            <input
                                type="password"
                                placeholder="Current password"
                                value={passwordData.current}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        current: e.target.value
                                    })
                                }
                            />

                            <input
                                type="password"
                                placeholder="New password"
                                value={passwordData.newPass}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        newPass: e.target.value
                                    })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={passwordData.confirm}
                                onChange={(e) =>
                                    setPasswordData({
                                        ...passwordData,
                                        confirm: e.target.value
                                    })
                                }
                            />

                            <button type="submit">
                                Update Password
                            </button>

                        </form>

                    </div>
                )}

                {token && (
                    <div className={styles.logoutCard}>

                        <div>
                            <h3>Sign out</h3>
                            <p>
                                You will be redirected to login
                            </p>
                        </div>

                        <button onClick={handleLogout}>
                            Logout
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
}

export default Profile;