import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ManageAnnouncements.module.css";
import AnnouncementForm from "../../Components/Form/AnnouncementsForm";
import SuccessToast from "../../Components/UI/SuccessToast";

function ManageAnnouncements() {

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editAnnouncement, setEditAnnouncement] = useState(null);

    const [cancelModal, setCancelModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [toast, setToast] = useState(false);

    // FETCH
    const fetchAnnouncements = async () => {
        try {

            setLoading(true);

            const res = await axios.get(
                `${API_URL}/api/secretary/announcements`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAnnouncements(res.data.data || []);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // CANCEL
    const handleCancel = async () => {
        try {

            await axios.patch(
                `${API_URL}/api/secretary/announcements/${selectedId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCancelModal(false);
            setSelectedId(null);

            await fetchAnnouncements();

            setToast(true);

        } catch (err) {
            console.error(err);
            alert("Failed to cancel announcement");
        }
    };

    // EDIT
    const handleEdit = (announcement) => {
        setEditAnnouncement(announcement);
        setShowModal(true);
    };

    // SPLIT ACTIVE / CANCELLED
    const activeAnnouncements = announcements.filter(
        a => Number(a.Active_Flag) === 1
    );

    const cancelledAnnouncements = announcements.filter(
        a => Number(a.Active_Flag) === 0
    );

    // CARD
    const renderCard = (ann, cancelled = false) => {
        return (
            <div key={ann.Anc_ID} className={styles.card}>

                <div className={styles.cardHeader}>

                    <div className={styles.cardTitle}>
                        {ann.Name}
                    </div>

                    <div
                        className={`${styles.badge} ${cancelled ? styles.cancelled : styles.active
                            }`}
                    >
                        {cancelled ? "cancelled" : "active"}
                    </div>

                </div>

                <div className={styles.cardSub}>
                    {ann.Details?.split("\n").map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </div>

                {/* ✅ CREATED DATE */}
                <div className={styles.date}>
                    {ann.Created_Date
                        ? new Date(ann.Created_Date).toLocaleString()
                        : "No date"}
                </div>

                {!cancelled && (
                    <div className={styles.actions}>

                        <button
                            className={styles.editBtn}
                            onClick={() => handleEdit(ann)}
                        >
                            Edit
                        </button>

                        <button
                            className={styles.deleteBtn}
                            onClick={() => {
                                setSelectedId(ann.Anc_ID);
                                setCancelModal(true);
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

            {/* HEADER */}
            <div className={styles.header}>

                <div className={styles.headerTop}>

                    <h1>Manage Announcements</h1>

                    <button
                        className={styles.blueBtn}
                        onClick={() => {
                            setEditAnnouncement(null);
                            setShowModal(true);
                        }}
                    >
                        + Add Announcement
                    </button>

                </div>

            </div>

            {/* CONTENT */}
            <div className={styles.section}>

                {loading ? (
                    <p>Loading...</p>

                ) : announcements.length === 0 ? (

                    <p className={styles.emptyState}>
                        No announcements found
                    </p>

                ) : (

                    <>
                        {/* ACTIVE */}
                        <h2>Active Announcements</h2>

                        <div className={styles.cards}>
                            {activeAnnouncements.map((ann) =>
                                renderCard(ann)
                            )}

                        </div>

                        {/* CANCELLED */}
                        <h2 style={{ marginTop: "30px" }}>
                            Cancelled Announcements
                        </h2>

                        <div className={styles.cards}>
                            {cancelledAnnouncements.map((ann) =>
                                renderCard(ann, true)
                            )}
                        </div>
                    </>

                )}

            </div>

            {/* FORM MODAL */}
            {showModal && (
                <AnnouncementForm
                    editData={editAnnouncement}
                    onClose={() => {
                        setShowModal(false);
                        setEditAnnouncement(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditAnnouncement(null);
                        fetchAnnouncements();
                    }}
                />
            )}

            {/* CANCEL MODAL */}
            {cancelModal && (
                <div className={styles.modalOverlay}>

                    <div className={styles.modalBox}>

                        <h2>Cancel Announcement</h2>

                        <p
                            style={{
                                marginTop: "10px",
                                color: "#475569"
                            }}
                        >
                            Are you sure you want to cancel this announcement?
                        </p>

                        <div className={styles.modalActions}>

                            <button
                                onClick={() => {
                                    setCancelModal(false);
                                    setSelectedId(null);
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

            {/* TOAST */}
            {toast && (
                <SuccessToast
                    message="Announcement cancelled successfully!"
                    onClose={() => setToast(false)}
                />
            )}

        </div>
    );
}

export default ManageAnnouncements;