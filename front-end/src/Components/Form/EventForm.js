import { useState } from "react";
import axios from "axios";
import styles from "./EventForm.module.css";

function EventForm({ onClose, onSuccess }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        startDay: "",
        startTime: "",
        endDay: "",
        endTime: "",
        details: "",
        entrance: 0
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (
            !form.name ||
            !form.startDay ||
            !form.startTime ||
            !form.endDay ||
            !form.endTime
        ) {
            alert("Please fill all required fields");
            return;
        }

        const startDateTime = `${form.startDay}T${form.startTime}:00`;
        const endDateTime = `${form.endDay}T${form.endTime}:00`;

        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (end < start) {
            alert("End date/time cannot be before start date/time");
            return;
        }

        try {
            setLoading(true);

            await axios.post(
                `${API_URL}/api/secretary/events`,
                {
                    name: form.name,
                    startDate: startDateTime,
                    endDate: endDateTime,
                    details: form.details,
                    entrance: form.entrance
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (onSuccess) onSuccess();
            if (onClose) onClose();

            // optional: reset form after success
            setForm({
                name: "",
                startDay: "",
                startTime: "",
                endDay: "",
                endTime: "",
                details: "",
                entrance: 0
            });

        } catch (err) {
            console.error(err);
            alert("Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <h2>Create Event</h2>

                <label>Event Name *</label>
                <input
                    name="name"
                    placeholder="Enter event name"
                    value={form.name}
                    onChange={handleChange}
                />

                <label>Start Date *</label>
                <input
                    type="date"
                    name="startDay"
                    value={form.startDay}
                    onChange={handleChange}
                />

                <label>Start Time *</label>
                <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                />

                <label>End Date *</label>
                <input
                    type="date"
                    name="endDay"
                    value={form.endDay}
                    onChange={handleChange}
                />

                <label>End Time *</label>
                <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                />

                <label>Details</label>
                <textarea
                    name="details"
                    placeholder="Describe the event..."
                    value={form.details}
                    onChange={handleChange}
                />

                <label>Entrance Fee ($)</label>
                <input
                    type="number"
                    name="entrance"
                    placeholder="0 = Free event"
                    value={form.entrance}
                    onChange={handleChange}
                />

                <div className={styles.actions}>

                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className={styles.createBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default EventForm;