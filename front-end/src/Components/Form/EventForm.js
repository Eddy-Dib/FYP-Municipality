import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EventForm.module.css";

function EventForm({ onClose, onSuccess, editData }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        details: "",
        entrance: 0
    });

    // ✅ PREFILL FOR EDIT
    useEffect(() => {
        if (editData) {
            const start = new Date(editData.StartDate);
            const end = new Date(editData.EndDate);

            setForm({
                name: editData.Name || "",
                startDate: start.toISOString().split("T")[0],
                startTime: start.toTimeString().slice(0, 5),
                endDate: end.toISOString().split("T")[0],
                endTime: end.toTimeString().slice(0, 5),
                details: editData.Details || "",
                entrance: editData.Entrance || 0
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.startDate || !form.startTime || !form.endDate || !form.endTime) {
            alert("Please fill all required fields");
            return;
        }

        const startDateTime = `${form.startDate}T${form.startTime}`;
        const endDateTime = `${form.endDate}T${form.endTime}`;

        if (endDateTime < startDateTime) {
            alert("End date/time cannot be before start");
            return;
        }

        const payload = {
            name: form.name,
            startDate: startDateTime,
            endDate: endDateTime,
            details: form.details,
            entrance: form.entrance
        };

        try {
            setLoading(true);

            if (editData) {
                await axios.put(
                    `${API_URL}/api/secretary/events/${editData.Event_ID}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    `${API_URL}/api/secretary/events`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            onSuccess?.();
            onClose?.();

        } catch (err) {
            console.error(err);
            alert("Failed to save event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <h2>{editData ? "Edit Event" : "Create Event"}</h2>

                <label>Event Name *</label>
                <input name="name" value={form.name} onChange={handleChange} />

                <label>Start Date *</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />

                <label>Start Time *</label>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />

                <label>End Date *</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />

                <label>End Time *</label>
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />

                <label>Details</label>
                <textarea name="details" value={form.details} onChange={handleChange} />

                <label>Entrance Fee</label>
                <input type="number" name="entrance" value={form.entrance} onChange={handleChange} />

                <div className={styles.actions}>

                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        className={styles.createBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : editData ? "Update" : "Create"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default EventForm;