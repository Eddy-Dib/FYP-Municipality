import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ManageEvents.module.css";
import EventForm from "../../Components/Form/EventForm";
import SuccessToast from "../../Components/UI/SuccessToast";

function ManageEvents() {
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(false);

    const [editEvent, setEditEvent] = useState(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    // FETCH EVENTS
    const fetchEvents = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${API_URL}/api/secretary/events`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEvents(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // 🛑 CANCEL EVENT (SOFT DELETE)
    const handleCancel = async () => {
        try {
            await axios.patch(
                `${API_URL}/api/secretary/events/${selectedEventId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDeleteModal(false);
            setSelectedEventId(null);

            fetchEvents();
            setToast(true);

        } catch (err) {
            console.error(err);
            alert("Failed to cancel event");
        }
    };

    const handleEdit = (event) => {
        setEditEvent(event);
        setShowModal(true);
    };
    return (
        <div className={styles.page}>

            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.headerTop}>

                    <h1>Manage Events</h1>

                    <button
                        className={styles.blueBtn}
                        onClick={() => {
                            setEditEvent(null);
                            setShowModal(true);
                        }}
                    >
                        + Add Event
                    </button>

                </div>
            </div>

            {/* SECTION */}
            <div className={styles.section}>

                {loading ? (
                    <p>Loading...</p>

                ) : events.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b" }}>
                        No events found
                    </p>

                ) : (
                    <div className={styles.cards}>

                        {events.map(ev => {

                            const status = (() => {
                                const now = new Date();
                                const start = new Date(ev.StartDate);
                                const end = new Date(ev.EndDate);

                                if (now < start) return "upcoming";
                                if (now > end) return "past";
                                return "ongoing";
                            })();

                            return (
                                <div key={ev.Event_ID} className={styles.card}>

                                    <div className={styles.cardTitle}>
                                        {ev.Name}
                                    </div>

                                    <div className={`${styles.badge} ${styles[status]}`}>
                                        {status}
                                    </div>

                                    <div className={styles.cardSub}>
                                        Start: {new Date(ev.StartDate).toLocaleString()}
                                    </div>

                                    <div className={styles.cardSub}>
                                        End: {new Date(ev.EndDate).toLocaleString()}
                                    </div>

                                    <div className={styles.cardSub}>
                                        {ev.Details}
                                    </div>

                                    <div className={styles.cardValue}>
                                        {ev.Entrance === 0 ? "Free" : `$${ev.Entrance}`}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className={styles.actions}>

                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(ev)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => {
                                                setSelectedEventId(ev.Event_ID);
                                                setDeleteModal(true);
                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

            {/* EVENT FORM */}
            {showModal && (
                <EventForm
                    editData={editEvent}
                    onClose={() => {
                        setShowModal(false);
                        setEditEvent(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditEvent(null);
                        fetchEvents();
                    }}
                />
            )}

            {/* DELETE / CANCEL MODAL */}
            {deleteModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>

                        <h2>Cancel Event</h2>

                        <p style={{ marginTop: "10px", color: "#475569" }}>
                            Are you sure you want to cancel this event?
                        </p>

                        <div className={styles.actions}>

                            <button
                                className={styles.cancelBtn}
                                onClick={() => {
                                    setDeleteModal(false);
                                    setSelectedEventId(null);
                                }}
                            >
                                No
                            </button>

                            <button
                                className={styles.deleteBtn}
                                onClick={handleCancel}
                            >
                                Yes, Cancel
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast && (
                <SuccessToast
                    message="Operation successful!"
                    onClose={() => setToast(false)}
                />
            )}

        </div>
    );
}

export default ManageEvents;