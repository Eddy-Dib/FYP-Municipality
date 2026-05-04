import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Admin.module.css";

function AdminUsers() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [users, setUsers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");

    const token = localStorage.getItem("token");

    const loadUsers = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/admin/citizens`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const enableUser = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/users/${id}/enable`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const disableUser = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/users/${id}/disable`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers =
        selectedStatus === "All"
            ? users
            : users.filter((u) => u.status === selectedStatus);

    const count = (status) =>
        users.filter((u) => u.status === status).length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>User Management</h1>
                <p>Manage citizen accounts</p>
            </div>

            {/* STATUS CARDS */}
            <div className={styles.cards}>
                <div
                    className={styles.card}
                    onClick={() => setSelectedStatus("All")}
                    style={{
                        cursor: "pointer",
                        border:
                            selectedStatus === "All"
                                ? "3px solid #2563eb"
                                : "3px solid transparent"
                    }}
                >
                    <div className={styles.cardTitle}>All</div>
                    <div className={styles.cardValue}>{users.length}</div>
                    <div className={styles.cardSub}>All citizens</div>
                </div>

                <div
                    className={styles.card}
                    onClick={() => setSelectedStatus("Active")}
                    style={{
                        cursor: "pointer",
                        border:
                            selectedStatus === "Active"
                                ? "3px solid #16a34a"
                                : "3px solid transparent"
                    }}
                >
                    <div className={styles.cardTitle}>Active</div>
                    <div className={styles.cardValue}>
                        {count("Active")}
                    </div>
                    <div className={styles.cardSub}>Enabled accounts</div>
                </div>

                <div
                    className={styles.card}
                    onClick={() => setSelectedStatus("Disabled")}
                    style={{
                        cursor: "pointer",
                        border:
                            selectedStatus === "Disabled"
                                ? "3px solid #dc2626"
                                : "3px solid transparent"
                    }}
                >
                    <div className={styles.cardTitle}>Disabled</div>
                    <div className={styles.cardValue}>
                        {count("Disabled")}
                    </div>
                    <div className={styles.cardSub}>Blocked accounts</div>
                </div>
            </div>

            {/* TABLE */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {selectedStatus} Citizens
                </h2>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.username || "-"}</td>
                                        <td>{user.status}</td>

                                        <td>
                                            {user.status !== "Active" && (
                                                <button
                                                    className={styles.greenBtn}
                                                    onClick={() =>
                                                        enableUser(user.id)
                                                    }
                                                >
                                                    Enable
                                                </button>
                                            )}

                                            {user.status !== "Disabled" && (
                                                <button
                                                    className={styles.redBtn}
                                                    onClick={() =>
                                                        disableUser(user.id)
                                                    }
                                                >
                                                    Disable
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign: "center",
                                            padding: "40px"
                                        }}
                                    >
                                        No citizens found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;