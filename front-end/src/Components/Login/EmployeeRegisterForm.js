import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EmployeeRegisterForm.module.css";

function EmployeeRegisterForm({ onClose, onSuccess }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        roleId: ""
    });

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/roles`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setRoles(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await axios.post(
                `${API_URL}/api/admin/employees/create`,
                form,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessage("Employee created successfully");

            onSuccess?.();
            onClose();

        } catch (err) {
            setMessage(err?.response?.data?.message || "Error creating employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <h2>Register Employee</h2>

                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>First Name</label>
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.group}>
                            <label>Last Name</label>
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Birth Date</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={form.birthDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.group}>
                        <label>Role</label>
                        <select
                            name="roleId"
                            value={form.roleId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map(r => (
                                <option key={r.Role_ID} value={r.Role_ID}>
                                    {r.Role_Type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? "Submitting..." : "Register Employee"}
                    </button>

                    {message && <p className={styles.error}>{message}</p>}
                </form>

            </div>
        </div>
    );
}

export default EmployeeRegisterForm;