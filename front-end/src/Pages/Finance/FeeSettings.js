import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FeeSettings.module.css";

function FeeSettings() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [selectedStatus, setSelectedStatus] = useState("All");

    const [feeRules, setFeeRules] = useState([]);
    const [locationTypes, setLocationTypes] = useState([]);

    const [taxSettings, setTaxSettings] = useState(null);

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        yearly: true,
        locationType: "",
        locationTypeName: ""
    });

    const [editingId, setEditingId] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);

            const [locationRes, settingsRes] = await Promise.all([
                axios.get(
                    `${API_URL}/api/finance/locations`,
                    { headers: { Authorization: `Bearer ${token}` } }
                ),

                axios.get(
                    `${API_URL}/api/finance/settings`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ]);

            setLocationTypes(locationRes.data.data || []);

            const settingsData = settingsRes.data.data;

            setFeeRules(
                (settingsData.feeRules || []).map((fee) => ({
                    id: fee.id,
                    name: fee.name,
                    amount: fee.amount,
                    yearly: fee.yearly,
                    active: fee.active,

                    locationType: fee.locationType?.name || "-",
                    locationTypeId: fee.locationType?.id || null,

                    createdAt: new Date(fee.createdAt).toLocaleDateString()
                }))
            );

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setFormData({
            name: "",
            amount: "",
            yearly: true,
            locationType: "",
            locationTypeName: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.amount || !formData.locationType) return;

        try {
            const payload = {
                name: formData.name,
                amount: Number(formData.amount),
                yearly: formData.yearly,
                locationTypeId: formData.locationType
            };

            if (editingId) {
                await axios.put(
                    `${API_URL}/api/finance/fees/${editingId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    `${API_URL}/api/finance/fees`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            await loadData();
            resetForm();

        } catch (err) {
            console.error("Save fee failed:", err);
        }
    };

    const toggleFee = async (id) => {
        try {
            await axios.patch(
                `${API_URL}/api/finance/fees/${id}/toggle`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await loadData();

        } catch (err) {
            console.error("Toggle failed:", err);
        }
    };

    const editFee = (fee) => {
        setEditingId(fee.id);

        setFormData({
            name: fee.name,
            amount: fee.amount,
            yearly: fee.yearly,
            locationType: fee.locationTypeId || "",
            locationTypeName: fee.locationType || ""
        });
    };

    const filteredFees =
        selectedStatus === "All"
            ? feeRules
            : feeRules.filter((f) =>
                selectedStatus === "Active" ? f.active : !f.active
            );

    const countActive = feeRules.filter((f) => f.active).length;
    const countDisabled = feeRules.filter((f) => !f.active).length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Fee Configuration</h1>
                <p>Manage municipality fee rules based on location type</p>
            </div>

            <div className={styles.cards}>
                <div
                    className={`${styles.card} ${selectedStatus === "All" ? styles.activeCard : ""
                        }`}
                    onClick={() => setSelectedStatus("All")}
                >
                    <div className={styles.cardTitle}>All Rules</div>
                    <div className={styles.cardValue}>{feeRules.length}</div>
                    <div className={styles.cardSub}>
                        Total configured fees
                    </div>
                </div>

                <div
                    className={`${styles.card} ${selectedStatus === "Active" ? styles.activeCard : ""
                        }`}
                    onClick={() => setSelectedStatus("Active")}
                >
                    <div className={styles.cardTitle}>Active</div>
                    <div className={styles.cardValue}>{countActive}</div>
                    <div className={styles.cardSub}>Currently applied</div>
                </div>

                <div
                    className={`${styles.card} ${selectedStatus === "Disabled" ? styles.activeCard : ""
                        }`}
                    onClick={() => setSelectedStatus("Disabled")}
                >
                    <div className={styles.cardTitle}>Disabled</div>
                    <div className={styles.cardValue}>{countDisabled}</div>
                    <div className={styles.cardSub}>
                        Not currently used
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                    <h2>
                        {editingId ? "Edit Fee Rule" : "Create Fee Rule"}
                    </h2>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Fee Name</label>

                            <input
                                type="text"
                                placeholder="Enter fee name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Amount ($)</label>

                            <input
                                type="number"
                                placeholder="0"
                                value={formData.amount}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        amount: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Location Type</label>

                            <select
                                value={formData.locationType}
                                onChange={(e) => {
                                    const selectedId = e.target.value;

                                    setFormData({
                                        ...formData,
                                        locationType: selectedId,
                                        locationTypeName:
                                            locationTypes.find(
                                                (t) =>
                                                    String(t.LocT_ID) ===
                                                    String(selectedId)
                                            )?.LocT_Type || ""
                                    });
                                }}
                            >
                                <option value="">
                                    Select location type
                                </option>

                                {locationTypes.map((type) => (
                                    <option
                                        key={type.LocT_ID}
                                        value={type.LocT_ID}
                                    >
                                        {type.LocT_Type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Billing Frequency</label>

                            <select
                                value={formData.yearly ? "yearly" : "monthly"}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        yearly:
                                            e.target.value === "yearly"
                                    })
                                }
                            >
                                <option value="yearly">Yearly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="submit"
                            className={styles.greenBtn}
                        >
                            {editingId
                                ? "Save Changes"
                                : "Add Fee Rule"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className={styles.redBtn}
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    {selectedStatus} Fee Rules
                </h2>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Fee Name</th>
                                <th>Location Type</th>
                                <th>Amount</th>
                                <th>Frequency</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredFees.length > 0 ? (
                                filteredFees.map((fee) => (
                                    <tr key={fee.id}>
                                        <td>{fee.name}</td>
                                        <td>{fee.locationTypeName || fee.locationType}</td>
                                        <td>${fee.amount}</td>
                                        <td>{fee.yearly ? "Yearly" : "Monthly"}</td>
                                        <td>{fee.active ? "Active" : "Disabled"}</td>
                                        <td>{fee.createdAt}</td>
                                        <td className={styles.actionCell}>
                                            <div className={styles.actionGroup}>
                                                <button className={styles.warningBtn}
                                                    onClick={() =>editFee(fee)}>
                                                    Edit
                                                </button>

                                                <button className={fee.active ? styles.redBtn : styles.greenBtn }
                                                    onClick={() => toggleFee(fee.id)}>
                                                    {fee.active ? "Disable" : "Enable"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className={ styles.emptyState}>
                                        No fee rules found
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

export default FeeSettings;