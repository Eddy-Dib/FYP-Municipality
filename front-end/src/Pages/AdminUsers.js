import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Admin.module.css";

function AdminUsers() {
    const API_URL = process.env.REACT_APP_API_URL;

    const [users, setUsers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("Pending");

    const token = localStorage.getItem("token");

    const statusMap = {
        Pending: 0,
        Approved: 1,
        Rejected: 2
    };

    const loadUsers = async (statusName) => {
        try {
            const res = await axios.get(
                `${API_URL}/api/admin/users/${statusMap[statusName]}`,
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
        loadUsers(selectedStatus);
    }, [selectedStatus]);

    const approveUser = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/users/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadUsers(selectedStatus);
        } catch (err) {
            console.error(err);
        }
    };

    const rejectUser = async (id) => {
        try {
            await axios.put(
                `${API_URL}/api/admin/users/${id}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            loadUsers(selectedStatus);
        } catch (err) {
            console.error(err);
        }
    };

    const pendingUsers =
        selectedStatus === "Pending" ? users.length : "...";
    const approvedUsers =
        selectedStatus === "Approved" ? users.length : "...";
    const rejectedUsers =
        selectedStatus === "Rejected" ? users.length : "...";

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>User Management</h1>
                <p>Approve or reject municipality members</p>
            </div>

            <div className={styles.cards}>
                <div
                    className={styles.card}
                    onClick={() => setSelectedStatus("Pending")}
                    style={{
                        cursor: "pointer",
                        border:
                            selectedStatus === "Pending"
                                ? "3px solid #2563eb"
                                : "3px solid transparent"
                    }}
                >
                    <div className={styles.cardTitle}>Pending</div>
                    <div className={styles.cardValue}>{pendingUsers}</div>
                    <div className={styles.cardSub}>Awaiting approval</div>
                </div>

                <div
                    className={styles.card}
                    onClick={() => setSelectedStatus("Approved")}
                    style={{
                        cursor: "pointer",
                        border:
                            selectedStatus === "Approved"
                                ? "3px solid #16a34a"
                                : "3px solid transparent"
                    }}
                >
                    <div className={styles.cardTitle}>Approved</div>
                    <div className={styles.cardValue}>{approvedUsers}</div>
                    <div className={styles.cardSub}>Accepted members</div>
                </div>

                <div
                    className={styles.card}
                    onClick={() => setSelectedStatus("Rejected")}
                    style={{
                        cursor: "pointer",
                        border:
                            selectedStatus === "Rejected"
                                ? "3px solid #dc2626"
                                : "3px solid transparent"
                    }}
                >
                    <div className={styles.cardTitle}>Rejected</div>
                    <div className={styles.cardValue}>{rejectedUsers}</div>
                    <div className={styles.cardSub}>Declined registrations</div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {selectedStatus} Applications
                </h2>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.status}</td>

                                        <td>
                                            {selectedStatus !== "Approved" && (
                                                <button
                                                    className={styles.greenBtn}
                                                    onClick={() =>
                                                        approveUser(user.id)
                                                    }
                                                >
                                                    Approve
                                                </button>
                                            )}

                                            {selectedStatus !== "Rejected" && (
                                                <button
                                                    className={styles.redBtn}
                                                    onClick={() =>
                                                        rejectUser(user.id)
                                                    }
                                                >
                                                    Reject
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
                                        No users found
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