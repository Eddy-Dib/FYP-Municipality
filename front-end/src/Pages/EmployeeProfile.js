import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EmployeeProfile.module.css";

function EmployeeProfile() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [employee, setEmployee] = useState(null);

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/employee/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setEmployee(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, [API_URL, token]);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage("");

        if (form.newPassword !== form.confirmPassword) {
            return setMessage("Passwords do not match");
        }

        try {
            await axios.post(
                `${API_URL}/employee/changePass`,
                {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage("Password updated successfully");

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (err) {
            setMessage(err?.response?.data?.message || "Error updating password");
        }
    };

    if (!employee) return <div className={styles.page}>Loading...</div>;

    return (
        <div className={styles.page}>

            <div className={styles.card}>
                <h2 className={styles.title}>Employee Profile</h2>

                <div className={styles.infoGrid}>

                    <div>
                        <label>Name</label>
                        <p>{employee.name}</p>
                    </div>

                    <div>
                        <label>Role</label>
                        <p>{employee.Role_Type || "Unassigned"}</p>
                    </div>

                    <div>
                        <label>Username</label>
                        <p>{employee.Username}</p>
                    </div>

                    <div>
                        <label>Status</label>
                        <p>{employee.isActive ? "Active" : "Disabled"}</p>
                    </div>

                </div>
            </div>

            <div className={styles.card}>
                <h2 className={styles.title}>Change Password</h2>

                <form onSubmit={handlePasswordChange} className={styles.form}>

                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current password"
                        value={form.currentPassword}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New password"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Update Password
                    </button>

                    {message && <p className={styles.message}>{message}</p>}
                </form>
            </div>

        </div>
    );
}

export default EmployeeProfile;