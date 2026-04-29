import { useState } from "react";
import styles from "./Admin.module.css";

function AdminUsers() {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Ali Hassan",
            email: "ali@gmail.com",
            role: "Citizen",
            status: "Pending"
        },
        {
            id: 2,
            name: "Maya Elias",
            email: "maya@gmail.com",
            role: "Employee",
            status: "Approved"
        },
        {
            id: 3,
            name: "Karim Raad",
            email: "karim@gmail.com",
            role: "Engineer",
            status: "Pending"
        },
        {
            id: 4,
            name: "Sarah Nader",
            email: "sarah@gmail.com",
            role: "Secretary",
            status: "Rejected"
        }
    ]);

    const [selectedStatus, setSelectedStatus] = useState("Pending");

    const approveUser = (id) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: "Approved" }
                : user
        ));
    };

    const rejectUser = (id) => {
        setUsers(users.map(user =>
            user.id === id
                ? { ...user, status: "Rejected" }
                : user
        ));
    };

    const pendingUsers = users.filter(user => user.status === "Pending").length;
    const approvedUsers = users.filter(user => user.status === "Approved").length;
    const rejectedUsers = users.filter(user => user.status === "Rejected").length;

    const filteredUsers = users.filter(
        user => user.status === selectedStatus
    );

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
                                <th>Role Request</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
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
                                                    onClick={() => approveUser(user.id)}
                                                >
                                                    Approve
                                                </button>
                                            )}

                                            {selectedStatus !== "Rejected" && (
                                                <button
                                                    className={styles.redBtn}
                                                    onClick={() => rejectUser(user.id)}
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
                                        No {selectedStatus.toLowerCase()} users
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