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

    // FETCH
    const fetchEvents = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${API_URL}/api/secretary/events`,
                {
                    headers: { Authorization: `Bearer ${token}` }
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

    // CANCEL
    const handleCancel = async () => {
        try {
            await axios.patch(
                `${API_URL}/api/secretary/events/${selectedEventId}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setDeleteModal(false);
            setSelectedEventId(null);

            await fetchEvents();
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

    // SPLIT
    const activeEvents = events.filter(e => Number(e.Active_Flag) === 1);
    const cancelledEvents = events.filter(e => Number(e.Active_Flag) === 0);

    // STATUS ENGINE (FIXED)
    const getStatusInfo = (ev) => {
        const now = new Date();
        const start = new Date(ev.StartDate);
        const end = new Date(ev.EndDate);

        let primary = "";

        if (Number(ev.Active_Flag) === 0) {
            primary = "cancelled";
        } else if (now < start) {
            primary = "upcoming";
        } else if (now > end) {
            primary = "past";
        } else {
            primary = "ongoing";
        }

        const tags = [];
        return { primary, tags };
    };

    // CARD
    const renderCard = (ev) => {
        const { primary, tags } = getStatusInfo(ev);

        return (
            <div key={ev.Event_ID} className={styles.card}>

                {/* HEADER */}
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{ev.Name}</div>

                    <div className={styles.badgeGroup}>

                        <div className={`${styles.badge} ${styles[primary]}`}>
                            {primary}
                        </div>


                    </div>
                </div>

                {/* INFO */}
                <div className={styles.cardSub}>
                    Start: {new Date(ev.StartDate).toLocaleString()}
                </div>

                <div className={styles.cardSub}>
                    End: {new Date(ev.EndDate).toLocaleString()}
                </div>

                <div className={styles.cardSub}>
                    {ev.Details?.split("\n").map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </div>

                <div className={styles.cardValue}>
                    {ev.Entrance === 0 ? "Free" : `$${ev.Entrance}`}
                </div>

                {/* ACTIONS */}
                {Number(ev.Active_Flag) === 1 && (
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
                )}

            </div>
        );
    };

    return (
        <div className={styles.page}>

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

            <div className={styles.section}>

                {loading ? (
                    <p>Loading...</p>
                ) : events.length === 0 ? (
                    <p className={styles.emptyState}>No events found</p>
                ) : (
                    <>
                        <h2>Active Events</h2>
                        <div className={styles.cards}>
                            {activeEvents.map(renderCard)}
                        </div>

                        <h2 style={{ marginTop: "30px" }}>Cancelled Events</h2>
                        <div className={styles.cards}>
                            {cancelledEvents.map(renderCard)}
                        </div>
                    </>
                )}

            </div>

            {/* MODAL */}
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

            {/* DELETE MODAL */}
            {deleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>

                        <h2>Cancel Event</h2>

                        <p style={{ marginTop: "10px", color: "#475569" }}>
                            Are you sure you want to cancel this event?
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                onClick={() => {
                                    setDeleteModal(false);
                                    setSelectedEventId(null);
                                }}
                            >
                                No
                            </button>

                            <button onClick={handleCancel}>
                                Yes, Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {toast && (
                <SuccessToast
                    message="Event updated successfully!"
                    onClose={() => setToast(false)}
                />
            )}

        </div>
    );
}

export default ManageEvents;