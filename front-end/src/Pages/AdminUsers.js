import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Admin.module.css";

function AdminUsers() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [citizens, setCitizens] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("All");

    const [loadingId, setLoadingId] = useState(null);

    const loadCitizens = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/citizens`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCitizens(
                res.data.data.map((c) => ({
                    ...c,
                    status: c.rejected
                        ? "Rejected"
                        : c.isRegistered
                            ? (c.isActive ? "Active" : "Disabled")
                            : "Pending"
                }))
            );

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadCitizens();
    }, []);

    const approveCitizen = async (id) => {
        try {
            setLoadingId(`approve-${id}`);

            await axios.post(
                `${API_URL}/api/admin/citizens/${id}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await loadCitizens();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingId(null);
        }
    };

    const rejectCitizen = async (id) => {
        try {
            setLoadingId(`reject-${id}`);

            await axios.post(
                `${API_URL}/api/admin/citizens/${id}/reject`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await loadCitizens();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingId(null);
        }
    };

    const enableUser = async (userId) => {
        try {
            setLoadingId(`enable-${userId}`);

            await axios.put(
                `${API_URL}/api/admin/users/${userId}/enable`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await loadCitizens();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingId(null);
        }
    };

    const disableUser = async (userId) => {
        try {
            setLoadingId(`disable-${userId}`);

            await axios.put(
                `${API_URL}/api/admin/users/${userId}/disable`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await loadCitizens();
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingId(null);
        }
    };

    const filteredCitizens =
        selectedStatus === "All"
            ? citizens
            : citizens.filter((c) => c.status === selectedStatus);

    const count = (status) =>
        citizens.filter((c) => c.status === status).length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Citizen Management</h1>
                <p>Approve or manage citizen accounts</p>
            </div>

            <div className={styles.cards}>
                <div
                    className={`${styles.card} ${selectedStatus === "All" ? styles.activeCard : ""}`}
                    onClick={() => setSelectedStatus("All")}
                >
                    <div className={styles.cardTitle}>All</div>
                    <div className={styles.cardValue}>{citizens.length}</div>
                    <div className={styles.cardSub}>All citizens</div>
                </div>

                <div
                    className={`${styles.card} ${selectedStatus === "Pending" ? styles.activeCard : ""}`}
                    onClick={() => setSelectedStatus("Pending")}
                >
                    <div className={styles.cardTitle}>Pending</div>
                    <div className={styles.cardValue}>{count("Pending")}</div>
                    <div className={styles.cardSub}>Awaiting approval</div>
                </div>

                <div
                    className={`${styles.card} ${selectedStatus === "Active" ? styles.activeCard : ""}`}
                    onClick={() => setSelectedStatus("Active")}
                >
                    <div className={styles.cardTitle}>Active</div>
                    <div className={styles.cardValue}>{count("Active")}</div>
                    <div className={styles.cardSub}>Enabled users</div>
                </div>

                <div
                    className={`${styles.card} ${selectedStatus === "Disabled" ? styles.activeCard : ""}`}
                    onClick={() => setSelectedStatus("Disabled")}
                >
                    <div className={styles.cardTitle}>Disabled</div>
                    <div className={styles.cardValue}>{count("Disabled")}</div>
                    <div className={styles.cardSub}>Blocked users</div>
                </div>
            </div>

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
                            {filteredCitizens.length > 0 ? (
                                filteredCitizens.map((c) => (
                                    <tr key={c.id}>
                                        <td>#{c.id}</td>
                                        <td>{c.name}</td>
                                        <td>{c.email}</td>
                                        <td>{c.username || "-"}</td>

                                        <td>{c.status}</td>

                                        <td className={styles.actionCell}>

                                            {!c.isRegistered && c.status === "Pending" && (
                                                <div className={styles.actionGroup}>
                                                    <button
                                                        className={styles.greenBtn}
                                                        onClick={() => approveCitizen(c.id)}
                                                        disabled={loadingId === `approve-${c.id}`}
                                                    >
                                                        {loadingId === `approve-${c.id}`
                                                            ? "Approving..."
                                                            : "Approve"}
                                                    </button>

                                                    <button
                                                        className={styles.redBtn}
                                                        onClick={() => rejectCitizen(c.id)}
                                                        disabled={loadingId === `reject-${c.id}`}
                                                    >
                                                        {loadingId === `reject-${c.id}`
                                                            ? "Rejecting..."
                                                            : "Reject"}
                                                    </button>
                                                </div>
                                            )}

                                            {!c.isRegistered && c.status === "Rejected" && (
                                                <div className={styles.actionGroup}>
                                                    <button
                                                        className={styles.warningBtn}
                                                        onClick={() => approveCitizen(c.id)}
                                                        disabled={loadingId === `approve-${c.id}`}
                                                    >
                                                        {loadingId === `approve-${c.id}`
                                                            ? "Reactivating..."
                                                            : "Reactivate"}
                                                    </button>
                                                </div>
                                            )}

                                            {c.isRegistered && (
                                                c.isActive ? (
                                                    <button
                                                        className={styles.redBtn}
                                                        onClick={() => disableUser(c.userId)}
                                                        disabled={loadingId === `disable-${c.userId}`}
                                                    >
                                                        {loadingId === `disable-${c.userId}`
                                                            ? "Disabling..."
                                                            : "Disable"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className={styles.greenBtn}
                                                        onClick={() => enableUser(c.userId)}
                                                        disabled={loadingId === `enable-${c.userId}`}
                                                    >
                                                        {loadingId === `enable-${c.userId}`
                                                            ? "Enabling..."
                                                            : "Enable"}
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className={styles.emptyState}>
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