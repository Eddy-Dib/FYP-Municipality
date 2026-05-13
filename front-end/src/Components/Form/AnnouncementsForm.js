import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AnnouncementsForm.module.css";

function AnnouncementForm({ editData, onClose, onSuccess }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [name, setName] = useState("");
    const [details, setDetails] = useState("");
    const [createdDate, setCreatedDate] = useState("");
    const [loading, setLoading] = useState(false);

    // fill form when editing
    useEffect(() => {
        if (editData) {
            setName(editData.Name || "");
            setDetails(editData.Details || "");

            if (editData.Created_Date) {
                const formatted = new Date(editData.Created_Date)
                    .toISOString()
                    .slice(0, 16); // yyyy-MM-ddTHH:mm

                setCreatedDate(formatted);
            } else {
                setCreatedDate("");
            }
        } else {
            setName("");
            setDetails("");
            setCreatedDate("");
        }
    }, [editData]);

    // convert datetime-local → MySQL format
    const formatDate = (value) => {
        if (!value) return null;
        return value.replace("T", " ") + ":00";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                name,
                details,
                createdDate: formatDate(createdDate)
            };

            if (editData) {
                // UPDATE
                await axios.put(
                    `${API_URL}/api/secretary/announcements/${editData.Anc_ID}`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            } else {
                // CREATE
                await axios.post(
                    `${API_URL}/api/secretary/announcements`,
                    payload,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }

            onSuccess();

        } catch (err) {
            console.error(err);
            alert("Failed to save announcement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <h2>
                    {editData ? "Edit Announcement" : "Add Announcement"}
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* TITLE */}
                    <label>Title</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter announcement title"
                        required
                    />

                    {/* DETAILS */}
                    <label>Details</label>
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Write announcement details..."
                        required
                    />

                    {/* DATE */}
                    <label>Date</label>
                    <input
                        type="datetime-local"
                        value={createdDate}
                        onChange={(e) => setCreatedDate(e.target.value)}
                        required
                    />

                    {/* BUTTONS */}
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="submit" disabled={loading}>
                            {loading
                                ? "Saving..."
                                : editData
                                    ? "Update"
                                    : "Create"
                            }
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default AnnouncementForm;